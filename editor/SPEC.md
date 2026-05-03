# Editor Specification

## Types of Elements Supported

### Layout Containers

| Type | Constant | ComponentType | Description |
|------|----------|---------------|-------------|
| Section | `SECTION` | `SECTION` | Nivela contenedor (layout principal) |
| Column | `COLUMN` | `COLUMN` | Columna para grid/flex layouts |
| Row | `ROW` | `ROW` | Flex row container |
| Detached | `DETACHED` | `WRAPPER_DETACHED` | Contenedor para widgets detached (popups) |

### Basic Elements

| Type | Constant | ComponentType | Manifest | Description |
|------|----------|---------------|----------|-------------|
| Text | `TEXT` | `TEXT` | `SysTextComponent` | Texto/HTML estático dinámico |
| Button | `BUTTON` | `BUTTON` | `SysButtonComponent` | Botón con click actions |
| Image | `IMAGE` | `IMAGE` | `SysImageComponent` | Imagen de URL o Upload S3 |
| HTML | `HTML` | `HTML` | `SysHtmlComponent` | HTML inline |

### Form Components

| Type | Constant | ComponentType | Manifest | Description |
|------|----------|---------------|----------|-------------|
| Input Text | `INPUT_TEXT` | `INPUT_TEXT` | `SysTextInputComponent` | Single line text input |
| Input Textarea | `INPUT_TEXTAREA` | `INPUT_TEXTAREA` | `SysTextareaComponent` | Multi-line text |
| Input Number | `INPUT_NUMBER` | `INPUT_NUMBER` | `SysNumericInputComponent` | Numeric input |
| Input Select | `INPUT_SELECT` | `INPUT_SELECT` | `SysSelectInputComponent` | Dropdown select |
| Input Checkbox | `INPUT_CHECKBOX` | `INPUT_CHECKBOX` | `SysCheckboxComponent` | Boolean checkbox |
| Input Radio | `INPUT_RADIO` | `INPUT_RADIO` | `SysRadioInputComponent` | Radio buttons |

### Advanced Components

| Type | Constant | ComponentType | Manifest | Description |
|------|----------|---------------|----------|-------------|
| Icon | `ICON` | `ICON` | `SysIconComponent` | System icons (FontAwesome-like) |
| HTML5 Select | `HTML5_SELECT` | `INPUT_HTML5_SELECT` | `SystemSelectInputComponent` | Custom HTML5 select |
| Rich Text | `EDITOR_RICH` | `EDITOR_RICH` | `SystemRichTextInputComponent` | WYSIWYG rich text |
| Dynamic Fields | `DYNAMIC_FIELDS` | `INPUT_DYNAMIC_FIELDS_INPUT` | `SystemRichTextInputComponent` | Dynamic multi-value inputs |

### Special Components

| Type | Constant | ComponentType | Manifest | Description |
|------|----------|---------------|----------|-------------|
| Prize Option | `PRIZE_POOL` | `SYSTEM_PRIZE_POOL` | `SystemPrizePoolComponent` | Gamification prize pool |
| Age Verify | `AGE_VERIFY` | `SYSTEM_AGE_VERIFY` | `SystemAgeVerifyComponent` | Age gate verification |

---

## JSON Output Schema (DB Storage)

### Root Document Schema

```typescript
interface DocumentModel {
  type: 'WIDGET'
  layout: 'BUILT_IN' | 'DETACHED' | 'FLOATING_BOX' | 'FLOATING_BAR' | 'LAUNCHER' | 'CONTENT_LOCKER'
  placement?: {
    selector: string
    insertType?: 'BEFORE_BEGIN' | 'AFTER_BEGIN' | 'BEFORE_END' | 'AFTER_END' | 'REPLACE'
  }
  appearance: AppearanceModel[]  // Desktop + Mobile appearances
  views: ViewDefinition[]        // Multi-step flows (optional)
}

interface AppearanceModel {
  environment: 'DESKTOP' | 'MOBILE'
  widgets: WidgetDefinition[]    // Tree of widgets
}
```

### Widget Tree Schema

