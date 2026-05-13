# Skill: Fidelity Validator

**Role**: Verify that every slot in the prototype faithfully represents its monorepo source — visually and structurally. Read-only.

Visual comparison against the real canva.com page is the **PRIMARY** check. Source code analysis is the **SECONDARY** check that explains what went wrong. Both must pass.

---

## Passing threshold

**A slot PASSES when:**

- Visual check: no significant visual differences between prototype slot and canva.com equivalent
- Source check: zero HIGH severity mismatches (wrong component type, missing elements, undocumented deviations from source)

MEDIUM severity items that correspond to documented deviations (reason: `logic`, `vite`) are acceptable — note them in the report.

---

## Input

```json
{
  "pageName": "Home",
  "prototypeRoute": "/home",
  "workspaceDir": ".porter-workspace/Home",
  "slots": [...]
}
```

---

## Step 1 — Visual comparison (PRIMARY)

**This is the most important step. Do it first. Do it carefully.**

Use the Chrome DevTools MCP (at `localhost:1337`) to:

### 1a. Screenshot canva.com

Navigate to `https://www.canva.com` (or the equivalent route for the page being validated). Scroll to each slot's region. Take a screenshot.

### 1b. Screenshot the prototype

Navigate to `http://localhost:5173/#<route>`. Take a screenshot of the same region.

### 1c. Compare visually

For each slot, compare the canva.com screenshot against the prototype screenshot. Look for:

- **Missing sections**: Is an entire visual section absent from the prototype?
- **Wrong components**: Are cards rendered as colored divs? Is a heading missing? Is a gradient absent?
- **Layout divergence**: Is spacing dramatically different? Columns vs rows swapped?
- **Missing items**: Fewer nav items, fewer cards, missing icons?
- **Wrong typography**: Font size dramatically different, heading absent, text truncated wrong?
- **Color/theming**: Background colors wrong, pill colors wrong, button colors wrong?

Grade each slot's visual output:

| Grade   | Meaning                                                                                                                                                  |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ PASS | Prototype slot matches canva.com at the component/layout level AND Step 1d numeric sweep returns ≤2px drift on every element                             |
| ⚠️ WARN | Minor differences (card content placeholder vs real, non-structural). WARN is NOT permitted for any spacing/positioning/size delta — those always block. |
| ❌ FAIL | Significant visual section missing, wrong component type, wrong layout, OR any numeric measurement >2px off from canva.com                               |

**No "visually close" PASS grade.** A slot that looks right but has a 5px vertical offset on the title, or a search bar centered 30px off from canva.com, is ❌ FAIL. The prototype's purpose is pixel-level design prototyping; every spacing/positioning drift >2px compounds into a page that subtly "feels off." Screenshot comparison catches structural bugs; Step 1d catches the spacing bugs that a screenshot cannot surface at small viewport scale.

A slot that receives ❌ FAIL **does not pass**, regardless of what the source check says.

### 1d. Numeric measurement verification (MANDATORY for every sized element)

After screenshots, for every slot containing elements with explicit size constraints, verify dimensions numerically.

**Set a consistent viewport on both sides:**

```
mcp__chrome-devtools__emulate  viewport: "1728x873x1"
```

**Element scope — measure ALL of the following, not just containers:**

- Layout containers: widths, banner heights, nav column widths
- Interactive components: **every pill, button, badge, filter control, icon button** — these have fixed heights and content-driven widths that must match
- Typography containers: heading rows, caption rows, meta rows
- **Content-column constraints** — measure the outermost content column's width at **both 1728px AND 1920px viewports**. If canva.com caps at 1760px but the prototype doesn't, centering of child elements diverges at wide viewports (recurring bug: search bars and filter rows mis-centered by 100–300px at wide screens). Record prototype `max-width` vs canva.com `max-width` — must match.
- **Banner `min-height`** — measure every hero/banner block's `height` and compare to source `min-height`. Sub-routes that dropped their parent's `min-height: 277px` collapse to ~124px; every anchor below shifts upward.
- **Per-pair inter-anchor gaps** — for stacked elements (title→search, search→filters, filter-row→first-section), measure each pair's gap separately. Do NOT average, do NOT assume they're uniform. Each gap comes from a different source margin/padding/Spacer and must be matched independently.

For each element:

1. Run `getBoundingClientRect()` on the prototype element
2. Run the same query on canva.com
3. Compare — tolerance **±1px** (sub-pixel rounding is the only acceptable diff)

**Why ±1px, not ±2px:** 1–2px drifts on individual elements compound. A caption that's 1px too tall shifts every section below by 1px, and by the time you've stacked 5 sections the page is 5px off at the bottom. A ±2px tolerance approves these drifts silently. ±1px forces every drift to be investigated and attributed to a specific source mismatch.

**CRITICAL — Measure the visible CARD boundary, not the inner content element.**

When measuring a styled control (search bar, text input, card, badge, pill), the inner native element (`<input>`, `<textarea>`, `<svg>`, raw text span) is almost always smaller than the visible surface that a user perceives as "the thing." A search input that looks 64px tall usually contains a 38px `<input>` inside a 13px/13px padded container with a box-shadow. Measuring the `<input>` gives the wrong top/bottom coordinates.

