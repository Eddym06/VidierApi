const ffmpeg = require('fluent-ffmpeg');
const EventEmitter = require('events');
const logger = require('../utils/logger');
const config = require('../config');

class FFmpegExecutor extends EventEmitter {
    constructor() {
        super();
        this.activeProcesses = new Map();
    }

    /**
     * Execute FFmpeg command
     */
    /**
     * Execute FFmpeg command
     */
    async execute(jobId, commandSpec, duration) {
        return new Promise((resolve, reject) => {
            logger.info(`Starting FFmpeg render for job ${jobId}`);

            const command = ffmpeg();
            let lastProgressUpdate = 0;
            let finalizationWatchdog = null;
            let silenceInterval = null;
            let settled = false;

            // Add inputs
            commandSpec.inputs.forEach(input => {
                if (input.options) {
                    command.input(input.path).inputOptions(input.options);
                } else {
                    command.input(input.path);
                }
            });

            // Add output options (includes filter_complex now)
            if (commandSpec.outputOptions) {
                command.outputOptions(commandSpec.outputOptions);
            }

            // Set output
            command.output(commandSpec.output);

            const cleanup = () => {
                if (settled) return;
                settled = true;
                if (finalizationWatchdog) clearTimeout(finalizationWatchdog);
                if (silenceInterval) clearInterval(silenceInterval);
                this.activeProcesses.delete(jobId);
            };

            // Progress tracking
            let progressStartTime = Date.now();
            let lastTimemarkSeconds = 0;
            
            command.on('progress', (progress) => {
                const percent = duration
                    ? Math.min((progress.timemark ? this.parseTimemark(progress.timemark) : 0) / duration * 100, 100)
                    : 0;

                // Calcular speed basado en tiempo real vs tiempo del video
                const currentTimemarkSeconds = progress.timemark ? this.parseTimemark(progress.timemark) : 0;
                const elapsedRealTime = (Date.now() - progressStartTime) / 1000; // segundos
                const speed = elapsedRealTime > 0 ? currentTimemarkSeconds / elapsedRealTime : 0;

                const now = Date.now();
                if (!lastProgressUpdate || (now - lastProgressUpdate > 1000) || percent >= 100) {
                    lastProgressUpdate = now;

                    this.emit('progress', {
                        jobId,
                        percent: Math.round(percent * 100) / 100,
                        fps: progress.currentFps || 0,
                        speed: speed,
                        timemark: progress.timemark || '00:00:00',
                    });

                    logger.debug(`Job ${jobId} progress: ${percent.toFixed(2)}%`);

                    // Finalization Watchdog (Force finish if stuck at >99%)
                    if (percent >= 99 && !finalizationWatchdog) {
                        logger.info(`Job ${jobId} reached ${percent}%. Starting finalization watchdog (10s).`);
                        finalizationWatchdog = setTimeout(() => {
                            if (!settled) {
                                logger.warn(`Job ${jobId} stalled at ${percent}% (Fluent). Forcing termination.`);
                                command.kill('SIGTERM');
                            }
                        }, 10000);
                    }
                }
            });

            // Error handling
            command.on('error', (err, stdout, stderr) => {
                // Check if it's a forced exit (SIGTERM/255) which we treat as success
                if (err.message.includes('SIGTERM') || err.message.includes('signal 15') || err.message.includes('code 255')) {
                    logger.warn(`FFmpeg process terminated (Watchdog/Silence). Treating as success.`);
                    cleanup();
                    resolve();
                    return;
                }

                logger.error(`FFmpeg error for job ${jobId}: ${err.message}`);
                cleanup();
                reject(new Error(`Render failed: ${err.message}`));
            });

            // Success
            command.on('end', () => {
                logger.info(`FFmpeg render completed for job ${jobId}`);
                cleanup();
                resolve();
            });

            // Start process
            command.run();
            this.activeProcesses.set(jobId, command);

            logger.info(`FFmpeg process started for job ${jobId}`);

            // Silence Detector
            silenceInterval = setInterval(() => {
                if (settled) {
                    clearInterval(silenceInterval);
                    return;
                }
                const now = Date.now();
                if (lastProgressUpdate && (now - lastProgressUpdate > 20000)) {
                    logger.warn(`Job ${jobId} stalled (20s silence). forcing termination.`);
                    command.kill('SIGTERM');
                }
            }, 5000);
        });
    }

