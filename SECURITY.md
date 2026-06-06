# Security

## Supported use

This server stores CRM data in **Supabase** (required) and may call **Anthropic**, **Cursor**, and outbound HTTP for job listing import using secrets from the environment. Intended for **local / trusted** networks unless you add your own controls.

## Reporting a vulnerability

Use GitHub private security advisories when available. Do not post exploit details in public issues before coordination.

## Controls (built-in)

- **Listen address:** Defaults to **`127.0.0.1`** (not LAN-wide). Set **`HOST=0.0.0.0`** only for containers or hosts that need external binding.
- **`CRM_API_SECRET`:** When set, `/api/data/*` and studio routes require `X-CRM-API-Key` or `Authorization: Bearer`. Omit for fully open local stacks on loopback only.
- **CORS:** In **`NODE_ENV=production`**, `CORS_ORIGINS=*` is **ignored** (falls back to localhost defaults). Use a comma-separated allowlist for real cross-origin browser access to Express.
- **JSON bodies:** Limited to **1mb** on `express.json` / `urlencoded`.
- **Outbound URLs:** Job listing / website fetch validates URLs (http/https, blocks loopback, private RFC1918 ranges, and **169.254.169.254**). Not a complete SSRF barrier for every edge case.
- **Optional AI routes:** When `ANTHROPIC_API_KEY` or `CURSOR_API_KEY` is unset, generation routes fail gracefully with error JSON.

## OSS security audit notes (2026-06-05)

| Area | Status | Notes |
|------|--------|-------|
| Env split | Pass | All model/DB keys server-only |
| Auth model | Documented | Local operator trust; optional CRM_API_SECRET |
| CORS | Documented | Production `*` ignored |
| Expensive routes | Partial | AI/Cursor routes — document local-only deployment |

## Scope

This file does not replace penetration testing or compliance review.
