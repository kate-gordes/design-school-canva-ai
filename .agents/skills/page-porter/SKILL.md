# Skill: Page Porter (Orchestrator)

Port any page from the Canva monorepo into the Vite+React prototype at `~/work/canva-prototype`.

**You coordinate. You never read source TSX/CSS directly. Everything is delegated.**

The monorepo is at `~/work/canva/web/src`. The prototype is at `~/work/canva-prototype`.

---

## Core philosophy

**The monorepo source is the authority for WHAT to render. canva.com is the authority for HOW it is rendered in the user-visible variant.**

- Every CSS value, every component prop, every layout structure comes from reading source files — that is the base.
- **BUT:** the monorepo source has feature flags, narrow/wide branches, `display="wonderbox"` variants, and wrapper components that change layout at runtime. Reading one branch of the JSX and trusting it blindly produces a layout the user doesn't recognise when a different branch is what ships on canva.com.
- Therefore: after assembly, ALWAYS cross-check the prototype's slot-group bounding rects against canva.com's rendered DOM (Chrome DevTools MCP at localhost:1337). If a group's horizontal position, width, or centering differs from canva.com, the source has a branch you haven't traced — go find it.
- Screenshots are for human orientation; DOM measurements via Chrome MCP are for verification.

**Lesson from /projects:** `combined_projects_content.tsx` uses `<Columns align="spaceBetween">` for Filters + HeaderButtons. A naïve read puts Filters at the left edge and HeaderButtons at the right edge of the full content width. But on canva.com `/projects`, the filter pills render CENTERED under the WonderBox while HeaderButtons stay at the right edge of the content area. No single `<Columns align>` produces both. The rendered layout must therefore involve a branch, wrapper, or CSS override the slot audit missed. A canva.com cross-check would have caught this before shipping; the "source is the only truth" stance let it slip.

**Lesson from /templates:** the hero has three visual anchors — title, WonderBox, category pills — stacked vertically. On canva.com they live in THREE different DOM branches (separate header block, content block, and a FORM wrapper), producing NON-uniform gaps: 24px title↔wb, 0 wb↔pills-wrapper (12px visual from internal padding). The port assembled them as one flex column with a uniform `gap: 32px`, which matched neither gap and made the pills look floated. Horizontal cross-checks (Step 8b) caught none of this because everything was centered. **Vertical inter-anchor gaps are a distinct failure mode and need their own cross-check** — see Step 8c below.

**Lesson from /templates WonderBox (follow-up):** after 8b and 8c passed, a closer look revealed SIX further divergences from canva.com that bounding-rect checks could not see:

1. The decorative `.bleedBackground` gradient was ported verbatim and present in the DOM, but **invisible** — `.bannerContainer` was `position:relative; z-index:auto` (not a stacking context), so the `z-index:-1` bleed escaped up and was occluded by an ancestor's white background. Pixels were white instead of gradient. No rect check can see this; you must probe computed colors.
2. The `Templates` title used `/home`'s `heroTitleOverride` values (40px/500/letter-spacing -1px) but `/templates` renders a plain Easel `Title size="large"` (32px/600). The porter copied the `/home` typography by convention. **Per-route typography must be verified against the live DOM.**
3. The search input's start icon was `MagicSearchColorIcon` (color gradient magic-search SVG). But `/templates` mounts the WonderBox in the `isOpen` branch where `renderStartElement()` returns plain `<SearchIcon />` (monochrome magnifying glass). **Icon identity depends on runtime branches — check the live SVG path, not just "there's an icon on the left".**
4. The search input had a right-side `ArrowRight` end pill. On canva.com `/templates`, `renderEndElements()` returns undefined because there's no `onToggleOpenClick`, no `voiceInputControl`, and no loading. **Absence of controls is a fidelity signal; inventory every interactive node inside a surface and confirm each exists on canva.com.**
5. Pill order was `Business, Video, Social media, Learn Grid`. Canva.com serves `Business, Social media, Video, Learn Grid`. A `CATEGORY_GROUPING_STRUCTURE` enum lookup was copied from the wrong branch of the source. **Ordered lists of CMS-ordered items need live-DOM order verification.**
6. Search container height 48px (prototype) vs 40px (canva.com) — the `.searchInputInner` used `padding: 16px` (relaxed-detached paddingY=2u from `/home`). `/templates` uses horizontal-only padding. **Same `wonder_box_input.tsx` renders differently per route; measure each route.**

**All six would have been caught by a per-element fidelity sweep that probes computed styles, SVG path data, interactive-child inventory, and ordered-item labels against canva.com. See new Step 8d below.**

---

## Input

A page route or name, e.g.:

