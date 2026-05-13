# Skill: Extract Monorepo Component into Prototype

Given a monorepo source path (e.g. `pages/anon_home/body/hero_account_selector/`), extract and replicate it faithfully in the Vite + React prototype at `~/work/canva-prototype`.

The monorepo lives at `../canva/web/src` (resolved to `~/work/canva/web/src`).

---

## Phase 0 -- Capture the Target (MANDATORY FIRST STEP)

**Do this before reading any source files.** The monorepo may have multiple versions of a component (e.g. `floating_elements`, `floating_elements2`, `floating_elements3`). Reading source files first risks picking the wrong version. Always establish a visual target first.

### 0.1 — Screenshot the real page

Use Chrome MCP to navigate to `localhost:9090` and take a full-page screenshot of the component/page you are porting. If the component is below the fold, scroll to it or take a full-page screenshot.

```
navigate to: http://localhost:9090/en_au/  (or the relevant route)
take screenshot
```

Describe every visual element you see:

- Layout: how many rows/columns, overall positioning
- Text: content, approximate size, weight, color
- Images/assets: what type (icons, product screenshots, photos, SVGs), how many, arrangement
- Interactive elements: buttons, inputs — their labels, variants, shape
- Background: colors, gradients, how they extend behind the header

**This description is your porting target.** If anything in your prototype differs from this description at the end, something is wrong.

### 0.2 — Inspect DOM to identify which source files are rendered

For any component where multiple versions exist, or where you are unsure which file produces what you see, use Chrome MCP to inspect the DOM:

```javascript
// Get class names on a target element to trace back to source
const el = document.querySelector('.someIdentifyingSelector');
console.log(el.className, el.getAttribute('class'));
// Then search monorepo: grep -r "classNameFragment" ~/work/canva/web/src/pages/
```

Use the class names (even if obfuscated by CSS Modules) to grep the source and identify the exact file. Obfuscated class names won't grep directly, but surrounding structure and data attributes often will.

**Alternative: find the React component name via React DevTools or by inspecting `data-*` attributes.**

The goal: before you open a single source file, you must know _which_ source file produces the elements you see on screen.

### 0.3 — Confirm your source path is correct

Only after 0.1 and 0.2: read the source files at the path you were given (or discovered via DOM inspection). Verify that the source you are reading would produce the visual you captured in 0.1. If it doesn't match, you have the wrong file — keep searching.

### ⛔ NEVER fabricate elements from general knowledge

Every element in your prototype must trace back to a source file or DOM measurement. Do **not** add elements because they are "typical" for this type of UI. Common fabrications that are always wrong:

- **Logo/wordmark** — Apps often have brand logos in the top-left, but Canva's nav uses a sidebar-toggle (`DockLeftIcon`), not a `CanvaLogo`. Never add a logo unless you find it in the source.
- **Decorative dots, separators, dividers** — Only add these if you find them in the source CSS/TSX.
- **Assumed icon choices** — Never guess which icon a component uses. Read `icons.ts` / the component's icon mapping to find the exact icon name. Note that components often have their **own icon directory** separate from `ui/base/icons/`. For example, primary nav items use `ui/nav/logged_in_shell/global_nav/primary_nav/primary_nav_item/icons/<name>/icon` — not the generic `ui/base/icons/<name>/icon`. Always find and read the component's `icons.ts` to get the exact import paths; don't assume the generic base icons apply.

### ⛔ When a component uses `.inline.svg` imports — NEVER substitute Easel icons

If you see `import fooIcon from './path/to/foo.inline.svg'` (or any non-`ui/base/icons/` SVG import) in the source component, that is a **component-specific SVG asset** — not an Easel icon. You MUST NOT replace it with a "visually similar" Easel icon from `ui/base/icons/`. The shapes, proportions, and details are different and the result will look wrong.

**Mandatory procedure:**

1. Read the actual `.inline.svg` file to get its SVG markup.
2. Replace `fill="#XXXXXX"` (any hardcoded fill color) with `fill="currentColor"` — this is what the `canva-inline-svg` Vite plugin does automatically for monorepo files.
3. Store the SVG markup as a string constant in your prototype TSX.
4. Render it with `dangerouslySetInnerHTML={{ __html: svgString }}` inside a `<span>`.

**Why you cannot import the `.inline.svg` directly from prototype TSX:** The `canva-inline-svg` Vite plugin only activates for files whose _importer_ is inside `canvaWebSrc`. A prototype TSX file importing a monorepo `.inline.svg` directly will get the raw file content as a module, not the processed string export — and the `fill` colors will not be replaced with `currentColor`.

**Wrong:**

```tsx
// ❌ Wrong: substituting a "similar" Easel icon
import { PresentationIcon } from 'ui/base/icons/presentation/icon';
// ❌ Wrong: importing inline.svg directly from prototype TSX
import iconSvg from '../../../canva/web/src/ui/foo/icon.inline.svg';
```

**Correct:**

```tsx
// ✅ Correct: copy SVG content, replace fill, store as string
const ICON_PRESENTATION = `<svg width="32" height="32" ...><path fill="currentColor" .../></svg>`;
// Render:
<span dangerouslySetInnerHTML={{ __html: ICON_PRESENTATION }} />;
```

**How to find all inline SVG assets in a component:** grep the source directory for `.inline.svg`:

```bash
grep -r "inline.svg" ~/work/canva/web/src/<component-path>/
```

If you cannot find a source for an element, **omit it**. A missing element is easier to add later than a wrong element is to remove.

### ⛔ ALWAYS trace icon colors through the CSS chain — never assume

Every time you add an icon, you MUST find the exact color through the DOM/CSS chain before writing prototype code. Do NOT assume `foreground-secondary`, `foreground-primary`, or any other token.

**Procedure for every icon added:**

1. Find the component's CSS file (not just the TSX). Icons inherit `color` from their wrapper.
2. Look for `color:` on the icon wrapper — it will reference a token or local CSS variable.
3. Resolve the token to its concrete hex/rgba value. Follow the chain:
   - Local CSS var → token file → primitive color file
4. Write the concrete value in a comment: `/* source: primary_nav_item.css → --defaultAndHoveredIconColor: rgb(from colorPurple09 r g b / 80%) = rgba(74, 46, 126, 0.8) */`

**Example:** `DockLeftIcon` is inside `.iconWrapper { color: defaultAndHoveredIconColor }` from `primary_nav_item.css`. That resolves to `rgb(from colorPurple09 r g b / 80%)` = `rgba(74, 46, 126, 0.8)`. Using `var(--ui-kit-color-foreground-secondary)` (gray) is wrong even though it "looks close" at a glance.

If the component CSS uses a local CSS variable (e.g. `--defaultAndHoveredIconColor`), check where it is defined (usually a `.themeLight`/`.themeDark` block in the same file) and resolve it there.

If the component CSS uses a local CSS variable defined inside a `themeLight { ... }` block (Rule S pattern), resolve it from that block to get the concrete light-mode value. Never leave CSS variables as `var(--something)` in prototype code — always inline the resolved concrete value.

**Common mismatch:** Being given path `pages/anon_home/body/floating_elements/` but the real page renders `pages/anon_home/body/floating_elements3/`. Screenshot first → inspect DOM → find correct path.

### ⛔ State-dependent background belongs on the iconWrapper, not the button

When a component wraps its icon in a dedicated container (like `div.iconWrapper`), **hover and active backgrounds are applied to that inner wrapper — not to the outer button element**. This is a common source of structural mistakes.

**Primary nav item example (verified from source + DOM):**

```
BUTTON (display: inline-block, bg: transparent always)
  SPAN.button__text
    SPAN.rows (display: grid)
      DIV.iconWrapper (36×36, p:6px, borderRadius:8px)   ← bg goes HERE
        SPAN.icon (24×24)
          SVG
      P.label (11px, fontWeight:500, lineHeight:16px)
```

The active state sets `background-color` on `.iconWrapper.selected`, NOT on the button. This means:

- The highlighted area is only 36×36px (just the icon), not the full 64px button width
- The label never has a background behind it
- Transitions are on `iconWrapper` (`transition: background-color 0.2s ease-out, color 0.2s ease-out`), not on the button

**How to check:** DOM-inspect the active item on `localhost:9090` and check `getComputedStyle` on each level. If the button has `background: transparent` and a child div has the colored background — replicate that structure exactly.

### ⛔ CSS class can override the icon `size` prop — always check

Components often apply a fixed-size CSS class to the icon component that overrides the `size` prop entirely:

```css
/* primary_nav_item.css */
.icon {
  height: calc(baseUnit * 3); /* = 24px */
  width: calc(baseUnit * 3); /* = 24px */
}
```

This means `<HomeIcon size="large" className={styles.icon} />` renders at 24px even though `size="large"` would otherwise produce 32px. **Without this CSS override in the prototype, the icon renders at the wrong size.**

**Rule:** When porting a component that applies a CSS class to its icon, add an equivalent size override in your prototype CSS. Use the measured icon size from DOM inspection as the authority.

**Valid Easel icon sizes** (from `ui/base/icons/internal/base_icon.tsx`): `tiny`, `small` (16px), `medium` (24px), `large` (32px). There is no `xlarge`. The 28px "roundIcon" size in the primary nav is achieved via `.icon.roundIcon { height: 28px; width: 28px }` CSS — not via a size prop.

### ⛔ Active state often uses two different color tokens — icon ≠ label

Don't assume the active icon color and active label color are the same token. The primary nav item uses:

- **Active icon** (`colorPurple07`): `#7630D7` = `rgb(118, 48, 215)` — applied to `.iconWrapper.selected`
- **Active label** (`colorPurple08`): `#612DAE` = `rgb(97, 45, 174)` — applied to `.text.selected`

These are different tokens. Using a single `color` property on the button cascades the same value to both children — which is wrong. You need separate rules for the iconWrapper and the label.

**How to find this:** Read the component's CSS and look for separate `--activeIconColor` and `--activeTextColor` (or similar) variables. If there are two, implement two separate color rules.

---

## Phase 0.5 — Identify All Page Slots (MANDATORY for full-page extractions)

**Why slots get missed:** A page like AnonHome uses a skeleton pattern where the page is composed of multiple content slots (HERO_EDITORIAL, SHOWCASES, SPOTLIGHT, TEMPLATES, ECOSYSTEM, FOOTER_BANNER, etc.). The slots are configured server-side via a bootstrap proto. If you only read the hero component and stop, you will silently omit all the sections below it.

**This is the root cause of incomplete pages.** Always extract ALL active slots.

### Slot identification process (run this for any full-page extraction):

**Step 1: Read the skeleton bootstrap proto.**
Find `<page>/skeleton/skeleton_bootstrap_proto.ts` — it lists every possible slot type.

