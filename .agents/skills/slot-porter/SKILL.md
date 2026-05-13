# Skill: Slot Porter

**Role**: TSX transplant from monorepo. Copy source. Strip only what you must.

**Quality target: faithful representation of the monorepo source. Every element, component, and CSS value in the prototype must either (a) match the monorepo source exactly, or (b) have a logged deviation with a valid reason code. The monorepo source is the authority — not screenshots, not canva.com, not guesses.**

You are spawned by the `page-porter` orchestrator with one slot's audit result. Your job is to transplant the monorepo TSX and CSS into the prototype with the minimum changes needed to make it work in the Vite environment. The output should be as structurally identical to the monorepo source as possible.

**Prerequisites — check before writing any code:**

1. Confirm `index.html` contains `html { font-size: 62.5%; }` — see Rule R in component-patterns.md. If missing, add it first.

**References — always available:**

- `slot-porter/references/component-patterns.md` — Rules R, S, W, X, Y, P, K, N, Q, E, B
- `slot-porter/references/asset-handling.md` — Rules G, U, I (SVG inline, image sizing, Easel icon size variants)
- `slot-porter/references/tsx-extraction.md` — Strip rules: Vite incompatibles, business logic, complex DOM

**Advisory references — load ONLY when flagged:**

| Flag in `requiredAdvisories` | Read before writing                                                |
| ---------------------------- | ------------------------------------------------------------------ |
| `scrollAwareHeader`          | `.agents/skills/component-advisories/scroll-aware-header.md`       |
| `footer`                     | `.agents/skills/component-advisories/footer-reconstruction.md`     |
| `navFlyout`                  | `.agents/skills/component-advisories/nav-flyout.md`                |
| `inlineSvg`                  | `.agents/skills/component-advisories/inline-svg-handling.md`       |
| `designCreationShortcuts`    | `.agents/skills/component-advisories/design-creation-shortcuts.md` |
| `shellLayout`                | `.agents/skills/component-advisories/shell-layout.md`              |
| `secondaryNav`               | `.agents/skills/component-advisories/secondary-nav.md`             |

Do not load advisories not in the flags list.

---

## The Transplant Model

The fundamental rule: **copy the monorepo source, then strip or replace only what meets one of three valid reasons.**

```
1. Vite incompatible  — the code would crash or not compile in Vite
2. Business logic     — non-visual code: services, DI, API calls, analytics, stores
3. Overly complex DOM — component hierarchy adds 4+ nesting levels with zero visual difference
                        (this is a rare exception; document why)
```

**Every deviation from the monorepo source must be logged** in the port result's `deviations[]` array with the reason code (`vite` / `logic` / `dom-complexity`) and a description.

If you cannot identify which valid reason justifies a deviation, keep the monorepo code — do not simplify for convenience.

### What this means in practice

- **Copy Easel component calls verbatim.** `<Box paddingX="3u" gap="2u">` in the source becomes `<Box paddingX="3u" gap="2u">` in the prototype. Never substitute with `<div style={{ padding: '24px', gap: '16px' }}>`.
- **Copy layout structure verbatim.** `<Rows>`, `<Columns>`, `<Inline>`, `<Grid>`, `<Spacer>` hierarchy from the source maps directly to the prototype.
- **Copy CSS class assignments verbatim.** If the source applies `className={styles.container}`, keep it.
- **Copy JSX render order verbatim.** Items listed first in the source render first.
- **Copy conditional renders verbatim** — but replace flag-gate conditions with `true` or `false` static values.

---

## Input

Read the audit file at `.porter-workspace/<PageName>/audits/<slotName>.json`.

The audit provides:

- `sourceFiles` — the exact files to read (**the only thing you need from this section**)
- `auditTable` — resolved CSS values (use for CSS verification only, never as a blueprint for what to render)
- `easelComponentSpec` — Easel props from source (use to verify you copied them correctly, not as a substitute for reading source)
- `valuesToInline` — `@value` tokens that need inlining (Rules A, F, S)
- `composesChains` — cross-file composes chains with resolved properties
- `inlineSvgAssets` — `.inline.svg` files with resolved paths and fill values
- `structuralFlags` — hasNavContentHeight, gradientPattern, hasThemeBoundary, headerVariant
- `requiredAdvisories` — which advisory files to load

**The audit is context for CSS transforms and DOM measurements. It is NOT a description of what to render or what content exists. The monorepo source files are the only authority on structure, content, and render order.**

---

## Step 1 — Read all source files (FIRST — before anything else)

**Read every file in `auditResult.sourceFiles` before writing a single line of prototype code.** These are the files you are transplanting from. Your prototype is a copy of these files with the minimum changes required to run in Vite.

For each TSX file:

1. Read it fully. Understand its render tree, component hierarchy, and JSX structure.
2. **Find every item list** — nav item arrays, carousel item arrays, filter option arrays, card data arrays. These are defined as TypeScript constants, config objects, or `fakes.ts` files. Read them. The items visible in the prototype must come from these arrays, not from your own imagination or DOM snapshot observations.
3. Note any pattern from `tsx-extraction.md` that requires stripping. **Mark these mentally but do not strip anything yet** — complete your read of all files first.

For each CSS file:

1. Read it fully. The CSS you write will be a copy of this file with @value transforms applied.

**Never describe what you think a component does — read the source and know what it does.**

---

## Step 1b — Deep source trace (MANDATORY — do not skip)

The css-auditor's `sourceFiles` list is a starting point, not a complete inventory. **You must extend it.** For every TSX file you just read:

1. **Find every non-Easel, non-service import** (imports that point into `pages/`, `ui/design_creation/`, `ui/organizing/`, or sibling directories). Read those files too. Add them to your working source set.

2. **Follow sub-component props to their rendered output.** If source passes `end={<ChevronDownIcon />}` to a `Pill`, that chevron WILL render visually — you must include it. If source passes `icon={SortIcon}` to a `Button`, read that icon's import path and inline the SVG. Do not stop at "a Pill with some props" — trace what every prop renders.

3. **Resolve every Easel size/variant prop to its pixel value.** Read the relevant Easel component CSS to get the actual dimensions:
   - `CircleButton size="large"` → read `ui/base/button/private/button.css` → find `.large { width: ...; height: ...; }` → record the resolved px value
   - `size="xlarge"` on a shortcut thumbnail → find the size class definition → record 72px
   - Never guess what `size="medium"` or `size="xlarge"` renders to — look it up.

4. **Stop recursion at:** `ui/base/` Easel primitives, service/DI files, analytics modules, mobx stores.

**Any visual property you cannot find in a source file must be grepped for.** Run:

```bash
grep -r "xlarge\|size.*medium\|thumbnailSize" ~/canva/web/src/<sourcePath>/
```

before approximating any value. If grep returns nothing relevant, widen the search to the monorepo root. **Never approximate a value you could grep for.**

---

## ⛔ No-Substitution Policy (CSS structure & typography)

The #1 recurring cause of 1–3px drift in ported slots is **re-expressing source CSS** in a form that's "equivalent on paper" but rounds differently. These substitutions are **prohibited**:

| Prohibited substitution                                                              | Reason it fails                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `display: flex; flex-direction: column; gap: Xpx` → replacing source `display: grid` | Grid row sizing uses `min-content` font metrics (ascent + descent). Flex uses line-box. Same content renders 1–3px differently.                                                                                                    |
| `padding-top: Xpx` on a container → replacing a source sibling `<Spacer size="Xu">`  | Collapsing a separate node changes how line-box descent cascades into the parent. Only collapse when measurements match.                                                                                                           |
| Rounding `line-height: 22px` → `24px` (or any "nicer" value)                         | Line-height comes from Easel's token tables, not font-size×heuristic. 2px off line-height = 2px off every text line.                                                                                                               |
| Omitting `grid-template-rows: 25px 20px` when source has it                          | Grid rows WITHOUT explicit sizing use `min-content`; WITH explicit sizing they use the declared pixel value.                                                                                                                       |
| Inferring `align-items: center` when source `<Box>` has no `alignItems` prop         | See Step 4 — already documented. Default is stretch, not center.                                                                                                                                                                   |
| Dropping a source `min-height` because "content already fills it"                    | Sub-route banners collapse from 277px to ~124px without their source `min-height`; every anchor below shifts up by 150px. Min-height is a floor, not a hint.                                                                       |
| Capping at a different `max-width` than source (or dropping the cap entirely)        | Content columns in `/home`, `/projects`, etc. cap at 1760px (`calc(8px * 220)`). Dropping the cap centers elements against a 2400px+ column at wide viewports, mis-aligning search bars, titles, and filter rows.                  |
| Collapsing per-pair inter-anchor margins into one flex `gap`                         | Title→search→pills stacks use different gaps per pair on canva.com (e.g. 16px title→search, 24px search→pills). A uniform flex `gap: 20px` on the parent matches no pair exactly. Encode per-anchor `margin-top` or `padding-top`. |
| Substituting `width: 100%; max-width: Xpx` for a source `width: Xpx`                 | Fixed and max-width widths resolve differently under flex (`flex-basis: Xpx` vs `flex-basis: auto` + max). A search bar that should be 443px fixed stretches to its flex parent when expressed as `width: 100%`.                   |

