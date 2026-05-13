---
path: src/pages/home/More
component: More
parent: src/pages/home
routes:
  - /more
---

# Feature: More

## AI Focus Context

**Shorthand**: `@more`  
**Activation**: Use `@more`, "Context: More", or "Working on more"

### Primary Scope (More-specific)

**ONLY consider these files when in @more context:**

```
src/pages/home/More/
├── index.tsx                    # Main More component
└── More.module.css              # Styles
```

### Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/pages/home/components/` - Shared home components
  - `MobilePageLayout/` - Mobile layout wrapper
  - `Wonderbox/icons/MagicIcon` - Magic icon for Canva AI
- `src/hooks/useIsMobile.ts` - Mobile detection
- React Router `useNavigate` for navigation
- Easel Menu components from `@canva/easel/menu`
- Easel icons from `@canva/easel/icons`

### Explicitly IGNORE

**Never read, mention, or consider these:**

- ❌ `src/pages/home/Home/index.tsx` - different page (main Home page)
- ❌ `src/pages/home/Brand/` - different page (but links to it)
- ❌ `src/pages/home/Projects/` - different page
- ❌ `src/pages/home/Templates/` - different page
- ❌ `src/pages/home/Apps/` - different page (but links to it)
- ❌ `src/pages/home/Creator/` - different page
- ❌ `src/pages/home/CanvaAI/` - different page (but links to it)
- ❌ `src/pages/Editor/` - different context
- ❌ `src/pages/SignedOut/` - different context

### AI Instructions

When `@more` context is active:

1. ✅ **READ ONLY** More page files
2. ✅ **FOCUS ON** mobile-only navigation menu
3. ❌ **NEVER mention** other pages except as navigation targets
4. ✅ **CONSIDER** menu organization and navigation patterns
5. ✅ **PRIORITIZE** mobile navigation UX

## Responsibility

**What it does:**
- Provides mobile-only navigation hub for additional features
- Shows menu of additional pages and tools
- Links to Brand, Canva AI, Apps, Grow, Design School
- Provides access to Trash
- Redirects to home on desktop (mobile-only page)

**What it never does:**
- Does not implement the features it links to
- Does not handle design creation or editing
- Is not for content display (just navigation)
- Does not work on desktop (redirects to home)

## Key Entry Points

- **Primary Logic**: `src/pages/home/More/index.tsx`
- **Mobile Only**: Redirects to home on desktop
- **Styling**: `More.module.css`
- **Routes**: `/more`

## Module Boundaries

- **Parent**: Sub-page of `Home`
- **Shared Components**:
  - `@/pages/home/components/MobilePageLayout/` - Layout wrapper
  - `@/pages/home/components/Wonderbox/icons/MagicIcon` - Canva AI icon
- **Local Components**: None (all inline in main component)
- **Export**: Default More component

## Local Patterns

### Mobile-Only Navigation Hub
Unlike DesignSchool/Grow which show content, More is pure navigation:
```typescript
// Redirects desktop to home
React.useEffect(() => {
  if (!isMobile) {
    navigate('/');
  }
}, [isMobile, navigate]);
```

### Menu Navigation Pattern
Uses Easel Menu component with MenuItem:
- Each item has start icon, text, and end chevron
- onClick handlers navigate to target pages
- Console logging for all actions

### Menu Structure
Six menu items in two groups:
1. **Main Features**:
   - Brand (BrandSwatchIcon)
   - Canva AI (Custom MagicIcon)
   - Apps (AppsPlusIcon)
   - Grow (MegaphoneIcon)
   - Design School (DesignSchoolIcon)

2. **Utility** (separated by divider):
   - Trash (TrashIcon)

### Icon Pattern
- All menu items use a `size="medium"` icon, except `MagicIcon` (custom, sized via prop)
- `ChevronRightIcon` as end icon for all items
- Consistent visual hierarchy across rows
- (Icon resolution and sizing rules: see the `easel-prototype` skill)

### Navigation Handling
Centralized navigation logic:
- handleMenuItemClick(action) function
- Conditional navigation based on action string
- Console logging for debugging
- Clean separation of concerns

## Alternative Names

- "More page", "More menu", "Navigation hub", "Additional features", "Overflow menu", "Extended menu", "Mobile menu", "Feature menu", "Navigation menu"

## Development Notes

- **IMPORTANT**: Mobile-only page - desktop redirects to home
- Pure navigation component (no content display)
- Uses MobilePageLayout with no search
- Title: "More"
- Custom CSS class for menu styling
- Divider implemented as styled Box
- All navigation uses React Router navigate()
- Console logging helps with debugging navigation
- Part of mobile navigation system
- Accessible from mobile bottom nav bar
- Provides access to mobile-only features (Grow, Design School)
- Links to features available on desktop (Brand, Apps, Canva AI)
- Trash functionality accessible only from More menu on mobile
- Uses consistent icon sizing and spacing

