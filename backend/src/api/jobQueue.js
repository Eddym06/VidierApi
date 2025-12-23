const { Queue, Worker } = require('bullmq');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');
const assetManager = require('../renderer/assetManager');
const commandBuilder = require('../renderer/commandBuilder');
const executor = require('../renderer/executor');
const fileUtils = require('../utils/fileUtils');

// Redis connection
const connection = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
};

// Create queue
const renderQueue = new Queue('video-render', { connection });

// Job status storage (in-memory for simplicity, use Redis for production)
const jobStatus = new Map();

/**
 * Add a render job to the queue
 */
async function addRenderJob(spec, priority = 0) {
    const jobId = uuidv4();

    logger.info(`Adding render job ${jobId} to queue`);

    // Add job to queue
    await renderQueue.add(
        'render',
        { jobId, spec },
        {
            jobId,
            priority,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
            removeOnComplete: {
                age: config.jobs.cleanupAfterHours * 3600, // Keep completed jobs for X hours
            },
            removeOnFail: {
                age: config.jobs.cleanupAfterHours * 3600,
            },
        }
    );

    // Initialize job status
    jobStatus.set(jobId, {
        id: jobId,
        status: 'queued',
        progress: 0,
        fps: 0,
        speed: 0,
        timemark: '00:00:00',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        error: null,
        outputUrl: null,
    });

    return jobId;
}

/**
 * Get job status
 */
function getJobStatus(jobId) {
    return jobStatus.get(jobId) || null;
}

/**
 * Update job status
 */
