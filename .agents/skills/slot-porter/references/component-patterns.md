# Component Patterns Reference

Apply these patterns when writing prototype TSX and CSS. These cover Easel component quirks, cross-file `composes:` gaps, and structural translation rules.

---

## Rule F — Feature flags and conditional rendering: read the condition, not the branch

Before porting any conditional UI element (action buttons, badges, banners, sections), **read the full condition in the monorepo source** — not just the branch that renders it.

**The mistake to avoid:** finding `if (canShowX) { render <X /> }` and porting `<X />` without checking whether `canShowX` is true for a standard logged-in user.

**How to apply:**

1. Find the condition guarding the element (e.g. `action: someCondition ? { icon: 'plus' } : undefined`)
2. Expand every variable in the condition. Common patterns:
   - Feature flags: `enableXxx` — **not enabled by default**, do not port unless verified on canva.com
   - Access mode: `accessMode === 'edit'` — true for the owner, safe to assume
   - Offline state: `!isOffline` — true normally, safe to assume
   - Mobile: `!isMobile` — true on desktop prototype, safe to assume
   - Variant/type checks: `variant === 'personal'` vs `variant === 'team'` — these differ per item, read carefully
3. If a feature flag gates the element: **do not include it**. Verify against canva.com first. If you see it on canva.com, the flag is on for this account — include it and note the flag in a comment.

**Example — "Starred for Canva Team" + button:**

```ts
// custom_section_factory.tsx
const canCreateCustomSection = variant === 'personal' || enableTeamStarredCustomSections;
// For team sections: "+" only appears when enableTeamStarredCustomSections flag is ON
// → do NOT add hasAddButton to the team section by default
```

**Verify on canva.com using Chrome DevTools MCP** before including flag-gated UI:

```js
document.querySelector('[aria-label="Create section"]'); // present → flag is on
```

---

## Rule B — All CSS imported by prototype TSX must be local `.module.css`

The `canva-monorepo-css` Vite plugin only activates for monorepo files. Any `.css` imported by prototype TSX must be copied locally and renamed `.module.css`. Apply all `@value` inlining (css-transform-rules.md) before importing.

---

## Rule Q — Structural differences (apply to every extraction)

### Q.1 — Header is position:absolute in prototype

The prototype header does not take up vertical space in the document flow. If the monorepo component's container uses `min-height: calc(100vh - 80px)` and `justifyContent="center"` — in the monorepo, the container starts at y=80, so centered content lands at y≈144. In the prototype, the container starts at y=0 — same centering would place content at y≈64.

**Fix**: Replace centering with `padding-top: calc(80px + <desired-gap>)` to replicate the visual position.

### Q.2 — No page shell or intermediate containers — trace the FULL parent tree

The prototype does not replicate the page shell or intermediate layout orchestrators (e.g. `launchpad.tsx`, `page.tsx`, section wrappers). **Before writing any wrapper CSS, read every parent component up to the page root and extract any padding, max-width, or structural CSS they contribute.**

**How to apply:**

1. Find the component being ported in the monorepo.
2. `grep -r "ComponentName"` to find its import site(s).
3. Read those parent files. Look for the wrapping `<div className={...}>` and its CSS class.
4. Resolve the CSS class values (follow `@value` tokens). Apply those values to the slot's own wrapper.

**Example — ShortcutCarousel:**

```
shortcut_carousel.tsx
  ← rendered by launchpad.tsx in <div className={bleedContainer + quickCreateContainer}>
  ← bleedContainer at smallUp: padding-left: pageLeftPadding (32px); padding-right: pageRightPadding (32px)
  → add padding: 0 32px to the prototype .wrapper
```

This is **the single most common cause of layout drift** — a component looks correct in isolation but is misaligned compared to surrounding content because it is missing the outer container's spacing.

Every slot extraction must answer: _"What does the parent container contribute to this component's position and spacing?"_ before writing any CSS.

