const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const mime = require('mime-types');
const sharp = require('sharp');
const mm = require('music-metadata');
const logger = require('../utils/logger');
const fileUtils = require('../utils/fileUtils');
const config = require('../config');

class AssetManager {
    constructor() {
        this.tempDir = config.paths.temp;
    }

    /**
     * Initialize temp directory
     */
    async init() {
        await fileUtils.ensureDir(this.tempDir);
        logger.info('AssetManager initialized');
    }

    /**
     * Download or process asset (URL, base64, or local file)
     */
    async getAsset(input, type = 'image') {
        try {
            // Check if it's a URL
            if (input.startsWith('http://') || input.startsWith('https://')) {
                return await this.downloadAsset(input, type);
            }

            // Check if it's base64
            if (input.startsWith('data:')) {
                return await this.decodeBase64Asset(input, type);
            }

            // Assume it's a local file path
            const exists = await fileUtils.fileExists(input);
            if (exists) {
                return input;
            }

            throw new Error(`Asset not found or invalid: ${input}`);
        } catch (error) {
            logger.error(`Failed to get asset: ${error.message}`);
            throw error;
        }
    }

    /**
     * Download asset from URL
     */
    async downloadAsset(url, type) {
        logger.info(`Downloading ${type} from: ${url}`);

        try {
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                timeout: 30000,
                maxContentLength: config.security.maxFileSize,
                headers: {
                    'User-Agent': 'VidierApi/1.0',
                },
            });

            // Detect file type from Content-Type header
            const buffer = Buffer.from(response.data);
            const contentType = response.headers['content-type'] || '';
            const extension = mime.extension(contentType) || this.guessExtensionFromUrl(url);

            if (!extension) {
                throw new Error('Could not detect file type');
            }

            // Validate file type
            this.validateFileType(extension, type);

            // Save to temp file
            const filename = fileUtils.generateFilename(`.${extension}`);
            const filePath = path.join(this.tempDir, filename);

            await fs.writeFile(filePath, buffer);
            logger.info(`Downloaded ${type} to: ${filePath}`);

            return filePath;
        } catch (error) {
            logger.error(`Failed to download asset from ${url}: ${error.message}`);
            throw new Error(`Download failed: ${error.message}`);
        }
    }

    /**
     * Decode base64 asset
     */
    async decodeBase64Asset(dataUri, type) {
        logger.info(`Decoding base64 ${type}`);

        try {
            // Parse data URI
            const matches = dataUri.match(/^data:([^;]+);base64,(.+)$/);
            if (!matches) {
                throw new Error('Invalid base64 data URI');
            }

            const mimeType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');

            // Get extension from MIME type
            const extension = mime.extension(mimeType);
            if (!extension) {
                throw new Error('Could not detect file type from base64');
            }

            // Validate file type
            this.validateFileType(extension, type);

            // Save to temp file
            const filename = fileUtils.generateFilename(`.${extension}`);
            const filePath = path.join(this.tempDir, filename);

            await fs.writeFile(filePath, buffer);
            logger.info(`Decoded base64 ${type} to: ${filePath}`);

            return filePath;
        } catch (error) {
            logger.error(`Failed to decode base64 asset: ${error.message}`);
            throw new Error(`Base64 decode failed: ${error.message}`);
        }
    }

    /**
   * Guess extension from URL
   */
    guessExtensionFromUrl(url) {
        try {
            const urlPath = new URL(url).pathname;
            const ext = path.extname(urlPath).toLowerCase().substring(1);
            return ext || null;
        } catch {
            return null;
        }
    }

    /**
     * Validate file type matches expected type
     */
    validateFileType(extension, expectedType) {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const audioExtensions = ['mp3', 'mpga', 'wav', 'aac', 'm4a', 'ogg', 'flac', 'mpeg'];
        const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

        let validExtensions = [];
        if (expectedType === 'image') {
            validExtensions = imageExtensions;
        } else if (expectedType === 'audio') {
            validExtensions = audioExtensions;
        } else if (expectedType === 'video') {
            validExtensions = videoExtensions;
        }

        if (!validExtensions.includes(extension)) {
            throw new Error(
                `Invalid file type: ${extension}. Expected ${expectedType} (${validExtensions.join(', ')})`
            );
        }
    }

    /**
   * Get image dimensions
   */
    async getImageDimensions(imagePath) {
        try {
            const metadata = await sharp(imagePath).metadata();
            return {
                width: metadata.width,
                height: metadata.height,
            };
        } catch (error) {
            logger.error(`Failed to get image dimensions: ${error.message}`);
            return { width: 0, height: 0 };
        }
    }

    /**
     * Get audio duration in seconds
     */
    async getAudioDuration(audioPath) {
        try {
            const metadata = await mm.parseFile(audioPath);
            return metadata.format.duration || 0;
        } catch (error) {
            logger.error(`Failed to get audio duration: ${error.message}`);
            return 0;
        }
    }

    /**
     * Clean up temporary files for a job
     */
    async cleanup(files) {
        if (!Array.isArray(files)) {
            files = [files];
        }

        for (const file of files) {
            if (file && file.startsWith(this.tempDir)) {
                await fileUtils.deleteFile(file);
            }
        }
    }
}

module.exports = new AssetManager();
