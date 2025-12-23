# 🧪 Guía de Prueba - VidierApi n8n Node

## ✅ Estado de Instalación

- [x] Dependencias instaladas
- [x] TypeScript compilado
- [x] Servidor Docker corriendo en puerto 3002
- [x] npm link creado
- [x] Nodo vinculado con n8n

## 🚀 Iniciar n8n

```powershell
n8n start
```

Luego abre: **http://localhost:5678**

## 📝 Prueba 1: Create Video (Simple Mode)

### Configuración:
1. **Buscar nodo**: Escribe "VidierApi" en el buscador
2. **Añadir credenciales**:
   - API URL: `http://localhost:3002`
   - API Key: (opcional, déjalo vacío si no tienes)
3. **Seleccionar operación**: `Create Video`
4. **Config Mode**: `Simple (Form)`
5. **Video Format**: `YouTube (16:9)`
6. **Image URL**: `https://picsum.photos/1920/1080`
7. **Duration**: `5`
8. **Ken Burns Effect**: ✅ (activado)
9. **Text Overlay**: `¡Mi primer video con n8n!`
10. **Text Position**: `center`
11. **FPS**: `30`

### Resultado esperado:
```json
{
  "jobId": "abc123...",
  "status": "queued"
}
```

---

## 🎬 Prueba 2: Create Video Complete (con descarga automática)

### Configuración:
1. **Operación**: `Create Video Complete`
2. **Config Mode**: `Simple (Form)`
3. **Video Format**: `TikTok / Instagram Reels (9:16)`
4. **Image URL**: `https://images.unsplash.com/photo-1682687220742-aba13b6e50ba`
5. **Duration**: `3`
6. **Audio URL**: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`
7. **Audio Volume**: `0.5`
8. **Text**: `Video Vertical`
9. **Poll Interval**: `3` (cada 3 segundos)
10. **Timeout**: `300` (5 minutos máximo)
11. **Return Format**: `Binary Data`

### Resultado esperado:
- El nodo se queda "esperando" (spinner naranja)
- Consulta automáticamente el estado cada 3 segundos
- Cuando termina: descarga el video como binary data
- Puedes conectar con Google Drive, Dropbox, S3, etc.

---

## 🌐 Prueba 3: Public URL

### Configuración:
1. **Operación**: `Create Video Complete`
2. **Config Mode**: `Simple (Form)`
3. **Video Format**: `Instagram Square (1:1)`
4. **Image URL**: `https://picsum.photos/1080/1080`
5. **Duration**: `4`
6. **Text**: `URL Pública`
7. **Return Format**: `Public URL`

### Resultado esperado:
```json
{
  "jobId": "xyz789...",
  "status": "completed",
  "publicUrl": "http://localhost:3002/download/xyz789..."
}
```

Puedes copiar la URL y abrirla en el navegador para ver el video.

---

## 🔧 Prueba 4: Advanced Mode (JSON Raw)

### Configuración:
1. **Operación**: `Create Video`
2. **Config Mode**: `Advanced (JSON)`
3. **Video Specification**:
```json
{
  "config": {
    "format": "youtube",
    "fps": 30
  },
  "assets": [
    {
      "type": "image",
      "src": "https://picsum.photos/1920/1080",
      "start": 0,
      "duration": 5,
      "effect": "kenburns"
    },
    {
      "type": "audio",
      "src": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      "start": 0,
      "volume": 0.7
    }
  ],
  "overlays": [
    {
      "type": "text",
      "text": "Modo Avanzado",
      "start": 0,
      "duration": 5,
      "position": { "x": "center", "y": 100 },
      "style": {
        "fontSize": 60,
        "fontColor": "#FFD700",
        "backgroundColor": "rgba(0,0,0,0.8)",
        "padding": 30
      }
    }
  ]
}
```

### Resultado esperado:
```json
{
  "jobId": "advanced123..."
}
```

Luego usa `Get Status` con ese jobId.

---

## 📋 Prueba 5: Workflow Completo

Crea este workflow:

```
[Manual Trigger] 
    ↓
[VidierApi - Create Video Complete]
    ↓
[IF Condition: publicUrl exists]
    ↓
[Send Email] → Adjuntar video o enviar link
```

### Configuración IF:
- **Condition**: `{{ $json.publicUrl }}` exists

### Send Email:
- **To**: tu@email.com
- **Subject**: "Tu video está listo"
- **Body**: `Tu video: {{ $json.publicUrl }}`

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'vidier-api'"
```powershell
cd C:\Users\eddym\Downloads\VidierApi\n8n-nodes-vidierapi
npm link
cd $env:USERPROFILE\.n8n
npm link vidier-api
```

### Error: "Connection refused"
Verifica el servidor:
```powershell
docker ps | Select-String "vidierapi"
```

Si no está corriendo:
```powershell
cd C:\Users\eddym\Downloads\VidierApi
docker-compose up -d
```

### El nodo no aparece en n8n
1. Detén n8n (Ctrl+C)
2. Limpia caché:
```powershell
Remove-Item -Recurse -Force $env:USERPROFILE\.n8n\cache
```
3. Reinicia n8n:
```powershell
n8n start
```

### Timeout en Create Video Complete
- Aumenta el **Timeout** a 600 (10 minutos)
- Verifica que FFmpeg esté funcionando en Docker:
```powershell
docker logs vidierapi-app --tail 50
```

---

## 📊 Verificar Logs

### Logs del servidor:
```powershell
docker logs vidierapi-app -f
```

### Logs de n8n:
Se muestran directamente en la terminal donde corriste `n8n start`

---

## ✨ Próximos Pasos

1. **Probar diferentes formatos**: YouTube, TikTok, Instagram
2. **Combinar con otros nodos**: Google Sheets, HTTP Request, Email
3. **Crear workflows automáticos**: Trigger + Loop + VidierApi
4. **Experimentar con templates**: Cuando los agregues al servidor

---

## 📞 Soporte

- API Docs: http://localhost:3002/api/docs
- Ejemplos: `examples.json`
- README completo: `README.md`

¡Listo para probar! 🎉
