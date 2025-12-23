# VidierApi Improvement Roadmap 🚀

This document outlines planned improvements and potent features for future development.

## 🌟 High Impact Enhancements

### 1. 🧠 Smart Crop & Auto-Resize (AI)
Automatically convert horizontal (16:9) videos to vertical (9:16) for TikTok/Reels/Shorts by detecting and tracking the main subject.
- **Tech**: TensorFlow.js or FFmpeg `cropdetect` + generic AI object detection.
- **Benefit**: Massive value for content repurposing workflows.

### 2. 🎞️ Mixed Content Timeline
Allow mixing images and video clips seamlessly in the same timeline.
- **Status**: Basic "Video Clips Input" is being implemented.
- **Future**: Full NLE (Non-Linear Editor) capabilities with per-clip adjustments, overlapping, and complex transitions between mismatched media types (image -> video).

### 3. ☁️ Cloud Storage Integration
Direct upload to S3, Cloudflare R2, or Google Cloud Storage.
- **Why**: Keeps the server stateless and allows easy integration with n8n/Make without downloading large files from the API server.
- **Feature**: Return `publicUrl` in the response instead of just `jobId`.

### 4. ⚡ Async Webhooks
Instead of polling `/api/jobs/:id`, the server calls a webhook URL when rendering is complete.
- **Payload**: `{ "jobId": "...", "status": "completed", "url": "..." }`
- **Benefit**: Perfect for n8n/Zapier automations.

### 5. 🎨 Advanced Transitions 2.0
Custom GLSL shaders for transitions (Glitch, Burn, Warp).
- **Tech**: GLTransitions integration with FFmpeg.

### 6. 📦 n8n Community Node
Package this API as a native n8n node.
- **Benefit**: Drag-and-drop experience for users, hiding the JSON complexity.

## 🛠️ Infrastructure & Performance

- **GPU Acceleration**: NVIDIA NVENC support in Docker (requires GPU instance).
- **Cluster Mode**: Horizontal scaling of worker nodes with shared Redis/Storage.
- **Cache Layer**: Cache downloaded assets (images/music) to avoid redownloading common stock assets.

---
*Created: 2025-12-21*
