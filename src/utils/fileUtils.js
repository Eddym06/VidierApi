const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

/**
 * Ensure directory exists, create if not
 */
async function ensureDir(dirPath) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
        return true;
    } catch (error) {
        logger.error(`Failed to create directory ${dirPath}:`, error);
        return false;
    }
}

/**
 * Delete file safely
 */
async function deleteFile(filePath) {
    try {
        await fs.unlink(filePath);
        logger.debug(`Deleted file: ${filePath}`);
        return true;
    } catch (error) {
        if (error.code !== 'ENOENT') {
            logger.error(`Failed to delete file ${filePath}:`, error);
        }
        return false;
    }
}

/**
 * Delete directory recursively
 */
async function deleteDir(dirPath) {
    try {
        await fs.rm(dirPath, { recursive: true, force: true });
        logger.debug(`Deleted directory: ${dirPath}`);
        return true;
    } catch (error) {
        logger.error(`Failed to delete directory ${dirPath}:`, error);
        return false;
    }
}

/**
 * Get file size in bytes
 */
async function getFileSize(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return stats.size;
    } catch (error) {
        logger.error(`Failed to get file size for ${filePath}:`, error);
        return 0;
    }
}

/**
 * Check if file exists
 */
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Generate unique filename
 */
function generateFilename(extension = '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${random}${extension}`;
}

/**
 * Get file extension from URL or filename
 */
function getExtension(urlOrFilename) {
    const parsed = path.parse(urlOrFilename.split('?')[0]);
    return parsed.ext.toLowerCase();
}

/**
 * Clean old files from directory (older than hours)
 */
async function cleanOldFiles(dirPath, olderThanHours) {
    try {
        const files = await fs.readdir(dirPath);
        const now = Date.now();
        const maxAge = olderThanHours * 60 * 60 * 1000;

        let deletedCount = 0;
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);

            if (now - stats.mtimeMs > maxAge) {
                await deleteFile(filePath);
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            logger.info(`Cleaned ${deletedCount} old files from ${dirPath}`);
        }

        return deletedCount;
    } catch (error) {
        logger.error(`Failed to clean old files from ${dirPath}:`, error);
        return 0;
    }
}

module.exports = {
    ensureDir,
    deleteFile,
    deleteDir,
    getFileSize,
    fileExists,
    generateFilename,
    getExtension,
    cleanOldFiles,
};
