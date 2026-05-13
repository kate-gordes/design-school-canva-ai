---
path: src/pages/SignedOut/VideoGeneration/index.tsx
component: VideoGeneration
parent: src/pages/SignedOut/index.tsx
routes:
  - /signed-out-experience/video-generation
---

# Feature: Video Generation (Signed Out)

## Responsibility

Marketing landing page for Canva's AI video generation feature powered by Google's Veo-3.

**What it does:**
- Showcases AI video generation capabilities
- Highlights text-to-video functionality
- Displays feature benefits (cinematic visuals, synchronized audio, dialogue)
- Provides sign-up call-to-action buttons
- Shows breadcrumb navigation
- Includes footer with social links and columns

**What it never does:**
- Does not generate actual videos (requires sign-up)
- Does not process video content
- Does not require authentication to view

## Key Entry Points

- **Primary Logic**: `src/pages/SignedOut/VideoGeneration/index.tsx`
- **Routes**: `/signed-out-experience/video-generation`
- **Components**:
  - `Heading` - Top navigation bar
  - `Breadcrumbs` - Navigation path display
  - `HorizontalBanner` - Feature hero section
  - `FooterColumns` - Footer column layout
  - `SocialLinks` - Social media links

## Module Boundaries

- **Parent**: SignedOutExperience (`/signed-out-experience`)
- **Shared Dependencies**:
  - `@/hooks/useAppContext` - Sidebar control
  - `@/pages/SignedOut/components/Heading` - Shared header
  - `@/pages/SignedOut/components/Breadcrumbs` - Navigation breadcrumbs
  - `@/pages/SignedOut/components/HorizontalBanner` - Feature banner
  - `@/pages/SignedOut/components/Footer/FooterColumns` - Footer layout
  - `@/pages/SignedOut/components/Footer/SocialLinks` - Social media links
- **Styling**: `VideoGeneration.module.css`

## Local Patterns

### Breadcrumb Configuration
```tsx
const breadcrumbs = [
  { label: 'Home', href: '/signed-out-experience' },
  { label: 'Video Generation' },
];
```

### Feature Banner with AI Branding
```tsx
<HorizontalBanner
  title="Bring your best ideas to life with Canva's AI video generator"
  subtitle="With Canva AI's Create a Video Clip, powered by Google's Veo-3..."
  backgroundColor="#E5D4F5"
  imageUrl="..."
  primaryActionLabel="Generate AI video"
  primaryActionOnClick={() => navigate('/')}
/>
```

### Footer Pattern
This page includes a full footer with columns and social links (unique among signed-out pages):
```tsx
<FooterColumns />
<SocialLinks />
```

## Alternative Names / Common References

Developers might refer to this as:
- "AI video landing"
- "Veo-3 video page"
- "Text-to-video marketing"
- "Video AI tool page"
- "Video creation landing"

## Development Notes

- Purple-themed banner (`#E5D4F5`) - same as Background Remover
- Mentions Google's Veo-3 AI technology
- Only signed-out page with full footer (FooterColumns + SocialLinks)
- Emphasizes AI capabilities: cinematic visuals, audio, dialogue, sound effects
- Hides sidebar like all signed-out pages
- Primary CTA navigates to home/sign-up (`/`)

