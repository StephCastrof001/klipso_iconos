# Builder Architecture

## Qué hace el Editor de Claspo

### Inputs (Configuración recibida)

El Claspo Editor SDK se inicializa con una configuración extensa que incluye:

- **Container Element**: HTMLElement donde se monta el editor (debe tener tamaño definido)
- **Theme**: Personalización visual global (colores, fuentes, componentes)
- **API Configuration**: Endpoints HTTP para operaciones CRUD
- **Available Components Panel**: Definición de qué componentes mostrar en el panel izquierdo
- **User Info/Context**: Identidad del usuario y preferencias de idioma
- **Static Resources URL**: Base para assets (imágenes, fuentes)
- **Notification Handlers**: Callbacks para mensajes (success/error/warning/info)
- **Proyecto Configs**: Configuraciones globales (pausas, países, ab-testing)
- **Teaser/Localization/Google Fonts**: Opcionalidades avanzadas

### Outputs (Qué produce)

El editor produce principalmente dos tipos de datos:

1. **Appearance Model (Document Model)**: JSON completo que define:
   - Estructura del widget como árbol anidado de componentes
   - Props y propiedades de cada elemento
   - Adaptive styles (desktop/mobile)
   - Layout y positioning
   - Eventos de interacción

2. **API Methods**:
   - `init(config, onLoaded, onError)`: Inicializa el editor
   - `save(params?)`: Persiste cambios (opcional publishChanges)
   - `destroy()`: Limpieza de recursos
   - `getComponentManifests()`: Obtener todos los manifests disponibles
   - `getDocumentErrors()`: Validación del documento actual
   - `cancel()`: Discard sin guardar
   - `closeEditorCallback(payload)`: Callback al cerrar

---

## Stack Tecnológico para la Réplica

### Frontend

- **Next.js 14**: Framework principal con App Router y Server Components
- **TypeScript**: Type safety total
- **Tailwind CSS**: Estilos rápidos y consistentes
- **React**: UI library (versión 18+)
- **Drag & Drop**: `@dnd-kit/core` o `react-dnd` (preferencia DND Kit por modularidad)

### Backend

- **Node.js / Fastify**: Servidor ligero y performante
- **PostgreSQL**: Storage principal + ORM
- **Redis**: Caché y sesiones
- **S3-compatible**: Storage para assets (imágenes, templates JSON)
- **Prisma**: ORM para DB interactions

### Editor Core

- **React-Drag-Drop**: `@dnd-kit/core` para lógica drag-drop
- **Proptypes Validation**: Zod o Yup para validar props de componentes
- **JSON Schema**: Librería para serializar/deserializar el documento

### Component Rendering

- **Vanilla JS SDK**: <15KB gzipped (objetivo Claspo)
- **Shadow DOM**: Para encapsulación de estilos
- **Lightweight Render**: No React para el canvas de preview (mejor performance)

