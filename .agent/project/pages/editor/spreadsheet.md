---
path: src/pages/Editor/Spreadsheet
component: Spreadsheet Doctype
parent: src/pages/editor
routes:
  - /editor/spreadsheet
---

# Feature: Spreadsheet Doctype

## Responsibility

**What it does:**
- Provides grid-based editing with cells, rows, and columns
- Handles cell-by-cell editing and selection
- Manages table data editing and formatting
- Implements spreadsheet-specific tools (similar to Excel/Google Sheets)

**What it never does:**
- Does not use free-form canvas (uses structured grid)
- Does not handle flowing text or infinite canvas
- Is not for visual design - focused on structured data

## Key Entry Points

- **Primary Logic**: `src/pages/Editor/Spreadsheet/index.tsx`
- **Styling**: `spreadsheet.module.css`
- **Routes**: `/editor/spreadsheet`

## Module Boundaries

- **Parent**: Extends base `Editor` component from `src/pages/Editor/`
- **Shared Components**:
  - Uses shared `EditorToolbar` with cell formatting context
  - Uses shared `ObjectPanel` and `EditPanel` (spreadsheet-specific content)
- **Doctype-Specific**: Canvas replaced with grid/table rendering, cell-based selection

## Local Patterns

### Grid Rendering Pattern
Different rendering approach than canvas:
- Virtual scrolling for large datasets
- Cell rendering optimization
- Row/column headers
- Grid lines and borders
- Cell selection highlighting
- Frozen rows/columns (optional)

### Cell Selection Pattern
Cell-based selection instead of object selection:
- Single cell or range selection
- Keyboard navigation (arrow keys, tab, enter)
- Cell data model separate from rendering

## Grid Rendering Considerations

- Grid rendering should be virtualized for performance
- Cell editing requires inline text editing
- Copy/paste should handle cell ranges
- Cell formatting (borders, colors, alignment)
- Row/column resizing interactions
- Cell merging capabilities (optional)

## Alternative Names

- "Spreadsheet doctype", "Sheets", "Grid editor", "Table editor", "Cells", "Excel mode", "Data grid", "Spreadsheet mode"

## Development Notes

- Virtual scrolling critical for large spreadsheets
- Cell data model should be separate from rendering
- Different selection paradigm from canvas objects
- Keyboard navigation is essential for usability