**Step 2: Find which slots are active for your target variant.**
Read `<page>/fakes/skeleton/fakes.ts` — find the fake for your variant (e.g. `aFakeHeroEditorialVideoSkeletonBootstrapWith`). It lists the exact slots in order.

Example for `heroEditorialVideo` variant:

```typescript
slots: [
  HERO_EDITORIAL, // ← hero with video — was the ONLY extracted slot before
  SHOWCASES, // ← "Tools to power your best work" tabbed section
  SPOTLIGHT, // ← "All the tools. All in one place." cards
  TEMPLATES, // ← "Templates for absolutely anything" grid
  ECOSYSTEM, // ← "Unlock Canva's creative ecosystem" cards
  FOOTER_BANNER, // ← "Start designing with Canva" CTA banner
];
```

**Step 3: For each slot, find the source component.**
The slot type maps directly to a body directory: `SHOWCASES` → `pages/anon_home/body/showcases/`, `ECOSYSTEM` → `pages/anon_home/body/ecosystem/`, etc.

**Step 4: Extract ALL active slots.**
Apply the full Phase 1 CSS audit procedure to each slot. Do not skip any slot — every one represents a visible page section.

### What "sensible" means for full-page extraction:

Extract a slot when:

- It renders visible content (text, images, interactive elements)
- Its content can be represented with hardcoded data from the fakes files
- The section adds meaningful visual content to the page

Simplify (but still extract) when:

- The section is data-heavy (e.g. Templates carousel with dynamic API images) — use a static placeholder layout that captures the visual structure
- The section has complex interactivity (e.g. scrollable carousel) — implement a static or simplified version

**Never omit a slot entirely.** Even a simplified version is better than nothing.

### Skeleton layout patterns (from `skeleton.css`):

```
contentContainer: padding 0 24px (mob) → 48px (≥600px) → 32px (≥1200px)
flushSection: margin 0 -24px (mob) → -48px → -32px  (breaks out of padding)
container.xlarge: max-width 1416px, centered
container.responsive: max-width 1288px (→ 1416px at ≥1650px), centered

sectionSpacer (between slots):
  <Spacer size={{ default: '8u', xLargeUp: '12u' }} />
  <Spacer size={{ default: '0', smallUp: '1u', mediumUp: '3u', largeUp: '4u', xLargeUp: '1u' }} />

FooterBanner wrapper:
  flushSection + dark ThemeBoundary + gradient bg (linear-gradient to right, #00C4CC, #5A32FA, #7D2AE8)
  padding: 64px vertical (mob) → 256px (≥600px)
  content max-width: 1416px (xlarge container)
```

---

## Phase 1 -- Source Analysis

### ⛔ MANDATORY PRE-CODING GATE: Complete CSS Audit before writing any prototype code

You MUST complete a full CSS audit of the component chain before writing a single line of prototype TSX or CSS. The audit output is a table of every rendered element and every CSS property that affects it. Do not start Phase 2 until this table is done.

**Why this is non-negotiable:** Every mismatch in the prototype's history traces to the same failure — writing code based on a partial reading of the source. The TSX alone does not contain the final styles. The CSS files, sub-component CSS files, and their `composes:` chains are where the actual computed values come from.

---

### 1.0 — CSS Audit Procedure (run this before writing any code)

**Step 1: Collect every file in the chain.**

Starting from the target component, follow every import recursively:

```
For each .tsx file encountered:
  1. Read it fully.
  2. Find every: import styles from './foo.css'
  3. Read that CSS file fully. Do not skip it.
  4. Find every sub-component import (non-Easel, non-service).
  5. Recurse into that sub-component: read its .tsx AND its .css.
  6. Stop recursion only at pure ui/base/* Easel primitives.
```

**This is not optional. Reading the TSX without reading its co-located CSS is always incomplete.**

Example of what gets missed: `auth_buttons.tsx` applies `styles.loginButton` from `auth_buttons.css`. That CSS file contains `padding: space0 space150` (= `0 12px`), overriding Easel's default `size="small"` padding of `8px`. Reading only the TSX produces the wrong value.

**Step 2: For every rendered element, record all CSS properties.**

Build a table like this — one row per visual element:

| Element          | Source file(s)                       | Properties found                                                        |
| ---------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| Header container | `header.css`                         | `min-height: 80px`, `position: sticky`                                  |
| Logo wrapper     | `header.css .logoArea`               | `flex: 1 0 0`                                                           |
| Auth button      | `auth_buttons.css .loginButton`      | `padding: 0 12px`                                                       |
| Auth button span | `auth_buttons.css .loginButton span` | `font-weight: fontWeight500 = 500`, `font-variation-settings: "opsz" 0` |
| Nav button       | `button.css`, `header.css`           | `height: 32px`, `padding: 0 8px`, etc.                                  |

**Step 3: For every token/value found, resolve it to a concrete pixel value.**

Apply Rule Z. Never leave a token name in the table — always write the concrete value.

**Step 4: Cross-check with `localhost:9090` computed styles — MANDATORY, run a measurement script.**

For each row in the table, measure the element on `localhost:9090` using Chrome MCP `evaluate_script`. Do NOT skip this step even if Phase 0 identified the correct file. The source and compiled output must agree before you write a single line of prototype code.

Run this measurement script (adapt selectors for the component being ported):

```javascript
() => {
  const measure = selector => {
    const el = document.querySelector(selector);
    if (!el) return { error: `not found: ${selector}` };
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      marginTop: cs.marginTop,
      marginRight: cs.marginRight,
      marginBottom: cs.marginBottom,
      marginLeft: cs.marginLeft,
      borderRadius: cs.borderRadius,
      display: cs.display,
      position: cs.position,
      top: cs.top,
      zIndex: cs.zIndex,
      flexDirection: cs.flexDirection,
      alignItems: cs.alignItems,
      justifyContent: cs.justifyContent,
      gap: cs.gap,
      backgroundImage: cs.backgroundImage?.substring(0, 120),
      fontVariationSettings: cs.fontVariationSettings,
      webkitFontSmoothing: cs.webkitFontSmoothing,
    };
  };
  // Replace these selectors with the component's actual elements:
  return {
    title: measure('h1 span'),
    subtitle: measure('h2, [class*="subtitle"]'),
    ctaButton: measure('button'),
    ctaSpan: measure('button span'),
    videoContainer: measure('[class*="video"]'),
  };
};
```

**Compare every measured value against your audit table.** If anything doesn't match the source, stop — you are reading the wrong file, wrong breakpoint, or missing an override. Fix it before proceeding.

**Note:** If you completed Phase 0 correctly, you should already know this is the right file. Step 4 catches cases where a parent component or Easel primitive overrides your source values.

---

### 1.1 Read the target component

Read every `.tsx`, `.css`, `.messages.ts`, and asset import in the target monorepo directory. Apply the audit procedure in 1.0 above.

### 1.2 Map the import graph

For each file, classify every import into one of four categories:

| Category                      | Examples                                                                                                                                                                     | Action                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Easel component**           | `ui/base/box/box`, `ui/base/button/button`, `ui/base/typography/typography`, `ui/base/theme/theme`, `ui/base/layout/layout`, `ui/base/avatar/avatar`, `ui/base/icons/*/icon` | Import directly in prototype TSX. Vite aliases `ui/` and `base/` to the monorepo. These work as-is. |
| **Monorepo CSS**              | `./hero_account_selector.css`, `ui/authenticating/recent_user_card/recent_user_card.css`                                                                                     | Must be copied locally as `.module.css`. See Phase 2.                                               |
| **Monorepo service/DI/proto** | `services/*`, `useAppContext`, MobX stores, proto types, `useResponsiveValue` with complex logic, `.messages.ts` (i18n)                                                      | Must be stripped and replaced with static values or simple React state. See Phase 3.                |
| **Assets**                    | `.png`, `.svg`, `.jpg` imports                                                                                                                                               | Must be checked for filesystem access. See Phase 4.                                                 |

### 1.3 Decide the prototype page directory

Create `src/pages/<PageName>/` for the new extraction. Use a descriptive name (e.g. `SignedOut2` for the hero_account_selector extraction). All local CSS modules, sub-component TSX files, and copied assets go here.

---

## Phase 2 -- CSS Strategy

This is where most extraction bugs happen. Follow every rule exactly.

### Rule T — Source code is for porting. `localhost:9090` is for verification. They must agree.

`localhost:9090` runs the monorepo dev server compiled from the current `master` branch. It is kept in sync: before any porting session, `git pull` and server restart have been done. **`localhost:9090` and the monorepo source on disk represent the same code and must produce identical values.**

**Use `localhost:9090` FIRST (Phase 0) to:**

- Establish a visual target — screenshot the real page before reading any source
- Determine which component version is actually rendered (e.g. `floating_elements3` not `floating_elements`)
- Inspect DOM to identify which source file to read

**Use source code (`~/work/canva/web/src`) to:**

- Understand component structure and write the port (TSX logic, CSS rules, Spacer values, prop patterns)
- Never copy from the compiled output — always from source

**Use `localhost:9090` AGAIN (Phase 1, Step 4) to:**

- Confirm that the source code you found actually produces what's visible
- Verify the prototype matches after porting — the goal is pixel-identical output
- Catch cases where you are reading the wrong breakpoint

**If `localhost:9090` shows a value that doesn't match what you read in the source:**

- You are probably reading the wrong file, wrong breakpoint, or wrong variant
- Use Chrome MCP to inspect the DOM (element classes, computed styles) to find the exact CSS rule being applied
- Trace that class name back to the source file
- Do not start porting until source and compiled output agree

**Procedure:**

1. **Phase 0**: Screenshot `localhost:9090` → describe what you see → inspect DOM to confirm source file
2. Read the confirmed source and build the CSS audit table
3. Cross-check the audit table against `localhost:9090` computed styles
4. Port using those confirmed source lines
5. Run the validate-prototype skill Phase 2 to compare `localhost:5173` against `localhost:9090`
6. Fix any differences by going back to the confirmed source, not by adjusting values to match the compiled output visually

---

### Rule S — Never use `@value` names as CSS selectors. Use `:global()` directly.

`postcss-modules-values-replace` substitutes `@value` names in **property value** positions only. When an `@value` name appears as a **CSS selector**, it is NOT substituted — CSS Modules treats it as a local class name and lowercases it, producing an invalid selector like `themelight { ... }` that matches nothing.