### Q.3 — Cross-file `composes:` doesn't resolve

See Rule W below.

---

## Rule E — `navContentHeight` must be 80px if page has a header

```css
/* In prototype .module.css — replace token with concrete value */
@value navContentHeight: 80px; /* NOT 0px — gradient must extend behind header */
```

If `structuralFlags.hasNavContentHeight: true` in the audit, apply this.

The gradient trick:

```css
.container {
  min-height: calc(100vh - 80px);
}
.gradientBg {
  height: calc(100% + 80px);
  top: -80px;
} /* extends behind header */
```

---

## Rule I — Easel icon sizes: always use the size-specific SVG file

Easel icons have **separate SVG files per size** (`tiny`, `small`, `medium`). The icon component (`icon.ts`) maps `iconSize` to the correct file:

```ts
export const PlusIcon: Icon = create({
  tiny: plusTinySvg, // icon-plus-tiny.inline.svg
  small: plusSmallSvg, // icon-plus-small.inline.svg  ← 16×16 native viewBox
  medium: plusSvg, // icon-plus.inline.svg        ← 24×24 native viewBox
});
```

**Never** use the `medium` (24px) SVG and set `width/height="16"`. The path geometry is drawn for the 24px grid — it will render incorrectly at 16px. Always use the `small` (`icon-<name>-small.inline.svg`) file for `iconSize="small"`.

**How to find the right file:** `ls ui/base/icons/<icon_name>/` — look for `-small.inline.svg` suffix.

---

## Rule IC — Section header structure: toggle button wraps title + chevron

In the monorepo (`section_header.tsx`), the collapsible section header is structured as:

```
[toggleButton (title text + chevron at end)] [actionButton (+)]
```

The entire title **and** the chevron are inside one `<Button>` element (`disclosure={true} iconPosition="end"`). The chevron is hidden by default and appears **only on hover of that button**, not on hover of the surrounding header div.

**The mistake to avoid:** putting the title as a sibling span and the chevron as a separate button adjacent to it. This causes the chevron to appear whenever anything in the header is hovered, including the "+" button.

**Correct prototype structure:**

```tsx
<div className={styles.sectionHeader}>
  {' '}
  {/* flex, space-between */}
  <button className={styles.sectionToggleButton} onClick={toggle}>
    <span className={styles.sectionHeaderTitle}>{title}</span>
    <span className={styles.sectionChevron}>{SVG_CHEVRON_DOWN}</span>{' '}
    {/* opacity:0, shows on button hover */}
  </button>
  {hasAddButton && <button className={styles.sectionAddButton}>+</button>}
</div>
```

**CSS:**

```css
.sectionChevron {
  opacity: 0;
  transition: opacity 0.1s linear;
}
.sectionToggleButton:hover .sectionChevron,
.sectionToggleButton:focus .sectionChevron,
.sectionToggleButton.collapsed .sectionChevron {
  opacity: 1;
}
```

Source: `section.css` — `.toggleButton svg { opacity:0 }` / `.toggleButton:hover svg { opacity:1 }` (only on the button itself, `@media mediumUp`).

**Measured from canva.com:** toggle button = 28px tall, `padding: 4px 12px 4px 6px`, `border-radius: 4px`, font 14px/600/22px.

---

## Rule IB — Easel Button medium icon-only: 32×32px, radius 8px, padding 0 8px

When replicating an Easel `<Button variant="tertiary" icon={...} iconSize="small" />` (no explicit `size` prop → defaults to medium) as a plain `<button>`:

| Property      | Value                    | Source                                                                                     |
| ------------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| Height        | 32px                     | Easel Button medium size                                                                   |
| Padding       | `0px 8px`                | Icon-only medium button (8 + 16 + 8 = 32px width)                                          |
| Border-radius | **8px**                  | Easel Button default — NOT `4px` (radiusElementSharp is for menu items/chips, not buttons) |
| Color         | `colorContentSubtlestFg` | From `.sectionButton` in `section.css`                                                     |

