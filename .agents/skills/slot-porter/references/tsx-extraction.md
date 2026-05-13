# TSX Extraction Reference

## The two valid reasons to deviate from monorepo source

Only two reasons justify changing or removing code from the monorepo. Every deviation must be logged.

| Code    | Reason            | When to apply                                                                                       |
| ------- | ----------------- | --------------------------------------------------------------------------------------------------- |
| `vite`  | Vite incompatible | The code would crash, fail to compile, or produce a runtime error in Vite                           |
| `logic` | Non-visual logic  | DI/IoC hooks, API calls, analytics, MobX stores, proto types, loading states, feature flag services |

**`dom-complexity` has been removed.** It was being used to justify replacing real UI components with placeholder divs. That is never valid.

**If you cannot identify which of these two reasons applies, keep the monorepo code.**

"It's complex" is not a reason. "I don't understand it" is not a reason. Read the source, understand it, then transplant it.

---

## Simulation as last resort

When a pattern genuinely cannot be transplanted (blocked by `vite` or `logic`), try to **simulate it with prototype-compatible code** before falling back to a stripped placeholder. A simulation preserves the visual and structural intent using React primitives.

| Pattern                                        | Preferred simulation                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `BasicButtonLink` (webx routing)               | `<a href="#">` — the source card CSS explicitly notes `display: block` for `<a>` elements |
| `withDimensions` HOC (ResizeObserver)          | `useState` + `useEffect` + `window.innerWidth` listening on resize                        |
| MobX `@observable` view state                  | `React.useState`                                                                          |
| Factory-pattern filter (requires 10+ services) | Static `BaseSelect` with same `Pill` trigger shape, mock options from source messages     |
| Navigation `onClick`                           | `useNavigate` from `react-router-dom`                                                     |
| `featureFlag(...)`                             | `true` or `false` inline                                                                  |

**Log the simulation as a deviation with reason `logic` or `vite`** and describe what was simulated.

Only use a stripped placeholder (`{/* STRIPPED */}`) when simulation would be significantly more code than the visual element is worth.

---

## The critical distinction: component structure vs live content

Many components display live user data (real design thumbnails, real file names, real timestamps). The response to this is:

- **Keep the component** — `CardImageThumbnail`, `Card`, `CardThumbnail`, `Avatar` are Easel components that work perfectly in Vite. Use them.
- **Mock the data** — pass a placeholder `src`, static title strings from fakes.ts, a placeholder avatar URL. The content is mocked; the component is real.

**WRONG:**

```tsx
{
  /* STRIPPED [dom-complexity]: card grid too complex */
}
<div className={styles.fakeCard}>
  <div className={styles.fakeThumbnail} style={{ backgroundColor: '#6366f1' }} />
  <span>Design title</span>
</div>;
```

**RIGHT:**

```tsx
{
  /* Live thumbnail src mocked [logic]: real src requires API */
}
<CardImageThumbnail src={PLACEHOLDER_THUMBNAIL} aspectRatio="4:3" title={fakeDesign.title} />;
```

The card structure, aspect ratio, title layout, badge chrome — all come from the Easel component. Only the `src` URL is mocked.

---

## What to strip (Reason: `logic`)

| Monorepo pattern                                         | Prototype replacement                                           |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| `import { Messages } from './component.messages'`        | Read the `.messages.ts` file and inline string literals         |
| `import type { SomeProto } from 'services/...'`          | Define simple local TypeScript type inline                      |
| `useAppContext()`, `useSidebarVisible()`, other DI hooks | Remove. Use static values.                                      |
| `useScaledFallbackFontStyles({...})`                     | Remove entirely                                                 |
| `loading={requestState === 'loading'}`                   | Set to `false`                                                  |
| `doNotRecordClassName`                                   | Remove                                                          |
| MobX `@observable`, `@action`, `makeAutoObservable`      | Replace with React `useState`/`useReducer`                      |
| Proto types (`AccountSelectorUserProto`)                 | Define simple mock type inline                                  |
| Analytics `onClick` handlers                             | Remove; preserve visual-only handlers                           |
| Feature flag checks (`isFeatureEnabled(...)`)            | Replace with `true` or `false` based on what the source renders |
| Real API data fetching (`useQuery`, `useSuspense`, etc.) | Replace with static data from fakes.ts or inline mock array     |
| WebSocket / real-time data                               | Replace with static snapshot data                               |