```typescript
interface WidgetDefinition {
  type: 'WRAPPER_SECTION' | 'WRAPPER_ROW' | 'WRAPPER_COLUMN' | 'WRAPPER_DETACHED' | 'ELEMENT'
  layout: Partial<LayoutParams>
  responsiveControls: Partial<ResponsiveControlConfig>
  contextMenuModel?: ContextMenuModel[]
  floatingControlsModel?: FloatingControlModel[]
  
  children?: WidgetDefinition[]  // For containers
  
  // For ELEMENT type
  componentType?: string
  manifestName?: string
  
  // For any type
  props?: Record<string, any>
  i18nPropPaths?: string[]
  
  // i18n support
  i18n?: Partial<{
    [lang: string]: Record<string, any>
  }>
}

interface LayoutParams {
  width: number | string | 'fill' | 'hug'
  height?: number | string | 'fill' | 'hug'
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  paddingBottom?: number
  paddingTop?: number
  paddingLeft?: number
  paddingRight?: number
  zIndex?: number
  borderRadius?: number
  shadow?: boolean
}

interface ResponsiveControlConfig {
  desktop?: Partial<LayoutParams>
  mobile?: Partial<LayoutParams>
  tablet?: Partial<LayoutParams>
}
```

### Props Schema

```typescript
interface BaseProps {
  // Common controls (via floatingControlsModel)
  responsiveControls: Partial<ResponsiveControlConfig>
  contextMenuModel?: ContextMenuModel[]
  floatingControlsModel?: FloatingControlModel[]
  
  // i18n
  i18nPropPaths?: string[]
  i18n?: {
    [lang: string]: { [key: string]: string }
  }
}

interface TextProps {
  // Required
  content: {
    text?: string           // Plain text mode
    html?: string           // Rich HTML mode
  }
  // Styling
  adaptiveStyles: {
    desktop: AdaptiveStyleRule[]
    mobile: AdaptiveStyleRule[]
  }
  // Text params (from propertyPaneModel TEXT_PARAMS)
  textTransform?: 'lowercase' | 'uppercase'
  textColor?: string
  fontSize?: string
  lineSpace?: string
  lineSpaceAvailable?: boolean
  lineHeight?: string
  lineHeightAvailable?: boolean
}

interface ButtonProps {
  action: {
    type: 'OPEN_LINK' | 'CLOSE_WIDGET' | 'GO_TO_VIEW' | 'DISPATCH_EVENT'
    config: any
  }
  // Text
  content: { text: string; html?: string }
  // Styling
  adaptiveStyles: {
    desktop: AdaptiveStyleRule[]
    mobile: AdaptiveStyleRule[]
  }
  // Button specific
  buttonHeight?: string
  btnSize?: 'SMALL' | 'MEDIUM' | 'LARGE'
  disabled?: boolean
  showLoader?: boolean
  loaderStyle?: 'INHERIT' | 'SOLID' | 'RIM'
  isLoaderVisible?: boolean
  actionType?: 'OPEN' | 'GO' | 'CLOSE' | 'SUBSCRIBE'
  isActionTypeAvailable?: boolean
}

interface ImageProps {
  content: {
    image: string                // URL or S3: "s3://bucket/folder/image.jpg"
    alt?: string
  }
  adaptiveStyles: {
    desktop: AdaptiveStyleRule[]
    mobile: AdaptiveStyleRule[]
  }
  imageHeight?: string
  maxImageHeight?: string
  imageWidth?: string
  minImageWidth?: string
  adaptiveImageLayout?: 'AUTO' | 'WIDE' | 'TALL'
  isImageLayoutAvailable?: boolean
  useS3Storage?: boolean
  adaptiveImageSizes?: {
    desktop?: string
    tablet?: string
    mobile?: string
  }
}

interface InputTextProps {
  action: {
    type: 'SUBSCRIBE_CONTACT'
    config: {
      fields: { [fieldName: string]: string }
    }
  }
  adaptiveStyles: {
    desktop: AdaptiveStyleRule[]
    mobile: AdaptiveStyleRule[]
  }
  // Text param labels
  placeholder?: string
  isPlaceholderAvailable?: boolean
  isLabelAvailable?: boolean
  label?: string
  inputType?: 'text' | 'email' | 'number' | 'url' | 'tel'
  maxLength?: number
  minLines?: number
  maxLines?: number
  isMaxLengthAvailable?: boolean
  isMultiLineAvailable?: boolean
}

interface SelectProps {
  content: {
    options: { text: string; value: string }[]
  }
  action: {
    type: 'SUBSCRIBE_CONTACT'
    config?: { fields: { [fieldName: string]: string } }
  }
  adaptiveStyles: {
    desktop: AdaptiveStyleRule[]
    mobile: AdaptiveStyleRule[]
  }
  // Text param labels
  placeholder?: string
  isPlaceholderAvailable?: boolean
  isLabelAvailable?: boolean
  label?: string
  isCustomText?: boolean
  customText?: { type: string; text: string }[]
  minLines?: number
  maxLines?: number
}

interface CheckboxProps {
  action: {
    type: 'SUBSCRIBE_CONTACT'
    config: {
      fields: { [fieldName: string]: string }
    }
  }
  adaptiveStyles: {
    desktop: AdaptiveStyleRule[]
    mobile: AdaptiveStyleRule[]
  }
  // Text param labels
  placeholder?: string
  isPlaceholderAvailable?: boolean
  isLabelAvailable?: boolean
  label?: string
  isCustomText?: boolean
  customText?: { type: string; text: string }[]
}

interface RichTextProps {
  content: {
    // HTML mode
    html?: string
    // Plain text mode
    text?: string | { [key: string]: string }
  }
  adaptiveStyles: {
    desktop: AdaptiveStyleRule[]
    mobile: AdaptiveStyleRule[]
  }
}

interface IconProps {
  content: { icon: string }  // Icon name
  adaptiveStyles: {
    desktop: AdaptiveStyleRule[]
    mobile: AdaptiveStyleRule[]
  }
  adaptiveIconColors?: {
    desktop?: string
    tablet?: string
    mobile?: string
  }
  adaptiveIconSizes?: {
    desktop?: string
    tablet?: string
    mobile?: string
  }
}
```

