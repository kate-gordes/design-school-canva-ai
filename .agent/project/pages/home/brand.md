---
path: src/pages/Home/Brand
component: Brand
parent: src/pages/Home
routes:
  - /brand
critical_patterns:
  - useBrandKitState hook MUST be used for all brand kit access
---

# Feature: Brand

## AI Focus Context

**Shorthand**: `@brand`  
**Activation**: Use `@brand`, "Context: Brand", or "Focus: Brand page"

### Primary Scope (Brand-specific)

**ONLY consider these files when in @brand context:**

```
src/pages/Home/Brand/
├── index.tsx                    # Main Brand component
├── MobileBrand.tsx              # Mobile version
├── Brand.module.css             # Styles
├── components/ui/               # Brand-specific components
│   ├── BrandPanel/              # Reusable brand panel
│   ├── BrandKitSelector/        # Brand kit dropdown
│   ├── BrandComponents/         # Asset display components
│   └── EmptyBrandKitSection/    # Empty states
├── views/                       # 20+ asset category views
│   ├── AllAssets.tsx
│   ├── Logos.tsx
│   ├── Colors.tsx
│   ├── Fonts.tsx
│   ├── Photos.tsx
│   ├── Templates.tsx
│   └── [15+ more views]
└── data/                        # Brand data layer
    ├── state.ts                 # Brand kit state
    ├── hooks.ts                 # useBrandKitState hook
    ├── types.ts                 # TypeScript interfaces
    ├── brandKits.json           # Brand kit data
    ├── imageLoader.ts           # Dynamic image loading
    ├── images.ts                # Image system
    └── index.ts                 # Central export
```

### Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/shared_components/Header/` - Header system
- `src/shared_components/ContextualNav/BrandContextualNav.tsx` - Brand nav
- `src/hooks/useAppContext.ts` - Global state hook
- `src/hooks/useBrandKitState.ts` - Brand state hook (CRITICAL - always use this)
- Easel components from `@canva/easel`

### Explicitly IGNORE

**Never read, mention, or consider these:**

- ❌ `src/pages/Home/Home/index.tsx` - different page (main Home page)
- ❌ `src/pages/Home/Projects/` - different page
- ❌ `src/pages/Home/Templates/` - different page
- ❌ `src/pages/Home/Apps/` - different page
- ❌ `src/pages/Home/Creator/` - different page
- ❌ `src/pages/Home/CanvaAI/` - different page
- ❌ `src/pages/Editor/` - completely different context
- ❌ `src/pages/SignedOut/` - different context
- ❌ All other pages and features

### AI Instructions

When `@brand` context is active:

1. ✅ **READ ONLY** files in Primary Scope
2. ✅ **CONSIDER ONLY** Allowed Shared Dependencies
3. ❌ **NEVER mention** files in Explicit Ignore list
4. ✅ **ALWAYS use** `useBrandKitState` hook for brand kit access
5. ✅ **Stay focused** on Brand page features only

## Responsibility

**What it does:**
- Manages brand asset library (logos, colors, fonts, guidelines)
- Handles multi-brand kit support with switching
- Provides asset viewing by category (20+ asset types)
- Integrates brand panel for Editor
- Manages complex brand kit state globally

**What it never does:**
- Does not create/edit individual brand assets (delegates to specific tools)
- Does not handle file uploads directly
- Is not for personal/non-brand designs

## Key Entry Points

- **Primary Logic**: `src/pages/Home/Brand/index.tsx`
- **Mobile Version**: `MobileBrand.tsx`
- **Styling**: `Brand.module.css`
- **Routes**: `/brand`

### Data Layer (Critical)

**Location**: `src/pages/Home/Brand/data/`

- **State Management**: `state.ts` - Brand kit state
- **Custom Hook**: `hooks.ts` - `useBrandKitState` (ALWAYS use this)
- **Types**: `types.ts` - TypeScript interfaces
- **Data Source**: `brandKits.json` - Brand kit data
- **Image System**: `imageLoader.ts`, `images.ts` - Dynamic image loading
- **Central Export**: `index.ts`

### Views (20+ Asset Categories)

**Location**: `src/pages/Home/Brand/views/`

Major views:
- `AllAssets.tsx` - Overview
- `Logos.tsx` - Logo management
- `Colors.tsx` - Color palettes
- `Fonts.tsx` - Typography
- `Photos.tsx`, `Photography.tsx` - Brand imagery
- `Templates.tsx` - Brand templates
- `Icons.tsx`, `Graphics.tsx` - Visual assets
- And 15+ more specialized views

## Module Boundaries

- **Parent**: Sub-page of `Home`
- **Shared Components**:
  - Uses shared Header component
  - Integrates with Editor via BrandPanel
- **Local Components** in `components/ui/`:
  - `BrandPanel/` - Reusable brand panel (used in Editor and Brand page)
  - `BrandKitSelector/` - Brand kit switching dropdown
  - `BrandComponents/` - Individual brand asset display components
  - `EmptyBrandKitSection/` - Empty states with guidance
- **Export**: Default Brand component

## Local Patterns

### Brand Kit State Pattern (Critical)

**ALWAYS** use `useBrandKitState` hook for brand kit access:

```typescript
const { currentBrandKit, setCurrentBrandKit } = useBrandKitState();
```

Brand kit state is managed globally and persists across views.

### View-Based Architecture
Each asset type has its own view component:
- Views are self-contained
- Views receive current brand kit from state
- Views handle their own layout and data display

### Dynamic Image Loading
Brand images loaded dynamically from `data/images/`:
- Images organized by brand kit
- Lazy loading for performance
- Image paths managed by `imageLoader.ts` and `images.ts`

## Alternative Names

- "Brand page", "Brand kit", "Brand assets", "Brand management", "Branding", "Style guide", "Brand hub", "Brand center", "Corporate branding", "Brand identity"

## Development Notes

- **ALWAYS** use `useBrandKitState` for brand kit access
- Brand images loaded dynamically from `data/images/`
- Each asset type has its own view component
- BrandPanel is reusable across multiple pages
- Empty states should guide users to add assets
- Mobile version has simplified layout
- Brand kit switching should update all views
- Asset data comes from `brandKits.json`
- Integration with Editor via BrandPanel component

