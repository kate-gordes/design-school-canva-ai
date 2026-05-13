# Skill: Page Discovery

**Role**: Find the monorepo source for a given page route. Trace its component tree. Produce `manifest.json`.

**No screenshots required. No canva.com access. No source file reading beyond what is needed to discover the slot list.**

You are spawned by the `page-porter` orchestrator with a route. Your job is to find the page's source directory in the monorepo, read its entry component to identify the major visual sections (slots), and write `manifest.json`.

---

## Input

```json
{
  "pageName": "Home",
  "route": "/home",
  "workspaceDir": ".porter-workspace/Home"
}
```

---

## Step 1 — Resolve the route to a monorepo source directory

Convert the route to a directory path under `~/work/canva/web/src/`:

```
/home         → pages/home
/anon-home    → pages/anon_home
/projects     → pages/projects
/download-mac → pages/download_mac
/templates    → pages/templates
```

Convention: replace hyphens with underscores, drop the leading slash.

Verify the directory exists:

```bash
ls ~/work/canva/web/src/pages/<pageName>/
```

If it doesn't exist, try common variations:

- `pages/<pageName>/` (exact)
- `pages/<pageName>_page/`
- Search: `find ~/work/canva/web/src/pages -maxdepth 1 -type d -name "*<pageName>*"`

**Do not guess.** If the directory cannot be found, write `manifest.json` with an error and stop.

---

## Step 2 — Find the page entry point

Look for the entry component in the discovered directory. Common patterns:

```bash
ls ~/work/canva/web/src/pages/<pageName>/
```

Look for files like:

- `index.tsx`
- `<page_name>.tsx`
- `<page_name>_page.tsx`
- `page.tsx`

Also check for a router/routes file at the monorepo root that maps this route to a component — but only if the directory approach fails.

Record the entry file path as `pageEntryPoint` in the manifest.

---

## Step 3 — Read the entry component (shallow)

Read the entry file. Identify its **direct children** — the major top-level sections it renders. These become the slots.

Look for:

- Named component imports (e.g. `import GlobalNav from './global_nav'`, `import WonderBox from './wonder_box/page'`)
- Named sections in the JSX (e.g. `<GlobalNav />`, `<WonderBox />`, `<ShortcutCarousel />`, `<RecentDesigns />`)
- Slot rendering patterns (e.g. `{slots.map(slot => <SlotRenderer slot={slot} />)}`)

For each direct child component, find its source directory:

```bash
ls ~/work/canva/web/src/pages/<pageName>/<sectionDir>/
```

If the import path points inside `pages/<pageName>/`, that becomes the slot's `sourcePath`.
If it points to a shared component under `ui/`, that is a shared component — note it separately.

---

## Step 4 — Identify slot order and source paths

From the entry component's JSX, record the slots in **render order** (top of the component first).

For each slot:

- `slotName`: uppercase, snake_case convention (e.g. `PRIMARY_NAV`, `WONDER_BOX`, `SHORTCUTS`, `RECENTS`)
- `sourcePath`: monorepo-relative path to the slot's source directory (e.g. `pages/home/global_nav`)
- `order`: 0-indexed render order

Verify each `sourcePath` exists:

```bash
ls ~/work/canva/web/src/<sourcePath>/
```

If it doesn't exist, set `sourcePath: null` and note the issue.

---

## Step 5 — Detect required advisories per slot

For each slot, check what it imports (directory listing only — do not read source files):

```bash
ls ~/work/canva/web/src/<sourcePath>/
```

Apply these rules:

| Condition                                               | Advisory flag             |
| ------------------------------------------------------- | ------------------------- |
| Any `.inline.svg` file in the slot directory or subtree | `inlineSvg`               |
| Directory name contains `shortcut`, `design_creation`   | `designCreationShortcuts` |
| Directory name contains `nav`, `header`, `shell`        | `scrollAwareHeader`       |
| Directory name contains `footer`                        | `footer`                  |
| Directory listing contains `flyout`, `menu_bar`         | `navFlyout`               |

Check for inline SVGs:

```bash
find ~/work/canva/web/src/<sourcePath>/ -name "*.inline.svg" | head -5
```

---

## Step 6 — Identify shared components

Read the page entry component again. Note any imports from `ui/nav/`, `ui/header/`, `ui/footer/` or similar shared locations that render as part of the page but are not page-specific slots.

Record these as `sharedComponents` (e.g. `["header", "footer"]`). Shared components are handled by the orchestrator separately — they are not added to `slots[]`.

If the page uses a shell layout component (imports from `ui/nav/logged_in_shell/` or similar), note it in `shellImport`. The orchestrator will handle shell extraction in Step 3b.

---

## Step 7 — Write manifest.json

Write `.porter-workspace/<PageName>/manifest.json`:

```json
{
  "pageName": "Home",
  "route": "/home",
  "monorepoPath": "pages/home",
  "pageEntryPoint": "pages/home/index.tsx",
  "shellImport": "ui/nav/logged_in_shell/shell_layout/shell_layout.tsx",
  "slots": [
    {
      "slotName": "PRIMARY_NAV",
      "sourcePath": "pages/home/global_nav",
      "order": 0,
      "requiredAdvisories": ["scrollAwareHeader", "navFlyout"]
    },
    {
      "slotName": "WONDER_BOX",
      "sourcePath": "pages/home/wonder_box/page",
      "order": 1,
      "requiredAdvisories": ["inlineSvg"]
    }
  ],
  "sharedComponents": [],
  "screenshots": {}
}
```

Set `shellImport` to null if the page has no shell layout.
Set `sharedComponents` to `[]` if none were detected.
Set `screenshots` to `{}` — screenshots are not taken during discovery.

---

## Step 8 — Optional: Screenshot for human orientation

If the user provided a screenshot with their request, save a reference to it in `screenshots.userProvided`. This is purely for human reference — it is not used by any other subagent.

If you want to take a screenshot of canva.com to help orient the user's understanding, you may do so. But this is optional and informational only — no other subagent reads the screenshots.

---

## ⛔ Hard constraints

- **Do NOT read `.tsx` or `.css` source files** beyond the page entry component in Step 3 (directory listings and entry point only)
- **Do NOT access canva.com** for source discovery
- **Do NOT guess slot source paths** — verify with `ls` before writing to manifest
- **Do NOT fabricate slots** — if a component exists in the entry JSX but its source cannot be found, write `sourcePath: null`

---

## Output

One file: `.porter-workspace/<PageName>/manifest.json`

Report back to the orchestrator:

1. The `monorepoPath` resolved
2. The `pageEntryPoint` found
3. Total slot count
4. Any slots with `sourcePath: null`
5. Whether `shellImport` was detected
