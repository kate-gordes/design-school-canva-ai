# Documentation Standards

## Separation of Concerns

We follow a clear separation between AI coding rules and human-readable context.

### The Pattern

| Aspect | `.agent/rules/` (The Rules) | `src/*/README.md` (The Context) |
|--------|----------------------------|--------------------------------|
| **Content** | Syntax, Globs, Imports, Linter rules | User stories, Logic flows, Roadmap |
| **Trigger** | Automatic (when file is opened) | Manual or via `@` (when logic is complex) |
| **Vibe** | "Don't do this; always do that." | "This feature enables users to..." |
| **AI Action** | "I will use kebab-case for files." | "I understand that Credits are non-refundable." |

## File Locations

### `.agent/` Files (HOW to Code)

**Purpose**: Tell AI how to implement features

**Location**: `.agent/project/pages/[section]/[feature].md`

**Contains**:
- Code patterns and syntax rules
- Component structure and boundaries
- Import conventions
- Technical implementation details
- Module dependencies
- Local patterns (code examples)

**Tone**: Prescriptive, directive
- "ALWAYS use Easel components"
- "NEVER modify this boundary"
- "Import from @/ not ../"

**Example** (`.agent/project/pages/Editor/document.md`):
```markdown
## Local Patterns

### PageNavigator Usage
\`\`\`tsx
<PageNavigator orientation="vertical" />
\`\`\`
Always use vertical orientation for Document doctype.
```

### `README.md` Files (WHAT the Feature Does)

**Purpose**: Explain feature purpose and user value

**Location**: `src/pages/[Page]/README.md`

**Contains**:
- User stories ("As a user, I want...")
- Logic flows (what happens when)
- Feature purpose and value proposition
- Key concepts and terminology
- Roadmap and future enhancements
- User experience description

**Tone**: Descriptive, explanatory
- "Users can create documents"
- "This enables teams to collaborate"
- "The feature provides value by..."

**Example** (`src/pages/Editor/Document/README.md`):
```markdown
## User Stories

1. **As a writer**, I want to create a multi-page report
   so I can organize my written content professionally

## Logic Flow

1. User creates document → Editor loads
2. User types → Text flows across pages
3. User clicks thumbnail → Jumps to page
```

## No Duplication Rule

**Don't repeat information between `.agent/` and `README.md`**

❌ **Bad** - Duplicated:
```markdown
# .agent/project/pages/Editor/document.md
PageNavigator displays vertical thumbnails for navigation.

# src/pages/Editor/Document/README.md
PageNavigator displays vertical thumbnails for navigation.
```

✅ **Good** - Separated:
```markdown
# .agent/project/pages/Editor/document.md
\`\`\`tsx
<PageNavigator orientation="vertical" />
\`\`\`

# src/pages/Editor/Document/README.md
Users can navigate between pages using vertical thumbnails.
```

## When to Create Each

### Create `.agent/` Documentation When:
- Implementing a new feature/page
- There are specific coding patterns to follow
- Module boundaries need to be defined
- There are technical constraints or rules

### Create `README.md` When:
- The feature has complex user flows
- User stories need to be documented
- The feature's purpose isn't obvious from code
- There's a roadmap or future plans

## Maintenance

**When coding:**
1. Read `.agent/` files for HOW to implement
2. Read `README.md` for WHAT you're building and WHY

**When updating:**
- Change `.agent/` when patterns or rules change
- Change `README.md` when features, flows, or purpose changes

## Quick Reference

| Question | Check |
|----------|-------|
| How do I code this? | `.agent/project/pages/` |
| What does this feature do? | `src/[feature]/README.md` |
| What's the user flow? | `src/[feature]/README.md` |
| What patterns should I use? | `.agent/project/pages/` |
| What imports are allowed? | `.agent/project/guides/` |
| Why does this exist? | `src/[feature]/README.md` |

## Examples Created

✅ **Completed**:
- `src/pages/Editor/Document/README.md`
- `src/pages/Editor/Presentation/README.md`
- `src/pages/Home/Brand/README.md`
- `src/pages/SignedOut/BackgroundRemover/README.md`

📋 **To Create**:
- All other pages and major components in `/src/`
- Follow the same pattern: WHAT, not HOW

---

**This separation ensures:**
- AI gets clear coding rules without user story noise
- Humans get context without implementation details
- No duplicate maintenance burden
- Clear boundaries between concerns

