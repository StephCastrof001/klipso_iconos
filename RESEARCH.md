# Benchmark — Competitor Analysis

## Objetivo
Analizar repos open source similares a Claspo para informar decisiones de arquitectura
en klipso_iconos: data models, patrones de editor, y estructura de SDK.

---

## popwola/ — Popup Builder (81 ⭐)
**Repo original:** https://github.com/NiazMorshed2007/popwola
**Stack:** Next.js + Appwrite + shadcn/ui + TypeScript

### Qué tiene útil para klipso
- **Template library**: colección de popups prediseñados — ver  para data model
- **No-code editor**: editor visual con preview antes de publicar
- **Timeline control**: fecha inicio/fin por campaña → patrón para triggers por fecha
- **Un script JS para todos los popups** → misma arquitectura que el SDK de klipso

### Dónde mirar primero
- `package.json` → dependencias del editor
- Appwrite collections → schema de popup/template en DB
- `/app` → estructura de rutas Next.js

---

## deer-flow/ — Widget Builder (2 ⭐)
**Repo original:** https://github.com/deer-flow/widget-builder
**Stack:** TypeScript + pnpm monorepo + turbo + Monaco + React

### Qué tiene útil para klipso
- **Patrón core del builder:**
  `JSX en Monaco → parseJSXTemplate() → schema JSON → WidgetRenderer → React`
- **Packages separados:**
  - `@deer-flow/widget` → definiciones de componentes
  - `@deer-flow/widget-renderer` → renderizado (usado en editor preview Y en SDK cliente)
- **`inferDataSchemaFromState()`** → validación automática del estado del widget

### Dónde mirar primero
- `packages/widget-renderer/` → cómo convierte schema → React
- `apps/widget-builder/` → cómo Monaco se integra con el renderer
- `packages/widget/` → tipos y definiciones de widgets

---

## Mapa de decisiones para klipso_iconos

| Módulo klipso | Referencia | Archivo clave |
|---|---|---|
| Template data model | popwola | Appwrite schema / `src/types` |
| Editor drag-drop | deer-flow | `apps/widget-builder/` |
| SDK inyectable | deer-flow | `packages/widget-renderer/` |
| Triggers por fecha | popwola | Timeline control feature |
| JSON schema de widget | deer-flow | `inferDataSchemaFromState` |

---

## Claspo SDK oficial
- Docs: https://docs.claspo.io/docs/claspoeditor
- Specs generadas en este repo:
  - `../builder/docs/builder-architecture.md`
  - `../builder/editor/SPEC.md`
