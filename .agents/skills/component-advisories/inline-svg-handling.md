# Advisory: Inline SVG Handling

Load this only when `requiredAdvisories` includes `inlineSvg`.

---

## Why you cannot import `.inline.svg` directly from prototype TSX

The `canva-inline-svg` Vite plugin only activates for files whose **importer** is inside `canvaWebSrc`. A prototype `.tsx` file importing a monorepo `.inline.svg` directly gets the raw file content as a module — `fill` colors are NOT replaced with `currentColor`.

**Wrong:**

```tsx
// ❌ Wrong: importing inline.svg directly
import iconSvg from '../../../canva/web/src/ui/foo/icon.inline.svg';

// ❌ Wrong: substituting a "similar" Easel icon
import { PresentationIcon } from 'ui/base/icons/presentation/icon';
```

---

## Correct procedure

1. Read the `.inline.svg` file content (path is in `inlineSvgAssets[].resolvedPath` from the audit)
2. Replace the `fillToReplace` value (e.g. `fill="#191E26"` or `fill="#FFFFFF"`) with `fill="currentColor"` — globally, all occurrences
3. Store as a string constant in the prototype TSX
4. Render with `dangerouslySetInnerHTML`

```tsx
// ✅ Correct
const ICON_PLAY = `<svg width="32" height="32" viewBox="0 0 32 32">
  <path fill="currentColor" d="M8 5l19 11L8 27V5z"/>
</svg>`;

<span dangerouslySetInnerHTML={{ __html: ICON_PLAY }} />;
```

---

## Finding inline SVG assets

The audit provides `inlineSvgAssets` with resolved paths. If you need to find them manually:

```bash
grep -r "\.inline\.svg" ~/work/canva/web/src/<componentPath>/
```

---

## Size constraints

Inline SVGs rendered via `dangerouslySetInnerHTML` are not constrained by Easel's icon size system. Always add explicit sizing:

```css
.iconWrapper svg {
  width: 32px; /* or whatever size the component uses */
  height: 32px;
  flex-shrink: 0;
}
```

**Inside circle containers** — both the circle and the `<span>` need flex centering:

```css
.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.circle > span {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}
```

---

## When source uses a component-specific icon directory

Some components have their **own** icon directory separate from `ui/base/icons/`. For example, primary nav items use `ui/nav/logged_in_shell/global_nav/primary_nav/primary_nav_item/icons/<name>/icon` — NOT the generic `ui/base/icons/<name>/icon`. The shapes and proportions are different.

Always read `icons.ts` in the component directory to find the exact icon import paths. Never assume the generic base icons apply.

---

## Icon color tracing

Every icon color must be traced through the CSS chain. The audit's `auditTable` provides the resolved `color` value for each icon wrapper. Use that — do not assume `foreground-secondary` or any other token.

If the source CSS uses a local CSS variable (e.g. `--defaultAndHoveredIconColor`) defined in a `themeLight { ... }` block (Rule S pattern), the audit should have resolved this. If not, read the CSS file and resolve the chain:

- Local CSS var → token file → primitive color file

Never leave CSS variables as `var(--something)` in prototype code — always inline the resolved concrete value.