**Rule:** when computing the gap between two adjacent visual elements (`elementA.bottom → elementB.top`), both coordinates MUST come from the OUTERMOST visible-surface element — the one carrying the `background`, `border-radius`, `box-shadow`, or `border` that makes it look like a distinct component.

**How to find the visible surface:**

1. Locate the content element (e.g. the `<input>`).
2. Walk up `parentElement` and inspect `getComputedStyle()` at each level.
3. The visible surface is the first ancestor with a non-`none` `background`/`background-image`, OR a non-`none` `box-shadow`, OR a `border-radius ≥ 8px` with a solid background.
4. Stop walking when the parent becomes much larger than the child (the next ancestor is a layout row, not the control).

**Example failure mode (do not repeat):**

On canva.com's /projects page, the search input `<input>` is at `y=155, bottom=193` (h=38). The visible search card is at `y=142, bottom=206` (h=64). An earlier validation pass measured the `<input>`, computed a 25px gap to the filter pills below, and set the prototype's `padding-top` to 3u. In reality the gap from the CARD bottom to the pill top is 12px (1.5u) — the prototype ended up with 2× the correct space, making the pills look floated. Always measure the 64px card, never the 38px `<input>`.

Measurement divergence > 1px:

- Undocumented in deviations → **HIGH severity** (likely a feature-flag override or a CSS substitution that was missed)
- Documented in deviations with reason `feature-flag-override` → **Note (acceptable)**

Screenshots at small effective width (≤900px) mask dimension errors that are obvious at 1728px. Numeric measurement is not optional.

### 1d-2 — Full computed-style sweep (MANDATORY — run once per slot)

Geometry checks miss half the bugs. A row can land at the correct `top` / `left` / `height` and still be visibly wrong because its border-radius, background, text color, font-weight, or padding are off. This sweep captures the full visual fingerprint of every named class in the slot and forces a side-by-side diff against canva.com.

**For every named class in the prototype slot (every `styles.X` reference in `index.tsx`):**

1. Locate the DOM element in the prototype (by class substring match, e.g. `[class*="_navItem_"]`).
2. Locate the structurally-equivalent DOM element on canva.com (by position in the slot — first card → first card, first nav row → first nav row). Pair them unambiguously before measuring.
3. For BOTH elements, capture the **full property fingerprint** (below).
4. Diff prototype vs canva. Any difference not documented in `deviations[]` with a valid reason is a fail.

**Full property fingerprint — every one of these must match canva.com exactly:**

| Bucket             | Properties to capture                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Geometry           | `getBoundingClientRect()` → top, left, width, height                                                                      |
| Layout             | `display`, `gridTemplateRows`, `gridTemplateColumns`, `columnGap`, `gap`, `flexDirection`, `alignItems`, `justifyContent` |
| Box                | `padding` (all four sides), `margin` (all four sides), `boxSizing`, `borderRadius`, `borderWidth`, `borderStyle`          |
| Paint              | `backgroundColor`, `color`, `backgroundImage`, `boxShadow`, `opacity`                                                     |
| Typography         | `fontSize`, `fontWeight`, `fontFamily`, `lineHeight`, `letterSpacing`, `fontVariationSettings`, `textDecoration`          |
| Descendant text    | `color`, `fontWeight`, `fontSize` on any text-bearing child (label span, h6, etc.)                                        |
| Icon descendants   | `color` (for `currentColor` SVGs), `width`, `height`, `fill` (if explicit)                                                |
| Interactive states | `:hover` / `.active` / `[aria-current="page"]` background and color (toggle the state by adding the class temporarily)    |

**Severity when prototype ≠ canva.com and not in deviations:**

| Category                                                            | Severity   | Flag                         |
| ------------------------------------------------------------------- | ---------- | ---------------------------- |
| `borderRadius`, `backgroundColor`, `color` (container or text/icon) | **HIGH**   | `paint-mismatch`             |
| `padding`, `margin` (any side)                                      | **HIGH**   | `box-mismatch`               |
| `fontWeight`, `fontSize`, `lineHeight`, `fontVariationSettings`     | **HIGH**   | `typography-mismatch`        |
| `display`, `gridTemplateRows`, `gridTemplateColumns`                | **HIGH**   | `layout-mismatch`            |
| `gap`, `columnGap`, `alignItems`, `justifyContent`                  | **HIGH**   | `flex-grid-mismatch`         |
| `getBoundingClientRect` > 1px diff                                  | **HIGH**   | `geometry-drift`             |
| `boxShadow`, `opacity`, `textDecoration`                            | **MEDIUM** | `decoration-mismatch`        |
| Active/hover state background or text color wrong                   | **HIGH**   | `interactive-state-mismatch` |

No MEDIUM-only bucket any more: paint, box, and typography are HIGH by default because these are the exact mismatches that the user keeps having to point out after a slot has been marked "done".

**Script template — prototype side:**

