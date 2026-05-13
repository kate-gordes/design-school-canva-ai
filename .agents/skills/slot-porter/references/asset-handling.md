# Asset Handling Reference

## Rule G — Filesystem access boundaries

Vite's `server.fs.allow` permits:

- `.` (the prototype directory)
- `../canva/web` (the monorepo)

Prototype TSX files should NOT import assets by monorepo path — the `canva-monorepo-css` plugin only activates for monorepo importers.

**For assets referenced by prototype TSX:**

1. If the asset lives under `../canva/web/src` → copy it to `src/pages/<PageName>/assets/`
2. Assets from anywhere outside the fs.allow list → must be copied locally
3. PNG/JPG → copy directly to `assets/` subfolder
4. `.inline.svg` files → see Rule U below (NOT directly importable from prototype TSX)

**Asset import pattern in prototype:**

```tsx
import aiMedia from './assets/ai-media.png';
// Used as: <img src={aiMedia} ... />
```

---

## Inline SVG assets (`.inline.svg`)

The `canva-inline-svg` Vite plugin converts `.inline.svg` imports to string exports with `fill` replaced by `currentColor` — but ONLY for importers inside `canvaWebSrc`. Prototype TSX files importing `.inline.svg` directly get raw file content, not the processed string.

**The audit provides `inlineSvgAssets` with the resolved path and fill value to replace. Use these.**

**Procedure:**

1. Read the `.inline.svg` file content from the path in the audit
2. Replace the `fillToReplace` value (e.g. `fill="#191E26"`) with `fill="currentColor"` globally
3. Store as a string constant in the prototype TSX:
   ```tsx
   const ICON_PLAY = `<svg width="32" height="32" viewBox="0 0 32 32">
     <path fill="currentColor" d="..." />
   </svg>`;
   ```
4. Render with `dangerouslySetInnerHTML`:
   ```tsx
   <span dangerouslySetInnerHTML={{ __html: ICON_PLAY }} />
   ```

**Never substitute a "similar" Easel icon** (`ui/base/icons/*/icon`) for a component-specific `.inline.svg`. The shapes and proportions are different.

---

## Rule I — Easel icon variants: always read the exact size SVG file

When a component uses an Easel icon via `<SomeIcon size="medium">` (or `iconSize="medium"` on a `CircleButton`), the icon component selects a per-size SVG file. **Do not hand-write or approximate the path.** Always read the actual `.inline.svg` file for that size variant.

**Easel icon size → SVG file convention:**

| `iconSize` | file suffix                     | intrinsic px |
| ---------- | ------------------------------- | ------------ |
| `tiny`     | `icon-*-tiny.inline.svg`        | 12px         |
| `small`    | `icon-*-small.inline.svg`       | 16px         |
| `medium`   | `icon-*.inline.svg` (no suffix) | 24px         |
| `large`    | `icon-*-large.inline.svg`       | 32px         |

Check `ui/base/icons/<name>/icon.ts` to confirm the mapping — some icons omit certain sizes and fall back.

**Procedure for inlining an Easel icon:**

1. Find the icon's directory: `ui/base/icons/<name>/`
2. Read `icon.ts` to confirm which `.inline.svg` file maps to the required size
3. Read that `.inline.svg` file and copy its path data verbatim
4. Replace `fill="#191E26"` (or whatever fill value) with `fill="currentColor"`
5. Keep the original `width`, `height`, and `viewBox` attributes

**Why path approximations break things**: Each size variant has a subtly different path designed for that pixel grid. The medium `PlusIcon` path uses `.75`-radius corners and arms that span from y=5 to y=19 — a hand-written version with integer coordinates like `M13 4` produces 2px-wide arms from y=4 to y=20, which is visually thicker and appears larger even at the same SVG dimensions.

---

## Rule U — Verify image/SVG rendered size from the full wrapper chain

An image's displayed size is NOT determined by its intrinsic SVG `width`/`height` alone — it's determined by the container chain.

**Before using any image/logo:**

1. Read the SVG intrinsic `width`/`height` (or `viewBox`) from the audit
2. Read the CSS for the img/svg container (e.g. `logo.css`)
3. Read the CSS for every wrapper above it up to the content container
4. Reconstruct the size by wrapping in a container with explicit dimensions

**Common trap**: `img { width: 100%; height: 100% }` sizes by the container, not the intrinsic size. If the container has no explicit dimensions, the image renders at intrinsic SVG size.

**CanvaLogo in header (verified values):**

- SVG intrinsic: 80×30px
- Real header: 90×32px wrapper with `overflow: hidden`
- Fix: `.logoWrapper { width: 90px; height: 32px; overflow: hidden; flex-shrink: 0 }`
  ```css
  .logoWrapper img {
    width: 90px;
    height: auto;
    display: block;
  }
  ```

**CanvaLogo in footer:**

- SVG intrinsic: 80×30px
- Footer: no explicit size → img fills parent width
- Fix: wrap in `<div style={{ width: 80, height: 30 }}>` or explicit CSS

**Check the audit's `auditTable` for the logo/image wrapper element row.**

---

## Inline SVG icons: size constraints

Some SVG icons have large intrinsic dimensions (e.g. social icons can be 512×512). Always constrain:

```css
.iconContainer svg {
  width: 20px;
  height: 20px;
  max-width: 20px;
  max-height: 20px;
}
```

**SVG icons inside circle containers need centered span wrappers:**

```css
.circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.circle > span {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}
.circle svg {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
```

The parent container's centering does NOT automatically center the SVG within the `<span>`. Both the container and the span need flex centering.
