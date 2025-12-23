# VidierApi n8n Node - Guía de Instalación y Prueba

## 📦 Instalación del Nodo

### Opción 1: Instalación Local para Desarrollo

```bash
cd n8n-nodes-vidierapi

# Instalar dependencias
npm install

# Compilar el nodo
npm run build

# Vincular globalmente
npm link

# En tu instalación de n8n
cd ~/.n8n
npm link vidier-api

# Reiniciar n8n
n8n start
```

### Opción 2: Instalación desde npm (Cuando publiques)

1. Abre n8n
2. Ve a **Settings → Community Nodes**
3. Click en **Install**
4. Ingresa: `vidier-api`
5. Click en **Install**

## 🧪 Prueba del Nodo

### 1. Configurar Credenciales

1. En n8n, añade un nuevo nodo **VidierApi**
2. Click en **Create New Credentials**
3. Ingresa:
   - **API URL**: `http://localhost:3002` (o tu URL)
   - **API Key**: (opcional, déjalo vacío por ahora)
4. Click en **Save**

### 2. Workflow de Prueba Simple

```
[Manual Trigger]
    ↓
[VidierApi]
    - Operation: Create Video Complete
    - Config Mode: Simple (Form)
    - Video Format: YouTube (16:9)
    - Image URL: https://picsum.photos/1920/1080
    - Duration: 5 segundos
    - Text Overlay: "¡Hola desde n8n!"
    - Return Format: Binary Data
    ↓
[Move Binary Data] (opcional)
```

### 3. Workflow Avanzado con JSON

```json
{
  "config": {
    "format": "9:16"
  },
  "assets": [
    {
      "type": "image",
      "src": "https://picsum.photos/1080/1920",
      "start": 0,
      "duration": 10,
      "effect": "kenburns"
    }
  ],
  "audio": {
    "src": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "volume": 0.7
  },
  "overlays": [
    {
      "type": "text",
      "text": "¡Creado con VidierApi!",
      "position": { "x": "center", "y": "bottom" },
      "style": {
        "fontSize": 48,
        "fontColor": "#FFFFFF"
      }
    }
  ]
}
```

## 📊 Casos de Uso

### Caso 1: Generación Automática desde Webhooks

```
[Webhook] (recibe imagen URL y texto)
    ↓
[VidierApi - Create Video Complete]
    - Image: {{$json.imageUrl}}
    - Text: {{$json.caption}}
    - Return: Public URL
    ↓
[HTTP Request - Send to user]
```

### Caso 2: Procesamiento por Lotes

```
[Google Sheets - Read]
    ↓
[Loop Over Items]
    ↓
[VidierApi - Create Video Complete]
    - Template: social-post
    - Return: Binary
    ↓
[Google Drive - Upload]
```

### Caso 3: Con Monitoreo

```
[VidierApi - Create Video]
    ↓
[Set Variable] (guarda jobId)
    ↓
[Wait 5 seconds]
    ↓
[VidierApi - Get Status]
    ↓
[IF status === 'completed']
    ↓
[VidierApi - Download Video]
```

## 🐛 Solución de Problemas

### El nodo no aparece en n8n

1. Verifica que compilaste: `npm run build`
2. Verifica que enlazaste: `npm link`
3. Reinicia n8n completamente
4. Revisa logs: `~/.n8n/logs/`

### Error de conexión

1. Verifica que VidierApi esté corriendo: `docker ps`
2. Verifica la URL en credenciales
3. Prueba el endpoint: `curl http://localhost:3002/api/health`

### Timeout en Create Video Complete

1. Aumenta el timeout en la configuración del nodo
2. Verifica que el video no sea muy complejo
3. Revisa los logs de VidierApi: `docker logs vidierapi-app`

## 📝 Próximos Pasos

1. ✅ Probar todas las operaciones
2. ✅ Documentar ejemplos adicionales
3. 🔄 Crear el Trigger Node (polling automático)
4. 🚀 Publicar en npm

## 🚀 Publicación

Cuando estés listo para publicar:

```bash
# 1. Actualiza la versión
npm version patch  # o minor, o major

# 2. Build final
npm run build

# 3. Prueba localmente
npm pack
# Revisa el archivo .tgz generado

# 4. Publicar
npm publish --access public

# 5. El nodo estará disponible en:
# https://www.npmjs.com/package/vidier-api
```

## 📚 Recursos

- [n8n Community Nodes Docs](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [VidierApi Docs](http://localhost:3002/api/docs)
