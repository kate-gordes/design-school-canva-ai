---
name: page-builder
description: >-
  Incrementally build prototype pages piece by piece from the Canva monorepo. Use when the user wants to add one section at a time — "set up the layout", "add the nav", "add the shortcuts", etc. — rather than one-shotting a full page.
---

# Skill: Page Builder (Incremental)

Add individual pieces of a Canva page to the prototype, one at a time, guided by natural language.

**You are the orchestrator.** You understand context, map intent to monorepo slots, and coordinate `css-auditor` + `slot-porter`. You never read source TSX/CSS directly — delegate that work.

The monorepo is at `~/canva/web/src`. The prototype is at `~/work/canva-prototype`.

---

## Core philosophy

Same as `page-porter`: **the monorepo source is the single source of truth.**

- No guessing, no screenshots as a code reference, no hardcoded values
- Every CSS value, component prop, and layout structure comes from reading monorepo source files
- Each piece you add must faithfully represent what the monorepo source says

---

## When to trigger

- "Set up the [page] layout"
- "Add the primary nav" / "Add the nav"
- "Add the shortcuts section" / "Add the carousel"
- "Put the search bar in" / "Add the wonder box"
- "Add the [section name]" while building a page incrementally
- "What's left to add?" / "What pieces are there?"
- User is explicitly building a page step by step

---

## Input

Conversational. The user provides a natural-language description of what to add.

You must determine:

1. **Which page?** (route like `/home`, `/projects`) — ask if not clear from context
2. **Which piece?** (map to a monorepo slot using the intent table below)

---

## Intent mapping table

Translate user language into slot names and source paths. When the page is `/home`:

| User says                                                          | Slot name     | Likely source path                                       |
| ------------------------------------------------------------------ | ------------- | -------------------------------------------------------- |
| "main layout", "page frame", "page shell", "set up the page"       | **shell**     | _(not a slot — see Shell step below)_                    |
| "primary nav", "left nav", "sidebar", "nav", "navigation"          | `PRIMARY_NAV` | `pages/home/global_nav`                                  |
| "search bar", "wonder box", "search", "search hero"                | `WONDER_BOX`  | `pages/home/wonder_box/page`                             |
| "shortcuts", "shortcut carousel", "quick actions", "create button" | `SHORTCUTS`   | `pages/home/shortcuts` or `pages/home/shortcut_carousel` |
| "recent designs", "recents", "recent", "my designs"                | `RECENTS`     | `pages/home/recents` or `pages/home/recent_designs`      |
| "templates", "template carousel", "suggested templates"            | `TEMPLATES`   | `pages/home/template_carousel` or similar                |
| "footer"                                                           | `FOOTER`      | shared footer component                                  |

For other pages, discover slots by reading the page entry component (see Step 2b).

If the user's request is ambiguous, list the likely candidates and ask them to confirm before proceeding.

---

## Step 0 — Understand current state

Before doing anything else, check what already exists for this page:

```bash
ls ~/work/canva-prototype/src/pages/<PageName>/ 2>/dev/null || echo "PAGE_NOT_STARTED"
```

If the page exists, read `src/pages/<PageName>/index.tsx` to see which slots are already imported.

Report to the user: "I can see you've already added: [X, Y]. I'll add [Z] next."

If the page hasn't been started at all and the user is asking for something other than the shell, say:

> "This page doesn't exist yet in the prototype. I'd recommend starting with **'set up the layout'** to create the page shell, then adding pieces one by one. Want me to set up the layout first?"

---

## Step 1 — Resolve the slot

### 1a — If the request is for the shell layout

→ Jump directly to **Shell Setup** (section below). This is a special case.

### 1b — If the request is for a content slot

Check the manifest if one exists:

```bash
cat ~/work/canva-prototype/.porter-workspace/<PageName>/manifest.json 2>/dev/null
```

If no manifest, discover the slot by reading the monorepo page entry:

```bash
cat ~/canva/web/src/pages/<pageName>/index.tsx
```

Find the component that matches the user's intent. Record:

- `slotName` — e.g. `WONDER_BOX`
- `sourcePath` — monorepo-relative path, e.g. `pages/home/wonder_box/page`

Verify the source path exists:

```bash
ls ~/canva/web/src/<sourcePath>/
```

If the path doesn't exist, try common variations (underscore vs hyphen, `_page` suffix, etc.) before giving up.

---

## Step 2 — List what's available (optional, always show)

After resolving the intent, show the user the full slot map for this page:

```
Page: /home
─────────────────────────────────────────
 ✓ shell layout          (already set up)
 ✓ PRIMARY_NAV           (already added)
 → WONDER_BOX            (adding now)
   SHORTCUTS             (not yet added)
   RECENTS               (not yet added)
─────────────────────────────────────────
```

Derive the ✓ / → / blank state from the filesystem check in Step 0.

---

## Shell Setup (special case)

When the user says "set up the layout" or equivalent:

### S1 — Read page entry component

