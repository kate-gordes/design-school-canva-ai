---
path: src/pages/SignedOut/BackgroundRemover/index.tsx
component: BackgroundRemover
parent: src/pages/SignedOut/index.tsx
routes:
  - /signed-out-experience/background-remover
---

# Feature: Background Remover (Signed Out)

## Responsibility

Marketing landing page for Canva's AI-powered background removal tool.

**What it does:**
- Showcases background remover feature with hero banner
- Displays feature benefits and use cases
- Provides call-to-action buttons to sign up
- Shows breadcrumb navigation back to main signed-out page

**What it never does:**
- Does not provide actual background removal functionality (requires sign-up)
- Does not process or store images
- Does not require authentication to view

## Key Entry Points

- **Primary Logic**: `src/pages/SignedOut/BackgroundRemover/index.tsx`
- **Routes**: `/signed-out-experience/background-remover`
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
- **Styling**: `BackgroundRemover.module.css`

## Local Patterns

### Breadcrumb Configuration
```tsx
const breadcrumbs = [
  { label: 'Home', href: '/signed-out-experience' },
  { label: 'Background Remover' },
];
```

### Feature Banner
```tsx
<HorizontalBanner
  title="Remove backgrounds instantly with AI"
  subtitle="Upload an image and remove its background automatically..."
  backgroundColor="#E5D4F5"
  imageUrl="..."
  primaryActionLabel="Try Background Remover"
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
- "BG remover landing"
- "Background removal marketing page"
- "AI background tool page"
- "Image background remover"

## Development Notes

- Purple-themed banner (`#E5D4F5`)
- Primary CTA navigates to home/sign-up (`/`)
- Secondary CTA navigates back to tools page
- Hides sidebar like all signed-out pages
- Uses shared layout components for consistency

