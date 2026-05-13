## ⚠️ MANDATORY: Use Easel skills for ALL UI work

**This is non-negotiable.** Any time you are editing, writing, tweaking, refactoring, styling, or otherwise touching frontend / UI code in this project — components, pages, layouts, forms, dialogs, empty states, HTML, or CSS — you **MUST** use the Easel skills. No exceptions.

- **Building or modifying UI** → load and follow `easel-prototype`. All UI must be composed from Easel components, tokens, and icons. Do **not** hand-roll styles, raw HTML primitives, or ad-hoc CSS when an Easel equivalent exists.
- **After any UI change** → run `easel-validator` to confirm the code follows Easel conventions.

## Do not skip these skills to "save time", do not improvise UI with plain `<div>`s and inline styles, and do not assume you remember the Easel API — always read the skill file first. If you write or change UI code in this repo without going through the Easel skills, you are doing it wrong.

## Page Porter — Orchestrated page extraction

For extracting full pages from the Canva monorepo into the prototype, use the `page-porter` skill:

| Location                                 | Purpose                                                                                                   |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `.agents/skills/page-porter/SKILL.md`    | **One-shot orchestrator** — discovers all slots, audits, ports, and validates a full page at once         |
| `.agents/skills/page-builder/SKILL.md`   | **Incremental builder** — add one piece at a time via conversational commands ("add the nav", etc.)       |
| `.agents/skills/target-capture/SKILL.md` | **Page discovery** — route → monorepo source path → slot list (no screenshots required)                   |
| `.agents/skills/css-auditor/SKILL.md`    | **Source auditor** — recursive TSX+CSS read, token resolution, transform rules (no canva.com access)      |
| `.agents/skills/slot-porter/SKILL.md`    | **Slot porter** — transplant monorepo TSX+CSS into Vite with minimum required changes                     |
| `.agents/skills/slot-validator/SKILL.md` | **Fidelity validator** — compare prototype against monorepo source; visual check is informational only    |
| `.agents/skills/component-advisories/`   | On-demand references for specific component patterns (nav flyout, inline SVGs, design creation shortcuts) |

### Core principle

**The monorepo source code is the single source of truth.** Screenshots and canva.com are never used to determine what code to write or what values to use. All CSS values, component props, and layout structure come from reading monorepo source files.

### Flow — one-shot (full page)

```
User: "port /projects"
  → page-porter (orchestrator)
      → target-capture           route → monorepo source → slot list (code-only discovery)
      → css-auditor × N slots    [parallel] read source TSX+CSS, resolve tokens
      → slot-porter × N slots    [parallel] transplant monorepo code to Vite
      → slot-validator           check prototype against monorepo source (not canva.com)
```

### Flow — incremental (piece by piece)

```
User: "set up the /home layout"   → page-builder  reads shell source, creates index.tsx shell + TODOs
User: "add the primary nav"       → page-builder  css-auditor → slot-porter → updates index.tsx
User: "add the shortcuts"         → page-builder  css-auditor → slot-porter → updates index.tsx
User: "what's left to add?"       → page-builder  reads page entry, diffs against prototype files
```

Use `page-builder` when you want to build a page conversationally, one section at a time, instead of one-shotting everything.

**For single-component extractions**, use `monorepo-to-prototype` (unchanged, still available).