```js
() => {
  const classes = Array.from(
    new Set(
      Array.from(document.querySelectorAll('[class]'))
        .flatMap(el => Array.from(el.classList))
        .filter(c => /^_[a-z]+_[a-z0-9]+$/i.test(c)), // CSS Module class pattern
    ),
  );
  const fingerprint = el => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      rect: {
        top: Math.round(r.top),
        left: Math.round(r.left),
        width: Math.round(r.width),
        height: Math.round(r.height),
      },
      layout: {
        display: s.display,
        flexDirection: s.flexDirection,
        alignItems: s.alignItems,
        justifyContent: s.justifyContent,
        gridTemplateRows: s.gridTemplateRows,
        gridTemplateColumns: s.gridTemplateColumns,
        gap: s.gap,
        columnGap: s.columnGap,
      },
      box: {
        padding: s.padding,
        margin: s.margin,
        boxSizing: s.boxSizing,
        borderRadius: s.borderRadius,
        borderWidth: s.borderWidth,
        borderStyle: s.borderStyle,
      },
      paint: {
        backgroundColor: s.backgroundColor,
        color: s.color,
        backgroundImage: s.backgroundImage === 'none' ? 'none' : 'present',
        boxShadow: s.boxShadow,
        opacity: s.opacity,
      },
      typography: {
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        fontFamily: s.fontFamily,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        fontVariationSettings: s.fontVariationSettings,
        textDecoration: s.textDecoration,
      },
      descendants: Array.from(el.children)
        .slice(0, 3)
        .map(ch => {
          const cs = getComputedStyle(ch);
          return {
            tag: ch.tagName,
            color: cs.color,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
          };
        }),
    };
  };
  return classes.map(c => ({ class: c, ...fingerprint(document.querySelector(`.${c}`)) }));
};
```

**Script template — canva.com side:** pair each prototype class to a canva.com element by semantic role (first nav row, first section header, etc.) and run the same `fingerprint(el)` function on it. Build a pairing map before running the sweep so each diff has a clear counterpart — otherwise the report is unactionable.

