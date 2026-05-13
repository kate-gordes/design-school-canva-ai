---
path: src/pages/Home/CanvaAI
component: Canva AI
parent: src/pages/Home
routes:
  - /ai
sub_pages:
  - CanvaAIChat
---

# Feature: Canva AI

## Responsibility

**What it does:**
- Showcases Canva's AI-powered tools and features
- Provides discovery hub for AI capabilities (Magic Write, Magic Design, etc.)
- Offers quick access to AI tool launch flows
- Displays examples and demos of AI features
- Acts as parent for CanvaAIChat sub-page

**What it never does:**
- Does not implement actual AI functionality (links to tools)
- Does not handle AI chat conversations (that's CanvaAIChat sub-page)
- Is not the AI processing backend

## Key Entry Points

- **Primary Logic**: `src/pages/Home/CanvaAI/index.tsx`
- **Mobile Version**: `MobileCanvaAI.tsx`
- **Styling**: `CanvaAI.module.css`
- **Routes**: 
  - `/ai` - AI showcase page
  - `/ai/thread/:chatId` - Chat interface (CanvaAIChat sub-page)

### Sub-Pages

**CanvaAIChat** - Located at `CanvaAIChat/`
- Conversational AI interface
- See CanvaAIChat documentation for details

## Module Boundaries

- **Parent**: Sub-page of `Home`
- **Child**: CanvaAIChat is a sub-page of CanvaAI
- **Shared Components**:
  - Uses shared Header component
- **Export**: Default CanvaAI component

## Local Patterns

### Feature Showcase Pattern
Marketing/discovery focused:
- Feature cards for different AI tools
- Hero section showcasing AI capabilities
- Quick action buttons to launch AI features
- Example galleries of AI-generated content
- Educational sections about AI usage

## Alternative Names

- "Canva AI page", "AI tools", "AI features", "Artificial intelligence", "Magic tools", "AI hub", "AI showcase", "Magic suite", "AI capabilities"

## Development Notes

- Focus on visual showcase and demos
- Quick action buttons should link to actual tools
- Mobile version likely simplified
- May include video demonstrations
- Feature cards should be reusable
- Consider loading states for AI examples
- Parent page for CanvaAIChat