**Hard rule:** when the source CSS specifies `display`, `grid-template-rows`, `grid-template-columns`, `line-height`, `padding`, `margin`, `gap`, `min-height`, `max-width`, or a fixed `width`, the prototype CSS carries that property **verbatim** — same keyword, same pixel value. Never substitute a visually "equivalent" alternative.

**Protocol when transplanting any caption / label / metadata row:**

1. Read the source CSS module for the caption AND any parent that might set grid-template-rows or explicit line-heights.
2. Use DevTools MCP against canva.com to read `getComputedStyle(captionEl).gridTemplateRows` and `.display`. These are the ground truth — the source CSS may set these via a parent rule or composes chain that the reader missed.
3. If canva renders `display: grid` with explicit `grid-template-rows`, the prototype MUST render `display: grid` with the same `grid-template-rows`. No flex-column substitute.
4. If canva renders a sibling spacer + caption, and you want to collapse into a single element with `padding-top`, verify by measurement that the total height matches before committing. If it's off by >1px, restore the sibling structure.

---

## ⛔ No-Approximation Policy

These actions are **prohibited**:

| Prohibited                                                           | Required instead                                                                                                  |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Using a placeholder SVG icon                                         | Grep the monorepo for the icon file; inline the actual SVG                                                        |
| Guessing a pixel size (e.g. "probably 48px")                         | Read the CSS class definition that defines that size                                                              |
| Inventing a color (e.g. "probably a purple")                         | Find the exact `@value` or token and resolve it                                                                   |
| Using `circleColor: undefined` because you're not sure               | Find the color constant in the source config file                                                                 |
| Writing `height: 100%` without checking source                       | Read the actual height calculation in the source CSS                                                              |
| Hardcoding a solid hex for a placeholder/thumbnail background        | Trace the full token chain — `colorUiNeutralSubtleBg` → `colorBlackA01` → `#404F6D0F` = `rgba(64, 79, 109, 0.06)` |
| Measuring a color from canva.com pixels and using that as the source | Read the source CSS `@value` declaration and resolve the token; pixel measurement is for verification only        |

**Token chains to always resolve fully — never approximate as solid hex:**