function updateJobStatus(jobId, updates) {
    const current = jobStatus.get(jobId) || {};
    const updated = {
        ...current,
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    jobStatus.set(jobId, updated);
    return updated;
}

/**
 * Cancel a job
 */
async function cancelJob(jobId) {
    logger.info(`Cancelling job ${jobId}`);

    // Try to cancel FFmpeg process
    executor.cancel(jobId);

    // Update status
    updateJobStatus(jobId, {
        status: 'cancelled',
        error: 'Job cancelled by user',
    });

    // Remove from queue
    const job = await renderQueue.getJob(jobId);
    if (job) {
        await job.remove();
    }

    return true;
}

/**
 * Initialize worker
 */
function initWorker(progressCallback) {
    logger.info('Initializing render worker');

    const worker = new Worker(
        'video-render',
        async (job) => {
            const { jobId, spec } = job.data;

            logger.info(`Processing job ${jobId}`);
            updateJobStatus(jobId, { status: 'processing', progress: 0 });

            let tempFiles = [];

            try {
                // Download/prepare assets
                await job.updateProgress(5);
                updateJobStatus(jobId, { progress: 5 });

                logger.info(`Downloading assets for job ${jobId}`);

                // Handle clips (mixed) or images (legacy)
                let clipPaths = [];
                let imagePaths = [];

                if (spec.clips && spec.clips.length > 0) {
                    logger.info(`Downloading ${spec.clips.length} clips`);
                    for (const clip of spec.clips) {
                        const type = clip.type || 'image';
                        const p = await assetManager.getAsset(clip.src, type);
                        clipPaths.push(p);
                    }
                    tempFiles.push(...clipPaths);
                } else if (spec.images && spec.images.length > 0) {
                    logger.info(`Downloading ${spec.images.length} images for slideshow`);
                    for (const img of spec.images) {
                        const p = await assetManager.getAsset(img.src, 'image');
                        imagePaths.push(p);
                    }
                    tempFiles.push(...imagePaths);
                } else if (spec.image) {
                    const p = await assetManager.getAsset(spec.image.src, 'image');
                    imagePaths.push(p);
                } else {
                    throw new Error('No media specified (clips, images, or image)');
                }

                const audioPath = await assetManager.getAsset(spec.audio.src, 'audio');
                tempFiles.push(audioPath);

                // Download watermark if specified
                let watermarkPath = null;
                if (spec.watermark) {
                    logger.info(`Downloading watermark for job ${jobId}`);
                    watermarkPath = await assetManager.getAsset(spec.watermark.src, 'image');
                    tempFiles.push(watermarkPath);
                }

                // Download subtitles if specified
                let subtitlesPath = null;
                if (spec.subtitles) {
                    logger.info(`Downloading subtitles for job ${jobId}`);
                    subtitlesPath = await assetManager.getAsset(spec.subtitles.src, 'text');
                    // Ensure .srt
                    if (!subtitlesPath.toLowerCase().endsWith('.srt')) {
                        const fs = require('fs');
                        const newPath = subtitlesPath + '.srt';
                        fs.renameSync(subtitlesPath, newPath);
                        subtitlesPath = newPath;
                    }
                    tempFiles.push(subtitlesPath);
                }

                await job.updateProgress(20);
                updateJobStatus(jobId, { progress: 20 });

                // Get audio duration
                const audioDuration = await assetManager.getAudioDuration(audioPath);
                logger.info(`Audio duration: ${audioDuration}s`);

                // Calculate TOTAL render duration for progress tracking
                let totalDuration = audioDuration;

                if (spec.clips && Array.isArray(spec.clips)) {
                    // Sum of all clips duration
                    const clipsDuration = spec.clips.reduce((sum, clip) => {
                        return sum + (clip.duration || 5); // Default 5s
                    }, 0);
                    // Use max if looping? Or strictly clips?
                    // Usually clips dictate length in NLE mode.
                    totalDuration = clipsDuration;
                } else if (spec.images && spec.images.length > 0) {
                    // Images array (slideshow)
                    totalDuration = spec.images.length * (spec.duration || 5);
                }

                logger.info(`Total render duration estimated: ${totalDuration}s`);

                // Build FFmpeg command
                const outputPath = path.join(config.paths.output, `${jobId}.mp4`);
                const assetPaths = {
                    clips: clipPaths,
                    images: imagePaths, // Back compat
                    audio: audioPath,
                    audioDuration: totalDuration, // Pass TOTAL duration to builder/executor
                    watermark: watermarkPath,
                    subtitles: subtitlesPath
                };

                const command = await commandBuilder.buildCommand(spec, assetPaths, outputPath);

                await job.updateProgress(25);
                updateJobStatus(jobId, { progress: 25 });

                // Listen to FFmpeg progress
                const progressHandler = async (progressData) => {
                    const overallProgress = 25 + (progressData.percent * 0.7); // 25-95%
                    try {
                        await job.updateProgress(overallProgress);
                    } catch (err) {
                        // Ignore missing key errors - preventing worker crash
                        if (!err.message.includes('Missing key')) {
                            logger.error(`Failed to update progress for job ${jobId}: ${err.message}`);
                        }
                    }
                    // Actualizar el estado con las métricas
                    updateJobStatus(jobId, { 
                        progress: overallProgress,
                        fps: progressData.fps || 0,
                        speed: progressData.speed || 0,
                        timemark: progressData.timemark || '00:00:00'
                    });

                    if (progressCallback) {
                        progressCallback(jobId, progressData);
                    }
                };

                executor.on('progress', progressHandler);

                // Execute render - use direct execution for text/watermark/subs/color or slideshows/clips
                const isComplex = spec.text || spec.watermark || spec.subtitles || spec.colorGrading || (spec.clips && spec.clips.length > 0) || (spec.images && spec.images.length > 1);

                if (isComplex) {
                    logger.info(`Using direct FFmpeg execution for complex filters`);
                    await executor.executeDirectly(jobId, command, audioDuration);
                } else {
                    await executor.execute(jobId, command, audioDuration);
                }

                executor.off('progress', progressHandler);

                await job.updateProgress(95);
                updateJobStatus(jobId, { progress: 95 });

                // Clean up temp files
                logger.info(`Cleaning up temp files for job ${jobId}`);
                logger.debug(`[TRACE] Start cleanup for job ${jobId}. Files to remove: ${tempFiles.length}`);
                try {
                    // Cleanup with timeout to prevent hangs
                    const cleanupPromise = assetManager.cleanup(tempFiles);
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Cleanup timed out')), 3000)
                    );

                    await Promise.race([cleanupPromise, timeoutPromise]);
                    logger.info(`Cleanup finished for job ${jobId}`);
                    logger.debug(`[TRACE] Cleanup COMPLETED for job ${jobId}`);
                } catch (cleanupErr) {
                    logger.error(`Cleanup failed for job ${jobId} (non-fatal): ${cleanupErr.message}`);
                }

                logger.debug(`[TRACE] Updating job ${jobId} to progress 100`);
                try {
                    await job.updateProgress(100);
                    logger.info(`Updated progress to 100 for job ${jobId}`);
                } catch (err) {
                    logger.warn(`Could not update BullMQ progress to 100 for ${jobId} (likely missing key): ${err.message}`);
                }

                updateJobStatus(jobId, {
                    status: 'completed',
                    progress: 100,
                    outputUrl: `/api/download/${jobId}`,
                    // Mantener las últimas métricas disponibles
                    fps: jobStatus.get(jobId)?.fps || 0,
                    speed: jobStatus.get(jobId)?.speed || 0,
                    timemark: jobStatus.get(jobId)?.timemark || '00:00:00'
                });

                logger.info(`Job ${jobId} completed successfully`);

                return { success: true, outputPath };

            } catch (error) {
                logger.error(`Job ${jobId} failed: ${error.message}`);

                // Clean up temp files
                await assetManager.cleanup(tempFiles);

                updateJobStatus(jobId, {
                    status: 'failed',
                    error: error.message,
                });

                throw error;
            }
        },
        {
            connection,
            concurrency: config.jobs.maxConcurrent,
            lockDuration: 600000, // 10 minutes - prevents stalling on long renders
            lockRenewTime: 30000,  // Renew lock every 30 seconds
            limiter: {
                max: config.jobs.maxConcurrent,
                duration: 1000,
            },
        }
    );

    worker.on('completed', (job) => {
        logger.info(`Worker completed job ${job.id}`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`Worker failed job ${job?.id}: ${err.message}`);
    });

    return worker;
}

module.exports = {
    renderQueue,
    addRenderJob,
    getJobStatus,
    updateJobStatus,
    cancelJob,
    initWorker,
};
