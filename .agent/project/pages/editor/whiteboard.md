---
path: src/pages/Editor/Whiteboard
component: Whiteboard Doctype
parent: src/pages/editor
routes:
  - /editor/whiteboard
---

# Feature: Whiteboard Doctype

## AI Focus Context

**Shorthand**: `@whiteboard`  
**Activation**: Use `@whiteboard`, "Context: Whiteboard", or "Working on whiteboard"

### Primary Scope (Whiteboard-specific)

**ONLY consider these files when in @whiteboard context:**

```
src/pages/Editor/Whiteboard/
├── index.tsx                    # Whiteboard implementation
├── Whiteboard.module.css        # Whiteboard styles
└── README.md                    # Whiteboard documentation

Whiteboard-relevant base editor:
src/pages/Editor/
├── index.tsx                    # Base editor (whiteboard integration)
└── components/
    ├── Canvas/                  # Canvas with pan/zoom for whiteboard
    ├── EditorToolbar/           # Toolbar (whiteboard context)
    ├── ObjectPanel/             # Object panel (whiteboard mode)
    └── EditPanel/               # Edit panel (whiteboard mode)
    # NOTE: Does NOT include PageNavigator (whiteboard has no pages)
```

### Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/pages/Editor/components/Canvas/` - Canvas system (pan/zoom/transform)
- `src/pages/Editor/components/EditorToolbar/` - Toolbar (whiteboard tools)
- `src/pages/Editor/components/ObjectPanel/` - Object panel
- `src/pages/Editor/components/EditPanel/` - Edit panel
- `src/hooks/useAppContext.ts` - Global state
- `src/shared_components/Header/` - Header
- Easel components from `@canva/easel`

### Explicitly IGNORE

**Never read, mention, or consider these:**

- ❌ `src/pages/Editor/Document/` - different doctype
- ❌ `src/pages/Editor/Presentation/` - different doctype
- ❌ `src/pages/Editor/Spreadsheet/` - different doctype
- ❌ `src/pages/Editor/components/PageNavigator/` - whiteboard has NO pages
- ❌ `src/pages/Home/` - all pages in Home directory (Home, Brand, Projects, Templates, Apps, etc.)
- ❌ `src/pages/SignedOut/` - different context
- ❌ Page-based navigation components
- ❌ Pagination logic

### Critical Patterns

**Whiteboard uses infinite canvas, NOT pages:**

```typescript
// Whiteboard has:
- Transform matrix for pan/zoom
- Infinite coordinate space
- No page boundaries
- Spatial navigation

// Whiteboard does NOT have:
- PageNavigator component
- Page numbers
- Page add/delete/duplicate
- Fixed canvas dimensions
```

### AI Instructions

When `@whiteboard` context is active:

1. ✅ **READ ONLY** Whiteboard-specific files
2. ✅ **FOCUS ON** infinite canvas patterns (pan, zoom, spatial navigation)
3. ❌ **NEVER mention** PageNavigator or page-based navigation
4. ❌ **NEVER suggest** page add/delete features
5. ❌ **NEVER reference** other doctypes (Document, Presentation, Spreadsheet)
6. ✅ **ALWAYS consider** transform matrix and coordinate translation
7. ✅ **PRIORITIZE** viewport culling for performance

## Responsibility

**What it does:**
- Provides infinite canvas for freeform design and collaboration
- Handles pan and zoom across unlimited space
- Manages spatial navigation without page boundaries
- Optimized for brainstorming and visual collaboration

**What it never does:**
- Does not use PageNavigator component (no fixed pages)
- Does not handle page-based layouts or pagination
- Is not for structured documents or slides

## Key Entry Points

- **Primary Logic**: `src/pages/Editor/Whiteboard/index.tsx`
- **Styling**: `whiteboard.module.css`
- **Routes**: `/editor/whiteboard`

## Module Boundaries

- **Parent**: Extends base `Editor` component from `src/pages/Editor/`
- **Shared Components**:
  - Uses shared `EditorToolbar` with whiteboard-specific context
  - Uses shared `ObjectPanel` and `EditPanel`
  - **Does NOT use PageNavigator** (key difference)
- **Doctype-Specific**: Canvas uses pan/zoom transformations, spatial coordinate system

## Local Patterns

### Infinite Canvas Pattern
Canvas implementation differs significantly from other doctypes:
- Transform matrix for pan/zoom
- Viewport culling (only render visible objects)
- Coordinate translation between screen and canvas space
- Smooth pan/zoom animations
- Grid or background pattern that tiles infinitely

### Spatial Navigation
No page-based navigation:
- Objects positioned in infinite space
- Viewport transformation affects all rendering
- May use minimap for navigation overview

## Canvas Rendering Considerations

- Canvas must support pan (translate) and zoom (scale)
- Object positions are absolute in infinite space
- Need efficient culling of off-screen objects
- Grid rendering must tile infinitely
- Coordinate system transforms for mouse/touch events
- Consider performance with many objects

## Alternative Names

- "Whiteboard doctype", "Infinite canvas", "Whiteboard mode", "Freeform canvas", "Collaboration board", "Miro mode", "Brainstorming canvas", "Infinite workspace"

## Development Notes

- Viewport culling is critical for performance
- Transform matrix affects all canvas rendering
- Different navigation paradigm from page-based doctypes
- Consider minimap implementation for spatial awareness

