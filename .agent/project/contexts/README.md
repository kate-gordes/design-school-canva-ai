# AI Focus Contexts

Special-case context definitions for cross-cutting concerns that don't map 1:1 to page files.

## What's in This Folder?

**ONLY special cases** that don't have a dedicated page:
- `editor-mobile.md` (`@editor-mobile`) - Mobile view of editor (cross-cutting concern)

## For Page-Specific Contexts

Most contexts are documented directly in their page files:

| Shorthand | Location |
|-----------|----------|
| `@brand` | `.agent/project/pages/Home/brand.md` |
| `@apps` | `.agent/project/pages/Home/apps.md` |
| `@projects` | `.agent/project/pages/Home/projects.md` |
| `@templates` | `.agent/project/pages/Home/templates.md` |
| `@editor` | `.agent/project/pages/Editor/editor.md` |
| `@whiteboard` | `.agent/project/pages/Editor/whiteboard.md` |
| `@document` | `.agent/project/pages/Editor/document.md` |
| `@presentation` | `.agent/project/pages/Editor/presentation.md` |
| `@spreadsheet` | `.agent/project/pages/Editor/spreadsheet.md` |

See `.agent/project/pages/INDEX.md` for complete page documentation map.

## Why This Structure?

### Option 2 Approach (Current)

We use a **hybrid approach**:

1. **Page-specific contexts** → Documented in page files
   - Reduces duplication
   - Single source of truth
   - Less maintenance burden

2. **Cross-cutting contexts** → Separate files here
   - `@editor-mobile` - Mobile behavior across editor
   - Future: Cross-feature contexts (e.g., Brand + Editor integration)

### Benefits

- ✅ **Less duplication** - context rules live with page docs
- ✅ **Simpler structure** - one place to look for most contexts
- ✅ **Easier maintenance** - update once in page doc
- ✅ **Special cases handled** - contexts/ for non-1:1 mappings

## Usage

### For Page-Specific Work
```bash
@brand              # AI reads pages/Home/brand.md
@whiteboard         # AI reads pages/Editor/whiteboard.md
```

### For Cross-Cutting Work
```bash
@editor-mobile      # AI reads contexts/editor-mobile.md
```

## Adding New Contexts

### If It Maps to a Page
Add "AI Focus Context" section to the page doc in `.agent/project/pages/`

### If It's Cross-Cutting
Create a new file here in `.agent/project/contexts/` following the `editor-mobile.md` template.

## Related Documentation

- **Context Guide**: `.agent/project/guides/CONTEXT_GUIDE.md` - Full system docs
- **Page Index**: `.agent/project/pages/INDEX.md` - Master page map
- **Quick Reference**: `.agent/project/QUICK_REFERENCE.md` - Fast lookup

---

**Pro Tip**: Most contexts are in page docs now! Check there first. 🎯
