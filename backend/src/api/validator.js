const Joi = require('joi');

/**
 * Schema for basic image + audio video
 */
const imageSchema = Joi.object({
    src: Joi.string().required()
        .description('Image URL, base64 data URI, or file path'),
    effect: Joi.string().valid('none', 'kenburns', 'zoom').default('none')
        .description('Visual effect to apply to image'),
    zoom: Joi.number().min(1.0).max(3.0).default(1.2)
        .description('Zoom factor for Ken Burns effect'),
    duration: Joi.number().min(0.5).max(3600).allow(null).optional()
        .description('Duration in seconds for this image (overrides audio duration)'),
});

const imageWithDurationSchema = imageSchema.keys({
    duration: Joi.number().min(0.5).max(60).default(5)
        .description('Duration in seconds for this image')
});

const clipSchema = Joi.object({
    type: Joi.string().valid('image', 'video').default('image').description('Media type'),
    src: Joi.string().required().description('URL, base64, or file path'),
    duration: Joi.number().min(0.1).max(3600).description('Duration in seconds (image only or trim length)'),
    start: Joi.number().min(0).default(0).description('Start time for video trimming'),
    effect: Joi.string().valid('none', 'kenburns').default('none'),
    zoom: Joi.number().default(1.2)
});

/**
 * Schema for basic image + audio video
 */
