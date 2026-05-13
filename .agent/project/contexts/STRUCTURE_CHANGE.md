# Context System Structure Change

**Date**: January 16, 2026  
**Change**: Consolidated from separate context files to hybrid approach

## What Changed?

### Before (Initial Implementation)
```
.agent/project/
├── contexts/
│   ├── README.md
│   ├── brand.md                    # Duplicate of page doc content
│   ├── editor.md                   # Duplicate of page doc content
│   ├── editor-mobile.md            # Special case
│   ├── whiteboard.md               # Duplicate of page doc content
│   ├── projects.md                 # Duplicate of page doc content
│   ├── templates.md                # Duplicate of page doc content
│   ├── apps.md                     # Duplicate of page doc content
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── USAGE_EXAMPLES.md
└── pages/
    └── [page docs with small AI Focus Context sections]
```

**Issues**:
- ❌ Duplication between contexts/ and pages/
- ❌ Two places to maintain
- ❌ Confusion about which to read
- ❌ More files to navigate

### After (Option 2 - Hybrid Approach)
```
.agent/project/
├── contexts/
│   ├── README.md                   # Explains hybrid approach
│   └── editor-mobile.md            # ONLY special cases
└── pages/
    └── [page docs with FULL AI Focus Context sections]
```

**Benefits**:
- ✅ Single source of truth for page-specific contexts
- ✅ Less duplication
- ✅ Simpler structure
- ✅ Still handles special cases (cross-cutting concerns)

## What Was Deleted

Redundant context files moved into page docs:
- ❌ `contexts/brand.md` → merged into `pages/Home/brand.md`
- ❌ `contexts/editor.md` → merged into `pages/Editor/editor.md`
- ❌ `contexts/whiteboard.md` → merged into `pages/Editor/whiteboard.md`
- ❌ `contexts/apps.md` → merged into `pages/Home/apps.md`
- ❌ `contexts/projects.md` → (will be merged when projects.md page doc is updated)
- ❌ `contexts/templates.md` → (will be merged when templates.md page doc is updated)
- ❌ `contexts/IMPLEMENTATION_SUMMARY.md` → no longer needed
- ❌ `contexts/USAGE_EXAMPLES.md` → examples in CONTEXT_GUIDE.md

## What Was Kept

Special cases that don't map 1:1 to pages:
- ✅ `contexts/editor-mobile.md` - Mobile view across editor (cross-cutting)

## Where to Find Contexts Now

### Page-Specific Contexts (Most Common)

Look in the page documentation file:

| Context | Documentation Location |
|---------|----------------------|
| `@brand` | `.agent/project/pages/Home/brand.md` (AI Focus Context section) |
| `@apps` | `.agent/project/pages/Home/apps.md` (AI Focus Context section) |
| `@editor` | `.agent/project/pages/Editor/editor.md` (AI Focus Context section) |
| `@whiteboard` | `.agent/project/pages/Editor/whiteboard.md` (AI Focus Context section) |
| `@projects` | `.agent/project/pages/Home/projects.md` (AI Focus Context section) |
| `@templates` | `.agent/project/pages/Home/templates.md` (AI Focus Context section) |

### Cross-Cutting Contexts (Special Cases)

Look in the contexts folder:

| Context | Documentation Location |
|---------|----------------------|
| `@editor-mobile` | `.agent/project/contexts/editor-mobile.md` |

## How to Use (Unchanged)

Usage remains exactly the same:

```bash
# Activate any context
@brand              # AI reads pages/Home/brand.md
@editor-mobile      # AI reads contexts/editor-mobile.md
@whiteboard         # AI reads pages/Editor/whiteboard.md

# Works the same way!
```

## For Developers

### Adding New Page-Specific Context

1. Add/expand "AI Focus Context" section in page doc (`.agent/project/pages/`)
2. Include: Primary Scope, Allowed Dependencies, Explicit Ignores, AI Instructions
3. Update CONTEXT_GUIDE.md catalog

### Adding New Cross-Cutting Context

1. Create new file in `.agent/project/contexts/`
2. Follow `editor-mobile.md` template
3. Update CONTEXT_GUIDE.md catalog

## Updated Documentation

Files updated to reflect new structure:
- ✅ `.agent/project/contexts/README.md` - Explains hybrid approach
- ✅ `.agent/project/guides/CONTEXT_GUIDE.md` - Points to page docs
- ✅ `.agent/project/QUICK_REFERENCE.md` - Updated references
- ✅ `.agent/project/README.md` - Updated directory structure
- ✅ `.agent/CONTEXT_SYSTEM.md` - Updated architecture
- ✅ `.agent/project/pages/Home/brand.md` - Full context section
- ✅ `.agent/project/pages/Home/apps.md` - Full context section
- ✅ `.agent/project/pages/Editor/editor.md` - Full context section
- ✅ `.agent/project/pages/Editor/whiteboard.md` - Full context section

## Why This Change?

Based on user feedback, we chose **Option 2** (hybrid approach) to:
1. **Reduce duplication** - context rules live with page docs
2. **Simplify structure** - one place to look for most contexts
3. **Ease maintenance** - update once in page doc
4. **Handle special cases** - contexts/ for non-1:1 mappings

This gives us the best of both worlds: simplicity for most cases, flexibility for special cases.

---

**Result**: Cleaner, simpler, less duplicated! 🎯✨

