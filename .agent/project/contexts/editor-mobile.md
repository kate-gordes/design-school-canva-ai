# Context: @editor-mobile

**Shorthand**: `@editor-mobile`  
**Full Name**: Editor (Mobile)  
**Path**: `src/pages/Editor/` (mobile components)  
**Routes**: `/editor`, `/editor/:doctype`

## Activation

Use any of these to activate this context:
- `@editor-mobile`
- "Context: Mobile Editor"
- "Focus: Editor mobile"
- "Working on mobile editor"
- "Mobile editor context"

## Primary Scope (Mobile Editor-specific)

**ONLY consider these files when in @editor-mobile context:**

```
src/pages/Editor/
├── index.tsx                           # Main editor (mobile responsive)
├── Editor.module.css                   # Mobile breakpoints
└── components/
    ├── EditorToolbar/
    │   └── [mobile-responsive toolbar components]
    ├── ObjectPanel/
    │   └── [mobile panel behavior]
    ├── EditPanel/
    │   └── [mobile panel behavior]
    └── PageNavigator/
        └── [mobile page navigation]

Mobile-specific shared components:
src/shared_components/
├── MobileMenu/                         # Mobile menu
├── MobileMenuToggle/                   # Mobile menu button
├── MobileMoreMenu/                     # Mobile overflow menu
└── Header/
    └── [mobile header behavior]
```

## Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/hooks/useIsMobile.ts` - Mobile detection hook (CRITICAL)
- `src/hooks/useAppContext.ts` - Global state
- `src/shared_components/MobileMenu/`
- `src/shared_components/MobileMenuToggle/`
- `src/shared_components/MobileMoreMenu/`
- `src/shared_components/Header/` (mobile behavior only)

## Explicitly IGNORE

**Never read, mention, or consider these:**

- ❌ Desktop-only editor features
- ❌ Large screen optimizations
- ❌ `src/pages/Home/` - all pages in Home directory (Home, Brand, Projects, Templates, Apps, etc.)
- ❌ `src/pages/SignedOut/` - different context
- ❌ Doctype-specific implementations (unless explicitly mentioned)
- ❌ Non-mobile shared components

## Critical Patterns

### ALWAYS Use useIsMobile Hook

```typescript
// CORRECT - detect mobile context
import { useIsMobile } from '@/hooks/useIsMobile';
const isMobile = useIsMobile();

// Conditional rendering
{isMobile ? <MobileComponent /> : <DesktopComponent />}
```

### Mobile Layout Principles
- **Simplified toolbars**: Fewer visible tools, use overflow menus
- **Bottom navigation**: Important actions at bottom (thumb-friendly)
- **Full-screen panels**: Panels take full screen, not docked
- **Touch targets**: Minimum 44px touch targets
- **Gestures**: Support swipe, pinch-to-zoom

### Mobile Breakpoints
```css
/* Mobile breakpoint */
@media (max-width: 768px) {
  /* Mobile styles */
}
```

## AI Instructions

When `@editor-mobile` context is active:

1. ✅ **READ ONLY** mobile-specific editor files
2. ✅ **FOCUS ON** mobile UX patterns (touch, gestures, small screens)
3. ❌ **NEVER suggest** desktop-only features
4. ❌ **NEVER mention** home pages or other features
5. ✅ **ALWAYS check** `useIsMobile` hook usage
6. ✅ **PRIORITIZE** mobile-first design decisions

## Quick Commands in Context

```bash
@editor-mobile - improve toolbar for small screens
@editor-mobile - add gesture support to canvas
@editor-mobile - optimize panel transitions
@editor-mobile - test touch target sizes
@editor-mobile - improve mobile menu
```

## Mobile-Specific Considerations

### Performance
- Optimize rendering for mobile devices
- Minimize re-renders
- Lazy load heavy components
- Consider battery/CPU constraints

### Touch Interactions
- Support pinch-to-zoom
- Implement swipe gestures
- Prevent accidental touches
- Show touch feedback

### Screen Real Estate
- Maximize canvas space
- Hide panels when not in use
- Use bottom sheets for actions
- Minimize chrome/UI elements

## Related Documentation

- **Full Editor Doc**: `.agent/project/pages/Editor/editor.md`
- **Mobile Design Guide**: `.agent/project/guides/mobile_design.md`
- **Context Guide**: `.agent/project/guides/CONTEXT_GUIDE.md`