```css
.sectionAddButton {
  padding: 0 8px; /* icon-only medium: 8px horizontal */
  height: 32px; /* medium size */
  border-radius: 8px; /* Easel Button radius — NOT 4px */
}
```

**Verified on canva.com**: `getBoundingClientRect()` = 32×32, `borderRadius` = 8px, `padding` = `0px 8px`.

---

## Rule IT — Tree menu folder items: expand caret + folder icon on LEFT (both inside the toggle button)

Sidebar sections that set `menuType='tree'` (the default in `section.tsx`) render **folder-type** items with an expand caret **AND a folder icon** on the **LEFT** of the label — together inside a single absolutely-positioned toggle button. Not a chevron-right at the end of the row, and not just a caret.

**The mistake to avoid:** porting a folder link as either (a) `<NavItem icon={FoldersIcon} hasChevron />` (icon on left, chevron-right at end), or (b) a caret-only toggle with no folder icon. Both are wrong. The monorepo `TreeMenuItem` + `ThumbnailCaretWrapper` pattern puts an **8×8 caret-right AND a 24×24 FolderAnimatedIcon** together inside the same 40×32 absolutely-positioned button on the LEFT, separated by a 2px gap.

**Source:**

- `ui/base/menu/private/tree_menu.tsx` → `TreeMenuItem` accepts a `customToggle` and reserves `treeMenuItemLeftSpacing = calc(space150 + toggleButtonWidth)` = 52px+ of left padding on the link anchor.
- `ui/nav/sidebar/panes/components/sidebar_item/internal/thumbnail_caret_wrapper/thumbnail_caret_wrapper.tsx` — renders `<Columns spacing="0.25u">` with caret (8×8) in Col 1 and `ThumbnailOrIcon` (24×24) in Col 2. Gated by `enableCaretForCollapsibleLinkItems()`; passed as `customToggle` to `TreeMenuItem`.
- `ui/nav/sidebar/panes/components/sidebar_item/internal/link_item/link_item.tsx` lines 232-263 — composition site.
- `ui/nav/sidebar/panes/components/sidebar_item/internal/link_item/icons.tsx` — `subtype='animated'` → `FolderAnimatedIcon` (starred personal folders use this).
- `ui/organizing/folder_animated_icon/folder_animated_icon.tsx` — 24×24 icon: back-body SVG path `M10.857,2L6.024,2C3.817,2...` with closed front-panel at `rotateX(-29deg)`.

**Measured from canva.com:**

| Property             | Value                                                                      |
| -------------------- | -------------------------------------------------------------------------- |
| Wrapper position     | `relative` (anchor for absolute toggle)                                    |
| Wrapper height       | 40px                                                                       |
| Toggle button        | `position:absolute; left:4px; top:4px`                                     |
| Toggle button size   | 40×32px                                                                    |
| Toggle button radius | 8px (Easel Button medium)                                                  |
| Toggle layout        | `display:flex; justify-content:center; align-items:center; gap:2px`        |
| Caret SVG            | native `width=8 height=8 viewBox="0 0 8 8"` (NOT scaled from 16px chevron) |
| Folder icon          | 24×24 `FolderAnimatedIcon`, directly adjacent to caret (Columns 0.25u gap) |
| Link anchor padding  | `4px 12px 4px 52px` (reserves 40+12 for toggle button + gutter)            |

**Detecting the icon on canva.com:** inspect the `<li>` wrapper and query `li.querySelectorAll('svg')` — you should see **three** SVGs: the caret (8×8), the folder back-body (path starting with `M10.857,2...`), and the more-actions menu icon. The first two live inside the `<button aria-label="Expand X">`; the third lives in the actions area. If you only look inside the `<a>` anchor you will miss the icon.

**SVG path (caret-right, native 8×8, from canva.com):**

