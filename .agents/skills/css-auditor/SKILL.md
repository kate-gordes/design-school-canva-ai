# Skill: Source Auditor

**Role**: Code analysis only. Read monorepo source. Resolve CSS tokens. Detect transform rules. No canva.com access. No screenshots. No DOM snapshots.

You are spawned by the `page-porter` orchestrator with one slot's source path. Your job is to recursively read the source TSX and CSS, resolve every token to a concrete value, and write `audits/<slotName>.json`.

---

## What this skill does and does NOT do

**Does:**

- Read all `.tsx` and `.css` files in the slot's import chain
- Resolve `@value` token imports to concrete px/hex values
- Detect CSS transform rules that need to change for Vite (Rules A, F, S)
- Detect cross-file `composes:` chains that Vite won't resolve
- Detect `.inline.svg` imports and read the SVG files
- Extract the Easel component spec (every Easel component usage with props)

**Does NOT:**

- Access canva.com or take screenshots
- Measure DOM elements
- Describe what a component renders or what content it contains
- Infer structure from screenshots

The slot-porter reads every source file directly. Your job is to resolve what the slot-porter cannot chase on its own: `@value` chains, cross-file `composes:`, and inline SVG paths.

---

## References

- `css-auditor/references/token-values.md` — Rule Z token resolution table
- `css-auditor/references/css-transform-rules.md` — Rules A, B, F, S detection

---

## Input

```json
{
  "slotName": "WONDER_BOX",
  "sourcePath": "pages/home/wonder_box/page",
  "workspaceDir": ".porter-workspace/Home",
  "requiredAdvisories": ["inlineSvg"]
}
```

---

## Step 1 — Collect all files in the import chain

Starting from `~/work/canva/web/src/<sourcePath>/`:

```
For each .tsx file encountered:
  1. Read it fully.
  2. Find every: import styles from './foo.css'
  3. Read that CSS file fully. Do not skip it.
  4. Find every sub-component import (non-Easel, non-service).
  5. Recurse into that sub-component: read its .tsx AND its .css.
  6. Stop recursion at pure ui/base/* Easel primitives, services, analytics, stores.
```

**Reading the TSX without its co-located CSS is always incomplete.** Layout-critical properties are often split:

- The `.css` sets: height, max-width, border-radius, breakpoint rules
- The `.tsx` sets via Easel props: `paddingX`, `gap`, `display`, `flexDirection`, `width="full"`

Read both. Add every file to `auditResult.sourceFiles` as you go.

**For nav/shell slots** — the import chain from the entry point alone is not enough. Trace additional layers:

- The primary nav component that controls what renders and in what order
- The item list component that defines which nav items appear
- Any icon mapping file that resolves icon name strings to SVG files (see below)
- The action button component for any CTA button in the nav

Find these by searching from the nav entry point:

```bash
grep -r "^import" ~/work/canva/web/src/<sourcePath>/ --include="*.tsx" | grep -v "ui/base" | head -30
```

Add every discovered file to `auditResult.sourceFiles`.

### Step 1a — Trace the OUTER composer (mandatory, not optional)

**The slot's own import chain is NOT enough.** The file that MOUNTS the slot (typically `*_content.tsx`, `install_*.tsx`, or a page-level `create.tsx`) usually wraps the slot in `<Rows spacing="Xu">`, `<Box paddingX="Xu">`, or adds sibling `<Spacer size="Xu" />` nodes. These are invisible from inside the slot but show up as vertical/horizontal offsets in the rendered page.

**Procedure:**

1. Find the file that imports the slot entry point:
   ```bash
   grep -rln "import.*<slotEntryFileBaseName>" ~/work/canva/web/src/ --include="*.tsx" | grep -v stories | grep -v tests
   ```
2. Read the outer composer fully. Record in `auditResult.outerComposerSpacing`:
   - Parent wrapper component (`Rows`, `Columns`, `Box`, raw `<div>`)
   - `spacing` prop value (resolved to px)
   - `paddingX` / `paddingY` / `padding` prop values (resolved to px)
   - Any sibling `<Spacer size="..." />` rendered before/after the slot, with its px height
   - Any `max-width`, `margin: 0 auto`, or `align` prop that centers/caps the slot's horizontal extent
3. Add the composer's `.css` file (if any) to `sourceFiles`.
4. If the slot is rendered inside a shell (e.g. `shell_layout.tsx`), **also** read `shell_layout.css` (or equivalent) and record its content-column `max-width`, margin, padding. This is what determines where the slot actually sits horizontally at any viewport.

**Example (why this matters):**

