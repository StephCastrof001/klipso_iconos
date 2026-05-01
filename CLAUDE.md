# klipso_iconos — CLAUDE.md

## Objetivo
Replicar Claspo completamente: templates, editor, backend de triggers, SDK de inyección.

## Fase actual
**FASE 1 — RECON**: Scrapear y documentar todas las templates y estructura de productos de Claspo.

## Stack
- Frontend: Next.js 14 + TypeScript + Tailwind
- Backend: Node.js / Fastify
- Storage: PostgreSQL + S3 (templates JSON)
- SDK: Vanilla JS (<15KB gzipped)

## Workflow Git
- Branches: feat/desc, fix/desc, chore/desc
- Commits: feat:, fix:, chore:, docs:, refactor:
- Siempre via PR, nunca directo a main
- Un agente por worktree

## Categorías de templates Claspo a replicar
1. Popups (exit-intent, timed, scroll)
2. Banners (top-bar, bottom-bar, announcement)
3. Embeds (inline forms, content blocks)
4. Gamification (spin wheel, scratch card, advent calendar)
5. Social proof (notification bubbles, counters)

## Secretos
- .env nunca se commitea
- Variables requeridas: ver .env.example
