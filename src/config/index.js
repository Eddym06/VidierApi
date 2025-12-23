require('dotenv').config();
const path = require('path');

module.exports = {
  // Server
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  
  // Paths
  paths: {
    temp: path.resolve(process.env.TEMP_DIR || './temp'),
    output: path.resolve(process.env.OUTPUT_DIR || './output'),
    logs: path.resolve(process.env.LOG_DIR || './logs'),
    public: path.resolve(__dirname, '../../public'),
  },
  
  // FFmpeg
  ffmpeg: {
    threads: parseInt(process.env.FFMPEG_THREADS || '4', 10),
    preset: process.env.FFMPEG_PRESET || 'medium',
    crf: parseInt(process.env.FFMPEG_CRF || '23', 10),
  },
  
  // Jobs
  jobs: {
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT_JOBS || '3', 10),
    timeout: parseInt(process.env.JOB_TIMEOUT_MS || '600000', 10),
    cleanupAfterHours: parseInt(process.env.CLEANUP_AFTER_HOURS || '24', 10),
  },
  
  // Security
  security: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '500', 10) * 1024 * 1024,
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3002').split(','),
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
