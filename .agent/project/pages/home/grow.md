---
path: src/pages/home/Grow
component: Grow
parent: src/pages/home
routes:
  - /grow
---

# Feature: Grow

## AI Focus Context

**Shorthand**: `@grow`  
**Activation**: Use `@grow`, "Context: Grow", or "Working on grow"

### Primary Scope (Grow-specific)

**ONLY consider these files when in @grow context:**

```
src/pages/home/Grow/
├── index.tsx                    # Main Grow component (router)
├── Grow.module.css              # Desktop styles (unused currently)
├── MobileGrow.tsx               # Mobile-only implementation
└── MobileGrow.module.css        # Mobile styles
```

### Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/hooks/useIsMobile.ts` - Mobile detection
- React Router `useNavigate` for redirects
- Easel components from `@canva/easel`

### Explicitly IGNORE

**Never read, mention, or consider these:**

- ❌ `src/pages/home/Home/index.tsx` - different page (main Home page)
- ❌ `src/pages/home/Brand/` - different page
- ❌ `src/pages/home/Projects/` - different page
- ❌ `src/pages/home/Templates/` - different page
- ❌ `src/pages/home/Apps/` - different page
- ❌ `src/pages/home/Creator/` - different page
- ❌ `src/pages/home/CanvaAI/` - different page
- ❌ `src/pages/Editor/` - different context
- ❌ `src/pages/SignedOut/` - different context
- ❌ All other pages

### AI Instructions

When `@grow` context is active:

1. ✅ **READ ONLY** Grow page files
2. ✅ **FOCUS ON** mobile-only implementation (desktop redirects to home)
3. ❌ **NEVER mention** other pages in Home directory or Editor
4. ✅ **CONSIDER** growth and marketing features
5. ✅ **PRIORITIZE** mobile user experience

## Responsibility

**What it does:**
- Provides growth and marketing tools for users
- Shows analytics and audience insights (mobile-only)
- Offers promotional features and campaigns
- Helps users grow their audience and reach
- Redirects to home on desktop (not yet implemented for desktop)

**What it never does:**
- Does not handle design creation or editing
- Does not manage user projects
- Is not for template browsing
- Does not provide general Canva features (mobile-only feature)

## Key Entry Points

- **Primary Logic**: `src/pages/home/Grow/index.tsx` (router)
- **Mobile Implementation**: `MobileGrow.tsx`
- **Desktop Behavior**: Redirects to home ("/")
- **Styling**: 
  - `Grow.module.css` (desktop, unused)
  - `MobileGrow.module.css` (mobile)
- **Routes**: `/grow`

## Module Boundaries

- **Parent**: Sub-page of `Home`
- **Shared Components**: Minimal (mobile-only feature)
- **Local Components**: 
  - `MobileGrow.tsx` - Full mobile implementation
- **Export**: Default Grow component (router)

## Local Patterns

### Mobile-Only Pattern
Same pattern as DesignSchool:
```typescript
// Desktop users redirected to home
useEffect(() => {
  if (!isMobile) {
    navigate('/');
  }
}, [isMobile, navigate]);

// Mobile users see MobileGrow
if (!isMobile) {
  return null;
}
return <MobileGrow />;
```

### Router Component Pattern
Main index.tsx serves as router:
- Detects mobile vs desktop
- Redirects desktop to home
- Renders MobileGrow for mobile
- No desktop implementation currently

### Desktop Future Implementation
- Desktop CSS file exists but unused
- Ready for desktop version implementation
- Currently growth features are mobile-first

## Alternative Names

- "Grow page", "Growth hub", "Marketing center", "Audience growth", "Analytics", "Promotion tools", "Growth tools", "Marketing dashboard", "Reach optimization"

## Development Notes

- **IMPORTANT**: Mobile-only feature - desktop redirects to home
- Main component is just a router (no UI)
- Mobile implementation in separate component
- Desktop styles exist but not used
- No desktop version implemented yet
- Uses React Router for navigation
- useIsMobile hook critical for routing decision
- Returns null immediately on desktop to prevent flash
- Future desktop implementation would go in main index.tsx
- Mobile component handles all actual functionality
- Same mobile-only pattern as DesignSchool
- Accessible from mobile More menu with MegaphoneIcon
- Part of mobile-only trio: DesignSchool, Grow, More

