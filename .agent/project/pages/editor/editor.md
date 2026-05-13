---
path: src/pages/editor
component: Editor
routes:
  - /editor
  - /editor/:doctype
---

# Feature: Editor

## AI Focus Context

**Shorthand**: `@editor` (desktop) or `@editor-mobile` (mobile)  
**Activation**: Use `@editor`, "Context: Editor", or "Working on editor"

**Note**: For mobile-specific work, use `@editor-mobile` context (see `.agent/project/contexts/editor-mobile.md`)

### Primary Scope (Editor-specific)

**ONLY consider these files when in @editor context:**

```
src/pages/Editor/
├── index.tsx                           # Main editor orchestrator
├── Editor.module.css                   # Editor styles
└── components/                         # ALL editor components
    ├── Canvas/                         # Design canvas
    │   ├── index.tsx
    │   └── config.ts
    ├── EditorToolbar/                  # Context-sensitive toolbar
    │   ├── index.tsx
    │   ├── Items/                      # Toolbar items
    │   ├── GenericItems/               # Reusable items
    │   └── Toolbars/                   # Toolbar configs
    ├── ObjectPanel/                    # Left panel (design elements)
    │   ├── index.tsx
    │   ├── tabs/                       # Panel tabs
    │   └── content/                    # Tab content
    ├── EditPanel/                      # Right panel (properties)
    │   ├── index.tsx
    │   └── content/                    # Panel content
    ├── PageNavigator/                  # Bottom page management
    ├── Objects/                        # Canvas objects
    │   ├── TextObject/
    │   ├── ShapeTextObject/
    │   └── [other objects]
    └── ui/                             # Editor UI components

Note: Doctype-specific implementations in subdirectories:
- Document/ (use @document context)
- Presentation/ (use @presentation context)
- Whiteboard/ (use @whiteboard context)
- Spreadsheet/ (use @spreadsheet context)
```

### Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/shared_components/Header/` - Header system
- `src/hooks/useAppContext.ts` - Global state
- Easel components from `@canva/easel`

### Explicitly IGNORE

**Never read, mention, or consider these:**

- ❌ `src/pages/Home/` - all pages in Home directory (Home, Brand, Projects, Templates, Apps, Creator, CanvaAI, etc.)
- ❌ `src/pages/SignedOut/` - different context
- ❌ `src/shared_components/MobileMenu/` - use @editor-mobile for mobile
- ❌ `src/shared_components/MobileMenuToggle/` - use @editor-mobile
- ❌ `src/shared_components/MobileMoreMenu/` - use @editor-mobile

### AI Instructions

When `@editor` context is active:

1. ✅ **READ ONLY** Editor files (desktop behavior)
2. ✅ **FOCUS ON** desktop editor features
3. ❌ **NEVER mention** pages in Home directory or signed out pages
4. ❌ **NEVER include** mobile-specific components
5. ✅ **CONSIDER** all editor panels and toolbar
6. ✅ **PRIORITIZE** desktop interaction patterns

For doctype-specific changes, use dedicated contexts: `@document`, `@presentation`, `@whiteboard`, `@spreadsheet`

## Responsibility

**What it does:**
- Provides the main design workspace with canvas-based editing
- Manages multi-panel layout (ObjectPanel, EditPanel, Canvas, PageNavigator)
- Coordinates context-sensitive toolbars based on selected elements
- Handles object selection, manipulation, and rendering on canvas
- Integrates with global app state for design management

**What it never does:**
- Does not implement specific doctype canvas logic (delegated to Document, Presentation, etc.)
- Does not manage authentication or user data
- Does not handle file upload/download directly
- Does not implement individual design element rendering

## Key Entry Points

- **Primary Logic**: `src/pages/Editor/index.tsx`
- **Styling**: `Editor.module.css`
- **Routes**: 
  - `/editor` - Default editor
  - `/editor/:doctype` - Doctype-specific editor (document, presentation, whiteboard, spreadsheet)

### Major Components

- **Canvas**: `components/Canvas/index.tsx` - Main design surface with `config.ts`
- **ObjectPanel**: `components/ObjectPanel/index.tsx` - Left drawer with design elements
- **EditPanel**: `components/EditPanel/index.tsx` - Right panel for properties
- **EditorToolbar**: `components/EditorToolbar/index.tsx` - Context-sensitive tools
- **PageNavigator**: `components/PageNavigator/index.tsx` - Bottom page/slide management
- **Objects**: `components/Objects/` - Canvas object components (TextObject, ShapeTextObject, etc.)

## Module Boundaries

- **Internal Components**: All components in `components/` are internal to the editor
- **Shared Dependencies**: 
  - `@/shared_components/Header/` - Shared header component
  - `@/hooks/useAppContext` - Global app state
  - `@canva/easel` - Design system components
- **Doctype Variants**: Each doctype (Document, Presentation, etc.) customizes the base Editor layout
- **Export**: Only the default Editor component is exported

## Local Patterns

### Context-Sensitive Toolbar Pattern
The EditorToolbar changes based on selected object type. Toolbar items are organized in:
- `EditorToolbar/Items/` - Specific toolbar items
- `EditorToolbar/GenericItems/` - Reusable toolbar components
- `EditorToolbar/Toolbars/` - Complete toolbar configurations

### Panel State Management
Panels (ObjectPanel, EditPanel) manage their own visibility and content state but coordinate with global app context for overall layout.

### Reusable Section Components
ObjectPanel uses reusable section components:
- `ImageSectionCarousel` - Horizontal scrolling image sections
- `ImageSectionColumns` - 2-column grid sections
- `FontSection` - Text style sections
- `IconSection` - Icon grid sections

## Alternative Names

- "Editor", "Canvas editor", "Design editor", "Workspace", "Editing interface", "Main canvas", "Design workspace"

## Development Notes

- Panel components should be self-contained
- Canvas objects should be modular and reusable
- Toolbar items change based on context
- State updates should flow through app context
- For UI work, load the `easel-prototype` skill

