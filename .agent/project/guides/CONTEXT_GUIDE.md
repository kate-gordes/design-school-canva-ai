# AI Focus Context System

A system for fast, focused vibe coding by restricting AI attention to specific feature contexts.

## Problem Statement

When working on a specific feature (e.g., Brand page), AI assistants can get:
- **Slowed down** by reading unrelated files
- **Confused** by similar patterns in different contexts
- **Distracted** by suggesting changes to unrelated features
- **Inefficient** with limited context window space

## Solution: Focus Contexts

Each feature has a defined **focus context** that explicitly lists:
- ✅ **Primary Scope**: Files specific to this feature
- ✅ **Allowed Dependencies**: Shared components this feature uses
- ❌ **Explicit Ignores**: Everything else to ignore

## How to Use

### Option 1: Per-Prompt Context (Quick Tasks)

Use the shorthand with each prompt:

```bash
@brand - Update the color picker
@whiteboard - Add a new toolbar button
@editor-mobile - Fix touch gestures
```

**Best for**: Quick one-off tasks or checking specific features

### Option 2: Session Context (Extended Work)

Activate a context for the entire chat session:

```bash
# Enter session context
🔵 Entering @brand context
🔵 Start @editor-mobile session
🔵 Working on @whiteboard

# (Now all prompts stay in this context without repeating shorthand)
Update the color picker
Add font selector
Fix the logo upload bug

# Exit or switch context when done
🔴 Exit context
🟢 Switch to @templates
```

**Best for**: Extended work on a single feature, multiple related tasks, flow state

### Alternative Activation Phrases

```bash
# By shorthand (fastest)
@brand
@editor-mobile
@whiteboard

# By full name
"Context: Brand page"
"Focus on: Editor mobile"

# Session activation
"Entering @brand context"
"Start @whiteboard session"
"Working on @templates"
```

### Exiting Focus Context

To return to full codebase context:

```bash
"Full context"
"Exit context"
"Exit focus"
"Context: all"
🔴 Exit
```

### Context Persistence Rules

**Within Current Chat:**
- ✅ Context stays active for the entire conversation
- ✅ All subsequent prompts remain in that context
- ✅ Persists until you explicitly exit or switch

**New Cursor Chat:**
- 🔄 Always starts with **full codebase context** (default)
- 🔄 Previous session's context does NOT carry over
- 🔄 Re-activate with `🔵 Entering @context` if needed

**Examples:**

```bash
# Chat Session 1
You: 🔵 Entering @brand context
AI: [Working in @brand...]
You: Update color picker
AI: [Still in @brand...]
You: Add font selector
AI: [Still in @brand...]
# (Context persists throughout this entire chat)

# You close and open a new chat (Chat Session 2)
You: Update the navbar
AI: [Working in FULL context - brand context didn't carry over]

# If you want brand context again:
You: 🔵 Entering @brand context
AI: [Now back in @brand context]
```

### AI Behavior in Focus Mode

When you activate a focus context, AI will:

1. **Read ONLY** the focus context documentation
2. **Consider ONLY** files in Primary Scope + Allowed Dependencies
3. **Ignore** all other pages and features
4. **Stay focused** on the specified boundary
5. **Respond faster** with smaller context window
6. **Maintain context** throughout the session (if session mode) until explicitly exited or switched

## Context Catalog

### Quick Reference

| Shorthand | Full Name | Documentation |
|-----------|-----------|---------------|
| `@brand` | Brand Page | `.agent/project/pages/home/brand.md` |
| `@apps` | Apps Marketplace | `.agent/project/pages/home/apps.md` |
| `@projects` | Projects Page | `.agent/project/pages/home/projects.md` |
| `@templates` | Templates Page | `.agent/project/pages/home/templates.md` |
| `@settings` | Settings Page | `.agent/project/pages/home/settings.md` |
| `@editor` | Editor (Desktop) | `.agent/project/pages/editor/editor.md` |
| `@editor-mobile` | Editor (Mobile) | `.agent/project/contexts/editor-mobile.md` ⭐ |
| `@whiteboard` | Whiteboard Doctype | `.agent/project/pages/editor/whiteboard.md` |
| `@document` | Document Doctype | `.agent/project/pages/editor/document.md` |
| `@presentation` | Presentation Doctype | `.agent/project/pages/editor/presentation.md` |
| `@spreadsheet` | Spreadsheet Doctype | `.agent/project/pages/editor/spreadsheet.md` |

⭐ = Special case in `contexts/` folder (cross-cutting concern)

### Context Documentation Location

Focus contexts are documented based on their nature:

1. **Page-Specific Contexts**: `.agent/project/pages/*/*.md` (in "AI Focus Context" section)
   - Most contexts live here (e.g., `@brand`, `@whiteboard`, `@apps`)
   - Single source of truth with page implementation details

2. **Cross-Cutting Contexts**: `.agent/project/contexts/*.md` (dedicated files)
   - Only for special cases that don't map 1:1 to pages
   - Currently: `@editor-mobile` (mobile view across editor)

## Context Structure

Each context definition includes:

### 1. Primary Scope
Files/directories specific to this feature. These are the ONLY files AI should read/modify when in this context.

### 2. Allowed Shared Dependencies
Shared components, hooks, or utilities this feature actually uses. Limited to only what's necessary.

### 3. Explicit Ignores
Major directories to completely ignore. Helps AI avoid confusion and saves context space.

### 4. Context Keywords
Alternative phrases users might say to activate this context.

## Examples

### Example 1: Working on Brand Page

