---
path: src/pages/home/Photos
component: Photos
parent: src/pages/home
routes:
  - /photos
---

# Feature: Photos

## AI Focus Context

**Shorthand**: `@photos`  
**Activation**: Use `@photos`, "Context: Photos", or "Working on photos"

### Primary Scope (Photos-specific)

**ONLY consider these files when in @photos context:**

```
src/pages/home/Photos/
├── index.tsx                    # Main Photos component
└── Photos.module.css            # Styles
```

### Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/shared_components/Header/` - Header system
- `src/pages/home/assets/thumbnails/` - Photo thumbnails (1-9.png)
- `src/hooks/useAppContext.ts` - Global state
- Easel components from `@canva/easel`

### Explicitly IGNORE

**Never read, mention, or consider these:**

- ❌ `src/pages/home/Home/index.tsx` - different page (main Home page)
- ❌ `src/pages/home/Brand/` - different page
- ❌ `src/pages/home/Projects/` - different page
- ❌ `src/pages/home/Templates/` - different page
- ❌ `src/pages/home/Apps/` - different page
- ❌ `src/pages/home/Creator/` - different page
- ❌ `src/pages/home/CanvaAI/` - different page
- ❌ `src/pages/Editor/` - different context
- ❌ `src/pages/SignedOut/` - different context
- ❌ All other pages

### AI Instructions

When `@photos` context is active:

1. ✅ **READ ONLY** Photos page files
2. ✅ **FOCUS ON** photo browsing and organization features
3. ❌ **NEVER mention** other pages in Home directory or Editor
4. ✅ **CONSIDER** carousel layouts and grid displays
5. ✅ **PRIORITIZE** photo discovery and browsing UX

## Responsibility

**What it does:**
- Displays user's photo library with thumbnails
- Provides photo browsing with carousel and grid layouts
- Organizes photos with AI-powered "People" section
- Shows photo metadata (file type, size)
- Handles photo display in multiple layouts
- Provides Magic icon-enhanced sections

**What it never does:**
- Does not handle photo editing (that's Editor or photo tools)
- Does not manage brand photos (that's Brand page)
- Is not for project management (that's Projects page)
- Does not provide template browsing

## Key Entry Points

- **Primary Logic**: `src/pages/home/Photos/index.tsx`
- **Styling**: CSS modules + Easel component props (token-driven)
- **Routes**: `/photos`

## Module Boundaries

- **Parent**: Sub-page of `Home`
- **Shared Components**:
  - Uses `Card`, `Carousel`, and `Grid` from Easel extensively (see `easel-prototype` for component rules)
  - Imports photo thumbnails from `@/pages/home/assets/thumbnails/`
- **Local Components**: All inline (no separate components folder)
- **Export**: Default Photos component

## Local Patterns

### Three-Section Layout

#### 1. Hero Carousel
- 9 items in horizontal carousel
- Card layout with vertical orientation
- 170px height thumbnails
- Shows file metadata (PNG/JPG, file size)
- Medium gutter, circular buttons
- Scale thumbnail hover effect

#### 2. People Section (AI-Powered)
- Magic icon indicates AI-powered feature
- Custom card layout with main image + grid
- Main image: 180px height
- Right side: 2x2 grid of smaller images (82px height each)
- Variable grid layout (1 or 2 columns per row)
- Each card wrapped in shadow box with border radius
- Bleed component for full-width carousel
- Dynamic name generation from sample data

#### 3. Main Grid
- Responsive grid: 1 column → 3 (smallUp) → 5 (mediumUp)
- 22 items total
- Same card style as hero carousel
- 2u spacing between items
- Centered alignment

### Data Generation Pattern
Uses helper functions for dynamic data:
- `generateThumbnails(size, random)` - Creates photo items
- `generatePeopleCards(size)` - Creates people section items
- Random file types, sizes, names from predefined options

### Card Rendering Functions
- `renderHeroCarousel(result)` - Standard photo cards
- `renderPeopleCarousel(result, index)` - Complex people cards

### Responsive Grid System
People card right images:
- Dynamically generates 1-2 images per row
- Ensures at least one row has 2 items
- Creates varied, organic layouts
- Uses a typed-column `Grid` with `1 | 2` columns to vary row layouts

## Alternative Names

- "Photos page", "Photo library", "Image gallery", "Photo browser", "Picture gallery", "Media library", "Photo collection", "Image library", "Photo manager"

## Development Notes

- All data generated dynamically from sample arrays
- Uses 9 imported thumbnails from assets
- File types: PNG, JPG (randomly selected)
- File sizes: 1.0-3.0 MB range
- Names: Ash and Carly, Carly, Andrew
- People section requires at least one row with 2 images
- Carousel button offset: 20px horizontal
- Border radius: 8px for card images
- Hero carousel uses "expand: medium" for better visibility
- Main grid responsive breakpoints: default/smallUp/mediumUp
- All carousels use circular button variant
- People section uses `Bleed` for full-width effect
- Restores sidebar and secondary nav visibility on mount
- Card hover effect: `scaleThumbnail`
- People cards have shadow and element border radius
- Grid spacing: `2u`