const basicVideoSchema = Joi.object({
    image: imageSchema,

    images: Joi.array().items(imageWithDurationSchema)
        .description('Array of images for slideshow'),

    clips: Joi.array().items(clipSchema).min(1)
        .description('Array of mixed media clips (video/image)'),

    transition: Joi.object({
        type: Joi.string().valid('fade', 'wipeleft', 'wiperight', 'slideleft', 'slideright', 'circlecrop').default('fade'),
        duration: Joi.number().min(0.1).max(2.0).default(0.5)
            .description('Transition duration in seconds')
    }).default(),

    audio: Joi.object({
        src: Joi.string().required()
            .description('Audio URL, base64 data URI, or file path'),
        volume: Joi.number().min(0.0).max(2.0).default(1.0)
            .description('Audio volume multiplier'),
        fadeIn: Joi.number().min(0).max(10).default(0)
            .description('Fade in duration in seconds'),
        fadeOut: Joi.number().min(0).max(10).default(0)
            .description('Fade out duration in seconds'),
    }).optional(),

    text: Joi.object({
        content: Joi.string().required()
            .description('Text content to display'),
        position: Joi.alternatives().try(
            Joi.string().valid('top', 'center', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'),
            Joi.object({
                x: Joi.number().required().description('X coordinate in pixels'),
                y: Joi.number().required().description('Y coordinate in pixels')
            })
        ).default('center')
            .description('Text position on screen'),
        fontSize: Joi.number().min(12).max(200).default(48)
            .description('Font size in points'),
        color: Joi.string().pattern(/^#[0-9A-F]{6,8}$/i).default('#FFFFFF')
            .description('Text color in hex format (#RRGGBB or #RRGGBBAA)'),
        fontFamily: Joi.string().default('Arial')
            .description('Font family name'),
        backgroundColor: Joi.string().pattern(/^#[0-9A-F]{6,8}$/i).optional()
            .description('Background box color (optional)'),
        borderColor: Joi.string().pattern(/^#[0-9A-F]{6,8}$/i).optional()
            .description('Text border/outline color (optional)'),
        borderWidth: Joi.number().min(0).max(10).default(0)
            .description('Border width in pixels'),
        animation: Joi.string().valid('none', 'fade-in', 'fade-out', 'slide-left', 'slide-right').default('none')
            .description('Text animation type'),
        duration: Joi.alternatives().try(
            Joi.number().positive(),
            Joi.string().valid('full')
        ).default('full')
            .description('Duration to show text (seconds or "full" for entire video)'),
        startTime: Joi.number().min(0).default(0)
            .description('When to start showing text (seconds from start)')
    }).optional(),

    watermark: Joi.object({
        src: Joi.string().required()
            .description('Watermark image URL, base64 data URI, or file path'),
        position: Joi.alternatives().try(
            Joi.string().valid('top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'),
            Joi.object({
                x: Joi.number().required().description('X coordinate in pixels'),
                y: Joi.number().required().description('Y coordinate in pixels')
            })
        ).default('bottom-right')
            .description('Watermark position on screen'),
        opacity: Joi.number().min(0.0).max(1.0).default(1.0)
            .description('Watermark opacity (0.0 to 1.0)'),
        scale: Joi.number().min(0.05).max(1.0).default(0.15)
            .description('Scale factor relative to video output width (0.0 to 1.0)'),
        margin: Joi.number().min(0).max(500).default(20)
            .description('Margin from edges in pixels'),
    }).optional(),

    subtitles: Joi.object({
        src: Joi.string().required().description('SRT file URL or raw content'),
        style: Joi.string().optional().description('FFmpeg subtitles filter force_style string'),
    }).optional(),

    colorGrading: Joi.object({
        filter: Joi.string().valid('none', 'bw', 'sepia', 'vintage', 'high-contrast').default('none'),
        brightness: Joi.number().min(-1.0).max(1.0).default(0).description('Brightness adjustment (-1.0 to 1.0)'),
        contrast: Joi.number().min(-2.0).max(2.0).default(1.0).description('Contrast adjustment (1.0 is neutral)'),
        saturation: Joi.number().min(0.0).max(3.0).default(1.0).description('Saturation adjustment (1.0 is neutral, 0 is grayscale)')
    }).optional(),

    config: Joi.object({
        width: Joi.number().integer().min(128).max(7680).default(1920)
            .description('Video width in pixels'),
        height: Joi.number().integer().min(128).max(4320).default(1080)
            .description('Video height in pixels'),
        fps: Joi.number().integer().min(15).max(60).default(30)
            .description('Frames per second'),
        format: Joi.string().valid('16:9', '9:16', '1:1', '4:5', 'horizontal', 'vertical', 'square', 'portrait', 'youtube', 'tiktok', 'instagram', 'shorts', 'reel', 'story', 'post').optional()
            .description('Aspect ratio preset (e.g., "9:16", "tiktok"). Overrides width/height defaults.'),
        preset: Joi.string().valid('ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow').default('medium')
            .description('FFmpeg encoding preset'),
        crf: Joi.number().integer().min(0).max(51).default(23)
            .description('Constant Rate Factor (quality: lower = better)'),
    }).default(),
}).or('image', 'images', 'clips').options({ stripUnknown: true });

/**
 * Validate video specification
 */
function validateVideoSpec(data) {
    // Pre-process: Resolve format/aspectRatio shortcuts
    if (data.config && data.config.format) {
        const fmt = data.config.format.toLowerCase();
        let w = 1920, h = 1080;

        switch (fmt) {
            case '9:16':
            case 'vertical':
            case 'tiktok':
            case 'shorts':
            case 'reel':
            case 'story':
                w = 1080; h = 1920;
                break;
            case '1:1':
            case 'square':
            case 'instagram':
                w = 1080; h = 1080;
                break;
            case '4:5':
            case 'portrait':
            case 'post':
                w = 1080; h = 1350;
                break;
            case '16:9':
            case 'horizontal':
            case 'youtube':
            default:
                w = 1920; h = 1080;
                break;
        }

        // Only override if not explicitly provided
        if (!data.config.width) data.config.width = w;
        if (!data.config.height) data.config.height = h;
    }

    const { error, value } = basicVideoSchema.validate(data, {
        abortEarly: false,
        allowUnknown: false,
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));

        return {
            valid: false,
            errors,
            data: null,
        };
    }

    return {
        valid: true,
        errors: [],
        data: value,
    };
}

module.exports = {
    validateVideoSpec,
    basicVideoSchema,
};
