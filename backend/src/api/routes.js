const express = require('express');
const path = require('path');
const fs = require('fs');
const { deepMerge } = require('../utils/common');
const logger = require('../utils/logger');
const fileUtils = require('../utils/fileUtils');
const config = require('../config');
const { validateVideoSpec } = require('./validator');
const { addRenderJob, getJobStatus, cancelJob } = require('./jobQueue');

const router = express.Router();

/**
 * POST /api/render
 * Submit a new render job
 */

router.post('/render', async (req, res) => {
    try {
        let spec = req.body;

        // Apply Template if specified
        if (spec.template) {
            const templateName = spec.template.replace(/[^a-zA-Z0-9_-]/g, ''); // Sanitize
            const templatePath = path.join(__dirname, `../templates/${templateName}.json`);

            if (fs.existsSync(templatePath)) {
                logger.info(`Applying template: ${templateName}`);
                const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
                // Merge: Template is base, Spec is override
                spec = deepMerge(templateData, spec);
            } else {
                return res.status(400).json({
                    success: false,
                    error: `Template '${templateName}' not found`
                });
            }
        }

        // Validate specification (post-merge)
        const validation = validateVideoSpec(spec);

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: 'Invalid specification',
                details: validation.errors,
            });
        }

        // Add job to queue
        const jobId = await addRenderJob(validation.data);

        logger.info(`Render job created: ${jobId}`);

        res.json({
            success: true,
            jobId,
            message: 'Render job queued successfully',
        });

    } catch (error) {
        logger.error(`Render job creation failed: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Failed to create render job',
            message: error.message,
        });
    }
});

/**
 * GET /api/templates
 * List available templates
 */
router.get('/templates', (req, res) => {
    try {
        const templatesDir = path.join(__dirname, '../templates');
        if (!fs.existsSync(templatesDir)) {
            return res.json({ success: true, templates: [] });
        }

        const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));
        const templates = files.map(f => {
            try {
                const data = JSON.parse(fs.readFileSync(path.join(templatesDir, f), 'utf8'));
                return {
                    id: f.replace('.json', ''),
                    description: data.description || 'No description',
                    config: data.config
                };
            } catch (e) {
                return null;
            }
        }).filter(t => t !== null);

        res.json({ success: true, templates });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/status/:jobId
 * Get job status
 */
router.get('/status/:jobId', (req, res) => {
    try {
        const { jobId } = req.params;
        const status = getJobStatus(jobId);

        if (!status) {
            return res.status(404).json({
                success: false,
                error: 'Job not found',
            });
        }

        res.json({
            success: true,
            job: status,
        });

    } catch (error) {
        logger.error(`Get status failed: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Failed to get job status',
            message: error.message,
        });
    }
});

/**
 * GET /api/download/:jobId
 * Download rendered video
 */
router.get('/download/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const status = getJobStatus(jobId);

        if (!status) {
            return res.status(404).json({
                success: false,
                error: 'Job not found',
            });
        }

        if (status.status !== 'completed') {
            return res.status(400).json({
                success: false,
                error: 'Video not ready',
                status: status.status,
            });
        }

        const videoPath = path.join(config.paths.output, `${jobId}.mp4`);
        const exists = await fileUtils.fileExists(videoPath);

        if (!exists) {
            return res.status(404).json({
                success: false,
                error: 'Video file not found',
            });
        }

        logger.info(`Downloading video for job ${jobId}`);
        
        // Check if job has a custom filename stored in metadata (if we had a DB)
        // Since we don't have a persistent DB for job metadata easily accessible here without querying Redis/Queue,
        // we will allow a query parameter 'filename' to override the download name.
        const filename = req.query.filename ? 
            (req.query.filename.endsWith('.mp4') ? req.query.filename : `${req.query.filename}.mp4`) 
            : `vidierapi_${jobId}.mp4`;

        res.download(videoPath, filename);

    } catch (error) {
        logger.error(`Download failed: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Download failed',
            message: error.message,
        });
    }
});

/**
 * DELETE /api/cancel/:jobId
 * Cancel a job
 */
router.delete('/cancel/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const cancelled = await cancelJob(jobId);

        if (cancelled) {
            logger.info(`Job cancelled: ${jobId}`);
            res.json({
                success: true,
                message: 'Job cancelled successfully',
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Failed to cancel job',
            });
        }

    } catch (error) {
        logger.error(`Cancel failed: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Cancel failed',
            message: error.message,
        });
    }
});