    /**
     * Execute FFmpeg command directly (bypass fluent-ffmpeg for complex filters)
     */
    async executeDirectly(jobId, commandSpec, duration) {
        return new Promise((resolve, reject) => {
            logger.info(`Starting direct FFmpeg render for job ${jobId}`);

            const { spawn } = require('child_process');
            const args = [];

            // Add inputs
            commandSpec.inputs.forEach(input => {
                if (input.options) {
                    args.push(...input.options);
                }
                args.push('-i', input.path);
            });

            // Add output options
            if (commandSpec.outputOptions) {
                args.push(...commandSpec.outputOptions);
            }

            // Add output
            args.push(commandSpec.output);

            logger.info(`FFmpeg args: ${args.join(' ')}`);

            // Spawn FFmpeg process
            const ffmpegProcess = spawn('ffmpeg', args, {
                stdio: ['pipe', 'ignore', 'pipe'] // Ignore stdout to prevent buffer fill hang
            });

            let stderrData = '';
            let silenceInterval = null;
            let finalizationWatchdog = null;
            let lastProgressUpdate = 0;

            // Handle stderr (progress + errors)
            ffmpegProcess.stderr.on('data', (data) => {
                const text = data.toString();
                stderrData += text;

                // Parse progress
                const timeMatch = text.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
                if (timeMatch && duration) {
                    const hours = parseInt(timeMatch[1]);
                    const minutes = parseInt(timeMatch[2]);
                    const seconds = parseFloat(timeMatch[3]);
                    const currentTime = hours * 3600 + minutes * 60 + seconds;
                    const percent = Math.min((currentTime / duration) * 100, 100);

                    // Parse FPS and Speed from stderr
                    const fpsMatch = text.match(/fps=\s*(\d+\.?\d*)/);
                    const speedMatch = text.match(/speed=\s*(\d+\.?\d*)x/);
                    
                    const fps = fpsMatch ? parseFloat(fpsMatch[1]) : 0;
                    const speed = speedMatch ? parseFloat(speedMatch[1]) : 0;

                    // Throttle updates: max 1 per second, unless it's 100%
                    const now = Date.now();
                    if (!lastProgressUpdate || (now - lastProgressUpdate > 1000) || percent >= 100) {
                        lastProgressUpdate = now;
                        this.emit('progress', {
                            jobId,
                            percent: Math.round(percent * 100) / 100,
                            fps: fps,
                            speed: speed,
                            timemark: `${timeMatch[1]}:${timeMatch[2]}:${timeMatch[3]}`
                        });

                        // Finalization Watchdog: If we hit ~100% but process hangs, kill it after grace period
                        if (percent >= 99 && !finalizationWatchdog) {
                            logger.info(`Job ${jobId} reached ${percent}%. Starting finalization watchdog (10s).`);
                            finalizationWatchdog = setTimeout(() => {
                                if (!settled && this.activeProcesses.has(jobId)) {
                                    logger.warn(`Job ${jobId} stalled at ${percent}%. Forcing termination.`);
                                    ffmpegProcess.kill('SIGTERM');
                                }
                            }, 10000); // 10s grace
                        }
                    }
                }
            });

            // Handle process exit (exit or close)
            let settled = false;
            const handleExit = (code, signal) => {
                logger.debug(`[TRACE] HandleExit called for job ${jobId}. Code: ${code}, Signal: ${signal}, Settled: ${settled}`);
                logger.info(`FFmpeg process exited with code ${code}, signal ${signal} for job ${jobId}`);

                if (settled) {
                    logger.debug(`[TRACE] Job ${jobId} already settled. Ignoring.`);
                    return;
                }
                settled = true;
                if (this.finalizationWatchdog) {
                    clearTimeout(this.finalizationWatchdog);
                }
                clearInterval(silenceInterval);

                this.activeProcesses.delete(jobId);
                logger.debug(`[TRACE] Job ${jobId} removed from activeProcesses. Remaining: ${this.activeProcesses.size}`);

                if (code === 0) {
                    logger.info(`Direct FFmpeg render completed for job ${jobId}`);
                    logger.debug(`[TRACE] Resolving Promise for job ${jobId} (Success)`);
                    resolve();
                } else if ((code === null && signal === 'SIGTERM') || (code === 255)) {
                    // SIGTERM or 255 often means we killed it or it was interrupted. 
                    logger.warn(`FFmpeg process terminated (SIGTERM/255) for job ${jobId}. Assuming forced exit.`);
                    logger.debug(`[TRACE] Resolving Promise for job ${jobId} (Forced Exit)`);
                    resolve();
                } else {
                    logger.error(`Direct FFmpeg exit code ${code} for job ${jobId}`);
                    // Only reject if we have legit error data, otherwise it might be a silent exit
                    const errMsg = stderrData ? stderrData.slice(-500) : 'Unknown error';
                    logger.debug(`[TRACE] Rejecting Promise for job ${jobId} (Error: ${errMsg})`);
                    reject(new Error(`FFmpeg exited with code ${code}: ${errMsg}`));
                }

            };

            ffmpegProcess.on('close', handleExit);
            ffmpegProcess.on('exit', handleExit);

            // Handle errors
            ffmpegProcess.on('error', (err) => {
                this.activeProcesses.delete(jobId);
                reject(new Error(`FFmpeg process error: ${err.message}`));
            });

            // Close stdin to allow FFmpeg to finish
            if (ffmpegProcess.stdin) {
                ffmpegProcess.stdin.end();
            }

            this.activeProcesses.set(jobId, ffmpegProcess);

            // Silence Detector: If no progress for 20s, assume hang/stall and kill
            silenceInterval = setInterval(() => {
                if (settled) {
                    clearInterval(silenceInterval);
                    return;
                }
                const now = Date.now();
                // Only check if we have started receiving progress
                if (lastProgressUpdate && (now - lastProgressUpdate > 20000)) {
                    logger.warn(`Job ${jobId} stalled (20s silence). forcing termination.`);
                    ffmpegProcess.kill('SIGTERM');
                }
            }, 5000);

            // Safety timeout: If duration is known, kill process shortly after it should have finished
            // to prevent zombies.
            if (duration) {
                const timeoutMs = (duration * 1000) + 15000; // Duration + 15s grace
                setTimeout(() => {
                    if (!settled && this.activeProcesses.has(jobId)) {
                        logger.warn(`Job ${jobId} timed out in executor (${duration}s + 15s). Killing process.`);
                        ffmpegProcess.kill('SIGTERM');
                    }
                }, timeoutMs);
            }
        });
    }

    /**
     * Cancel a running job
     */
    cancel(jobId) {
        const command = this.activeProcesses.get(jobId);
        if (command) {
            logger.info(`Cancelling job ${jobId}`);
            command.kill('SIGKILL');
            this.activeProcesses.delete(jobId);
            return true;
        }
        return false;
    }

    /**
     * Parse FFmpeg timemark (HH:MM:SS.ms) to seconds
     */
    parseTimemark(timemark) {
        const parts = timemark.split(':');
        if (parts.length === 3) {
            const hours = parseFloat(parts[0]);
            const minutes = parseFloat(parts[1]);
            const seconds = parseFloat(parts[2]);
            return hours * 3600 + minutes * 60 + seconds;
        }
        return 0;
    }

    /**
     * Get active job count
     */
    getActiveJobCount() {
        return this.activeProcesses.size;
    }
}

module.exports = new FFmpegExecutor();
