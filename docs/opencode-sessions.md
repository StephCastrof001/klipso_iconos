# OpenCode — Setup de Sesiones/Sandboxes para klipso_iconos

## Cómo funciona OpenCode (mecanismo real)

OpenCode guarda proyectos y sesiones en SQLite:
- **DB location:** 
- **Tablas clave:** , , 

### Flujo de sesión = sandbox


### Cómo se genera el project ID
El ID del proyecto en OpenCode **es el hash del commit inicial** del repo git.
- claspo_main project ID: `dbe94bbc557696134e374d1a2a395597830eaa90`
- docs_dev project ID: `e544cab9ab8fbc1e20516627f60ef95ce6956254`

---

## Sesiones activas en claspo_main

| Session ID | Nombre (sidebar) | Worktree |
|---|---|---|
| ses_21e059e28ffemrBVWuzF5DsyO1 | Configurar .env con credenciales CLASPO | /home/ubuntu/claspo_main |
| ses_Cd5DVTODSVWPEgNT2zzmVa9l | Claspo — Recon (scraping + API map) | worktrees/recon |
| ses_uHCwZzkYhTva8y4KVRLNpkcb | Claspo — Templates (replicación) | worktrees/templates |
| ses_NS6AYlW1VrG14MaBQXP27Jq2 | Claspo — Builder (editor UI) | worktrees/builder |
| ses_ezFdwEuG6TMMrwk902j5yWVe | Claspo — Backend (triggers + API) | worktrees/backend |

---

## Comandos útiles

### Ver sesiones desde CLI
```bash
opencode session list
```

### Crear sesión nueva con título y mensaje
```bash
cd ~/claspo_main/worktrees/recon
opencode run --title "Mi sandbox" "primer mensaje de contexto"
```

### Insertar sesión directo en SQLite (sin correr AI)
```bash
PROJECT_ID='dbe94bbc557696134e374d1a2a395597830eaa90'
NOW=$(node -e 'console.log(Date.now())')
sqlite3 ~/.local/share/opencode/opencode.db "
INSERT INTO session (id, project_id, slug, directory, title, version, time_created, time_updated)
VALUES ('ses_XXXXX', '$PROJECT_ID', 'mi-slug',
        '/home/ubuntu/claspo_main/worktrees/WORKTREE',
        'Mi Sandbox', '1.14.30', $NOW, $NOW);
"
```

### Ver worktrees sin basura de OpenCode
```bash
wt   # alias en .bashrc: git worktree list | grep -v opencode/
```

---

## Estructura de worktrees del proyecto

```
~/claspo_main/           [main]    — trunk estable
  worktrees/
    recon/               [feat/recon]      — scraping Claspo
    templates/           [feat/templates]  — replicación de plantillas
    builder/             [feat/builder]    — editor UI
    backend/             [feat/backend]    — triggers + API
```

---

## OpenCode Web UI

- **URL:** http://107.21.24.49:4096
- **PID:** ver con `pgrep -a opencode`
- **Arrancar:** `cd ~/claspo_main && nohup opencode web --port 4096 --hostname 0.0.0.0 > /tmp/opencode-web.log 2>&1 &`
- **Detener:** `pkill -f 'opencode web'`

---

## Lecciones aprendidas

1. **No matar OpenCode sin confirmar** — las sesiones activas pueden tener trabajo sin commitear
2. **OpenCode crea opencode/* branches** automáticamente por sesión — son temporales
3. **Los project IDs** = hash del initial commit del repo
4. **Los worktrees manuales** (feat/*) NO aparecen como sandboxes — las sesiones SQLite sí
5. **Para pushear trabajo de un sandbox** a GitHub: el branch opencode/* se pushea y se hace PR a feat/* o main