### Adaptive Style Rule

```typescript
interface AdaptiveStyleRule {
  element: 'host' | string        // 'host' = component root, or custom element name
  styleAttributes: {
    width?: string
    minWidth?: string
    height?: string
    minHeight?: string
    marginTop?: string
    marginBottom?: string
    marginLeft?: string
    marginRight?: string
    paddingTop?: string
    paddingBottom?: string
    paddingLeft?: string
    paddingRight?: string
    marginBottomEnabled?: boolean
    marginTopEnabled?: boolean
    marginLeftEnabled?: boolean
    marginRightEnabled?: boolean
    paddingTopEnabled?: boolean
    paddingBottomEnabled?: boolean
    paddingLeftEnabled?: true
    paddingRightEnabled?: true
    textAlign?: string
    color?: string
    fontSize?: string
    lineHeight?: string
    fontWeight?: string
    fontStyle?: string
    textShadow?: string
    textDecoration?: string
    textTransform?: string
    cursor?: string
    backgroundColor?: string
    backgroundImage?: string
    border?: string
    borderRadius?: string
  }
  isPaddingEnabled?: boolean
}
```

### Component Manifest

Each component registers itself with a manifest:

```typescript
interface ComponentManifest {
  name: string                           // Class name
  componentType: string                  // TEXT, BUTTON, IMAGE, etc.
  version: string                        // Semantic versioning
  props: ComponentProps                  // Props schema with defaults
  // Optional: Editor UI controls
  floatingControlsModel?: any[]
  contextMenuModel?: any[]
  propertyPaneModel?: {
    content: any[]
  }
  i18nPropPaths?: [string]
  metaDescription: {
    icon: string
    label: { [lang: string]: string }
  }
}
```

---

## Events Emitted

### Widget Events (to Backend)

| Event Type | Constant | Trigger | Data Payload |
|-----------|----------|---------|--------------|
| Visibility | `VISIBILITY_EVENT` | Widget enters viewport | `{ visible: boolean; environment: string }` |
| Close | `CLOSE_WIDGET` | Close button click | `{ trigger: string; widgetModel: DocumentModel }` |
| Submit | `CONTACT_DATA_SUBMIT` | Form submission | `{ contactId: string; raw: { [field: string]: any } }` |
| Click | `WIDGET_CONTENT_CLICKED` | Any widget click | `{ element: string; widgetModel: DocumentModel }` |
| Show | `SHOW_WIDGET` | Widget displayed | `{ widgetModel: DocumentModel }` |

### Component Events

| Event | Description |
|-------|-------------|
| `connectedCallback()` | Component mounted (lifecycle) |
| `observeProps(prev, next)` | Props changed - update rendered content |
| `applyAutoAdaptiveStyles(styles)` | Apply responsive styles |
| `focus()` | Focus component (for inline editing) |
| `actionClick()` | Custom action trigger |

### Custom Actions

```typescript
interface DocumentAction {
  type: 'OPEN_LINK' | 'CLOSE_WIDGET' | 'GO_TO_VIEW' | 'DISPATCH_EVENT' | ...
  config: Record<string, any>
  onAction: (actionType: string, widgetModel: DocumentModel) => void
  widgetModel: DocumentModel
}
```

