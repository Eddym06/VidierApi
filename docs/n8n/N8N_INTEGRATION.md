# VidierApi - n8n Integration Guide

## Quick Start for n8n

VidierApi is now running and ready to receive requests from n8n! 🚀

### HTTP Request Node Configuration

Use the following configuration in your n8n **HTTP Request** node:

```
Method: POST
URL: http://localhost:3002/api/render
Authentication: None
Content-Type: application/json
```

### Example Request Body

```json
{
  "image": {
    "src": "{{ $json.imageUrl }}",
    "effect": "kenburns",
    "zoom": 1.3
  },
  "audio": {
    "src": "{{ $json.audioUrl }}",
    "volume": 0.8
  },
  "config": {
    "width": 1920,
    "height": 1080,
    "fps": 30
  }
}
```

### Expected Response

```json
{
  "success": true,
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Render job queued successfully"
}
```

### Complete Workflow Example

1. **HTTP Request Node** - Submit Render Job
   - Method: `POST`
   - URL: `http://localhost:3002/api/render`
   - Body: JSON specification (see above)
   - Output: `jobId`

2. **Loop Node** - Poll for Completion
   - Type: Run Once for Each Item
   - **HTTP Request** inside loop:
     - Method: `GET`
     - URL: `http://localhost:3002/api/status/{{ $json.jobId }}`
   - **IF Node**: Check if `job.status === 'completed'`
   - **Wait Node**: 2 seconds between polls

3. **HTTP Request Node** - Download Video
   - Method: `GET`
   - URL: `http://localhost:3002/api/download/{{ $json.job.id }}`
   - Response Format: `File`
   - Output: MP4 video file

4. **Your Custom Logic**
   - Upload to cloud storage (S3, Dropbox, etc.)
   - Send email with attachment
   - Post to social media
   - Store in database

### URL Formats Supported

**Image Sources:**
- HTTP URL: `https://example.com/image.jpg`
- HTTPS URL: `https://images.unsplash.com/photo-123`
- Base64: `data:image/jpeg;base64,/9j/4AAQSkZJRg...`
- n8n Binary Data: Use "Convert to File" node first

**Audio Sources:**
- HTTP URL: `https://example.com/audio.mp3`
- HTTPS URL: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`
- Base64: `data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAA...`
- n8n Binary Data: Use "Convert to File" node first

### API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/render` | POST | Submit render job |
| `/api/status/:jobId` | GET | Check job status |
| `/api/download/:jobId` | GET | Download video |
| `/api/cancel/:jobId` | DELETE | Cancel job |
| `/api/health` | GET | Health check |
| `/api/schema` | GET | Get API schema |

### Status Values

- `queued` - Job is in queue
- `processing` - Rendering in progress
- `completed` - Video is ready
- `failed` - Error occurred (check `job.error`)
- `cancelled` - Job was cancelled

### Error Handling

Always check the `success` field in responses:

```javascript
if ($json.success) {
  // Process successful response
  return $json.jobId;
} else {
  // Handle error
  throw new Error($json.error);
}
```

### Tips for Production

1. **Add Timeout**: Set a maximum wait time (e.g., 10 minutes)
2. **Error Retry**: Use n8n's retry on error feature
3. **Webhook Alternative**: Subscribe to progress via WebSocket for instant updates
4. **File Size**: Maximum 500MB per asset (configurable in .env)
5. **Concurrent Jobs**: Max 3 simultaneous renders (configurable)

---

## 🎯 Ready to Test!

Your VidierApi server is running at:
- **API Base URL**: `http://localhost:3002/api`
- **Web UI**: `http://localhost:3002`

Try it now in n8n! 🚀
