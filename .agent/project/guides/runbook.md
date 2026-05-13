## Runbook

How to develop, build, test, and lint this project. Maintainers run commands locally; agents should propose commands but not execute them.

### Environment

- Node 18+
- This is a browser-only SPA. No server is required.

### Install

- The maintainer installs dependencies with the package manager of choice. Agents should not run install commands.

### Development Server

Propose to run:

```bash
npm run dev
```

Starts Vite on the host network. The script pre-runs `prettier --write .`.

### Build & Preview

```bash
npm run build
npm run preview
```

Build runs prettier, eslint (with high max warnings), cleans `dist/`, builds with Vite, and removes `dist/.gitkeep`. Preview serves the `dist` output.

### Linting & Formatting

```bash
npm run lint
npm run format      # write
npm run format:check
```

Linting uses ESLint 9 and TypeScript strict mode. Prettier 3 is enforced via lint-staged on commit.

### End-to-End Tests (Playwright)

Dev-oriented config: `playwright.dev.config.ts`

```bash
npm run test:e2e           # dev config
npm run test:e2e:headed    # headed Chromium
npm run test:e2e:ui        # Playwright UI
npm run test:e2e:visual    # serial visual run
```

CI default:

```bash
npm run test:e2e:ci
```

### Notes & Guardrails

- Agents: do not run local commands. Include proposed commands in your plan if needed.
- Never modify tests unless explicitly asked.
- Use `@/` path aliases exclusively.
- For UI work, load the `easel-prototype` skill (it owns component, token, icon, and styling rules).