### Example Action Types

```typescript
enum DocumentActionType {
  SUBSCRIBE_CONTACT = 'SUBSCRIBE_CONTACT',
  GO_TO_VIEW = 'GO_TO_VIEW',
  GO_TO_PREVIOUS_VIEW = 'GO_TO_PREVIOUS_VIEW',
  GO_TO_NEXT_VIEW = 'GO_TO_NEXT_VIEW',
  OPEN_LINK = 'OPEN_LINK',
  OPEN_URL = 'OPEN_URL',
  CLOSE_WIDGET = 'CLOSE_WIDGET',
  SHOW_WIDGET = 'SHOW_WIDGET',
  DISPATCH_EVENT = 'DISPATCH_EVENT'
}
```

### Action Payloads

```typescript
// OPEN_LINK action:
{
  url: string,
  newWindow: boolean,
  customData: {
    ios: string,    // iOS app custom URL
    android: string // Android app custom URL
  },
  track: boolean    // Track click
}

// CLOSE_WIDGET action:
{
  trigger: string   // What triggered close
}

// GO_TO_VIEW action:
{
  index: number,    // Which step/view
  viewName: string  // Alternative: name-based
}

// DISPATCH_EVENT action:
{
  type: string,     // Custom event type
  detail: { [key: string]: any }
}
```

---

## Editor UI Events (Internal)

Event Flow: Editor → Backend

```typescript
interface EditorEvent {
  type: 'SAVE' | 'CLOSE' | 'LOAD' | 'PUBLISH'
  payload: {
    documentModel: DocumentModel
    widgetVariant?: any
    appearances: AppearanceModel[]
    publishStatus: 'FOR_ALL' | 'PAUSED' | 'DEBUG'
    user?: { id: string; email: string }
  }
}
```

### Editor Methods (Public API)

```typescript
class.EditorAPI {
  // Initialize
  init(config: EditorConfig, onLoaded?: () => void, onError?: () => void): void
  destroy(): void
  cancel(): void  // Unsaved discard

  // Persistence
  save(params?: { publishChanges?: boolean }): void

  // Data
  getComponentManifests(): ComponentManifest[]
  getDocumentErrors(): ValidationError[]
  getDocumentModel(): DocumentModel
  getWidgetVariant(): any

  // Preview
  openPreview(): void
  closePreview(): void

  // Properties (optional callbacks from config)
  closeEditorCallback(payload: { variant: any }): void
  getRevisionPayloadCallback(payload: { variant: any; appearances: any[]; publishStatus: string }): void
}
```

---

## Property Pane Schema

Defined in `component.manifest.propertyPaneModel`:

```typescript
interface PropertyPaneModel {
  content: PaneGroup[]  // Groups of controls
}

interface PaneGroup {
  type: 'GROUP'
  propPath: string        // Dot notation path to props
  children: ControlItem[]
}

interface ControlItem {
  type: 'CONTROL' | 'GROUP'
  name: string            // Internal control name
  element?: string        // Target element (optional)
  elementProp?: string    // Property path to element
  params?: any            // Control config
  
  // For text params
  textParams?: {
    element: string
    isLineSpaceAvailable?: boolean
    isTextTransformAvailable?: boolean
  }[]
  
  // For size/indentation controls
  indentationType?: 'MARGIN' | 'PADDING'
  widthOptions?: ('fixed' | 'fill' | 'hug')[]
  heightOptions?: ('fixed' | 'hug')[]
}
```

### Floating Controls

```typescript
interface FloatingControlModel {
  type: 'GROUP'
  propPath: string
  children: {
    type: 'CONTROL'
    name: 'SIZE' | 'MARGIN' | 'PADDING'
    elementProp: string
    element: 'host'
  }[]
}
```

---

## Context Menu Schema

```typescript
interface ContextMenuModel {
  type: 'GROUP'
  propPath: string
  children: {
    type: 'CONTROL'
    name: 'COMPONENT_OPERATIONS' | 'FOCUS_PARENT_COMPONENT'
    icon?: any
    shortcut?: string
    callback?: (...args: any[]) => any
  }[]
}
```

Component Operations provide: Copy, Paste, Delete, Move Up/Down

---

## i18n Schema

