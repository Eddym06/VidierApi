const path = require('path');
const logger = require('../utils/logger');
const config = require('../config');

class CommandBuilder {
    /**
     * Build FFmpeg command from job specification
     */
    async buildCommand(spec, assetPaths, outputPath) {
        logger.info('Building FFmpeg command');

        const { config: videoConfig } = spec;

        // Default configuration
        const width = videoConfig?.width || 1920;
        const height = videoConfig?.height || 1080;
        const fps = videoConfig?.fps || 30;
        const preset = videoConfig?.preset || config.ffmpeg.preset;
        const crf = videoConfig?.crf || config.ffmpeg.crf;

        // 1. Normalize Timeline (Clips/Images/Single)
        let timelineItems = [];
        let timelinePaths = [];

        if (spec.clips && spec.clips.length > 0) {
            timelineItems = spec.clips.map(c => ({ ...c, type: c.type || 'image' }));
            timelinePaths = assetPaths.clips;
        } else if (spec.images && spec.images.length > 0) {
            timelineItems = spec.images.map(c => ({ ...c, type: 'image' }));
            timelinePaths = assetPaths.images;
        } else if (spec.image) {
            timelineItems = [{ ...spec.image, type: 'image' }];
            timelinePaths = assetPaths.images; // Fixed: image is stored in images array
        }

        // 2. Build Inputs
        const commandInputs = [];
        timelinePaths.forEach((p, i) => {
            const item = timelineItems[i];
            if (item.type === 'image') {
                commandInputs.push({ path: p, options: ['-loop', '1'] });
            } else {
                // Video input
                commandInputs.push({ path: p });
            }
        });

        const audioIndex = commandInputs.length;
        if (assetPaths.audio) commandInputs.push({ path: assetPaths.audio });

        if (assetPaths.watermark) {
            commandInputs.push({ path: assetPaths.watermark });
        }

        // 3. Build Timeline Filters
        const filters = [];
        const isMultiClip = timelineItems.length > 1;

        if (isMultiClip) {
            // TIMELINE / SLIDESHOW LOGIC
            const transition = spec.transition || { type: 'fade', duration: 0.5 };
            const transDur = transition.duration;
            let offset = 0;
            let prevStream = '[v0]';

            timelineItems.forEach((item, i) => {
                const duration = item.duration || 5;

                // Base filter: Scale, Pad, FPS
                let filter = `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,` +
                    `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black,` +
                    `setsar=1,fps=${fps}`;

                // Trim logic
                if (item.type === 'video') {
                    const start = item.start || 0;
                    // Trim video segment
                    filter += `,trim=start=${start}:duration=${start + duration},setpts=PTS-STARTPTS`;
                } else {
                    // Image trim (duration only)
                    filter += `,trim=duration=${duration},setpts=PTS-STARTPTS`;
                }

                filters.push(`${filter}[v${i}]`);

                if (i > 0) {
                    const nextStream = i === timelineItems.length - 1 ? '[v_base]' : `[f${i}]`;
                    filters.push(
                        `${prevStream}[v${i}]xfade=transition=${transition.type}:duration=${transDur}:offset=${offset}${nextStream}`
                    );
                    prevStream = nextStream;

                    const prevDur = timelineItems[i - 1].duration || 5;
                    offset += prevDur - transDur;
                }
            });
        } else {
            // SINGLE ITEM LOGIC
            const item = timelineItems[0];

            // Base filter
            let filter = `[0:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,` +
                `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black,` +
                `setsar=1,fps=${fps}`;

            if (item.type === 'video') {
                const start = item.start || 0;
                const duration = item.duration; // Optional for single video?
                if (duration) {
                    filter += `,trim=start=${start}:duration=${start + duration},setpts=PTS-STARTPTS`;
                } else {
                    if (start > 0) filter += `,trim=start=${start},setpts=PTS-STARTPTS`;
                    // If no duration, full video (after start)
                }
                filters.push(`${filter}[v_base]`);
            } else {
                // Image - Ken Burns optional
                filters.push(`${filter}[img]`);

                const shouldApplyEffect = item.effect === 'kenburns' || (item.zoom && item.zoom > 1 && item.effect !== 'none');
                // Use explicit duration if provided, otherwise audio duration, otherwise default 10
                const duration = item.duration || assetPaths.audioDuration || 10;

                if (shouldApplyEffect) {
                    const zoomFactor = item.zoom || 1.2;
                    const frames = Math.ceil(duration * fps);
                    filters.push(
                        `[img]zoompan=z='min(zoom+0.001,${zoomFactor})':d=${frames}:s=${width}x${height}:fps=${fps}[v_base]`
                    );
                } else {
                    // Critical fix: Trim infinite loop input
                    filters.push(`[img]trim=duration=${duration},setpts=PTS-STARTPTS[v_base]`);
                }
            }
        }

        let currentStream = 'v_base';

        // 4. Color Grading
        if (spec.colorGrading) {
            const cg = spec.colorGrading;
            const colorFilters = [];

            if (cg.filter === 'bw') colorFilters.push('hue=s=0');
            else if (cg.filter === 'sepia') colorFilters.push('colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131');
            else if (cg.filter === 'high-contrast') colorFilters.push('eq=contrast=1.5');
            else if (cg.filter === 'vintage') colorFilters.push('eq=contrast=0.9:saturation=0.5:gamma=1.2');

            // Manual adjustments
            const b = cg.brightness || 0;
            const c = cg.contrast || 1;
            const s = cg.saturation || 1;
            if (b !== 0 || c !== 1 || s !== 1) {
                colorFilters.push(`eq=brightness=${b}:contrast=${c}:saturation=${s}`);
            }

            if (colorFilters.length > 0) {
                filters.push(`[${currentStream}]${colorFilters.join(',')}[v_graded]`);
                currentStream = 'v_graded';
            }
        }

        // 5. Text Overlay
        let textFile = null;
        if (spec.text) {
            // Use image duration if available (single image mode), otherwise audio duration
            const imageDuration = (spec.image && spec.image.duration) ? spec.image.duration : null;
            const duration = imageDuration || assetPaths.audioDuration || 10;
            
            const firstImage = (timelinePaths && timelinePaths.length > 0) ? timelinePaths[0] : assetPaths.image; // fallback
            const tempDir = path ? path.dirname(firstImage) : config.paths.temp; // Safe logic

            const textResult = this.buildTextFilter(spec.text, width, height, duration, tempDir);
            if (textResult) {
                filters.push(`[${currentStream}]${textResult.filter}[v_text]`);
                textFile = textResult.textFile; // Store for cleanup
                currentStream = 'v_text';
            }
        }

        // 6. Subtitles
        if (spec.subtitles && assetPaths.subtitles) {
            const subPath = assetPaths.subtitles;
            let styleOpts = '';
            if (spec.subtitles.style) {
                styleOpts = `:force_style='${spec.subtitles.style}'`;
            }
            filters.push(`[${currentStream}]subtitles='${subPath}'${styleOpts}[v_subs]`);
            currentStream = 'v_subs';
        }

        // 7. Watermark
        if (spec.watermark && assetPaths.watermark) {
            const wm = spec.watermark;
            const opacity = wm.opacity ?? 1.0;
            const scale = wm.scale ?? 0.15;
            const margin = wm.margin ?? 20;

            const wmIndex = commandInputs.findIndex(i => i.path === assetPaths.watermark);

            // 1. Process watermark
            filters.push(
                `[${wmIndex}:v]scale=iw*${scale}:-1,format=rgba,colorchannelmixer=aa=${opacity}[wm]`
            );

            // 2. Position
            let x, y;
            if (typeof wm.position === 'object') {
                x = wm.position.x;
                y = wm.position.y;
            } else {
                switch (wm.position) {
                    case 'top-left': x = margin; y = margin; break;
                    case 'top-right': x = `main_w-overlay_w-${margin}`; y = margin; break;
                    case 'bottom-left': x = margin; y = `main_h-overlay_h-${margin}`; break;
                    case 'center': x = `(main_w-overlay_w)/2`; y = `(main_h-overlay_h)/2`; break;
                    case 'bottom-right':
                    default:
                        x = `main_w-overlay_w-${margin}`;
                        y = `main_h-overlay_h-${margin}`;
                        break;
                }
            }

            // 3. Overlay
            filters.push(`[${currentStream}][wm]overlay=${x}:${y}[v]`);
            currentStream = 'v';
        } else {
            // No watermark - use v_base directly, no passthrough filter needed
            // currentStream stays as 'v_base'
        }

        // Audio Filters (from Asset Audio only)
        // Note: Video inputs audio is currently ignored (not mapped)
        let audioMap = '';
        if (assetPaths.audio) {
            audioMap = `${audioIndex}:a`;
            // Reuse existing audio filter logic
            const audioFilters = [];
            const audio = spec.audio || {};

            if (audio.volume && audio.volume !== 1.0) {
                audioFilters.push(`volume=${audio.volume}`);
            }
            if (audio.fadeIn && audio.fadeIn > 0) {
                audioFilters.push(`afade=t=in:st=0:d=${audio.fadeIn}`);
            }
            if (audio.fadeOut && audio.fadeOut > 0) {
                const dur = assetPaths.audioDuration;
                if (dur && dur > audio.fadeOut) {
                    const start = dur - audio.fadeOut;
                    audioFilters.push(`afade=t=out:st=${start}:d=${audio.fadeOut}`);
                }
            }

            if (audioFilters.length > 0) {
                filters.push(`[${audioIndex}:a]${audioFilters.join(',')}[a_out]`);
                audioMap = '[a_out]';
            }
        }

        // Build command object
        const filterString = filters.join(';');

        const outputOptions = [
            '-filter_complex', filterString,
            '-map', `[${currentStream}]`,
            '-c:v', 'libx264',
            '-preset', preset,
            '-crf', String(crf),
            '-shortest',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
        ];

        if (audioMap) {
            outputOptions.push('-map', audioMap);
            outputOptions.push('-c:a', 'aac');
            outputOptions.push('-b:a', '192k');
        }

        const command = {
            inputs: commandInputs,
            outputOptions,
            output: outputPath,
        };

        logger.info('Command built successfully');
        return command;
    }

