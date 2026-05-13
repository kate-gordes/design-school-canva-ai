# AI-Discoverable Documentation

This directory contains all documentation and resources for AI assistants (Cursor, Claude, Cody, GitHub Copilot, etc.).

## Structure

```
.agent/
├── README.md              # This file - overview of all AI content
└── project/               # Project-specific documentation
    ├── README.md          # Project documentation guide
    ├── lessons.md         # Project lessons and discoveries
    ├── pages/             # Page-level implementation docs
    │   ├── INDEX.md       # Master page documentation index
    │   ├── editor/        # Editor and doctype docs
    │   ├── home/          # Home section page docs
    │   └── signed_out/    # Public page docs
    └── guides/            # Development guides
        ├── content/       # Content design rules (writing text)
        │   ├── content_guide.md   # Voice, tone, writing principles
        │   ├── content_tasks.md   # Specific patterns
        │   └── error_patterns.md  # Error messages
        ├── web_conventions.md
        ├── coding_guide.md
        └── ... (20+ guides)
```

## Project Documentation (`project/`)

- **Source**: Your project-specific documentation
- **Format**: Markdown with YAML frontmatter
- **Purpose**: Implementation docs for your pages and features
- **Rule**: ✅ Update when code changes

### Page Documentation (`project/pages/`)
Implementation details for pages in `src/pages/`:
- YAML frontmatter links docs to source paths
- Structured format (Responsibility, Entry Points, Patterns)
- Alternative names for discoverability

### Content Design (`project/guides/content/`)
Rules for writing user-facing text and copy:
- Voice, tone, and writing principles
- Specific patterns for UI text (buttons, forms, navigation)
- Error messages and user feedback

### Development Guides (`project/guides/`)
General development guidelines:
- Coding standards and patterns
- Accessibility requirements
- UI/UX guidelines
- Architecture decisions

## For AI Assistants

### When Modifying Pages
1. Check `.agent/project/pages/INDEX.md` to find page documentation
2. Read the corresponding page doc (includes YAML frontmatter with path)
3. Follow documented patterns and boundaries
4. Update documentation when making significant changes

### When Writing Code
1. Check `.agent/project/guides/coding_guide.md` for standards
2. Follow project-specific conventions

### When Writing User-Facing Text
1. Check `.agent/project/guides/content/content_guide.md` for voice and tone
2. Check `.agent/project/guides/content/content_tasks.md` for specific patterns
3. Check `.agent/project/guides/content/error_patterns.md` for error messages

## Quick Links

- **Page Documentation Index**: `.agent/project/pages/INDEX.md`
- **Coding Standards**: `.agent/project/guides/coding_guide.md`
- **Content Design Rules**: `.agent/project/guides/content/README.md`
- **Accessibility**: `.agent/project/guides/accessibility.md`

## Standards Compliance

This structure follows emerging AI documentation standards:
- ✅ `.agent/` prefix for tool-agnostic AI discoverability
- ✅ Clear separation of external vs project docs
- ✅ Markdown format throughout
- ✅ YAML frontmatter for metadata
- ✅ Hierarchical organization

## Maintenance

When you modify code, update the corresponding documentation in `.agent/project/`.

Key rules:
- Update page docs in `.agent/project/pages/` when changing page structure
- Follow conventions in `.agent/project/guides/web_conventions.md`
- Check lessons learned in `.agent/project/lessons.md`
