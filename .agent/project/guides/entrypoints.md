## Entrypoints

High-signal files that orchestrate core behaviors. Start here when making prototype changes.

### App Shell & Routing

- `src/App.tsx` – Top-level shell rendering navigation, mobile variants, and `Routes`.

### Global State

- `src/providers/App.tsx` – Reducer and state management utilities
- `src/contexts/App.ts` – Context definition
- `src/hooks/useAppContext.ts` – Accessor hook

### Editor

- `src/pages/Editor/index.tsx` – Editor orchestrator
  - Hides sidebar on mount
  - Controls zoom modes (fit/fill/percent) against container refs
  - Coordinates Object Panel vs Edit Panel; renders doctypes
