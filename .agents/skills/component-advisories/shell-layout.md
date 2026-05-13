# Advisory: Shell Layout

> **Warning**: canva.com observations reflect one logged-in session under unknown flag state. Always prefer monorepo source for structural decisions. Use canva.com only to confirm visual rendering (icon appearance, color values, spacing measurements) — never to derive component ordering, flag conditions, or structural hierarchy.

**When to load**: when the slot includes a primary nav sidebar OR a page-level content wrapper (i.e. the logged-in shell layout for `/home` and similar pages).

This advisory documents two structural patterns that live outside any individual slot but must be applied to the assembled page.

---

## Structural authority (monorepo-derived)

_The following is sourced from monorepo `.tsx` and `.css` files only. Treat as canonical. Do not override with canva.com observations._

### 1. Content card effect (`realCardEffect`)

**Source**: `ui/nav/logged_in_shell/shell_layout/shell_layout.css` → `.contentColumn.realCardEffect`

The main content area to the right of the primary nav is rendered as a "floating card" — it has a margin, rounded corners, and an elevation shadow. This effect is applied to the content column wrapper, **not** to any individual slot.

### Required CSS on the main content wrapper element:

```css
.mainContent {
  /* Measured canva.com (VQgAwg): x:72 y:8 w:1633 right:1705 at 1728px viewport
     margin: 8px top, 8px right, 0 bottom, 0 left (verified: marginLeft=8px also on canva.com)
     — card grows with content; NO fixed height. Body scrolls, not an inner div. */
  margin: 8px 8px 0 0;
  /* cardBorderRadius = calc(baseUnit * 2) = 16px — but ONLY top corners are rounded. */
  border-radius: 16px 16px 0 0;
  overflow: hidden; /* clips rounded top corners only; no height limit so bottom is not clipped */
  background: #ffffff; /* elevationSurfaceBg = colorWhiteA10 = #FFFFFF (light mode) */
  box-shadow:
    0px 0px 0px 0.5px #404f6d0f,
    /* colorBlackA01 */ 0px 2px 4px 0px #182c5923,
    0px 6px 12px 0px #182c5912; /* elevationSurfaceRaisedShadow */
}
```

### Critical: scroll architecture — body scrolls, NOT an inner div

**Do NOT use `height: calc(100vh - 8px)` on the content column or add an inner `overflow-y: auto` scroll div.** This is the most common mistake. On canva.com:

- The **body** is the scroll container (`overflow-y: scroll`)
- The content column has **no height constraint** — it grows with its content
- Page content scrolls via window scroll (not an inner container)
- The nav stays visible via `position: sticky; top: 0; height: 100vh` on the nav column

The full layout CSS in `index.html` + page module:

```css
/* index.html <style> block */
body {
  overflow-y: scroll; /* permanent scrollbar gutter (15px) — shrinks layout to viewport-15px */
  background-color: #fcfbfe; /* shows in the 8px card gutters (top + right) */
}
```

The shell gradient (`#FCFBFE → #F6F2FD`) is NOT applied to the body. It is applied via a `.layoutBackground` div — the first child of `.layout` — which replicates the monorepo's `shell_layout.tsx` pattern directly. **Do NOT use `background-attachment: fixed` on the body** — it interacts badly with child element gradients and produces wrong visuals.

```css
/* page module — add .layoutBackground before .columns */
.layoutBackground {
  position: sticky;
  top: 0;
  pointer-events: none;
  /* height: auto → 0 because element has no children */
}
.layoutBackground::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100%;
  /* lightThemeBgColorStart=#FCFBFE, lightThemeBgColorEnd=#F6F2FD (shell_layout.css) */
  background: linear-gradient(180deg, #fcfbfe 0%, #f6f2fd 100%);
}
```

In the TSX, place this as the **first child** of `.layout`, matching `shell_layout.tsx line ~275`:

```tsx
<div className={styles.layout}>
  <div className={styles.layoutBackground} /> {/* ← must be first */}
  <div className={styles.columns}>...</div>
</div>
```

**CRITICAL — `.contentColumn` must have `position: relative`** (matching monorepo `.contentColumn { position: relative }`). Without it:

- `.contentColumn` is a non-positioned element → CSS Level 3 (painted first)
- `.layoutBackground::after` is a positioned element → CSS Level 4 (painted after Level 3)
- Result: the gradient covers the entire content area, hiding the WonderBox and all content

With `position: relative`, `.contentColumn` becomes Level 4 and paints after `.layoutBackground` based on DOM order, keeping the gradient behind it.

```css
/* page module */
.layout {
  position: relative;
  min-height: 100vh;
} /* no height, no overflow:hidden */
.columns {
  display: flex;
} /* no height */
.navColumn {
  position: sticky;
  top: 0;
  height: 100vh;
  min-width: 72px;
  flex-shrink: 0;
  z-index: 2;
}
.contentColumn {
  /* as above — no height, overflow:hidden for corners only */
}
/* NO inner scroll div. Body handles scrolling. */
```

**Why the gutter is visible:** `body { overflow-y: scroll }` creates a 15px scrollbar gutter. Combined with the 8px `margin-right` on the content column, the total visible gap between the card's right edge and the viewport right edge is 23px (8px `#fcfbfe` background + 15px scrollbar). Without the body scrollbar, the 8px gap is invisible against the near-white background.

### Critical: content padding is 24px, NOT 32px (inner-panel offset)

Canva.com renders a **nested pair** of white columns at 1440vp:

| Layer                    | Role                                               | x   | right | width | Shadow? |
| ------------------------ | -------------------------------------------------- | --- | ----- | ----- | ------- |
| Outer scroll (`.D8aLlg`) | Main scroll container; **32px horizontal padding** | 328 | 1440  | 1112  | No      |
| Inner panel (`.xzANJg`)  | "Floating card" — shadow + rounded top corners     | 336 | 1432  | 1096  | Yes     |

The prototype's `.contentColumn` (`margin: 8px 8px 0 0`) mirrors the **inner panel** — it has the shadow and rounded corners — but its horizontal bounds are 8px _narrower_ than canva.com's outer scroll on each side. If you then add 32px padding _inside_ `.contentColumn` (or a `.pageContainer` child), content body lands at `336 + 32 = 368` / `right 1432 − 32 = 1400`. Canva.com's body sits at `328 + 32 = 360` / `1440 − 32 = 1408`. That's an 8px drift at each edge.

**Rule:** when padding lives inside `.contentColumn` (or a child like `.pageContainer`), use:

```css
.pageContainer {
  padding-left: 24px;
  padding-right: 24px;
}
```

24px compensates for the 8px inner/outer gap so your content body hits `336 + 24 = 360` / `1432 − 24 = 1408` — exactly canva.com's body x/right. **Do not use `padding: 32px`** inside `.contentColumn` — it produces an 8px horizontal drift that is easy to miss visually but immediately visible when comparing bounding rects.

If a future page needs the exact 32px feel of canva.com's outer scroll, the alternative is to widen `.contentColumn` itself (`margin-left: -8px; margin-right: 0`) so it spans x=328 to x=1440. This restores 32px padding but changes where the card shadow paints — only do this if the visual requires it.

---

### 2. Primary nav structure

**Source**: `ui/nav/logged_in_shell/global_nav/primary_nav/primary_nav.tsx` + `create.tsx`

**Derive nav item order from `primary_nav.tsx` in the monorepo.** Do not use a nav item ordering observed from a live canva.com session — flag state is unknown and account-specific. The monorepo source is the canonical order.

The general structure of the primary nav, as defined in the monorepo, is top-to-bottom:

