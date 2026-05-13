---
path: src/pages/home/Templates
component: Templates
parent: src/pages/home
routes:
  - /templates
---

# Feature: Templates

## AI Focus Context

**Shorthand**: `@templates`  
**Activation**: Use `@templates`, "Context: Templates", or "Working on templates"

### Primary Scope (Templates-specific)

**ONLY consider these files when in @templates context:**

```
src/pages/home/Templates/
├── index.tsx                    # Main Templates component
├── Templates.module.css         # Styles
└── components/                  # Templates-specific components
    ├── TemplatePills/           # Category filter pills
    ├── TemplateTypeCarousel/    # Template type carousel
    └── TemplateSectionCarousel/ # Template section with carousel
```

### Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/shared_components/Header/` - Header system
- `src/pages/home/components/` - Shared home components
  - `GradientText/` - Gradient text heading
  - `ShortcutCarousel/` - Quick action shortcuts
  - `Wonderbox/` - Search functionality
  - `MobilePageLayout/` - Mobile layout wrapper
- `src/hooks/useAppContext.ts` - Global state
- `src/hooks/useIsMobile.ts` - Mobile detection
- Easel components from `@canva/easel`

### Explicitly IGNORE

**Never read, mention, or consider these:**

- ❌ `src/pages/home/Home/index.tsx` - different page (main Home page)
- ❌ `src/pages/home/Brand/` - different page
- ❌ `src/pages/home/Projects/` - different page
- ❌ `src/pages/home/Apps/` - different page
- ❌ `src/pages/home/Creator/` - different page
- ❌ `src/pages/home/CanvaAI/` - different page
- ❌ `src/pages/Editor/` - different context
- ❌ `src/pages/SignedOut/` - different context
- ❌ All other pages

### AI Instructions

When `@templates` context is active:

1. ✅ **READ ONLY** Templates page files
2. ✅ **FOCUS ON** template discovery and browsing
3. ❌ **NEVER mention** other pages in Home directory or Editor
4. ✅ **CONSIDER** multiple carousel sections with varying card sizes
5. ✅ **PRIORITIZE** template browsing UX and masonry layouts

## Responsibility

**What it does:**
- Displays template library with various categories
- Provides template discovery with search and filtering
- Handles template browsing with multiple carousel sections
- Shows templates in various layouts (carousels, masonry grid)
- Organizes templates by theme and category
- Provides "Explore templates" 2-row carousel

**What it never does:**
- Does not create or edit templates
- Does not handle custom user designs (that's Projects page)
- Is not for brand templates (that's Brand page)
- Does not manage template creation workflow

## Key Entry Points

- **Primary Logic**: `src/pages/home/Templates/index.tsx`
- **Mobile Version**: Included in main component with conditional rendering
- **Styling**: `Templates.module.css`
- **Routes**: `/templates`

## Module Boundaries

- **Parent**: Sub-page of `Home`
- **Shared Components**:
  - `@/pages/home/components/GradientText/` - Hero text
  - `@/pages/home/components/ShortcutCarousel/` - Quick shortcuts
  - `@/pages/home/components/Wonderbox/` - Search and tabs
  - `@/pages/home/components/MobilePageLayout/` - Mobile wrapper
- **Local Components** in `components/`:
  - `TemplatePills/` - Category filter pills for mobile
  - `TemplateTypeCarousel/` - Explore templates carousel
  - `TemplateSectionCarousel/` - Reusable template section with carousel
- **Export**: Default Templates component

## Local Patterns

### Section Layout Pattern
Multiple template sections with different card dimensions:
- **Explore templates**: 225x80 cards in 2-row carousel (20 items)
- **Inspired by your designs**: 455x256 cards (12 items)
- **Discover Canva**: Variable width (200-320px), 256px height
- **Trending near you**: Variable width (220-300px), 256px height
- **What's new**: 320x112 cards (12 items)
- **More templates for you**: Masonry grid with variable dimensions

### Masonry Grid Pattern
Final section uses the `Masonry` component (Easel):
- Target row height: 180px
- Gutter: 12px
- Variable widths: 200, 220, 240, 260, 280px
- Variable heights: 120-400px range
- 30+ items for infinite scroll feel

### Mobile Layout
- Uses MobilePageLayout wrapper
- TemplatePills for category filtering
- 2-row carousel for "Explore templates"
- Multiple TemplateSectionCarousel components
- Same masonry grid at bottom

### Desktop Layout
- Hero with GradientText
- Wonderbox with "templates" initial tab
- ShortcutCarousel for quick actions
- Multiple carousel sections with varying card sizes
- Masonry grid for "More templates"

## Alternative Names

- "Templates page", "Template library", "Template browser", "Design templates", "Template gallery", "Template marketplace", "Ready-made designs", "Template collection"

## Development Notes

- Wonderbox initializes with "templates" tab active
- Card dimensions vary significantly between sections
- Desktop uses 225x80 2-row carousel for "Explore templates"
- Mobile uses responsive 227x128 cards in carousels
- Masonry grid provides Pinterest-like browsing experience
- All template cards use Easel Placeholder components
- ShortcutCarousel only shows on desktop
- Mobile has simplified layout with fewer sections
- Border radius: 8px for all template cards
- All carousels use circular button variant
- Gutter size: "medium" for most carousels