| Token                      | Resolved (light mode)                 | Notes                                                                                                                                                                     |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `colorUiNeutralSubtleBg`   | `rgba(64, 79, 109, 0.06)` (#404F6D0F) | Thumbnail/card placeholder background. Semi-transparent — using a solid approximation breaks dark mode and non-white backgrounds.                                         |
| `elevationSurfaceBg`       | `#FFFFFF`                             | Background of the scroll container / page content area inside the card (`pageContent`). If this is missing, the outer gradient bleeds through the transparent card frame. |
| `elevationSurfaceRaisedBg` | `#FFFFFF`                             | Background of raised surfaces (modals, dropdowns). Same value as `elevationSurfaceBg` in light mode.                                                                      |

**Shell scroll container background rule:** The inner scroll container (equivalent to `.pageContent` in shell_layout.css) must have `background: #ffffff` (`elevationSurfaceBg`). The card frame itself is transparent — the outer layout gradient is visible only in the 8px gutter around the card. Without this white background on the scroll container, the gradient leaks into the card interior.

**SVG fill-opacity rule:** When an SVG component uses CSS classes for path colours (common in folder thumbnails), `getComputedStyle(path).fill` returns the fill colour but **not** the fill-opacity. A path styled as `fill: white; fill-opacity: 0.4` will report `fill: rgb(255, 255, 255)` — identical to a solid white path. Always check `getComputedStyle(path).fillOpacity` separately, or (preferred) read the source CSS file.

Example: `folder_thumbnail_background_large.css`:

- `.folderBack` → `fill: #E1E4E7; fill-opacity: 1` — solid base colour
- `.folderFront` → `fill: white; fill-opacity: 0.4` — semi-transparent, NOT solid white
- `.folderFrontEdging` → `fill: white; fill-opacity: 0.7` — semi-transparent

In the transplanted SVG string constant, add `fill-opacity="0.4"` / `fill-opacity="0.7"` as attributes — without them the folder body renders as opaque white instead of the correct translucent tint.

If you genuinely cannot find a value after grepping, log it as `UNKNOWN [source: not found — grep failed]` in deviations. Do not silently approximate.

---

## Step 2 — Load advisory files (if needed)

After reading source files, check `requiredAdvisories` and read the listed files.

---

## Step 3 — Apply @value transforms

Prepare the transformed `@value` declarations from `valuesToInline`:

- `rule: "A"` or `rule: "F"`: write `@value X: <value>` (inline the value)
- `rule: "S"`: replace `@value` name used as selector with `:global(.light)` / `:global(.dark)`
- Remove all `@value X from "..."` import lines

---

## Step 3a — @value selector-alias limitation (CRITICAL — Vite CSS Modules bug)

**Vite's CSS Modules plugin does not expand `@value` aliases whose value is a full selector** (e.g. `@value aFadeTarget: :is(.hoverTarget.fxFade, .fxFade .hoverTarget:not(.fxSlide):not(.fxAppear))`). Instead of substituting the selector, Vite emits the **lowercased alias name as a literal type selector** (e.g. `afadetarget { opacity: 0; }`) — a rule that never matches any element. The CSS compiles cleanly, but the rule is dead.

This is distinct from the normal `@value` token transforms handled in Step 3. Those aliases name scalar values (colors, pixels, media queries) and are substituted correctly. Selector aliases use `@value` as a selector-composition mechanism and are silently dropped.

**Known-affected files** (will grow — re-check when porting new slots):

- `ui/base/badge/private/badge_container.css` — drives `CardDecorator visibility="on-hover"`, `SwapOnHover`, and all `fxFade`/`fxSlide`/`fxAppear` hover-reveal affordances

**How to detect** — grep the files in your audit for this pattern:

```bash
grep -E '^@value [a-zA-Z]+:\s*[.:]' <cssFile>
```

Any hit is a selector alias that Vite will break.

**How to fix** — the authoritative workaround lives in `src/style.css` (project global). Do NOT attempt to patch per-slot CSS modules, because the broken rules live inside the monorepo's own CSS file (loaded via `ui/...` alias) — you can't edit them from the prototype. Instead, add (or extend) a rule in `src/style.css` that re-expresses the intended selector using unhashed attribute matches:

```css
/* Re-expression of ui/base/badge/private/badge_container.css `@value aFadeTarget: :is(...)`
   — Vite drops the selector alias and emits dead `afadetarget` rules. */
[class*='hoverTarget'][class*='fxFade'],
[class*='fxFade'] [class*='hoverTarget']:not([class*='fxSlide']):not([class*='fxAppear']) {
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
}
[class*='hoverTrigger']:hover [class*='hoverTarget'][class*='fxFade'],
[class*='hoverTrigger']:focus-within [class*='hoverTarget'][class*='fxFade'] {
  opacity: 1;
}
```

**Why attribute selectors instead of hashed classes**: CSS Modules hashes each class per build. `[class*='hoverTarget']` matches `hoverTarget_109051` regardless of hash. This means one `src/style.css` rule covers every consumer of the affected monorepo CSS module.

**Log as a deviation** with reason code `vite` and note that the working selector lives in `src/style.css`, not in the slot's own CSS module. Example:

```json
{
  "file": "src/style.css",
  "monorepoSource": "ui/base/badge/private/badge_container.css — @value aFadeTarget selector alias",
  "prototypeWorkaround": "Attribute-selector re-expression in src/style.css",
  "reason": "vite",
  "description": "Vite CSS Modules drops @value selector aliases, emitting dead `afadetarget` rules. Hover-reveal restored via [class*='hoverTrigger']:hover [class*='hoverTarget'][class*='fxFade'] in style.css."
}
```

**When porting a slot that uses `CardDecorator visibility='on-hover'`, `SwapOnHover`, or any `fxFade`/`fxSlide`/`fxAppear` affordance, verify src/style.css already contains the re-expression. If not, add it — do not ship a slot with silently-broken hover reveal.**

---

## Step 3a-2 — Badges: OMIT every badge by default

**The default for every badge is OMIT** — card badges, nav-item badges, tab badges, overflow-menu badges, any trailing pill label. This includes decorative type-labels (`getTopStartLabel`), notification / "New" / "Beta" / unread markers, premium / locked / pro indicators, and category tags. The user opts badges back in explicitly; they are never included on the porter's judgement.

**Why:** the user has consistently said they do not want badges in ported prototypes. The prototype is a shell for layout/interaction fidelity — badges add visual noise without structural value. Including any badge without being asked has resulted in user corrections.

**How to apply:**

- Strip every `badge=` prop, `getTopStartLabel` helper, `<Badge>` render, and any trailing pill / chip / count bubble from the port.
- Strip the CSS rules and typography tokens that supported those badges (e.g. `.navItemBadge`, `.cardBadge`) so future edits don't accidentally re-enable them.
- Mark every omitted badge in the slot inventory as `[omit — decorative]` and log a `deviations[]` entry (template below).
- Keep a source-comment pointer to the original monorepo badge site (`getTopStartLabel`, `<Badge>` component, etc.) so re-enabling is a one-line change if the user asks.

**When the user asks for a badge back:** re-enable only the specific badge the user named, not the whole badge family. A request for "put the 'New' badge back on that one nav item" does not unlock the decorative card badges on the same page.

**If in doubt:** ask the user. Do not render a badge the source produces if no one has asked for it.

**Logging the omission:** record in `deviations[]` with reason `style`:

```json
{
  "element": "top-start 'Brand Template' badge",
  "monorepoSource": "folder_item_card.tsx getTopStartLabel (item.isBrandTemplate → always renders)",
  "prototypeBehavior": "omitted",
  "reason": "style",
  "description": "Optional decorative badge redundant with the 'Brand Templates' section heading. Per slot-porter optional-badge policy (Step 3a-2)."
}
```

**When the user asks for it back:** keep the `getTopStartLabel` reference in source comments (so the reinstating path is obvious), and re-enable via a prop toggle or explicit re-addition — not by removing the deviation policy.

---

## Step 3a-3 — Per-section affordances: read from source config, never assume

"See all" buttons, filter rows, overflow toolbars, view-switchers, sort menus, pagination arrows, empty-state banners — these live at the **section level** and the source renders each section with its own configuration. They are **never uniform** across sections on a page.

The monorepo almost always drives per-section UI by a single config pass: the composer builds an array of section objects (`sections.map(...)`), and each object carries its own props — `onSeeAllClick`, `emptyStatePlaceholder`, `maxRows`, `hasDesignsOrMedia`, etc. A prop being defined or `undefined` is what switches the affordance on or off at render time.

**Example from `/projects`** (`create_combined_projects_grid_view.tsx`):

```tsx
const sections = [
  { id: 'folders',   onSeeAllClick: getOnSeeAllClick('folders')                           }, // always (when tab=all)
  { id: 'designs',   onSeeAllClick: enableProjectsTypeFilter() ? undefined : getOnSeeAll }, // gated by flag
  { id: 'templates', onSeeAllClick: enableProjectsTypeFilter() ? undefined : getOnSeeAll }, // gated by flag
  { id: 'photos',    onSeeAllClick: enableProjectsTypeFilter() ? undefined : getOnSeeAll }, // gated by flag
  { id: 'videos',    onSeeAllClick: enableProjectsTypeFilter() ? undefined : getOnSeeAll }, // gated by flag
  { id: 'files',     onSeeAllClick: enableProjectsTypeFilter() ? undefined : getOnSeeAll }, // gated by flag
  { id: 'nonFolderItems', onSeeAllClick: ... /* always excluded by getOnSeeAllClick */   }, // never
];
```

On canva.com with `enableProjectsTypeFilter()` on, only Folders renders See all. If the porter assumes "sections have See all" because one section does, the result is wrong for every other section.

**Rule: for every per-section affordance, enumerate the source's config array and port each section's props individually. Do not copy one section's affordances onto another "for consistency."**

**Affordance audit checklist (add to Step 3b inventory for every multi-section page):**

For each affordance seen in any section, answer three questions from the source:

1. **Which sections render it?** — read the composer's `sections.map(...)` and list the section ids where the prop is defined (not `undefined`).
2. **What gates it?** — feature flags (`enableProjectsTypeFilter()`), tab state (`tabType === 'all'`), `hasMore`, result count, narrow/wide breakpoint.
3. **What's the current state of those gates?** — feature flags evaluate to what on the target user's canva.com state? (Verify by observing the live DOM: count the affordance in the rendered page, compare to your enumerated list.)

If enumeration says 1 section has See all and live canva.com shows 1 See all: match. If the prototype has See all on 6 sections and canva.com has 1: do not ship — re-read the composer and remove the extras.

**Affordances that are almost always per-section-gated** (never assume uniform):

| Affordance             | Typical source gate                                       |
| ---------------------- | --------------------------------------------------------- |
| "See all" / "View all" | `onSeeAllClick` prop defined on the section object        |
| Filter row             | Section-level filter config, or presence of a filter slot |
| Empty-state banner     | `emptyStatePlaceholder` prop; often folder-only           |
| Toolbar / action bar   | Section-specific toolbar config                           |
| View switcher / sort   | Usually page-level, but check; occasionally per-section   |
| Pagination / load more | `hasMore` + `nextPage()` on the section's result state    |
| Max rows / row cap     | `maxRows` prop; varies by section position + tab          |
| Section header buttons | `headerRight` / `headerActions` props                     |

**Logging:** when you omit a per-section affordance, record it in `deviations[]` with reason `logic` (since the omission is driven by source gating logic, not visual style):

```json
{
  "element": "See all button (top-end of section header)",
  "monorepoSource": "create_combined_projects_grid_view.tsx:199 — onSeeAllClick: enableProjectsTypeFilter() ? undefined : getOnSeeAllClick('templates')",
  "prototypeBehavior": "omitted",
  "reason": "logic",
  "description": "Gate enableProjectsTypeFilter() is on for canva.com → onSeeAllClick resolves to undefined for this section. Verified on canva.com /projects: only Folders renders See all."
}
```

**Validation hook for slot-validator (Step 5):** after porting a multi-section page, count each affordance on the prototype and compare to the count on canva.com. A mismatch (e.g., 6 See all in prototype vs 1 on canva.com) is a HIGH severity finding — flag as `affordance-count-mismatch`.

---

## Step 3a-4 — Menu-variant inter-row spacing: read from the variant, never drop

Any list of sidebar rows, dropdown items, or menu entries in canva.com is rendered by the **Menu** component (`ui/base/menu/private/menu.tsx` + `menu.css`). Menu applies a `grid-gap` equal to the variant's `--internalSpacing` token between every item — this is not a generic default, it comes from the variant.

Source of truth — `ui/base/menu/private/menu.css`:

```css
.menu {
  display: grid;
  grid-gap: internalSpacing; /* value set by the active variant below */
}

.regularRounded {
  --internalSpacing: space050;
} /* 4px — most sidebar / contextual nav menus */
.regularSquare {
  --internalSpacing: space050;
} /* 4px */
.compact {
  --internalSpacing: 0;
} /* no gap — e.g. dense dropdowns */
/* other variants exist — always read the active one */
```

When you port a Menu-backed list (`<Menu variant="regularRounded">…`, `<ContextualNav>`, `<Sidebar>`, dropdown bodies, tree-menu groups), the inter-row gap is part of the transplant — not incidental decoration. Dropping it produces a cumulative drift of N × gap pixels, where N is the number of rows; in practice every row after the first ends up visibly above where it should be, and the bug looks like a "one-off alignment issue" several rows down.

**Rule:** when porting a list of rows rendered via Menu, always carry over the variant's `--internalSpacing` value as an actual gap in the prototype — typically by wrapping the items in a container with `display: flex; flex-direction: column; gap: <value>;`. Never render rows as direct siblings of a zero-gap parent and assume padding compensates — it does not, the rows will pack flush.

**Where the gap applies — and where it does NOT:**

- ✅ Between Menu items within the same Menu (e.g., every NavItem inside a contextual-nav section Menu)
- ✅ Between TreeMenu children when they're rendered as direct Menu items
- ❌ Between a section header and its first Menu item — those touch (gap is only between Menu items, not between section-level containers)
- ❌ Between sections — section-to-section gap has its own rule (e.g., contextual_nav `.section + .section { margin-top: -0.5u }` collapsing to 20px). Do not apply the Menu gap here.

**Identify the variant from the source:**

1. Find the `<Menu …>` call in the source TSX (or its higher-level wrapper — `ContextualNav`, `Sidebar`, tree-menu, link-item factory).
2. Read its `variant` prop (or the default — `regularRounded` for `link_item.tsx` on medium+ screens).
3. Open `ui/base/menu/private/menu.css`, find the variant class, and note its `--internalSpacing` token.
4. Resolve the token via tokens catalog (e.g., `space050 = 4px`).
5. Apply that gap in the prototype between Menu items in that group — and cite the variant + token in a CSS comment so a future reader can trace it back.

**Structural hint:** Menu gives each section its own grid container. Mirror that in the prototype by wrapping each section's items in a dedicated `.menu`-class div rather than relying on `.navContent` or similar page-level containers. This keeps the gap scoped to Menu items and prevents it from leaking between section headers or section separators.

**Logging:** no deviation needed when you port the gap faithfully. If the variant's gap is dropped for a documented reason (e.g., a layout where items must visually touch), log it as `deviations[]` reason `visual-style` with the variant name and the `--internalSpacing` value that was overridden.

**Validation hook for slot-validator:** after porting a Menu-backed list, measure the top-of-row offsets for the first N rows on both the prototype and canva.com. If prototype rows drift progressively (row 2 is 4px high, row 3 is 8px high, etc.) compared to canva.com, the Menu variant gap was dropped — flag as `menu-row-gap-missing`.

---

## Step 3a-5 — UI strings: verbatim from source, never title-cased by convention

Every user-visible string — section titles, button labels, placeholders, tooltip text, aria-labels, empty-state copy, tab names, filter pill labels — must be copied **character-for-character** from the monorepo source. Canva's UI uses **sentence case**, not title case. Capitalizing a heading because English convention says headings are title-cased is a **falsification of the source**.

**Source order of precedence:**

1. The component's `*.messages.ts` file (e.g. `pages/home/brand_templates/messages/brand_templates.messages.ts`) — holds the string factory:
   ```ts
   personalStarredTitle: () => 'Your starred',
   ```
2. The component's `*.strings.json` translation file — authoritative for current wording.
3. A hard-coded literal in the component's TSX — rarest case.
4. The live canva.com DOM as a cross-check if the messages file looks stale.

**Finding the string — grep protocol:**

```bash
grep -rn 'personalStarredTitle\|Your starred' ~/canva/web/src/pages/home
grep -rn '"<StringLabel>"' ~/canva/web/src/<componentPath>/messages/
```

**Rule:** if a ported element has a label and you cannot point to the exact file + line in the monorepo that defines that string, you have not finished the port.

**Prototype-only strings** (fixture data, e.g. nav label on a prototype-only route): annotate in JSX with `// STRING [source]: prototype-only — sentence case per Canva convention` and default to sentence case.

**Validation hook:** after porting any slot with visible copy, enumerate every heading/label/tooltip string in the prototype and match it 1:1 against the source messages file or canva.com DOM. A case difference ("Your Starred" vs "Your starred") is HIGH severity — flag as `string-case-mismatch` in slot-validator.

**Logging:** no deviation needed when you copy verbatim. If a string must deviate (e.g., prototype renames a label for clarity), log with reason `copy` and justify.

---

## Step 3b — Completeness inventory (MANDATORY before writing)

Before writing any prototype code, create a checklist of **every visually-rendered element** from the monorepo source:

```
COMPLETENESS INVENTORY for <SlotName>:
[ ] <NavItem id="home" label="Home" icon="HomeIcon" active={true} />
[ ] <NavItem id="projects" label="Projects" icon="FolderIcon" />
[ ] <NavItem id="templates" label="Templates" icon="LayoutIcon" />
[ ] <NavItem id="brand" label="Brand" icon="BrandIcon" />
[ ] <NavItem id="ai" label="Canva AI" icon="MagicIcon" />              ← read from source; badge="New" omitted per Step 3a-2
[ ] <MoreButton />
[ ] <CreateButton />
[ ] <NotificationBell />
[ ] <UserAvatar />
```

Rules for the inventory:

- Source every item from the monorepo TSX/config you just read in Step 1 — not from DOM observation
- Include flag-gated items that canva.com shows (set their conditions to `true`)
- Include counts and secondary labels exactly as they appear in source data. **Badges are always omitted** per Step 3a-2 — mark every badge in the inventory as `[omit — decorative]` and skip them in the port, even load-bearing-looking ones like "New" / "Beta" / notification markers.
- Every item in this list must appear in your prototype output OR have a logged deviation with reason code

After writing the prototype, verify every item in this list is present. Any missing item without a logged deviation is a bug.

---

## Step 3b-2 — Typography measurement-first gate (MANDATORY — before writing ANY typography CSS)

**Why this step exists:** the single most-corrected class of bug in this project is typography values that were encoded from the monorepo source's _component props_ (e.g. `Title size="small"`) instead of from canva.com's _rendered pixels_. Source props lie: feature-flag overrides, breakpoint rules, and Easel's nested-span render pattern (e.g. `<h3><span class="display-40">`) all mean that the source prop alone does not determine the rendered size. **The only authoritative answer is the rendered DOM on canva.com at the target viewport.**

Concrete past incidents — every one traceable to "encoded from source, never measured canva.com before writing":

- Banner "Canva Brand Kit" ported at 24/32/600 (read from h3 wrapper's inherited defaults); canva.com renders the inner Display span at 40/44/500, ls -1px, ffs normal.
- "All Brand Templates" section title ported at 18/normal/600 (Easel `Title size="small"` with `.title { line-height: normal }` CSS override); canva.com renders at 32/40/600, opsz 100, ss02 + ss03.
- Every recurrence of the `feedback_easel_title_weight_mismatch` memory traces here.

### Procedure

For every slot that contains one or more visible text nodes, before writing CSS:

1. **Set a consistent viewport:** `mcp__chrome-devtools__emulate { viewport: "1440x900x1" }` (or whatever the reference viewport is for this page).
2. **Navigate** to the canva.com URL for this route.
3. **Run the TreeWalker typography probe** (see `slot-validator/SKILL.md` §1e-3b for the canonical script). The TreeWalker lands on the direct parent of each text node — the innermost text-bearing element — so Easel Display/Title span-wrapped titles report their rendered values, not the outer h3 wrapper's inherited defaults. Never use `querySelectorAll('h1, h2, h3, …')` for this.
4. **Save the result** to `{{workspaceDir}}/{{slot}}-typography.json`. One entry per text node with: `text`, `tag`, `fontSize`, `lineHeight`, `fontWeight`, `letterSpacing`, `fontVariationSettings`, `fontFeatureSettings`, `color`, `x`, `y`, `w`, `h`.
5. **Encode CSS from this JSON**, not from the source prop. If the JSON says `40px/44px/500/-1px/"opsz" 100/normal`, the CSS writes those exact values — even if the source code `<Display size="medium">` would imply different numbers through the token chain.

### What this gate blocks

- ❌ Writing `font-size: 24px` because the source uses `<Title size="medium">` — without a JSON entry confirming 24px.
- ❌ Writing `line-height: normal` because `ui/home/content_section/content_section.css` says so — when canva.com's measured line-height is `40px`.
- ❌ Omitting `letter-spacing`, `font-feature-settings`, `font-variation-settings` because the source CSS file doesn't mention them — those properties live on the Easel component's class, not the slot's CSS; the measurement surfaces them.
- ❌ Copying `Title size="small"` at face value when the route-level override upgrades it. Source tells you _what component_; canva.com tells you _what it renders as_.

### Exceptions

None. If Chrome DevTools MCP is unavailable, **stop and ask the user to reconnect** — do not proceed with source-only typography values (see `feedback_chrome_mcp_required`). The JSON is cheap; the do-over after a user correction is not.

### Downstream

- `slot-validator` §1e-3b runs the same TreeWalker probe on the prototype and diffs against this JSON. Any drift on any of `font-size`, `line-height`, `font-weight`, `letter-spacing`, `font-variation-settings`, `font-feature-settings` is HIGH severity and blocks the port. No "±2px tolerance" on typography — exact match is the bar.

---

## Step 3b-3 — Layout/spacing measurement-first gate (MANDATORY — before writing ANY CSS with padding/margin/gap/min-height)

**Why this step exists:** the second-most-corrected class of bug (matched only by typography) is spacing values that were encoded from the monorepo source's _outer wrapper CSS_ without probing canva.com's _actual rendered parent chain_. The source file for a slot rarely contains all the padding/margin/gap that affects its layout — inner Easel wrappers, route-level layout components, `Box` wrappers with implicit `paddingBottom`, and flexbox ancestors with `align-items: center` all introduce spacing that lives OUTSIDE the slot's own CSS file.

Concrete past incidents — every one traceable to "encoded only the slot-level CSS, never walked the rendered parent chain on canva.com before writing":

- `/brand/:brandKitId` Canva Brand Kit hero rendered at 109px tall; canva.com renders at 165px tall because an inner `.QJ0Wqw` wrapper carries `padding-bottom: 56px` that the slot's own source never references (it's added by the outer brand-kit layout frame, not the hero component).
- WonderBox hero rendered with the inner `744×40` input pill glued to the outer `800×64` visible pill — canva.com renders TWO distinct rounded layers because the outer hero banner is a separate composer element (see `feedback_visible_pill_vs_input_subelement`).
- Hero anchors offset by a uniform 24px because the outer composer adds a `Spacer size="3u"` that the slot audit never walked to (see `feedback_absolute_y_offset_outer_spacer`).
- `/brand/all-assets` content body rendered 8px too far right (x=368 vs canva.com x=360) because the prototype's `.contentColumn` mirrors canva.com's _inner_ panel (x=336), not its _outer_ scroll column (x=328) where 32px padding actually lives. 32px padding inside `.contentColumn` compounds the 8px offset; the fix is 24px padding (see `component-advisories/shell-layout.md` → "Critical: content padding is 24px, NOT 32px" and `feedback_shell_inner_vs_outer_scroll_offset`).
- `/brand/all-assets` "Core Brand" and "Internal Brand" h3 rendered at 18px instead of 24px because `ContentSection`'s inner span had `font-size: 18px` hardcoded in `.title`. That override won via specificity against `<Title size="medium">`'s 24px h3, making the `size` prop a no-op. Related: `.sectionHeader { height: 40px }` was unconditionally applied, forcing h3 4px lower than canva.com for titleSize=medium (where canva.com lets h3's natural 32px drive header height). See `feedback_easel_title_size_inheritance`.
- `/brand/all-assets` first "Brand Templates" card rendered 16px too high because the prototype's first section had no top padding, whereas canva.com wraps every section in a `jv_R6g` grid with `gap: 16px` between an (often empty) heading row and the content row — so even a heading-less first section reserves 16px before the content. And the body-level gap between sections was 0 (padding-bottom) instead of canva.com's outer grid `row-gap: 48px`. Fix: `display: grid; row-gap: 48px` on `.body`, `padding-top: 16px` on the first section, no padding-bottom anywhere.

### Procedure

For every slot that contains any `padding`, `margin`, `gap`, `min-height`, or `row-gap` — before writing CSS:

1. **Set the reference viewport:** 1440×900 for desktop.
2. **Navigate** to the canva.com URL for this route.
3. **Locate the slot's innermost anchor** (the top-left-most text node or the first meaningful child — e.g. the hero title, the first nav row, the first card).
4. **Walk the rendered parent chain up ≥10 levels** with `getBoundingClientRect() + getComputedStyle()` on each ancestor. Record per-ancestor: `tag`, `cls` (first 50 chars), `x`, `y`, `w`, `h`, `paddingTop`, `paddingBottom`, `paddingLeft`, `paddingRight`, `marginTop`, `marginBottom`, `gap`, `display`, `alignItems`, `justifyContent`.
5. **Save** to `{{workspaceDir}}/{{slot}}-layout.json`. One entry per ancestor, in innermost-to-outermost order.
6. **Port every non-zero padding/margin/gap in that chain**, not just the ones in the slot's source CSS. If an ancestor has `padding-bottom: 56px`, merge that into the prototype's CSS — either by adding it to the equivalent wrapper, or by absorbing it into the outer container's padding so the total top-bottom padding matches the measured JSON.
7. **Verify the total bounding box** after porting: the slot's outer wrapper should have the same `height` and `bottom` coordinate as canva.com. If not, a spacing source was missed — re-walk the chain and find it.

### What this gate blocks

- ❌ Writing `padding: 48px 0 16px` because the slot's source CSS file says so — without verifying the rendered chain.
- ❌ Omitting `gap: 8px` on a flex row because the source TSX uses `<Columns spacing="1u">` and you "know" that = 8px — the token or prop may resolve differently at this breakpoint or be overridden by a parent.
- ❌ Using `min-height: 45px` verbatim from source when canva.com reports the element at 55px (the inner content has its own padding that adds 10px).
- ❌ Treating "visually close" as PASS. Every Δ > 2px on a container's height, top, or bottom must be traced to a specific missed padding/margin/gap in the chain.
- ❌ Skipping ancestors in the walk because they "look like layout chrome" — `align-items: center` on a distant ancestor changes where this slot sits vertically.

### Exceptions

None. If Chrome DevTools MCP is unavailable, **stop and ask the user to reconnect** (see `feedback_chrome_mcp_required`). Spacing bugs are cheap to prevent with a JSON and expensive to fix after the fact — every user correction on spacing is a failed application of this gate.

### Downstream

- `slot-validator` §1e-3c runs the same parent-chain walk on the prototype and diffs against this JSON. Any drift on `height`, `bottom`, or any ancestor's `padding/margin/gap` is HIGH severity and blocks the port.

---

## Step 4 — Transplant the slot

Create: `src/pages/<PageName>/<SlotName>/`

**Files to write:**

- `index.tsx` — the transplanted component
- `<slotName>.module.css` — the transplanted CSS

### TSX transplant

1. **Start from the monorepo source verbatim.** Copy the render tree as written.

2. **Strip only valid deviations.** For each stripped or changed item, add an inline comment:

   ```tsx
   {
     /* STRIPPED [vite]: DI hook useAppContext — replaced with static mock */
   }
   {
     /* STRIPPED [logic]: analytics tracking onClick handlers */
   }
   {
     /* STRIPPED [dom-complexity]: DesignTemplatePreviewCarousel — 6+ nesting levels, replaced with static grid */
   }
   ```

3. **Easel component props are sacrosanct.** If source has `paddingX="3u"`, prototype has `paddingX="3u"`. Do not substitute token values with computed px equivalents. Do not remove spacing props. Do not change variant props.

4. **Layout components are sacrosanct.** `<Rows spacing="2u">` must not become `<div style={{ gap: '16px' }}>`. The structural shape of the component tree must be preserved.

5. **Read every item list from monorepo source.** Nav items, carousel items, filter options, card data — source them exactly from the monorepo TSX. Read `fakes.ts`, `stories/`, or the component's constant arrays. Preserve exact ordering.

6. **Replace flag-gated renders with static values.** If the source has `{isFeatureEnabled && <Component />}`, set to `{true && <Component />}` to include it, unless the component clearly requires live data that cannot be mocked (in which case use `false` and log a deviation).

7. **Inline SVGs — read verbatim from the monorepo file. Do not hand-write SVG content.**

   ```bash
   cat ~/canva/web/src/<resolvedPath>  # read and copy exactly
   ```

   - Copy the SVG path data `d="..."` character-for-character from the file. Do not reconstruct from memory.
   - Replace hardcoded `fill="<color>"` with `fill="currentColor"` to support theming (see asset-handling.md).
   - **Set the parent element's CSS `color` to the correct value for the rendering context.** When the icon is a TextInput decorator, the correct color is `colorContentFg` (not `colorContentPlaceholderFg`). When it is a standalone icon button, check the source component's CSS for the color token. Never assume the icon inherits placeholder text color.
   - Store as a string constant in the TSX file. Do not import the `.inline.svg` directly.

   **String icon identifiers — do not substitute with generic Easel icons.** If source uses `icon="some-name"` (a string prop), the icon resolves through the component's OWN `icons.ts` lookup, not `ui/base/icons/`. Components like `PrimaryNavItem` maintain a local `icons/` directory with purpose-built SVGs that differ from any generic icon with the same name. Always trace `icon="<name>"` → component's `icons.ts` → local `.inline.svg` file. Never reach for `ui/base/icons/` as a substitute.

8. **Apply ThemeBoundary render-prop pattern** (see tsx-extraction.md).

9. **Replace service/DI imports** with static mock values per tsx-extraction.md.

10. **Add source comment at the top:**
    ```tsx
    // Prototype transplanted from: pages/<section>/<component>/<component>.tsx
    // Deviations: see .porter-workspace/<PageName>/results/<slotName>.json
    ```

### CSS transplant

1. **Copy the CSS file verbatim**, then apply these transforms only:
   - Apply all `@value` transforms from Step 3
   - Apply `composesChains` with `missingInPrototype: true`: add `resolvedProperties` explicitly as direct properties (Rule W)
   - Apply structural fixes from `component-patterns.md` (Rule Q, E)
   - Add `!important` on Easel overrides per Rule W.4

2. **Do not re-derive CSS values.** Use the values from the source CSS files you read in Step 1. The audit table shows the resolved values — if your CSS differs from the audit table, re-read the source CSS to find the correct value. The source CSS is authoritative; the audit table is a resolved reference derived from it.

3. **Verify against audit table.** After writing, check that all values in your CSS match the audit table. If they differ, the source CSS is the tiebreaker — read the specific source file and use what it says.

4. **Easel Box flex alignment — do not infer `align-items: center`.** When the monorepo source uses `<Box display="flex">` without an explicit `alignItems` prop, the rendered element gets `align-items: normal` (the browser default — effectively stretch). Do NOT add `align-items: center` to the transplanted CSS rule. Stretch causes children like `<Title>` to fill the full cross-axis height (e.g. 40px from `min-height`), which is correct. Center drops them by `(containerHeight − childLineHeight) / 2`, shifting elements out of position.

   **Rule:** Only add `align-items` to a CSS module flex rule when the monorepo TSX `<Box>` has an explicit `alignItems` prop. If the prop is absent, omit `align-items` entirely.

   **Verified mapping:**
   | Easel `<Box>` prop | CSS to write |
   |------------------------|------------------------|
   | `alignItems="center"` | `align-items: center` |
   | `alignItems="start"` | `align-items: flex-start` |
   | `alignItems="end"` | `align-items: flex-end` |
   | _(prop absent)_ | _(omit — defaults to `normal`/stretch)_ |

5. **Typography transplant rules — authoritative map from `ui/base/typography/internal/typography.css`.** When the monorepo source uses `<Title>` or `<Text>` and the slot-porter replaces them with plain heading/paragraph elements in a CSS module, the Easel typography classes apply a fixed set of properties that the token catalog does NOT document. Every ported text node must include ALL seven properties from the checklist below — partial ports produce the exact "close but wrong" font rendering the user keeps flagging.

   **The 7-property checklist — apply to EVERY plain `<h1..h6>` / `<p>` / `<span>` that replaces an Easel `<Title>` / `<Text>` / `<Display>`:**

   | #   | Property                  | Required value                                                                                     |
   | --- | ------------------------- | -------------------------------------------------------------------------------------------------- |
   | 1   | `font-family`             | Full Canva Sans stack (see snippet)                                                                |
   | 2   | `font-size`               | Per class, see map below                                                                           |
   | 3   | `font-weight`             | Per class, see map below                                                                           |
   | 4   | `line-height`             | Per class, see map below                                                                           |
   | 5   | `font-variation-settings` | `"opsz" 100` (Display, Title XL/L/M) OR `"opsz" 0` (Title S/XS/XXS + Text)                         |
   | 6   | `font-feature-settings`   | `"ss02", "ss03"` (Title XL/L/M ONLY — omit for Text and Title S↓)                                  |
   | 7   | Universal block           | `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-size-adjust: none;` |

   **Copy-paste font-family stack (always this, never `inherit`):**

   ```css
   font-family:
     'Canva Sans',
     'Noto Sans Variable',
     'Noto Sans',
     -apple-system,
     BlinkMacSystemFont,
     'Segoe UI',
     Helvetica,
     Arial,
     sans-serif;
   ```

   **Why these are invisible in the token catalog:** `font-variation-settings`, `font-feature-settings`, `text-size-adjust`, and both `font-smoothing` properties are set by the `.universal` + `.textXxx` classes in `ui/base/typography/internal/typography.css`, not by tokens. The token catalog only lists font-size/weight/line-height/letter-spacing. Skipping the universal block yields wrong smoothing; skipping `opsz` yields the wrong letterform axis (Display vs Text); skipping `font-family` falls back to whatever the parent set (often undefined on a plain `h1`).

   **Complete verified size map** (all sourced from `typography.css` @ `ui/base/typography/internal/`):

   | Source class (`<Text size="X">` / `<Title size="X">`)     | font-size | font-weight | line-height | font-variation-settings | font-feature-settings |
   | --------------------------------------------------------- | --------- | ----------- | ----------- | ----------------------- | --------------------- |
   | `.textTitleExtraLarge` (`<Title size="xlarge">`)          | 32px      | 700         | 40px        | `"opsz" 100`            | `"ss02", "ss03"`      |
   | `.textTitleLarge` (`<Title size="large">`)                | 28px      | 700         | 36px        | `"opsz" 100`            | `"ss02", "ss03"`      |
   | `.textTitleMedium` (`<Title size="medium">`)              | 24px      | 700         | 32px        | `"opsz" 100`            | `"ss02", "ss03"`      |
   | `.textTitleSmall` (`<Title size="small">`)                | 20px      | 700         | 28px        | `"opsz" 0`              | _(none)_              |
   | `.textTitleExtraSmall` (`<Title size="xsmall">`)          | 16px      | 700         | 24px        | `"opsz" 0`              | _(none)_              |
   | `.textTitleExtraExtraSmall` (`<Title size="xxsmall">`)    | 14px      | 700         | 20px        | `"opsz" 0`              | _(none)_              |
   | `.textExtraLarge` (`<Text size="xlarge">`)                | 18px      | 400         | 28px        | `"opsz" 0`              | _(none)_              |
   | `.textLarge` (`<Text size="large">`)                      | 16px      | 400         | 24px        | `"opsz" 0`              | _(none)_              |
   | `.textMedium` (`<Text size="medium">`)                    | 14px      | 400         | 22px        | `"opsz" 0`              | _(none)_              |
   | `.textSmall` (`<Text size="small">`)                      | 12px      | 400         | 20px        | `"opsz" 0`              | _(none)_              |
   | `.textBoldLarge` (`<Text size="large" variant="bold">`)   | 16px      | 600         | 24px        | `"opsz" 0`              | _(none)_              |
   | `.textBoldMedium` (`<Text size="medium" variant="bold">`) | 14px      | 600         | 22px        | `"opsz" 0`              | _(none)_              |
   | `.textBoldSmall` (`<Text size="small" variant="bold">`)   | 12px      | 600         | 20px        | `"opsz" 0`              | _(none)_              |

   Note: canva.com uses **weight 600** for Title (not 700) because `fontWeight600` is substituted via feature flag in the live token build. Always verify weight against `getComputedStyle()` on canva.com before pinning; if the probe says `600`, use `600` and leave a `/* font-weight 600 per live canva.com build (not the 700 in typography.css) */` note.

   **Common misdiagnoses to avoid:**
   - Using `"opsz" 100` on body text (`.textMedium`, `.textLarge`, `.textBoldMedium`) — WRONG, body text is always `"opsz" 0`. opsz 100 is the Display axis, reserved for Title XL/L/M + all Display sizes.
   - Omitting `-moz-osx-font-smoothing: grayscale` because the prototype worked "for you" on your Mac — it only matters on macOS/Firefox but it is MANDATORY; missing it is a HIGH-severity typography drift.
   - Omitting `text-size-adjust: none` — causes mobile browsers to scale text inappropriately; detected by canva.com's probe as `none` vs prototype's `auto`.
   - `font-family: inherit` on ported text — the ancestor chain rarely delivers the correct stack; always set the full stack explicitly.
   - Leaving `font-feature-settings: 'ss02', 'ss03'` on Text or Title S/XS/XXS — those classes do NOT set it; only Title XL/L/M + Display do.

   **Color token for body copy:** `colorContentPrimaryFg` light = `colorBlackA10` = `#0F1015` (NOT `#0F1014`, not `rgb(13, 18, 22)`, not `rgb(15, 18, 26)`). Other common tokens: `colorContentSecondaryFg` light = `rgba(15, 18, 26, 0.698)`.

   **`<Text tone=...>` → CSS color map — use these verbatim, NEVER a flat gray hex.** Source: `ui/base/typography/internal/typography.css` lines 416–426 + `ui/base/tokens/private/color.css`. Solid grays (e.g. `#5e6573`) compute to the right tint on white but are wrong on any colored surface — purple gradient banners, hover tints, dark mode. The alpha-over-black is load-bearing:

   | `tone=`     | Token alias              | Primitive       | CSS value                               |
   | ----------- | ------------------------ | --------------- | --------------------------------------- |
   | `primary`   | `colorContentFg`         | `colorBlackA10` | `#0F1015`                               |
   | `secondary` | `colorContentSubtleFg`   | `colorBlackA09` | `rgba(15, 16, 21, 0.851)` (`#0F1015D9`) |
   | `tertiary`  | `colorContentSubtlestFg` | `colorBlackA08` | `rgba(15, 18, 26, 0.698)` (`#0F121AB2`) |

   Rule of thumb: any Easel token ending in `A0N` (A01..A10) is an alpha-over-black primitive — keep it as an `rgba()` in ported CSS. Do not substitute a solid hex even if it "looks the same" on white.

6. **Responsive grid — use `Grid` + `getColumns` + `ResizeObserver`, never a static `repeat(N, 1fr)`.** When the monorepo uses `FolderContentsGrid` (or `Grid` + `withDimensions`), the column count is computed from the container's runtime width, not hardcoded in CSS.

   **Transplant pattern:**

   ```tsx
   import { useState, useEffect, useRef } from 'react';
   import { Grid } from 'ui/base/layout/layout';

   // Source: ui/organizing/folder_contents_grid/folder_contents_grid.tsx
   function getColumns(width: number): 2 | 3 | 4 | 6 {
     if (width < 600) return 2;
     if (width < 900) return 3;
     if (width < 1200) return 4;
     return 6;
   }

   export default function MySlot() {
     const [columns, setColumns] = useState<2 | 3 | 4 | 6>(6);
     const gridWrapperRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
       const el = gridWrapperRef.current;
       if (!el) return;
       const ro = new ResizeObserver(entries => {
         for (const entry of entries) {
           setColumns(getColumns(entry.contentRect.width));
         }
       });
       ro.observe(el);
       return () => ro.disconnect();
     }, []);

     return (
       <div ref={gridWrapperRef}>
         <Grid columns={columns} spacing={columns === 2 ? '2u' : '3u'}>
           {items.map(item => (
             <div key={item.id} className={styles.card}>
               ...
             </div>
           ))}
         </Grid>
       </div>
     );
   }
   ```

   **Do NOT write:**

   ```css
   /* ❌ Wrong — static, doesn't respond to resize */
   .grid {
     display: grid;
     grid-template-columns: repeat(6, 1fr);
     gap: 24px;
   }
   ```

   **Why:** `withDimensions` in the monorepo uses `react-measure` + MobX which cannot be transplanted directly. The native `ResizeObserver` replicates the same container-width measurement with no extra dependencies. The Easel `Grid` component handles `grid-template-columns: repeat(var(--internalColumns), minmax(0, 1fr))` internally — do not duplicate it in the slot's CSS module.

   **Spacing:** `3u` (24px) at ≥600px, `2u` (16px) at <600px — matches `folder_contents_grid.tsx` exactly.

7. **Easel TextInput icon decorator spacing — visual gap = box padding + column gap.** When Easel renders a TextInput with a start-decorator icon (search icon, etc.), the icon is wrapped in `<Box paddingX="0.5u">` and placed in a `<Column width="content">` alongside the input column (`<Columns spacing="0.5u">`). The visual gap between the icon SVG's right edge and the input text is **double the spacing token**:
   - `Box paddingX="0.5u"` = 4px right padding on the icon box
   - `Columns spacing="0.5u"` = 4px gap between icon column and input column
   - **Total visual gap: 8px** between icon right edge and placeholder/input text

   When transplanting this pattern as a prototype `<div>` with an icon child and a text child, set `gap: 8px` on the container (not `gap: 4px`). Using only the column spacing (4px) misses the additional 4px from the icon box padding, placing the text 4px too far left.

   **Outer container padding:** The outer `Box paddingX="2u"` = 16px sets the space from the container border to the icon's left edge. Combined with `Box paddingX="0.5u"` = 4px padding-left on the icon box, the icon SVG starts at **20px from the container's inner left edge** (21px from outer, accounting for 1px border).

   ```css
   /* Correct transplant for WonderBox-style search input */
   .searchInputContainer {
     padding: 0 20px; /* 16px outer Box paddingX + 4px icon Box paddingX left = 20px to icon SVG */
     gap: 8px; /* icon Box paddingX right (4px) + Columns spacing (4px) = 8px visual gap */
     border: none; /* NO layout border — visual border via inset box-shadow (see below) */
   }
   .searchIcon {
     display: flex;
     align-items: center;
     line-height: 0;
     flex-shrink: 0;
   }
   ```

   **Visual border must not affect layout.** On canva.com the border and shadow live on a `position:absolute` child element, leaving the layout container border-free. In the prototype, use `border: none` + `box-shadow inset` to replicate this. If you use `border: 1px` on the layout container, the icon shifts 1px right and the placeholder shifts 1px right — both off from canva.com measurements.

   **WonderBox palette — home page uses `containerSolid`, NOT `containerGradient`.** The home page search WonderBox uses the solid palette, which renders a white background with a subtle light-purple border and glow — NOT the teal-to-purple gradient border. The gradient state (`containerBackgroundGradientDefault`) is for generative/magic inputs. Verify by inspecting opacity of `containerBackground*` children: the one with `opacity: 1` tells you which state is active.

   **Non-focused solid state values** (verified on canva.com, sourced from `wonder_box_input.css`):
   - `solidBorderColor = colorFeedbackHintSubtleBg = colorPurple02 = rgb(231, 219, 255)`
   - `solidShadowColor (light) = colorPurple02 = rgb(231, 219, 255)`
   - `solidShadow = 0px 6px 20px -4px solidShadowColor`

   ```css
   /* Non-focused containerSolid state */
   .searchInputContainer {
     border: none;
     background: #ffffff;
     box-shadow:
       rgb(231, 219, 255) 0px 6px 20px -4px,
       /* solidShadow */ inset 0 0 0 1px rgb(231, 219, 255); /* solidBorderColor, no layout impact */
   }
   ```

8. **Body text vs title text `font-variation-settings`.** The `textMedium` class (used by `<Text>`, `<TextInput>` placeholder, etc.) applies `font-variation-settings: "opsz" 0` — this sets Canva Sans (the normal body font). Title components (`<Title>`) apply `"opsz" 100`. When transplanting a body-text element (input placeholder, paragraph, label), add `font-variation-settings: "opsz" 0` — NOT `"opsz" 100`. Also add `-webkit-font-smoothing: antialiased` (both are from `textMedium`'s base CSS). Using `"opsz" 100` on body text renders the display/heading font variant — visually heavier and spaced differently.

9. **Shell layout scroll architecture — body is the scroll container, not an inner div.** On canva.com, the body scrolls (not a `height:100vh` + `overflow:hidden` wrapper with an inner scroll div). The correct architecture:
   - `body { overflow-y: scroll; background-color: #fcfbfe; }` — body is the scroll container; `overflow-y: scroll` creates a permanent 15px scrollbar gutter that shrinks the layout to `viewport - 15px` (e.g. 1713px at 1728px). `background-color` shows in the 8px gutters around the card.
   - `.layout { position: relative; min-height: 100vh; }` — no `height` or `overflow: hidden`. Grows with content.
   - `.columns { display: flex; }` — no `height`. Grows with content.
   - `.navColumn { position: sticky; top: 0; height: 100vh; }` — stays fixed as body scrolls.
   - `.contentColumn { margin: 8px 8px 0 0; border-radius: 16px 16px 0 0; overflow: hidden; background: #ffffff; }` — no height constraint; grows with content. `overflow: hidden` clips the rounded top corners. Body scroll reveals content below the fold.
   - No inner scroll div with `overflow-y: auto` — this creates a scrollbar INSIDE the card, to the left of the right gutter, which looks wrong.

   **Result:** contentColumn matches canva.com exactly — at 1728px viewport: x=72, y=8, width=1633, right=1705, with 8px of `#fcfbfe` background + 15px scrollbar gutter = 23px visible gap to the right.

   The visible right margin gap comes from this combination. Without `body { overflow-y: scroll }`, the layout fills the full viewport and the 8px gap is invisible against the near-white background. Without removing the inner scroll div, a scrollbar appears inside the card.

10. **Recents filter pills use `AdjustmentPill` (Owner) and `Pill shape='round'` (Type) — both are round.** This is a frequent source of mistakes. Always trace to the actual call site in `create.tsx`, not just the default props of the trigger component.

- **"Creator" (Owner filter)**: `PillFilterTrigger` without `shape` prop → `AdjustmentPill` (from `ui/search/wonder_box/adjustments/pill/pill`). `shape='rectangle'` is `@deprecated` on `PillFilterTrigger` — do NOT pass it.
- **"Any type" (Type filter)**: `create.tsx` renders `<Pill shape="round" size="medium" ...>` explicitly.

Both components produce `borderRadius: 9999px` and `paddingX: 2 * baseUnit = 16px` at `size='medium'`.

**State values:**

| Pill           | State    | Background                                                       | Border (inset box-shadow)                     |
| -------------- | -------- | ---------------------------------------------------------------- | --------------------------------------------- |
| AdjustmentPill | Default  | `rgb(255,255,255)`                                               | `colorPurple02 = rgb(231,219,255)`            |
| AdjustmentPill | Selected | `rgb(241,234,255)` ← CSS var `--backgroundColorSelected` (light) | `colorActionSelectedBorder = rgb(139,61,255)` |
| Pill round     | Default  | `transparent`                                                    | `colorControlBorder = rgba(53,65,90,0.2)`     |
| Pill round     | Selected | `colorActionSelectedBg = rgba(163,112,252,0.149)`                | `colorActionSelectedBorder = rgb(139,61,255)` |

**Vertical centering model — CRITICAL:** AdjustmentPill does NOT use `align-items: center` or a `gap` property on the container. The text span uses `line-height: calc(pillHeight - 2px) = 38px` (medium) to vertically center itself. The icon/chevron span uses `margin-left: 8px` (gap from text) AND `margin-right: -4px` (pulls pill width back 4px — without this the pill is 4px too wide). Measured canva.com: container `alignItems: "normal"`, text `lineHeight: 38px`, `fontVariationSettings: '"opsz" 0"`, icon span `marginLeft: 8px`, `marginRight: -4px`.

```css
/* Any type — Pill shape='round' size='medium', unselected */
.filterBtn {
  display: inline-flex;
  /* NO align-items — defaults to "normal" (stretch). Text centering via line-height on child. */
  /* NO gap — icon/chevron uses margin-left for spacing. */
  height: 40px;
  padding: 0 16px;
  border-radius: 9999px;
  background: transparent;
  box-shadow: rgba(53, 65, 90, 0.2) 0px 0px 0px 1px inset;
}
/* Creator — AdjustmentPill, selected */
.filterBtnActive {
  composes: filterBtn;
  background: rgb(241, 234, 255); /* --backgroundColorSelected light theme */
  box-shadow: rgb(139, 61, 255) 0px 0px 0px 1px inset; /* colorActionSelectedBorder */
}
/* Text span inside pill */
.filterBtnText {
  font-size: 14px;
  font-weight: 400;
  line-height: 38px; /* calc(40px - 2px) — this IS the vertical centering mechanism */
  font-variation-settings: 'opsz' 0; /* body text, NOT title (100) */
}
/* Chevron/icon span — uses margin-left + negative margin-right, NOT parent gap */
.filterBtnIcon {
  display: flex;
  align-items: center;
  margin-left: 8px;
  margin-right: -4px; /* CRITICAL: pulls pill width back 4px. Without this the pill is 4px too wide. */
  line-height: 0;
}
```

**Why `shape='rectangle'` was wrong:** The default prop in `TypeFilterTrigger` is `shape='rectangle'`, but `create.tsx` bypasses that component and renders `<Pill shape="round">` directly. Always read the call site, not just the component's default props.

**Why `align-items: center` is wrong:** AdjustmentPill CSS does not set `align-items`. The text span achieves vertical centering via `line-height: 38px` (pillHeight - 2px). Adding `align-items: center` at the container level overrides this model and shifts text position.

---

## Step 4b — Dimensional verification (MANDATORY — do not skip)

After writing prototype files, verify every key dimension matches canva.com using numeric measurement. Screenshots alone are insufficient — a 50px width error is invisible at small screenshot viewport.

**The loop:** monorepo source → prototype → measure both sides → if off, go BACK to monorepo to find why (feature flags, breakpoint overrides) → fix → re-measure. canva.com is the verification target, not the source. Never use a canva.com measurement as the initial value — always source from monorepo first.

### 4b-1 — Identify key dimensions

From the CSS you read in Step 1, list every element with:

- Fixed or max widths/heights (e.g. `max-width: calc(8px * 94)`, `height: 277px`)
- Padding or gap values that govern vertical positioning of siblings
- Horizontal centering constraints

### 4b-2 — Set a consistent viewport on both sides

```
mcp__chrome-devtools__emulate  viewport: "1728x873x1"
```

Apply this on both the prototype tab and the canva.com tab before measuring. Measurements taken at different viewports are not comparable.

### 4b-3 — Measure on prototype

Navigate to `http://localhost:5173/#/<route>`. For each key element:

```js
document.querySelector('[class*="searchInputContainer"]').getBoundingClientRect();
// → { width, height, x, y, top, bottom }
```

### 4b-4 — Measure on canva.com

Navigate to the equivalent page. Run the same queries. Match elements by their role (outermost visual container, inner input, banner area, etc.).

### 4b-5 — Compare (threshold: ±2px)

For each measurement pair, check that prototype matches canva.com within ±2px.

**If a dimension diverges:**

1. Do NOT adjust the value to match canva.com directly. Go back to the monorepo source first.
2. Search for feature flag overrides:
   ```bash
   grep -rn "featureFlag\|uniformMaxWidth\|isEnabled\|\.container\." ~/canva/web/src/<sourcePath>/
   ```
3. Look for CSS rules conditioned on a flag class (e.g. `.container.uniformMaxWidth { max-width: calc(baseUnit * 100); }`). These override the default rule you found in Step 1.
4. Confirm which flag class is active on canva.com via DevTools computed styles.
5. Use the flag-overridden value in the prototype.
6. Document in deviations with reason `feature-flag-override`:
   ```json
   {
     "element": "WonderBox container max-width",
     "monorepoDefault": "calc(8px * 94) = 752px (.container base rule)",
     "flagOverride": "calc(8px * 100) = 800px (.container.uniformMaxWidth — active on canva.com)",
     "prototypeValue": "calc(8px * 100) = 800px",
     "reason": "feature-flag-override",
     "description": "getWonderBoxUniformMaxWidth() is enabled on canva.com"
   }
   ```
7. Re-measure after fixing. Repeat until ±2px.

**Do not declare a slot done until every key dimension is within ±2px of canva.com.**

### 4b-6 — Fallback when Chrome MCP is unavailable

If Chrome DevTools MCP is disconnected and the user has explicitly authorized you to proceed without it (default: stop and ask — see `feedback_chrome_mcp_required`), you do NOT get to declare the slot done on "looks right" grounds. Run the **source-only fidelity floor** instead:

1. **Enumerate every spacing/layout value from `auditResult.sourceFiles` + `auditResult.outerComposerSpacing`.** Build a table:

   | Element path            | Property      | Source px       | Prototype px | Match? |
   | ----------------------- | ------------- | --------------- | ------------ | ------ |
   | `.bannerContentArea`    | `padding-top` | `64px` (8u)     | `64px`       | ✅     |
   | `.wonderBoxPlaceholder` | `min-height`  | `277px`         | `(missing)`  | ❌     |
   | outer composer `<Rows>` | `spacing`     | `0` (none)      | —            | n/a    |
   | shell content column    | `max-width`   | `1760px` (220u) | `(missing)`  | ❌     |

2. **Every row must match** — every `min-height`, `max-width`, fixed `width`, `<Spacer size="Xu" />`, `padding`, `margin`, `gap`, `Rows spacing`, `Columns spacing`, `Box paddingX/Y`. Any unmatched row is a fidelity bug, regardless of whether it "looks OK" in the browser.

3. **Specifically verify** (these are the recurring drift sources):
   - Banner `min-height` inherited from parent route for sub-routes (see `inheritsBannerFrom` flag in audit)
   - Content-column `max-width` cap from `shell_layout.css`
   - Every sibling `<Spacer />` rendered in the outer composer
   - Inter-anchor gaps between title/search/pills encoded per-pair (not as one flex `gap`)
   - Any `margin: 0 auto` that centers a capped-width block

4. **No "close enough" in source-only mode.** If source says `padding-bottom: calc(8px * 2) = 16px`, prototype CSS says `16px` (or `calc(8px * 2)`), not `padding-bottom: 1rem` (which computes to 16px only when root font-size is 16px — and this prototype uses 62.5%, so `1rem = 10px`).

5. Log unresolved rows in `deviations[]` with `reason: "source-only-floor-mismatch"` so the next Chrome-MCP-equipped session can triage them.

---

## Step 5 — Log all deviations

After writing all files, compile the deviation log. This is required — not optional.

For every place where prototype TSX/CSS differs from the monorepo source, add an entry:

```json
{
  "file": "index.tsx",
  "line": "approx 45",
  "monorepoCode": "<DesignTemplatePreviewCarousel items={templates} />",
  "prototypeCode": "<StaticTemplateGrid items={MOCK_TEMPLATES} />",
  "reason": "dom-complexity",
  "description": "DesignTemplatePreviewCarousel pulls in 8 layers of carousel/virtualization wrappers. Replaced with flat grid showing same items."
}
```

Any Easel component replaced with HTML, any layout prop changed, any component removed entirely — these must all appear in the log.

---

## Step 6 — Run easel-validator

After writing all files, invoke the `easel-validator` skill. Note the result in the port result.

---

## Step 7 — Write port result

Write to `.porter-workspace/<PageName>/results/<slotName>.json` following the schema in `page-porter/references/port-result-schema.md`.

Include:

- `status`: `"complete"` / `"partial"` / `"failed"`
- `filesWritten`: list of all prototype-relative paths written
- `easelValidationStatus`: from the validator output
- `easelErrors`: any errors the validator reported
- `deviations`: the full deviation log from Step 5
- `notes`: any decisions or warnings beyond the deviations

---

## Card-grid and feed slots

When the slot contains a card grid, list, or feed (Recents, Projects, search results, folder contents):

1. **Source fixture data from monorepo** — read the slot's `fakes.ts`, `stories/`, or constant data arrays. These files contain the exact mock items (titles, colors, aspect ratios, badge presence, page counts, creator names). Use them verbatim as mock data. Preserve exact item ordering.
2. **Copy the card component structure verbatim** — read the card component's TSX source. The card thumbnail aspect ratio, badge position, avatar chrome, and metadata row structure all come from the source TSX. Do not infer structure from DOM measurements.
3. **Placeholder thumbnails** — solid-color blocks using colors from `fakes.ts` are acceptable for thumbnails.
4. **Never invent card content wholesale** — if no fakes exist, write 4–6 cards matching the structural shape from the source TSX and add a `deviations` entry: reason `logic`, description "no fakes.ts found, placeholder data used".
5. **Filter options** — carousel filter pills/buttons have their option list defined in source constants (e.g. `FILTER_OPTIONS`, `TAB_ITEMS`). Read those constants. Never reconstruct filter labels from DOM observation — the DOM may show abbreviated or localized text.

**The css-auditor does NOT define what items appear in content slots. Content structure comes from monorepo source files only.**

### Static vs user-generated content — standard rule

Every piece of content on a ported page falls into one of two buckets. Treat them differently:

- **Static chrome** — page titles, section headings, tab labels, filter labels, button labels, empty-state copy, system-provided asset categories, default doctype names, framework-provided SVGs/icons, token-driven swatch palettes (e.g. the preset colour chips that ship with a brand kit). **Pull these in verbatim from the monorepo.** They are the "app" part of the page, not the user's content. Read `messages.ts`, fixture files, token definitions, constant arrays — do not paraphrase, retype, or guess.
- **User-generated content** — anything the end user uploads or creates: logos, photographs, brand templates, uploaded fonts' glyph previews, user colour palettes, etc. For these, **render a plain gray placeholder** (`rgb(242, 242, 247)` or the monorepo's `colorUiNeutralSubtleBg` token) at the correct aspect ratio and layout. Never bake in fake images, gradients, or sample art.

How to tell which bucket applies: if the content exists in the monorepo source (fakes.ts, constants, messages), it is static — copy it verbatim. If the content is fetched from a user-owned service (uploads, designs, kit assets authored by the user), it is user-generated — gray-placeholder it.

This rule is **standard across every page port**. Both halves must be done correctly for a port to pass validation. A page with invented sample photos, or with paraphrased section headings, fails.

---

## ⛔ Scope boundary — slots are content only

Slots render their own content only. The following belong exclusively to the page assembler and must NOT appear in any slot:

- Nav width / nav adjacency
- `mainContent` card (margin, border-radius, box-shadow, overflow:hidden)
- Inner scroll container (`overflow-y: auto`, `height: 100vh`)
- Page-height constraints
- Background gradient on the page root

If you reach for any of the above on the slot's outermost element, stop — those belong in the page assembler.

---

## ⛔ Hard constraints

- **Monorepo TSX is the structural authority** — hierarchy, render order, Easel props, layout components must match source unless a valid reason is logged
- **Easel before HTML** — if an Easel component exists for a UI element, use it; a custom `div` is a deviation requiring reason code `dom-complexity`
- **Every deviation must be logged** — undocumented deviations will fail the Codex adversarial review
- **Do not change Easel component props** — `paddingX`, `gap`, `spacing`, `variant`, `size` props must match source exactly
- **Do not load advisories not in `requiredAdvisories`**
- **Do not import monorepo CSS directly** from prototype TSX (Rule B)
- **Do not import `.inline.svg` directly** (see asset-handling.md)
