---
path: src/pages/home/Projects
component: Projects
parent: src/pages/home
routes:
  - /projects
---

# Feature: Projects

## AI Focus Context

**Shorthand**: `@projects`  
**Activation**: Use `@projects`, "Context: Projects", or "Working on projects"

### Primary Scope (Projects-specific)

**ONLY consider these files when in @projects context:**

```
src/pages/home/Projects/
├── index.tsx                    # Main Projects component
├── Projects.module.css          # Styles
├── SampleData.ts                # Sample data for projects
└── components/                  # Projects-specific components
    ├── DesignsSection/          # Designs display section
    ├── FolderCard/              # Folder card component
    ├── ImagesSection/           # Images display section
    ├── ListView/                # List view layout
    ├── VideosSection/           # Videos display section
    └── ViewControls/            # Grid/List view toggle
```

### Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/shared_components/Header/` - Header system
- `src/pages/home/components/` - Shared home components
  - `CardThumbnails/` - Card display components
  - `DesignSection/` - Design section layout
  - `Dropdowns/` - Filter dropdowns
  - `FoldersSection/` - Folders display
  - `Wonderbox/` - Wonderbox component
  - `MobilePageLayout/` - Mobile layout wrapper
- `src/hooks/useAppContext.ts` - Global state
- `src/hooks/useIsMobile.ts` - Mobile detection
- Easel components from `@canva/easel`

### Explicitly IGNORE

**Never read, mention, or consider these:**

- ❌ `src/pages/home/Home/index.tsx` - different page (main Home page)
- ❌ `src/pages/home/Brand/` - different page
- ❌ `src/pages/home/Templates/` - different page
- ❌ `src/pages/home/Apps/` - different page
- ❌ `src/pages/home/Creator/` - different page
- ❌ `src/pages/home/CanvaAI/` - different page
- ❌ `src/pages/Editor/` - different context
- ❌ `src/pages/SignedOut/` - different context
- ❌ All other pages

### AI Instructions

When `@projects` context is active:

1. ✅ **READ ONLY** Projects page files
2. ✅ **FOCUS ON** project management features (designs, folders, images, videos)
3. ❌ **NEVER mention** other pages in Home directory or Editor
4. ✅ **CONSIDER** both grid and list view layouts
5. ✅ **PRIORITIZE** filtering, sorting, and view controls

## Responsibility

**What it does:**
- Displays all user projects (designs, folders, images, videos)
- Provides filtering by type, category, owner, and date modified
- Handles view switching between grid and list layouts
- Manages sorting by name and edited date
- Shows recent designs in carousel
- Organizes content into sections (Folders, Designs, Images, Videos)

**What it never does:**
- Does not create or edit individual designs
- Does not handle file uploads directly
- Is not for template browsing (that's Templates page)
- Does not manage brand assets (that's Brand page)

## Key Entry Points

- **Primary Logic**: `src/pages/home/Projects/index.tsx`
- **Mobile Version**: Included in main component with conditional rendering
- **Styling**: `Projects.module.css`
- **Routes**: `/projects`

## Module Boundaries

- **Parent**: Sub-page of `Home`
- **Shared Components**:
  - `@/pages/home/components/CardThumbnails/` - ProjectCard component
  - `@/pages/home/components/DesignSection/` - Recent designs carousel
  - `@/pages/home/components/Dropdowns/` - Filter dropdowns
  - `@/pages/home/components/FoldersSection/` - Folders display
  - `@/pages/home/components/Wonderbox/` - Search functionality
  - `@/pages/home/components/MobilePageLayout/` - Mobile wrapper
- **Local Components** in `components/`:
  - `DesignsSection/` - Designs grid display
  - `FolderCard/` - Individual folder cards
  - `ImagesSection/` - Images grid display
  - `VideosSection/` - Videos grid display
  - `ListView/` - List view layout with table headers
  - `ViewControls/` - Grid/List toggle buttons
- **Export**: Default Projects component

## Local Patterns

### View Type Pattern
Supports two view modes:
- **Grid View**: Cards displayed in grid layout with sections
- **List View**: Table-like layout with sortable columns

### Filtering System
Multiple dropdown filters:
- Type (all, designs, folders, images, videos)
- Category (all, presentations, social media, etc.)
- Owner (all, me, shared with me)
- Date Modified (any, today, this week, this month, etc.)

### Sorting Pattern
- Name sorting (none → ascending → descending → none)
- Edited date sorting (none → descending → ascending → none)
- Active sort state shown with chevron icons

### Section Organization
Content organized into logical sections:
1. **Recents** - Carousel of recently modified items
2. **Folders** - Folder grid with item counts
3. **Designs** - Design grid with thumbnails
4. **Images** - Image grid with file info
5. **Videos** - Video grid with file info

### Mobile Layout
- 2-column grid for all sections
- Filter pills in horizontal carousel
- Combined "All items" section with subsections
- Sort button in header

## Alternative Names

- "Projects page", "All projects", "My projects", "Files", "Designs", "Content library", "Asset management", "Project management", "File browser"

## Development Notes

- View type state managed locally (grid/list)
- Filter states managed with useState hooks
- Table headers show sort state with icons
- Mobile uses simplified 2-column grid layout
- Recent designs always visible in carousel at top
- List view uses custom ListView component with row rendering
- Grid view shows all sections (Folders, Designs, Images, Videos)
- Sample data comes from `SampleData.ts`
- Mobile layout uses MobilePageLayout wrapper
- Folders show privacy badge (Private/Shared)
- Designs show doctype and last modified date

