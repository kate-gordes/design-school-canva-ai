## Task Cookbook

Short, pragmatic playbooks for common edits. Each task lists where to change code and what to check.


### Add a new Editor toolbar button

- Files: `src/components/ui/EditorToolbar/Toolbars/*Toolbar.tsx`
- Steps:
  - Add a `Button` within the appropriate toolbar component following existing variants and ariaLabel patterns
  - Ensure the button label is descriptive; aria-label is used by the responsive hiding logic
  - If the button can overflow, it will be handled automatically by `EditorToolbar/index.tsx`
- Test: Resize window to confirm the button hides into More when space is limited

### Add a new section in the Object Panel

- Files: `src/components/ui/ObjectPanel/**` or `src/components/ui/EditPanel/content/**`
- Steps:
  - Follow existing section components; prefer reusable components (e.g., grids, carousels) if present
  - For UI composition, defer to the `easel-prototype` skill
  - Wire any local selection with `useState`; update global state only if the selection affects the canvas
- Test: Interact with the section, verify scroll and selection visuals

### Wire selection updates from the canvas

- Files: `src/providers/App.tsx` reducer and callers at selection time
- Steps:
  - Dispatch `SET_SELECTION` with `{ type, bounds }`
  - Ensure toolbar switches based on `selectedObjectType`
- Test: Selecting different object types changes the toolbar

### Add a new Editor doctype

- Files: `src/components/ui/Doctypes/*`, `src/pages/Editor/index.tsx`
- Steps:
  - Create a new doctype component receiving the same props as existing ones
  - Update `Editor` switch logic to render it based on `:doctype`
- Test: Navigate to `/editor/<newdoctype>`, verify zoom and page controls work

### Add a new route/page

- Files: `src/pages/<Name>/index.tsx`, `src/App.tsx`
- Steps:
  - Build the page UI via the `easel-prototype` skill
  - Add a `<Route path="/name" element={<Name/>} />` in `App.tsx`
- Test: Navigate to the route and confirm layout spacing is consistent with other pages

### Update global state shape

- Files: `src/types.ts`, `src/providers/App.tsx`
- Steps:
  - Add fields to the AppState type
  - Extend the reducer to handle new actions with exhaustive switch
  - Expose convenience setters in `AppProvider`
- Test: Type-check passes; components receive new state via `useAppContext`

### Toolbar Edit Panel toggle (Easel pressed pattern)

- Files:
  - `src/components/ui/EditorToolbar/Items/*.tsx` (e.g., `TextColorButton.tsx`, `EffectsLabelButton.tsx`, `AnimateLabelButton.tsx`, `PositionLabelButton.tsx`, `EditShapeButton.tsx`, `FillColorButton.tsx`, `FontButton.tsx`)
  - `src/components/ui/ObjectPanel/index.tsx` (listeners that open the Edit Panel)
  - `src/components/ui/EditorToolbar/EditorToolbar.module.css` (toolbar button classes)
- Steps:
  - Use Easel `Button` and rely on its `pressed` prop for the active background.
  - In each toolbar item that opens an Edit Panel:
    - Track `active` local state.
    - `useEffect` subscribe to global events to update `active`:
      - Open events to listen for: `open-edit-panel-text`, `open-edit-panel-text-color`, `open-edit-panel-color`, `open-edit-panel-animate`, `open-edit-panel-effects`, `open-edit-panel-position`, `open-edit-panel-shape`.
      - Close event: `close-edit-panel` resets `active` to false.
    - On click, toggle:
      - If `active`: dispatch `close-edit-panel`.
      - Else: dispatch the specific `open-edit-panel-*` event for this button.
    - Pass `pressed={active}` to the Easel `Button` so the gray pressed background appears.
  - CSS: Do not override Easel backgrounds. Ensure toolbar button classes remove borders only:
    - `.iconButton` and `.labeledAction` should have `border: none !important;` and no forced background.
  - Object Panel: Ensure corresponding listeners in `ObjectPanel/index.tsx` open the right content for each `open-edit-panel-*` event via `openPanel(...)`.
- Test:
  - Click each toolbar item (Font, Text Color, Effects, Animate, Position, Shape, Fill Color):
    - Edit Panel opens with correct content.
    - Button shows gray active background while open (pressed state).
    - Clicking again (or close button) closes the panel and returns the button to normal.
