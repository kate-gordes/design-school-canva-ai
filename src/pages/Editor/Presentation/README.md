# Presentation Editor

## What This Is

A slide-based presentation editor for creating visual presentations with multiple slides. Similar to PowerPoint or Google Slides, optimized for presenting ideas visually.

## User Experience

**Users can:**

- Create and edit slide-based presentations
- Navigate between slides using horizontal slide thumbnails (PageNavigator)
- Add visual elements, text, images to each slide
- Design slides for projection and presentation
- Preview and present their slideshows

**Key Difference from Other Doctypes:**

- **Presentation**: Discrete slides, horizontal thumbnails, visual storytelling
- **Document**: Flowing text, vertical pages, written content
- **Whiteboard**: Infinite canvas, no structure, freeform ideation
- **Spreadsheet**: Data tables, formulas, analysis

## User Stories

1. **As a presenter**, I want to create slides with visuals and text so I can present my ideas effectively
2. **As a designer**, I want to see all my slides at a glance using horizontal thumbnails so I can ensure visual consistency
3. **As a storyteller**, I want each slide to be a discrete unit so I can control the flow of information
4. **As a speaker**, I want to present my slides full-screen so my audience can focus on one slide at a time

## Logic Flow

1. User creates new presentation → Presentation editor loads
2. Sidebar hides for focused editing
3. PageNavigator displays horizontal slide thumbnails
4. User designs first slide → Can add elements
5. User adds new slide → Creates blank canvas
6. User clicks thumbnail → Editor switches to that slide
7. User enters present mode → Full-screen slideshow (future)

## Key Components

- **PageNavigator** - Horizontal slide thumbnail navigation
- **SlideCanvas** - Individual slide editing surface
- **Toolbar** - Design and presentation tools
- **ElementPalette** - Visual elements to add

## Roadmap / Future Enhancements

- [ ] Presentation mode (full-screen slideshow)
- [ ] Slide transitions and animations
- [ ] Speaker notes
- [ ] Presenter view (notes + timer)
- [ ] Slide templates and themes
- [ ] Export to PowerPoint/PDF
- [ ] Embed videos and interactive elements

---

**For coding patterns and rules**, see `.agent/project/pages/editor/presentation.md`
