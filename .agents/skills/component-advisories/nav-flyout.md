# Advisory: Nav Flyout

Load this only when `requiredAdvisories` includes `navFlyout`.

Source: `ui/nav/redesign/portable/header/menu_bar.tsx` + flyout components.

---

## Opening behavior

The Canva header nav flyout opens on **`onMouseEnter`**, not `onClick`.

- **Opens**: `onMouseEnter` on a nav button → set `openMenu` state + capture `getBoundingClientRect()`
- **Slides**: CSS `transition: left 300ms cubic-bezier(0.68,0,0.23,1)` enabled after first paint (via `requestAnimationFrame` → `positioned` state)
- **Closes on**: outside `pointerdown` (document listener, excluding flyout and nav buttons), `Escape` key, window `scroll`
- **Does NOT close on**: mouseLeave from the nav button or flyout

## isInitialOpen tracking

When the flyout opens from a fully closed state, `isInitialOpen = true`. This controls whether items animate with a stagger (initial open) or a simple fade (menu switch).

```tsx
const handleNavHover = (item: string, e: React.MouseEvent<HTMLButtonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setIsInitialOpen(openMenu === null); // true only from fully closed state
  setOpenMenu(item);
  setAnchorRect(rect);
};
```

## Animation tokens

```
duration01 = 100ms    duration03 = 200ms    duration05 = 300ms    duration07 = 400ms
emphasised            = cubic-bezier(0.68, 0, 0.23, 1)
emphasisedDecelerate  = cubic-bezier(0, 0, 0.13, 1)
```

## Flyout animations

- `surfaceExpand`: height 279px→385px, 300ms emphasisedDecelerate, fires on mount
- Item stagger (initial open): 400ms emphasisedDecelerate, `calc(var(--itemIndex) * 25ms)` delay
- Menu switch (slide): 200ms emphasised fadeIn, triggered by `key={menuKey}` forcing remount

## Placement

The flyout renders **outside** the collapse wrapper in the header JSX so it isn't clipped by `overflow: hidden`. See scroll-aware-header.md for the JSX structure.
