/**
 * OpenAPI 3.0 Specification for VidierApi
 * Modern, professional API documentation with interactive examples
 */

const openApiSpec = {
    openapi: '3.0.0',
    info: {
        title: '🎬 VidierApi',
        version: '1.0.0',
        description: `
## 🌟 Bienvenido a VidierApi

**VidierApi** es una potente API de renderizado de vídeos que te permite crear contenido visual dinámico mediante especificaciones JSON simples.

### ✨ Características principales

- 🎥 **Renderizado de vídeo profesional** con FFmpeg
- 📝 **Superposiciones de texto** personalizables con múltiples estilos
- 🖼️ **Presentaciones de diapositivas** con transiciones suaves
- 💧 **Marcas de agua** y logotipos
- 🎨 **Efectos Ken Burns** (zoom y paneo)
- 🔄 **Sistema de colas** con progreso en tiempo real
- 🎯 **Plantillas reutilizables** para workflows comunes
- 📊 **WebSocket** para actualizaciones en vivo

### 🚀 Inicio rápido

1. Envía un POST a \`/api/render\` con tu especificación JSON
2. Recibe un \`jobId\` de respuesta
3. Monitorea el progreso con \`/api/status/{jobId}\`
4. Descarga tu vídeo con \`/api/download/{jobId}\`

### ⚡ Integración con n8n

Automatiza la creación de vídeos conectando VidierApi con n8n. Ofrecemos dos formas de integración:

#### Opción 1: Nodos HTTP (Estándar)
Utiliza nodos HTTP estándar de n8n para enviar el trabajo, hacer polling del estado y descargar el resultado.
- [📥 Descargar Workflow JSON](/examples/n8n-workflow-http-polling.json)

<details>
<summary>👀 Ver JSON del Workflow (HTTP)</summary>

\`\`\`json
{
  "nodes": [
    {
      "parameters": {
        "amount": 10
      },
      "id": "ad5320f3-1193-407a-bd69-84a87a2cbef0",
      "name": "Esperar Inicio1",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        2880,
        2368
      ],
      "webhookId": "wait-initial"
    },
    {
      "parameters": {
        "url": "=http:/YOUR_SERVER:3002/api/status/{{ $('POST Render Job').first().json.jobId }}",
        "options": {}
      },
      "id": "cbb3c70b-7075-4882-8891-78ed61d2f688",
      "name": "GET Status1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        3056,
        2368
      ]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 1
          },
          "conditions": [
            {
              "id": "condition-1",
              "leftValue": "={{ $json.job.status }}",
              "rightValue": "completed",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "ada057fc-7a74-49c3-af11-820d980f975c",
      "name": "¿Completado?1",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [
        3232,
        2368
      ]
    },
    {
      "parameters": {
        "url": "=http://YOUR_SERVER:3002/api/download/{{ $json.job.id }}",
        "options": {
          "response": {
            "response": {
              "responseFormat": "file"
            }
          }
        }
      },
      "id": "76c11af7-11d9-4dff-ba3c-e5bcba923576",
      "name": "GET Download Video1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        3440,
        2256
      ]
    },
    {
      "parameters": {},
      "id": "3cdc50f5-7c3b-4ed3-86fe-3bc0fd8c062e",
      "name": "Esperar y Reintentar1",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        3440,
        2464
      ],
      "webhookId": "wait-loop"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 3
          },
          "conditions": [
            {
              "id": "67da7d27-c021-45c6-a27a-9b8b8609aaac",
              "leftValue": "={{ $json.job.status }}",
              "rightValue": "=processing",
              "operator": {
                "type": "string",
                "operation": "contains"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.3,
      "position": [
        3648,
        2464
      ],
      "id": "113f994a-ba46-4992-be2c-b762cabc812a",
      "name": "If1"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "eeafadfb-1189-4d3a-b1c8-fa7ef178966e",
              "name": "imagen_url",
              "value": "={{ $json.data }}",
              "type": "string"
            },
            {
              "id": "2825b203-dfc0-46e1-9515-7f4e0108714f",
              "name": "audio_url",
              "value": "={{ $('Edit Fields2').item.json.audio_url }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        2464,
        2368
      ],
      "id": "25ada0f8-7d7d-409b-b75d-2b3004a085f7",
      "name": "Edit Fields4"
    },
    {
      "parameters": {
        "content": "## Parser for URL names",
        "height": 208,
        "width": 288,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        2336,
        2320
      ],
      "id": "2b362c39-1bb3-4820-a1bf-66136d7d7ebe",
      "name": "Sticky Note"
    },
    {
      "parameters": {
        "content": "# Using HTTP nodes",
        "height": 576,
        "width": 1648,
        "color": 6
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        2288,
        2128
      ],
      "id": "8332037b-7d09-4429-a637-f035b08447f7",
      "name": "Sticky Note1"
    },
    {
      "parameters": {
        "content": "## Status requester",
        "height": 192,
        "width": 464,
        "color": 3
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        3392,
        2416
      ],
      "id": "ef7cc246-7b59-4a0f-ba8f-83fc7aac41c6",
      "name": "Sticky Note2"
    },
    {
      "parameters": {
        "content": "## Video downloader",
        "height": 208,
        "color": 7
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        3392,
        2192
      ],
      "id": "b8460456-d0ae-4250-b0e4-897aa00947ed",
      "name": "Sticky Note3"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "http://YOUR_SERVER:3002/api/render",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"image\": {\n    \"src\": \"{{ $json.imagen_url }}\",\n    \"effect\": \"kenburns\",\n    \"zoom\": 1.2\n  },\n  \"audio\": {\n    \"src\": \"{{ $json.audio_url }}\",\n    \"volume\": 0.7\n  },\n  \"config\": {\n    \"width\": 1280,\n    \"height\": 720,\n    \"fps\": 25,\n    \"preset\": \"fast\",\n    \"crf\": 28\n  }\n}",
        "options": {}
      },
      "id": "69e81963-8f98-4aa2-a92c-8cff21eaa2b1",
      "name": "POST Render Job",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2704,
        2368
      ]
    },
    {
      "parameters": {
        "content": "## Video upload and status request",
        "height": 208,
        "width": 528
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        2640,
        2320
      ],
      "id": "b35e7396-d8a3-488a-9b86-3a2c9b6a4477",
      "name": "Sticky Note7"
    }
  ],
  "connections": {
    "Esperar Inicio1": {
      "main": [
        [
          {
            "node": "GET Status1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "GET Status1": {
      "main": [
        [
          {
            "node": "¿Completado?1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "¿Completado?1": {
      "main": [
        [
          {
            "node": "GET Download Video1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Esperar y Reintentar1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "GET Download Video1": {
      "main": [
        []
      ]
    },
    "Esperar y Reintentar1": {
      "main": [
        [
          {
            "node": "If1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If1": {
      "main": [
        [
          {
            "node": "GET Status1",
            "type": "main",
            "index": 0
          }
        ],
        []
      ]
    },
    "Edit Fields4": {
      "main": [
        [
          {
            "node": "POST Render Job",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "POST Render Job": {
      "main": [
        [
          {
            "node": "Esperar Inicio1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "instanceId": "d605ba4d36d9204a8eb69f9137140d9f6f6c75e4b6861725e763c19e539e11aa"
  }
}
\`\`\`
</details>

#### Opción 2: Nodo Personalizado
Usa el nodo comunitario \`n8n-nodes-vidierapi\` para una experiencia simplificada.
- [📥 Descargar Workflow JSON](/examples/n8n-workflow-custom-node.json)

<details>
<summary>👀 Ver JSON del Workflow (Custom Node)</summary>

\`\`\`json
{
  "nodes": [
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "eeafadfb-1189-4d3a-b1c8-fa7ef178966e",
              "name": "imagen_url",
              "value": "={{ $json.data }}",
              "type": "string"
            },
            {
              "id": "2825b203-dfc0-46e1-9515-7f4e0108714f",
              "name": "audio_url",
              "value": "={{ $('Edit Fields2').item.json.audio_url }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        2448,
        2992
      ],
      "id": "9991a551-42bf-4493-8236-5bd3393922a3",
      "name": "Edit Fields5"
    },
    {
      "parameters": {
        "operation": "createVideoComplete",
        "imageUrl": "={{ $json.imagen_url }}",
        "imageDuration": null,
        "audioUrl": "={{ $json.audio_url }}"
      },
      "type": "CUSTOM.vidierApi",
      "typeVersion": 1,
      "position": [
        2720,
        2992
      ],
      "id": "7aa14189-6452-4a61-92cb-be1601495087",
      "name": "VidierApi1",
      "credentials": {
        "vidierApiApi": {
          "id": "ptmXBAadd1iDglux",
          "name": "VidierApi account"
        }
      }
    },
    {
      "parameters": {
        "content": "# Using Community node",
        "height": 480,
        "width": 688,
        "color": 5
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        2288,
        2720
      ],
      "id": "42f8006d-207d-41db-b9d9-1c72d374b7c8",
      "name": "Sticky Note4"
    },
    {
      "parameters": {
        "content": "## Parser for URL names",
        "height": 208,
        "width": 288,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        2352,
        2944
      ],
      "id": "0a928951-ed4c-41ed-ac6b-a569a90c573d",
      "name": "Sticky Note5"
    },
    {
      "parameters": {
        "content": "## Video creator",
        "height": 208,
        "width": 256,
        "color": 3
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        2656,
        2944
      ],
      "id": "ad41aa7e-b518-4540-ad44-4538a4d4295b",
      "name": "Sticky Note6"
    }
  ],
  "connections": {
    "Edit Fields5": {
      "main": [
        [
          {
            "node": "VidierApi1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "instanceId": "d605ba4d36d9204a8eb69f9137140d9f6f6c75e4b6861725e763c19e539e11aa"
  }
}
\`\`\`
</details>

### 📖 Recursos adicionales

- [Guía completa](https://github.com/tu-repo/API_GUIDE.md)
- [Ejemplos avanzados](https://github.com/tu-repo/examples)
- [Soporte](mailto:support@vidierapi.com)
`,
        contact: {
            name: 'VidierApi Team',
            email: 'support@vidierapi.com',
            url: 'https://vidierapi.com'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        }
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor de desarrollo'
        },
        {
            url: 'https://api.vidierapi.com',
            description: 'Servidor de producción'
        }
    ],
    tags: [
        {
            name: '🎬 Renderizado',
            description: 'Endpoints para crear y gestionar trabajos de renderizado de vídeo'
        },
        {
            name: '📊 Estado',
            description: 'Consultar y monitorear el estado de trabajos'
        },
        {
            name: '📥 Descarga',
            description: 'Descargar vídeos renderizados'
        },
        {
            name: '🎨 Plantillas',
            description: 'Gestionar y usar plantillas predefinidas'
        },
        {
            name: '📚 Ejemplos',
            description: 'Ejemplos de especificaciones para diferentes casos de uso'
        },
        {
            name: '🔧 Utilidades',
            description: 'Validación, health checks y herramientas'
        }
    ],
    paths: {
        '/api/render': {
            post: {
                tags: ['🎬 Renderizado'],
                summary: 'Crear un trabajo de renderizado',
                description: `
Crea un nuevo trabajo de renderizado de vídeo a partir de una especificación JSON.

### Flujo de trabajo:
1. Envía tu especificación (con o sin plantilla)
2. La API valida el formato
3. Se añade a la cola de renderizado
4. Recibes un \`jobId\` para seguimiento

### Características avanzadas:
- Soporte para plantillas reutilizables
- Validación automática de la especificación
- Procesamiento asíncrono con cola
- Notificaciones WebSocket en tiempo real
`,
                operationId: 'createRenderJob',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/VideoSpec'
                            },
                            examples: {
                                basic: {
                                    summary: '🎯 Vídeo básico',
                                    description: 'Imagen única con audio de fondo',
                                    value: {
                                        config: {
                                            width: 1920,
                                            height: 1080,
                                            fps: 30,
                                            audioBitrate: '128k'
                                        },
                                        assets: [
                                            {
                                                type: 'image',
                                                src: 'https://picsum.photos/1920/1080',
                                                start: 0,
                                                duration: 10
                                            },
                                            {
                                                type: 'audio',
                                                src: 'https://example.com/audio.mp3',
                                                start: 0,
                                                volume: 0.8
                                            }
                                        ]
                                    }
                                },
                                text: {
                                    summary: '✍️ Con texto superpuesto',
                                    description: 'Vídeo con superposiciones de texto personalizadas',
                                    value: {
                                        config: {
                                            width: 1920,
                                            height: 1080,
                                            fps: 30
                                        },
                                        assets: [
                                            {
                                                type: 'image',
                                                src: 'https://picsum.photos/1920/1080',
                                                start: 0,
                                                duration: 10
                                            }
                                        ],
                                        overlays: [
                                            {
                                                type: 'text',
                                                text: '¡Bienvenidos!',
                                                start: 0,
                                                duration: 3,
                                                position: { x: 'center', y: 100 },
                                                style: {
                                                    fontSize: 72,
                                                    fontColor: '#FFFFFF',
                                                    fontFamily: 'Arial',
                                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                                    padding: 20
                                                },
                                                animation: { fadeIn: 0.5, fadeOut: 0.5 }
                                            }
                                        ]
                                    }
                                },
                                slideshow: {
                                    summary: '🎞️ Presentación de diapositivas',
                                    description: 'Múltiples imágenes con transiciones',
                                    value: {
                                        config: {
                                            width: 1920,
                                            height: 1080,
                                            fps: 30
                                        },
                                        assets: [
                                            {
                                                type: 'image',
                                                src: 'https://picsum.photos/1920/1080?random=1',
                                                start: 0,
                                                duration: 3,
                                                transition: { type: 'fade', duration: 1 }
                                            },
                                            {
                                                type: 'image',
                                                src: 'https://picsum.photos/1920/1080?random=2',
                                                start: 3,
                                                duration: 3,
                                                transition: { type: 'fade', duration: 1 }
                                            },
                                            {
                                                type: 'image',
                                                src: 'https://picsum.photos/1920/1080?random=3',
                                                start: 6,
                                                duration: 3,
                                                transition: { type: 'fade', duration: 1 }
                                            }
                                        ]
                                    }
                                },
                                template: {
                                    summary: '📋 Usando plantilla',
                                    description: 'Renderiza usando una plantilla predefinida',
                                    value: {
                                        template: 'social-post',
                                        assets: [
                                            {
                                                type: 'image',
                                                src: 'https://picsum.photos/1080/1920'
                                            }
                                        ],
                                        overlays: [
                                            {
                                                type: 'text',
                                                text: '¡Mi contenido personalizado!'
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Trabajo creado exitosamente',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/RenderResponse'
                                },
                                example: {
                                    success: true,
                                    jobId: '1234567890_abc123',
                                    message: 'Render job queued successfully'
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Especificación inválida o plantilla no encontrada',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                examples: {
                                    validationError: {
                                        summary: 'Error de validación',
                                        value: {
                                            success: false,
                                            error: 'Invalid specification',
                                            details: [
                                                'config.width is required',
                                                'assets array must not be empty'
                                            ]
                                        }
                                    },
                                    templateNotFound: {
                                        summary: 'Plantilla no encontrada',
                                        value: {
                                            success: false,
                                            error: "Template 'invalid-name' not found"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/status/{jobId}': {
            get: {
                tags: ['📊 Estado'],
                summary: 'Obtener estado del trabajo',
                description: `
Consulta el estado actual de un trabajo de renderizado.

### Estados posibles:
- \`queued\` - En cola, esperando procesamiento
- \`processing\` - Renderizando actualmente
- \`completed\` - Completado exitosamente
- \`failed\` - Falló durante el procesamiento
- \`cancelled\` - Cancelado por el usuario

### Información incluida:
- Estado actual y progreso (%)
- Tiempo estimado restante
- Información de error (si aplica)
- Metadatos del trabajo
`,
                operationId: 'getJobStatus',
                parameters: [
                    {
                        name: 'jobId',
                        in: 'path',
                        required: true,
                        description: 'ID único del trabajo',
                        schema: {
                            type: 'string',
                            example: '1234567890_abc123'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Estado del trabajo',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/JobStatus'
                                },
                                examples: {
                                    queued: {
                                        summary: 'En cola',
                                        value: {
                                            success: true,
                                            job: {
                                                jobId: '1234567890_abc123',
                                                status: 'queued',
                                                progress: 0,
                                                createdAt: '2024-12-21T10:00:00Z'
                                            }
                                        }
                                    },
                                    processing: {
                                        summary: 'Procesando',
                                        value: {
                                            success: true,
                                            job: {
                                                jobId: '1234567890_abc123',
                                                status: 'processing',
                                                progress: 45,
                                                message: 'Rendering video...',
                                                startedAt: '2024-12-21T10:01:00Z'
                                            }
                                        }
                                    },
                                    completed: {
                                        summary: 'Completado',
                                        value: {
                                            success: true,
                                            job: {
                                                jobId: '1234567890_abc123',
                                                status: 'completed',
                                                progress: 100,
                                                outputPath: '/output/1234567890_abc123.mp4',
                                                completedAt: '2024-12-21T10:05:00Z',
                                                duration: 240
                                            }
                                        }
                                    },
                                    failed: {
                                        summary: 'Falló',
                                        value: {
                                            success: true,
                                            job: {
                                                jobId: '1234567890_abc123',
                                                status: 'failed',
                                                error: 'FFmpeg process failed: invalid codec',
                                                failedAt: '2024-12-21T10:02:30Z'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Trabajo no encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    success: false,
                                    error: 'Job not found'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/download/{jobId}': {
            get: {
                tags: ['📥 Descarga'],
                summary: 'Descargar vídeo renderizado',
                description: `
Descarga el vídeo completado. 

**Requisitos:**
- El trabajo debe estar en estado \`completed\`
- El archivo de vídeo debe existir en el servidor

El archivo se descarga con el nombre \`vidierapi_{jobId}.mp4\`
`,
                operationId: 'downloadVideo',
                parameters: [
                    {
                        name: 'jobId',
                        in: 'path',
                        required: true,
                        description: 'ID único del trabajo completado',
                        schema: {
                            type: 'string',
                            example: '1234567890_abc123'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Descarga del archivo de vídeo',
                        content: {
                            'video/mp4': {
                                schema: {
                                    type: 'string',
                                    format: 'binary'
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Vídeo no está listo',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    success: false,
                                    error: 'Video not ready',
                                    status: 'processing'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Trabajo o archivo no encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/cancel/{jobId}': {
            delete: {
                tags: ['🎬 Renderizado'],
                summary: 'Cancelar trabajo de renderizado',
                description: 'Cancela un trabajo que está en cola o procesando. No se puede cancelar trabajos ya completados.',
                operationId: 'cancelJob',
                parameters: [
                    {
                        name: 'jobId',
                        in: 'path',
                        required: true,
                        description: 'ID del trabajo a cancelar',
                        schema: {
                            type: 'string',
                            example: '1234567890_abc123'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Trabajo cancelado exitosamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Job cancelled successfully' }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'No se pudo cancelar el trabajo',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/templates': {
            get: {
                tags: ['🎨 Plantillas'],
                summary: 'Listar plantillas disponibles',
                description: `
Obtiene la lista de todas las plantillas predefinidas disponibles.

### ¿Qué son las plantillas?
Las plantillas son configuraciones reutilizables que facilitan la creación de vídeos con estilos consistentes.

### Uso:
1. Consulta las plantillas disponibles
2. Elige una que se ajuste a tus necesidades
3. Úsala en \`/api/render\` con el campo \`template\`
4. Personaliza solo lo que necesites
`,
                operationId: 'listTemplates',
                responses: {
                    200: {
                        description: 'Lista de plantillas',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        templates: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/Template'
                                            }
                                        }
                                    }
                                },
                                example: {
                                    success: true,
                                    templates: [
                                        {
                                            id: 'social-post',
                                            description: 'Formato vertical para redes sociales (1080x1920)',
                                            config: {
                                                width: 1080,
                                                height: 1920,
                                                fps: 30
                                            }
                                        },
                                        {
                                            id: 'youtube-intro',
                                            description: 'Intro profesional para YouTube (1920x1080)',
                                            config: {
                                                width: 1920,
                                                height: 1080,
                                                fps: 60
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/examples': {
            get: {
                tags: ['📚 Ejemplos'],
                summary: 'Obtener ejemplos de uso',
                description: `
Devuelve una colección de ejemplos completos listos para usar.

### Ejemplos incluidos:
- 🎯 Vídeo básico (imagen + audio)
- ✍️ Superposiciones de texto
- 💧 Marcas de agua
- 🎞️ Presentaciones de diapositivas
- 🌟 Combo profesional (todo incluido)

Cada ejemplo incluye el JSON completo que puedes copiar y enviar directamente a \`/api/render\`.
`,
                operationId: 'getExamples',
                responses: {
                    200: {
                        description: 'Lista de ejemplos',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        examples: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    name: { type: 'string' },
                                                    content: { type: 'object' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/validate': {
            post: {
                tags: ['🔧 Utilidades'],
                summary: 'Validar especificación',
                description: `
Valida una especificación de vídeo sin iniciar el renderizado.

**Útil para:**
- Verificar la sintaxis antes de renderizar
- Desarrollo y pruebas
- Validación en tiempo real en formularios
`,
                operationId: 'validateSpec',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/VideoSpec'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Resultado de la validación',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        error: { type: 'string' },
                                        details: {
                                            type: 'array',
                                            items: { type: 'string' }
                                        }
                                    }
                                },
                                examples: {
                                    valid: {
                                        summary: 'Configuración válida',
                                        value: {
                                            success: true,
                                            message: 'Configuration is valid'
                                        }
                                    },
                                    invalid: {
                                        summary: 'Configuración inválida',
                                        value: {
                                            success: false,
                                            error: 'Invalid configuration',
                                            details: [
                                                'config.width must be between 1 and 7680',
                                                'assets[0].duration is required'
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/health': {
            get: {
                tags: ['🔧 Utilidades'],
                summary: 'Health check',
                description: 'Verifica que el servidor esté funcionando correctamente',
                operationId: 'healthCheck',
                responses: {
                    200: {
                        description: 'Servidor saludable',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        status: { type: 'string', example: 'healthy' },
                                        timestamp: { type: 'string', format: 'date-time' },
                                        version: { type: 'string', example: '1.0.0' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            VideoSpec: {
                type: 'object',
                required: ['config', 'assets'],
                properties: {
                    template: {
                        type: 'string',
                        description: 'Nombre de plantilla opcional a aplicar',
                        example: 'social-post'
                    },
                    config: {
                        type: 'object',
                        required: ['width', 'height'],
                        properties: {
                            width: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 7680,
                                description: 'Ancho del vídeo en píxeles',
                                example: 1920
                            },
                            height: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 4320,
                                description: 'Alto del vídeo en píxeles',
                                example: 1080
                            },
                            fps: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 120,
                                description: 'Fotogramas por segundo',
                                default: 30,
                                example: 30
                            },
                            audioBitrate: {
                                type: 'string',
                                description: 'Bitrate del audio',
                                default: '128k',
                                example: '128k'
                            },
                            backgroundColor: {
                                type: 'string',
                                description: 'Color de fondo (hex)',
                                default: '#000000',
                                example: '#000000'
                            }
                        }
                    },
                    assets: {
                        type: 'array',
                        minItems: 1,
                        description: 'Lista de recursos (imágenes, vídeos, audio)',
                        items: {
                            oneOf: [
                                {
                                    type: 'object',
                                    required: ['type', 'src', 'start'],
                                    properties: {
                                        type: { type: 'string', enum: ['image'], example: 'image' },
                                        src: { type: 'string', format: 'uri', example: 'https://picsum.photos/1920/1080' },
                                        start: { type: 'number', minimum: 0, example: 0 },
                                        duration: { type: 'number', minimum: 0, example: 5 },
                                        transition: {
                                            type: 'object',
                                            properties: {
                                                type: { type: 'string', enum: ['fade', 'wipe', 'slide'], example: 'fade' },
                                                duration: { type: 'number', example: 1 }
                                            }
                                        },
                                        effect: {
                                            type: 'object',
                                            properties: {
                                                type: { type: 'string', enum: ['kenburns', 'zoom'], example: 'kenburns' },
                                                zoomStart: { type: 'number', example: 1.0 },
                                                zoomEnd: { type: 'number', example: 1.2 }
                                            }
                                        }
                                    }
                                },
                                {
                                    type: 'object',
                                    required: ['type', 'src', 'start'],
                                    properties: {
                                        type: { type: 'string', enum: ['audio'], example: 'audio' },
                                        src: { type: 'string', format: 'uri' },
                                        start: { type: 'number', minimum: 0, example: 0 },
                                        volume: { type: 'number', minimum: 0, maximum: 1, default: 1, example: 0.8 }
                                    }
                                }
                            ]
                        }
                    },
                    overlays: {
                        type: 'array',
                        description: 'Superposiciones de texto o imágenes',
                        items: {
                            type: 'object',
                            required: ['type'],
                            properties: {
                                type: { type: 'string', enum: ['text', 'image'], example: 'text' },
                                text: { type: 'string', example: 'Hola Mundo' },
                                src: { type: 'string', format: 'uri' },
                                start: { type: 'number', example: 0 },
                                duration: { type: 'number', example: 5 },
                                position: {
                                    type: 'object',
                                    properties: {
                                        x: { oneOf: [{ type: 'number' }, { type: 'string', enum: ['center', 'left', 'right'] }], example: 'center' },
                                        y: { oneOf: [{ type: 'number' }, { type: 'string', enum: ['center', 'top', 'bottom'] }], example: 100 }
                                    }
                                },
                                style: {
                                    type: 'object',
                                    properties: {
                                        fontSize: { type: 'integer', example: 48 },
                                        fontColor: { type: 'string', example: '#FFFFFF' },
                                        fontFamily: { type: 'string', example: 'Arial' },
                                        backgroundColor: { type: 'string', example: 'rgba(0,0,0,0.5)' },
                                        padding: { type: 'integer', example: 10 }
                                    }
                                },
                                animation: {
                                    type: 'object',
                                    properties: {
                                        fadeIn: { type: 'number', example: 0.5 },
                                        fadeOut: { type: 'number', example: 0.5 }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            RenderResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    jobId: { type: 'string', example: '1234567890_abc123' },
                    message: { type: 'string', example: 'Render job queued successfully' }
                }
            },
            JobStatus: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    job: {
                        type: 'object',
                        properties: {
                            jobId: { type: 'string', example: '1234567890_abc123' },
                            status: { type: 'string', enum: ['queued', 'processing', 'completed', 'failed', 'cancelled'], example: 'processing' },
                            progress: { type: 'number', minimum: 0, maximum: 100, example: 45 },
                            message: { type: 'string', example: 'Rendering video...' },
                            error: { type: 'string' },
                            outputPath: { type: 'string' },
                            createdAt: { type: 'string', format: 'date-time' },
                            startedAt: { type: 'string', format: 'date-time' },
                            completedAt: { type: 'string', format: 'date-time' },
                            failedAt: { type: 'string', format: 'date-time' },
                            duration: { type: 'number', description: 'Duración del procesamiento en segundos' }
                        }
                    }
                }
            },
            Template: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: 'social-post' },
                    description: { type: 'string', example: 'Formato vertical para redes sociales' },
                    config: {
                        type: 'object',
                        properties: {
                            width: { type: 'integer', example: 1080 },
                            height: { type: 'integer', example: 1920 },
                            fps: { type: 'integer', example: 30 }
                        }
                    }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'An error occurred' },
                    message: { type: 'string' },
                    details: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                }
            }
        }
    }
};

module.exports = openApiSpec;
