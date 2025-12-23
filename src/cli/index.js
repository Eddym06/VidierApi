#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const boxen = require('boxen');
const cliProgress = require('cli-progress');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Configuration
const API_URL = process.env.VIDIERAPI_API_URL || 'http://localhost:3002';

// CLI Header
function showHeader() {
    console.log(
        boxen(
            chalk.bold.cyan('VidierApi') + chalk.white(' - Professional Video Generation\n') +
            chalk.gray('Create videos from JSON specifications'),
            {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'cyan',
            }
        )
    );
}

// Interactive mode
async function interactiveMode() {
    showHeader();

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'imageSrc',
            message: 'Image URL or path:',
            validate: input => input.length > 0 || 'Image source is required',
        },
        {
            type: 'input',
            name: 'audioSrc',
            message: 'Audio URL or path:',
            validate: input => input.length > 0 || 'Audio source is required',
        },
        {
            type: 'list',
            name: 'effect',
            message: 'Visual effect:',
            choices: ['none', 'kenburns', 'zoom'],
            default: 'kenburns',
        },
        {
            type: 'number',
            name: 'zoom',
            message: 'Zoom factor (1.0-3.0):',
            default: 1.3,
            when: answers => answers.effect !== 'none',
        },
        {
            type: 'number',
            name: 'volume',
            message: 'Audio volume (0.0-2.0):',
            default: 1.0,
        },
        {
            type: 'list',
            name: 'resolution',
            message: 'Video resolution:',
            choices: [
                { name: '1920x1080 (Full HD)', value: { width: 1920, height: 1080 } },
                { name: '1280x720 (HD)', value: { width: 1280, height: 720 } },
                { name: '3840x2160 (4K)', value: { width: 3840, height: 2160 } },
            ],
            default: 0,
        },
    ]);

    const spec = {
        image: {
            src: answers.imageSrc,
            effect: answers.effect,
            zoom: answers.zoom || 1.2,
        },
        audio: {
            src: answers.audioSrc,
            volume: answers.volume,
        },
        config: {
            width: answers.resolution.width,
            height: answers.resolution.height,
            fps: 30,
        },
    };

    await renderVideo(spec);
}

// File mode
async function fileMode(inputFile, outputFile) {
    showHeader();

    const spinner = ora('Reading specification file...').start();

    try {
        const content = await fs.readFile(inputFile, 'utf-8');
        const spec = JSON.parse(content);

        spinner.succeed('Specification loaded');

        await renderVideo(spec, outputFile);
    } catch (error) {
        spinner.fail(`Failed to read file: ${error.message}`);
        process.exit(1);
    }
}

// Render video
async function renderVideo(spec, outputFile) {
    try {
        // Submit job
        const submitSpinner = ora('Submitting render job...').start();

        const response = await axios.post(`${API_URL}/api/render`, spec);
        const { jobId } = response.data;

        submitSpinner.succeed(`Job created: ${chalk.cyan(jobId)}`);

        // Progress bar
        const progressBar = new cliProgress.SingleBar({
            format: 'Rendering |' + chalk.cyan('{bar}') + '| {percentage}% | {eta_formatted} remaining',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true,
        });

        progressBar.start(100, 0);

        // Poll status
        let completed = false;
        while (!completed) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const statusResponse = await axios.get(`${API_URL}/api/status/${jobId}`);
            const job = statusResponse.data.job;

            progressBar.update(Math.round(job.progress));

            if (job.status === 'completed') {
                progressBar.update(100);
                progressBar.stop();
                completed = true;

                // Download video
                const downloadSpinner = ora('Downloading video...').start();

                const filename = outputFile || `vidierapi_${jobId}.mp4`;
                const videoResponse = await axios.get(`${API_URL}/api/download/${jobId}`, {
                    responseType: 'arraybuffer',
                });

                await fs.writeFile(filename, videoResponse.data);

                downloadSpinner.succeed(`Video saved: ${chalk.green(filename)}`);

                console.log(
                    boxen(
                        chalk.green.bold('✓ Render Complete!') + '\n\n' +
                        chalk.white('Your video is ready!'),
                        {
                            padding: 1,
                            margin: 1,
                            borderStyle: 'round',
                            borderColor: 'green',
                        }
                    )
                );

            } else if (job.status === 'failed') {
                progressBar.stop();
                throw new Error(job.error || 'Render failed');
            }
        }

    } catch (error) {
        console.log(chalk.red(`\n✗ Error: ${error.message}`));
        process.exit(1);
    }
}

// Show example
function showExample() {
    const example = {
        image: {
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
            effect: 'kenburns',
            zoom: 1.3,
        },
        audio: {
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            volume: 0.8,
        },
        config: {
            width: 1920,
            height: 1080,
            fps: 30,
        },
    };

    console.log(chalk.cyan.bold('\nExample JSON Specification:\n'));
    console.log(JSON.stringify(example, null, 2));
    console.log(chalk.gray('\nSave this to a file and use: vidierapi --input example.json\n'));
}

// CLI setup
const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('input', {
        alias: 'i',
        type: 'string',
        description: 'Input JSON file',
    })
    .option('output', {
        alias: 'o',
        type: 'string',
        description: 'Output video filename',
    })
    .option('example', {
        alias: 'e',
        type: 'boolean',
        description: 'Show example JSON',
    })
    .option('api', {
        type: 'string',
        description: 'API URL',
        default: API_URL,
    })
    .help('h')
    .alias('h', 'help')
    .argv;

// Main
async function main() {
    if (argv.api) {
        process.env.VIDIERAPI_API_URL = argv.api;
    }

    if (argv.example) {
        showExample();
    } else if (argv.input) {
        await fileMode(argv.input, argv.output);
    } else {
        await interactiveMode();
    }
}

main().catch(error => {
    console.error(chalk.red(`Fatal error: ${error.message}`));
    process.exit(1);
});