```bash
cat ~/canva/web/src/pages/<pageName>/index.tsx
```

Identify:

- The shell layout component it imports (e.g. `LoggedInShell`, `ShellLayout`)
- All top-level slot components it renders (these will become TODOs in index.tsx)
- The render order of slots

### S2 — Read the shell source

Follow the shell import to its source. Read its TSX and CSS:

```bash
cat ~/canva/web/src/<shellPath>.tsx
cat ~/canva/web/src/<shellPath>.module.css
```

Extract:

- Nav column: width, position, z-index
- Main content card: margin, border-radius, box-shadow, overflow, background
- Scroll container: overflow-y, height calculation
- Page background: gradient or solid color

Resolve all `@value` token references using the token values at `~/canva/web/src/tokens/` or by reading the referenced token file.

### S3 — Write the prototype shell

Create `src/pages/<PageName>/index.tsx`:

```tsx
// Prototype shell for: pages/<pageName>/index.tsx
// Add slots incrementally using the page-builder skill

import styles from './index.module.css';

export default function <PageName>() {
  return (
    <div className={styles.pageRoot}>
      {/* PRIMARY_NAV — add with: "add the primary nav" */}
      {/* WONDER_BOX — add with: "add the search bar" */}
      {/* SHORTCUTS — add with: "add the shortcuts" */}
      {/* RECENTS — add with: "add the recent designs" */}
    </div>
  );
}
```

Create `src/pages/<PageName>/index.module.css` with the resolved shell styles (exact values from the shell source — no tokens, no @value, no approximations):

```css
.pageRoot {
  display: flex;
  height: 100vh;
  background: <resolved gradient or color>;
  /* ... */
}

.mainContent {
  margin: <resolved px>;
  border-radius: <resolved px>;
  box-shadow: <resolved shadow>;
  overflow: hidden;
  flex: 1;
  /* ... */
}

.scrollContainer {
  overflow-y: auto;
  height: <resolved calc>;
}
```

### S4 — Register route

Read `src/Root.tsx`. Add the import and route if not already present.

### S4b — Visual validation

After writing the shell, take a screenshot of the prototype and compare against canva.com (same as A5). Confirm the card shape, shadow, and border-radius are correct. The card interior will look empty/white — that is expected; the first content slot provides the vivid visual treatment.

### S5 — Report

Tell the user:

- Shell is set up at `/#/<route>`
- List all TODO slots and the natural language phrase to add each one

---

## Slot Addition (content pieces)

### A1 — Initialize workspace

```bash
mkdir -p ~/work/canva-prototype/.porter-workspace/<PageName>/audits
mkdir -p ~/work/canva-prototype/.porter-workspace/<PageName>/results
```

Write a minimal manifest entry for this slot if no manifest exists:

```json
{
  "pageName": "<PageName>",
  "route": "<route>",
  "slots": [
    {
      "slotName": "<SLOT_NAME>",
      "sourcePath": "<sourcePath>",
      "order": <n>,
      "requiredAdvisories": []
    }
  ]
}
```

For `requiredAdvisories`, apply the same rules as `target-capture`:

- Any `.inline.svg` in the slot directory → `inlineSvg`
- Directory name contains `nav`, `header`, `shell` → `scrollAwareHeader`
- Directory name contains `shortcut`, `design_creation` → `designCreationShortcuts`
- Directory name contains `footer` → `footer`
- Directory listing contains `flyout`, `menu_bar` → `navFlyout`

Check:

```bash
find ~/canva/web/src/<sourcePath>/ -name "*.inline.svg" | head -5
ls ~/canva/web/src/<sourcePath>/
```

### A2 — Spawn css-auditor

Spawn the `css-auditor` subagent:

```
Skill: css-auditor
Input: { slotName: "<SLOT_NAME>", sourcePath: "<sourcePath>", workspaceDir: ".porter-workspace/<PageName>" }
```

Wait for `.porter-workspace/<PageName>/audits/<SLOT_NAME>.json`.

### A3 — Spawn slot-porter

Spawn the `slot-porter` subagent:

```
Skill: slot-porter
Input: { slotName: "<SLOT_NAME>", auditFile: ".porter-workspace/<PageName>/audits/<SLOT_NAME>.json", outputDir: "src/pages/<PageName>/<SLOT_NAME>", workspaceDir: ".porter-workspace/<PageName>" }
```

Wait for `.porter-workspace/<PageName>/results/<SLOT_NAME>.json`.

### A4 — Update page index

Read `src/pages/<PageName>/index.tsx`.

**If the slot has a TODO comment** (`{/* <SLOT_NAME> — add with: ...*/}`), replace it with the actual import and render:

```tsx
// Add at top:
import <SlotName> from './<SLOT_NAME>';

// Replace the TODO comment with:
<SlotName />
```

**If no TODO comment exists** (index.tsx was created by page-porter without builder hints), insert the import at the top and add `<SlotName />` in the correct render position. Use the slot's `order` from the manifest to determine position.