```
M4.62386 2.79588L3.3268 1.66095C2.90539 1.29222 2.69469 1.10785 2.51597 1.10214C2.36068 1.09718 2.21191 1.16468 2.11339 1.28482C2 1.42308 2 1.70306 2 2.26301V5.73699C2 6.29694 2 6.57692 2.11339 6.71518C2.21191 6.83532 2.36068 6.90282 2.51597 6.89786C2.69469 6.89215 2.90539 6.70778 3.3268 6.33905L4.62386 5.20412C5.099 4.78838 5.33656 4.58051 5.4239 4.33423C5.50058 4.11801 5.50058 3.88199 5.4239 3.66577C5.33656 3.41949 5.099 3.21162 4.62386 2.79588Z
```

Use `fill="currentColor"`, `fill-opacity="0.86"`, `opacity="0.8"` on the path. Rotate 90° for the expanded state (▼). The color itself should be `colorContentSubtlestFg` (≈ `rgba(15,18,26,0.698)`).

**SVG path (folder back-body, 24×24, from `folder_animated_icon.tsx`):**

```
M10.857,2L6.024,2C3.817,2 2.004,3.787 2,5.994L2,14.814C1.996,17.026 22,17.028 22,14.819L22,8.025C22,6.368 20.653,5.025 18.997,5.025L14.521,5.025C14.33,5.025 14.156,4.916 14.072,4.745L13.551,3.681C13.048,2.653 12.002,2 10.857,2Z
```

Light-theme fill `rgba(70,71,73,0.4)` (back body). Front panel is an absolutely-positioned 20×16 div at `bottom:2px; left:2px`, background `#dadadb`, closed-state transform `perspective(none) rotateX(-29deg)`.

**Minimum TSX skeleton:**

```tsx
<div className={styles.treeItem}>
  <button
    type="button"
    className={styles.treeToggle}
    aria-expanded={expanded}
    aria-label={`${expanded ? 'Collapse' : 'Expand'} \u201C${label}\u201D`}
  >
    <span className={styles.treeCaret} dangerouslySetInnerHTML={{ __html: SVG_CARET_RIGHT }} />
    <span className={styles.treeFolderIcon}>
      <FolderAnimatedIcon />
    </span>
  </button>
  <a href={href} className={styles.treeLink}>
    <span className={styles.treeLabel}>{label}</span>
  </a>
</div>
```

**Which items are tree folders:** anything that links to a folder AND can be expanded inline — e.g. "Projects" (routes.ts `startItem: { type: 'icon', icon: 'projects' }`, resolved to `FolderAnimatedIcon` by `icons.tsx`), pinned starred folders with `startItem: { type: 'icon', subtype: 'animated', icon: 'folder' }` (`Brand Assets`, `Team Templates`, `Campaign Hub`…). All resolve to `FolderAnimatedIcon`. Design-thumbnail items (recent designs, team-starred designs) stay as `[thumbnail][label]` leaf items with no caret.

**Detect on canva.com:** in the a11y tree, a folder tree item has **two sibling controls**: `link "<Name>"` and `button "Expand \u201C<Name>\u201D"`. Leaf items have only the link. The folder icon lives inside the expand button, not the link — always inspect the button's subtree when verifying the icon is present.

---

## Rule W — Easel buttons: cross-file `composes:` missing in prototype

Easel `<Button>` / `<NeutralButton>` use `composes: textBoldMedium from "..."` in `button.css`. This cross-file composition **does not resolve** in the prototype Vite pipeline. The result: the button's inner `<span>` is missing key text rendering properties.

**Always add these to `.<localClass> > span` for every Easel button:**

```css
.<localClass > span {
  font-variation-settings: 'opsz' 0 !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  font-smooth: always !important;
  text-size-adjust: none !important;
}
```

The most impactful missing property is `-webkit-font-smoothing: antialiased`. Without it, text renders heavier/bolder on macOS even if font-weight matches numerically.

