# Page Documentation

All page-level documentation is centralized here in `.agent/project/pages/`.

> **Easel is an implicit dependency for every page.** Page docs do not list Easel components/tokens/icons under "Allowed Shared Dependencies" — the `easel-prototype` skill is the source of truth for those. Page docs only enumerate project-specific shared modules (hooks, providers, shared components, etc.).

## Why Centralized?

- **Separation of concerns**: Documentation separate from source code
- **Easier maintenance**: All docs in one place
- **Better organization**: Clear hierarchy and structure
- **YAML frontmatter**: Explicit linking to source paths

## Structure

```
.agent/project/pages/
├── INDEX.md              # Master index of all documentation
├── README.md             # This file
├── editor/              # Editor documentation
│   ├── editor.md
│   ├── document.md
│   ├── presentation.md
│   ├── whiteboard.md
│   └── spreadsheet.md
├── home/                # Home section documentation
│   ├── home.md
│   ├── apps.md
│   ├── brand.md
│   ├── canva-ai.md
│   ├── canva-ai-chat.md
│   ├── creator.md
│   ├── design-school.md
│   ├── grow.md
│   ├── more.md
│   ├── photos.md
│   ├── projects.md
│   ├── settings.md
│   └── templates.md
└── signed_out/          # Public pages documentation
    ├── signed-out.md
    ├── background-remover.md
    ├── resume-builder.md
    └── video-generation.md
```

## YAML Frontmatter

Each documentation file starts with YAML frontmatter:

```yaml
---
path: src/pages/ComponentPath    # Source code location
component: Component Name          # Component name
parent: src/pages/Parent          # Parent component (optional)
routes:                            # URL routes
  - /route1
  - /route2
sub_pages:                         # Child pages (optional)
  - ChildPage
critical_patterns:                 # Important patterns (optional)
  - Pattern description
---
```

## Finding Documentation

1. **By source path**: Check `.agent/project/pages/INDEX.md` or grep for `path: src/pages/YourPath`
2. **By feature name**: Files named by feature in kebab-case (e.g., `canva-ai-chat.md`)
3. **By route**: Check `docs/pages/INDEX.md` for route mappings

## Creating New Documentation

When adding a new page to `src/pages/`:

1. Create a `.md` file in the appropriate `.agent/project/pages/` subdirectory
2. Add YAML frontmatter with `path`, `component`, `routes`
3. Follow the standard documentation format (see existing files)
4. Update `.agent/project/pages/INDEX.md`

## Component-Specific Documentation

Some component-specific README files remain in source (e.g., `src/pages/Home/Brand/data/README.md`). These document internal implementation details and can stay co-located with the code.

## Maintenance

When you modify code in `src/pages/`, update the corresponding documentation in `.agent/project/pages/`.

See `.cursor/rules/lessons.mdc` for the documentation update rule.

