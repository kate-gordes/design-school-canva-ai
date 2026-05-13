---
path: src/pages/Home
component: Home
routes:
  - /
  - /home
---

# Feature: Home

## Responsibility

**What it does:**
- Serves as main authenticated landing page and dashboard
- Displays recent designs and quick action shortcuts
- Provides navigation hub to all major platform sections
- Integrates "What will you design today?" quick start experience
- Acts as parent route for major platform sections

**What it never does:**
- Does not handle unauthenticated/public pages (that's `signed_out/`)
- Does not implement editor functionality
- Does not manage individual design editing
- Is not a sub-page itself - it's the root authenticated page

## Key Entry Points

- **Primary Logic**: `src/pages/Home/Home/index.tsx`
- **Styling**: `Home.module.css`
- **Routes**: 
  - `/` or `/home` - Home page
  - Child routes: `/apps`, `/brand`, `/ai`, `/creator`, `/templates`, etc.

## Module Boundaries

- **Shared Components**:
  - `@/shared_components/Header/` - Global header
  - `@/shared_components/ContextualNav/` - Section navigation
  - `@/shared_components/Search/` - Search functionality
  - `@/shared_components/CreateMenu/` - Quick design creation
- **Sub-Pages**: Home acts as parent for major sections (Apps, Brand, Projects, etc.)
- **Home-Specific Components**: `src/pages/Home/components/` shared across pages in Home directory
- **Export**: Default Home component exported for routing

## Local Patterns

### Shared Component Library
Home sub-pages share components from `components/`:
- `MobilePageLayout/` - Mobile layout wrapper
- `MobileHomeHeader/` - Mobile header
- `DesignSection/` - Design grid sections
- `ShortcutCarousel/` - Quick action carousels
- `ImageWithPlaceholder/` - Lazy-loaded images
- `Wonderbox/` - Special promotional sections

### Mobile Variants
Most Home sub-pages have dedicated mobile implementations:
- Desktop: `PageName/index.tsx`
- Mobile: `PageName/MobilePageName.tsx`

## Alternative Names

- "Home page", "Home", "Dashboard", "Landing page", "Main page", "Homepage", "Start page", "Root page"

## Development Notes

- Use shared components for consistent layouts
- Images should use lazy loading with placeholders
- Navigation uses ContextualNav component
- All sub-pages should integrate with Header component
- Recent designs displayed prominently

