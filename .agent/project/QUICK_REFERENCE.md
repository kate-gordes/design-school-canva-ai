# Quick Reference Card

Fast access to key documentation and AI focus contexts.

## 🎯 AI Focus Contexts (For Speed!)

Activate focused contexts for fast vibe coding:

| Shorthand | Feature | Path |
|-----------|---------|------|
| `@brand` | Brand Page | `src/pages/home/Brand/` |
| `@projects` | Projects Page | `src/pages/home/Projects/` |
| `@templates` | Templates Page | `src/pages/home/Templates/` |
| `@apps` | Apps Marketplace | `src/pages/home/Apps/` |
| `@settings` | Settings Page | `src/pages/home/Settings/` |
| `@editor` | Editor (Desktop) | `src/pages/Editor/` |
| `@editor-mobile` | Editor (Mobile) | `src/pages/Editor/` (mobile) |
| `@whiteboard` | Whiteboard Doctype | `src/pages/Editor/Whiteboard/` |

**Usage**: Just say `@brand` or "Context: Brand" to activate!

**Full Guide**: `.agent/project/guides/CONTEXT_GUIDE.md`  
**Context Docs**: Mostly in page docs (`.agent/project/pages/`), special cases in `.agent/project/contexts/`

## 📚 Essential Documentation

### For AI Assistants
- **Context Guide**: `.agent/project/guides/CONTEXT_GUIDE.md` - Focus context system
- **Page Index**: `.agent/project/pages/INDEX.md` - Master page map
- **Lessons**: `.agent/project/lessons.md` - Project patterns

### Code Standards
- **Web Conventions**: `.agent/project/guides/web_conventions.md` - Import rules, testing
- **Coding Guide**: `.agent/project/guides/coding_guide.md` - General standards

### Content & Design
- **Content Guide**: `.agent/project/guides/content/content_guide.md` - Voice & tone
- **Accessibility**: `.agent/project/guides/accessibility.md` - A11y requirements

## 🗂️ Directory Structure

```
src/
├── pages/
│   ├── home/               # Home page directory
│   │   ├── Home/           # Home page component
│   │   ├── Brand/          → @brand
│   │   ├── Projects/       → @projects
│   │   ├── Templates/      → @templates
│   │   ├── Apps/           → @apps
│   │   └── Settings/       → @settings
│   ├── Editor/             → @editor
│   │   ├── Whiteboard/     → @whiteboard
│   │   ├── Document/
│   │   ├── Presentation/
│   │   └── Spreadsheet/
│   └── SignedOut/
├── shared_components/      # Shared across pages
└── hooks/                  # Global hooks
```

## 🚀 Quick Start Workflow

1. **Activate context**: `@brand` (or whatever you're working on)
2. **AI reads context**: Focuses only on that feature
3. **Vibe code**: Fast iterations without distraction
4. **Switch context**: `@templates` (or exit with "full context")

## 💡 Pro Tips

- **Start every session with a context** for maximum speed
- **Use shorthand** (`@brand`) instead of long phrases
- **Switch anytime** - just use a different shorthand
- **Exit focus** with "full context" when needed
- **Combine with page docs** for complete understanding

## 🔍 Finding Things

| Need | Check |
|------|-------|
| What pages exist? | `.agent/project/pages/INDEX.md` |
| How does X work? | `.agent/project/pages/*/X.md` |
| Focus on X? | `@X` - context is in page doc (AI Focus Context section) |
| Code standards? | `.agent/project/guides/coding_guide.md` |
| Project lessons? | `.agent/project/lessons.md` |

## 📝 Import Rules

**ALWAYS use `@/` alias:**
```typescript
// ✅ CORRECT
import { Component } from '@/components/ui/Component';
import { useAppContext } from '@/hooks/useAppContext';

// ❌ WRONG
import { Component } from '../../../../components/ui/Component';
```

## 🏃 Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
npm run format       # Format code
npm run test:e2e     # Run E2E tests
```

---

**Remember**: Focus contexts = Speed + Clarity + Better Results! 🎯

