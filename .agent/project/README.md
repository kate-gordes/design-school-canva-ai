# Project Documentation

All project-specific documentation for AI assistants and developers.

## Directory Structure

```
.agent/project/
├── README.md              # This file
├── lessons.md             # Project lessons and rules
├── contexts/              # 🎯 AI Focus Contexts (special cases only)
│   ├── README.md          # Context system overview
│   └── editor-mobile.md   # @editor-mobile (cross-cutting mobile context)
├── pages/                 # Page-level implementation docs
│   ├── INDEX.md           # Master index with path mappings
│   ├── README.md          # Page documentation guide
│   ├── Editor/            # Editor and doctype documentation (5 files)
│   ├── Home/              # Home page (Home/index.tsx) + sub-pages: Apps, Brand, Projects, etc. (13 files)
│   └── SignedOut/         # Public pages (4 files)
└── guides/                # Development guides
    ├── CONTEXT_GUIDE.md   # 🎯 AI Focus Context System (NEW!)
    ├── content/           # Content design rules (writing text)
    │   ├── README.md      # Content rules overview
    │   ├── content_guide.md   # Voice, tone, writing principles
    │   ├── content_tasks.md   # Specific content patterns
    │   └── error_patterns.md  # Error messages and feedback
    ├── coding_guide.md    # Code standards and patterns
    ├── accessibility.md   # Accessibility requirements
    └── ... (20+ guides)
```

## 📁 Folder Structure Convention

**IMPORTANT**: The `.agent/project/pages/` directory structure **mirrors** `src/pages/` exactly:

| Documentation | Source Code |
|---------------|-------------|
| `.agent/project/pages/Editor/` | `src/pages/Editor/` |
| `.agent/project/pages/Home/` | `src/pages/Home/` |
| `.agent/project/pages/SignedOut/` | `src/pages/SignedOut/` |

This 1:1 mapping ensures documentation paths match source paths, making it easy to find the right docs for any page.

## Page Documentation (`pages/`)

Implementation docs for all pages in `src/pages/`.

### Format

Each page doc uses YAML frontmatter:

```yaml
---
path: src/pages/ComponentPath    # Links to source code
component: Component Name
parent: src/pages/Parent         # If applicable
routes:                          # URL routes
  - /route1
  - /route2
---
```

Followed by structured sections:
- **Responsibility** - What it does/never does (clear boundaries)
- **Key Entry Points** - Files, routes, components
- **Module Boundaries** - Dependencies, exports, integrations
- **Local Patterns** - Feature-specific patterns and code examples
- **Alternative Names** - Different ways to refer to the feature
- **Development Notes** - Important implementation details

### Finding Page Documentation

1. **By source path**: Check `pages/INDEX.md` or grep for `path: src/pages/YourPath`
2. **By feature name**: Files named in kebab-case (e.g., `canva-ai-chat.md`)
3. **By route**: Check `pages/INDEX.md` for route mappings

### Current Status

See `pages/migration_status.md` for documentation completion status.

## Development Guides (`guides/`)

General documentation for coding standards, patterns, and guidelines.

### Key Guides

**Code Standards:**
- `coding_guide.md` - Project coding standards and patterns
- `how_to_vibe_code.md` - Development workflow

**UI/UX:**
- `accessibility.md` - Accessibility requirements
- `mobile_design.md` - Mobile-specific patterns

**Architecture:**
- `entrypoints.md` - Application entry points
- `flows.md` - User flows and navigation

**Assets:**
- `image_annotations.md` - Image annotation standards

## Content Design Rules (`guides/content/`)

Guidelines for writing user-facing text and copy.

**Core Rules:**
- `guides/content/content_guide.md` - Canva's voice, tone, and writing principles
- `guides/content/content_tasks.md` - Specific patterns for buttons, forms, navigation
- `guides/content/error_patterns.md` - Error messages and user feedback

## For AI Assistants

### 🎯 Using Focus Contexts (NEW!)

For fast, focused vibe coding:

1. **Activate a context**: User says `@brand`, `@editor`, `@whiteboard`, etc.
2. **Read context documentation**:
   - For page-specific: Read "AI Focus Context" section in `.agent/project/pages/*/[page].md`
   - For cross-cutting: Read `.agent/project/contexts/[context].md`
3. **Restrict scope**: Only consider files in Primary Scope + Allowed Dependencies
4. **Ignore everything else**: Never mention files in Explicit Ignore list
5. **Stay focused**: Work only within context boundaries until user exits or switches

See `guides/CONTEXT_GUIDE.md` for complete system documentation.

### When Modifying Pages
1. **Check for focus context**: If user activated `@context`, follow that context strictly
2. Find the page doc in `pages/` using `pages/INDEX.md`
3. Read YAML frontmatter to understand paths and relationships
4. Check "AI Focus Context" section for context activation info
5. Follow patterns in "Local Patterns" section
6. Use "Alternative Names" for context understanding
7. Update the doc after making significant changes

### When Writing Code
1. Check `guides/coding_guide.md` for standards
2. Follow accessibility guidelines in `guides/accessibility.md`

### When Writing User-Facing Text
1. Check `guides/content/content_guide.md` for voice and tone
2. Check `guides/content/content_tasks.md` for specific patterns (buttons, forms, etc.)
3. Check `guides/content/error_patterns.md` for error messages

## Maintenance

**Global Rules**:
- ALWAYS update page documentation in `.agent/project/pages/` when making significant changes
- Follow conventions in `.agent/project/guides/`
- Document lessons learned in `.agent/project/lessons.md`

When you modify code:
1. Update corresponding page doc if in `src/pages/`
2. Update relevant guide if changing patterns/standards
3. Keep YAML frontmatter accurate (especially `path` field)
4. Add discoveries to lessons.md

## Standards Compliance

- ✅ YAML frontmatter for metadata
- ✅ Structured markdown format
- ✅ Clear boundaries and responsibilities
- ✅ Code examples for complex patterns
- ✅ Alternative names for discoverability