- `/home` → logged-in home page
- `/projects` → projects page
- `/anon-home` → anonymous home page
- `/download-mac` → macOS download page

Or a screenshot of a monorepo-rendered page — use it to identify the route, then proceed as above.

---

## Step 1 — Initialize workspace

```bash
mkdir -p .porter-workspace/<PageName>/audits
mkdir -p .porter-workspace/<PageName>/results
mkdir -p .porter-workspace/<PageName>/validation
```

Write `.porter-workspace/<PageName>/job.json`:

```json
{
  "pageName": "<PageName>",
  "route": "<route>",
  "startedAt": "<ISO timestamp>"
}
```

---

## Step 2 — Spawn page-discovery subagent

Spawn the `target-capture` subagent with:

```
Skill: target-capture
Input: { pageName, route, workspaceDir: ".porter-workspace/<PageName>" }
```

The subagent will:

1. Resolve the route to a monorepo source directory
2. Read the page's entry component and trace its import tree
3. Identify major visual sections as "slots"
4. Write `manifest.json`

Wait for `.porter-workspace/<PageName>/manifest.json` to be written.

Read the manifest. If any slots have `sourcePath: null` (directory not found), note them and proceed without them.

---

## Step 3 — Spawn source-auditor subagents (parallel)

For each slot in `manifest.slots`, spawn a `css-auditor` subagent **in parallel**:

```
Skill: css-auditor
Input: { slotName, sourcePath, workspaceDir }
```

The source-auditor reads all TSX and CSS in the slot's import chain. It resolves every `@value` token to a concrete value, detects CSS transform rules, and extracts Easel component usage. It does NOT access canva.com or take screenshots.

Wait for all `audits/<slotName>.json` files to be written.

---

## Step 3b — Shell audit (if the page uses a layout shell)

After per-slot audits complete, check whether the page has a shell (a layout wrapper that controls the page frame — nav column, content card, scroll container).

Read the page's root component (identified during discovery in `manifest.pageEntryPoint`). If it imports a shell component, read that shell component's TSX and CSS to extract:

- Nav column: width, position, z-index
- Main content card: margin, border-radius, box-shadow, overflow
- Scroll container: overflow-y, height calculation
- Background: gradient or solid color

Resolve all token values using `css-auditor/references/token-values.md`.

Write `results/page-shell.json`:

```json
{
  "hasShell": true,
  "navWrapper": {
    "sourcePath": "<path to shell source>",
    "width": "<resolved px>",
    "position": "sticky | fixed | relative",
    "zIndex": "<value>"
  },
  "mainContent": {
    "margin": "<resolved — e.g. 8px 8px 8px 0>",
    "borderRadius": "<resolved px>",
    "boxShadow": "<resolved full shadow string>",
    "overflow": "hidden",
    "background": "<resolved hex>"
  },
  "scrollContainer": {
    "overflowY": "auto",
    "height": "<resolved — e.g. calc(100vh - 16px)>"
  },
  "backgroundGradient": "<full CSS gradient string, or null>",
  "pageHeightConstraint": "<height/min-height on outermost page element>"
}
```

If the page has no shell (anonymous/marketing pages), set `hasShell: false` and all sub-fields to null.

---

## Step 3c — Parent container layout audit (REQUIRED — do not skip)

**Why this step exists:** per-slot audits capture each slot's own CSS in isolation, but they miss the horizontal/vertical relationships _between_ slots — which ones share a row, which ones constrain each other's width, which wrapping container sets a narrower max-width than the page grid, and which ones use `align="spaceBetween"` vs `align="center"` in a shared Columns.

Without this step, the assembly in Step 5 ends up stacking slots in a generic wrapper and each slot inherits the full content grid width. This has produced bugs like:

- Filter pills + HeaderButtons ending up spread across a 1760px row instead of sitting compact under a 800px WonderBox.
- Section header action buttons floating on the wrong edge or wrong row.
- Tabs appearing full-bleed when the source puts them inside a narrower column.

**Procedure:**

1. From the manifest, find the monorepo file that _renders the slots together_ — typically a `*_content.tsx`, `install_*.tsx`, or `*_page.tsx` one or two levels up from the slot entries (e.g. `pages/home/folders/views/combined_projects/combined_projects_content.tsx` for `/projects`). If multiple candidates exist, pick the one whose JSX contains the slot components as children.
2. Read that file. Identify the JSX tree that wraps the slots. Record:
   - **Grouping:** which slots share a row (Columns), which share a column (Rows), which are wrapped in a Box with its own max-width or padding.
   - **Layout props:** `align`, `alignY`, `spacing`, `spacingY` on every Rows/Columns that affects a slot.
   - **Width constraints:** any `maxWidth`, `width`, or CSS `max-width` on wrappers around the slot group. These may differ from the page grid max-width.
   - **Conditional branches:** feature flags, narrow/wide switches, or `display="wonderbox"` variants that change the layout. Record which branch matches canva.com's rendered state (when unsure, prefer the branch that matches the user-provided screenshot).
   - **Spacers:** inter-slot `<Spacer size="…" />` values.