**Broken (monorepo pattern — doesn't work in prototype):**

```css
@value themeLight, themeDark from "ui/base/theme/theme.css";
/* OR inline: */
@value themeLight: :global(.light);
@value themeDark: :global(.dark);

themeLight {
  --titleColor: colorContentFg;
} /* ← WRONG: compiles to "themelight { ... }" */
themeDark {
  --titleColor: colorActionPrimaryFg;
} /* ← WRONG */
```

**Correct (prototype pattern):**

```css
/* Remove the @value import entirely — use :global() directly */
:global(.light) {
  --titleColor: colorContentFg;
}
:global(.dark) {
  --titleColor: colorActionPrimaryFg;
}
```

**Symptom:** CSS custom properties set in these blocks (like `--titleColor`) are never defined. Downstream `color: var(--titleColor)` silently falls back to an inherited or initial value. The element renders with a different color than intended (e.g. `rgba(255,255,255,0.898)` instead of `rgb(255,255,255)`).

---

### Rule V — Read before you write. Both the CSS and the TSX.

Before writing any CSS for a reconstructed component, **read all source files for that component** — both the `.css` and the `.tsx`. Do not write any layout, sizing, or spacing value without having seen it in the source.

**Why both files matter:** Layout-critical properties are often split across two files:

- The `.css` sets some properties (height, max-width, border-radius, breakpoint rules)
- The `.tsx` sets others via Easel prop shorthand (`paddingX="3u"`, `gap="1u"`, `display="flex"`)

Reading only the CSS misses prop-driven layout. Reading only the TSX misses CSS overrides and breakpoint rules. You need both.

**Common properties set via JSX props, not CSS — and therefore invisible if you only read the CSS:**

- `paddingX`, `paddingY`, `padding` → horizontal/vertical/all padding
- `display`, `flexDirection`, `alignItems`, `justifyContent` → flex layout
- `gap` → flex/grid gap
- `width="full"` → `width: 100%`
- `tagName` → affects which HTML element is rendered

**What this prevents:** Writing `max-width: 1440px` when the source has `max-width: maxContainerWidth = 1920px`; writing `padding: 0 48px` when the source has responsive `paddingX={{ default: '3u', mediumUp: '4u', largeUp: '6u' }}`.

**Procedure:**

1. Read the component's `.css` file — note all sizing, spacing, max-width, breakpoints
2. Read the component's `.tsx` file — note all Easel props that carry layout (padding, display, gap, width, flex)
3. Combine both into your reconstruction CSS
4. For any token value (e.g. `maxContainerWidth`, `space800`), trace to its concrete value via Rule Z

---

### Rule U — Always verify image/SVG rendered size from the full wrapper chain.

An image's displayed size is **not** determined by its intrinsic SVG `width`/`height` attributes alone. It is determined by the container chain. Before using any image, icon, or logo component:

1. Read the SVG file to get its intrinsic `width` and `height` (or `viewBox`).
2. Read the CSS for the component class on the img/svg container (e.g. `logo.css` applied to the `<span>` wrapper).
3. Read the CSS for **every wrapper element** above it, up to the content container. A separate wrapper component (e.g. `LazyCanvaLogo`) may apply sizing CSS that is completely separate from the image component itself.
4. Reconstruct the size by wrapping the image component in a container with the explicit dimensions found in step 3.

**Common trap:** `img { width: 100%; height: 100% }` in the image component CSS looks like it sizes by intrinsic content — but it sizes by the **container**. If the container has no explicit dimensions, the image renders at its intrinsic SVG size. If the real component uses a wrapper that sets explicit dimensions, you must replicate that wrapper.

**Concrete example (Canva logo in header):**

- `CanvaLogoWhite` renders `<span class="logo"><img /></span>`. SVG intrinsic = **80×30px** (not 90×32).
- Easel's `logo.css` sets `img { width: 100%; height: 100% }` — sizes by container, not intrinsic.
- Real header: 90×32 wrapper with `overflow: hidden` → img fills 90×34 (aspect ratio), clipped to 32px.
- Without explicit `width: 90px` on the img, the span container is flex-sized to the intrinsic 80×30.
- Fix: in `.logoWrapper`: `width:90px; height:32px; overflow:hidden; flex-shrink:0` AND add:
  ```css
  .logoWrapper img {
    width: 90px;
    height: auto;
    display: block;
  }
  ```
  The `height: auto` preserves aspect ratio (giving ~34px), then `overflow:hidden` clips to 32px.

**Concrete example (CanvaLogo in footer):**

- `CanvaLogo` also renders `<span class="logo"><img width:100% height:100% /></span>`.
- In the footer, the logo box has no explicit size — `img { width:100% }` fills the full parent width (1169px!).
- Fix: wrap in `<div style={{ width:80, height:30 }}>` or a CSS class `.logoWrapper { width:80px; height:30px }`.
- SVG intrinsic size is 80×30px — this matches the real footer logo display size.

**Procedure:**

```
1. grep for the image/logo component across monorepo to find ALL wrapper usages
2. Read the wrapper component's CSS (often a separate logo.css or icon.css)
3. Note: height, width, overflow, border-radius — these come from the wrapper, not the image itself
4. Add a matching wrapper in the prototype
5. ALWAYS check: does logo.css set img { width: 100% }? If yes, the prototype MUST have explicit container dimensions.
```

---

### Rule Z — Never guess CSS values. Trace every token.

When writing CSS for reconstructed components, **never write a dimension, spacing, radius, or font value from memory or estimation.** Every value must be traced back through the token chain to its concrete pixel value.

**Procedure:** If the monorepo CSS says `padding: space050 space100`, open the token files and confirm: `space050 = 4px`, `space100 = 8px`. Write `padding: 4px 8px`. Do not guess `12px` because it "looks about right".

**This applies to container widths too.** Do not write `max-width: 1440px` because it is a "common breakpoint". Look up the actual token (e.g. `maxContainerWidth` in `tokens.css` = `1920px`).

**Quick-reference: resolved Easel token values**

```
# Spacing (from ui/base/tokens/primitive/private/space.css, baseUnit = 8px)
space025 = 2px      (0.25 * 8px)
space050 = 4px      (0.5 * 8px)
space100 = 8px      (1 * 8px)
space150 = 12px     (1.5 * 8px)
space200 = 16px     (2 * 8px)
space300 = 24px     (3 * 8px)
space400 = 32px     (4 * 8px)
space600 = 48px     (6 * 8px)
space800 = 64px     (8 * 8px)

# Border radius (from ui/base/tokens/private/radius.css)
radiusElementSharpest = 2px
radiusElementSharp    = 4px
radiusElementStandard = 8px   ← NOT 6px
radiusElementSoft     = 12px
radiusElementRound    = 9999px
radiusContainerSoft   = 12px
radiusContainerLarge  = 16px

# Sizing
baseUnit         = 8px
calc(4 * baseUnit) = 32px   (common button/row height)
calc(5 * baseUnit) = 40px   (default Easel Button height)
calc(10 * baseUnit) = 80px  (nav header height)

# Font weight tokens (from ui/base/tokens/primitive/private/font_weight.css)
fontWeight400 = 400
fontWeight500 = 500
fontWeight600 = 600
fontWeight700 = 700

# Font size tokens
fontSize14 = calc(14 * var(--pxInRem, 0.1rem))  ≈ 14px
fontSize18 = calc(18 * var(--pxInRem, 0.1rem))  ≈ 18px

# Easel Text/Title size prop → rendered font-size (from typography.css, at pxInRem=0.1rem)
Text size="xsmall"  → 11px, lineHeight 16px   ← NOT 10px or 12px
Text size="small"   → 12px, lineHeight 18px
Text size="medium"  → 14px, lineHeight 22px   (default body)
Text size="large"   → 16px, lineHeight 24px

# Primary nav purple tokens (from ui/base/tokens/primitive/color.css)
colorPurple07 = #7630D7 = rgb(118, 48, 215)   ← active icon color
colorPurple08 = #612DAE = rgb(97, 45, 174)    ← active label color
colorPurple09 = #4A2E7E = rgb(74, 46, 126)    ← default (used at 80% opacity → rgba(74,46,126,0.8))

# Primary nav item computed values (light theme, verified via DOM)
--defaultAndHoveredIconColor  = rgba(74, 46, 126, 0.8)   (colorPurple09 @ 80%)
--defaultAndHoveredTextColor  = rgba(74, 46, 126, 0.8)   (same)
--activeIconColor             = #7630D7                   (colorPurple07)
--activeTextColor             = #612DAE                   (colorPurple08) ← DIFFERENT from activeIconColor
--hoveredAndActiveIconBackgroundColor = rgba(118, 48, 215, 0.1)  (colorPurple07 @ 10%)
```

---

### Rule Y — Use Easel components, not plain HTML elements

If the monorepo uses an Easel component (e.g. `<Button variant="tertiary">`), use the **same Easel component** in the prototype reconstruction. Do not substitute with plain `<button>`, `<a>`, or `<div>`.

**Why this matters:** Easel components carry a substantial amount of styling via CSS composition chains (`composes: textBoldMedium`, `composes: button`, etc.) that plain HTML elements do not inherit. Replacing them loses:

- Font sizing, weight, and line-height from typography tokens
- `font-variation-settings: "opsz" 0` — controls the optical size axis of the Canva Sans variable font, visually affects letterform thickness and spacing
- `-webkit-font-smoothing: antialiased` and `font-smooth: always` — affects text rendering on all platforms
- `text-size-adjust: none` — prevents mobile text scaling
- Correct height, padding, border-radius from the button size token system
- Hover/active/disabled states
- Accessibility attributes

**When you must use a plain HTML element** (no matching Easel component), you MUST manually add Easel's typography rendering properties:

```css
.myElement {
  font-variation-settings: 'opsz' 0; /* Canva Sans variable font optical size */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-smooth: always;
  text-size-adjust: none;
  font-family: inherit; /* ensure Canva Sans inherits */
}
```

---

### Rule X — Trace `composes:` chains completely

When a monorepo CSS class uses `composes: anotherClass`, treat it as if all properties of `anotherClass` are inlined into the current class. You must follow the full chain — `composes` nesting can be several levels deep.

**Example:** `button.css` has `.button { composes: textBoldMedium }`. `.textBoldMedium` is defined across multiple rules in `typography.css`:

1. All text variants: `font-weight: 400; font-variation-settings: "opsz" 0; -webkit-font-smoothing: antialiased`
2. textBoldMedium specifically: `font-size: 14px; line-height: 22px`
3. Bold weight override: `font-weight: 600`

Net result of `.button`: font-size 14px, font-weight **600** (not 400 or 500), line-height 22px, plus all rendering properties.

If a later CSS rule overrides a composed property (e.g. `menu_bar.css` does `.button > span { font-weight: 500 }`), that override only applies to the specified selector — not to the element itself. You must reproduce both the composition AND the override.

---

### Rule W — Easel buttons: cross-file `composes:` doesn't resolve

The prototype Vite plugin does **not** resolve cross-file `composes:` directives. `ui/base/button/private/button.css` imports typography via `@value textBoldMedium from "..."` and then uses `composes: textBoldMedium` — this is effectively cross-file composition. The result: every property that `textBoldMedium` sets on the button element is **missing** in the prototype, and those properties don't inherit to the button's inner `<span>` either.

**The fix is always the same:** trace the composes chain from source, collect the missing properties, and set them explicitly on `.<localClass> > span`.

**⚠️ The most impactful missing property is `-webkit-font-smoothing: antialiased`.** Without it, text renders with subpixel antialiasing on macOS, making it appear visually heavier/bolder — even though `font-weight` is numerically identical. This is the most common cause of "text looks too bold" in prototype vs reference. **Always add `-webkit-font-smoothing: antialiased !important` to every `> span` override on Easel buttons.**

#### W.1 — Always measure the inner `<span>`, not the button element

**The button element itself shows UA defaults (Arial, weight 400) on BOTH real Canva AND the prototype.** This is expected behavior. The actual text styling lives on the inner `<span>`.

Never compare `getComputedStyle(btn)` and conclude the styles are wrong because you see Arial/400. Always compare `getComputedStyle(btn.querySelector('span'))`.

#### W.2 — Trace the composes chain for every Easel button

For each Easel `<Button>` or `<NeutralButton>` used in the component:

1. **Read `ui/base/button/private/button.css`** — note `@value textBoldMedium from "ui/base/typography/temporary_exports.css"` (line 13) and `composes: textBoldMedium` on `.button` (line 120). This chain applies to all variant classes (tertiary, primaryNeutral, secondaryNeutral, etc.) since they all compose `.button`.

2. **Read `ui/base/typography/internal/typography.css`** — `textBoldMedium` appears in two rules:
   - **Universal block** (~line 91, all text classes): sets `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `font-smooth: always`
   - **Body text block** (~line 247, body/bold classes): sets `font-variation-settings: "opsz" 0`, `text-size-adjust: none`

3. **These properties are missing on the prototype button element.** Add them explicitly to `.<localClass> > span` (and to `.<localClass>` if they also affect button element visuals):
   ```css
   .<localClass > span {
     font-variation-settings: 'opsz' 0; /* textBoldMedium body text block */
     -webkit-font-smoothing: antialiased; /* textBoldMedium universal block */
   }
   .<localClass > {
     font-variation-settings: 'opsz' 0; /* also set on element for visual rendering */
     -webkit-font-smoothing: antialiased;
     font-smooth: always;
   }
   ```

#### W.3 — Check if button children use a typography component wrapper

In the component's TSX, check how button label text is rendered. If labels are wrapped in a typography component (e.g. `<Text tagName="span">{label}</Text>`), that wrapper applies its own CSS — especially `color`.

**Common case: `<Text tagName="span">`** — `Text` applies `colorContentFg` to its element. In the prototype, plain string children inherit `colorActionTertiaryFg` from the button instead, making the text slightly brighter (100% white vs ≈90% white).

Fix: add the color token explicitly to the span:

```css
.<localClass > span {
  color: var(--colorContentFg); /* matches <Text> component's color token */
}
```

**How to find this:** search the component TSX and any parent component that renders the button for `<Text`, `<InheritColor`, or similar wrappers around the button's children.

#### W.4 — Trace context CSS for all button-related overrides

Beyond the composes issue, the context/container CSS files often override button styling. Read them and look for:

- `> span` overrides (font-weight, color) — these are invisible if you only read `button.css`
- Padding overrides on the button itself
- Background/border overrides that change the Easel variant defaults

```bash
grep -n "> span\|padding\|background-color\|border" <component>.css <container>.css
```

Resolve any token values via Rule Z. Reproduce overrides in your local CSS — use `!important` for padding and other properties that Easel's runtime-injected shorthand would otherwise override:

```css
/* !important needed: Easel injects CSS at runtime; its padding shorthand wins at equal specificity */
.<localClass > {
  padding-left: 12px !important;
  padding-right: 12px !important;
}
.<localClass > span {
  font-weight: 500 !important; /* from context CSS: fontWeight500 resolved via Rule Z */
  font-variation-settings: 'opsz' 0 !important; /* fvs set by context CSS (menu_bar, auth_buttons, etc.) */
  -webkit-font-smoothing: antialiased !important; /* from composes: textBoldMedium — ALWAYS required */
  -moz-osx-font-smoothing: grayscale !important; /* without this, text renders heavier on macOS */
}
```

#### W.5 — Measurement script

Run on both prototype and real page, compare every value:

```javascript
// Use text content to find the right button (avoids matching wrong elements)
const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Design');
const span = btn?.querySelector('span');
const spanCs = window.getComputedStyle(span);
const btnCs = window.getComputedStyle(btn);
console.log({
  // Span (where text styling lives):
  spanFW: spanCs.fontWeight,
  spanVariation: spanCs.fontVariationSettings,
  spanSmoothing: spanCs.webkitFontSmoothing,
  spanSize: spanCs.fontSize,
  spanLineHeight: spanCs.lineHeight,
  spanColor: spanCs.color,
  // Button (background/border/padding):
  bg: btnCs.backgroundColor,
  border: btnCs.borderColor,
  borderWidth: btnCs.borderWidth,
  padding: btnCs.paddingLeft,
});
```

---

### Rule P — Read every Easel component's own CSS before writing overrides.

Rules X and W describe what to do once you've found the right values. This rule is about finding them in the first place.

**Treat Easel components as readable source, not black boxes.** When you use `<NeutralButton>`, `<Button>`, `<Title>`, `<Avatar>` etc., their CSS files are in the monorepo and contain the authoritative values for font-weight, border-radius, padding, height, and every other property they set. Not reading them means you only discover mismatches visually — which is unreliable for subtle differences like `font-weight: 400 vs 600` or `border-radius: 8px vs 16px`.

**For each Easel component used in an extraction, read its CSS file before writing any local overrides:**

| Component                               | File to read                                 |
| --------------------------------------- | -------------------------------------------- |
| `Button`, `NeutralButton`, `ButtonLink` | `ui/base/button/private/button.css`          |
| `Title`, `Text`, `InheritColor`         | `ui/base/typography/internal/typography.css` |
| `Box`                                   | `ui/base/box/private/box.css`                |
| `Avatar`                                | `ui/base/avatar/private/avatar.css`          |
| `CardImageThumbnail`                    | `ui/base/card/private/card.css`              |

From each file, extract two things:

1. **`composes:` directives** → trace the full chain via Rule X → add the resulting properties explicitly in your local CSS (since cross-file composes doesn't resolve in the prototype pipeline)
2. **Size/variant system values** (border-radius, padding, height) → these are the baseline the component renders in the prototype. If you need to override one, use `!important` (Rule W.4) and match the real compiled value via Rule T — not the token name from source, which may differ.

**The information is always there.** If a computed style in DevTools surprises you, the reason is in one of these files. Read them first and there will be no surprises.

---

### Rule N — Easel layout components change the layout context of their children

Easel's layout primitives (`Box`, `Inline`, `Rows`, `Columns`, `Spacer`) generate specific CSS at runtime. Before using any of them, verify what CSS they produce — because they change the layout context their children live in. This affects centering, stretching, and margin behaviour.

**Critical cases:**

#### N.1 — `Box` is a flex container by default in some configurations

`Box` in Easel renders as a `div`, but depending on props, it may apply `display: flex`, `flex-direction: column`, or other flex properties. **Do not assume `Box` is a plain block element.** If you wrap a child in `Box` and rely on `margin: auto` for centering, verify via DevTools that `Box` isn't setting `display: flex` (which changes how `margin: auto` works on children).

**How to check:** On `localhost:9090`, run:

```javascript
() => {
  const box = document.querySelector('.yourVideoContainerClass');
  return {
    display: window.getComputedStyle(box).display,
    flexDir: window.getComputedStyle(box).flexDirection,
  };
};
```

If `display: flex`, then children need `margin: auto` as a flex child (which works differently) or the parent needs `justify-content: center`. Match exactly what the real page shows.

#### N.2 — `Inline` turns its children into flex items

`Inline` renders as a flex container with `flex-direction: row`. Its direct children become flex items. A child that was `display: block` with `margin: auto` for centering will no longer center that way — it becomes a flex item in a flex row.

#### N.3 — Wrapping a `Box` in `Inline` or `Columns` changes its centering

If the monorepo wraps a video `Box` in just a `<div>` (block container), then `margin: auto` on the Box centers it. But if you wrap it in `<Inline>` or `<Columns>`, the Box becomes a flex item and `margin: auto` behaves differently (stretches to fill, or requires `align-self`).

**Procedure:** For every Easel layout component used in the extraction:

1. Run the Step 4 measurement script to get its computed `display`, `flexDirection`, `alignItems`, `justifyContent` on `localhost:9090`
2. Reproduce those exact values in your prototype layout

#### N.4 — Read the Easel component's own CSS before writing overrides (Rule P integration)

As part of Step 1 in the CSS audit (collecting every file in the chain), **stop at each Easel primitive** and read its CSS file from the table in Rule P. Do this inline — not as an afterthought. Add a row to the audit table for each Easel component used.

#### N.5 — `Box` `reset` class overrides `margin: auto` — ALWAYS use plain `<div>` for centering

`Box` applies a `reset_xxx` Easel class that sets `margin: 0` (via a `margin: 0px` shorthand). This **overrides** `margin: auto` set in your CSS module class, even at equal CSS specificity, because the reset class is declared later in the stylesheet.

**Symptom**: Your `.video { margin: auto; width: 72vw }` has no effect — element stays flush-left.
**Cause**: Easel Box appends `reset_xxx` which declares `margin: 0px` after your class.
**Fix**: Replace `<Box className={styles.video}>` with `<div className={styles.video}>`.

This is confirmed via DevTools: `getComputedStyle(boxEl).marginLeft === "0px"` even though CSS says `auto`, and the element is not centered.

Note: `getComputedStyle().marginLeft` can also return "0px" when `margin: auto` IS working (Chrome quirk). To verify centering, check the actual `getBoundingClientRect().left` value against the expected centered position.

---

### Rule A -- No `@value ... from "..."` in prototype `.module.css` files

When you copy a monorepo `.css` file into the prototype as a `.module.css` file, you MUST:

1. Remove ALL `@value name from "path"` import lines
2. Inline their resolved values directly as `@value name: <resolved-value>`

**Why this matters:** The prototype's PostCSS pipeline (`postcss.config.cjs`) runs `postcss-modules-values-replace` to resolve `@value` imports, then `strip-value-imports` to remove the leftover `@value ... from` declarations. But Vite's internal CSS Modules loader (`postcss-modules` `FileSystemLoader`) runs _before_ the strip plugin can act, tries to resolve the `ui/...` paths itself, cannot find them (no aliases in that resolver), and crashes with `"PostCSS received undefined instead of CSS string"`.

The `strip-value-imports` plugin in `postcss.config.cjs` provides a safety net, but prototype CSS files should inline values rather than import them for clarity and correctness.

**How to inline -- the token lookup chain:**

Start at the `@value` import source and follow re-exports until you reach a concrete value.

Common values you will encounter (memorize these):

```
# From ui/base/metrics/metrics.css
baseUnit             = 8px
baseUnitInRem        = calc(8 * var(--pxInRem, 0.1rem))   [use 0.8rem in practice]
pxInRem              = var(--pxInRem, 0.1rem)
smallBreakpoint      = 600px
mediumBreakpoint     = 900px
largeBreakpoint      = 1200px
xLargeBreakpoint     = 1650px
smallUp              = (min-width: 600px)
mediumUp             = (min-width: 900px)
largeUp              = (min-width: 1200px)
xLargeUp             = (min-width: 1650px)
belowSmall           = (max-width: 599px)

# From ui/base/theme/theme.css
themeLight           = :global(.light)
themeDark            = :global(.dark)

# From ui/nav/redesign/portable/header/header.css
contentHeight        = calc(10 * 8px)    [= 80px]

# From shared/design_system/tokens.css (nav)
maxContainerWidth    = 1920px   ← NOT 1440px — use this for header max-width

# Header inner padding (header.tsx paddingX prop + header.css xLargeUp override)
default:  3u = 24px  |  ≥900px: 4u = 32px  |  ≥1200px: 6u = 48px  |  ≥1650px: space800 = 64px

# From pages/anon_home/ui/metrics/metrics.css
maxPageWidth                  = 2560px
mobilePageHorizontalPadding   = calc(8px * 3)    [= 24px]
tabletPageHorizontalPadding   = calc(8px * 6)    [= 48px]
pageHorizontalPadding         = calc(8px * 4)    [= 32px]
```

For color tokens (e.g. `colorControlBorder`, `colorBlackA10`, `colorWhiteA10`): these resolve to CSS custom properties set in `theme-tokens.css`. The token name maps to a `--tokenName` CSS variable. When inlining, keep the `@value` form but set it to the resolved value. For tokens used in property values, the PostCSS pipeline resolves them. For tokens used in selectors (like `themeLight`, `themeDark`), inline as shown above.

**Example transformation:**

Monorepo CSS:

```css
@value baseUnit, largeUp from "ui/base/metrics/metrics.css";
@value colorControlBorder from "ui/base/tokens/color.css";

.button {
  padding: calc(2 * baseUnit);
  border: 1px solid colorControlBorder;
}

@media largeUp {
  .button {
    padding: calc(3 * baseUnit);
  }
}
```

Prototype `.module.css`:

```css
@value baseUnit: 8px;
@value largeUp: (min-width: 1200px);
@value colorControlBorder from "ui/base/tokens/color.css";

.button {
  padding: calc(2 * baseUnit);
  border: 1px solid colorControlBorder;
}

@media largeUp {
  .button {
    padding: calc(3 * baseUnit);
  }
}
```

Note: `@value X from "ui/base/..."` and `@value X from "base/..."` paths ARE resolvable by the PostCSS pipeline (it has aliases for `ui/` and `base/`). These can technically be left in place because `strip-value-imports` will clean them up. However, `@value X from "pages/..."` paths are NOT aliased and WILL crash. Always inline those. For consistency and safety, prefer inlining everything.

### Rule B -- CSS imported from prototype TSX must be local `.module.css`

The `canva-monorepo-css` Vite plugin only intercepts CSS imports where the **importer** file is inside `canvaWebSrc` (the monorepo directory). When a prototype `.tsx` file imports monorepo CSS (e.g. `import styles from 'ui/authenticating/recent_user_card/recent_user_card.css'`), Vite processes it as a plain CSS file with no default export, causing a crash: `"does not provide an export named 'default'"`.

**Fix:** Copy the monorepo CSS locally into the prototype page directory as `<name>.module.css`. Apply Rule A to all `@value` imports. Import it from the prototype TSX as `import styles from './<name>.module.css'`.

### Rule E -- `navContentHeight` must match the actual header height

The monorepo CSS uses `navContentHeight` from `ui/nav/redesign/portable/header/header.css` (value: `calc(10 * baseUnit)` = 80px). This powers the gradient trick:

```css
.container {
  min-height: calc(100vh - navContentHeight);
}
.internalGradientBackground {
  height: calc(100% + navContentHeight);
  top: calc(-1 * navContentHeight);
}
```

This extends the gradient BEHIND the transparent header. If you inline `navContentHeight: 0px` thinking "the prototype has no nav", the gradient stays below the header and white space appears above it.

**If the page has a header:** inline `navContentHeight` as `80px` (or `calc(10 * 8px)`).
**If the page truly has no header:** inline as `0px`.

### Rule Q — Known structural differences: check these for every extraction

The prototype and monorepo differ structurally in ways that are **fixed and known** — they do not vary per-extraction. The recurring problem is that these differences are discovered reactively (after a visual mismatch) rather than checked proactively at the start. This rule is a mandatory pre-flight checklist: evaluate each item before writing any layout code.

#### The fixed structural differences

| #       | Monorepo                                                                                    | Prototype                                                                                                                        | Layout consequence                                                                                                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Q.1** | Nav header is **in-flow** (80px block element). Page container starts at y=80.              | Nav header is `position: absolute`. Page container starts at y=0.                                                                | Any spacing that appears relative to the post-header area (e.g. content top padding, vertically centered regions) must account for the missing 80px. Read how the component positions content relative to the header. |
| **Q.2** | Page wrapped in a shell/route component that may set `padding`, `max-width`, or `overflow`. | No page shell. Component renders directly in the route.                                                                          | Horizontal or vertical padding that the monorepo shell provides must be explicitly added in the prototype, or omitted intentionally.                                                                                  |
| **Q.3** | CSS Modules cross-file `composes:` resolves at build time.                                  | Cross-file `composes:` does NOT resolve. Missing properties (font-weight, font-variation-settings, etc.) must be added manually. | See Rules W and X.                                                                                                                                                                                                    |

#### How to use this checklist

For each extraction, before writing any layout code:

1. Read the component's TSX to find every layout-relevant prop (`justifyContent`, `padding`, `min-height`, `position`, etc.)
2. For each one, ask: _does this value assume the monorepo's page structure (Q.1, Q.2)?_
3. If yes: adjust for the prototype's structure. The correct value is derivable from the monorepo code — you should not need to measure to find it, only to verify afterwards.

**Example (Q.1 applied):** Monorepo source has `justifyContent="center"` on a `min-height: calc(100vh - 80px)` container. In the monorepo this container starts at y=80 (header in-flow), so centering places content at y≈144. In the prototype the container starts at y=0 — same centering would place content at y≈64. The fix is readable from the code: instead of centering, add `padding-top` equal to the header height plus the desired gap.

---

### Rule F -- `pages/` alias does NOT exist in PostCSS

`postcss.config.cjs` only defines aliases for `ui/`, `base/`, `~ui/`, `~base/`. Any `@value ... from "pages/..."` path in monorepo CSS MUST be manually inlined. There is no alias to resolve it.

### 2.1 CSS transformation procedure

For each monorepo `.css` file that will be used by prototype TSX:

1. Copy to prototype page directory as `<name>.module.css`
2. Find every `@value X from "path"` line
3. For each: look up the value at its source. If the source re-exports from another file, follow the chain.
4. Replace the `@value X from "path"` line with `@value X: <resolved-value>`
5. Exception: `@value X from "ui/base/tokens/color.css"` or `"ui/base/tokens/primitive/color.css"` can be left as-is (the PostCSS pipeline resolves these via alias), but if you inline them it also works.
6. For `themeLight` / `themeDark` used as selectors: inline as `:global(.light)` / `:global(.dark)`
7. Check for `navContentHeight` -- apply Rule E

### 2.2 Gradient background patterns

The monorepo gradient uses width based on page padding:

```css
width: calc(100% + 2 * mobilePageHorizontalPadding);
```

The prototype has no page padding wrapper. Replace with:

```css
width: 100vw;
left: 50%;
transform: translateX(-50%);
```

This makes the gradient full-bleed regardless of parent width.

---

## Phase 3 -- TSX Extraction

### 3.1 Strip monorepo-specific code

Remove or replace:

| Monorepo pattern                                         | Prototype replacement                                                                                                                    |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `import { Messages } from './component.messages'`        | Inline the string literals. Read the `.messages.ts` file to get them.                                                                    |
| `import type { SomeProto } from 'services/...'`          | Define a simple local TypeScript type or use inline types.                                                                               |
| `useAppContext()`, `useSidebarVisible()`, other DI hooks | Remove. Use simple React state or static values.                                                                                         |
| `useResponsiveValue({...})`                              | Either pick a single value or use CSS media queries instead.                                                                             |
| `useScaledFallbackFontStyles({...})`                     | Remove entirely. It returns spread props for font scaling that are not needed in the prototype.                                          |
| `loading={requestState === 'loading'}`                   | Remove loading prop or set to `false`.                                                                                                   |
| `doNotRecordClassName`                                   | Remove.                                                                                                                                  |
| MobX `@observable`, `@action`, `makeAutoObservable`      | Replace with React `useState`/`useReducer`. The Babel plugin handles MobX in monorepo files, but prototype files should use plain React. |
| Proto types (`AccountSelectorUserProto`)                 | Define a simple mock type inline.                                                                                                        |

### 3.2 Mock data

Create mock data constants at the top of the file:

```tsx
const MOCK_USER = {
  userId: 'user-canva-prototype-123',
  displayName: 'Canv AI',
  email: 'user@example.com',
};
```

Source mock data from the monorepo's `stories/` or `__tests__/` directories when available.

### Rule C -- ThemeBoundary uses render prop pattern

```tsx
// CORRECT:
<ThemeBoundary light="dark" dark="dark" classicLight="dark" classicDark="dark">
  {data => <div className={data.className}>{/* children here */}</div>}
</ThemeBoundary>
```

`ThemeBoundary` does NOT accept JSX children directly. It uses a render prop (function as child). The `data.className` MUST be applied to the immediate child element -- this is what adds the theme class (`.light` or `.dark`) that activates the correct CSS custom property values.

All four appearance props (`light`, `dark`, `classicLight`, `classicDark`) should be set to the desired appearance for that boundary.

### 3.3 Easel component imports

These work directly via Vite aliases -- no changes needed:

```tsx
import { Box } from 'ui/base/box/box';
import { Button, NeutralButton } from 'ui/base/button/button';
import { Avatar } from 'ui/base/avatar/avatar';
import { ThemeBoundary } from 'ui/base/theme/theme';
import { InheritColor, Text, Title } from 'ui/base/typography/typography';
import { Column, Columns, Rows, Spacer, Inline } from 'ui/base/layout/layout';
import { PlusIcon } from 'ui/base/icons/plus/icon';
import { CanvaLogo } from 'ui/base/logo/logo';
```

Some monorepo UI components outside `ui/base/*` also work via the `ui/` alias. Test each import — if a component pulls in too many monorepo dependencies (DI, services, stores), replicate it locally instead.

### 3.4 Navigation

Use `react-router-dom` for navigation:

```tsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
// onClick={() => navigate('/')}
```

### 3.5 Source comments

Add a comment at the top of each extracted file documenting its monorepo origin:

```tsx
// Prototype extracted from:
//   pages/<section>/<component>/<component>.tsx
//   ui/<subsystem>/<subcomponent>/<subcomponent>.tsx
```

---

## Phase 4 -- Assets

### Rule G -- Filesystem access boundaries

Vite's `server.fs.allow` permits access to:

- `.` (the prototype directory)
- `../canva/web` (the monorepo)

Assets inside `../canva/web/src` can be imported by monorepo TSX files that are loaded via the Vite alias. But prototype TSX files should NOT import assets by monorepo path, since the `canva-monorepo-css` plugin and its asset handling only activate for monorepo importers.

**For assets referenced by prototype TSX files:**

1. Check if the asset lives under `../canva/web/src`. If yes, copy it into `src/pages/<PageName>/assets/`.
2. Assets from `../canva_strip/web` or any other path outside the fs.allow list MUST be copied locally.
3. PNG/JPG images: copy directly into `assets/` subfolder.
4. SVG files: if imported as React components, ensure `vite-plugin-svgr` can handle them (it should). If imported as URLs (e.g. for `<img src=...>`), copy directly.
5. `.inline.svg` files: the `canva-inline-svg` plugin converts these to string exports with `currentColor` substitution. Copy locally and import as-is.

**Asset import pattern in prototype:**

```tsx
import aiMedia from './assets/ai-media.png';
// Used as: <img src={aiMedia} ... />
```

---

## Phase 5 -- Routing

### 5.1 Add to Root.tsx

Open `src/Root.tsx` and add a route:

```tsx
import NewPage from '@pages/NewPage';
// ...
<Route path="/newpage" element={<NewPage />} />;
```

The route goes inside the existing `<Routes>` block, within the `<EaselProvider>` and after `<ApplyThemeRoot>`.

### 5.2 Lazy import (optional)

For large pages, consider `React.lazy`:

```tsx
const NewPage = React.lazy(() => import('@pages/NewPage'));
// Wrap in <Suspense> in the route
```

---

## Phase 6 -- Verification Checklist

After extraction, verify each item. Do not skip any.

### 6.1 Build check

- [ ] `npm run dev` starts without errors
- [ ] No "PostCSS received undefined instead of CSS string" (Rule A violation)
- [ ] No "does not provide an export named 'default'" (Rule B violation)
- [ ] No ENOENT errors for CSS `@value` paths (Rule F violation)

### 6.2 Visual check

- [ ] Navigate to the route in the browser
- [ ] ThemeBoundary text is visible (not invisible-on-invisible). If using dark theme boundary over a gradient, white text should appear. If text is invisible, `data.className` is missing or ThemeBoundary is not render-prop.
- [ ] Gradient extends behind header (no white bar above gradient). If white bar exists, check `navContentHeight` (Rule E).
- [ ] Typography uses Canva Sans (not Times New Roman). If wrong, `src/style.css` body font-family is being overridden.
- [ ] Responsive breakpoints work: resize browser through small/medium/large/xLarge to verify media queries fire.
- [ ] **For every Easel Button**: run the Rule W.2 measurement script on both prototype and real page. Compare `span` values (font-weight, font-variation-settings, font-size). Do NOT compare the button element itself — it will show UA defaults (Arial/400) on both pages and that is normal.

### 6.4 ⛔ MANDATORY: Side-by-side computed style comparison

**Do not mark the extraction complete without running this step.** After the prototype is rendering, run the Step 4 measurement script on **both** `localhost:9090` and `localhost:5173` using Chrome MCP `evaluate_script` (switch pages between runs). Diff every value in the output. Any mismatch is a bug.

Run the same script on both pages:

```javascript
() => {
  const measure = el => {
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      marginLeft: cs.marginLeft,
      marginRight: cs.marginRight,
      borderRadius: cs.borderRadius,
      display: cs.display,
      fontVariationSettings: cs.fontVariationSettings,
    };
  };
  // Adapt these selectors to what the component renders:
  const title = document.querySelector('h1 span');
  const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim().length > 3);
  const btnSpan = btn?.querySelector('span');
  return {
    title: measure(title),
    btn: measure(btn),
    btnSpan: measure(btnSpan),
  };
};
```

Any difference in font-size, font-weight, border-radius, width, or padding between `:9090` and `:5173` must be fixed. **Do not accept "close enough" — the values must match.**

### 6.3 Structural check

- [ ] No monorepo service/DI/proto imports remain in prototype files
- [ ] No `@value X from "pages/..."` lines in any `.module.css` file (Rule F)
- [ ] All CSS files imported by prototype TSX are `.module.css` (Rule B)
- [ ] Mock data is realistic (check monorepo stories/tests for examples)
- [ ] Source comments document the monorepo origin

---

### Rule K — `<Text tagName="X">` IS the element; never use `.className child` selectors

When a component uses `<Text tagName="span" className={styles.foo}>`, the `Text` component renders AS the `<span>` element — it does NOT create a wrapper with a child span inside. The resulting DOM is:

```html
<span class="textLarge foo">content</span>
```

**Wrong selector (matches nothing):**

```css
.foo span {
  font-weight: 500;
} /* ← .foo IS the span, no inner span */
```

**Correct selector:**

```css
.foo {
  font-weight: 500 !important;
} /* ← target .foo directly */
```

**This applies to all `tagName` overrides:** `<Text tagName="div">`, `<Text tagName="p">`, `<Title tagName="h2">`, etc. The component renders AS that tag — it does not wrap it.

**When does `.foo > span` work?** Only when the Easel component itself creates an inner span wrapping its children (e.g. `<Button>` wraps its text in `<span class="content">`). Always check the rendered DOM structure before writing child selectors.

**Root cause of this bug:** The monorepo CSS uses `menu_item.css .label.weight500 span { font-weight: 500 }` because that CSS was written before `tagName` was used. The prototype uses `<Text tagName="span">` which means the selector no longer matches. Read the TSX to understand the actual rendered structure, not just the CSS.

---

### Rule J — Nav menus open on hover (mouseenter), not click

The Canva header nav flyout (`menu_bar.tsx`) opens on `onMouseEnter`, not `onClick`. The flyout:

- **Opens**: `onMouseEnter` on a nav button → set `openMenu` state + capture `getBoundingClientRect()`
- **Slides**: CSS `transition: left 300ms cubic-bezier(0.68,0,0.23,1)` enabled after first paint (via `requestAnimationFrame` → `positioned` state)
- **Closes on**: outside `pointerdown` (document listener, exclude flyout and nav buttons), `Escape` key, window `scroll`
- **Does NOT close on**: mouseLeave from the nav button or flyout

**isInitialOpen tracking:** When the flyout opens from a fully closed state, `isInitialOpen = true`. This controls whether items animate with a stagger (initial open) or a simple fade (menu switch). Track this by checking `openMenu === null` before updating state.

**Key pattern:**

```tsx
const handleNavHover = (item: string, e: React.MouseEvent<HTMLButtonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setIsInitialOpen(openMenu === null); // true only from closed state
  setOpenMenu(item);
  setAnchorRect(rect);
};
```

**Animation tokens** (from `flyout.css` / `shared/design_system/tokens.css`):

```
duration01 = 100ms  |  duration03 = 200ms  |  duration05 = 300ms  |  duration07 = 400ms
emphasised = cubic-bezier(0.68, 0, 0.23, 1)
emphasisedDecelerate = cubic-bezier(0, 0, 0.13, 1)
```

**Flyout animations:**

- `surfaceExpand`: height 279px→385px, 300ms emphasisedDecelerate, fires on mount
- Item stagger (initial open): 400ms emphasisedDecelerate, `calc(var(--itemIndex) * 25ms)` delay
- Menu switch (slide): 200ms emphasised fadeIn, triggered by `key={menuKey}` forcing remount

---

### Rule L — Inline SVG icons may have large intrinsic sizes; always constrain in containers

Some Easel icons import `.inline.svg` files with large intrinsic dimensions (e.g. `social_tik_tok` is 512×512, while most others are 24×24). When an icon is rendered inside a fixed-size button or container, the SVG will overflow unless explicitly constrained.

**Always add a CSS rule for any element that contains icon components:**

```css
.iconContainer svg {
  max-width: 20px; /* or whatever the desired icon size is */
  max-height: 20px;
  width: 20px;
  height: 20px;
}
```

### Rule L2 — SVG icons inside fixed-size circle containers MUST have centered span wrappers

When an SVG icon (from `dangerouslySetInnerHTML` or an Easel icon component) is rendered inside a fixed-size flex circle container, the immediate `<span>` wrapper will NOT automatically be centered unless it also has flex centering applied. The parent container's `align-items: center; justify-content: center;` only centers the span WITHIN the circle — it does not center the SVG WITHIN the span.

**Symptom**: Icon appears at top-left of the circle instead of center.

**Root cause**: `<span>` defaults to `display: inline`. Even if switched to `display: flex`, without `align-items: center; justify-content: center;`, the SVG inside may not be centered within the span.

**Required CSS — always add this when rendering SVGs inside a circle container:**

```css
/* Circle container: centers its direct children */
.contentTypeCircle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* The <span> wrapping dangerouslySetInnerHTML SVGs OR Easel icon components
   MUST also have its own flex centering — parent centering alone is not enough */
.contentTypeCircle > span {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

/* Constrain SVG dimensions so they don't overflow the circle */
.contentTypeCircle svg {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
```

This pattern applies to **any** fixed-size container rendering icons: sidebar nav items, chip buttons, avatar circles, etc. Whenever a container renders `<span><svg /></span>`, add `align-items: center; justify-content: center; line-height: 0;` to the span.

**How to diagnose:** If a social or specialty icon appears dramatically larger than expected, run:

```javascript
() =>
  [...document.querySelectorAll('.myContainer svg')].map(svg => ({
    w: svg.getAttribute('width'),
    h: svg.getAttribute('height'),
  }));
```

Any icon with `width` > 64 needs CSS constraining in the prototype.

**Root cause:** The Easel icon system in the monorepo constrains icons via `ButtonLink icon={...} iconSize="medium"` — the ButtonLink internally sizes the icon. In the prototype, plain `<a>` or `<div>` wrappers don't apply this sizing, so the SVG renders at its intrinsic size.

---

### Rule M — Full-page extractions MUST include site header and site footer

The Canva page shell always includes:

1. A **site header** (80px, sticky/absolute) with logo + nav + auth buttons
2. A **site footer** with downloads, nav columns, social icons, and legal section

**Never consider a full-page extraction complete without both.** If either is missing, the page looks broken in comparison with the real site.

#### Header

Source: `ui/nav/redesign/portable/header/` — too service-heavy to import directly. Reconstruct locally using Easel primitives. See `src/pages/SignedOut2/CanvaHeader.tsx` as a reference implementation.

Key specs: 80px height, `position: sticky; top: 0`, `ThemeBoundary light="dark"` for overlay variant, `max-width: 1920px`, responsive padding 24px→32px→48px→64px.

#### Footer

Source: `ui/nav/redesign/portable/footer/` — too service-heavy to import directly. Reconstruct statically with hardcoded data extracted from `localhost:9090` DOM.

**Footer structure** (from `footer.tsx`):

```
<footer> flex, justify-center, bg: linear-gradient(transparent, #f6f7f8)
  container (max-width: 1920px)
    content (paddingX: 0→24px→48px→64px)
      logo row (80×30px wrapper — see Rule U)
      nav row:
        downloads column (width 271px @largeUp, 400px @xLargeUp)
          tagline: "Download Canva for free" (fw500)
          buttons: Windows, Mac (ButtonLink variant="secondary")
        masonry nav (column-count 3→4, column-gap 16px)
          7 columns: Product, About, Plans, Inspiration, Help, Tools, Community
    addendum (border-top, paddingX: 0→32px→48px→64px, paddingTop 24px @900px)
      social icons (LinkedIn, Instagram, Facebook, TikTok, Pinterest, X, YouTube)
      legal (Privacy Policy, Terms of Use, © year Canva)
```

**Data extraction from live page:**

```javascript
() => {
  const footer = document.querySelector('footer');
  const cols = [...footer.querySelectorAll('nav li > ul li')];
  return { tagline: footer.querySelector('h2')?.textContent };
};
```

**CanvaLogo in footer**: always wrap in a `80px × 30px` container (see Rule U — `img { width:100%; height:100% }` fills parent otherwise).

**Social icon constraint**: always add `svg { max-width: 20px; max-height: 20px }` to social button class (Rule L — some SVGs are 512×512).

---

### Rule O — Implement scroll-aware header behaviors: variant switching, bg fade, and collapse

The Canva header has three interactive scroll behaviors sourced from `ui/nav/redesign/portable/header/`:

#### O.1 — Variant system (header.tsx `VariantProvider`)

The header starts in an **initial variant** and switches to `standard` the moment `scrollY > 0`:

| Variant         | Background  | ThemeBoundary   | Login button                   | Logo                |
| --------------- | ----------- | --------------- | ------------------------------ | ------------------- |
| `overlay`       | transparent | `light="dark"`  | `NeutralButton primary` (dark) | `CanvaLogoWhite`    |
| `overlay-light` | transparent | `light="light"` | `Button primary` (purple)      | `CanvaLogo` (color) |
| `standard`      | `#ffffff`   | `light="light"` | `Button primary` (purple)      | `CanvaLogo` (color) |

**Page-specific initial variants:**

- AnonHome: `overlay` — dark ThemeBoundary, white buttons, CanvaLogoWhite
- Download pages (Mac, Windows, etc.): `overlay-light` — light ThemeBoundary, purple Log In, CanvaLogo
- App-shell pages: `standard` always

**Key insight for `overlay-light`**: The only change on scroll is the background color fade. Logo, ThemeBoundary, and auth buttons do NOT change — `overlay-light` and `standard` use the same light theme. Only `overlay → standard` requires logo/button/ThemeBoundary switching.

#### O.2 — Background color fade (header.css `.background`)

```css
.background {
  background-color: transparent; /* initial: overlay / overlay-light */
  transition: background-color 200ms cubic-bezier(0.68, 0, 0.23, 1); /* duration03, emphasised */
}
.background.scrolled {
  background-color: #ffffff; /* standard: elevationSurfaceBg light */
}
```

Apply `.scrolled` class when `scrollY > 0` (`isScrollTop === false`).

#### O.3 — CollapseOnScroll (collapse_on_scroll.tsx / collapse_on_scroll.css)

Header slides off-screen when scrolling **down** more than 40px, and re-appears when scrolling **up**.

```
COLLAPSE_AFTER_SCROLL_DOWN_PX = 40
```

**CSS (from collapse_on_scroll.css):**

```css
/* The sticky header itself acts as the bounding box — needs overflow:hidden to clip the transform */
.header {
  position: sticky;
  top: 0;
  z-index: 1;
  overflow: hidden; /* clips translateY(-100%) of collapseContent */
}

/* Inner div that slides. No transition initially (avoids page-load animation). */
.collapseContent {
  /* no transition */
}
/* .animated added after first scroll event — matches monorepo's canOverrideVariant pattern */
.collapseContent.animated {
  transition: transform 200ms cubic-bezier(0.68, 0, 0.23, 1);
}
.collapseContent.collapsed {
  transform: translateY(-100%);
}
```

**React state (useEffect with empty deps, refs for non-reactive values):**

```tsx
const COLLAPSE_THRESHOLD = 40;

const [isScrollTop, setIsScrollTop] = React.useState(true);
const [isExpanded, setIsExpanded] = React.useState(true);
const [hasScrolled, setHasScrolled] = React.useState(false);
const hasScrolledRef = React.useRef(false);
const lastScrollY = React.useRef(0);

React.useEffect(() => {
  const onScroll = () => {
    const y = window.scrollY;
    const prevY = lastScrollY.current;

    // Add transition class on first scroll (avoid page-load animation)
    if (!hasScrolledRef.current) {
      hasScrolledRef.current = true;
      setHasScrolled(true);
    }

    // Collapse when scrolling down past threshold; expand when scrolling up
    if (y > prevY && y > COLLAPSE_THRESHOLD) {
      setIsExpanded(false);
    } else if (y < prevY) {
      setIsExpanded(true);
    }

    setIsScrollTop(y === 0);
    lastScrollY.current = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []); // empty deps — uses refs to avoid re-subscription

// Build CSS class strings:
const collapseClass = [
  styles.collapseContent,
  hasScrolled ? styles.animated : '',
  !isExpanded ? styles.collapsed : '',
]
  .filter(Boolean)
  .join(' ');

const bgClass = [styles.background, !isScrollTop ? styles.scrolled : ''].filter(Boolean).join(' ');
```

**JSX structure:**

```tsx
<header className={styles.header}>           {/* sticky + overflow:hidden */}
  <div className={collapseClass}>            {/* slides up/down */}
    <div className={bgClass}>               {/* bg color fades */}
      <div className={styles.content}>      {/* logo + nav + auth */}
        ...
      </div>
    </div>
  </div>
  {/* Flyout renders outside collapse wrapper so it isn't clipped */}
  {openMenu && anchorRect && <NavFlyout ... />}
</header>
```

#### O.4 — Dynamic elements for `overlay` variant only

When `initialVariant === 'overlay'` (e.g. AnonHome), also switch ThemeBoundary, logo, and login button:

```tsx
const isOverlay = isScrollTop; // overlay mode only when at top

// ThemeBoundary:
<ThemeBoundary
  light={isOverlay ? 'dark' : 'light'}
  dark="dark"
  classicLight={isOverlay ? 'dark' : 'light'}
  classicDark="dark"
>
  {data => <div className={data.className}>...</div>}
</ThemeBoundary>;

// Logo:
{
  isOverlay ? <CanvaLogoWhite /> : <CanvaLogo />;
}

// Login button:
{
  isOverlay ? (
    <NeutralButton variant="primary" size="small">
      Log in
    </NeutralButton>
  ) : (
    <Button variant="primary" size="small">
      Log in
    </Button>
  );
}
```

For `overlay-light` pages (download pages), none of this switching is needed — always use `CanvaLogo`, light ThemeBoundary, and `Button variant="primary"` for Log in.

---

## Quick-Reference: What Works Via Alias vs. What Needs Copying

### Works via Vite alias (import directly in prototype TSX)

- `ui/base/*` -- all Easel components
- `ui/authenticating/*` -- some auth UI components (test each; if DI-heavy, replicate locally)
- `base/*` -- base utilities

### Must be copied/replicated locally

- Any `.css` file imported by prototype TSX (Rule B) -- copy as `.module.css`
- Any `.messages.ts` file -- inline the strings
- Any component that depends on `services/*`, MobX stores, proto types
- Any asset from outside `../canva/web` (Rule G)
- `pages/*` CSS values (Rule F) -- no PostCSS alias exists

### PostCSS `@value` resolution

- `@value X from "ui/..."` -- resolvable by PostCSS pipeline (alias exists)
- `@value X from "base/..."` -- resolvable
- `@value X from "pages/..."` -- NOT resolvable (no alias). MUST inline.
- `@value X from "./local.css"` -- resolvable (relative path)

---

## Rule DC — Design Creation Shortcut Buttons: always use visual-suite icons, not generic Easel icons

The Home page shortcut carousel (the row of category buttons — Presentation, Social Media, Video, etc.) uses a **custom icon system** distinct from the generic `ui/base/icons/` Easel icons. Using generic Easel icons (e.g. `<PresentIcon>`, `<VideoIcon>`, `<DocumentIcon>`) is **always wrong** for these buttons. The icons look different and the colored circle system will not function.

### Source files

| File                                                                          | Purpose                                       |
| ----------------------------------------------------------------------------- | --------------------------------------------- |
| `ui/design_creation/design_spec_icon/icons/visual_suite/1color/*.inline.svg`  | The actual SVG icons (one per category)       |
| `ui/design_creation/design_spec_icon/design_creation_shortcut_icon_color.css` | CSS custom properties for the colored circles |
| `ui/design_creation/shortcut/design_creation_shortcut.css`                    | Layout and sizing of the circle container     |
| `ui/design_creation/design_spec_icon/design_spec_group_type_icons.tsx`        | How icons are imported and injected           |

### Icon files (visual suite 1-color set)

All files live in `ui/design_creation/design_spec_icon/icons/visual_suite/1color/`. The SVGs have `fill="#191E26"` which the prototype's `canva-inline-svg` Vite plugin converts to `fill="currentColor"`, allowing CSS `color` to control icon color.

| Category       | SVG file                                                |
| -------------- | ------------------------------------------------------- |
| Presentation   | `icon_presentation.inline.svg`                          |
| Social Media   | `icon_social.inline.svg`                                |
| Video          | `icon_video.inline.svg`                                 |
| Print          | `icon_print.inline.svg` or `icon_print_shop.inline.svg` |
| Doc / Document | `icon_docs.inline.svg`                                  |
| Whiteboard     | `icon_whiteboard.inline.svg`                            |
| Sheets         | `icon_sheets.inline.svg`                                |
| Interactive    | `icon_interactive.inline.svg`                           |
| Websites       | `icon_websites.inline.svg`                              |
| Email          | `icon_email.inline.svg`                                 |
| More           | `icon_more.inline.svg`                                  |
| Education      | `icon_edu.inline.svg` or `icon_learn_grid.inline.svg`   |

These are imported in the monorepo as strings (`.inline.svg` imports) and injected via `dangerouslySetInnerHTML={{ __html: svg }}`. The prototype can import them the same way — the `canva-inline-svg` plugin handles `.inline.svg` exports.

### The "sprite sheet" — hover animation

The user-visible "sprite sheet" is actually a **PNG sprite sheet** (`animated_sprite_sheet.0.5x.png` / `animated_sprite_sheet.1x.png`) used for the hover animation state. It lives in `ui/design_creation/shortcut/hover_animated_icon/assets/`. Each row corresponds to one icon type. The sprite sheet animates on hover showing a slight motion/bounce effect.

**In the prototype**: the hover animation sprite sheet is complex to replicate. An acceptable simplification is:

- Show the static icon (the `.inline.svg`) always
- On hover, apply a `transform: scale(1.05)` to the circle (which is what `.hoverTrigger:hover .thumbnailCircle` does anyway)
- Skip the full sprite sheet animation — the visual difference is minimal at a glance

If full fidelity is required: copy the sprite sheet PNG files to `assets/` and implement the state machine from `short_hover_animated_icon.tsx`.

### Color system

The colored circles use CSS custom properties defined in `design_creation_shortcut_icon_color.css`. Two custom properties control each circle:

- `--quickCreateIconPrimaryColor` → the circle background color (for visual suite variant)
- `--quickCreateIconSecondaryColor` → lighter tint (not used for visual suite circle background directly)

**Resolved values per category** (from `design_creation_shortcut_icon_color.css`):

```
colorPresentation:  primary=#FF6105  secondary=#FFF4CE
colorSocial:        primary=#FF3B4B  secondary=#FEE5E6
colorVideo:         primary=#E950F7  secondary=#F9D9FF
colorPrint:         primary=#992BFF  secondary=#EAD4FF
colorDoc:           primary=#13A3B5  secondary=#D5FAFF
colorWhiteboard:    primary=#0BA84A  secondary=#D2FBE6
colorSheet:         primary=#138EFF  secondary=#C5E2FF
colorInteractive:   primary=#A21CAF  secondary=#F1DDF3
colorWebsite:       primary=#4A53FA  secondary=#D9DBFF
colorEmail:         primary=#5334EB  secondary=#FFFFFF
colorMore:          primary=#6453D0  secondary=#F2F3F5
colorUpload:        primary=#0D1216  secondary=#F2F3F5  (icon is dark on gray circle)
colorCustomSize:    primary=#0D1216  secondary=#F2F3F5  (icon is dark on gray circle)
colorPhotoEditor:   primary=#F61394  secondary=#F9D9FF
colorPhoto:         primary=#FF339C  secondary=#F9D9FF
```

### Visual structure

The shortcut button is:

```
div.container (hover trigger)
  a.card (BasicButtonLink)
    Rows (center aligned, gap="1u")
      div.thumbnailContainer (48×48px, position:relative, flex center)
        div.thumbnailCircle (position:absolute, 100%×100%, borderRadius:9999px, bg=primaryColor)
        span (dangerouslySetInnerHTML — SVG icon, 32×32, color=white)
      div.labelContainer (width=80px, min-height=40px)
        TruncatedText (label, weight=bold, size=xsmall/small)
        div.visibleOnHover (subtitle, opacity 0→1 on hover)
```

**Key CSS values** (all derived from `design_creation_shortcut.css` with `baseUnit=8px`):

```css
/* Circle container (size="medium" = default) */
.thumbnailContainer {
  width: 48px; /* defaultQuickCreateIconWidth = calc(8px * 6) */
  height: 48px;
  position: relative;
  margin-top: 2px; /* space for scale-up hover animation */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* The colored circle (background) */
.thumbnailCircle {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  border-radius: 9999px; /* elementRound */
  background: <primaryColor>; /* from CSS custom prop */
  transition: transform 0.3s ease;
}
.container:hover .thumbnailCircle {
  transform: scale(1.05);
}

/* Icon color — variantVisualSuite = white icon on colored circle */
.thumbnailContainer {
  color: #ffffff; /* colorWhiteA10 = #FFFFFF in the Canva token system */
}

/* Override for CUSTOM_SIZE, UPLOAD, MORE — dark icon on gray circle */
.thumbnailContainer.withOverridenColor {
  color: #0d1216; /* quickCreateIconPrimaryColor for those colors */
}

/* Label container */
.labelContainer {
  width: 80px; /* defaultQuickCreateItemWidth = calc(8px * 10) */
  min-height: 40px; /* defaultLabelContainerMinHeight = calc(8px * 5) */
}

/* At mediumUp (≥900px), label width = calc(8px * 11) = 88px */
```

### Prototype implementation pattern

**Step 1: Import icons from the monorepo**

The `.inline.svg` files live in the monorepo and the `canva-inline-svg` Vite plugin handles imports from files within `canvaWebSrc`. Since prototype TSX is NOT inside `canvaWebSrc`, you CANNOT import these `.inline.svg` files directly from prototype TSX files.

**Two valid approaches:**

**Approach A (recommended): Copy the SVG file content inline as string literals**

Read each `.inline.svg` file's text content and store it as a constant in the prototype TSX. The `canva-inline-svg` plugin replaces `fill="#191E26"` with `fill="currentColor"` — do the same manually when copying:

```tsx
// Copy SVG content, replace fill="#191E26" with fill="currentColor"
const PRESENTATION_SVG = `<svg xmlns="..." viewBox="0 0 32 32" ...><path fill="currentColor" .../></svg>`;
const SOCIAL_SVG = `<svg ...>...</svg>`;
```

Then render with:

```tsx
<span dangerouslySetInnerHTML={{ __html: PRESENTATION_SVG }} />
```

**Approach B: Write an intermediate monorepo shim component**

Create a shim file inside `canvaWebSrc` that re-exports the SVG strings. Because shim files INSIDE the monorepo path ARE processed by the `canva-inline-svg` plugin, `.inline.svg` imports work there.

### Color class implementation

In the prototype CSS, replicate the color classes from `design_creation_shortcut_icon_color.css`. These set CSS custom properties consumed by the circle and icon:

```css
/* In your .module.css — add CSS custom property overrides per category */
.circlePresentation {
  background: #ff6105;
}
.circleSocial {
  background: #ff3b4b;
}
.circleVideo {
  background: #e950f7;
}
.circlePrint {
  background: #992bff;
}
.circleDoc {
  background: #13a3b5;
}
.circleWhiteboard {
  background: #0ba84a;
}
.circleSheet {
  background: #138eff;
}
.circleInteractive {
  background: #a21caf;
}
.circleWebsite {
  background: #4a53fa;
}
.circleEmail {
  background: #5334eb;
}
.circleMore {
  background: #6453d0;
}
/* Upload/CustomSize: gray circle with dark icon */
.circleUpload {
  background: #f2f3f5;
}
.circleCustom {
  background: #f2f3f5;
}
```

And the icon color class:

```css
/* Default (visual suite): white icon on colored circle */
.iconColor {
  color: #ffffff;
}
/* Override for dark icon (upload, custom size) */
.iconColorDark {
  color: #0d1216;
}
```

### Thumbnail items (Magic Layers, Photo editor)

Some shortcuts use a **PNG thumbnail image** inside the circle instead of an inline SVG icon:

- **Magic Layers**: `pages/home/design_creation_modal/quick_actions/thumbnails/magic_layers.png`
- **Photo editor**: dynamic (shows user's recent photos). Use the static icon from `ui/design_creation/photo_shortcut/photo_shortcut_icon.svg` with a pink circle (`circleColor: '#FF339C'`). Copy SVG content, replace `fill="white"` with `fill="currentColor"`, store as string constant.

For Magic Layers (no circle background): `color = DesignCreationShortcutIconColor.NONE` — no colored circle background. The PNG thumbnail fills the circle area. Replicate by:

1. Copy the PNG to `src/pages/home/assets/magic_layers.png`
2. Render as `<img src={magicLayersThumbnail} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />`

For Photo editor:

```tsx
const ICON_PHOTO_EDITOR = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" ...>
  <path ... fill="currentColor"/>
  <path fill-rule="evenodd" ... fill="currentColor"/>
</svg>`;
// Use with circleColor='#FF339C', darkIcon=false (white icon on pink circle)
```

**⛔ NEVER use `http://localhost:XXXX/...` or external CDN URLs for thumbnails.** All image assets must be:

1. Imported as Vite assets from `src/pages/<PageName>/assets/` (for PNGs copied from monorepo), OR
2. SVG string constants stored inline in the TSX (for SVG-based icons)

CDN URLs (e.g. `content-management-files.canva.com/...`) are also fragile — they may expire or require auth. Always use local assets.

### Hover behaviors

- **Circle**: `transform: scale(1.05)` on `.container:hover .thumbnailCircle` (from the CSS)
- **Subtitle**: `opacity: 0 → 1` on hover (`.visibleOnHover` class, `transition: opacity hoverTransition`)
- **Icon**: monorepo uses scale-up animation + optional sprite sheet. Prototype: just scale with the circle.

### ⛔ DO NOT use these for shortcut carousel buttons

- `<PresentIcon>` from `ui/base/icons/present/icon`
- `<VideoIcon>` / `<DocumentIcon>` / `<ImageIcon>` from `ui/base/icons/*/icon`
- Any icon from `ui/base/icons/` — these are generic Easel icons with different shapes and sizes
- The `size` prop on Easel icons — the shortcut icons are always 32×32 (enforced by the circle container, not an Easel icon size prop)

### ⛔ DO NOT confuse `variantDesignSpec` with `variantVisualSuite`

The home page shortcut carousel uses **`variantVisualSuite`** for all standard category items. The `variantDesignSpec` variant is used only for server-provided "recommended" items (specific design spec thumbnails from the backend). In `variantDesignSpec`:

- Circle background is the **secondary color** (light pastel), not the primary
- Icon color is the **primary color** (brand color), not white

Always use `variantVisualSuite` for static category shortcuts in the prototype.
