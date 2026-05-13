## Core Flows

Narratives of how user actions propagate through state and UI. Each flow lists trigger → files → state → render.

Note: This repo powers interactive prototypes. Flows describe prototype behaviors built with Easel components, not production backend logic.

### 1) Select Text Shape → Show Text Toolbar

- Trigger: User selects a text object in the canvas
- State: `selectedObjectType` becomes `text`
- Render: `EditorToolbar` conditionally renders `TextToolbar` and responsive overflow “More” flyout

### 2) Select Shape → Show TextShape Toolbar

- Trigger: User selects a shape-like text object
- Files: `AppProvider` reducer, `EditorToolbar/index.tsx`, `Toolbars/TextShapeToolbar.tsx`
- State: `selectedObjectType` becomes `shape`
- Render: `EditorToolbar` renders `TextShapeToolbar` with measurement-based hiding

### 3) Open Effects Panel from Object Panel

- Trigger: User opens Edit Panel and navigates to Effects
- State: Local UI state in `EffectsContent` tracks selected style/trendy effect
- Render: Effects grid thumbnails update selected state; global state unaffected until applied (future hook-in point)

### 4) Zoom Fit/Fill/Percent in Editor

- Trigger: User clicks Fit/Fill or uses Cmd/Ctrl + scroll
- Files: `src/pages/Editor/index.tsx`
- State: `zoomKind` and `zoomPercent` managed in Editor component; refs drive calculation
- Render: Doctype components receive zoom props; canvas scales accordingly

### 5) Page Add/Duplicate/Delete

- Trigger: User adds/duplicates/deletes a page from the navigator
- Files: `src/pages/Editor/index.tsx`
- State: `currentPage`, `totalPages`
- Render: Doctype updates page grid or thumbnail list; optional switch to new page

### 6) Responsive Toolbar Overflow → More Menu

- Trigger: Window resize or container size changes
- State: Internal `hiddenKeys`/`hiddenLabels`
- Render: Items beyond available width are hidden; a More button appears with a flyout of hidden actions

### 7) Screenshot → Easel translation (design import)

- Trigger: Designer pastes a screenshot and asks the AI to recreate it
- Skill: load `easel-prototype` for component, token, and icon rules
- State: None specific; focus is on component composition
- Render: Layout recreated using Easel primitives, with tokens and props for spacing/tones