**If index.tsx doesn't exist yet**, create a minimal one:

```tsx
import styles from './index.module.css';
import <SlotName> from './<SLOT_NAME>';

export default function <PageName>() {
  return (
    <div className={styles.pageRoot}>
      <SlotName />
    </div>
  );
}
```

And create a minimal `index.module.css` (user can refine the shell later with "set up the layout").

### A5 — Validate (code + visual + dimensional)

Run the `easel-validator` skill. Fix any errors before reporting.

Then **validate using Chrome DevTools MCP**:

**Set a consistent viewport on both sides first:**

```
mcp__chrome-devtools__emulate  viewport: "1728x873x1"
```

Apply on both the prototype tab and the canva.com tab before any screenshot or measurement.

1. Navigate to the prototype route: `mcp__chrome-devtools__navigate_page` → `http://localhost:5173/#/<route>`
2. Take a screenshot and compare against canva.com — look for missing sections, wrong layout, absent elements.

**Dimensional verification (required for every new slot):**

3. For each element added that has an explicit size constraint in the monorepo source (containers, banners, inputs, nav columns, cards), run `getBoundingClientRect()` on the prototype:
   ```js
   el.getBoundingClientRect(); // → { width, height, x, y, top, bottom }
   ```
4. Navigate to canva.com and run the same queries on the equivalent elements.
5. Compare — every measurement must match within ±2px.
6. **If they don't match, go back to the monorepo source** — do not adjust the value to what canva.com shows directly. Search the source CSS for feature flag overrides or breakpoint-specific rules that change the default:
   ```bash
   grep -rn "featureFlag\|uniformMax\|isEnabled" ~/canva/web/src/<sourcePath>/
   ```
   Find the override rule, confirm it's active on canva.com, use it in the prototype.
7. Re-measure after fixing. Repeat until ±2px.

Do not report a piece as done until both screenshot and numeric measurements confirm it matches canva.com.

### A6 — Report

Tell the user:

- What was added (file paths written)
- Any deviations logged (summary)
- What pieces remain (the slot map from Step 2, updated)
- The prototype route to view it

---

## Answering "what's left to add?"

When the user asks what pieces are available or remaining:

1. Read the monorepo page entry to discover all slots
2. Check which slots already exist in `src/pages/<PageName>/`
3. Output the slot map (same format as Step 2)
4. For each slot not yet added, give the natural-language phrase to trigger it

---

## Known pitfalls

### Shell background vs. content-provided visuals

The shell's own gradient is nearly invisible — the start and end colors differ by only ~6 RGB points. The vivid gradient visible at the top of every canva.com page (lavender fading to white) does **not** come from the card container. It comes from the **first content slot** inside the card (e.g. the WonderBox hero), which layers a teal→purple brand gradient under multiple white frost overlays.

**Rule:** If you implement the shell container and it looks like a plain white card, that is correct. The vivid gradient appears only after the first content slot is ported. Do not add a fake gradient to the container background. If asked to show the gradient before the content slot is ported, add a **placeholder div** with the WonderBox gradient layers (sourced from `mcp__chrome-devtools__evaluate_script` on canva.com, not guessed).

### Visual source identification

When a visual effect doesn't appear as expected, do not guess at CSS changes. Use `mcp__chrome-devtools__evaluate_script` to query the computed style of the element on canva.com, identify which element is actually providing the effect, and then implement that — not an approximation of what it looks like.

---

## Hard constraints

- **Monorepo source is the authority** — no approximations, no guessing values
- **Delegate to css-auditor + slot-porter** — do not read source TSX/CSS directly yourself
- **SVG icons must be read verbatim from the monorepo `.inline.svg` file** — never hand-write SVG path data or reconstruct from memory. `cat` the file and copy exactly. Do not change fill color to `currentColor` without also verifying the correct CSS color for the parent element in that rendering context.
- **CSS values that derive from multiple layers must be fully traced** — never add token values together without checking whether any offset, bleed, or negation modifies the sum. Example: a padding derived from `BoxPaddingX + inputPaddingX` may be offset by `decoratorBleed = -8px`, making the correct value 20px not 28px. Read the full chain of CSS rules before computing any derived value.
- **Do not port something twice** — if a slot directory already exists in `src/pages/<PageName>/`, skip it and tell the user
- **Shell CSS values must be exact** — read the actual shell component CSS; do not approximate token values
- **Every deviation must be logged** — slot-porter handles this, but remind it in your spawn message if re-porting
- **Do not touch slots you're not asked about** — incremental means incremental; only modify what the user asked for

---

## References

- `.agents/skills/css-auditor/SKILL.md` — source auditor
- `.agents/skills/slot-porter/SKILL.md` — slot transplant
- `.agents/skills/target-capture/SKILL.md` — slot discovery
- `.agents/skills/page-porter/references/slot-manifest-schema.md` — manifest format
- `.agents/skills/component-advisories/` — advisory files for complex slots
