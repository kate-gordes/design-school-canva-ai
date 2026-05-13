# Web Conventions

Rules for working on web/frontend code in this prototype.

> **For UI**: load the `easel-prototype` skill. It owns component selection, props, tokens, icons, and import paths. Do not restate those rules here.

## Code Style

- **NEVER** use `@ts-ignore`
- **NEVER** use `as any` \u2014 research and use the proper type
- Run `npm run lint` and `npm run format` before considering a change complete

## Tooling

- Package manager: **npm** (see `runbook.md` for commands)
- Tests: Playwright E2E under `tests/e2e/` (see `testing.md`)
- Do not modify tests unless explicitly asked

## Internal Boundaries

- Files under `*/internal/` or `*/impl/` may not be imported from outside their parent folder (except in tests for that folder).
