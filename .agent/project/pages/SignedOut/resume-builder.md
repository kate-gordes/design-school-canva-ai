---
path: src/pages/SignedOut/ResumeBuilder/index.tsx
component: ResumeBuilder
parent: src/pages/SignedOut/index.tsx
routes:
  - /signed-out-experience/resume-builder
---

# Feature: Resume Builder (Signed Out)

## Responsibility

Marketing landing page for Canva's resume building tool.

**What it does:**
- Showcases resume builder feature with hero banner
- Highlights professional templates and customization options
- Displays feature benefits (quick creation, beautiful templates)
- Provides call-to-action buttons to sign up
- Shows breadcrumb navigation back to main signed-out page

**What it never does:**
- Does not provide actual resume building functionality (requires sign-up)
- Does not create or store resumes
- Does not require authentication to view

## Key Entry Points

- **Primary Logic**: `src/pages/SignedOut/ResumeBuilder/index.tsx`
- **Routes**: `/signed-out-experience/resume-builder`
- **Components**:
  - `Heading` - Top navigation bar
  - `Breadcrumbs` - Navigation path display
  - `HorizontalBanner` - Feature hero section

## Module Boundaries

- **Parent**: SignedOutExperience (`/signed-out-experience`)
- **Shared Dependencies**:
  - `@/hooks/useAppContext` - Sidebar control
  - `@/pages/SignedOut/components/Heading` - Shared header
  - `@/pages/SignedOut/components/Breadcrumbs` - Navigation breadcrumbs
  - `@/pages/SignedOut/components/HorizontalBanner` - Feature banner
- **Styling**: `ResumeBuilder.module.css`

## Local Patterns

### Breadcrumb Configuration
```tsx
const breadcrumbs = [
  { label: 'Home', href: '/signed-out-experience' },
  { label: 'Resume Builder' },
];
```

### Feature Banner
```tsx
<HorizontalBanner
  title="Build professional resumes with beautiful templates"
  subtitle="Create a standout resume in minutes with our easy-to-use builder..."
  backgroundColor="#FFE5E5"
  imageUrl="..."
  primaryActionLabel="Start Building"
  primaryActionOnClick={() => navigate('/')}
/>
```

### Call-to-Action Pattern
```tsx
<Button variant="primary" onClick={() => navigate('/')}>
  Try it now - Sign up free
</Button>
<Button variant="secondary" onClick={() => navigate('/signed-out-experience')}>
  Back to tools
</Button>
```

## Alternative Names / Common References

Developers might refer to this as:
- "Resume tool landing"
- "CV builder page"
- "Resume templates page"
- "Resume creation marketing"

## Development Notes

- Pink/red-themed banner (`#FFE5E5`) - unique color among signed-out pages
- Emphasizes professional templates and quick creation
- Uses Unsplash image for visual appeal
- Primary CTA navigates to home/sign-up (`/`)
- Secondary CTA navigates back to tools page
- Hides sidebar like all signed-out pages
- Uses shared layout components for consistency