```typescript
interface ComponentI18n {
  i18nPropPaths: [string]  // Comma-separated prop paths
  
  // Or component-level i18n:
  i18n: {
    [lang: string]: {
      // Keys can come from textParams, labels, placeholder
      'content.text': string
      'customText[0].text': string
      'label': string
      'placeholder': string
    }
  }
}
```

---

## Responsive Breakpoints

Standard breakpoints (aligned with Tailwind):

```typescript
interface BreakpointConfig {
  desktop: string   // Default: "1400px" or "100%"
  tablet: string    // Optional: "768px"
  mobile: string    // Optional: "400px"
}
```

Default: Desktop | Mobile (2 breakpoints)

---

## Asset Storage Format

### S3 Path Format

```
"s3://bucket/folder/path/to/file.jpg"
```

Decoded to full URL:

```
"https://cdn.example.com/static/bucket/folder/path/to/file.jpg"
```

### Image Sources

| Source | Type | Format |
|--------|------|--------|
| URL | `content.image` | Full URL |
| Upload | `s3://...` | S3 path |
| System | `content.icons` | System icon name |
| Local (Editor) | `assets://editor/...` | Temp editor storage |

---

## Performance Targets

| Metric | Goal |
|--------|------|
| SDK Bundle Size | <15KB gzipped |
| Editor Startup | <2s |
| Canvas Render | 60fps |
| Drag-Drop Latency | <100ms |
| JSON Save | <1s |

---

## Backend API Contract

### Endpoints

```typescript
// GET /api/w/:id
// Fetch document and appearances
interface GetDocumentResponse {
  id: string
  widgetModel: DocumentModel
  appearances: AppearanceModel[]
  widgetVariant?: any
  publishStatus: 'FOR_ALL' | 'PAUSED' | 'DEBUG'
  languagesUsed?: string[]
  languageUsed?: string
}

// PUT /api/w/:id
// Save/Update document
interface SaveDocumentPayload {
  documentModel: DocumentModel
  appearances: AppearanceModel[]
  widgetVariant?: any
  publishStatus: 'FOR_ALL' | 'PAUSED' | 'DEBUG'
  languagesUsed?: string[]
  languageUsed?: string
  user?: { id: string; email: string }
}

// POST /api/w/:id/publish/:lang
// Publish version in language
interface PublishPayload {
  documentModel: DocumentModel
  appearances: AppearanceModel[]
  widgetVariant?: any
}
```

### Triggers

```typescript
// POST /api/triggers/:id
interface TriggerPayload {
  triggerId: string
  triggerType: 'ON_VISIBILITY' | 'ON_CLICK' | 'ON_SUBMIT' | ...
  triggerConfig: any
}
```

---

## File Structure (Final)

```
builder/
├── backend/editor/
│   ├── api/
│   │   ├── index.ts                    # Main Fastify server
│   │   ├── documents/
│   │   │   ├── index.ts                # CRUD documents
│   │   │   ├── get.ts                  # GET /api/w/:id
│   │   │   └── save.ts                 # PUT /api/w/:id
│   │   └── triggers/
│   │       └── index.ts                # Trigger management
│   └── types/
│       └── document.ts                 # DocumentModel types
├── builder/editor/
│   ├── components/
│   │   ├── Canvas/
│   │   │   ├── index.tsx               # Main Canvas
│   │   │   └── widgets/
│   │   │       └── WidgetTree.tsx      # Widget tree UI
│   │   ├── PropertyPane/
│   │   │   ├── index.tsx               # Property pane UI
│   │   │   └── controls/
│   │   │       ├── index.tsx
│   │   │       ├── SizeControl.tsx
│   │   │       ├── MarginControl.tsx
│   │   │       └── TextParamsControl.tsx
│   │   ├── LeftPanel/
│   │   │   └── ...                     # Component picker
│   │   └── EditorToolbar/
│   │       └── ...                     # Toolbar
│   ├── hooks/
│   │   ├── useDocument.ts              # Zustand store
│   │   ├── useDnd.ts                   # Drag-drop logic
│   │   └── useAutoStyle.ts             # Style auto-apply
│   ├── store/
│   │   └── document.ts                 # DocumentState
│   ├── utils/
│   │   ├── components/
│   │   │   └── createComponentRegistry.ts
│   │   └── dnd/
│   │       └── useDragDropTree.ts
│   └── specs/
│       ├── components/                 # Component specs per type
│       └── api/
│           └── contracts.ts            # API contracts
├── docs/
│   └── builder-architecture.md
└── templates/
    └── schemas/                        # JSON schemas for validation
        ├── component-schema.ts
        └── document-schema.ts
```
