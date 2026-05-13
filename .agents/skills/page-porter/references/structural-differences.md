# Structural Differences: Monorepo vs Prototype

These differences are **fixed and known** — they don't vary per-extraction. The css-auditor flags them in `structuralFlags`; the slot-porter applies the corrections.

## Q.1 — Nav header position

| Monorepo                                   | Prototype                                            |
| ------------------------------------------ | ---------------------------------------------------- |
| Header is **in-flow** (80px block element) | Header is `position: absolute` or `position: sticky` |
| Page container starts at y=80              | Page container starts at y=0                         |

**Consequence**: Any spacing that assumes post-header positioning must be adjusted.

**Example**: Monorepo has `justifyContent="center"` on `min-height: calc(100vh - 80px)`. In the monorepo that container starts at y=80, so center is at y≈144. In the prototype the same container starts at y=0 — center would be at y≈64. Fix: use `padding-top` equal to header height + desired gap instead of centering.

**How the css-auditor flags it**: Sets `structuralFlags.hasNavContentHeight: true` when source uses `navContentHeight` token. The slot-porter then applies the 80px offset.

## Q.2 — No page shell

| Monorepo                                                                           | Prototype                                               |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Page wrapped in shell component that may set `padding`, `max-width`, or `overflow` | Component renders directly in the route, no outer shell |

**Consequence**: Horizontal or vertical padding the monorepo shell provides must be explicitly added in the prototype (or intentionally omitted).

**How the css-auditor flags it**: Sets `structuralFlags` notes about outer container padding. Slot-porter adds equivalent padding to the page wrapper div.

## Q.3 — CSS Modules cross-file `composes:` doesn't resolve

| Monorepo                                                     | Prototype                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------ |
| `composes: textBoldMedium from "..."` resolves at build time | Cross-file `composes:` does NOT resolve in prototype Vite pipeline |

**Consequence**: Properties from composed classes (font-weight, font-variation-settings, -webkit-font-smoothing, etc.) are missing on prototype elements unless added manually.

**How the css-auditor flags it**: Identifies `composesChains` in audit output with `missingInPrototype: true`. Slot-porter adds the resolved properties explicitly in local CSS.

## navContentHeight — the gradient trick

The monorepo uses `navContentHeight = 80px` to extend gradient backgrounds behind the transparent header:

```css
.container {
  min-height: calc(100vh - navContentHeight); /* = calc(100vh - 80px) */
}
.gradientBackground {
  height: calc(100% + navContentHeight); /* extends 80px above container */
  top: calc(-1 * navContentHeight); /* pulls up behind header */
}
```

**In the prototype**: inline `navContentHeight` as `80px` if the page has a header. Use `0px` only if truly no header.

**css-auditor sets**: `structuralFlags.hasNavContentHeight: true` when it detects this pattern in source CSS.
