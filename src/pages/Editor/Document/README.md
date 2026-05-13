# Document Editor

## What This Is

A Google Docs-style text editor for creating text-heavy documents with flowing content. Think reports, letters, articles, and written content—not visual design layouts.

## User Experience

**Users can:**

- Create and edit text-based documents with word processor features
- Navigate between pages using vertical page thumbnails (PageNavigator)
- Add and format text content across multiple pages
- Work with flowing text that automatically paginate across pages
- Use standard document editing tools and formatting

**Key Difference from Other Doctypes:**

- **Document**: Flowing text content, vertical pages, word processor focus
- **Presentation**: Slide-based, horizontal thumbnails, presentation focus
- **Whiteboard**: Infinite canvas, no pages, collaboration focus
- **Spreadsheet**: Grid-based, data and formulas, analysis focus

## User Stories

1. **As a writer**, I want to create a multi-page report with flowing text so I can organize my written content professionally
2. **As an editor**, I want to navigate between pages quickly using thumbnails so I can review and edit different sections
3. **As a content creator**, I want my text to automatically flow to the next page when it fills up so I don't have to manually manage pagination

## Logic Flow

1. User creates new document → Document editor loads
2. Sidebar hides automatically for immersive editing
3. PageNavigator displays vertical page thumbnails
4. User types content → Text flows across pages
5. User clicks thumbnail → Editor jumps to that page
6. Content auto-saves (when implemented)

## Key Components

- **PageNavigator** - Vertical thumbnail navigation
- **TextEditor** - Main editing surface
- **Toolbar** - Formatting and document tools
- **PageCanvas** - Individual page rendering

## Roadmap / Future Enhancements

- [ ] Real-time collaboration
- [ ] Comments and suggestions
- [ ] Version history
- [ ] Advanced formatting (styles, templates)
- [ ] Export to PDF/DOCX
- [ ] Spell check and grammar suggestions

---

**For coding patterns and rules**, see `.agent/project/pages/editor/document.md`
