---
path: src/pages/home/Creator
component: Creator
parent: src/pages/home
routes:
  - /creator
---

# Feature: Creator

## AI Focus Context

**Shorthand**: `@creator`  
**Activation**: Use `@creator`, "Context: Creator", or "Working on creator"

### Primary Scope (Creator-specific)

**ONLY consider these files when in @creator context:**

```
src/pages/home/Creator/
├── index.tsx                    # Main Creator component
├── Creator.module.css           # Styles
├── CreatorsHub.tsx              # Creators hub view
├── ElementsCreator.tsx          # Elements creator view
├── Inspiration.tsx              # Inspiration view
├── MyItems.tsx                  # My items view
├── Pills.tsx                    # Filter pills
├── Resources.tsx                # Resources view
├── SampleData.js                # Sample data
├── InspirationPage/             # Inspiration page components
└── components/                  # Creator-specific components
```

### Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/shared_components/Header/` - Header system
- `src/pages/home/components/` - Shared home components
  - `GradientText/` - Gradient text heading
  - `ShortcutCarousel/` - Quick action shortcuts
  - `Wonderbox/` - Search functionality
  - `DesignSection/` - Design section layout
- `src/data/data.tsx` - Shared data
- `src/hooks/useAppContext.ts` - Global state
- `src/hooks/useIsMobile.ts` - Mobile detection
- Easel components from `@canva/easel`

### Explicitly IGNORE

**Never read, mention, or consider these:**

- ❌ `src/pages/home/Home/index.tsx` - different page (main Home page)
- ❌ `src/pages/home/Brand/` - different page
- ❌ `src/pages/home/Projects/` - different page
- ❌ `src/pages/home/Templates/` - different page
- ❌ `src/pages/home/Apps/` - different page
- ❌ `src/pages/home/CanvaAI/` - different page
- ❌ `src/pages/Editor/` - different context
- ❌ `src/pages/SignedOut/` - different context
- ❌ All other pages

### AI Instructions

When `@creator` context is active:

1. ✅ **READ ONLY** Creator page files
2. ✅ **FOCUS ON** content creator features and tools
3. ❌ **NEVER mention** other pages in Home directory or Editor
4. ✅ **CONSIDER** multiple views (Hub, Elements, Inspiration, My Items, Resources)
5. ✅ **PRIORITIZE** creator workflow and content creation tools

## Responsibility

**What it does:**
- Provides tools and resources for content creators
- Displays creator hub with inspiration and resources
- Manages elements creator functionality
- Shows creator-specific content and templates
- Organizes creator workflow tools
- Provides inspiration and learning materials

**What it never does:**
- Does not handle general template browsing (that's Templates page)
- Does not manage personal projects (that's Projects page)
- Is not for brand asset management (that's Brand page)
- Does not provide general design tools (that's Editor)

## Key Entry Points

- **Primary Logic**: `src/pages/home/Creator/index.tsx`
- **Mobile Version**: Included in main component with conditional rendering
- **Styling**: `Creator.module.css`
- **Routes**: `/creator`
- **Views**:
  - `CreatorsHub.tsx` - Main hub view
  - `ElementsCreator.tsx` - Elements creation view
  - `Inspiration.tsx` - Inspiration and ideas
  - `MyItems.tsx` - User's created items
  - `Resources.tsx` - Learning resources

## Module Boundaries

- **Parent**: Sub-page of `Home`
- **Shared Components**:
  - `@/pages/home/components/GradientText/` - Hero text
  - `@/pages/home/components/ShortcutCarousel/` - Quick shortcuts
  - `@/pages/home/components/Wonderbox/` - Search functionality
  - `@/pages/home/components/DesignSection/` - Design sections
- **Local Components** in `components/` and root:
  - `CreatorsHub.tsx` - Creator hub view
  - `ElementsCreator.tsx` - Elements creator
  - `Inspiration.tsx` - Inspiration content
  - `InspirationPage/` - Inspiration page components
  - `MyItems.tsx` - My items view
  - `Pills.tsx` - Category filter pills
  - `Resources.tsx` - Resources view
- **Export**: Default Creator component

## Local Patterns

### Multi-View Pattern
Creator page supports multiple sub-views:
- Creators Hub - Main landing page
- Elements Creator - Create custom elements
- Inspiration - Browse ideas and examples
- My Items - Manage created content
- Resources - Learning materials and guides

### Mobile Responsive
- Uses `useIsMobile` hook for responsive behavior
- Mobile shows different GradientText: "What's your task today?"
- Desktop shows: "Hey, Sarah, find or create anything"
- Currently simplified with Wonderbox and shortcuts commented out

### Minimal Current Implementation
The main index.tsx is currently minimal:
- Shows GradientText (responsive)
- Has Wonderbox, ShortcutCarousel, and DesignSection commented out
- Focuses on basic layout structure
- Room for expansion with creator-specific features

## Alternative Names

- "Creator page", "Creator hub", "Content creator", "Creator studio", "Creator tools", "Content creation", "Creator platform", "Maker space", "Creator dashboard"

## Development Notes

- Main component is simplified (features commented out)
- Multiple sub-views available but not currently integrated
- SampleData.js provides sample content
- Mobile uses variant="mobile" for GradientText
- Desktop uses larger GradientText
- InspirationPage directory contains detailed inspiration components
- Pills component provides category filtering
- Ready for expansion with creator-specific workflows
- Currently restores sidebar and secondary nav visibility on mount
- Uses standard Box layout with shadow and border radius

