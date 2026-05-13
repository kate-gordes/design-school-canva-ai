# Development Guides

General development guidelines, standards, and patterns for this project.

## Core Guides

### 🎯 Focus & Context (NEW!)
- **CONTEXT_GUIDE.md** - AI Focus Context system for fast, focused vibe coding
- **contexts/** (in `.agent/project/`) - Dedicated context files (`@brand`, `@editor`, etc.)

### Code Standards
- **web_conventions.md** - Web/frontend code rules, imports, testing
- **coding_guide.md** - General coding standards and patterns
- **lessons.md** (in `.agent/project/`) - Project lessons and discoveries
- **UI work**: load the `easel-prototype` skill (components, tokens, icons, styling)

### UI/UX
- **accessibility.md** - Accessibility requirements
- **mobile_design.md** - Mobile-specific patterns

### Architecture
- **entrypoints.md** - Application entry points
- **flows.md** - User flows and navigation

### Assets
- **image_annotations.md** - Image annotation standards

### Content Design
Content design rules (writing text) in `content/` subdirectory:
- **content/content_guide.md** - Voice, tone, writing principles
- **content/content_tasks.md** - Specific patterns for buttons, forms, navigation
- **content/error_patterns.md** - Error messages and user feedback

### Development & Operations
- **runbook.md** - Operational procedures (how to run, build, test)
- **testing.md** - Testing guide and CI/CD setup
- **team_setup.md** - Team development setup (formatting, linting, hooks)
- **how_to_vibe_code.md** - Development workflow

### Specialized
- **scenarios.md** - Usage scenarios
- **tasks.md** - Task documentation

## Quick Start

New to the project? Read in this order:
1. **CONTEXT_GUIDE.md** - 🎯 Learn focus contexts for fast vibe coding
2. **web_conventions.md** - Understand import rules, testing, tooling
3. **coding_guide.md** - General coding standards
4. **lessons.md** - Project-specific discoveries
5. Page docs in `.agent/project/pages/` - Understand page architecture

For UI work, the `easel-prototype` skill is the source of truth for components, tokens, icons, and styling.

**Pro Tip**: Start every coding session with a focus context (`@brand`, `@editor`, etc.) for maximum speed! 🚀

## Standards Enforcement

These guides define the project standards:

**When writing code:**
- **ALWAYS** check web_conventions.md for import/testing rules
- **ALWAYS** load the `easel-prototype` skill before writing UI
- **ALWAYS** update lessons.md when discovering new patterns
- **ALWAYS** update page docs when changing pages

**When writing user-facing text:**
- **ALWAYS** check `content/` subdirectory for content design rules
- Follow voice and tone in content/content_guide.md
- Use patterns from content/content_tasks.md
- Follow content/error_patterns.md for error messages

All documentation is AI-discoverable and tool-agnostic (works with Cursor, Claude, Cody, etc.).

