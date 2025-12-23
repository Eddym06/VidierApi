const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');
const logger = require('./utils/logger');
const fileUtils = require('./utils/fileUtils');
const assetManager = require('./renderer/assetManager');
const apiRoutes = require('./api/routes');
const { initWorker, updateJobStatus } = require('./api/jobQueue');
const swaggerUi = require('swagger-ui-express');
const openApiSpec = require('./api/openapi.config');
const swaggerUiOptions = require('./api/swagger.config');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: config.security.allowedOrigins,
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors({
    origin: config.security.allowedOrigins,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Swagger UI (FastAPI style)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, swaggerUiOptions));

// API Documentation (lightweight)
app.get('/api/docs', (req, res) => {
    res.sendFile(path.join(config.paths.public, 'api-docs.html'));
});

// API routes
app.use('/api', apiRoutes);

// Serve examples
app.use('/examples', express.static(path.join(__dirname, '../examples')));

// Serve static files
app.use(express.static(config.paths.public));

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(config.paths.public, 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found',
    });
});

// Error handler
app.use((err, req, res, next) => {
    logger.error(`Server error: ${err.message}`, { stack: err.stack });
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: config.nodeEnv === 'development' ? err.message : undefined,
    });
});

// WebSocket connection
io.on('connection', (socket) => {
    logger.info(`WebSocket client connected: ${socket.id}`);

    socket.on('subscribe', (jobId) => {
        logger.info(`Client ${socket.id} subscribed to job ${jobId}`);
        socket.join(`job:${jobId}`);
    });

    socket.on('disconnect', () => {
        logger.info(`WebSocket client disconnected: ${socket.id}`);
    });
});

// Initialize worker with progress callback
const progressCallback = (jobId, progressData) => {
    // Emit progress via WebSocket
    io.to(`job:${jobId}`).emit('progress', {
        jobId,
        ...progressData,
    });
};

const worker = initWorker(progressCallback);

// Ensure directories exist
async function initializeDirectories() {
    await fileUtils.ensureDir(config.paths.temp);
    await fileUtils.ensureDir(config.paths.output);
    await fileUtils.ensureDir(config.paths.logs);
    logger.info('Directories initialized');
}

// Initialize AssetManager
async function initializeAssetManager() {
    await assetManager.init();
}

// Cleanup old files periodically
function scheduleCleanup() {
    const intervalHours = config.jobs.cleanupAfterHours;
    const intervalMs = intervalHours * 60 * 60 * 1000;

    setInterval(async () => {
        logger.info('Running scheduled cleanup');
        await fileUtils.cleanOldFiles(config.paths.temp, intervalHours);
        await fileUtils.cleanOldFiles(config.paths.output, intervalHours);
    }, intervalMs);

    logger.info(`Scheduled cleanup every ${intervalHours} hours`);
}

// Start server
async function start() {
    try {
        await initializeDirectories();
        await initializeAssetManager();
        scheduleCleanup();

        server.listen(config.port, () => {
            logger.info('='.repeat(60));
            logger.info(`🎬 VidierApi Server Started`);
            logger.info('='.repeat(60));
            logger.info(`Environment: ${config.nodeEnv}`);
            logger.info(`Port: ${config.port}`);
            logger.info(`URL: http://localhost:${config.port}`);
            logger.info(`API: http://localhost:${config.port}/api`);
            logger.info(`📚 API Docs: http://localhost:${config.port}/api/docs`);
            logger.info(`Health: http://localhost:${config.port}/api/health`);
            logger.info('='.repeat(60));
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await worker.close();
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully');
    await worker.close();
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

// Start the application
start();
