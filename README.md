<div align="center">

<img src="backend/public/logo.png" alt="VidierApi Logo" width="150" height="150" />

# 🎬 VidierApi

### **Professional Video Generation Engine Powered by FFmpeg**

Transform JSON into stunning videos with real-time progress tracking, automation workflows, and professional-grade features.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)](https://github.com/yourusername/VidierApi)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=for-the-badge)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg?style=for-the-badge&logo=docker)](https://docker.com)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-powered-orange.svg?style=for-the-badge&logo=ffmpeg)](https://ffmpeg.org)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Examples](#-examples) • [API Reference](#-api-endpoints)

</div>

---

## 🌟 What is VidierApi?

**VidierApi** is a powerful **Open Source** video generation platform designed to **automate video creation via API**. It converts simple JSON specifications into professional videos using FFmpeg, making it the perfect engine for programmatic content creation.

It features a dedicated **n8n Community Node**, allowing seamless integration into your automation workflows for bulk video processing, social media automation, and dynamic content generation.

### 💡 Why VidierApi?

- **🎯 Simple & Intuitive**: Define your video in JSON - no complex video editing knowledge required
- **⚡ Lightning Fast**: Optimized FFmpeg processing with job queuing and parallel rendering
- **🔄 Automation Ready**: Native integration with n8n, Make.com, Zapier, and custom workflows
- **🎨 Feature Rich**: Ken Burns effects, text overlays, watermarks, transitions, and more
- **📊 Real-Time Monitoring**: WebSocket-powered progress tracking with FPS, speed, and ETA
- **🐳 Deploy Anywhere**: Docker-ready with one-command deployment
- **🔓 Open Source**: MIT licensed - use it commercially, modify it freely

### 🎯 Perfect For

- 🎥 **Content Creators**: Automated video generation for social media
- 📱 **Social Media Managers**: Bulk creation of TikTok, Instagram Reels, YouTube Shorts
- 🤖 **Automation Workflows**: n8n, Make.com, Zapier integrations
- 🏢 **Enterprise**: Scalable video processing pipelines
- 📊 **Marketing Teams**: Dynamic video ads and promotional content
- 🎓 **Developers**: RESTful API for custom integrations

---

## ✨ Features

### 🎬 Video Generation
- **FFmpeg-Powered**: Professional-grade video rendering engine
- **Flexible Inputs**: Support for URLs, Base64, and local file paths
- **Multiple Formats**: YouTube (16:9), Instagram Square (1:1), TikTok/Reels (9:16), Custom resolutions
- **Smart Resizing**: Automatic aspect ratio handling and cropping

### 🎨 Visual Effects
- **Ken Burns Effect**: Dynamic zoom and pan animations
- **Zoom Effects**: Customizable zoom factors (1.0-3.0)
- **Image Effects**: Fade, scale, rotate, and custom transitions
- **Watermarks**: Logo overlays with position and opacity control
- **Text Overlays**: Multiple fonts, colors, positions, and animations

### 🎵 Audio Processing
- **Multi-Track Audio**: Mix background music with voiceovers
- **Volume Control**: Fine-grained audio level adjustments (0.0-2.0)
- **Fade Effects**: Smooth audio fade-in and fade-out
- **Audio Sync**: Automatic synchronization with video duration
- **Multiple Formats**: MP3, WAV, AAC, OGG support

### 📊 Progress & Monitoring
- **Real-Time Updates**: WebSocket-powered live progress tracking
- **Detailed Metrics**: FPS, encoding speed, remaining time, and percentage
- **Job Queue**: BullMQ-powered background processing with Redis
- **Health Checks**: Built-in health monitoring and status endpoints
- **Comprehensive Logging**: Winston-based logging system

### 🔌 Integration & Automation
- **REST API**: Clean, well-documented RESTful endpoints
- **n8n Community Node**: Official n8n integration for workflow automation
- **Webhooks**: Event notifications for job completion
- **Job Management**: Submit, monitor, cancel, and download jobs
- **Batch Processing**: Handle multiple videos simultaneously

### 🖥️ User Interfaces
- **Modern Web UI**: Beautiful dark-themed interface with live preview
- **Interactive CLI**: Command-line tool with interactive mode
- **API Documentation**: Swagger UI and ReDoc for API exploration
- **Code Examples**: Ready-to-use examples in multiple languages

### 🛡️ Production Ready
- **Docker Support**: One-command deployment with Docker Compose
- **Environment Config**: Flexible configuration via .env files
- **Error Handling**: Comprehensive error messages and recovery
- **Security**: CORS, file size limits, input validation
- **Scalability**: Horizontal scaling with Redis job queue

---

## 📁 Project Structure

```
VidierApi/
├── 📂 src/                          # Application source code
│   ├── 🎯 server.js                 # Express server & WebSocket setup
│   ├── 📂 api/                      # API layer
│   │   ├── routes.js                # REST endpoints
│   │   ├── jobQueue.js              # BullMQ job processing
│   │   ├── validator.js             # JSON schema validation
│   │   ├── swagger.config.js        # Swagger UI configuration
│   │   └── openapi.config.js        # OpenAPI 3.0 specification
│   ├── 📂 cli/                      # Command-line interface
│   │   └── index.js                 # Interactive CLI tool
│   ├── 📂 config/                   # Configuration management
│   │   └── index.js                 # Environment variables & defaults
│   ├── 📂 renderer/                 # Video rendering engine
│   │   ├── executor.js              # FFmpeg command execution
│   │   ├── commandBuilder.js        # FFmpeg command generation
│   │   └── assetManager.js          # Asset download & processing
│   ├── 📂 templates/                # Pre-built video templates
│   │   ├── cinematic.json           # Cinematic style template
│   │   └── story.json               # Story/narrative template
│   └── 📂 utils/                    # Utility functions
│       ├── logger.js                # Winston logging
│       ├── fileUtils.js             # File system operations
│       └── common.js                # Shared utilities
├── 📂 public/                       # Frontend files
│   ├── index.html                   # Main web interface
│   ├── api-docs.html                # API documentation page
│   ├── redoc.html                   # ReDoc documentation
│   ├── 📂 css/                      # Stylesheets
│   │   └── styles.css               # Modern dark theme
│   ├── 📂 js/                       # Client-side JavaScript
│   │   └── app.js                   # UI logic & WebSocket
│   └── 📂 examples/                 # Example workflow files
│       ├── n8n-workflow-http-polling.json
│       └── n8n-workflow-custom-node.json
├── 📂 docs/                         # Documentation
│   ├── API_GUIDE.md                 # Complete API guide
│   ├── ROADMAP.md                   # Feature roadmap
│   ├── IMPROVEMENTS.md              # Planned enhancements
│   ├── PROJECT_STATUS.md            # Development status
│   └── 📂 n8n/                      # n8n integration guides
│       ├── N8N_INTEGRATION.md
│       ├── N8N_FINAL_SOLUTION.md
│       └── N8N_URL_FIX.md
├── 📂 examples/                     # Ready-to-use examples
│   ├── ex1_basic.json               # Basic image + audio
│   ├── ex2_text.json                # Text overlays
│   ├── ex3_watermark.json           # Watermark example
│   ├── ex4_slideshow.json           # Multi-image slideshow
│   ├── social-vertical.json         # TikTok/Reels format
│   └── ... (15+ examples)
├── 📂 n8n-nodes-vidierapi/          # Official n8n community node
│   ├── package.json                 # Node package configuration
│   ├── 📂 nodes/                    # n8n node implementation
│   ├── 📂 credentials/              # API credentials
│   └── README.md                    # Node documentation
├── 📂 temp/                         # Temporary processing files
├── 📂 output/                       # Rendered video output
├── 📂 logs/                         # Application logs
├── 📂 assets/                       # Static assets (images, fonts)
├── 🐳 docker-compose.yml            # Docker Compose configuration
├── 🐳 Dockerfile                    # Docker image definition
├── 📦 package.json                  # Node.js dependencies
├── 🔧 .env.example                  # Environment variables template
└── 📖 README.md                     # This file
```

### 🏗️ Architecture

- **Express.js** - RESTful API server
- **Socket.io** - Real-time progress updates
- **BullMQ** - Job queue and background processing
- **Redis** - Job queue storage and caching
- **FFmpeg** - Video rendering engine
- **Sharp** - Image processing
- **Winston** - Logging system
- **Joi** - Input validation

---

## 🚀 Quick Start

### 🐳 Docker (Recommended)

Get up and running in 30 seconds:

```bash
# Clone the repository
git clone https://github.com/yourusername/VidierApi.git
cd VidierApi

# Start with Docker Compose (includes Redis)
docker-compose up -d

# View logs
docker-compose logs -f vidierapi

# Access the application
# Web UI: http://localhost:3002
# API Docs: http://localhost:3002/docs
```

**That's it!** 🎉 Your video generation API is now running.

### 💻 Local Development

```bash
# Install dependencies
npm install

# Start Redis (required for job queue)
# Option 1: Docker
docker run -d -p 6379:6379 redis:7-alpine

# Option 2: Local installation
redis-server

# Start the server
npm start

# Or with auto-reload for development
npm run dev
```

**Server will be available at:** `http://localhost:3002`

### ✅ Verify Installation

```bash
# Health check
curl http://localhost:3002/api/health

# Expected response:
# {"status":"ok","version":"1.0.0","uptime":123}
```

---

## 📖 Usage

### 🌐 Web UI

The easiest way to get started:

1. **Open your browser**: Navigate to `http://localhost:3002`
2. **Edit the JSON**: Modify the video specification in the editor
3. **Click "Render Video"**: Start the rendering process
4. **Watch Progress**: Real-time progress bar with detailed metrics
5. **Download**: Get your finished video in MP4 format

![Web UI Preview](https://via.placeholder.com/800x450/1a1a2e/eee?text=VidierApi+Web+Interface)

### ⌨️ CLI Interface

Perfect for scripting and automation:

**Interactive Mode** (guided setup):
```bash
npm run cli
# Or if installed globally
vidierapi
```

**File Mode** (process JSON file):
```bash
vidierapi --input examples/basic.json --output my-video.mp4
```

**Show Example** (generate sample JSON):
```bash
vidierapi --example
```

**Custom API URL**:
```bash
vidierapi --api http://your-server:3002 --input video.json
```

### 🔌 REST API

Full programmatic control:

**1. Submit a Render Job**

```bash
curl -X POST http://localhost:3002/api/render \
  -H "Content-Type: application/json" \
  -d '{
    "image": {
      "src": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      "effect": "kenburns",
      "zoom": 1.3
    },
    "audio": {
      "src": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "volume": 0.8
    },
    "config": {
      "width": 1920,
      "height": 1080,
      "fps": 30
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Render job queued successfully"
}
```

**2. Check Job Status**

```bash
curl http://localhost:3002/api/status/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "active",
  "progress": 67.5,
  "fps": 28.3,
  "speed": "1.2x",
  "timeRemaining": "00:00:15"
}
```

**3. Download Video**

```bash
curl -O http://localhost:3002/api/download/550e8400-e29b-41d4-a716-446655440000
# Or with custom filename:
curl -O "http://localhost:3002/api/download/550e8400-e29b-41d4-a716-446655440000?filename=my_video.mp4"
```

---

## 📋 Examples

### 🎯 Basic Video (Image + Audio)

```json
{
  "image": {
    "src": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    "effect": "kenburns",
    "zoom": 1.3
  },
  "audio": {
    "src": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "volume": 0.8
  },
  "config": {
    "width": 1920,
    "height": 1080,
    "fps": 30
  }
}
```

### 📱 Social Media (TikTok/Reels)

```json
{
  "image": {
    "src": "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    "effect": "zoom",
    "zoom": 1.5
  },
  "audio": {
    "src": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "fadeIn": 1,
    "fadeOut": 2
  },
  "text": {
    "content": "Summer Vibes 🌴",
    "position": "top",
    "fontSize": 72,
    "color": "#FFFFFF",
    "backgroundColor": "#00000099"
  },
  "config": {
    "format": "9:16",  // Automatically sets to 1080x1920
    "fps": 30
  }
}
```

### 💧 Watermark & Branding

```json
{
  "image": {
    "src": "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
  },
  "audio": {
    "src": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  "watermark": {
    "src": "https://your-domain.com/logo.png",
    "position": "bottom-right",
    "opacity": 0.7,
    "scale": 0.15
  },
  "config": {
    "width": 1920,
    "height": 1080
  }
}
```

### 📝 Text Overlay & Captions

```json
{
  "image": {
    "src": "https://images.unsplash.com/photo-1518791841217-8f162f1e1131"
  },
  "audio": {
    "src": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  "text": {
    "content": "Episode 1: The Beginning",
    "position": "bottom",
    "fontSize": 48,
    "color": "#FFFFFF",
    "fontFamily": "Arial",
    "backgroundColor": "#00000088",
    "borderWidth": 2,
    "borderColor": "#FF0000"
  },
  "config": {
    "width": 1280,
    "height": 720,
    "fps": 30
  }
}
```

> 💡 **More Examples**: Check the [`examples/`](examples/) folder for 15+ ready-to-use templates!

---

## 📊 JSON Specification Reference

### 🖼️ Image Options

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `image.src` | `string` | ✅ | - | URL, Base64 string, or local file path |
| `image.effect` | `string` | ❌ | `none` | Visual effect: `none`, `kenburns`, `zoom`, `fade` |
| `image.zoom` | `number` | ❌ | `1.2` | Zoom factor for effects (1.0-3.0) |
| `image.duration` | `number` | ❌ | `auto` | Duration in seconds (auto-calculated from audio) |

### 🎵 Audio Options

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `audio.src` | `string` | ✅ | - | URL, Base64 string, or local file path |
| `audio.volume` | `number` | ❌ | `1.0` | Volume level (0.0-2.0, where 1.0 is 100%) |
| `audio.fadeIn` | `number` | ❌ | `0` | Fade-in duration in seconds (0-10) |
| `audio.fadeOut` | `number` | ❌ | `0` | Fade-out duration in seconds (0-10) |
| `audio.start` | `number` | ❌ | `0` | Start time offset in seconds |

### 📝 Text Options

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `text.content` | `string` | ✅ | - | Text to display on video |
| `text.position` | `string` | ❌ | `center` | Position: `top`, `center`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `text.fontSize` | `number` | ❌ | `48` | Font size in pixels (12-200) |
| `text.fontFamily` | `string` | ❌ | `Arial` | Font family name |
| `text.color` | `string` | ❌ | `#FFFFFF` | Text color (hex format) |
| `text.backgroundColor` | `string` | ❌ | `transparent` | Background color (hex with alpha: `#RRGGBBAA`) |
| `text.borderWidth` | `number` | ❌ | `0` | Border width in pixels |
| `text.borderColor` | `string` | ❌ | `#000000` | Border color (hex format) |

### 💧 Watermark Options

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `watermark.src` | `string` | ✅ | - | URL, Base64 string, or local file path (PNG recommended) |
| `watermark.position` | `string` | ❌ | `bottom-right` | Position on video |
| `watermark.opacity` | `number` | ❌ | `1.0` | Opacity level (0.0-1.0) |
| `watermark.scale` | `number` | ❌ | `0.1` | Size relative to video (0.05-0.5) |

### ⚙️ Configuration Options

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `config.width` | `number` | ❌ | `1920` | Video width in pixels (128-7680) |
| `config.height` | `number` | ❌ | `1080` | Video height in pixels (128-4320) |
| `config.format` | `string` | ❌ | - | Preset format: `16:9` (YouTube), `9:16` (TikTok), `1:1` (Instagram) |
| `config.fps` | `number` | ❌ | `30` | Frames per second (15-60) |
| `config.preset` | `string` | ❌ | `medium` | FFmpeg encoding preset: `ultrafast`, `superfast`, `veryfast`, `faster`, `fast`, `medium`, `slow`, `slower`, `veryslow` |
| `config.crf` | `number` | ❌ | `23` | Quality level (0-51, lower = better quality, 18-28 recommended) |

> 📘 **Pro Tip**: Use `config.format` for quick social media presets instead of manually setting width/height!

---

## 🔌 n8n Integration

VidierApi provides **first-class n8n support** for workflow automation. Create videos from spreadsheets, webhooks, schedules, and more!

### Option 1: Community Node (Recommended) ⭐

**Installation via n8n UI:**
1. Go to **Settings > Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-vidierapi`
4. Click **Install**

**Manual Installation (Self-hosted):**
```bash
cd ~/.n8n
npm install n8n-nodes-vidierapi
```

**Features:**
- ✅ Visual interface for all parameters
- ✅ Built-in validation and error handling
- ✅ Automatic polling and progress tracking
- ✅ Download as binary data or public URL
- ✅ Simple and Advanced modes

### Option 2: HTTP Request Nodes

Use standard n8n HTTP Request nodes:

**Workflow Pattern:**

```
[Trigger] → [HTTP: Create Video] → [Wait/Poll] → [HTTP: Download] → [Save/Upload]
```

**1. Submit Job (HTTP Request)**
- **Method**: `POST`
- **URL**: `http://localhost:3002/api/render`
- **Body**: JSON video specification

**2. Poll Status (Loop + Wait)**
- Check `/api/status/:jobId` every 3-5 seconds
- Continue when `status === "completed"`

**3. Download Video**
- **Method**: `GET`
- **URL**: `http://localhost:3002/api/download/:jobId`
- **Response Format**: Binary

### 📥 Import Ready-Made Workflows

We provide pre-built n8n workflows in the [`examples/`](examples/) folder:

- **`n8n-workflow-http-polling.json`** - Complete workflow with polling
- **`n8n-workflow-custom-node.json`** - Using the community node
- **`n8n-workflow-template.json`** - Advanced bulk processing

**Import Steps:**
1. Open n8n → Workflows → Import from File
2. Select one of the JSON files
3. Configure your VidierApi URL
4. Execute! 🚀

### 🎯 Use Cases with n8n

- **Automated Social Media**: Generate videos from RSS feeds, schedule posts
- **Bulk Video Creation**: Process spreadsheet data to create multiple videos
- **Dynamic Content**: Create personalized videos from form submissions
- **Scheduled Reports**: Generate video summaries on schedule
- **E-commerce**: Product videos from inventory updates

---

## 🛠️ API Endpoints

### Video Operations

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/api/render` | `POST` | Submit a new video render job | None |
| `/api/status/:jobId` | `GET` | Get job status and progress | None |
| `/api/download/:jobId` | `GET` | Download completed video | None |
| `/api/cancel/:jobId` | `DELETE` | Cancel a running job | None |

### System Operations

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | `GET` | Service health check |
| `/api/schema` | `GET` | JSON schema validation |
| `/api/templates` | `GET` | List available templates |

### Documentation

| Endpoint | Description |
|----------|-------------|
| `/` | Web UI interface |
| `/docs` | Interactive Swagger UI |
| `/api/docs` | API documentation page |

### WebSocket Events

Connect to `ws://localhost:3002` for real-time updates:

```javascript
const socket = io('http://localhost:3002');

socket.on('job-progress', (data) => {
  console.log(`Job ${data.jobId}: ${data.progress}%`);
  console.log(`FPS: ${data.fps}, Speed: ${data.speed}`);
});

socket.on('job-completed', (data) => {
  console.log(`Video ready: ${data.downloadUrl}`);
});

socket.on('job-failed', (data) => {
  console.error(`Error: ${data.error}`);
});
```

---

## 🐳 Docker Deployment

### Using Docker Compose (Production)

```bash
# Start all services (VidierApi + Redis)
docker-compose up -d

# View real-time logs
docker-compose logs -f vidierapi

# Check running containers
docker ps

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# View resource usage
docker stats
```

### Manual Docker Commands

```bash
# Build image
docker build -t vidierapi:latest .

# Run Redis
docker run -d --name vidierapi-redis -p 6379:6379 redis:7-alpine

# Run VidierApi
docker run -d \
  --name vidierapi-app \
  -p 3002:3002 \
  -e REDIS_HOST=vidierapi-redis \
  --link vidierapi-redis \
  vidierapi:latest

# View logs
docker logs -f vidierapi-app
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3002
NODE_ENV=production

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# FFmpeg Settings
FFMPEG_THREADS=4          # Number of CPU threads for encoding
FFMPEG_PRESET=medium      # ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow
FFMPEG_CRF=23            # Quality: 0-51 (lower = better, 18-28 recommended)

# Job Queue Settings
MAX_CONCURRENT_JOBS=3    # Maximum parallel video renderings
JOB_TIMEOUT_MS=600000    # Job timeout (10 minutes)
CLEANUP_AFTER_HOURS=24   # Auto-delete old videos after X hours

# Security
MAX_FILE_SIZE_MB=500     # Maximum upload size
ALLOWED_ORIGINS=http://localhost:3002,https://your-domain.com

# Paths (Docker handles these automatically)
TEMP_DIR=./temp
OUTPUT_DIR=./output
LOG_DIR=./logs

# Logging
LOG_LEVEL=info           # error, warn, info, debug
```

### Volume Mounts

The Docker setup automatically mounts these directories:

- **`./temp`** - Temporary processing files
- **`./output`** - Rendered videos
- **`./logs`** - Application logs
- **`./public`** - Web UI files (for customization)
- **`./examples`** - Example JSON files

---

## 🚀 Roadmap & Future Features

See [docs/ROADMAP.md](docs/ROADMAP.md) for the complete feature roadmap.

### 🎯 Planned Features

- [ ] **Multi-clip editing** - Merge multiple video/image clips with transitions
- [ ] **Advanced text animations** - Fade, slide, typewriter effects
- [ ] **Color grading** - Filters, LUTs, color correction
- [ ] **Audio mixing** - Multiple audio tracks, ducking, normalization
- [ ] **Subtitle support** - .SRT file integration with styling
- [ ] **Video templates library** - Pre-built templates for common use cases
- [ ] **Cloud storage integration** - Direct upload to S3, GCS, Cloudinary
- [ ] **Webhook notifications** - Real-time job completion callbacks
- [ ] **API authentication** - API keys and rate limiting
- [ ] **Video analytics** - Render time tracking and optimization insights

---

## 📚 Documentation

### 📖 Guides

- **[Complete API Guide](docs/API_GUIDE.md)** - Detailed API documentation with examples
- **[n8n Integration Guide](docs/n8n/N8N_INTEGRATION.md)** - Step-by-step n8n setup
- **[Project Status](docs/PROJECT_STATUS.md)** - Current development status
- **[Improvements](docs/IMPROVEMENTS.md)** - Feature enhancements and ideas

### 🎓 Resources

- **[Interactive API Docs](http://localhost:3002/docs)** - Swagger UI (after starting server)
- **[Examples Collection](examples/)** - 15+ ready-to-use JSON templates
- **[n8n Workflows](examples/)** - Pre-built n8n workflow templates

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, documentation improvements, or examples.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/VidierApi.git
cd VidierApi

# Install dependencies
npm install

# Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# Start in development mode with auto-reload
npm run dev

# Run tests (when available)
npm test
```

### Code Style

- Use **ES6+** syntax
- Follow existing code formatting
- Add comments for complex logic
- Update documentation for new features

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR**: You can use this commercially, modify it, distribute it, and use it privately. Just include the original license!

---

## 🆘 Troubleshooting

### Common Issues

<details>
<summary><strong>❌ "FFmpeg not found" error</strong></summary>

**Docker:**
```bash
docker-compose build --no-cache
docker-compose up -d
```

**Local:**
- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg` or `sudo yum install ffmpeg`

Verify installation:
```bash
ffmpeg -version
```
</details>

<details>
<summary><strong>❌ Redis connection failed</strong></summary>

**Check if Redis is running:**
```bash
# Docker
docker ps | grep redis

# Local
redis-cli ping
# Expected response: PONG
```

**Start Redis:**
```bash
# Docker
docker run -d -p 6379:6379 redis:7-alpine

# Local
redis-server
```

**Check configuration:**
- Verify `REDIS_HOST` and `REDIS_PORT` in `.env`
- Default: `localhost:6379`
</details>

<details>
<summary><strong>❌ Video render failed</strong></summary>

**Check logs:**
```bash
# Docker
docker-compose logs -f vidierapi

# Local
tail -f logs/error.log
```

**Common causes:**
- Invalid or inaccessible asset URLs
- Insufficient disk space in `temp/` or `output/` directories
- Unsupported image/audio format
- Network timeout when downloading assets

**Solutions:**
- Verify asset URLs are publicly accessible
- Check disk space: `df -h`
- Try with local files instead of URLs
- Increase timeout in configuration
</details>

<details>
<summary><strong>❌ Port 3002 already in use</strong></summary>

**Option 1: Change port**
```env
# Edit .env
PORT=3003
```

**Option 2: Kill existing process**
```bash
# Windows
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3002 | xargs kill -9
```

**Option 3: Use Docker port mapping**
```yaml
# Edit docker-compose.yml
ports:
  - "8080:3002"  # External:Internal
```
</details>

<details>
<summary><strong>⚠️ Job stuck in "active" status</strong></summary>

**Possible causes:**
- Server crash during render
- FFmpeg process killed
- Redis connection lost

**Solutions:**
```bash
# Restart services
docker-compose restart

# Clear stuck jobs
redis-cli FLUSHDB

# Check job timeout setting
# Default: 10 minutes (600000ms)
```
</details>

<details>
<summary><strong>❌ "Maximum payload exceeded" error</strong></summary>

**Increase payload limit:**
```javascript
// src/server.js
app.use(express.json({ limit: '100mb' }));  // Increase from 50mb
```

**Or use URL/file path instead of Base64:**
```json
{
  "image": {
    "src": "https://example.com/large-image.jpg"  // ✅ Better
    // "src": "data:image/jpeg;base64,..."        // ❌ Large payload
  }
}
```
</details>

---

## 💡 Performance Tips

### 🚀 Optimize Rendering Speed

1. **Use faster presets** for quick drafts:
   ```json
   "config": {
     "preset": "ultrafast",  // Fastest, larger file
     "crf": 28               // Lower quality
   }
   ```

2. **Reduce resolution** for testing:
   ```json
   "config": {
     "width": 1280,   // Instead of 1920
     "height": 720    // Instead of 1080
   }
   ```

3. **Limit concurrent jobs**:
   ```env
   MAX_CONCURRENT_JOBS=2  # Reduce if CPU usage is high
   ```

### 📦 Optimize File Sizes

1. **Balance quality and size**:
   ```json
   "config": {
     "preset": "medium",  // Good balance
     "crf": 23           // Default quality
   }
   ```

2. **Use appropriate resolution**:
   - YouTube: 1920x1080 (Full HD)
   - Instagram: 1080x1080 (Square)
   - TikTok: 1080x1920 (Vertical)

3. **Compress input assets** before processing

### 🔧 Production Optimization

- Enable Redis persistence for job recovery
- Set up log rotation to manage disk space
- Use reverse proxy (nginx) for better performance
- Implement CDN for asset delivery
- Set up monitoring with Prometheus/Grafana

---

## 📧 Support & Community

### 💬 Get Help

- **📖 Documentation**: Check [docs/](docs/) folder first
- **💡 Examples**: Browse [examples/](examples/) for inspiration
- **🐛 Issues**: [Open an issue](https://github.com/yourusername/VidierApi/issues) on GitHub
- **💡 Feature Requests**: [Start a discussion](https://github.com/yourusername/VidierApi/discussions)

### 📊 Stats & Monitoring

Check service health:
```bash
curl http://localhost:3002/api/health
```

View logs:
```bash
# Real-time logs
docker-compose logs -f vidierapi

# Last 100 lines
docker-compose logs --tail=100 vidierapi

# Local logs
tail -f logs/combined.log
```

### 🔍 Debug Mode

Enable verbose logging:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

---

<div align="center">

## ⭐ Star this repository if you find it useful!

### Made with ❤️ by Eddy Manuel

**Transform your media automation workflows today!**

[⬆ Back to Top](#-vidierapi)

</div>