`/projects/your-projects` sub-route: the slot's own CSS had no `min-height`. The outer composer mounts `CombinedProjectsBanner` which renders `<SplitColumnLayoutBanner min-height: 277px>`. An audit that skips the outer composer produces a banner that's 124px tall instead of 277px — everything below is offset upward by 153px.

**String icon identifiers — component-local resolution (applies everywhere, not just nav):**

When a component uses a string to identify an icon (e.g. `icon="notification-bell"`, `icon="home"`, `icon="folder"`), that string does NOT resolve through the generic Easel icon library at `ui/base/icons/`. It resolves through the **component's own icon lookup** — typically an `icons.ts` file co-located with the component that contains a switch/map from string → SVG import.

For any `icon="<name>"` prop you encounter:

1. Find the component's `icons.ts` (or equivalent): `find <sourcePath> -name "icons.ts"`
2. Locate the matching `case '<name>':` or map entry
3. Follow the import to the `.inline.svg` file in the component's local `icons/` directory
4. Record that SVG path in `inlineSvgAssets` — this is the file to inline, not any `ui/base/icons/` equivalent

These component-local SVGs are purpose-designed for that component and will look different from any generic icon with a similar name.

**For each Easel component used** (`Button`, `Box`, `Avatar`, `CardImageThumbnail`, `Title`, `Text`), also read its CSS file to get rendered pixel values:

- `Button`/`NeutralButton`/`ButtonLink` → `ui/base/button/private/button.css`
- `Title`/`Text`/`InheritColor` → `ui/base/typography/internal/typography.css`
- `Box` → `ui/base/box/private/box.css`
- `Avatar` → `ui/base/avatar/private/avatar.css`
- `CardImageThumbnail` → `ui/base/card/private/card.css`

---

## Step 2 — Build the audit table

For every rendered element, record all CSS properties. Resolve every token to a concrete value using `references/token-values.md`.

| Element    | Source file      | Properties                                                                 | Notes               |
| ---------- | ---------------- | -------------------------------------------------------------------------- | ------------------- |
| container  | `hero.css`       | `min-height: calc(100vh - 80px)`, `position: relative`                     |                     |
| title h1   | `hero.css`       | `font-size: 80px`, `font-weight: 700`, `color: #1a1a2e`                    |                     |
| CTA button | `button.css`     | `padding: 0 12px`, `height: 40px`, `border-radius: 8px`                    |                     |
| CTA span   | `typography.css` | `font-size: 14px`, `font-weight: 600`, `font-variation-settings: 'opsz' 0` | cross-file composes |

**Never leave a token name in the table.** Every value must be a concrete px/hex/rgba.

All values come from the source CSS files. There is no canva.com measurement step. The source code is authoritative.

### Layout-structure properties MUST be captured verbatim

For every element, the audit table must include these properties when they appear in the source CSS — **even if they seem inferrable from other values**:

| Property                  | Why it's load-bearing                                                                                                                                                                                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `display`                 | `grid` vs `flex` vs `block` changes row-height resolution. Never infer. Record exactly what the CSS says.                                                                                                                                                                                                      |
| `grid-template-rows`      | Grid rows WITHOUT this default to `min-content`; WITH this use the exact pixel values. Affects caption / label heights by 1–3px.                                                                                                                                                                               |
| `grid-template-columns`   | Same reason as above for horizontal.                                                                                                                                                                                                                                                                           |
| `line-height`             | NEVER derive from font-size. If source CSS says `22px`, record `22px`. Do not "round to match font-size".                                                                                                                                                                                                      |
| `font-variation-settings` | `"opsz" 0` vs `"opsz" 100` changes letterforms. Easel's Text/Title classes set this — capture from the `composes` chain.                                                                                                                                                                                       |
| `gap`                     | Missing on source → do NOT invent one in the prototype. Record "not set" explicitly.                                                                                                                                                                                                                           |
| `padding` / `margin`      | Source sibling `<Spacer size="1u">` renders as a separate 8px node, NOT as `padding: 8px` on the adjacent element. Record the spacer as its own entry.                                                                                                                                                         |
| `align-items`             | Only record when source `<Box>` has an explicit `alignItems` prop. Otherwise record "default (stretch)".                                                                                                                                                                                                       |
| `min-height`              | LOAD-BEARING — a sub-route banner that drops a source `min-height: 277px` collapses to its text height and breaks the title→filter vertical rhythm. Always record, never infer from content.                                                                                                                   |
| `max-width`               | LOAD-BEARING — content-column caps (e.g. `max-width: 1760px` on `/projects .bannerContentArea` and `.section`) control horizontal centering at wide viewports. A dropped cap centers items against a 2400px+ column instead of the intended 1760px, visibly mis-aligning search bars, titles, and filter rows. |
| `width`                   | Record when fixed (e.g. `width: 443px` on a search bar). Agent must NOT substitute `width: 100%` + `max-width` for a fixed width — different flex resolution.                                                                                                                                                  |

