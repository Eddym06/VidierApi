import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodePropertyOptions,
	NodeOperationError,
	IBinaryData,
} from 'n8n-workflow';

export class VidierApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'VidierApi',
		name: 'vidierApi',
		icon: 'file:vidierapi_gemini.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate professional videos programmatically',
		defaults: {
			name: 'VidierApi',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'vidierApiApi',
				required: true,
			},
		],
		properties: [
			// Operation selector
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create Video',
						value: 'createVideo',
						description: 'Start a new video render job',
						action: 'Create a video render job',
					},
					{
						name: 'Create Video Complete',
						value: 'createVideoComplete',
						description: 'Create video and wait for completion (with auto-polling)',
						action: 'Create video and wait for completion',
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Check the status of a render job',
						action: 'Get render job status',
					},
					{
						name: 'Download Video',
						value: 'downloadVideo',
						description: 'Download a completed video',
						action: 'Download completed video',
					},
					{
						name: 'Cancel Job',
						value: 'cancelJob',
						description: 'Cancel a running render job',
						action: 'Cancel render job',
					},
					{
						name: 'List Templates',
						value: 'listTemplates',
						description: 'Get available video templates',
						action: 'List available templates',
					},
					{
						name: 'Get Examples',
						value: 'getExamples',
						description: 'Get example video specifications',
						action: 'Get example specifications',
					},
				],
				default: 'createVideo',
			},

			// ===== CREATE VIDEO FIELDS =====
			{
				displayName: 'Configuration Mode',
				name: 'configMode',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
					},
				},
				options: [
					{
						name: 'Simple (Form)',
						value: 'simple',
						description: 'Use a simple form to configure your video',
					},
					{
						name: 'Advanced (JSON)',
						value: 'advanced',
						description: 'Provide raw JSON specification',
					},
					{
						name: 'From Template',
						value: 'template',
						description: 'Start from a predefined template',
					},
				],
				default: 'simple',
				description: 'How to configure the video specification',
			},

			// Simple Mode Fields
			{
				displayName: 'Output Filename',
				name: 'fileName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createVideoComplete', 'downloadVideo'],
						configMode: ['simple'],
					},
				},
				default: '',
				placeholder: 'my_video.mp4',
				description: 'Name for the output file (optional)',
			},

			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						operation: ['createVideoComplete', 'downloadVideo'],
						returnFormat: ['binary', 'both'],
					},
				},
				description: 'Name of the binary property to write the data to',
			},

			{
				displayName: 'Video Format',
				name: 'videoFormat',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['simple'],
					},
				},
				options: [
					{
						name: 'YouTube (16:9) - 1920x1080',
						value: '16:9',
					},
					{
						name: 'TikTok/Reels (9:16) - 1080x1920',
						value: '9:16',
					},
					{
						name: 'Instagram Square (1:1) - 1080x1080',
						value: '1:1',
					},
					{
						name: 'Instagram Portrait (4:5) - 1080x1350',
						value: '4:5',
					},
					{
						name: 'Custom',
						value: 'custom',
					},
				],
				default: '16:9',
				description: 'Video aspect ratio and resolution',
			},

			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['simple'],
						videoFormat: ['custom'],
					},
				},
				default: 1920,
				description: 'Video width in pixels',
			},

			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['simple'],
						videoFormat: ['custom'],
					},
				},
				default: 1080,
				description: 'Video height in pixels',
			},

			{
				displayName: 'FPS',
				name: 'fps',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['simple'],
					},
				},
				default: 30,
				description: 'Frames per second',
			},

			{
				displayName: 'Image URL',
				name: 'imageUrl',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['simple'],
					},
				},
				default: '',
				placeholder: 'https://example.com/image.jpg',
				description: 'URL of the image to use',
				required: true,
			},

			{
				displayName: 'Duration (seconds)',
				name: 'imageDuration',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['simple'],
					},
				},
				default: 10,
				description: 'How long to show the image',
			},

			{
				displayName: 'Ken Burns Effect',
				name: 'kenBurns',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['simple'],
					},
				},
				default: false,
				description: 'Whether to apply Ken Burns (zoom/pan) effect',
			},

			{
				displayName: 'Audio URL',
				name: 'audioUrl',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['simple'],
					},
				},
				default: '',
				placeholder: 'https://example.com/audio.mp3',
				description: 'URL of the audio file (optional)',
			},

			{
				displayName: 'Audio Volume',
				name: 'audioVolume',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['simple'],
					},
				},
				default: 0.8,
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					numberStepSize: 0.1,
				},
				description: 'Audio volume (0 to 1)',
			},

			{
				displayName: 'Text Overlay',
				name: 'textOverlay',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['simple'],
					},
				},
				default: '',
				placeholder: 'Your text here',
				description: 'Optional text to display on video',
			},

			{
				displayName: 'Text Position',
				name: 'textPosition',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['simple'],
					},
				},
				options: [
					{ name: 'Top', value: 'top' },
					{ name: 'Center', value: 'center' },
					{ name: 'Bottom', value: 'bottom' },
				],
				default: 'bottom',
				description: 'Where to position the text',
			},

			// Template Mode
			{
				displayName: 'Template',
				name: 'template',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['template'],
					},
				},
				typeOptions: {
					loadOptionsMethod: 'getTemplates',
				},
				default: '',
				description: 'Select a template to use',
			},

			{
				displayName: 'Template Overrides (JSON)',
				name: 'templateOverrides',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['template'],
					},
				},
				default: '{}',
				description: 'Override template values (optional)',
			},

			// Advanced Mode
			{
				displayName: 'Video Specification (JSON)',
				name: 'videoSpec',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['createVideo', 'createVideoComplete'],
						configMode: ['advanced'],
					},
				},
				default: '{\n  "config": {\n    "width": 1920,\n    "height": 1080,\n    "fps": 30\n  },\n  "assets": [\n    {\n      "type": "image",\n      "src": "https://example.com/image.jpg",\n      "start": 0,\n      "duration": 10\n    }\n  ]\n}',
				description: 'Complete video specification in JSON format',
				required: true,
			},

			// ===== CREATE VIDEO COMPLETE FIELDS =====
			{
				displayName: 'Return Format',
				name: 'returnFormat',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['createVideoComplete'],
					},
				},
				options: [
					{
						name: 'Binary Data',
						value: 'binary',
						description: 'Download video as binary data (recommended)',
					},
					{
						name: 'Public URL',
						value: 'url',
						description: 'Generate a temporary public URL',
					},
					{
						name: 'Both',
						value: 'both',
						description: 'Return both binary data and URL',
					},
				],
				default: 'binary',
				description: 'How to return the completed video',
			},

			{
				displayName: 'Poll Interval (seconds)',
				name: 'pollInterval',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createVideoComplete'],
					},
				},
				default: 5,
				typeOptions: {
					minValue: 1,
					maxValue: 60,
				},
				description: 'How often to check job status',
			},

			{
				displayName: 'Timeout (seconds)',
				name: 'timeout',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createVideoComplete'],
					},
				},
				default: 300,
				description: 'Maximum time to wait for completion',
			},

			// ===== GET STATUS / DOWNLOAD / CANCEL FIELDS =====
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getStatus', 'downloadVideo', 'cancelJob'],
					},
				},
				default: '',
				placeholder: '1234567890_abc123',
				description: 'The ID of the render job',
				required: true,
			},

			{
				displayName: 'Return Format',
				name: 'returnFormat',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['downloadVideo'],
					},
				},
				options: [
					{
						name: 'Binary Data',
						value: 'binary',
						description: 'Download video as binary data',
					},
					{
						name: 'Public URL',
						value: 'url',
						description: 'Generate a temporary public URL',
					},
				],
				default: 'binary',
				description: 'How to return the video',
			},
		],
	};

	methods = {
		loadOptions: {
			async getTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('vidierApiApi');
				const response = await this.helpers.request({
					method: 'GET',
					url: `${credentials.apiUrl}/api/templates`,
					json: true,
				});

				return response.templates.map((template: any) => ({
					name: template.id,
					value: template.id,
					description: template.description,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('vidierApiApi');
		const operation = this.getNodeParameter('operation', 0) as string;

		// Helper function to build video spec
		const buildVideoSpec = async (itemIndex: number): Promise<any> => {
			const configMode = this.getNodeParameter('configMode', itemIndex) as string;

			if (configMode === 'advanced') {
				const spec = this.getNodeParameter('videoSpec', itemIndex) as string;
				return JSON.parse(spec);

			} else if (configMode === 'template') {
				const template = this.getNodeParameter('template', itemIndex) as string;
				const overrides = this.getNodeParameter('templateOverrides', itemIndex) as string;
				return {
					template,
					...JSON.parse(overrides),
				};

			} else {
				// Simple mode
				const videoFormat = this.getNodeParameter('videoFormat', itemIndex) as string;
				const fps = this.getNodeParameter('fps', itemIndex) as number;
				const imageUrl = this.getNodeParameter('imageUrl', itemIndex) as string;
				const imageDuration = this.getNodeParameter('imageDuration', itemIndex) as number;
				const kenBurns = this.getNodeParameter('kenBurns', itemIndex) as boolean;
				const audioUrl = this.getNodeParameter('audioUrl', itemIndex) as string;
				const audioVolume = this.getNodeParameter('audioVolume', itemIndex) as number;
				const textOverlay = this.getNodeParameter('textOverlay', itemIndex) as string;
				const textPosition = this.getNodeParameter('textPosition', itemIndex) as string;

				const spec: any = {
					config: { fps },
				};

				// Set dimensions based on format
				if (videoFormat === 'custom') {
					spec.config.width = this.getNodeParameter('width', itemIndex);
					spec.config.height = this.getNodeParameter('height', itemIndex);
				} else {
					spec.config.format = videoFormat;
				}

				// Add image asset
				spec.image = {
					src: imageUrl,
				};
				// Only add duration if it's a valid number (not null/undefined/0 if intended)
				// If user passes null (via expression), imageDuration will be null.
				if (imageDuration) {
					spec.image.duration = imageDuration;
				}

				if (kenBurns) {
					spec.image.effect = 'kenburns';
				}

				// Add audio if provided
				if (audioUrl) {
					spec.audio = {
						src: audioUrl,
						volume: audioVolume,
					};
				}

				// Add text overlay if provided
				if (textOverlay) {
					spec.text = {
						content: textOverlay,
						position: textPosition,
						// Default style
						fontSize: 48,
						color: '#FFFFFF',
						backgroundColor: '#000000B3', // rgba(0,0,0,0.7) -> hex
					};
				}

				return spec;
			}
		};

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'createVideo') {
					const spec = await buildVideoSpec(i);
					const response = await this.helpers.request({
						method: 'POST',
						url: `${credentials.apiUrl}/api/render`,
						body: spec,
						json: true,
					});

					returnData.push({
						json: response,
					});

				} else if (operation === 'createVideoComplete') {
					const spec = await buildVideoSpec(i);
					const pollInterval = this.getNodeParameter('pollInterval', i) as number;
					const timeout = this.getNodeParameter('timeout', i) as number;
					const returnFormat = this.getNodeParameter('returnFormat', i) as string;
					const fileName = this.getNodeParameter('fileName', i, '') as string;
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;

					// Start render
					const renderResponse = await this.helpers.request({
						method: 'POST',
						url: `${credentials.apiUrl}/api/render`,
						body: spec,
						json: true,
					});

					const jobId = renderResponse.jobId;
					const startTime = Date.now();

					// Poll for completion
					let status: any = null;
					while (true) {
						// Check timeout
						if (Date.now() - startTime > timeout * 1000) {
							throw new NodeOperationError(
								this.getNode(),
								`Timeout after ${timeout} seconds waiting for video completion`,
								{ itemIndex: i }
							);
						}

						// Check status
						status = await this.helpers.request({
							method: 'GET',
							url: `${credentials.apiUrl}/api/status/${jobId}`,
							json: true,
						});

						if (status.job.status === 'completed') {
							break;
						} else if (status.job.status === 'failed') {
							throw new NodeOperationError(
								this.getNode(),
								`Render failed: ${status.job.error}`,
								{ itemIndex: i }
							);
						}

						// Wait before next poll
						await new Promise(resolve => setTimeout(resolve, pollInterval * 1000));
					}

					// Download or generate URL
					const result: INodeExecutionData = { json: status.job };

					if (returnFormat === 'binary' || returnFormat === 'both') {
						const videoData = await this.helpers.request({
							method: 'GET',
							url: `${credentials.apiUrl}/api/download/${jobId}`,
							encoding: null, // Return Buffer directly
						});

						const finalFileName = fileName ? (fileName.endsWith('.mp4') ? fileName : `${fileName}.mp4`) : `video_${jobId}.mp4`;

						result.binary = {
							[binaryPropertyName]: {
								data: (videoData as Buffer).toString('base64'),
								mimeType: 'video/mp4',
								fileName: finalFileName,
							} as IBinaryData,
						};
					}

					if (returnFormat === 'url' || returnFormat === 'both') {
						// Generate public URL
						const urlResponse = await this.helpers.request({
							method: 'POST',
							url: `${credentials.apiUrl}/api/share/${jobId}`,
							json: true,
						});
						result.json.publicUrl = urlResponse.url;
					}

					returnData.push(result);

				} else if (operation === 'getStatus') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					const response = await this.helpers.request({
						method: 'GET',
						url: `${credentials.apiUrl}/api/status/${jobId}`,
						json: true,
					});

					returnData.push({ json: response });

				} else if (operation === 'downloadVideo') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					const returnFormat = this.getNodeParameter('returnFormat', i) as string;
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
					// Add fileName parameter for downloadVideo too if we want to support renaming there
					// But for now, let's just use the binaryPropertyName as requested.
					// Wait, user asked for "Output Filename" in simple config, which applies to createVideoComplete.
					// For downloadVideo, we might want to add it too?
					// Let's add it for consistency.
					const fileName = this.getNodeParameter('fileName', i, '') as string;

					const result: INodeExecutionData = { json: { jobId } };

					if (returnFormat === 'binary') {
						const videoData = await this.helpers.request({
							method: 'GET',
							url: `${credentials.apiUrl}/api/download/${jobId}`,
							encoding: null,
						});

						const finalFileName = fileName ? (fileName.endsWith('.mp4') ? fileName : `${fileName}.mp4`) : `video_${jobId}.mp4`;

						result.binary = {
							[binaryPropertyName]: {
								data: (videoData as Buffer).toString('base64'),
								mimeType: 'video/mp4',
								fileName: finalFileName,
							} as IBinaryData,
						};
					} else {
						// Generate public URL
						const urlResponse = await this.helpers.request({
							method: 'POST',
							url: `${credentials.apiUrl}/api/share/${jobId}`,
							json: true,
						});
						result.json.publicUrl = urlResponse.url;
					}

					returnData.push(result);

				} else if (operation === 'cancelJob') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					const response = await this.helpers.request({
						method: 'DELETE',
						url: `${credentials.apiUrl}/api/cancel/${jobId}`,
						json: true,
					});

					returnData.push({ json: response });

				} else if (operation === 'listTemplates') {
					const response = await this.helpers.request({
						method: 'GET',
						url: `${credentials.apiUrl}/api/templates`,
						json: true,
					});

					returnData.push({ json: response });

				} else if (operation === 'getExamples') {
					const response = await this.helpers.request({
						method: 'GET',
						url: `${credentials.apiUrl}/api/examples`,
						json: true,
					});

					returnData.push({ json: response });
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : String(error) },
						error,
					} as INodeExecutionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