1. **Panel toggle** — `DockLeftFilledIcon` (panel open) / `DockLeftIcon` (panel closed) from `ui/base/icons/dock_left/`. Inline SVG, not an Easel `Button`. Uses `fill="currentColor"`.
2. **Create button** — `CircleButton` (from `ui/base/button/button`) with `PlusIcon` (from `ui/base/icons/plus/icon`), `variant="primary"`. Below it: a `TruncatedText` label "Create". Source: `design_creation_button.tsx`.
3. **Flag-gated items** — items inserted conditionally based on feature flags (e.g. AI nav item). Read the condition from `primary_nav.tsx`; do not assume any flag is on or off from a live session observation.
4. **Pinned items** — read from `primary_nav.tsx`; order and contents are monorepo-authoritative.
5. **More** — three-dot icon, opens flyout.
6. **Footer** — notification bell (with badge) + user avatar. Both pinned to the bottom via `Spacer` / `flex auto`.

### DockLeft inline SVGs (copy verbatim, fill="currentColor"):

**Closed (panel hidden):**

```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="m7 3c-2.20914 0-4 1.79086-4 4v10c0 2.2091 1.79086 4 4 4h10c2.2091 0 4-1.7909 4-4v-10c0-2.20914-1.7909-4-4-4zm1.5 16.5h-1.5c-1.38071 0-2.5-1.1193-2.5-2.5v-10c0-1.38071 1.11929-2.5 2.5-2.5h1.5zm1.5 0v-15h7c1.3807 0 2.5 1.11929 2.5 2.5v10c0 1.3807-1.1193 2.5-2.5 2.5z"
    fill="currentColor"
  />
</svg>
```

**Filled/open (panel visible):**

```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M7 21C4.79086 21 3 19.2091 3 17L3 7C3 4.79086 4.79086 3 7 3L17 3C19.2091 3 21 4.79086 21 7L21 17C21 19.2091 19.2091 21 17 21L7 21ZM10 4.5L10 19.5L17 19.5C18.3807 19.5 19.5 18.3807 19.5 17L19.5 7C19.5 5.61929 18.3807 4.5 17 4.5L10 4.5Z"
    fill="currentColor"
  />
</svg>
```

### Create button pattern (from `design_creation_button.tsx`):

```tsx
import { CircleButton } from 'ui/base/button/button';
import { PlusIcon } from 'ui/base/icons/plus/icon';

<CircleButton
  icon={PlusIcon}
  onClick={onCreateClick}
  ariaLabel="Create a design"
  variant="primary"
/>;
```

Do **not** use a custom `div`/`Box` with a sparkle icon for the Create button. The monorepo uses `CircleButton + PlusIcon`.

---

### 3. Icon mapping for nav items

**Source**: `ui/nav/logged_in_shell/global_nav/primary_nav/primary_nav_item/icons.ts`

Icon name strings map to Easel icon components. The panel toggle specifically:

| Name string     | Easel component                    |
| --------------- | ---------------------------------- |
| `'menu'`        | `DockLeftIcon` (from `dock_left/`) |
| `'menu-opened'` | `DockLeftFilledIcon`               |

These icons must be rendered as **inline SVG string constants** in the prototype (Rule U), not as Easel `<Icon>` components, because the nav uses `dangerouslySetInnerHTML` for all nav icons.

---

## Visual verification (canva.com-derived)

_The following observations are from canva.com for styling evidence only. Use these to confirm icon and label rendering visually, not to derive structure, ordering, or flag conditions._

- Verify that the panel toggle icon SVG paths match what is rendered in the live browser using Chrome DevTools (inspect the SVG `d` attribute)
- Verify color values for nav item icons (active vs inactive states) by measuring `getComputedStyle` on the relevant elements
- Verify spacing measurements (nav width, item heights, padding) by measuring `getBoundingClientRect` on the live page
- Do NOT use the observed ordering of nav items from a live session to determine which items to render or in what order — read `primary_nav.tsx` for that
