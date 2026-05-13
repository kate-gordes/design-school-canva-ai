---
path: src/pages/home/DesignSchool
component: DesignSchool
parent: src/pages/home
routes:
  - /design-school
---

# Feature: Design School

## AI Focus Context

**Shorthand**: `@design-school`  
**Activation**: Use `@design-school`, "Context: Design School", or "Working on design school"

### Primary Scope (DesignSchool-specific)

**ONLY consider these files when in @design-school context:**

```
src/pages/home/DesignSchool/
├── index.tsx                    # Main DesignSchool component (router)
├── DesignSchool.module.css      # Desktop styles (unused currently)
├── MobileDesignSchool.tsx       # Mobile-only implementation
└── MobileDesignSchool.module.css # Mobile styles
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

When `@design-school` context is active:

1. ✅ **READ ONLY** DesignSchool page files
2. ✅ **FOCUS ON** mobile-only implementation (desktop redirects to home)
3. ❌ **NEVER mention** other pages in Home directory or Editor
4. ✅ **CONSIDER** design learning and educational content
5. ✅ **PRIORITIZE** mobile user experience

## Responsibility

**What it does:**
- Provides design learning resources and tutorials
- Shows educational content for design skills
- Offers courses and guides (mobile-only)
- Redirects to home on desktop (not yet implemented for desktop)

**What it never does:**
- Does not handle design creation or editing
- Does not manage user projects
- Is not for template browsing
- Does not provide general Canva features (mobile-only feature)

## Key Entry Points

- **Primary Logic**: `src/pages/home/DesignSchool/index.tsx` (router)
- **Mobile Implementation**: `MobileDesignSchool.tsx`
- **Desktop Behavior**: Redirects to home ("/")
- **Styling**: 
  - `DesignSchool.module.css` (desktop, unused)
  - `MobileDesignSchool.module.css` (mobile)
- **Routes**: `/design-school`

## Module Boundaries

- **Parent**: Sub-page of `Home`
- **Shared Components**: Minimal (mobile-only feature)
- **Local Components**: 
  - `MobileDesignSchool.tsx` - Full mobile implementation
- **Export**: Default DesignSchool component (router)

## Local Patterns

### Mobile-Only Pattern
Unique pattern among home pages:
```typescript
// Desktop users redirected to home
useEffect(() => {
  if (!isMobile) {
    navigate('/');
  }
}, [isMobile, navigate]);

// Mobile users see MobileDesignSchool
if (!isMobile) {
  return null;
}
return <MobileDesignSchool />;
```

### Router Component Pattern
Main index.tsx serves as router:
- Detects mobile vs desktop
- Redirects desktop to home
- Renders MobileDesignSchool for mobile
- No desktop implementation currently

### Desktop Future Implementation
- Desktop CSS file exists but unused
- Ready for desktop version implementation
- Currently design school is mobile-first feature

## Alternative Names

- "Design School page", "Learning center", "Design education", "Tutorials", "Design courses", "Learning hub", "Design academy", "Training center", "Education portal"

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
- This is the only home page with mobile-only restriction
- Grow and More pages also mobile-only but implemented differently

