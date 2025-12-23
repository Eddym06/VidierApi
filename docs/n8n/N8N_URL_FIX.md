# 🔧 Solución al Error: "Invalid URL"

## 🔴 El Error

```
Invalid URL: =http://100.65.156.108:3002/api/status/...
URL must start with "http" or "https"
```

n8n está interpretando el `=` como parte de la URL.

---

## ✅ SOLUCIÓN 1: Editar en la Interfaz de n8n

### Nodo "GET Status":

1. Abre el nodo **"GET Status"**
2. Haz click en el campo **URL**
3. Verifica que esté en modo **Expression** (ícono ⚙️ o fx)
4. Borra el `=` del inicio
5. La URL debe ser:

```
http://100.65.156.108:3002/api/status/{{ $('POST Render Job').item.json.jobId }}
```

### Nodo "GET Download Video":

1. Abre el nodo **"GET Download Video"**
2. Campo **URL** en modo Expression
3. Sin `=` al inicio:

```
http://100.65.156.108:3002/api/download/{{ $json.job.id }}
```

---

## ✅ SOLUCIÓN 2: Reimportar Workflow Corregido

He actualizado: `examples/n8n-workflow-FIXED-LOOP.json`

**Importa el workflow** y debería funcionar de inmediato.

---

## 📋 Verificación en n8n

Cuando edites un nodo HTTP Request, verifica:

```
┌─────────────────────────────────────────────┐
│ URL                                         │
│ ┌─────────────────────────────────────────┐ │
│ │ http://100.65.156.108:3002/api/status/  │ │
│ │ {{ $('POST Render Job').item.json.jobId }}│
│ └─────────────────────────────────────────┘ │
│                                      [⚙️ fx] │ ← Debe estar activo
└─────────────────────────────────────────────┘
```

**NO debe tener `=` al inicio en el campo visual**

---

## 🎯 Resumen

| Campo | Incorrecto ❌ | Correcto ✅ |
|-------|--------------|------------|
| JSON | `"url": "http://..."` | `"url": "http://..."` |
| n8n UI | `=http://...` | `http://...` (en modo Expression) |

El `=` es solo para el JSON cuando n8n lo exporta, NO se escribe manualmente en la interfaz.

---

**Reimporta o edita manualmente y debería funcionar** 🚀
