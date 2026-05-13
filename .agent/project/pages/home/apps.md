---
path: src/pages/Home/Apps
component: Apps
parent: src/pages/home
routes:
  - /apps
---

# Feature: Apps

## AI Focus Context

**Shorthand**: `@apps`  
**Activation**: Use `@apps`, "Context: Apps", or "Working on apps"

### Primary Scope (Apps-specific)

**ONLY consider these files when in @apps context:**

```
src/pages/Home/Apps/
├── index.tsx                    # Main Apps component
├── MobileApps.tsx               # Mobile version
├── Apps.module.css              # Styles
└── components/ui/               # Apps-specific components
    ├── AppCard/                 # Standard app card
    ├── AppBlock/                # Featured app block
    ├── AppVisualCard/           # Rich visual card
    ├── AppsCardList/            # List of app cards
    ├── AppSection/              # Grouped sections
    ├── Banners/                 # Promotional banners
    └── AppPageSpecificSections/ # Custom sections with data
```

### Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/shared_components/Header/` - Header system
- `src/shared_components/ContextualNav/AppsContextualNav.tsx` - Apps nav
- `src/shared_components/Search/` - Search functionality
- `src/shared_components/SearchPills/` - Category filters
- `src/hooks/useAppContext.ts` - Global state
- Easel components from `@canva/easel`

### Explicitly IGNORE

**Never read, mention, or consider these:**

- ❌ `src/pages/Home/Home/index.tsx` - different page (main Home page)
- ❌ `src/pages/Home/Brand/` - different page
- ❌ `src/pages/Home/Projects/` - different page
- ❌ `src/pages/Home/Templates/` - different page
- ❌ `src/pages/Home/Creator/` - different page
- ❌ `src/pages/Home/CanvaAI/` - different page
- ❌ `src/pages/Editor/` - different context
- ❌ `src/pages/SignedOut/` - different context
- ❌ All other pages

### AI Instructions

When `@apps` context is active:

1. ✅ **READ ONLY** Apps page files
2. ✅ **FOCUS ON** app marketplace features (discovery, cards, categories)
3. ❌ **NEVER mention** other pages in Home directory or Editor
4. ✅ **CONSIDER** multiple card variants for different contexts
5. ✅ **PRIORITIZE** app discovery and browsing UX

## Responsibility

**What it does:**
- Displays app marketplace for third-party integrations and extensions
- Provides app discovery with search and category filtering
- Handles app card display in various layouts
- Manages app installation/management flows
- Showcases featured apps and promotional content

**What it never does:**
- Does not implement individual app functionality
- Does not handle app development or publishing
- Is not for Canva's built-in features (those are in other sections)

## Key Entry Points

- **Primary Logic**: `src/pages/Home/Apps/index.tsx`
- **Mobile Version**: `MobileApps.tsx`
- **Styling**: `Apps.module.css`
- **Routes**: `/apps`

## Module Boundaries

- **Parent**: Sub-page of `Home`
- **Shared Components**:
  - `@/shared_components/Search/` - Search functionality
  - `@/shared_components/SearchPills/` - Category filters
- **Local Components** in `components/ui/`:
  - `AppCard/` - Individual app listing
  - `AppBlock/` - Featured app showcase
  - `AppVisualCard/` - Rich visual app display
  - `AppsCardList/` - List of app cards
  - `AppSection/` - Grouped app sections
  - `Banners/` - Promotional banners
  - `AppPageSpecificSections/` - Custom sections with data
- **Export**: Default Apps component

## Local Patterns

### App Card Variants
Multiple card types for different contexts:
- **AppCard**: Standard app listing (name, icon, description, action button)
- **AppBlock**: Larger featured display with screenshots
- **AppVisualCard**: Rich visual card with custom styling per app

### Search and Filter Pattern
Uses SearchPills component for quick category access:
- Text search for specific apps
- Category pills for quick filtering
- Featured/trending sections

## Alternative Names

- "Apps page", "App marketplace", "Marketplace", "Integrations", "Extensions", "App store", "Plugins", "Add-ons", "Third-party apps"

## Development Notes

- App cards should be reusable across sections
- Images use lazy loading
- Mobile version has different layout (single column)
- SearchPills for quick category access
- Sections can have custom data in `AppPageSpecificSections/`
- Use consistent card dimensions across layouts
