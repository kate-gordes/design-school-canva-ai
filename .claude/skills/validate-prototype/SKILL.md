# Skill: Validate Prototype Against Monorepo

This skill has two phases that must be run in order. **Do not begin porting until Phase 1 passes.**

---

## Phase 1 — Find the exact source code before porting

`localhost:9090` is the compiled monorepo (master branch, up to date). It is the ground truth. Before any porting work begins, you must confirm that the source files you intend to port actually produce what `localhost:9090` renders.

### Step 1.1 — Measure `localhost:9090` with Chrome MCP

Navigate to the target page on `localhost:9090`. Extract computed values for every property you intend to port.

Run this script to capture the core layout measurements:

```javascript
() => {
  const h1 = document.querySelector('h1');
  const h1Span = h1?.querySelector('span');
  const titleCs = window.getComputedStyle(h1Span || h1);
  const h1Rect = h1?.getBoundingClientRect();

  // Find subtitle: first non-black span below h1
  const subtitleEl = Array.from(document.querySelectorAll('span')).find(el => {
    const r = el.getBoundingClientRect();
    const cs = window.getComputedStyle(el);
    return (
      r.top > (h1Rect?.bottom ?? 0)
      && r.top < 600
      && cs.color !== 'rgb(0, 0, 0)'
      && cs.color !== 'rgb(15, 16, 21)'
      && el.textContent.trim().length > 20
    );
  });

  const cta = Array.from(document.querySelectorAll('button')).find(b =>
    /start|design|free|get canva/i.test(b.textContent),
  );
  const ctaSpan = cta?.querySelector('span');
  const header = document.querySelector('header');

  const gradientDiv = Array.from(document.querySelectorAll('div')).find(el =>
    window.getComputedStyle(el).backgroundImage?.includes('linear-gradient(rgb'),
  );

  return {
    viewport: window.innerWidth + 'x' + window.innerHeight,

    title: {
      fontSize: titleCs.fontSize,
      fontWeight: titleCs.fontWeight,
      color: titleCs.color,
      letterSpacing: titleCs.letterSpacing,
      lineHeight: titleCs.lineHeight,
      fontVariationSettings: titleCs.fontVariationSettings,
      h1Top: Math.round(h1Rect?.top ?? 0),
      h1Bottom: Math.round(h1Rect?.bottom ?? 0),
    },

    subtitle: subtitleEl
      ? {
          text: subtitleEl.textContent.trim().slice(0, 80),
          top: Math.round(subtitleEl.getBoundingClientRect().top),
          fontSize: window.getComputedStyle(subtitleEl).fontSize,
          fontWeight: window.getComputedStyle(subtitleEl).fontWeight,
          color: window.getComputedStyle(subtitleEl).color,
          fontVariationSettings: window.getComputedStyle(subtitleEl).fontVariationSettings,
        }
      : null,

    gaps: {
      titleToSubtitle:
        subtitleEl && h1Rect
          ? Math.round(subtitleEl.getBoundingClientRect().top - h1Rect.bottom)
          : null,
      subtitleToCta:
        subtitleEl && cta
          ? Math.round(cta.getBoundingClientRect().top - subtitleEl.getBoundingClientRect().bottom)
          : null,
    },

    cta: cta
      ? {
          height: Math.round(cta.getBoundingClientRect().height),
          width: Math.round(cta.getBoundingClientRect().width),
          bg: window.getComputedStyle(cta).backgroundColor,
          borderRadius: window.getComputedStyle(cta).borderRadius,
          spanFontSize: ctaSpan ? window.getComputedStyle(ctaSpan).fontSize : null,
          spanFontWeight: ctaSpan ? window.getComputedStyle(ctaSpan).fontWeight : null,
          spanColor: ctaSpan ? window.getComputedStyle(ctaSpan).color : null,
        }
      : null,

    header: header
      ? {
          height: Math.round(header.getBoundingClientRect().height),
          position: window.getComputedStyle(header).position,
        }
      : null,

    gradient: gradientDiv
      ? {
          top: Math.round(gradientDiv.getBoundingClientRect().top),
          height: Math.round(gradientDiv.getBoundingClientRect().height),
          backgroundImage: window.getComputedStyle(gradientDiv).backgroundImage.slice(0, 200),
        }
      : null,
  };
};
```

Take screenshots at each relevant viewport:

- **375×812** (mobile)
- **768×1024** (tablet / smallUp)
- **1280×900** (desktop / largeUp)
- **1920×1080** (xlarge / xLargeUp)

Use `resize_page` to set the viewport, then `take_screenshot`.

### Step 1.2 — Find the source code that produces these values

For each measured value, trace it back to the exact source file and line in `~/work/canva/web/src`.

**Procedure for each measured property:**

| Measured value                      | Where to look in source                                                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Title font-size (e.g. 80px)         | `<component>.css` — search for `font-size` near the breakpoint media query. Calculate: `calc(N * pxInRem)` → `N * 0.1rem ≈ N px`. |
| Title color (e.g. rgb(255,255,255)) | CSS custom property chain. Find `color:` rule, trace `var(--X)` back to theme-tokens.css.                                         |
| Spacer gaps (e.g. 24px = 3u)        | `<component>.tsx` — find `<Spacer size={...} />`. Convert: `'3u'` = 3 × 8px = 24px.                                               |
| Gradient colors                     | `<background>.css` — the `background:` or `background-image:` rule.                                                               |
| CTA height (e.g. 56px)              | Either Easel size token (`calc(7 * baseUnit)` = 56px) or CSS override.                                                            |
| Border-radius                       | CSS `border-radius:` rule or Easel token (`radiusContainerSoft` = 12px).                                                          |
| Letter-spacing                      | CSS `letter-spacing:` rule (`-0.01em` at 80px = -0.8px).                                                                          |