**Rule:** if the source CSS defines a property explicitly, the audit table records it explicitly. The prototype CSS then emits it verbatim (same keyword, same value). No re-expression allowed in either direction.

**Rule — sibling spacers are their own audit entry:** When source renders `<Thumbnail /><Spacer size="1u" /><Caption />`, the audit must list THREE entries: thumbnail, spacer (8px height), caption. Do NOT merge the spacer into the caption's padding-top — the prototype porter can decide whether to collapse, but must have the source structure to compare against.

---

## Step 3 — Detect CSS transform issues

Scan every `.css` file for the patterns in `references/css-transform-rules.md`:

**Rule A/F**: Find `@value X from "..."` lines. Record in `valuesToInline`:

```json
{ "name": "largeUp", "value": "(min-width: 1200px)", "foundIn": "hero.css", "rule": "A" }
{ "name": "maxPageWidth", "value": "2560px", "foundIn": "hero.css", "rule": "F" }
```

**Rule S**: Find `@value` names used as CSS selectors (not in property values):

```json
{ "name": "themeLight", "value": ":global(.light)", "foundIn": "hero.css", "rule": "S" }
```

**Rule V — `@value` selector-alias (Vite CSS Modules bug)**: Find `@value` declarations whose **value** is itself a selector (starts with `:`, `.`, `#`, or contains `:is(`, `:where(`, `:not(`, `:has(`). These compose selectors rather than name scalar values, and Vite's CSS Modules plugin silently drops them — emitting the alias name lowercased as a dead type selector (e.g. `afadetarget { ... }`).

Detection grep:

```bash
grep -E '^@value [a-zA-Z][a-zA-Z0-9]*:\s*[.:#]' <cssFile>
grep -E '^@value [a-zA-Z][a-zA-Z0-9]*:.*:(is|where|not|has)\(' <cssFile>
```

Record each hit in `valueSelectorAliases`:

```json
{
  "name": "aFadeTarget",
  "value": ":is(.hoverTarget.defaultFx, .hoverTarget.fxFade, .fxFade .hoverTarget:not(.fxSlide):not(.fxAppear))",
  "foundIn": "ui/base/badge/private/badge_container.css",
  "rule": "V",
  "workaround": "slot-porter Step 3a — re-express with unhashed [class*='...'] selectors in src/style.css"
}
```

The slot-porter uses this list to confirm the `src/style.css` workaround is in place for any affected module before porting a slot that depends on the dropped rule (hover-reveal affordances, SwapOnHover, fxFade/fxSlide/fxAppear effects).

**Rule B**: Note any CSS files that will need to be imported by prototype TSX.

---

## Step 4 — Detect `composes:` chains

For every CSS class that uses `composes:`, trace the full chain:

1. Find `composes: X` in any rule
2. Read the source of `X` (same file or imported via `@value X from "..."`)
3. Collect all properties `X` contributes
4. Record in `composesChains` with `missingInPrototype: true` if it's cross-file

**The most common critical case** — Easel button `textBoldMedium` chain:

- `button.css` has `composes: textBoldMedium` on `.button`
- `textBoldMedium` resolves to: `font-size: 14px`, `font-weight: 600`, `line-height: 22px`, `font-variation-settings: 'opsz' 0`, `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `font-smooth: always`, `text-size-adjust: none`
- This is cross-file → `missingInPrototype: true`
- The slot-porter must add these explicitly to `.<localClass> > span`

Record as:

```json
{
  "selector": ".loginButton",
  "composesFrom": "textBoldMedium",
  "resolvedProperties": {
    "fontSize": "14px",
    "fontWeight": "600",
    "lineHeight": "22px",
    "fontVariationSettings": "'opsz' 0",
    "webkitFontSmoothing": "antialiased",
    "mozOsxFontSmoothing": "grayscale",
    "fontSmooth": "always",
    "textSizeAdjust": "none"
  },
  "missingInPrototype": true
}
```

---

## Step 5 — Detect inline SVG assets

```bash
grep -r "\.inline\.svg" ~/work/canva/web/src/<sourcePath>/
```

For each `.inline.svg` import found, read the actual SVG file and record:

```json
{
  "importPath": "./icons/play.inline.svg",
  "resolvedPath": "pages/anon_home/body/hero_editorial_video/icons/play.inline.svg",
  "fillToReplace": "#191E26"
}
```

Read the actual SVG file to confirm the `fill` value. The most common fill value is `#191E26` — but verify; some SVGs use `#FFFFFF` or `currentColor` already.

