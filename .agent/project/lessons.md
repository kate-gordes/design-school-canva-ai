# Project Lessons

Lessons learned during development - patterns, fixes, and project-specific knowledge.

> **For Easel design system rules** (component selection, props, tokens, icons), load the `easel-prototype` skill. Do not re-document Easel here — keep this file scoped to project-specific lessons.

## How to Use

- **User Specified**: Requirements and preferences from the project owner
- **Discovered**: Technical discoveries and fixes learned through development

## User Specified Lessons

### Code Organization

- **ALWAYS** follow DRY principles - create reusable components
- **ALWAYS** use `"@/"` alias for imports, never relative paths (`../../`)
- Use `.module.css` for component styling when CSS is needed

### State Management

- Global state exists in Context Provider at `/src/providers/App.tsx`
- **ALWAYS** use global App Context Provider for state

### Project Rules

- **NEVER** modify tests unless explicitly asked
- **NEVER** run terraform command
- **NEVER** use AWS CLI for infrastructure - use Terraform exclusively
- **NEVER** temporarily modify Terraform lifecycle rules
- **NEVER** run NPM commands (user handles package management)
- Always run commands and fix errors before completing tasks
- Include debugging info in program output
- Read files before editing them
- Use latest stable versions when installing dependencies

### Documentation

- **ALWAYS** update page documentation in `.agent/project/pages/` when making significant changes
- Documentation uses YAML frontmatter to specify source path
- Check `.agent/project/pages/INDEX.md` for complete documentation map

**Separation of Concerns:**
- **`.agent/` files** = HOW to code (syntax, patterns, imports, linter rules - AI action focused)
- **`README.md` in `/src/`** = WHAT the feature does (user stories, logic flows, roadmap - human context)
- Never duplicate information - `.agent/` is prescriptive ("always do X"), `README.md` is descriptive ("enables users to Y")

## Discovered Lessons

### CSS Modules

- **MUST** use `.module.css` extension (not `.css`)
- Plain `.css` files cause "does not provide an export named 'default'" errors

### Project-Specific Components

#### Reusable Components Created
- SeeAll component in ObjectPanel
- MagicSearch and RegularSearch components
- ImageSectionColumns - 2-column grid with title, see all
- ImageSectionCarousel - horizontal carousel layout, supports customHeader
- FontSection - text style buttons with flexible title support
- IconSection - icon grid sections
- CreateFolder - uploads organization component
- ToolsContent - narrow 72px panel with vertical tool list

#### Component Organization
- Export from index.ts
- Deep imports use relative paths from component files

### TypeScript

- **NEVER** use `@ts-ignore`
- **NEVER** use `as any`

### Editor-Specific

- Tools panel: z-index 20 (higher than other panels at z-index 10)
- Tab hover states differ based on docked/undocked mode
- Object panel tabs receive `docked` prop for conditional styling
- Carousel sections use consistent placeholder patterns (98px height)

### Component Patterns

- Separate HamburgerButton component under Header (not HeaderButton variant)
- ShareMenu requires careful styling to preserve button appearance

## Historical Accomplishments

### Major Component Implementations
- AppsContent with SearchPills and IconSection
- ProjectsContent with tabs and filters
- ObjectPanel
- Complete Header system with all menus
- Reusable component architecture (70%+ code reduction)

### Reorganizations
- Moved 13 pages under `src/pages/Home/` (Jan 12, 2026)
- Moved 44 components to page-specific directories (Jan 12, 2026)
- Fixed all relative import paths to use `@/` alias (Jan 12, 2026)
- Centralized documentation in `.agent/project/` (Jan 16, 2026)
