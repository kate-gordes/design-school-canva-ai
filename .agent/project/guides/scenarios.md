## Scenario Map (Flows → Tests)

This doc maps core flows to existing Playwright tests and highlights gaps.

### Existing Tests

- tests/e2e/app.spec.ts – basic navigation and app shell
- tests/e2e/editor.spec.ts – editor interactions
- tests/e2e/ui-interactions.spec.ts – UI component behavior

### Flow Coverage

- Select Text Shape → Toolbar switches: Covered in editor.spec.ts (selection and toolbar presence)
- Zoom Fit/Fill/Percent: Covered in editor.spec.ts (zoom controls)
- Page Add/Duplicate/Delete: Covered in editor.spec.ts (page operations)
- Responsive Toolbar Overflow: Partially covered in ui-interactions.spec.ts; consider adding explicit viewport resize assertions
- Effects Panel Selection: Gap – add a test to open Edit Panel → Effects and select an item

### Proposed Additions

- Add `effects_selection.spec.ts` to validate Effects grid selection state
- Add `toolbar_overflow.func.ts` style test to assert hidden labels appear in More menu when width constrained
