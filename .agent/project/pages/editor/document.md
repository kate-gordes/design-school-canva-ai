---
path: src/pages/Editor/Document
component: Document Doctype
parent: src/pages/editor
routes:
  - /editor/document
---

# Feature: Document Doctype

## Responsibility

**What it does:**
- Provides word processor-style text editing with flowing content (like Google Docs)
- Handles text reflow and automatic page breaks
- Manages multi-page text documents
- Provides text-centric editing tools and toolbar

**What it never does:**
- Does not handle fixed-position canvas design (that's for design types like flyers/posters)
- Does not manage spreadsheet grids or infinite canvas
- Is not for visual design - focuses on text documents

## Key Entry Points

- **Primary Logic**: `src/pages/Editor/Document/index.tsx`
- **Styling**: `document.module.css`
- **Routes**: `/editor/document`

## Module Boundaries

- **Parent**: Extends base `Editor` component from `src/pages/Editor/`
- **Shared Components**:
  - Uses shared `PageNavigator` component for page thumbnails
  - Uses shared `EditorToolbar` with text-specific context
  - Uses shared `ObjectPanel` and `EditPanel`
- **Doctype-Specific**: Canvas rendering modified for flowing text vs fixed positioning

## Local Patterns

### Text Flow Pattern
Text flows like a word processor - not fixed positioning:
- Text reflows on window resize
- Automatic page break calculation
- Cursor positioning in flowing text
- Selection behavior across text blocks

### Page Management
Uses standard PageNavigator with vertical page arrangement:
- Page thumbnails at bottom
- Add page buttons between pages
- Click to navigate between pages

## Alternative Names

- "Document doctype", "Doc editor", "Text editor", "Word processor", "Docs", "Document mode", "Text document", "Google Docs mode"

## Development Notes

- Text reflow is key differentiator from canvas-based design
- May use different canvas rendering approach than other doctypes
- Focus on text manipulation vs visual design
- Page breaks handled automatically, not manually placed

