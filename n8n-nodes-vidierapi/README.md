# n8n-nodes-vidierapi

[![npm version](https://badge.fury.io/js/n8n-nodes-vidierapi.svg)](https://badge.fury.io/js/n8n-nodes-vidierapi)
![VidierApi Logo](https://vidierapi.com/logo.png)

This is an n8n community node that lets you use [VidierApi](https://vidierapi.com) in your workflows.

VidierApi is a professional video generation engine that allows you to create videos programmatically using simple JSON specifications.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Node Installation

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-vidierapi` in **Enter npm package name**
4. Agree to the risks and select **Install**

After installing the node, you can use it like any other node in n8n.

## Credentials

This node requires VidierApi API credentials. You need:

- **API URL**: The base URL of your VidierApi instance (e.g., `https://api.vidierapi.com` or `http://localhost:3002`)
- **API Key** (optional): Your API key for authentication

## Operations

### Create Video
Start a new video render job and receive a job ID immediately.

**Configuration Modes:**
- **Simple (Form)**: Fill out a simple form with:
  - Video format presets (YouTube, TikTok, Instagram)
  - Image URL
  - Audio URL (optional)
  - Text overlay (optional)
  - Ken Burns effect
  
- **Advanced (JSON)**: Provide complete JSON specification
- **From Template**: Start from a predefined template

### Create Video Complete
Create a video and automatically wait for completion with built-in polling.

**Features:**
- Automatic status polling every N seconds
- Configurable timeout
- Return formats:
  - **Binary Data**: Download video as binary (can be sent to Google Drive, AWS S3, etc.)
  - **Public URL**: Generate a shareable link
  - **Both**: Get both binary data and URL

### Get Status
Check the current status of a render job.

Returns: `queued`, `processing`, `completed`, `failed`, or `cancelled`

### Download Video
Download a completed video.

**Return formats:**
- Binary data (for further processing/upload)
- Public URL (for sharing)

### Cancel Job
Cancel a queued or processing render job.

### List Templates
Get all available video templates from your VidierApi instance.

### Get Examples
Get example video specifications to use as starting points.

## Example Workflows

### Simple Video Creation
```
[Manual Trigger]
    ↓
[VidierApi - Create Video Complete]
    - Mode: Simple
    - Format: TikTok (9:16)
    - Image: {{$json.imageUrl}}
    - Text: {{$json.title}}
    ↓
[Google Drive - Upload]
```

### Batch Processing
```
[Webhook Trigger]
    ↓
[Split In Batches]
    ↓
[VidierApi - Create Video Complete]
    - Mode: Advanced
    - JSON: {{$json.specification}}
    - Return: Binary
    ↓
[AWS S3 - Upload]
```

### With Status Monitoring
```
[Schedule Trigger]
    ↓
[VidierApi - Create Video]
    ↓
[Wait 10 seconds]
    ↓
[VidierApi - Get Status]
    ↓
[IF completed]
    ↓
[VidierApi - Download Video]
```

## Compatibility

Tested with n8n version 1.0+

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [VidierApi Documentation](https://vidierapi.com/docs)
* [VidierApi API Reference](https://vidierapi.com/api-docs)

## Version history

### 1.0.0
- Initial release
- Support for all basic operations
- Simple and advanced configuration modes
- Create Video Complete with automatic polling
- Binary data and public URL support

## License

[MIT](LICENSE.md)