3. Resolve all token values to concrete pixels.
4. **Read the shell CSS (not just the composer).** The content-column wrapper — typically `ui/nav/logged_in_shell/shell_layout/shell_layout.css` or an equivalent `workspace_shell.css` — sets the column's `max-width`, margin, and padding. This cap controls where every centered child (search bar, banner content, section rows) ends up at wide viewports. **Record it.** If `max-width: 1760px; margin: 0 auto` is set on the content column, every centered child in the prototype must respect the same cap — either by being rendered inside a wrapper with the same cap, or by carrying the cap on its own CSS. Dropping this cap is the root cause of search-bar and filter-row horizontal mis-alignment at wide viewports.
5. **Detect sub-route banner inheritance up front (not in §8d.5a).** If the page you're porting is a sub-route of an already-ported page (e.g. `/projects/your-projects` under `/projects`, `/offline-designs` sharing the `/projects` shell + banner), check the composer's banner prop/component:
   - Does it mount the SAME banner component as the parent (e.g. both use `CombinedProjectsBanner` or both use `home_of_x/create.tsx`'s `DesktopBanner`)?
   - If yes, set `"inheritsBannerFrom": "<parentPageName>"` at the top of `page-layout.json`. The Step 5 assembly MUST copy the parent's banner CSS (`.wonderBoxPlaceholder`, `.bannerContentArea`, `.heroTitle`, `.heroTitleOverride`, and the gradient `background-image`) verbatim from `src/pages/<ParentPage>/index.module.css` — NOT re-style it. Change only the rendered title string and per-route affordance differences.
   - If the sub-route's composer genuinely mounts a different banner component, omit the flag. Verified by reading both composers side-by-side.
6. Write `results/page-layout.json`:

```json
{
  "parentContainerFile": "<resolved monorepo path>",
  "shellContentColumn": {
    "sourceFile": "<resolved monorepo path to shell_layout.css or equivalent>",
    "maxWidth": "<px or null — e.g. 1760 for 220u cap>",
    "margin": "<resolved value, e.g. '0 auto'>",
    "padding": "<resolved px or null>"
  },
  "inheritsBannerFrom": "<parent page name or null>",
  "rootWrapper": {
    "maxWidth": "<px or null>",
    "padding": "<resolved px or null>"
  },
  "groups": [
    {
      "name": "<label, e.g. filter-row>",
      "layout": "Columns | Rows | Box",
      "align": "<prop value or null>",
      "spacing": "<resolved px or null>",
      "maxWidth": "<px or null>",
      "slots": ["FILTERS", "HEADER_BUTTONS"]
    }
  ],
  "interSlotSpacers": [{ "before": "FILTERS", "size": "6u" }]
}
```

Step 5 assembly MUST consume `page-layout.json` — it is not optional. If `results/page-layout.json` is missing or empty, the assembly fails fidelity and must be redone. `shellContentColumn.maxWidth` and `inheritsBannerFrom` are load-bearing: the assembly step MUST emit the cap and the banner-frame copy before wiring any slots.

---

## Step 4 — Spawn slot-porter subagents (parallel)

For each slot with a completed audit, spawn a `slot-porter` subagent **in parallel**:

```
Skill: slot-porter
Input: { slotName, auditFile: "audits/<slotName>.json", outputDir: "src/pages/<PageName>/<SlotName>", workspaceDir }
```

Wait for all `results/<slotName>.json` files to be written.

---

## Step 5 — Assemble the page index

Read all `results/<slotName>.json` files, `results/page-shell.json`, and `results/page-layout.json`.

**The assembly order and grouping comes from `page-layout.json`, not from gut instinct.** Slots listed in the same `groups[].slots` array MUST be rendered inside the same wrapper element whose max-width/align/spacing matches the group's recorded values. Do not default every slot to the page-grid max-width — if a group has its own narrower `maxWidth`, use it.

Inter-slot spacers come from `interSlotSpacers`. Do not invent spacer sizes.

For slots with `status: "complete"`, assemble `src/pages/<PageName>/index.tsx`.

**If `page-shell.json` has `hasShell: true`** — render the page frame explicitly using the values from `page-shell.json`. The frame is NOT a slot — it comes from reading the shell source:

```tsx
// src/pages/<PageName>/index.tsx
import PrimaryNav from './PRIMARY_NAV';
import WonderBox from './WONDER_BOX';
// etc.
import styles from './index.module.css';

export default function <PageName>() {
  return (
    <div className={styles.pageRoot}>
      {/* Nav column — position/width from page-shell.json */}
      <PrimaryNav />
      {/* Main content card — margin/border-radius/box-shadow/overflow from page-shell.json */}
      <div className={styles.mainContent}>
        {/* Scroll container — overflow-y/height from page-shell.json */}
        <div className={styles.scrollContainer}>
          <WonderBox />
          {/* ... slots in render order from manifest ... */}
        </div>
      </div>
    </div>
  );
}
```

Write `src/pages/<PageName>/index.module.css` with the shell styles resolved from `page-shell.json`.

**If `page-shell.json` has `hasShell: false`** — use the simpler structure without a shell frame:

```tsx
export default function <PageName>() {
  return (
    <main className={styles.page}>
      <SlotA />
      <SlotB />
      {/* ... slots in render order ... */}
    </main>
  );
}
```

For slots with `status: "partial"` or `"failed"`, add a placeholder comment.

---

## Step 6 — Add route to `src/Root.tsx`

Read `src/Root.tsx`. Add the import and route if not already present:

```tsx
import <PageName> from '@pages/<PageName>';
// Inside <Routes>:
<Route path="<route>" element={<PageName />} />
```

---

## Step 7 — Spawn fidelity-validator

Spawn the `slot-validator` subagent:

```
Skill: slot-validator
Input: { pageName, prototypeRoute, workspaceDir, slots: manifest.slots }
```

The fidelity-validator compares the prototype TSX/CSS against the monorepo source files. It does NOT use canva.com DOM snapshots as its primary check. It checks:

1. Every Easel component in the prototype matches the source (same component, same props)
2. Every layout structure in the prototype matches the source (same Rows/Columns/Box hierarchy)
3. Every CSS value matches the resolved source values
4. Every item list (nav items, carousel items, filter options) matches source constants
5. Every group in `page-layout.json` is preserved in the assembled index — same slot co-location, same max-width, same align/spacing. A slot that shares a row in the source but appears on its own row in the prototype is a HIGH severity mismatch.

Wait for `validation/<slotName>.json` files to be written.

---

## Step 8 — Handle fidelity failures

**Target: every slot at "complete" status with zero HIGH severity mismatches.**

A HIGH severity mismatch means the prototype structurally diverges from the monorepo source in a way that is not documented in `deviations[]`.

Read all `validation/<slotName>.json` files. For each HIGH severity mismatch:

1. Identify the specific monorepo source file(s) the mismatch refers to
2. Re-spawn the `slot-porter` for that slot with the mismatch context:
   ```
   "The fidelity-validator found these source divergences: <mismatches[]>.
   For each mismatch:
     - sourceFile: <file> — re-read this file; the answer is in the source
     - element: <element> — this is the element that differs
     - expected: <expected> — what the monorepo source says
     - actual: <actual> — what the prototype has
   Re-read the listed source files. Use the source as the authority.
   Do not approximate or guess. Do not change anything that is already correct."
   ```
3. After re-ports complete, re-run the fidelity-validator for those slots
4. Repeat until zero HIGH severity mismatches remain OR the orchestrator determines the mismatch requires a `dom-complexity` deviation

**MEDIUM severity mismatches** that represent intentional logged deviations (reason: `logic` or `dom-complexity`) do not require re-porting. Note them in the final report.

**Slots with only LOW severity mismatches** pass automatically.

---

## Step 8b — canva.com layout cross-check (REQUIRED)

The slot-validator only verifies "prototype matches source." That leaves a gap: if the source has multiple branches (feature flags, narrow/wide variants, display="wonderbox", wrapper components) and you traced the wrong branch, the prototype will match source but NOT match what the user sees on canva.com. Step 8b closes that gap.

Per `feedback_validation_target.md`: Chrome DevTools MCP at `localhost:1337` is the user-visible reference.

If Chrome DevTools MCP is unavailable, STOP and ask the user to start it — do not skip this step (per `feedback_chrome_mcp_required.md`).

Procedure:

1. Via Chrome MCP, navigate to `https://www.canva.com<route>` (logged-in session).
2. For each group in `results/page-layout.json`, evaluate:
   ```js
   // For each slot in the group, find the first DOM node and measure it
   document.querySelector('<selector>').getBoundingClientRect();
   ```
   Record: `x`, `width`, and center offset `(x + width/2) - window.innerWidth/2` for each slot.
3. Navigate to `http://localhost:5173/#<route>` (hash router) and repeat the same measurements on the prototype.
4. Compare per slot:
   - **Horizontal centering:** if canva.com's slot is centered (|center offset| < 40px) but the prototype's is not (or vice versa), that is a HIGH-severity layout mismatch.
   - **Width:** if widths differ by more than 20% and the narrower one is close to WonderBox width (~800px), the source has a wrapper max-width the audit missed.
   - **Relative position within group:** if canva.com shows slot A centered and slot B at the right edge, but the prototype has A on the left and B on the right, the source branch you traced is wrong.
5. For every HIGH mismatch, go back to the source and find the branch that produces the canva.com layout. Look for:
   - Feature flags: `get*Enabled()`, `enable*()` — try the opposite branch from the one you traced first.
   - Wrapper components: the slot's parent may sit inside a Box / Columns with its own max-width or alignment that the per-slot audit didn't read.
   - CSS rules applied by class names in ancestor components.
6. After fixing, re-run Step 8b until all groups match.

Write `validation/page-layout-crosscheck.json` with the measurements and pass/fail per group.

---

## Step 8c — Vertical inter-anchor gap cross-check (REQUIRED — do not skip)

Step 8b verifies horizontal placement (x, width, centering). It does NOT verify vertical spacing between stacked anchors. A page can pass 8b with every slot correctly centered at the correct width and still have every inter-slot gap wrong — producing a layout that reads "floating" or "cramped" at a glance.

**The failure mode this catches:** assembling multiple anchors as children of a single flex column with a uniform `gap:` value, when the source renders them in separate DOM branches with different spacing between each pair.

**Scope — every pair of vertically-adjacent visual anchors on the page, including:**

- Title → WonderBox (or equivalent search surface)
- WonderBox → first content anchor below it (pills, tabs, filters, cards)
- Section header → first row of that section's content
- Last row of a section → next section header
- Nav rows within a Menu (already covered by slot-validator 1e-4; do not duplicate)

**Procedure:**

1. Via Chrome MCP, navigate to `https://www.canva.com<route>` and measure every adjacent anchor pair. For each pair compute `gap = B.top - A.bottom` using the OUTERMOST visible-surface element (per slot-validator 1d's visible-surface rule — the `<input>` is not the wonderbox; the 800×64 container is).
2. Navigate to `http://localhost:5173/#<route>` and repeat.
3. Diff per pair. Tolerance **±2px** (allows subpixel rounding; anything more is a real mismatch).
4. For every miss, find the source explanation before fixing:
   - Read the monorepo composer file for the page. Note the DOM branches each anchor lives in.
   - If the anchors are NOT siblings in the same flex container on canva.com, do not encode them as siblings in a flex column with a uniform `gap`. Use explicit `margin-top` / `padding-top` per anchor so that each pair's gap is set independently.
   - If the gap comes from INTERNAL padding of the lower anchor's wrapper (carousel row, pills-wrapper, etc.), encode it as `padding-top` on the wrapper, not as margin on the preceding sibling.
5. Re-port the affected slot(s) or edit the page's assembly CSS directly if the fix is at the page level (e.g. HERO's `.bannerContent`).
6. Re-run Step 8c until every pair is within ±2px.

**Measurement script (run on both canva.com and prototype — switch pages via Chrome MCP `select_page`):**

```js
() => {
  // Edit this list per page — each entry = { label, selector } for the outermost visible surface.
  // Example for /templates:
  const anchors = [
    { label: 'title', selector: 'h1, h2' },
    { label: 'wonderbox', selector: '[class*="searchInputContainer"], input[type="search"]' },
    { label: 'pills', selector: 'a[role="button"][aria-pressed], button[aria-pressed]' },
  ];
  // Resolve each selector to its outermost visible-surface ancestor (≥60px tall)
  const resolve = sel => {
    const el = document.querySelector(sel);
    if (!el) return null;
    let surface = el;
    while (surface && surface.getBoundingClientRect().height < 60 && surface.parentElement) {
      surface = surface.parentElement;
    }
    return surface;
  };
  const measured = anchors.map(a => {
    const el = resolve(a.selector);
    if (!el) return { ...a, missing: true };
    const r = el.getBoundingClientRect();
    return { label: a.label, top: Math.round(r.top), bottom: Math.round(r.bottom) };
  });
  const gaps = [];
  for (let i = 0; i < measured.length - 1; i++) {
    const a = measured[i],
      b = measured[i + 1];
    if (a.missing || b.missing) continue;
    gaps.push({ pair: `${a.label} → ${b.label}`, gap: b.top - a.bottom });
  }
  return { measured, gaps };
};
```

Write `validation/vertical-gaps-crosscheck.json`:

```json
{
  "route": "/templates",
  "pairs": [
    { "pair": "title → wonderbox", "canva": 24, "prototype": 24, "status": "pass" },
    { "pair": "wonderbox → pills", "canva": 12, "prototype": 12, "status": "pass" }
  ]
}
```

**A page does not pass porter until every pair in this file is within ±2px.**

### 8c.1 — Absolute Y-anchor (REQUIRED)

Pairwise gap checks only detect _relative_ drift. If every hero anchor is uniformly offset by the same amount (e.g. the composer wraps the banner in a Spacer you missed, or adds a `padding-top` at a level higher than the slot's root), every pair in 8c will still pass while the whole hero floats too high or too low vs canva.com.

**The failure mode this catches:** the page assembles correctly with all pairwise gaps matching, but the FIRST anchor on the page (topmost title, nav bar, or hero surface) lands at a different absolute `y` than canva.com. Typical cause: a `<Spacer>`, `padding-top`, or `margin-top` at a level ABOVE the slot root in the monorepo composer is not replicated in the prototype's page assembly.

**Concrete incident (/templates):** canva.com's `create.tsx` renders `<Spacer size={{ default: '0', smallUp: '2u' }} />` BETWEEN `BannerContainer` and the padded Box. The HERO port ignored it because it lives in the outer composer, not inside the slot's TSX. All three anchors (title/wonderbox/pills) shifted 16px higher than canva.com while every pairwise gap passed.

**Procedure:**

1. On canva.com via Chrome MCP, measure `document.querySelector('<firstAnchorSelector>').getBoundingClientRect().top`.
2. On the prototype, measure the same selector.
3. Diff. Tolerance **±2px**.
4. If the prototype is N pixels higher/lower: walk the monorepo composer OUTWARD from the slot root (not inward), looking for:
   - `<Spacer size={...} />` siblings immediately above the slot
   - `paddingTop` / `paddingBottom` props on wrapper `Box` or `Stack` components
   - `padding-top` / `margin-top` on wrapper CSS classes the slot lives inside
   - `additionalBannerHeight`, `additionalTopPadding`, or similar numeric props passed down
5. Port the missing wrapper/spacer into the page's assembly (not inside a slot) — prefer adding a sibling `<span className={styles.topSpacer} />` or adjusting the page-level shell CSS so the slot's DOM structure stays clean.
6. Re-run Step 8c and 8c.1. Both must pass.

**Measurement snippet:**

```js
() => {
  const first = document.querySelector('h1, h2, [role="banner"], [class*="bannerContainer"]');
  return first ? Math.round(first.getBoundingClientRect().top) : null;
};
```

Write `validation/absolute-y-crosscheck.json`:

```json
{
  "route": "/templates",
  "firstAnchor": "h1.templatesTitleHost",
  "canva": 72,
  "prototype": 72,
  "status": "pass"
}
```

**A page does not pass porter until this value is within ±2px.**

---

## Step 8d — Per-element DOM fidelity sweep (REQUIRED — do not skip)

Steps 8b and 8c verify geometry (where things are). They do NOT verify the identity and visible properties of each thing. A page can pass both and still have the wrong icon, the wrong text weight, an extra control, a reordered list, or a decorative backdrop that is present in the DOM but invisible because its stacking context is wrong.

**This step runs element-by-element property checks between prototype and canva.com.**

### 8d.1 — Decorative-paint reachability

For every slot that ports an **absolute-positioned background element** (bleed gradient, border-image overlay, glow, blur, shadow-layer div) **with `z-index` ≤ 0**:

1. Locate the element via `document.querySelector('[class*="bleedBackground"], [class*="bleed"], [class*="backdrop"]')` etc. Capture its computed `background-image`, `z-index`, `position`.
2. Walk up the parent chain from the element. The FIRST ancestor that either (a) creates a stacking context (has `position` != static AND `z-index` != auto, or `isolation: isolate`, or `transform`/`filter`/`will-change: transform`) OR (b) has an **opaque** background-color/background-image, determines the fate of the backdrop.
3. Rule: **the first stacking-context ancestor must appear BEFORE (i.e. be a descendant of) any opaque-background ancestor**. If an opaque ancestor is reached first, the z-index:-1 backdrop paints BEHIND it and becomes invisible.
4. Automated test — evaluate this in Chrome MCP:

```js
() => {
  const backdrops = [
    ...document.querySelectorAll(
      '[class*="bleedBackground"],[class*="backdrop"],[class*="gradient"]',
    ),
  ];
  return backdrops.map(el => {
    const es = getComputedStyle(el);
    if (Number(es.zIndex) >= 0) return { ok: true, reason: 'not negative z-index' };
    let stackingAncestor = null;
    let opaqueAncestor = null;
    let c = el.parentElement;
    while (c) {
      const s = getComputedStyle(c);
      const isStackingCtx =
        (s.position !== 'static' && s.zIndex !== 'auto')
        || s.isolation === 'isolate'
        || s.transform !== 'none'
        || s.filter !== 'none'
        || s.willChange.includes('transform');
      const isOpaque =
        (s.backgroundColor
          && s.backgroundColor !== 'rgba(0, 0, 0, 0)'
          && s.backgroundColor !== 'transparent'
          && !/rgba\(.+,\s*0\)/.test(s.backgroundColor))
        || (s.backgroundImage && s.backgroundImage !== 'none');
      if (isStackingCtx && !stackingAncestor) stackingAncestor = c;
      if (isOpaque && !opaqueAncestor) opaqueAncestor = c;
      if (opaqueAncestor && !stackingAncestor) {
        return {
          ok: false,
          reason: 'opaque ancestor reached before stacking context — backdrop is invisible',
          opaqueAncestor: opaqueAncestor.className,
          fix: "add `isolation: isolate` or `z-index: 0` to the backdrop's parent",
        };
      }
      if (stackingAncestor) return { ok: true };
      c = c.parentElement;
    }
    return { ok: !!stackingAncestor };
  });
};
```

If any backdrop returns `ok: false`, fix it at the source (add `isolation: isolate` or `z-index: 0` to the closest wrapper) before proceeding.

### 8d.2 — Start/end icon identity

For every slot containing one of: a search input, a form submit button, an inline icon at a card corner, a nav-item icon:

1. Query the inline SVG in the prototype: `element.querySelector('svg')`. Record its `path` descendants' `d` attribute values.
2. Query the matching element on canva.com — same selector. Record the same.
3. `d` attribute values must match character-for-character (modulo whitespace). A mismatch means the wrong icon variant was ported.

Common mismatch signatures:

- Prototype renders `MagicSearchColorIcon` (color gradient) when canva.com renders plain `SearchIcon` (currentColor). Distinguishable by `fill="url(#paint...)"` vs `fill="currentColor"` and by whether the SVG contains `<defs><linearGradient>…</linearGradient></defs>`.
- Prototype renders arrow icon when no end-control exists on canva.com (see 8d.3).

### 8d.3 — Interactive-child inventory

For every slot that is a pill, card, search surface, or toolbar, count and identify the interactive descendants:

```js
root => {
  const nodes = [
    ...root.querySelectorAll(
      'button, a[href], a[role=button], [tabindex]:not([tabindex="-1"]), input, select, textarea',
    ),
  ];
  return nodes.map(n => ({
    tag: n.tagName,
    role: n.getAttribute('role'),
    aria: n.getAttribute('aria-label') || n.textContent.trim().slice(0, 40),
    testid: n.getAttribute('data-testid'),
  }));
};
```

Run on prototype slot root and canva.com slot root. Diff by `(tag, role, aria)` tuples. Extra rows in prototype → controls to remove; missing rows → controls to port.

### 8d.4 — Ordered-list label sequence

For every slot that renders a list of tabs, pills, menu items, nav rows, category icons, or anything CMS-ordered:

1. Collect the visible label of each item in DOM order from the prototype.
2. Collect the same from canva.com.
3. Arrays must be equal (same labels, same order). A mismatch means the source enum was read from the wrong branch or the wrong CMS response.

### 8d.5 — Typography per route

For every text element in the slot (title, section heading, placeholder, label, body):

1. Record on canva.com: `font-size`, `font-weight`, `line-height`, `letter-spacing`, `color`, presence of `background-clip: text`, `font-variation-settings`.
2. Record on prototype: same.
3. Diff. A mismatch indicates the porter copied typography from a neighbouring route (common failure: `/home`'s `heroTitleOverride` copied to `/templates` which uses plain `Title size="large"`).

### 8d.5a — Sub-route banner inheritance

When porting a **sub-route of an already-ported page** (e.g. `/projects/your-projects` under `/projects`, or `/offline-designs` which shares the `/projects` shell):

1. **Trace the source composer of the sub-route**. If the monorepo renders the same banner component as the parent (common — same `CombinedProjectsBanner` or `DesktopBanner` instance), the sub-route inherits the **entire banner frame**: gradient, `min-height`, `heroTitle` + inner-span `heroTitleOverride` typography pattern, padding structure.
2. **Never re-style the banner from scratch for a sub-route.** Copy the parent page's `index.module.css` banner rules verbatim (`.wonderBoxPlaceholder`, `.bannerContentArea`, `.heroTitle`, `.heroTitleOverride`) and change **only** the rendered title string + any per-route affordance differences (e.g. Creator filter present/absent, See-all visibility).
3. **Common failure:** collapsing the `<h3 class="heroTitle"><span class="heroTitleOverride">Title</span></h3>` nesting into a single `<h2>` with hand-picked numbers (32/600/40) because those numbers match the outer `heroTitle` class. The inner span's `heroTitleOverride` (40/500/44, letter-spacing `-1px`) is what actually paints — skipping the nesting halves the visual weight.
4. This complements 8d.5 rather than contradicting it: cross-page inheritance is the failure; same-page sub-route inheritance is the expectation. The deciding factor is which banner component the source composer mounts.

### 8d.6 — Multi-layer rounded-pill integrity

Some slots render as a **stack of rounded-rect layers**, not a single pill. The WonderBox search bar is the canonical case: canva.com has an **outer 800×64 visible pill** (border-radius 20px, gradient bg + halo shadow) AND a separate **inner 744×40 input sub-element** (border-radius 8px, no bg/shadow) — two distinct rounded layers.

Porters repeatedly collapse these into one layer and pick the wrong height (40 instead of 64). A single-layer approximation passes 8b/8c because the overall bounds match, but the user sees the wrong height.

**For every slot that contains a rounded pill (search, chip, banner CTA, promo card, avatar ring)**:

1. Probe canva.com for ALL absolute-positioned descendants with `box-shadow !== 'none'` OR `border-radius !== '0px'` AND with a visible gradient/solid background:

```js
() => {
  const anchor = document.querySelector('form, [class*="wonderBox"], [class*="searchInput"]');
  const descendants = [...(anchor || document.body).querySelectorAll('*')];
  return descendants
    .map(el => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { el, cs, r };
    })
    .filter(({ cs }) => cs.borderRadius !== '0px' || cs.boxShadow !== 'none')
    .filter(
      ({ cs }) =>
        cs.boxShadow !== 'none'
        || cs.backgroundImage !== 'none'
        || (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent'),
    )
    .map(({ el, cs, r }) => ({
      cls: (el.className || '').toString().slice(0, 60),
      w: Math.round(r.width),
      h: Math.round(r.height),
      borderRadius: cs.borderRadius,
      boxShadow: cs.boxShadow.slice(0, 80),
      bg: cs.backgroundImage === 'none' ? cs.backgroundColor : 'gradient',
      position: cs.position,
      zIndex: cs.zIndex,
    }));
};
```

2. Run the same probe on the prototype's slot root.
3. Rule: every rounded layer on canva.com (distinct by `w×h` + `border-radius`) must have a matching layer on the prototype.
4. If canva.com has 2 rounded layers and the prototype has 1 → **fail** — port the missing layer. Do NOT set a single element's height to the OUTER pill height while keeping the inner radius/padding — that produces the wrong inner sub-element geometry.

**Why this step exists:** /templates WonderBox was ported TWICE with this collapse — once at 48px (first port), once at 40px (first "fix"). Both passed 8b/8c. The user flagged both. Multi-layer integrity catches what single-bounds geometry cannot.

### 8d.7 — Write the sweep report

Write `validation/dom-fidelity-sweep.json`:

```json
{
  "route": "/templates",
  "slots": [
    {
      "slot": "HERO",
      "backdropPaint": { "bleedBackground": "ok" },
      "icons": [
        {
          "name": "search start",
          "canvaD": "M15.2 16.34…",
          "protoD": "M15.2 16.34…",
          "match": true
        }
      ],
      "interactiveChildren": { "missingInProto": [], "extraInProto": [] },
      "orderedLists": [
        {
          "name": "category pills",
          "canva": ["Business", "Social media", "Video", "Learn Grid"],
          "proto": ["Business", "Social media", "Video", "Learn Grid"],
          "match": true
        }
      ],
      "typography": [
        {
          "name": "title",
          "canva": { "fs": "32px", "fw": "600" },
          "proto": { "fs": "32px", "fw": "600" },
          "match": true
        }
      ]
    }
  ]
}
```

**A page does not pass porter until every entry in this file is `match: true` / `ok: true`.**

Order of operations: Step 8b → 8c → 8d. If 8d discovers a fix that changes geometry, re-run 8c. If 8c discovers a fix that reorders DOM, re-run 8d.

---

Summarize:

- Slots ported successfully (with source paths)
- Slots with deviations (with deviation reasons)
- Prototype route to navigate to
- Any remaining fidelity failures requiring manual investigation
- Any slots that could not be located in the monorepo

---

## Workspace cleanup

The `.porter-workspace/` directory is ephemeral and gitignored. Leave it in place for debugging. The user can delete it manually.

---

## References

- `page-porter/references/slot-manifest-schema.md` — manifest.json format
- `page-porter/references/port-result-schema.md` — audit/result/validation formats
- `page-porter/references/structural-differences.md` — known Vite vs monorepo structural differences
