# Advisory: Scroll-Aware Header

Load this only when `requiredAdvisories` includes `scrollAwareHeader`.

Source: `ui/nav/redesign/portable/header/` — too service-heavy to import directly. Reconstruct locally using Easel primitives. See `src/pages/SignedOut2/CanvaHeader.tsx` as a reference implementation.

---

## Variant system

The header starts in an **initial variant** and switches to `standard` when `scrollY > 0`:

| Variant         | Background  | ThemeBoundary   | Login button                      | Logo             |
| --------------- | ----------- | --------------- | --------------------------------- | ---------------- |
| `overlay`       | transparent | `light="dark"`  | `NeutralButton variant="primary"` | `CanvaLogoWhite` |
| `overlay-light` | transparent | `light="light"` | `Button variant="primary"`        | `CanvaLogo`      |
| `standard`      | `#ffffff`   | `light="light"` | `Button variant="primary"`        | `CanvaLogo`      |

**Page-specific initial variants:**

- AnonHome: `overlay` — dark ThemeBoundary, white logo
- Download pages (Mac, Windows): `overlay-light` — light ThemeBoundary, color logo
- App-shell pages: `standard` always

**For `overlay-light`**: Only the background color fades on scroll. Logo, ThemeBoundary, and auth buttons stay the same as `standard`.

---

## Background fade

```css
.background {
  background-color: transparent;
  transition: background-color 200ms cubic-bezier(0.68, 0, 0.23, 1);
}
.background.scrolled {
  background-color: #ffffff;
}
```

Apply `.scrolled` when `scrollY > 0`.

---

## CollapseOnScroll behavior

Header slides off-screen when scrolling **down** > 40px; re-appears when scrolling **up**.

```css
.header {
  position: sticky;
  top: 0;
  z-index: 1;
  overflow: hidden;
}
.collapseContent {
  /* no transition initially */
}
.collapseContent.animated {
  transition: transform 200ms cubic-bezier(0.68, 0, 0.23, 1);
}
.collapseContent.collapsed {
  transform: translateY(-100%);
}
```

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
    if (!hasScrolledRef.current) {
      hasScrolledRef.current = true;
      setHasScrolled(true);
    }
    if (y > prevY && y > COLLAPSE_THRESHOLD) setIsExpanded(false);
    else if (y < prevY) setIsExpanded(true);
    setIsScrollTop(y === 0);
    lastScrollY.current = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);
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
  {/* Flyout renders OUTSIDE the collapse wrapper — so it isn't clipped */}
  {openMenu && anchorRect && <NavFlyout ... />}
</header>
```

---

## Overlay variant switching (AnonHome only)

```tsx
const isOverlay = isScrollTop;

<ThemeBoundary
  light={isOverlay ? 'dark' : 'light'}
  dark="dark"
  classicLight={isOverlay ? 'dark' : 'light'}
  classicDark="dark"
>
  {data => (
    <div className={data.className}>
      {isOverlay ? <CanvaLogoWhite /> : <CanvaLogo />}
      {/* nav */}
      {isOverlay ? (
        <NeutralButton variant="primary" size="small">
          Log in
        </NeutralButton>
      ) : (
        <Button variant="primary" size="small">
          Log in
        </Button>
      )}
    </div>
  )}
</ThemeBoundary>;
```

---

## Key specs

- Height: 80px
- Position: `sticky; top: 0`
- Max-width: `1920px`, centered
- Responsive padding: 24px (default) → 32px (≥900px) → 48px (≥1200px) → 64px (≥1650px)
