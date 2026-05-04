# MISIÓN: ASPIRADORA CLASPO

**LEGAL NOTICE**: All reverse-engineering activities must have explicit authorization, comply with applicable laws and terms of service, and must not involve distribution of proprietary assets or credentials.

## Objetivo
Reverse engineering completo de Claspo para replicar su producto.

## Fase 1 — Recon de Templates (ACTIVO)

### Tareas
1. [ ] Descarga MASIVA de assets desde CDN Claspo
2. [ ] Crawling de galería de templates → capturar JSONs de estructura
3. [ ] Mirroring de librerías CSS/JS del widget SDK
4. [ ] Mapear API endpoints (auth, templates, campaigns, analytics)
5. [ ] Generar assets_inventory.md con estructura completa

### Categorías a mapear
- [ ] Popups (exit-intent, timed, scroll-triggered)
- [ ] Banners (top-bar, bottom-bar, floating)
- [ ] Embeds (inline, form blocks)
- [ ] Gamification (spin wheel, scratch card, advent calendar)
- [ ] Social proof (notification bubbles, counters)

## Credenciales
Ver .env (ignorado por git — nunca commitear). Maintain a redacted `.env.example` alongside the ignored `.env` for documentation. Explicitly redact any captured secrets in JSON/logs/artifacts before committing. Apply least-privilege scoping for all credentials and use secret scanning/CI checks to prevent accidental exposure.

## Output esperado
-  — JSONs crudos de cada template
-  — mapa completo de la API
-  — CSS, JS, imágenes del CDN
-  — capturas visuales de cada categoría