**For interactive states (`:hover`, `.active`, `[aria-current]`):** toggle the state on both sides before measuring. The fastest way on canva.com is to find an already-active element (e.g. the current page's nav row) and measure it in its natural state. For hover, either script a `mouseenter` event or capture the hover rule from DevTools and compare CSS source.

**This sweep is what catches bugs like:**

- Nav row `border-radius: 4px` vs canva's `8px` — invisible on a screenshot, unmistakable once measured
- Active state background `rgba(118, 48, 215, 0.1)` vs canva's `rgba(163, 112, 252, 0.15)` — two different Easel tokens
- Active label `font-weight: 600` vs canva's `400` — source applies no bold on active; prototype added it speculatively
- Icon `color: #7630d7` vs canva's inherited `rgb(74, 46, 126)` — the icon should inherit via `currentColor`, not hard-code a purple
- Caption `display: flex column` vs canva's `display: grid` with `grid-template-rows: 25px 20px` (1px cumulative drift per card)
- Title `line-height: 24px` vs source `22px` (1px per text line)
- Spacer collapsed into `padding-top` when source keeps it as a sibling (affects line-box descent)

**A slot does not pass validation until every diff in this sweep is either exact-match or documented in `deviations[]` with a reason that isn't "I forgot to measure".**

---

### 1e. Computed style audit (MANDATORY for every interactive component)

`getBoundingClientRect` only catches geometry. CSS properties like `line-height`, `font-variation-settings`, `align-items`, `gap`, and `margin` can be wrong without affecting geometry — but they change visual rendering. This step is what catches those.

**For every pill, button, badge, filter control, nav item, and card caption** in the slot:

1. Run `getComputedStyle()` on the element AND its direct children (text spans, icon spans) on the **prototype**
2. Run the same query on **canva.com**
3. Compare the following property checklist:

**Container element checklist:**

| Property        | Why it matters                                                                      |
| --------------- | ----------------------------------------------------------------------------------- |
| `align-items`   | `center` vs `normal` shifts child positions — AdjustmentPill uses `normal`          |
| `gap`           | Unexpected `8px` gap widens components — AdjustmentPill uses child margins, not gap |
| `padding`       | Wrong padding changes width/height                                                  |
| `border-radius` | Round vs rectangle pill shape                                                       |
| `height`        | Fixed height components must match exactly                                          |

**Text child checklist:**

| Property                  | Why it matters                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `line-height`             | Pill text uses `38px` (not `22px`) to vertically center — wrong value shifts text down |
| `font-weight`             | `400` vs `600` changes visual weight                                                   |
| `font-size`               | Must match source token                                                                |
| `font-variation-settings` | `"opsz" 0` (body) vs `"opsz" 100` (title) changes letterform rendering                 |
| `letter-spacing`          | Unexpected tracking changes text width                                                 |

**Icon/decorator child checklist:**

| Property         | Why it matters                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `margin-left`    | Spacing from text — AdjustmentPill uses `8px`                                              |
| `margin-right`   | AdjustmentPill uses `-4px` to pull pill width back — missing this makes pills 4px too wide |
| `width`/`height` | Icon size must match                                                                       |

**Script template** — run once per slot (adapt selectors to the slot's elements):

```js
// Run on both prototype and canva.com; compare results
() => {
  const results = [];
  document.querySelectorAll('button, [role="button"]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.height < 20 || r.height > 80) return; // skip non-button-sized elements
    const s = getComputedStyle(el);
    const children = [...el.children].map(ch => {
      const cs = getComputedStyle(ch);
      return {
        tag: ch.tagName,
        text: ch.innerText?.trim().slice(0, 20),
        lineHeight: cs.lineHeight,
        fontWeight: cs.fontWeight,
        fontSize: cs.fontSize,
        fontVariationSettings: cs.fontVariationSettings,
        marginLeft: cs.marginLeft,
        marginRight: cs.marginRight,
        width: ch.getBoundingClientRect().width,
      };
    });
    results.push({
      text: el.innerText?.trim().slice(0, 30),
      width: r.width,
      height: r.height,
      alignItems: s.alignItems,
      gap: s.gap,
      padding: s.padding,
      borderRadius: s.borderRadius,
      children,
    });
  });
  return results;
};
```

**Any mismatch between prototype and canva.com values:**

- Undocumented → **MEDIUM severity** `computed-style-mismatch` (escalate to HIGH if it affects geometry or visual hierarchy)
- Documented deviation → **Note (acceptable)**

This step is what catches typography and spacing bugs that screenshots miss. Do not skip it.

---

### 1e-2. Hover-reveal probe (MANDATORY for decorator/swap affordances)

**Why this step exists:** At-rest screenshots cannot distinguish a correctly-hidden affordance from a silently-broken one — both render nothing. Vite's CSS Modules plugin has a bug that drops `@value` selector aliases in `ui/base/badge/private/badge_container.css`, which powers `CardDecorator visibility="on-hover"`, `SwapOnHover`, and all `fxFade`/`fxSlide`/`fxAppear` hover effects. When the bug hits, the element sits at `opacity: 1` permanently (always visible, breaks the design) or `opacity: 0` permanently (never appears on hover, invisible). A visual PASS on the resting state tells you nothing.

**This step runs once per slot that contains a hoverable affordance.** Affordances to probe:

- `CardDecorator` with `visibility="on-hover"` (overflow menu pills, star buttons, action chips on cards)
- `SwapOnHover` wrappers (star/unstar swap, badge swap-on-hover)
- Any element whose CSS module contains `hoverTarget`, `fxFade`, `fxSlide`, `fxAppear`, `showOnHover`, or `hideOnHover` classes

**Script** (run on the prototype):

```js
() => {
  const targets = Array.from(document.querySelectorAll('[class*="hoverTarget"][class*="fxFade"]'));
  if (targets.length === 0)
    return { status: 'no-affordances', note: 'slot has no fxFade decorators to probe' };

  // 1. At-rest check: every hoverTarget must compute opacity=0
  const atRest = targets.map(el => ({
    classes: (el.className || '').slice(0, 80),
    opacity: getComputedStyle(el).opacity,
    transition: getComputedStyle(el).transition,
  }));

  // 2. Find hoverTrigger ancestor for a sample target — used next for the :hover probe
  let probe = null;
  const first = targets[0];
  let ancestor = first.parentElement;
  while (ancestor && !/hoverTrigger/.test(ancestor.className || ''))
    ancestor = ancestor.parentElement;
  if (ancestor) {
    const rect = ancestor.getBoundingClientRect();
    probe = {
      centerX: Math.round(rect.left + rect.width / 2),
      centerY: Math.round(rect.top + rect.height / 2),
    };
  }
  return { atRest, probe };
};
```

**Trigger a real `:hover`** — use the MCP `hover` tool against a card in the slot (e.g. `mcp__chrome-devtools__hover` with the card's snapshot uid). JS-simulated events don't activate the CSS `:hover` pseudo-class; the MCP hover is the ground truth.

**After hover, probe again:**

```js
() => {
  // Find a card that matches :hover; return its decorator's opacity
  const card = Array.from(document.querySelectorAll('[class*="hoverTrigger"]')).find(el =>
    el.matches(':hover'),
  );
  if (!card)
    return {
      error: 'no hoverTrigger ancestor matches :hover — MCP hover may have landed outside a card',
    };
  const target = card.querySelector('[class*="hoverTarget"][class*="fxFade"]');
  return {
    cardMatchesHover: true,
    targetOpacity: getComputedStyle(target).opacity,
    targetTransition: getComputedStyle(target).transition,
  };
};
```

**Required outcomes:**

| Check                               | Required value                 | Severity if wrong                             |
| ----------------------------------- | ------------------------------ | --------------------------------------------- |
| At-rest opacity (every hoverTarget) | `"0"`                          | **HIGH** `hover-reveal-broken-always-visible` |
| At-rest transition                  | contains `opacity` and `0.15s` | **MEDIUM** `hover-reveal-missing-transition`  |
| On-hover opacity (hovered card)     | `"1"`                          | **HIGH** `hover-reveal-broken-never-appears`  |

**A HIGH result here almost always indicates the Vite `@value` selector-alias bug — check `src/style.css` for the re-expression workaround** (see `slot-porter/SKILL.md` Step 3a). Report the failure with `src/style.css` as the file that needs the fix.

**Do not accept a visual-screenshot-only validation for any slot containing these affordances.** The hover probe is non-negotiable — silent hover failures are invisible at rest.

---

### 1e-3. Per-section affordance count check (MANDATORY for multi-section pages)

**Why this step exists:** when a page iterates an array of sections (`/projects`, `/home`, `/templates`, search results, etc.), the monorepo drives each section's affordances (See all, filters, toolbar buttons, empty-state banners) from per-section config. Ports that apply "See all on every section" because one section had it ship incorrect UIs — and the mismatch is invisible to typography/geometry checks. See `slot-porter/SKILL.md` Step 3a-3.

**Run once per ported page** (not per slot — this is a page-level aggregation check).

For each affordance the ported page renders (See all, View all, filter pill, overflow toolbar, empty banner, etc.):

1. Count occurrences on the prototype.
2. Count occurrences on canva.com.
3. Count the source's enumeration: how many sections in the composer's `sections.map(...)` have the prop defined (not `undefined`) given the live feature-flag state?

**Script** — count `See all` (adapt selector for other affordances):

```js
() => {
  const all = Array.from(document.querySelectorAll('button, a, [role="button"]'));
  const matches = all.filter(el => /^(see|view) all$/i.test(el.textContent.trim()));
  return {
    count: matches.length,
    sections: matches.map(btn => {
      let p = btn;
      for (let i = 0; i < 20 && p; i++) {
        p = p.parentElement;
        if (!p) break;
        const h = p.querySelector('h1,h2,h3,h4,h5,h6,[role="heading"]');
        if (h && !btn.contains(h)) return h.textContent.trim().slice(0, 60);
      }
      return 'unknown';
    }),
  };
};
```

Run on prototype, then on canva.com (open both in the selected page, switch between them).

**Required outcome:**

| Check                                             | Required value                 | Severity if wrong                       |
| ------------------------------------------------- | ------------------------------ | --------------------------------------- |
| Prototype affordance count                        | equals canva.com count         | **HIGH** `affordance-count-mismatch`    |
| Prototype sections that render it                 | same set as canva.com sections | **HIGH** `affordance-wrong-section`     |
| Each rendered instance matches source enumeration | yes                            | **HIGH** `affordance-ungated-by-source` |

If the prototype shows `6` See all buttons and canva.com shows `1`: reject. The porter must re-read the composer and gate each section's prop per source (Step 3a-3 in slot-porter).

---

### 1e-3b. Typography class-completeness sweep (MANDATORY for every text node)

**Why this step exists:** screenshots and rect-only checks miss the single most common user-facing regression: ported text nodes that pass geometry (correct size / line-height) but render with the wrong font smoothing, wrong opsz axis, wrong Canva Sans fallback, or missing `text-size-adjust`. The user has repeatedly flagged these as "font parity is wrong" — they look correct on a Mac with Canva Sans loaded but diverge from canva.com when any property differs. See slot-porter Rule 5 for the authoritative source map.

**Scope:** every element in the slot that renders visible text — headings, subtitles, captions, meta rows, card titles, nav labels, button labels, badge labels, placeholder text.

**Required values — every ported text element MUST match canva.com on each property:**

| Property                  | Required value                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `font-family`             | must begin with `"Canva Sans"` (never `inherit` or a lone platform font)                                                                                |
| `font-variation-settings` | `"opsz" 100` (Display + Title XL/L/M) OR `"opsz" 0` (Title S/XS/XXS + all body Text). Body text with `"opsz" 100` is a HIGH-severity drift (wrong axis) |
| `font-feature-settings`   | `"ss02", "ss03"` ONLY on Title XL/L/M and Display; any `"ss0X"` value on a body-Text node is a HIGH-severity drift                                      |
| `-webkit-font-smoothing`  | `antialiased` (required on every typography class)                                                                                                      |
| `-moz-osx-font-smoothing` | `grayscale` (required on every typography class; missing this is a HIGH-severity drift even though many reviewers can't see it on their own machine)    |
| `text-size-adjust`        | `none` (required on every typography class)                                                                                                             |
| `color`                   | matches token. `colorContentPrimaryFg` light = `#0F1015` — `#0F1014`, `rgb(13, 18, 22)`, or `rgb(15, 18, 26)` are all WRONG                             |

**Script template** — run on prototype and canva.com, pair by role, diff.

**CRITICAL:** Easel `Display` / `Title` / `Text` components render as `<h3><span class="...">TEXT</span></h3>` — the semantic tag is a wrapper, the **inner span** carries the real font-size / weight / opsz. Reading computedStyle on the `h3` returns _inherited defaults_ (e.g. 24px/32px/600), NOT the rendered value (e.g. 40px/44px/500). This has caused the most-corrected typography bug in the project: "Canva Brand Kit" banner ported at 24px when canva.com renders it at 40px, because the probe landed on the h3 not the inner span.

**Use the TreeWalker pattern below — it lands on the direct parent of every text node, which is always the innermost text-bearing element. Never use `querySelectorAll('h1, h2, h3, …')` + `getComputedStyle` for this sweep.**

```js
() => {
  // Walk every text node in the document; its .parentElement is the deepest element that actually carries the text's rendered typography.
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  const results = [];
  let node;
  while ((node = tw.nextNode())) {
    const text = node.textContent.trim();
    if (!text || text.length < 2) continue;
    const el = node.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const s = getComputedStyle(el);
    results.push({
      tag: el.tagName,
      cls: el.className ? String(el.className).slice(0, 40) : '',
      text: text.slice(0, 50),
      x: Math.round(r.x),
      y: Math.round(r.y),
      fontFamily: s.fontFamily.slice(0, 30),
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      lineHeight: s.lineHeight,
      fontVariationSettings: s.fontVariationSettings,
      fontFeatureSettings: s.fontFeatureSettings,
      webkitFontSmoothing: s.webkitFontSmoothing,
      mozOsxFontSmoothing: s.MozOsxFontSmoothing,
      textSizeAdjust: s.textSizeAdjust,
      color: s.color,
    });
  }
  return results.slice(0, 60);
};
```

For one-off sanity checks on a single title (e.g. "Canva Brand Kit" banner), prefer this focused variant that targets the exact string:

```js
target => {
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = tw.nextNode())) {
    if (node.textContent.trim() === target) {
      const el = node.parentElement;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        fontVariationSettings: s.fontVariationSettings,
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    }
  }
  return null;
};
// call: script("Canva Brand Kit")
```

**Severity:**

| Drift                                                                                       | Severity | Flag                                   |
| ------------------------------------------------------------------------------------------- | -------- | -------------------------------------- |
| `font-variation-settings` axis wrong (opsz 100 on Text, opsz 0 on Title L/M, etc.)          | **HIGH** | `typography-axis-mismatch`             |
| `font-family` is `inherit`, or missing `"Canva Sans"` as first entry                        | **HIGH** | `typography-font-family-mismatch`      |
| `-webkit-font-smoothing` ≠ canva.com value (usually `antialiased`)                          | **HIGH** | `typography-smoothing-mismatch`        |
| `-moz-osx-font-smoothing` ≠ canva.com value (usually `grayscale`)                           | **HIGH** | `typography-smoothing-mismatch`        |
| `text-size-adjust` ≠ canva.com value (usually `none`)                                       | **HIGH** | `typography-size-adjust-mismatch`      |
| `font-feature-settings` has `"ss0X"` on a body-text node (only Title XL/L/M should have it) | **HIGH** | `typography-feature-settings-mismatch` |
| `color` hex ≠ token value (off-by-1 in any channel — `#0F1014` vs `#0F1015`)                | **HIGH** | `typography-color-token-mismatch`      |
| `font-size`, `font-weight`, `line-height` diff                                              | **HIGH** | `typography-metric-mismatch`           |

**A slot does not pass until every text node's fingerprint is exact-match with canva.com. "Looks right at my viewport" is not acceptable — these drifts hide in Mac-only rendering.**

### Diff against slot-porter §3b-2 measurement JSON

If `{{workspaceDir}}/{{slot}}-typography.json` exists (it should — slot-porter Step 3b-2 makes it mandatory before any typography CSS is written), diff the prototype's TreeWalker output against it pair-by-pair (match on `text`, fall back to `role + position` when text is dynamic). Any mismatch on any of these properties is **HIGH severity** and blocks the port:

- `fontSize`
- `lineHeight`
- `fontWeight`
- `letterSpacing`
- `fontVariationSettings`
- `fontFeatureSettings`

No ±1px tolerance on typography — exact match is the bar. If the canva.com span reports `-1px` letter-spacing and the prototype reports `normal`, that is a fail, not a rounding noise.

If the JSON is missing, the slot cannot pass regardless of how it looks — the porter skipped §3b-2, and the port is unverifiable. Send it back.

---

### 1e-3c. Layout/spacing parent-chain diff (MANDATORY for any slot with padding/margin/gap/min-height)

Parallel to 1e-3b (typography) but for spacing. The slot-porter Step 3b-3 gate saves `{{workspaceDir}}/{{slot}}-layout.json` with one entry per ancestor in the canva.com parent chain (innermost → outermost, ≥10 levels). The validator must reproduce the same chain-walk on the prototype and diff.

**Probe script — run on both canva.com and prototype, starting from the slot's anchor element:**

```js
anchorEl => {
  const chain = [];
  let el = anchorEl;
  for (let i = 0; i < 12 && el; i++) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    chain.push({
      tag: el.tagName,
      cls: (el.className?.toString() || '').slice(0, 50),
      x: Math.round(r.left),
      y: Math.round(r.top),
      w: Math.round(r.width),
      h: Math.round(r.height),
      pt: cs.paddingTop,
      pb: cs.paddingBottom,
      pl: cs.paddingLeft,
      pr: cs.paddingRight,
      mt: cs.marginTop,
      mb: cs.marginBottom,
      gap: cs.gap,
      display: cs.display,
      alignItems: cs.alignItems,
      justifyContent: cs.justifyContent,
    });
    el = el.parentElement;
  }
  return chain;
};
```

Match canva.com chain vs prototype chain level-by-level (allow the prototype to be shorter if it merges wrappers — but the outer boundary's `height`, `y`, `bottom` must still match).

| Check                                                                                                  | Severity   | Code                              |
| ------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------- |
| Outermost slot wrapper `height` differs by >2px                                                        | **HIGH**   | `layout-container-height-drift`   |
| Outermost slot wrapper `bottom` differs by >2px (breaks positioning of next section)                   | **HIGH**   | `layout-container-bottom-drift`   |
| Any ancestor's `paddingTop/Bottom/Left/Right` differs from JSON (and the slot's outer box also drifts) | **HIGH**   | `layout-padding-missing`          |
| Any flex/grid ancestor's `gap` differs from JSON                                                       | **HIGH**   | `layout-gap-missing`              |
| Any ancestor's `alignItems` or `justifyContent` differs (flex only)                                    | **MEDIUM** | `layout-flex-alignment-drift`     |
| Any ancestor's `marginTop/Bottom` differs                                                              | **HIGH**   | `layout-margin-missing`           |
| Prototype chain MISSING an ancestor that canva.com has with non-zero padding/margin/gap                | **HIGH**   | `layout-ancestor-wrapper-missing` |

**Key rule:** if the slot's outermost container `height` and `bottom` match canva.com to ±2px, intermediate wrapper merging is allowed (e.g. merging `outer padding 48/0/16 + inner padding-bottom 56` into `outer padding 48/0/72`). But if the outer box drifts, every non-zero spacing property in canva.com's chain MUST appear somewhere in the prototype's chain.

If the JSON is missing, the slot cannot pass — the porter skipped §3b-3. Send it back.

---

### 1e-4. Menu-backed list row-gap check (MANDATORY for any Menu / ContextualNav / Sidebar / dropdown / tree-menu slot)

Any list that the source renders via Menu carries a `grid-gap` equal to the variant's `--internalSpacing` — typically 4px for `regularRounded` / `regularSquare`. Dropping that gap causes cumulative drift: row N is `(N-1) × gap` px above its canva.com position.

**Measurement script** (run on both prototype and canva.com, compare):

```js
() => {
  // Replace the selector with the Menu container under test
  const anchors = document.querySelectorAll(
    'nav[aria-label="Secondary navigation"] a, nav[aria-label="Secondary navigation"] [role="menuitem"]',
  );
  return Array.from(anchors)
    .map(a => {
      const r = a.getBoundingClientRect();
      return {
        text: a.textContent?.trim().slice(0, 40),
        top: Math.round(r.top),
        height: Math.round(r.height),
      };
    })
    .filter(r => r.height >= 28 && r.height <= 56); // exclude the outer container
};
```

For each pair of adjacent rows inside a single Menu, compute `gap = row[N+1].top - row[N].top - row[N].height` and compare to the variant's `--internalSpacing`:

| Prototype gap | canva.com gap        | Severity if mismatch                   |
| ------------- | -------------------- | -------------------------------------- |
| Between rows  | equals variant value | **HIGH** `menu-row-gap-missing`        |
| First row top | equals canva.com     | **HIGH** `menu-first-row-top-mismatch` |

If drift is progressive (grows by a constant N px per row), the Menu variant gap was dropped — send back to slot-porter to apply Step 3a-4 (wrap items in a `.menu` container with `display: flex; flex-direction: column; gap: <variant value>`).

Do not confuse Menu-inter-item gap with section-to-section gap; those are separate rules. Sections can touch their first Menu item (gap 0) while items within the Menu are spaced by `--internalSpacing`.

---

### 1f. For each visual FAIL — find the source explanation

When a visual check fails, the cause is **always in the source code**. Find it:

1. Read the prototype TSX at `src/pages/<PageName>/<SlotName>/index.tsx`
2. Read the monorepo source TSX at `~/canva/web/src/<sourcePath>`
3. Identify which element is missing or wrong
4. Find the specific source lines that render that element

Do NOT prescribe what the visual should look like based on screenshots alone. The source code explains what should be there.

Report the visual failure with a source reference:

```json
{
  "element": "WonderBox gradient hero + heading",
  "visualCheck": "fail",
  "sourceFile": "pages/home/wonder_box/page/wonder_box.tsx",
  "sourceLines": "lines 40-85: gradient background div + Title 'What will you design today?'",
  "prototypeIssue": "Prototype only renders SearchBar. Heading and gradient background were stripped without valid deviation reason."
}
```

---

## Step 2 — Source inventory check (SECONDARY)

For each slot, read:

1. Every source `.tsx` file listed in `.porter-workspace/<PageName>/audits/<slotName>.json → sourceFiles`
2. The prototype TSX at `src/pages/<PageName>/<SlotName>/index.tsx`
3. The port result at `.porter-workspace/<PageName>/results/<slotName>.json` (for the `deviations[]` log)

Build a list of every visually-rendered element from the source. Check each item against the prototype.

### a) Element presence

- Element present in source, present in prototype → **PASS**
- Element present in source, absent in prototype, logged in deviations with valid reason (`logic` or `vite`) → **Note (acceptable)**
- Element present in source, absent in prototype, logged in deviations with reason `dom-complexity` → **HIGH severity** — `dom-complexity` is not a valid deviation reason
- Element present in source, absent in prototype, NOT in deviations → **HIGH severity** `missing-element`

Pay attention to:

- Item lists: every nav item, carousel item, filter option from source constants
- Badges and secondary labels: `badge: "New"`, notification dots, item subtitles
- Icon presence: if source passes `icon={SomeIcon}` the prototype must render that icon
- Gradient/background layers: decorative backgrounds, `::after` pseudo-elements in CSS

### b) Easel component fidelity

For every entry in `easelComponentSpec` from the audit file, find the matching component usage in the prototype TSX:

| Source                     | Prototype                                | Severity |
| -------------------------- | ---------------------------------------- | -------- |
| `<Box ...>`                | `<div ...>`                              | HIGH     |
| `<Rows spacing="2u">`      | `<div style={{ gap: '16px' }}>`          | HIGH     |
| `<CircleButton ...>`       | `<button className={styles.btn}>`        | HIGH     |
| `<CardImageThumbnail ...>` | `<div style={{ backgroundColor: ... }}>` | HIGH     |
| `<Card ...>`               | `<div className={styles.fakeCard}>`      | HIGH     |
| `paddingX="3u"`            | `paddingX="2u"`                          | HIGH     |
| `gap="2u"`                 | `gap="1u"`                               | HIGH     |
| `spacing="2u"`             | prop missing                             | HIGH     |
| `variant="primary"`        | `variant="secondary"`                    | HIGH     |

**Replacing any Easel component with a plain `div` or `span` is always HIGH severity**, regardless of whether it was documented in deviations.

### c) CSS values fidelity

For each row in `auditTable` from the audit file, check the corresponding CSS:

- Value matches source-derived value → **PASS**
- Value differs, documented in `deviations[]` → **Note**
- Value differs, NOT in deviations → **MEDIUM severity** `css-value-mismatch`

### d) Undocumented deviations

Any prototype deviation from source not listed in `deviations[]` is HIGH severity:

```json
{
  "element": "container Box",
  "property": "undocumented-deviation",
  "expected": "<Box paddingX=\"3u\" gap=\"2u\"> (source: wonder_box.tsx line ~45)",
  "actual": "<div style={{ padding: '24px', gap: '16px' }}>",
  "severity": "high",
  "sourceFile": "pages/home/wonder_box/page/wonder_box.tsx"
}
```

---

## Step 3 — Write per-slot validation report

Write to `.porter-workspace/<PageName>/validation/<slotName>.json`:

```json
{
  "slotName": "WONDER_BOX",
  "visualGrade": "fail",
  "pass": false,
  "visualFailures": [
    {
      "element": "gradient hero + heading",
      "visualCheck": "fail",
      "sourceFile": "pages/home/wonder_box/page/wonder_box.tsx",
      "sourceLines": "lines 40-85",
      "prototypeIssue": "Heading and gradient stripped without valid deviation reason"
    }
  ],
  "mismatches": [
    {
      "element": "WonderBox hero heading",
      "property": "missing-element",
      "expected": "<Title size='large'>What will you design today?</Title> (source: wonder_box.tsx ~L52)",
      "actual": "absent",
      "severity": "high",
      "sourceFile": "pages/home/wonder_box/page/wonder_box.tsx"
    }
  ]
}
```

**Do NOT edit any source files. Do NOT attempt to fix mismatches. Report only.**

Report to orchestrator:

- `pass`: `true` only if both visual grade is ✅ PASS (or ⚠️ WARN) AND no HIGH source mismatches
- Visual grade per slot
- For each visual FAIL or HIGH mismatch: which source file + lines contain the answer

---

## Severity definitions

| Severity | Meaning                                                                                                                                                                                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HIGH     | Visual section missing; Easel component replaced with div; undocumented deviation; `dom-complexity` used as reason; geometry off by >1px (1d); `display` / `grid-template-rows` / `line-height` substitution (1d-2); hover-reveal affordance broken (1e-2); affordance count mismatch vs canva.com (1e-3) |
| MEDIUM   | CSS value differs from source and not documented; computed style mismatch (1e) undocumented; documented deviation changes visual output; padding/margin/gap substitution (1d-2); hover-reveal missing transition (1e-2)                                                                                   |
| LOW      | Minor value difference within tolerance (±1px, subpixel rounding)                                                                                                                                                                                                                                         |

---

## ⛔ Hard constraints

- **Read-only** — do NOT write to any file under `src/`. Emit reports only.
- **Visual comparison is REQUIRED** — do not skip it. If Chrome DevTools MCP is unreachable, stop and report the error.
- **`dom-complexity` is never a valid deviation reason** — any deviation logged with this reason is treated as HIGH severity
- **Every visual FAIL must have a source file reference** — find the monorepo file that renders the missing element
- **Every HIGH mismatch must reference a specific source file** — the orchestrator needs this to direct the slot-porter retry
