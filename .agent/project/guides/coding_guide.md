# Coding Guide

Coding standards and best practices for this codebase.

> **For UI work:** load the `easel-prototype` skill. It owns component selection, layout, tokens, icons, and styling rules.

## Core Principles

### 1. CSS Modules

- Always use `.module.css` extension for component styles
- Import as: `import styles from './Component.module.css'`
- Never use inline styles

### 2. Prioritize Reusable Components

**This is a core principle that prevents code duplication and improves maintainability.**

**Rule:** Before writing any new component code, ALWAYS check if an existing component can be reused or adapted.

**Why This Matters:**

- Prevents code duplication across the codebase
- Makes refactoring and updates easier (change once, update everywhere)
- Reduces bugs by reusing tested code
- Keeps the codebase DRY (Don't Repeat Yourself)
- Makes the codebase easier to understand and navigate

**Process for Every New Feature:**

1. ✅ **FIRST:** Search for existing components that do something similar
2. ✅ **SECOND:** Check if existing component can be made flexible with props
3. ✅ **THIRD:** Break up your code into small, reusable pieces
4. ✅ **FOURTH:** Create new components if none exist
5. ❌ **NEVER:** Copy-paste code to multiple places

**When to Create a Reusable Component:**

Create a new reusable component when:

- ✅ The same UI pattern appears 2+ times
- ✅ A section of code is self-contained with clear props interface
- ✅ The code might be useful in other contexts
- ✅ A component is getting too large (>200 lines)
- ✅ Logic can be isolated and tested independently

**Examples:**

```tsx
// ❌ BAD: Duplicating carousel code in multiple places
// File: DesignContent.tsx
<Box paddingX="2u">
  <Rows spacing="2u">
    <Title size="medium">Featured Designs</Title>
    <Carousel name="designs" gutter="small" buttonVariant="circular">
      {designs.map(design => <Card key={design.id} {...design} />)}
    </Carousel>
  </Rows>
</Box>

// File: TemplateContent.tsx (DUPLICATE CODE!)
<Box paddingX="2u">
  <Rows spacing="2u">
    <Title size="medium">Popular Templates</Title>
    <Carousel name="templates" gutter="small" buttonVariant="circular">
      {templates.map(template => <Card key={template.id} {...template} />)}
    </Carousel>
  </Rows>
</Box>

// ✅ GOOD: Created reusable SectionCarousel component
// File: SectionCarousel/index.tsx
interface SectionCarouselProps {
  title: string;
  items: Item[];
  cardWidth?: number;
  cardHeight?: number;
}

export function SectionCarousel({ title, items, cardWidth, cardHeight }: SectionCarouselProps) {
  return (
    <Box paddingX="2u">
      <Rows spacing="2u">
        <Title size="medium">{title}</Title>
        <Carousel name={`${title.toLowerCase()}-carousel`} gutter="small" buttonVariant="circular">
          {items.map(item => (
            <Card key={item.id} width={cardWidth} height={cardHeight} {...item} />
          ))}
        </Carousel>
      </Rows>
    </Box>
  );
}

// File: DesignContent.tsx (REUSING component)
<SectionCarousel title="Featured Designs" items={designs} cardWidth={200} cardHeight={150} />

// File: TemplateContent.tsx (REUSING component)
<SectionCarousel title="Popular Templates" items={templates} cardWidth={180} cardHeight={240} />
```

**Real-World Example from This Codebase:**

```tsx
// ❌ BAD: Custom carousel buttons repeated in every carousel
// Each component had 50+ lines of button logic, state management, positioning

// ✅ GOOD: Created MobileCarousel wrapper component
// - Single source of truth for all mobile carousel behavior
// - Consistent 40px buttons across all carousels
// - Only content differs, behavior is shared
// - Used by: TemplatePills, TemplateSectionCarousel, etc.

<MobileCarousel name="templates" gutter="small" buttonVariant="circular">
  {items}
</MobileCarousel>
```

**How to Search for Existing Components:**

```bash
# Search by functionality
grep -r "Carousel" src/components/
grep -r "Button" src/components/ui/

# Search by pattern
grep -r "interface.*Props" src/components/

# Look in common directories
ls src/components/ui/
ls src/components/
```

**Component Organization:**

```
src/
  components/
    ui/              # Reusable UI components
      Button/
      Card/
      Carousel/
      MobileCarousel/  # Mobile-specific wrapper
    features/        # Feature-specific components
      Header/
      Sidebar/
```

**Making Components Reusable:**

```tsx
// ❌ BAD: Hardcoded values, not reusable
export function TemplateCard() {
  return (
    <Card width={200} height={300}>
      <Placeholder />
    </Card>
  );
}

// ✅ GOOD: Flexible props, highly reusable
interface CardProps {
  width?: number;
  height?: number;
  title?: string;
  thumbnail?: React.ReactNode;
  onClick?: () => void;
}

export function TemplateCard({ width = 200, height = 300, title, thumbnail, onClick }: CardProps) {
  return (
    <Card width={width} height={height} onClick={onClick}>
      {thumbnail || <Placeholder />}
      {title && <Text>{title}</Text>}
    </Card>
  );
}
```

**Key Questions to Ask:**

Before writing code, ask yourself:

1. ❓ "Does a similar component already exist?"
2. ❓ "Could I use this code elsewhere?"
3. ❓ "Am I copying and pasting code?"
4. ❓ "Is this component doing too many things?"
5. ❓ "Can I extract this into a smaller piece?"

**If you answer YES to any of these, create or find a reusable component!**

## Error Checking

### ⚠️ ALWAYS Check for Errors After Making Changes

**This is critical and must be done for every change.**

After making any code changes, you MUST:

1. **Check the browser console** for runtime errors
2. **Fix all errors** before considering the task complete
3. **Test the functionality** to ensure it works as expected
4. **Run linter** to catch TypeScript/ESLint issues

**Process:**

```bash
# 1. Check linter errors
npm run lint

# 2. Open browser DevTools (F12)
# 3. Check Console tab for errors
# 4. Fix all red errors
# 5. Verify functionality works
```

**Common error types to watch for:**

- **TypeScript errors**: Type mismatches, missing props, invalid imports
- **Runtime errors**: Undefined variables, null references, invalid function calls
- **React errors**: Invalid hooks usage, key prop issues, component rendering errors
- **Import errors**: Missing or incorrect module imports

**Example error checking workflow:**

```tsx
// ❌ BAD: Making changes without checking for errors
// - Added new component
// - Didn't check browser console
// - Moved on to next task
// Result: Broken application

// ✅ GOOD: Proper error checking
// 1. Made changes to NavTabs component
// 2. Opened browser DevTools
// 3. Saw "Cannot read property 'icon' of undefined"
// 4. Fixed the error (added null check)
// 5. Refreshed browser
// 6. Confirmed no errors in console
// 7. Tested functionality
// 8. Task complete ✓
```

**Never assume changes work - always verify!**

## Linting

- No `@ts-ignore` directives
- No `as any` type assertions
- Fix linter errors before committing
- Run `npm run lint` to check

## Related Documentation

- [runbook.md](./runbook.md) - Development commands and workflows
