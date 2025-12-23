# 🎬 VidierApi - Sistema Completo

VidierApi es un sistema profesional de generación de videos desde JSON usando FFmpeg, con API REST, interfaz web moderna, CLI y soporte completo para n8n.

## ✅ Estado del Proyecto

**TODO IMPLEMENTADO Y FUNCIONANDO**

- ✅ Backend Node.js + Express + FFmpeg
- ✅ API REST con 6 endpoints
- ✅ WebSocket real-time progress (Socket.io)
- ✅ BullMQ job queue con Redis
- ✅ Modern Web UI (Glassmorphism)
- ✅ CLI profesional (Inquirer + Chalk)
- ✅ Docker deployment
- ✅ n8n workflow template
- ✅ Render test exitoso (31.3s, 11.7MB)

---

## 📁 Estructura del Proyecto

```
VidierApi/
├── src/
│   ├── api/
│   │   ├── routes.js          # REST endpoints
│   │   ├── validator.js       # Joi schemas
│   │   └── jobQueue.js        # BullMQ queue
│   ├── cli/
│   │   └── index.js           # CLI tool
│   ├── config/
│   │   └── index.js           # Configuration
│   ├── renderer/
│   │   ├── assetManager.js    # Asset download/processing
│   │   ├── commandBuilder.js  # FFmpeg command generation
│   │   └── executor.js        # FFmpeg execution
│   ├── utils/
│   │   ├── logger.js          # Winston logger
│   │   └── fileUtils.js       # File operations
│   └── server.js              # Express + Socket.io
├── public/
│   ├── index.html             # Web UI
│   ├── css/styles.css         # Glassmorphism design
│   └── js/app.js              # Frontend + WebSocket
├── examples/
│   ├── basic.json             # Example render spec
│   └── n8n-workflow-template.json  # n8n template
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Docker (Recomendado)

```bash
docker-compose up -d
```

Accede a: **http://localhost:3002**

### Local

```bash
npm install
docker run -d -p 6379:6379 redis:7-alpine
npm start
```

---

## 📖 Documentación

### API REST

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/render` | POST | Crear job de render |
| `/api/status/:jobId` | GET | Consultar progreso |
| `/api/download/:jobId` | GET | Descargar video |
| `/api/cancel/:jobId` | DELETE | Cancelar job |
| `/api/health` | GET | Health check |
| `/api/schema` | GET | JSON schema |

### JSON Spec Básico

```json
{
  "image": {
    "src": "https://example.com/image.jpg",
    "effect": "kenburns",
    "zoom": 1.3
  },
  "audio": {
    "src": "https://example.com/audio.mp3",
    "volume": 0.8
  },
  "config": {
    "width": 1920,
    "height": 1080,
    "fps": 30
  }
}
```

### n8n Integration

Importa: `examples/n8n-workflow-template.json`

URLs a usar (ajustar a tu IP):
- POST: `http://TU_IP:3002/api/render`
- GET Status: `http://TU_IP:3002/api/status/:jobId`
- GET Download: `http://TU_IP:3002/api/download/:jobId`

---

## 🎯 Casos de Uso Actuales

✅ **Imagen + Audio → Video**
- Ken Burns effect (zoom)
- Auto-duration matching
- Custom resolution/fps
- Quality presets

---

## 🔮 Roadmap - Próximas Funcionalidades

### Nivel 1 - Básico
- [ ] Múltiples imágenes con transiciones
- [ ] Text overlays con fuentes custom
- [ ] Subtítulos (SRT)
- [ ] Más efectos (fade, slide, wipe)

### Nivel 2 - Intermedio
- [ ] Multiple audio tracks (mix)
- [ ] Color grading (LUTs)
- [ ] Logos/watermarks
- [ ] Templates predefinidos

### Nivel 3 - Avanzado
- [ ] Video clips como input
- [ ] Chromakey/green screen
- [ ] Batch processing
- [ ] Cloud storage (S3, R2)

### Nivel 4 - Profesional
- [ ] n8n Community Node
- [ ] API key authentication
- [ ] Usage analytics
- [ ] Template marketplace

---

## 📊 Performance

**Render Test Actual:**
- Input: 800x600 image + MP3 audio
- Output: 1280x720 @ 25fps
- Effect: Ken Burns zoom
- Time: **31.3 seconds**
- Size: **11.7 MB**

---

## 🛠️ Tech Stack

- **Backend**: Node.js 18, Express 4
- **Rendering**: FFmpeg 4.4
- **Queue**: BullMQ + Redis 7
- **WebSocket**: Socket.io 4
- **Frontend**: Vanilla JS + Custom CSS
- **CLI**: Inquirer + Chalk + Ora
- **Deployment**: Docker + Docker Compose
- **Validation**: Joi
- **Logging**: Winston

---

## 📝 Configuración

Puerto por defecto: **3002**

Variables importantes en `.env`:
```env
PORT=3002
REDIS_HOST=localhost
FFMPEG_THREADS=4
MAX_CONCURRENT_JOBS=3
```

---

## 🤝 Contribuir

Próximos pasos sugeridos:
1. Implementar text overlays
2. Agregar más transiciones
3. Crear templates library
4. Desarrollar n8n Community Node

---

## 📧 Soporte

- Logs: `docker logs -f vidierapi-app`
- Health: `http://localhost:3002/api/health`
- Schema: `http://localhost:3002/api/schema`

---

**Estado:** Producción ✅  
**Versión:** 1.0.0  
**Última actualización:** 2025-12-20
