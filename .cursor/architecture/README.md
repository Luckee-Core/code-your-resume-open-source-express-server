# Architecture Documentation

This folder contains Architecture Decision Records (ADRs) for our Express server conventions and implementation patterns.

## Why ADRs?

ADRs document:
- **What** standards we follow
- **Why** we chose them
- **How** to apply them consistently

## ADR Index

1. [File & Domain Organization](./001-file-and-domain-organization.md) - Domain-based structure with one focused function per file.
2. [Router Factory & Handler Pattern](./002-router-factory-and-handler-pattern.md) - Keep routers thin and place request logic in handlers.
3. [Data Layer & CRUD Boundaries](./003-data-layer-crud-boundaries.md) - Isolate database CRUD in the data layer.
4. [Managed Clients & Startup Init](./004-managed-clients-and-startup-init.md) - Initialize shared clients and services at startup.
5. [Edge Functions & Railway Boundaries](./005-edge-functions-railway-only.md) - Keep edge functions limited to Railway orchestration boundaries.
6. [Logging & Error Response Standards](./006-logging-and-error-response-standards.md) - Use consistent logging and API error response behavior.
7. [CRM file vault & `/api/data`](./009-crm-file-vault-api-data.md) - File-backed CRM JSON and action-style routes under `src/api/data/`.
8. [Error log persistence](./010-error-log-persistence.md) - `thunk_errors`, `ui_errors`, `api_errors` under `src/data/{table}/`.
