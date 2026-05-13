# Advisory: Secondary Nav (Contextual Nav)

Load this only when `requiredAdvisories` includes `secondaryNav`. Applies to any 264-wide contextual / secondary navigation panel ported from `ui/nav/logged_in_shell/global_nav/contextual_nav/` or sibling schemas (e.g. brand kit sidebar, projects sidebar, brand-kit selector panels).

These rules are **generic** — they apply to every secondary-nav panel the prototype ports, regardless of which page it lives on.

---

## 1. Scrollbar is always hidden

The monorepo's production secondary nav has a scrollable inner region, but its scrollbar takes ~11 px of width when visible and reserves space (canva.com renders with `scrollbar-width: thin` on the scroll container, reducing inner content from ~232 to ~221 px). **The prototype hides the scrollbar entirely** — we do not reserve scrollbar space, and we do not render the thumb.

Always apply this to the scroll container:

```css
.scrollArea {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox + modern spec */
}
.scrollArea::-webkit-scrollbar {
  width: 0;
  height: 0;
}
```

**Consequence:** the prototype's inner content width is the full `264 − 2×16 = 232 px` (no scrollbar gutter to subtract). Nav item widths will be ~11 px wider than canva.com's — this is expected and correct for the prototype. Do not try to simulate the scrollbar gutter by adding `scrollbar-gutter: stable` or a fake padding; leave the full width available.

**Why:** we ported `/projects` and `/brand` with hidden scrollbars on canva.com's explicit guidance ("generally there is no vertical scrollbar on any of the secondary menus"). Every new secondary nav follows the same pattern.

---

## 2. Cosmetic `<button>` section headers — preserve the 1 px transparent border

Monorepo section-header components (e.g. `BrandKitSectionBlock`, `EditableGroupItem` used as a cosmetic heading) render a `<button>` with `border: 1px solid transparent` even though the button is non-interactive. This transparent border adds 1 px to the inside edge, pushing the title text 1 px right of surrounding nav-item labels.

If you strip the border (`border: none`), the header text aligns at the same x-coordinate as regular nav labels — which **looks subtly off** next to canva.com, because canva.com's border offsets it by 1 px.

**Rule:** when porting a cosmetic button header, copy the button's computed border rule verbatim — including `border-width`, `border-style: solid`, and `border-color: transparent` / `rgba(0,0,0,0)`. Keep `box-sizing: border-box` so the 1 px does not enlarge the outer width.

```css
/* ✓ Correct — matches canva.com's 1 px offset */
.groupHeader {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 4px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  box-sizing: border-box;
  /* ...remaining typography... */
}

/* ✗ Wrong — title text renders 1 px left of canva.com */
.groupHeader {
  /* ... */
  border: none;
}
```

**Verify via Chrome DevTools:** check computed `borderTopWidth` / `borderStyle` on the monorepo element. If `solid` with a non-zero width, port that border even when the color is transparent.

---

## 3. Click-behavior probe before porting collapse / toggle UI

Monorepo section headers often render as `<button>` elements with `aria-expanded` props in the source code — but production canva.com often ships them **non-interactive** (no click handler wired up). Before porting a chevron, `aria-expanded` state, or collapse animation, probe the live element: `document.querySelector(...).click()` and compare item y-positions before/after. If nothing moves, port the header as cosmetic (no chevron, no state, no toggle).

See also: `feedback_probe_click_behavior.md` in memory.

---

## 4. Nav-item badges: omit by default

Nav items in the monorepo occasionally carry trailing badges ("New", "Beta", count chips). These are **decorative** by default and are omitted from the prototype unless the user explicitly asks for them. See `slot-porter/SKILL.md` Step 3a-2 — the policy applies to nav-item badges as well as card badges.
