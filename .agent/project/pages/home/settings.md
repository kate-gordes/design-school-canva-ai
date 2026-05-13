---
path: src/pages/home/Settings
component: Settings
parent: src/pages/home
routes:
  - /settings
---

# Feature: Settings

## AI Focus Context

**Shorthand**: `@settings`  
**Activation**: Use `@settings`, "Context: Settings", or "Working on settings"

### Primary Scope (Settings-specific)

**ONLY consider these files when in @settings context:**

```
src/pages/home/Settings/
├── index.tsx                    # Main Settings component
└── Settings.module.css          # Styles
```

### Allowed Shared Dependencies

**Only these shared components/hooks:**

- `src/shared_components/Header/` - Header system
- `src/pages/home/components/` - Shared home components
  - `GradientText/` - Gradient text heading
  - `Wonderbox/` - Search functionality
- `src/hooks/useAppContext.ts` - Global state
- `src/hooks/useIsMobile.ts` - Mobile detection
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

When `@settings` context is active:

1. ✅ **READ ONLY** Settings page files
2. ✅ **FOCUS ON** user settings and preferences
3. ❌ **NEVER mention** other pages in Home directory or Editor
4. ✅ **CONSIDER** account settings, preferences, and configuration options
5. ✅ **PRIORITIZE** settings organization and user experience

## Responsibility

**What it does:**
- Displays user settings and preferences
- Provides account configuration options
- Manages user preferences and settings
- Shows settings in organized sections
- Handles settings updates and changes

**What it never does:**
- Does not handle design creation or editing
- Does not manage projects or files
- Is not for brand asset management
- Does not provide template browsing

## Key Entry Points

- **Primary Logic**: `src/pages/home/Settings/index.tsx`
- **Mobile Version**: Included with conditional rendering (no border radius on mobile)
- **Styling**: `Settings.module.css`
- **Routes**: `/settings`

## Module Boundaries

- **Parent**: Sub-page of `Home`
- **Shared Components**:
  - `@/shared_components/Header/` - Header component
  - `@/pages/home/components/GradientText/` - Settings title
  - `@/pages/home/components/Wonderbox/` - Search/navigation
- **Local Components**: None currently (minimal implementation)
- **Export**: Default Settings component

## Local Patterns

### Header Integration
- Explicitly renders Header component (unique among home pages)
- Uses flex column layout to accommodate header
- Header always visible on Settings page

### Mobile Responsive
- Conditionally removes border radius on mobile
- Uses `useIsMobile` hook for detection
- Same content layout on mobile and desktop
- Mobile gets no rounded corners for full-width appearance

### Minimal Implementation
Current implementation is basic:
- GradientText showing "Settings"
- Wonderbox for navigation
- Ready for expansion with settings sections
- Clean layout with shadow and proper spacing

### Visibility Management
- Ensures sidebar visibility on mount
- Ensures secondary nav visibility on mount
- Uses useEffect to restore visibility state

## Alternative Names

- "Settings page", "Preferences", "Account settings", "User settings", "Configuration", "Options", "Account preferences", "User preferences", "Settings panel"

## Development Notes

- Only home page that explicitly renders Header component
- Currently minimal with placeholder content
- Uses flex layout to stack Header and content
- Mobile detection affects border radius only
- Wonderbox included but settings-specific features pending
- Ready for expansion with:
  - Account settings sections
  - Preference controls
  - Privacy settings
  - Notification preferences
  - Billing/subscription management
  - Integration settings
- Uses standard Box layout with shadow
- GradientText serves as page title
- Full width/height layout structure