**Always measure the `<span>` inside buttons, never the button element itself.** The button element shows UA defaults (Arial, weight 400) on both real Canva and the prototype — that is expected. Compare `getComputedStyle(btn.querySelector('span'))`.

---

## Rule X — Trace `composes:` chains completely

The css-auditor provides pre-resolved `composesChains` in the audit. For each chain with `missingInPrototype: true`, add the `resolvedProperties` explicitly in the local CSS.

Example: if audit says `.loginButton composes textBoldMedium` → add:

```css
.loginButton > span {
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  font-variation-settings: 'opsz' 0 !important;
  -webkit-font-smoothing: antialiased !important;
}
```

Follow the full chain if it nests multiple levels. The audit's `resolvedProperties` has the final combined values.

---

## Rule R — Prototype rem base prerequisite (check before every port)

**Before writing any slot code**, verify that `index.html` contains:

```html
<style>
  html {
    font-size: 62.5%;
  }
</style>
```

Source: `ui/base/root_container/root_container.css`. Canva sets this globally so `1rem = 10px`.

All Easel sizing uses `baseUnitInRem = calc(8 * var(--pxInRem, 0.1rem))`. The default `0.1rem` only equals `1px` when the root font is 10px. Without this rule:

- `0.1rem = 1.6px` (at the browser default 16px root)
- Every rem-based Easel component renders **1.6× too large**
- `CircleButton size="large"` would show ~90px instead of 56px

If it's missing, add it to `index.html` before doing anything else. Do not attempt to debug Easel component sizing without first confirming this prerequisite.

---

## Rule S — Easel component size override via className from outside import chain

When the monorepo applies a size-overriding `className` to an Easel component from a CSS file that is **outside the slot's import chain**, do not attempt to replicate that override in the prototype.

**Why it fails**: Easel components enforce size through 2-class specificity selectors like `.circleShape.large { min-width: ...; max-width: ...; }`. A single `className` override has lower specificity and loses. Even `!important` on `width` may not win against box-model contributions from `padding` and `border` in the Easel layer.

**The correct approach**:

1. Open canva.com in Chrome DevTools
2. Inspect the element and note its `getBoundingClientRect()` dimensions (width, height, x, y)
3. Note the computed styles: `border-radius`, `background-color`, `box-shadow`, `color`, `display`, `align-items`, `justify-content`
4. Use a plain HTML element (`<button>`, `<div>`, etc.) styled with exactly those measured values
5. Add a `/* DEVIATION [dom-complexity]: plain <X> replaces <EaselComponent> — size override from outside slot import chain; measured from canva.com DevTools */` comment

The deviation comment is important — it flags that the substitution is intentional and what to check if canva.com's component changes.

### S.1 — Preserve all outer wrapper elements when deviating the inner component

When Rule S applies and you replace an inner Easel component with a plain HTML element, **keep all outer wrapper elements** from the monorepo source — even if those wrappers are themselves simple `Box`/`div` nodes.

**Why**: Outer wrappers contribute to spacing and alignment that is invisible as background color but real as box model. Example: `DesignCreationButtonWrapper` wraps the `CircleButton` in `Box.iconWrapper.round` (36×36px, `padding: 2px`). The padding inside that wrapper creates 4px of space below the visible circle. Replacing only the inner `CircleButton` without the `iconWrapper.round` loses that 4px — the label sits 4px too close to the button.

**How to apply**: Read the full component tree in the monorepo source. Identify every wrapper between the deviated component and the nearest layout container. Keep those wrappers (translated to plain `div`/`span` with the same CSS classes) even when the inner component is replaced.

```tsx
// CORRECT — outer iconWrapper.round preserved; only the inner CircleButton is replaced
<div className={classNames(styles.iconWrapper, styles.round)}>
  <button className={styles.myButton}>...</button>  {/* DEVIATION [dom-complexity] */}
</div>

// WRONG — iconWrapper lost; creates subtle spacing misalignment
<button className={styles.myButton}>...</button>
```

