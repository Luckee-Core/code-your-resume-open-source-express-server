# Contributing

Thanks for helping improve the Code Your Resume Express API.

## Before you code

1. Read [`.cursor/architecture/README.md`](.cursor/architecture/README.md) and [`.cursor/rules/AGENTS.md`](.cursor/rules/AGENTS.md).
2. Companion web repo: [code-your-resume-open-source](https://github.com/Luckee-Core/code-your-resume-open-source).
3. Wire contract: [web repo `docs/wire-contract.md`](https://github.com/Luckee-Core/code-your-resume-open-source/blob/main/docs/wire-contract.md).
4. OSS standards: [mentorai-server `data/open-source/`](https://github.com/luckee/mentorai-server/tree/main/data/open-source).

## Patterns (short)

- HTTP in `src/api/data/{entity}/` and `src/api/{feature}/`; CRUD in `src/data/{entity}/`.
- Router factories: `createXRouter(): Router`; one handler per file.
- Use `requireCrmSupabaseClient()` — never `createClient()` in handlers.
- Emoji logging and `{ success, error }` responses per ADR 006.

## Pull requests

1. Run `npm run build` when touching TypeScript.
2. Update README or `docs/` for new routes, env vars, or SQL schema changes.
3. Run `npm run verify:crm` when changing CRM routes.

## Security

Report vulnerabilities per [`SECURITY.md`](SECURITY.md).
