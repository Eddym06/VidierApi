<div align="center">
  <img src="../backend/public/logo.png" alt="VidierApi Logo" width="120" height="120" />
  <h1>VidierApi</h1>
  <p><strong>Professional Programmable Video Engine</strong></p>
  <p>
    <a href="#authentication">Authentication</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#features">Features</a> •
    <a href="#api-reference">API Reference</a>
  </p>
</div>

---

**VidierApi** is a high-performance REST API designed to generate professional videos programmatically. It combines the power of FFmpeg with a simple JSON interface, allowing you to mix images, video clips, audio, text, and effects effortlessly.

## 🚀 Quick Start

**Endpoint**: `POST /api/render`
**Content-Type**: `application/json`

### minimal_example.json
```json
{
  "image": {
    "src": "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    "effect": "kenburns"
  },
  "audio": {
    "src": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  }
}
```

> **Note**: You can customize the downloaded filename by appending `?filename=my_video.mp4` to the download URL.

---

## 📚 Feature Gallery

### 1. Video Clips & Mixing (NLE) 🎞️
Combine raw video footage with images. The engine automatically handles resizing, trimming, and aspect ratios.

```json
{
  "clips": [
    { "type": "video", "src": "intro.mp4", "duration": 5 },
    { "type": "image", "src": "photo.jpg", "duration": 3 }
  ],
  "transition": { "type": "fade", "duration": 0.5 }
}
```

### 2. Professional Audio Suite 🎧
Full control over audio envelope and mixing.

```json
"audio": {
  "src": "background_music.mp3",
  "fadeIn": 2,    // Seconds
  "fadeOut": 3,   // Seconds
  "volume": 0.8   // 80% volume
}
```

```

### 3. Social Media Formats (TikTok/Reels/Shorts) 📱
One-click configuration for vertical or square videos using `format`.

```json
{
  "image": { "src": "model.jpg", "effect": "kenburns" },
  "audio": { "src": "music.mp3" },
  "config": {
    "format": "9:16" // Auto-sets 1080x1920
  }
}
```

### 4. Cinematic Color Grading 🎨
Apply instant mood filters or fine-tune manually.

```json
"colorGrading": {
  "filter": "vintage", // Options: bw, sepia, vintage, high-contrast
  "contrast": 1.1,
  "saturation": 0.85
}
```

### 4. Text & Subtitles 📝
Burn-in subtitles (`.srt`) or add dynamic text overlays.

```json
"subtitles": {
  "src": "https://example.com/captions.srt",
  "style": "FontSize=24,PrimaryColour=&H00FFFF"
},
"text": {
  "content": "Episodio 1",
  "position": "bottom",
  "style": "bold"
}
```

### 5. Branding (Watermark) 💧
Protect your content with transparent PNG overlays.

```json
"watermark": {
  "src": "logo.png",
  "position": "top-right",
  "opacity": 0.5,
  "scale": 0.15
}
```

---

## 🛠️ Configuration Reference

### Root Object
| Property | Type | Description |
|----------|------|-------------|
| `clips` | `Array` | List of media items (Video/Image). |
| `image` | `Object` | Single image input (Legacy). |
| `audio` | `Object` | Audio track configuration. |
| `text` | `Object` | Overlay text configuration. |
| `watermark` | `Object` | Branding logo configuration. |
| `colorGrading` | `Object` | Post-processing color API. |
| `config` | `Object` | Technical output settings (Res, FPS). |

### Config Object (New!)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `format` | `string` | - | Preset for aspect ratio: `16:9` (active), `9:16` (stories/tiktok), `1:1` (square), `4:5` (portrait). |
| `width` | `number` | `1920` | Width in px (ignored if `format` is set). |
| `height` | `number` | `1080` | Height in px (ignored if `format` is set). |
| `fps` | `number` | `30` | Frames per second. |
| `quality`| `string` | `medium`| Preset: `ultrafast` to `veryslow`. |

### Clip Object
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `string` | `image` | `video` or `image`. |
| `src` | `string` | - | URL, Path, or Base64. |
| `duration` | `number` | `5` | Length in seconds. |
| `start` | `number` | `0` | Trim start time (Video only). |
| `effect` | `string` | `none` | `kenburns` (Image only). |

---

## 🔌 Integration (n8n & Webhooks)

VidierApi is designed for automation.
- **Polling**: Check `GET /api/status/:id` every few seconds until `status` is `completed`.
- **Webhooks**: (Coming Soon) Receive a POST request when rendering finishes.

### Response Structure (JSON)

#### ✅ Success (Job Processing/Completed)
The API returns HTTP 200 with the job details. The `status` field tells you the current state (`processing`, `completed`, `failed`).

```json
[
  {
    "success": true,
    "job": {
      "id": "3d48a485-424c-4bfd-a738-2ad8df03f896",
      "status": "completed",   // or "processing"
      "progress": 100,         // 0-100
      "createdAt": "2025-12-21T22:15:49.558Z",
      "updatedAt": "2025-12-21T22:16:05.196Z",
      "error": null,
      "outputUrl": "/api/download/3d48a485-424c-4bfd-a738-2ad8df03f896"
    }
  }
]
```

> **Tip**: You can append `?filename=custom_name.mp4` to the `outputUrl` to set the downloaded file name.

#### ❌ Logic Failure (Render Error)
If the rendering fails (e.g., corrupt file, timeout), the API still returns HTTP 200 (Success: true), but the **job status** is `failed` and the `error` field contains details.

```json
[
  {
    "success": true,
    "job": {
      "id": "3d48a485-424c-4bfd-a738-2ad8df03f896",
      "status": "failed",
      "progress": 95,
      "createdAt": "2025-12-21T22:15:49.558Z",
      "updatedAt": "2025-12-21T22:16:05.196Z",
      "error": "Render failed: ffmpeg exited with code 1",
      "outputUrl": null
    }
  }
]
```

#### 🚫 API Error (Not Found)
If you request a non-existent job, the API returns HTTP 404.

```json
{
  "success": false,
  "error": "Job not found"
}
```

For integration examples, see the `examples/` folder in the repository.

## ⚡ n8n Integration

We provide ready-to-use workflows for n8n:

1.  **HTTP Polling Workflow** (`examples/n8n-workflow-http-polling.json`): Uses standard HTTP nodes to submit a job, wait for completion, and download the result.
2.  **Custom Node Workflow** (`examples/n8n-workflow-custom-node.json`): Uses the `n8n-nodes-vidierapi` community node for a simpler experience.

---
<div align="center">
  <sub>Powered by VidierApi Engine v1.0</sub>
</div>
