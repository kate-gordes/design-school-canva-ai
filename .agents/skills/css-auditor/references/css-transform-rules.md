# CSS Transform Rules

These rules describe transforms the slot-porter must apply when porting monorepo CSS to the prototype. The css-auditor detects violations and records them in `valuesToInline`; the slot-porter applies the fixes.

---

## Rule A — No `@value ... from "..."` in prototype `.module.css` files

The prototype's PostCSS pipeline (`postcss-modules` `FileSystemLoader`) runs before the `strip-value-imports` plugin and cannot resolve `ui/...` paths, crashing with `"PostCSS received undefined instead of CSS string"`.

**Fix**: Replace `@value X from "path"` with `@value X: <resolved-value>`.

Exception: `@value X from "ui/base/tokens/color.css"` and `"ui/base/tokens/primitive/color.css"` ARE resolvable (aliases exist) — but inlining them is safer and clearer.

**MUST inline**: Any `@value X from "pages/..."` path (Rule F — no `pages/` alias in PostCSS).

**Example transformation**:

```css
/* Monorepo — DO NOT copy as-is */
@value baseUnit, largeUp from "ui/base/metrics/metrics.css";
@value themeLight from "ui/base/theme/theme.css";

/* Prototype .module.css — correct form */
@value baseUnit: 8px;
@value largeUp: (min-width: 1200px);
/* themeLight used as selector → use :global() directly (Rule S) */
```

---

## Rule B — CSS imported from prototype TSX must be local `.module.css`

The `canva-monorepo-css` Vite plugin only activates for files whose **importer** is inside the monorepo. A prototype `.tsx` importing monorepo CSS directly causes: `"does not provide an export named 'default'"`.

**Fix**: Copy the monorepo CSS locally as `<name>.module.css`. Apply all `@value` inlining (Rule A). Import as `import styles from './<name>.module.css'`.

---

## Rule F — `pages/` alias does NOT exist in PostCSS

`postcss.config.cjs` only defines aliases for `ui/`, `base/`, `~ui/`, `~base/`. Any `@value ... from "pages/..."` MUST be manually inlined. The css-auditor marks these as `rule: "F"` in `valuesToInline`.

---

## Rule S — Never use `@value` names as CSS selectors

`postcss-modules-values-replace` substitutes `@value` names in **property value positions only**. When an `@value` name appears as a **CSS selector**, CSS Modules lowercases it, producing `themelight { ... }` which matches nothing.

**Broken (monorepo pattern)**:

```css
@value themeLight: :global(.light);
themeLight {
  --titleColor: colorContentFg;
} /* ← compiles to "themelight { ... }" */
```

**Correct (prototype pattern)**:

```css
/* Remove the @value import. Use :global() directly. */
:global(.light) {
  --titleColor: colorContentFg;
}
:global(.dark) {
  --titleColor: colorActionPrimaryFg;
}
```

**Symptom if missed**: CSS custom properties like `--titleColor` are never set; color falls back to inherited value and renders wrong (e.g. `rgba(255,255,255,0.898)` instead of `rgb(255,255,255)`).

The css-auditor marks these as `rule: "S"` in `valuesToInline`.

---

## Detection checklist for css-auditor

When reading each monorepo CSS file, scan for:

1. Any `@value X from "pages/..."` → add to `valuesToInline` with `rule: "F"`
2. Any `@value X from "..."` where X is used as a CSS **selector** → add to `valuesToInline` with `rule: "S"`, note the `:global()` equivalent
3. Any other `@value X from "..."` → add to `valuesToInline` with `rule: "A"`, resolve value using `token-values.md`
4. Any `.css` file that will need to be imported by prototype TSX → note in audit for Rule B handling