---

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js App                              │
│  ┌────────────────┐  ┌─────────────┐  ┌──────────────────────┐  │
│  │  /editor       │  │ /preview    │  │  /api/w/[id]         │  │
│  │  (Main Page)   │  │             │  │                      │  │
│  └──────┬─────────┘  └─────┬───────┘  └──────────────────────┘  │
│         │                  │                                      │
│  ┌──────▼──────────────────▼────────────────────────────────┐   │
│  │                    Editor Container                       │   │
│  │  (Full-width div with fixed size - required by SDK)       │   │
│  └──────┬──────────────────┬────────────────────────────────┘   │
│         │                  │                                      │
│    ┌────▼────┐         ┌───▼─────────────┐                      │
│    │  Left   │         │  Canvas (Preview)│                      │
│    │  Panel  │         │                  │                      │
│    │ (Widget │         │ ┌──────────────┐ │                      │
│    │ Types:  │         │ │              │ │                      │
│    │ Popups, │         │ │  Widget Tree │ │                      │
│    │ Banners,│         │ │              │ │                      │
│    │ Embeds, │         │ └───┬──────────┘ │                      │
│    │ Forms,  │         │    │              │                      │
│    │ Gamify, │         │    │      ┌────────┐                     │
│    │ Social  │         │    │      │ Widget │                     │
│    │ Proof   │         │    │      ├────────┤                     │
│    │         │         │    │      │         ├──┐                  │
│    └─────────┘         │    │      └──────────┼──┘                  │
│                        │    │                 │                     │
│                ┌───────▼────▼─────────────────▼──┐                 │
│                │        Property Pane (Right)    │                 │
│                │  (Control Props/Styles/Context) │                 │
│                └─────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tree Structure

```
┌─────────────────────┐
│   Editor Container  │ (Full-screen editor UI)
│   (Next.js Page)    │
└──────────┬──────────┘
           │
   ┌───────┼─────────┬─────────────────────────────────────┐
   │       │         │   ┌────────┐   ┌──────────────────┐  │
   │       │         │   │Canvas  │   │  Widget          │  │
   │       │         │   │Wrapper │   │  Root (Layout)   │  │
   │       │         │   │        │   │                  │  │
   │   ┌───▼──────┐  │   │  ┌────┐│   │  ┌──────────────┐│  │
   │   │          │  │   │  │    ││   │  │              ││  │
   │   │  Widget  │  │   │  └────┘│   │  │  Section     ││  │
   │   │  Tree    │  │   │        │   │  │              ││  │
   │   │          │  │   │  ┌────┐│   │  │  ┌──────────┐│  │
   │   │  ┌─────┐ │  │   │  │    ││   │  │  │  Element ││  │
   │   │  │     │ │  │   │  └────┘│   │  │  │  Tree    ││  │
   │   │  │     │ │  │   │        │   │  │  │          ││  │
   │   │  │     │ │  │   │  ┌────┐│   │  │  │  ├───────┼│  │
   │   │  │     │ │  │   │  │    ││   │  │  │  │  │    ││  │
   │   │  │     │ │  │   │  └────┘│   │  │  │  │  │    ││  │
   │   │  │     │ │  │   │        │   │  │  │  │  │    ││  │
   │   │  └─────┘ │  │   │        │   │  │  │  │  ├────┼│  │
   │   │          │  │   │        │   │  │  │  │  │    ││  │
   │   └──────────┘  │   │        │   │  │  │  │  │    ││  │
   │                  │   │        │   │  │  │  │  │    ││  │
└─────────────────────┘   │   └────┘   │   └──────────┘   │
                          │            │                   │
┌─────────────────────────┼────────────┤   ┌──────────────┐ │
│         Backend API      │            │   │  Asset       │ │
│     (Fastify Service)  │            │   │  Storage (S3)│ │
│                        │            │   │              │ │
└────────────────────────┘            │   └──────────────┘ │
                                      └────────────────────┘
                                      │
                              ┌───────▼────────┐
                              │  PostgreSQL    │
                              │  (Document     │
                              │   JSON Storage)│
                              └────────────────┘
```

### Component Props Flow

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  Left Panel  │       │   Canvas     │       │ Right Panel  │
│ (Component   │       │ (Preview)    │       │ (Properties) │
│  Selector)   │       │              │       │              │
└──────┬───────┘       └──────┬───────┘       └────┬─────────┘
       │                      │                    │
       │  drag/drop action    │  render props      │  observe changes
       │  → creates          │  → visual feedback │  → updates state
       └─────────────────────┼─────────────────────┼───────────┘
                             │                     │
                       ┌─────▼──────────┐   ┌─────▼──────────┐
                       │   Document     │   │   Component    │
                       │   State (Zustand)│   │   Props       │
                       │  [Component    │   │   [Props Model]│
                       │  Tree]         │   │  [Adaptive]    │
                       └────────────────┘   └────────────────┘
                               │                    │
                               │     ┌──────────────▼──────────────┐
                               └────►│   Backend API (Fastify)     │
                                     │  - GET  /api/w/:id          │
                                     │  - POST /api/w/:id          │
                                     │  - PUT  /api/w/:id          │
                                     │  - DELETE /api/w/:id        │
                                     └──────────────────────────────┘
                                          │
                                          ▼
                                      ┌─────────────┐
                                      │ PostgreSQL │
                                      │  + Redis    │
                                      └─────────────┘
```

---

## Estado del Proyecto Actual

### Directorio Estructura

```
builder/
├── backend/
│   ├── api/               # Fastify endpoints
│   ├── analytics/         # Tracking eventos
│   ├── segmentation/      # Segmentación + Triggers
│   └── triggers/          # Lógica de disparos
├── builder/editor/        # 📝 NEXT: Aquí irá el editor
│   ├── components/        # Componentes React del UI del editor
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utilities
│   └── SPEC.md            # 📝 Next: Tech spec detallada
├── frontend/              # App principal (dashboard, etc)
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusables
│   └── hooks/
├── docs/
│   └── builder-architecture.md  # 📝 Ahora mismo
└── templates/             # Template storage
```

### Phases

1. **Fase 1 — Reconocimiento**: Documentar estructura Claspo (ACTUAL)
2. **Fase 2 — Arquitectura**: Specs y diagramas (EN PROGRESO)
3. **Fase 3 — Editor Core**: Implementar canvas drag-drop
4. **Fase 4 — Component Library**: Componentes base (text, button, form...)
5. **Fase 5 — Backend**: API + Storage

---

## Tipos de Componentes a Soportar

### Layout Components

| Tipo | Claspo Const | Descripción |
|------|--------------|-------------|
| Popup | `DETACHED` | Modal overlay centrado |
| Built-in | `BUILT_IN` | Embed en contenido de página |
| Floating Box | `FLOATING_BOX` | Caja fija en esquina |
| Floating Bar | `FLOATING_BAR` | Barra top/bottom fija |
| Launcher | `LAUNCHER` | Botón trigger para otro widget |
| Content Locker | `CONTENT_LOCKER` | Overlay fullscreen |

### Funcionales

| Tipo | Claspo Const | Descripción |
|------|--------------|-------------|
| Subscription | `SUBSCRIPTION_FORM` | Captura email/contacto |
| Informer | `INFORMER` | Solo info |
| Request | `REQUEST_FORM` | Data general |
| Age Verify | `AGE_VERIFY` | Gate de verificación de edad |
| Teaser | `TEASER` | Preview/teaser |

### Gamification

- Spin Wheel
- Scratch Card
- Advent Calendar
- Prize Pool

---

## Schema JSON de Salida (Ejemplo Simplificado)

```json
{
  "type": "WIDGET",
  "layout": "BUILT_IN",
  "placement": {
    "selector": "#hero",
    "insertType": "AFTER_BEGIN"
  },
  "appearance": [
    {
      "environment": "DESKTOP",
      "widgets": [
        {
          "type": "SECTION",
          "props": {},
          "children": [
            {
              "type": "ELEMENT",
              "componentType": "TEXT",
              "manifestName": "SysTextComponent",
              "props": {
                "content": { "text": "Hello World" },
                "adaptiveStyles": {
                  "desktop": [
                    { "element": "host", "styleAttributes": { "width": "100%" } },
                    { 
                      "element": "text-content", 
                      "styleAttributes": { "color": "#333", "fontSize": "16px" } 
                    }
                  ],
                  "mobile": [
                    { 
                      "element": "text-content", 
                      "styleAttributes": { "fontSize": "14px" } 
                    }
                  ]
                }
              },
              "layout": {
                "width": "100%",
                "marginTop": "0px",
                "marginBottom": "0px"
              }
            }
          ]
        }
      ]
    },
    {
      "environment": "MOBILE",
      "widgets": [ ... ]
    }
  ]
} // Misma estructura, styles adaptados
```
