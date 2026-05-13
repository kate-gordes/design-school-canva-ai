# Page Documentation Index

All page documentation is centralized in `.agent/project/pages/` with YAML frontmatter specifying the source path.

## AI Focus Contexts 🎯

For fast, focused vibe coding, use **AI Focus Contexts** to restrict AI attention to specific features:

- **`@brand`** - Brand page only
- **`@editor`** - Editor (desktop)
- **`@editor-mobile`** - Editor (mobile)
- **`@whiteboard`** - Whiteboard doctype
- **`@projects`** - Projects page
- **`@templates`** - Templates page
- **`@apps`** - Apps marketplace

See `.agent/project/guides/CONTEXT_GUIDE.md` for complete system documentation.  
See `.agent/project/contexts/` for dedicated context files.

## Documentation Location

**Old Location** (deprecated): READMEs scattered in `src/pages/*/README.md`  
**New Location**: Centralized in `.agent/project/pages/`

Each documentation file uses YAML frontmatter to specify:
- `path`: Source code location
- `component`: Component name
- `parent`: Parent component (if applicable)
- `routes`: URL routes
- `sub_pages`: Child pages (if applicable)
- `critical_patterns`: Important patterns to note

Each page doc now includes an **AI Focus Context** section for focused work.

## Editor Documentation

**Location**: `.agent/project/pages/Editor/`

- **editor.md** → `src/pages/editor`
- **document.md** → `src/pages/Editor/Document`
- **presentation.md** → `src/pages/Editor/Presentation`
- **whiteboard.md** → `src/pages/Editor/Whiteboard`
- **spreadsheet.md** → `src/pages/Editor/Spreadsheet`

## Home Section Documentation

**Location**: `.agent/project/pages/Home/`

- **home.md** → `src/pages/Home` (Home.tsx)
- **apps.md** → `src/pages/Home/Apps`
- **brand.md** → `src/pages/Home/Brand` ⚠️ Complex - uses `useBrandKitState` hook
- **canva-ai.md** → `src/pages/Home/CanvaAI`
- **canva-ai-chat.md** → `src/pages/Home/CanvaAI/CanvaAIChat`
- **creator.md** → `src/pages/Home/Creator`
- **design-school.md** → `src/pages/Home/DesignSchool`
- **grow.md** → `src/pages/Home/Grow`
- **more.md** → `src/pages/Home/More`
- **photos.md** → `src/pages/Home/Photos`
- **projects.md** → `src/pages/Home/Projects`
- **settings.md** → `src/pages/Home/Settings`
- **templates.md** → `src/pages/Home/Templates`

## Signed Out Documentation

**Location**: `.agent/project/pages/SignedOut/`

- **signed-out-experience.md** → `src/pages/SignedOut`
- **background-remover.md** → `src/pages/SignedOut/BackgroundRemover`
- **resume-builder.md** → `src/pages/SignedOut/ResumeBuilder`
- **video-generation.md** → `src/pages/SignedOut/VideoGeneration`

## Finding Documentation

### By Source Path
Check the YAML frontmatter `path` field in docs to find documentation for a specific source file.

### By Feature Name
Documentation files are named by feature (kebab-case): `document.md`, `brand.md`, `canva-ai-chat.md`

### By Component Name  
Check the YAML frontmatter `component` field.

## Documentation Format

Every documentation file follows this structure:

```yaml
---
path: src/pages/ComponentPath
component: Component Name
parent: src/pages/Parent (if applicable)
routes:
  - /route1
  - /route2
---
```

Then standard sections:
- **Responsibility** (what it does/never does)
- **Key Entry Points** (files, routes, components)
- **Module Boundaries** (dependencies, exports)
- **Local Patterns** (feature-specific patterns)
- **Alternative Names** (for discoverability)
- **Development Notes**

## Maintenance

When updating code in `src/pages/`, update the corresponding doc in `docs/pages/`.

The YAML frontmatter path should always match the actual source location.