### What does NOT qualify as `logic`

These are visual components — they work in Vite and must be kept:

- `CardImageThumbnail`, `Card`, `CardThumbnail` — use with mocked src/data
- `Avatar` — use with a placeholder image URL
- `Title`, `Text` — keep; inline the string from `.messages.ts`
- Any heading, gradient, background, decorative element — keep verbatim
- `Carousel`, `CarouselItem` — keep; use static item array
- `Rows`, `Columns`, `Box`, `Grid`, `Inline` — always keep

---

## What to strip (Reason: `vite`)

| Monorepo pattern                                      | Prototype replacement                                       |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| `import styles from 'some/other/package.css'`         | Copy the CSS locally                                        |
| Worker imports, dynamic `import()` for code-splitting | Inline the import statically                                |
| Monorepo-internal service imports with DI containers  | If visual output is needed, replicate the component locally |

---

## What NOT to strip

**Easel component imports** — these all work via Vite aliases:

```tsx
import { Box } from 'ui/base/box/box';
import { Button, NeutralButton, CircleButton } from 'ui/base/button/button';
import { Avatar } from 'ui/base/avatar/avatar';
import { CardImageThumbnail } from 'ui/base/card/card';
import { Card, CardThumbnail, CardTitle, CardDescription } from 'ui/base/card/card';
import { ThemeBoundary } from 'ui/base/theme/theme';
import { InheritColor, Text, Title } from 'ui/base/typography/typography';
import { Column, Columns, Rows, Spacer, Inline, Grid } from 'ui/base/layout/layout';
import { Pill } from 'ui/base/pill/pill';
import { ImageThumbnail } from 'ui/base/thumbnail/thumbnail';
```

**Visual structure elements** — headings, gradients, background layers, decorative elements. These are never stripped.

**Easel layout props** — not optional:

```tsx
// CORRECT — copy verbatim
<Box paddingX="3u" paddingY="2u" gap="1u" display="flex" flexDirection="column">

// WRONG — never do this
<div style={{ padding: '24px 16px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
```

**CSS class names** — copy `className={styles.container}` exactly as written.

**JSX structure** — `<Rows>`, `<Columns>`, `<Inline>`, `<Grid>`, `<Spacer>` must be preserved.

**Render order** — the order items appear in the source render tree is the order they render.

**Conditional renders** — replace the condition with a static value; keep the element.

---

## Mock data — hierarchy of sources

When a component needs data that requires a live API:

1. **Read `fakes.ts`** in the slot's source directory — this is the canonical mock data for this component
2. **Read `stories/` files** — story data shows realistic mock shapes
3. **Read the TypeScript type** of the data prop and construct minimal mock matching that shape
4. **Never invent card content wholesale** — use types from source to shape the mock

For card grids specifically: use 6–8 mock items with distinct titles and placeholder thumbnail URLs. Never use `backgroundColor` hacks as a substitute for the thumbnail component.

---

## Deviation documentation

Add an inline comment at every deviation point:

```tsx
{
  /* STRIPPED [vite]: DI hook useAppContext — replaced with static mock */
}
{
  /* STRIPPED [logic]: analytics onClick handler */
}
{
  /* MOCKED [logic]: thumbnail src — real src requires API; using placeholder */
}
```

And an entry in the port result `deviations[]` array.

---

## Navigation

```tsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
// onClick={() => navigate('/')}
```

---

## ThemeBoundary — render prop pattern

```tsx
<ThemeBoundary light="dark" dark="dark" classicLight="dark" classicDark="dark">
  {data => <div className={data.className}>{/* children */}</div>}
</ThemeBoundary>
```

All four appearance props must be set. `data.className` must be applied to the immediate child element.

---

## CSS imports

All CSS imported by prototype TSX must be local `.module.css`. Copy the CSS locally and apply all `@value` transforms.

---

## Source comment

Always add at the top of every index.tsx:

```tsx
// Prototype transplanted from: pages/<section>/<component>/<component>.tsx
// Deviations: see .porter-workspace/<PageName>/results/<slotName>.json
```