/**
 * GET /api/health
 * Health check
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});

/**
 * GET /api/schema
 * Get API schema
 */
router.get('/schema', (req, res) => {
    res.json({
        success: true,
        schema: {
            // ... existing schema ...
        }
    });
});

// Legacy docs endpoint removed


// ... existing code ...

/**
 * GET /api/docs
 * Serve API documentation
 */
router.get('/docs', (req, res) => {
    try {
        const docsPath = path.join(__dirname, '../../API_GUIDE.md');
        if (fs.existsSync(docsPath)) {
            const content = fs.readFileSync(docsPath, 'utf8');
            res.json({ success: true, content });
        } else {
            res.status(404).json({ success: false, error: 'Documentation not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ... existing code ...

/**
 * POST /api/validate
 * Validate video specification without rendering
 */
router.post('/validate', (req, res) => {
    try {
        const spec = req.body;
        const validation = validateVideoSpec(spec);

        if (validation.valid) {
            res.json({ success: true, message: 'Configuration is valid' });
        } else {
            res.json({
                success: false,
                error: 'Invalid configuration',
                details: validation.errors
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/examples
 * List available examples
 */
router.get('/examples', (req, res) => {
    try {
        const examplesDir = path.join(__dirname, '../../examples');
        if (!fs.existsSync(examplesDir)) {
            return res.json({ success: true, examples: [] });
        }

        const examplesMapping = [
            { title: "1. Vídeo básico (imagen única + audio)", file: "ex1_basic.json" },
            { title: "2. Superposiciones de texto ✍️", file: "ex2_text.json" },
            { title: "3. Marca (marca de agua/logotipo) 💧", file: "ex3_watermark.json" },
            { title: "4. Presentaciones de diapositivas (varias imágenes) 🎞️", file: "ex4_slideshow.json" },
            { title: "5. El Combo \"Profesional\" 🌟", file: "ex5_pro.json" },
            { title: "⚡ n8n: HTTP Polling Workflow", file: "n8n-workflow-http-polling.json" },
            { title: "⚡ n8n: Custom Node Workflow", file: "n8n-workflow-custom-node.json" }
        ];

        const examples = examplesMapping.map(ex => {
            try {
                const filePath = path.join(examplesDir, ex.file);
                if (fs.existsSync(filePath)) {
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    return {
                        name: ex.title,
                        content: content
                    };
                }
                return null;
            } catch (e) {
                return null;
            }
        }).filter(e => e !== null);

        res.json({ success: true, examples });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/share/:jobId
 * Generate a temporary public URL for a completed video
 */
router.post('/share/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const status = getJobStatus(jobId);

        if (!status) {
            return res.status(404).json({
                success: false,
                error: 'Job not found',
            });
        }

        if (status.status !== 'completed') {
            return res.status(400).json({
                success: false,
                error: 'Video not ready',
                status: status.status,
            });
        }

        const videoPath = path.join(config.paths.output, `${jobId}.mp4`);
        const exists = await fileUtils.fileExists(videoPath);

        if (!exists) {
            return res.status(404).json({
                success: false,
                error: 'Video file not found',
            });
        }

        // Generate public URL (just use the download endpoint)
        const publicUrl = `${req.protocol}://${req.get('host')}/api/download/${jobId}`;

        logger.info(`Generated public URL for job ${jobId}`);
        res.json({
            success: true,
            url: publicUrl,
            expiresAt: null, // Permanent link (until cleanup runs)
            jobId: jobId,
        });

    } catch (error) {
        logger.error(`Share failed: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Failed to generate public URL',
            message: error.message,
        });
    }
});

module.exports = router;