**If a measured value doesn't match the source you found:**

- Look at git log for the file: `git log --oneline web/src/path/to/file.css | head -5`
- Check if you are reading the right breakpoint (e.g. 1280px is in `largeUp and (min-height: 900px)`, not just `largeUp`)
- Check if the CSS file being compiled is the one you think it is (search for the component name in other directories)
- Check for feature flags or A/B variants (look for `variant` props or conditional rendering in the `.tsx`)

**Do not proceed to porting until every measured value maps exactly to a source line.**

### Step 1.3 — Source confirmation checklist

Before handing off to the porting skill, confirm every item:

- [ ] Title font-size at each breakpoint: measured value ↔ CSS `font-size` rule confirmed
- [ ] Title color: measured rgb value ↔ CSS custom property chain traced to `theme-tokens.css` value
- [ ] Title position (h1Top): measured px ↔ layout logic in `.tsx` confirmed (header height + gap)
- [ ] Gap between title and subtitle: measured px ↔ `<Spacer size={...} />` value × 8 confirmed
- [ ] Gap between subtitle and CTA: measured px ↔ `<Spacer size={...} />` confirmed
- [ ] CTA height: measured px ↔ Easel size token or CSS rule confirmed
- [ ] Gradient: measured `rgb()` stop values ↔ CSS `linear-gradient(...)` values confirmed
- [ ] Floating elements (if any): element count, size, layout pattern confirmed in `.tsx`

Only after all boxes are checked, pass the confirmed source paths to the porting skill.

---

## Phase 2 — Verify the prototype matches after porting

After the porting skill has completed its work, run this phase to confirm the prototype at `localhost:5173` is visually identical to `localhost:9090`.

### Step 2.1 — Run the same measurements on `localhost:5173`

Navigate to the prototype route (e.g. `localhost:5173/#/anon-home`) and run the exact same measurement script from Step 1.1. Collect the same viewport screenshots.

### Step 2.2 — Build a comparison table

For each viewport, compare every measured property side-by-side:

| Property                  | `localhost:9090` | `localhost:5173` | Status |
| ------------------------- | ---------------- | ---------------- | ------ |
| Title font-size (desktop) | 80px             | 80px             | ✅     |
| Title color               | rgb(255,255,255) | rgb(255,255,255) | ✅     |
| h1 top                    | 144px            | 144px            | ✅     |
| Title-to-subtitle gap     | 16px             | 16px             | ✅     |
| ...                       |                  |                  |        |

**Tolerance:**

- Pixel positions and sizes: ±2px acceptable (subpixel rendering)
- Font sizes: must match exactly
- Colors: must match exactly (as `rgb()`/`rgba()` strings)
- Gaps: ±2px acceptable

### Step 2.3 — For each mismatch, fix via source (not by adjusting to match)

When a value differs:

1. Go back to the confirmed source file from Phase 1
2. Re-read the relevant rule — did the porting skill copy it correctly?
3. Check if the CSS custom property chain is intact (Rule S: `@value` names as selectors don't work — use `:global(.dark)` directly)
4. Fix the prototype file to match the source
5. Re-run the measurement on `localhost:5173` to confirm

**Never hardcode a value to match the compiled output without finding it in the source first.**

### Step 2.4 — Iterate until the comparison table is all ✅

Repeat Steps 2.1–2.3 until every measured property matches within tolerance. Then take a final side-by-side screenshot of both pages at each viewport and confirm visually.

---

## Known issues to always check

These are bugs that have been caught before. Always check for them:

| Issue                                           | Symptom                                                                                 | Fix                                                                                                          |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Rule S** — `@value` name used as CSS selector | CSS custom property (e.g. `--titleColor`) is never set; color falls back to wrong value | Replace `themeLight { ... }` / `themeDark { ... }` with `:global(.light) { ... }` / `:global(.dark) { ... }` |
| **Rule Q.1** — absolute header                  | Title `y` position is ~64px too high                                                    | Add `padding-top: calc(80px + 64px) !important` to container instead of using `justifyContent="center"`      |
| **Rule W.4** — Easel shorthand override         | `padding-top` or other longhand not applying                                            | Add `!important`                                                                                             |
| **Rule A** — `@value from "pages/..."` in CSS   | PostCSS crash: "undefined instead of CSS string"                                        | Inline the value                                                                                             |
| **Rule B** — CSS imported from prototype TSX    | "does not provide an export named 'default'"                                            | Copy as `.module.css`                                                                                        |

---

## Viewport reference

| Name    | Width | Height | Active breakpoints                                |
| ------- | ----- | ------ | ------------------------------------------------- |
| mobile  | 375   | 812    | default only                                      |
| tablet  | 768   | 1024   | smallUp (≥600px)                                  |
| desktop | 1280  | 900    | mediumUp (≥900px), largeUp and (min-height:900px) |
| xlarge  | 1920  | 1080   | xLargeUp (≥1650px)                                |

Use `resize_page` to set each viewport before measuring or screenshotting.
