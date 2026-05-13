---
path: src/pages/SignedOut/index.tsx
component: SignedOutExperience
routes:
  - /signed-out-experience
---

# Feature: Signed Out Experience

## Responsibility

Landing page for non-authenticated users showcasing Canva's popular tools and features.

**What it does:**
- Presents hero section with Canva branding
- Displays grid of popular tools (Background Remover, Video Generation, Resume Builder)
- Provides navigation to tool-specific landing pages
- Hides sidebar for clean marketing experience

**What it never does:**
- Does not require authentication
- Does not provide actual tool functionality (directs to sign-up)
- Does not persist user data

## Key Entry Points

- **Primary Logic**: `src/pages/SignedOut/index.tsx`
- **Routes**: `/signed-out-experience`
- **Components**:
  - `Heading` - Top navigation bar with Canva logo
  - Tool cards for each feature (Background Remover, Video Generation, Resume Builder)

## Module Boundaries

- **Internal Only**: Page-specific styles in `signed_out.module.css`
- **Shared Dependencies**:
  - `@/hooks/useAppContext` - Controls sidebar visibility
  - `@/pages/SignedOut/components/Heading` - Shared header component
  - `@canva/easel` - Box, Text, Title, Button, Rows, Columns
- **Sub-Pages**: BackgroundRemover, VideoGeneration, ResumeBuilder

## Local Patterns

### Sidebar Management
```tsx
useEffect(() => {
  setSidebarVisible(false);
}, [setSidebarVisible]);
```
Always hide sidebar on signed-out pages for clean marketing experience.

### Navigation Pattern
```tsx
<Button onClick={() => navigate('/signed-out-experience/background-remover')}>
  Background Remover
</Button>
```
All tool cards navigate to their respective feature pages.

### Layout Structure
- Hero section with title and subtitle
- Grid of tool cards (one card per signed-out tool)
- Each card navigates to feature-specific landing page

## Alternative Names / Common References

Developers might refer to this as:
- "Landing page"
- "Marketing page"
- "Public homepage"
- "Unauthenticated experience"
- "Sign-out page"

## Development Notes

- Uses CSS modules for styling (`signed_out.module.css`)
- All pages hide sidebar via `useAppContext`
- Shared `Heading` component used across all signed-out pages
- Routes follow pattern: `/signed-out-experience/{feature}`