    /**
     * Build text overlay filter for FFmpeg drawtext using textfile
     */
    buildTextFilter(textSpec, width, height, duration, tempDir) {
        if (!textSpec || !textSpec.content) {
            return null;
        }

        const {
            content,
            position = 'center',
            fontSize = 48,
            color = '#FFFFFF',
            fontFamily = 'Arial',
            backgroundColor,
            borderColor,
            borderWidth = 0
        } = textSpec;

        const fs = require('fs');
        const path = require('path');
        const textFilePath = path.join(tempDir, `text_${Date.now()}.txt`);
        fs.writeFileSync(textFilePath, content, 'utf8');

        const hexToFFmpegColor = (hex) => {
            const cleaned = hex.replace('#', '');
            if (cleaned.length === 6) {
                return `0x${cleaned}`;
            } else if (cleaned.length === 8) {
                const rr = cleaned.substr(0, 2);
                const gg = cleaned.substr(2, 2);
                const bb = cleaned.substr(4, 2);
                const aa = cleaned.substr(6, 2);
                return `0x${aa}${bb}${gg}${rr}`;
            }
            return '0xFFFFFF';
        };

        let x, y;
        if (typeof position === 'string') {
            switch (position) {
                case 'top': x = '(w-text_w)/2'; y = '50'; break;
                case 'center': x = '(w-text_w)/2'; y = '(h-text_h)/2'; break;
                case 'bottom': x = '(w-text_w)/2'; y = 'h-text_h-50'; break;
                case 'top-left': x = '50'; y = '50'; break;
                case 'top-right': x = 'w-text_w-50'; y = '50'; break;
                case 'bottom-left': x = '50'; y = 'h-text_h-50'; break;
                case 'bottom-right': x = 'w-text_w-50'; y = 'h-text_h-50'; break;
                default: x = '(w-text_w)/2'; y = '(h-text_h)/2';
            }
        } else {
            x = position.x;
            y = position.y;
        }

        const params = [
            `textfile=${textFilePath}`,
            `fontsize=${fontSize}`,
            `fontcolor=${hexToFFmpegColor(color)}`,
            `x=${x}`,
            `y=${y}`,
            `fontfile=/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf`
        ];

        if (backgroundColor) {
            params.push(`box=1`);
            params.push(`boxcolor=${hexToFFmpegColor(backgroundColor)}`);
            params.push(`boxborderw=10`);
        }

        if (borderColor && borderWidth > 0) {
            params.push(`borderw=${borderWidth}`);
            params.push(`bordercolor=${hexToFFmpegColor(borderColor)}`);
        }

        return {
            filter: `drawtext=${params.join(':')}`,
            textFile: textFilePath
        };
    }
}

module.exports = new CommandBuilder();