---

## Step 6 — Extract Easel component spec

Scan every source `.tsx` file and build an `easelComponentSpec` table.

For every Easel component call in the source TSX, record:

```json
{
  "component": "Box",
  "sourceFile": "wonder_box.tsx",
  "sourceLineApprox": "45",
  "props": {
    "paddingX": "3u",
    "paddingY": "2u",
    "gap": "1u",
    "display": "flex",
    "flexDirection": "column",
    "width": "full"
  },
  "className": "styles.container"
}
```

**Which components to capture:**

- Layout: `Box`, `Rows`, `Columns`, `Inline`, `Grid`, `Spacer`, `Column`
- UI: `Button`, `NeutralButton`, `CircleButton`, `ButtonLink`, `Pill`, `BaseSelect`, `Select`
- Typography: `Text`, `Title`, `InheritColor`
- Media: `Avatar`, `CardImageThumbnail`
- Structural: `ThemeBoundary`

**Props to capture** (all of these when present):

- Spacing: `paddingX`, `paddingY`, `padding`, `gap`, `spacing`, `rowGap`, `columnGap`
- Size: `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`
- Layout: `display`, `flexDirection`, `alignItems`, `justifyContent`, `wrap`
- Appearance: `variant`, `size`, `tone`, `shape`
- Typography: `size` (for Text/Title), `weight`, `alignment`
- Functional: `tagName`, `ariaLabel`

Do not capture event handler props (`onClick`, `onFocus`, etc.).

---

## Step 7 — Set structural flags

```json
{
  "hasNavContentHeight": true,
  "gradientPattern": "fullBleed",
  "hasThemeBoundary": true,
  "headerVariant": "overlay"
}
```

Set `hasNavContentHeight: true` when source CSS contains `navContentHeight` token or `calc(100vh - 80px)`.

Set `gradientPattern`:

- `"fullBleed"`: source CSS uses full-width gradient trick (`width: calc(100% + 2 * mobilePageHorizontalPadding)` or similar)
- `"contained"`: gradient is within normal content width
- `"none"`: no gradient

Set `headerVariant` based on what the page's source specifies as its initial header state.

Set `inheritsBannerFrom: "<parentPageName>"` when this slot is the banner/hero of a **sub-route** whose source composer mounts the same banner component as a parent route that has already been ported (e.g. `/projects/your-projects` inherits from `/projects`; `/offline-designs` shares the same shell + banner wiring).

- Detection: the sub-route's composer (e.g. `combined_projects_content.tsx`) uses the same banner prop (`CombinedProjectsBanner`) as the parent; or the source uses the same `DesktopBanner` + `home_of_x/create.tsx` wiring for both.
- Consequence for slot-porter: copy the parent route's banner CSS (`.wonderBoxPlaceholder`, `.bannerContentArea`, `.heroTitle`, `.heroTitleOverride`, `.filtersRow`, `.section`) VERBATIM from `src/pages/<ParentPage>/index.module.css`. Change only the title string, active nav id, and per-route affordance differences (filter labels, See-all visibility). Do NOT re-style the banner from scratch.
- Omit this flag when the sub-route's composer mounts a genuinely different banner (verified by reading both composers).

---

## Step 8 — Write audit file

Write to `.porter-workspace/<PageName>/audits/<slotName>.json`:

```json
{
  "slotName": "WONDER_BOX",
  "sourcePath": "pages/home/wonder_box/page",
  "sourceFiles": ["pages/home/wonder_box/page/page.tsx", "pages/home/wonder_box/page/page.css", "..."],
  "auditTable": [...],
  "easelComponentSpec": [...],
  "valuesToInline": [...],
  "valueSelectorAliases": [...],
  "composesChains": [...],
  "inlineSvgAssets": [...],
  "structuralFlags": { ... },
  "requiredAdvisories": [...]
}
```

Report back to orchestrator:

- Path to audit file
- Count of source files read
- Count of audit rows
- Count of `valuesToInline` entries
- List of required advisories detected

---

## ⛔ Hard constraints

- **Write zero prototype code**
- **Never access canva.com** — no DOM snapshots, no measurements from the live site
- **Never leave token names in the audit table** — every value must be a concrete px/hex/rgba
- **Never guess or approximate a value** — grep for it if you can't find it directly. If genuinely not found after grepping, record as `"UNKNOWN [grep failed: <command run>]"`
- **Monorepo source is authoritative** — CSS values come from reading source files, not from measuring screenshots
