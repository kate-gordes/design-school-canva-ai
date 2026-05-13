---
path: src/pages/Editor/Presentation
component: Presentation Doctype
parent: src/pages/editor
routes:
  - /editor/presentation
---

# Feature: Presentation Doctype

## Responsibility

**What it does:**
- Provides slide-based design editing for presentations
- Manages fixed-size slides with aspect ratios (16:9, 4:3)
- Handles slide transitions and element animations
- Displays horizontal slide navigator with thumbnails

**What it never does:**
- Does not handle flowing text (that's Document doctype)
- Does not provide infinite canvas (that's Whiteboard doctype)
- Is not for print designs - optimized for screen display

## Key Entry Points

- **Primary Logic**: `src/pages/Editor/Presentation/index.tsx`
- **Styling**: `presentation.module.css`
- **Routes**: `/editor/presentation`

## Module Boundaries

- **Parent**: Extends base `Editor` component from `src/pages/Editor/`
- **Shared Components**:
  - Uses shared `PageNavigator` component (horizontal orientation)
  - Uses shared `EditorToolbar` with slide-specific context
  - Uses shared `ObjectPanel` and `EditPanel`
- **Doctype-Specific**: Canvas optimized for slide dimensions, horizontal navigator layout

## Local Patterns

### Slide Management Pattern
Each page is an independent slide:
- Fixed slide dimensions (aspect ratio-based)
- Horizontal arrangement in PageNavigator
- Add slide buttons between thumbnails
- Slide duplication and reordering

### PageNavigator Integration
Uses standard PageNavigator component with horizontal layout:
- Thumbnails arranged left to right
- Click to navigate between slides
- Preview of each slide content

## Alternative Names

- "Presentation doctype", "Slides", "Slide editor", "Deck", "Slideshow", "Presentation mode", "PowerPoint mode", "Slide deck"

## Development Notes

- Slide dimensions should be responsive but maintain aspect ratio
- Transition effects require animation system
- Presentation mode needs full-screen handling
- Slide thumbnails need efficient rendering
- Horizontal navigator requires different layout CSS than Document