---

## Rule Y — Use Easel components, not plain HTML elements

If the monorepo uses `<Button variant="tertiary">`, use the **same Easel component** in the prototype. Do not substitute `<button>`, `<a>`, or `<div>`.

Easel components carry font sizing, weight, line-height, font-variation-settings, -webkit-font-smoothing, hover/active/disabled states, and accessibility attributes that plain HTML does not.

When you must use a plain HTML element (no matching Easel component):

```css
.myElement {
  font-variation-settings: 'opsz' 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-smooth: always;
  text-size-adjust: none;
  font-family: inherit;
}
```

---

## Rule P — Read Easel component CSS before writing overrides

The css-auditor already reads Easel CSS as part of the audit. Use the audit's `composesChains` output — you do not need to re-read Easel CSS files from scratch. Trust the audit.

If the audit is missing a value you need, check `css-auditor/references/token-values.md` first.

---

## Rule K — `<Text tagName="X">` IS the element; never use `.className child` selectors

`<Text tagName="span" className={styles.foo}>` renders AS the `<span>` element — not a wrapper with a child inside. The DOM is `<span class="textLarge foo">content</span>`.

**Wrong** (matches nothing):

```css
.foo span {
  font-weight: 500;
}
```

**Correct**:

```css
.foo {
  font-weight: 500 !important;
}
```

This applies to all `tagName` overrides: `<Text tagName="div">`, `<Title tagName="h2">`, etc.

---

## Rule N — Easel layout components change their children's layout context

### N.1 — `Box` may be flex

`Box` can apply `display: flex` depending on props. Don't assume it's a plain block. Check the audit's measured `display` value.

### N.2 — `Inline` makes children flex items

`Inline` renders as `flex-direction: row`. Children become flex items — `margin: auto` centering works differently.

### N.5 — `Box` reset class overrides `margin: auto` — use plain `<div>` for centering

`Box` applies a `reset_xxx` class that sets `margin: 0`, overriding `margin: auto` in your module CSS.

**Symptom**: `.myEl { margin: auto; width: 72vw }` has no effect — element stays flush-left.
**Fix**: Use `<div className={styles.myEl}>` instead of `<Box className={styles.myEl}>`.

---

## Rule W.4 — `!important` is required for Easel padding overrides

Easel injects its own CSS at runtime with shorthand properties. Your longhand overrides (e.g. `padding-left: 12px`) lose at equal specificity to Easel's shorthand. Always use `!important` for padding overrides on Easel components:

```css
.loginButton {
  padding-left: 12px !important;
  padding-right: 12px !important;
}
```

---

## ThemeBoundary render prop pattern

```tsx
// CORRECT — render prop, data.className applied to immediate child
<ThemeBoundary light="dark" dark="dark" classicLight="dark" classicDark="dark">
  {data => <div className={data.className}>{/* children */}</div>}
</ThemeBoundary>
```

`ThemeBoundary` does NOT accept JSX children directly. The `data.className` adds `.light` or `.dark` to the child — without it, theme custom properties won't apply and text may be invisible.

---

## Gradient background: full-bleed fix

The monorepo gradient uses page padding to calculate full-bleed width:

```css
width: calc(100% + 2 * mobilePageHorizontalPadding); /* monorepo */
```

The prototype has no page padding wrapper. Replace with:

```css
width: 100vw;
left: 50%;
transform: translateX(-50%);
```

---

## Icon colors: ALWAYS trace through CSS chain

Never assume an icon's color. The audit provides `color` values resolved from the CSS chain. Use those values — do not substitute with generic tokens like `foreground-secondary`.

The audit's `auditTable` rows include icon wrapper `color` values. Use them.

---

## Active states: icon color ≠ label color

