# Token Values Reference (Rule Z)

Never guess CSS values. Every token must be resolved to a concrete value.

## Spacing tokens (`ui/base/tokens/primitive/private/space.css`, `baseUnit = 8px`)

| Token      | Value | Calculation |
| ---------- | ----- | ----------- |
| `space025` | 2px   | 0.25 × 8px  |
| `space050` | 4px   | 0.5 × 8px   |
| `space100` | 8px   | 1 × 8px     |
| `space150` | 12px  | 1.5 × 8px   |
| `space200` | 16px  | 2 × 8px     |
| `space300` | 24px  | 3 × 8px     |
| `space400` | 32px  | 4 × 8px     |
| `space600` | 48px  | 6 × 8px     |
| `space800` | 64px  | 8 × 8px     |
| `baseUnit` | 8px   | —           |

Easel layout shorthand:

```
'1u' = 8px    '2u' = 16px    '3u' = 24px    '4u' = 32px
'5u' = 40px   '6u' = 48px    '8u' = 64px    '10u' = 80px
'12u' = 96px
```

## Border radius (`ui/base/tokens/private/radius.css`)

| Token                   | Value             |
| ----------------------- | ----------------- |
| `radiusElementSharpest` | 2px               |
| `radiusElementSharp`    | 4px               |
| `radiusElementStandard` | **8px** ← NOT 6px |
| `radiusElementSoft`     | 12px              |
| `radiusElementRound`    | 9999px            |
| `radiusContainerSoft`   | 12px              |
| `radiusContainerLarge`  | 16px              |

## Sizing

| Expression            | Value                              |
| --------------------- | ---------------------------------- |
| `calc(4 * baseUnit)`  | 32px                               |
| `calc(5 * baseUnit)`  | 40px (default Easel Button height) |
| `calc(7 * baseUnit)`  | 56px                               |
| `calc(10 * baseUnit)` | 80px (nav header height)           |

## Font weight (`ui/base/tokens/primitive/private/font_weight.css`)

| Token           | Value |
| --------------- | ----- |
| `fontWeight400` | 400   |
| `fontWeight500` | 500   |
| `fontWeight600` | 600   |
| `fontWeight700` | 700   |

## Font size tokens

| Token        | Value                                      |
| ------------ | ------------------------------------------ |
| `fontSize14` | `calc(14 * var(--pxInRem, 0.1rem))` ≈ 14px |
| `fontSize18` | `calc(18 * var(--pxInRem, 0.1rem))` ≈ 18px |

## Typography size props → rendered values (`pxInRem = 0.1rem`)

| Component prop       | Font size | Line height    |
| -------------------- | --------- | -------------- |
| `Text size="xsmall"` | 11px      | 16px           |
| `Text size="small"`  | 12px      | 18px           |
| `Text size="medium"` | 14px      | 22px (default) |
| `Text size="large"`  | 16px      | 24px           |

## Breakpoints (`ui/base/metrics/metrics.css`)

| Name         | Inline value          | Breakpoint |
| ------------ | --------------------- | ---------- |
| `smallUp`    | `(min-width: 600px)`  | 600px      |
| `mediumUp`   | `(min-width: 900px)`  | 900px      |
| `largeUp`    | `(min-width: 1200px)` | 1200px     |
| `xLargeUp`   | `(min-width: 1650px)` | 1650px     |
| `belowSmall` | `(max-width: 599px)`  | —          |
| `baseUnit`   | `8px`                 | —          |

## Theme selectors (`ui/base/theme/theme.css`)

| Token        | Inline value      |
| ------------ | ----------------- |
| `themeLight` | `:global(.light)` |
| `themeDark`  | `:global(.dark)`  |

## Header/nav metrics

| Token/value         | Resolved                             |
| ------------------- | ------------------------------------ |
| `navContentHeight`  | `80px` (if page has header) or `0px` |
| `contentHeight`     | `calc(10 * 8px)` = 80px              |
| `maxContainerWidth` | `1920px` ← NOT 1440px                |

## Page horizontal padding (`pages/anon_home/ui/metrics/metrics.css`)

| Name                          | Value |
| ----------------------------- | ----- |
| `mobilePageHorizontalPadding` | 24px  |
| `tabletPageHorizontalPadding` | 48px  |
| `pageHorizontalPadding`       | 32px  |

## Primary nav color tokens (light theme)

| Purpose                             | Token                 | Value                           |
| ----------------------------------- | --------------------- | ------------------------------- |
| Default/hover icon + label          | `colorPurple09` @ 80% | `rgba(74, 46, 126, 0.8)`        |
| Active icon                         | `colorPurple07`       | `#7630D7` = `rgb(118, 48, 215)` |
| Active label (different from icon!) | `colorPurple08`       | `#612DAE` = `rgb(97, 45, 174)`  |
| Hover/active icon background        | `colorPurple07` @ 10% | `rgba(118, 48, 215, 0.1)`       |