```bash
User: "@brand - update the logos view"

AI Behavior:
✅ Reads: .agent/project/pages/Home/brand.md (AI Focus Context section)
✅ Considers: src/pages/Home/Brand/** (all files)
✅ Considers: useBrandKitState hook, Header, BrandContextualNav
❌ Ignores: src/pages/Home/Projects/**
❌ Ignores: src/pages/Editor/**
❌ Ignores: All other pages

Result: Fast, focused changes to logos view only
```

### Example 2: Working on Mobile Editor

```bash
User: "@editor-mobile - improve mobile toolbar"

AI Behavior:
✅ Reads: .agent/project/contexts/editor-mobile.md
✅ Considers: src/pages/Editor/** (mobile components)
✅ Considers: MobileMenu, MobileMenuToggle, useIsMobile
✅ Considers: EditorToolbar mobile responsive code
❌ Ignores: Desktop-only editor features
❌ Ignores: All pages in Home directory (Home, Brand, Projects, Templates, Apps, etc.)
❌ Ignores: src/pages/SignedOut/**

Result: Mobile-specific improvements without desktop confusion
```

### Example 3: Working on Whiteboard Doctype

```bash
User: "@whiteboard - add infinite pan"

AI Behavior:
✅ Reads: .agent/project/pages/Editor/whiteboard.md (AI Focus Context section)
✅ Considers: src/pages/Editor/Whiteboard/**
✅ Considers: Base Editor, EditorToolbar, Canvas
✅ Considers: Shared editing components
❌ Ignores: Document, Presentation, Spreadsheet doctypes
❌ Ignores: PageNavigator (whiteboard doesn't use pages)
❌ Ignores: All pages in Home directory

Result: Whiteboard-specific pan feature without page navigation confusion
```

## Best Practices

### When to Use Focus Contexts

✅ **Use when:**
- Working on a specific page/feature
- Iterating rapidly on one component tree
- Performance/speed is critical
- Feature has clear boundaries
- Vibe coding session on isolated feature

❌ **Don't use when:**
- Making cross-feature changes
- Refactoring shared components
- Debugging integration issues
- Unclear which feature you're working on
- Need to see relationships between features

### Switching Between Contexts

You can switch contexts anytime:

```bash
# Per-prompt switching (implicit)
"@brand - update color picker"
# [AI works on Brand]

"@templates - now update the template cards"
# [AI switches to Templates]

# Session switching (explicit)
🔵 Entering @brand context
# [Do multiple brand tasks...]

🟢 Switch to @templates
# [Do multiple template tasks...]

🔴 Exit context
# [Back to full codebase context]
```

### Session Context Example

```bash
User: 🔵 Entering @brand context

AI: ✅ Activated @brand context. I'll focus exclusively on:
- src/pages/Home/Brand/**
- useBrandKitState hook
- Brand-specific components

All other pages and features are now ignored. What would you like to work on?

User: Update the color picker to show recent colors

AI: [Makes focused changes to Brand color picker]

User: Now add a font weight selector

AI: [Adds font weight selector, still in @brand context]

User: Fix the logo upload validation

AI: [Fixes logo upload, still in @brand context]

User: 🔴 Exit context

AI: ✅ Exited @brand context. Back to full codebase view.
```

### Combining with Other Documentation

Focus contexts work with existing documentation:

```bash
# Context + specific page doc
"@brand - read the logos view implementation"

# Context + skill
"@editor - load the easel-prototype skill for toolbar UI"

# Context + lessons
"@projects - apply lessons.md patterns"
```

## Context Benefits

### Speed Improvements
- **Faster reads**: Fewer files to scan
- **Faster responses**: Smaller context window
- **Faster iterations**: No unrelated file confusion

### Quality Improvements
- **Better focus**: Changes stay within scope
- **Fewer mistakes**: No accidental edits to unrelated features
- **Clearer suggestions**: AI knows exactly what's in scope

### Developer Experience
- **Mental clarity**: One feature at a time
- **Reduced cognitive load**: Don't think about entire codebase
- **Vibe coding flow**: Fast iterations without interruption

## Implementation Notes

### For AI Assistants

When you see a focus context command:

1. **Read the context documentation**:
   - For page-specific contexts: Read `.agent/project/pages/*/*.md` (AI Focus Context section)
   - For cross-cutting contexts: Read `.agent/project/contexts/*.md`
2. **Load Primary Scope files** as needed
3. **Restrict all operations** to Primary Scope + Allowed Dependencies
4. **Never mention, reference, or read** Explicit Ignore files
5. **Stay in context** until user exits or switches

### For Developers

When creating new features:

1. Add page documentation in `.agent/project/pages/`
2. Include complete "AI Focus Context" section in page doc
3. Add shorthand to catalog in this guide (CONTEXT_GUIDE.md)
4. Update INDEX.md with new context
5. **Only if cross-cutting**: Create dedicated file in `.agent/project/contexts/`

## Related Documentation

- **Page Index**: `.agent/project/pages/INDEX.md` - Master page map
- **Page Docs**: `.agent/project/pages/**/*.md` - Full page documentation (includes contexts)
- **Special Contexts**: `.agent/project/contexts/` - Cross-cutting contexts only
- **Architecture**: `.agent/project/guides/ARCHITECTURE.md` - System overview
- **Lessons**: `.agent/project/lessons.md` - Project-specific patterns

## Quick Start

1. **Find your context**: Check context catalog above
2. **Activate**: Use shorthand like `@brand` or say "Context: Brand"
3. **Work**: AI will stay focused on that feature only
4. **Switch or exit**: Change context anytime with `@other` or `full context`

---

**Pro Tip**: Start every vibe coding session with a context activation for maximum speed and focus! 🎯