Don't assume the active icon color and active label color are the same. The primary nav uses separate tokens:

- Active icon: `colorPurple07` = `#7630D7`
- Active label: `colorPurple08` = `#612DAE` (different!)

Check the audit for separate `--activeIconColor` and `--activeTextColor` entries.

---

## Mock data

Strip all business logic and replace with static data. Source mock values from the monorepo's `fakes.ts` or `stories/` directory for the component.

```tsx
// At top of file, before the component
const MOCK_USER = {
  displayName: 'Canv AI',
  email: 'user@example.com',
};
```

Strip:
| Monorepo pattern | Replacement |
|---|---|
| `import { Messages } from './component.messages'` | Inline string literals from `.messages.ts` |
| `useAppContext()`, `useSidebarVisible()` | Remove; use static values |
| `useResponsiveValue({...})` | Pick a single value or use CSS media queries |
| `useScaledFallbackFontStyles({...})` | Remove entirely |
| MobX `@observable`, `@action` | Replace with React `useState` |
| Proto types | Define simple local TypeScript types |

---

## Rule CN — Contextual nav (secondary nav) patterns

These patterns apply when porting `contextual_nav.tsx` and any sidebar pane that uses `LegacyVerticalShadowScrollbar`.

### CN.1 — Logo element needs explicit `width`

`contextual_nav.css` sets `.logo { width: calc(baseUnit * 10) = 80px; height: calc(baseUnit * 5) = 40px; }`. Without this explicit width the span fills the full parent content width (232px instead of 80px). Always include both dimensions:

```css
.logo {
  display: flex;
  align-items: center;
  width: 80px; /* calc(baseUnit * 10) — contextual_nav.css */
  height: 40px; /* calc(baseUnit * 5) */
  line-height: 0;
}
```

### CN.2 — Content padding is symmetric — do NOT compensate for scrollbar width

`contextual_nav.tsx` wraps pane content in `<Box paddingX="2u">` = 16px each side (symmetric). `LegacyVerticalShadowScrollbar` handles scrollbar width internally — its content pane is narrower on systems with traditional scrollbars, but the prototype runs on macOS with overlay scrollbars where no space is taken.

**Never** add asymmetric right padding (e.g. `padding: 0 27px 0 16px`) to compensate for a scrollbar gutter. Use symmetric `padding: 0 16px`:

```css
.navContent {
  padding: 0 16px; /* Box paddingX="2u" — symmetric, no scrollbar compensation */
}
```

### CN.4 — Nav item horizontal padding is `2u = 16px` (not `1u = 8px`)

`menu.css` defines `--internalPadding: space100 space200` for the `regularRounded` variant. `space200 = 2u = 16px` is the **horizontal** padding — not `1u = 8px`. This is easy to get wrong.

```css
.navItem {
  padding: 0 16px; /* space200 = 2u — regularRounded internalPadding, NOT 1u/8px */
}
```

On canva.com, icons inside items start at `left:104` (item left:88 + 16px padding), not `left:96` (which would be 8px).

---

### CN.3 — Section header title has `padding-inline-start: 0.75u = 6px`

`section.css` defines `.toggleButton { padding-inline-start: calc(baseUnit * 0.75) = 6px }`. This is the button wrapping the section header text, making it start 6px further right than nav items. On canva.com: section header h6 at `left:94`, nav items at `left:88` (6px diff = 0.75u).

Apply this as a CSS class on the section title span:

```css
.sectionHeaderTitle {
  padding-inline-start: 6px; /* section.css .toggleButton padding-inline-start: 0.75u */
}
```

And apply in TSX: `<span className={styles.sectionHeaderTitle}>{title}</span>`.

---

## Source comments

Add a comment at the top of each extracted file:

```tsx
// Prototype extracted from:
//   pages/<section>/<component>/<component>.tsx
//   ui/<subsystem>/<subcomponent>/<subcomponent>.tsx
```
