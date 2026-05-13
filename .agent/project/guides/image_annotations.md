# Image Annotations Guide

## Overview

This document explains how to use annotated screenshots to communicate UI changes and modifications. This annotation system allows for precise, visual communication of design requirements without lengthy written descriptions.

## What Are Image Annotations?

Image annotations are screenshots of the current rendered state of the application with:

- **Text boxes** containing instructions or descriptions
- **Arrows/lines** pointing to specific UI elements
- **Reference images** showing desired states
- **Comparison examples** demonstrating correct vs incorrect implementations

## How to Use Annotations

### 1. Create Base Screenshot

Take a screenshot of the current rendered state in the browser showing the area that needs changes.

### 2. Add Annotations

Use any image editing tool to add:

#### Text Boxes

- Contain clear, specific instructions
- Connected to target areas with arrows/lines
- Examples:
  - "I didn't ask for this. I just wanted the down arrow after ads to have a circle around it like other mobile pages."
  - "The titles and icons need to be vertically centered with each other like this."
  - "I want gray image placeholders here in the same place as this image."

#### Arrows/Lines

- Point directly to the element being discussed
- Use solid lines for single targets
- Use multiple arrows if one annotation affects multiple elements

#### Reference Examples

- Show correct implementation from other parts of the app
- Include side-by-side comparisons when useful
- Demonstrate the desired end state

### 3. What Makes Good Annotations

✅ **Good Annotations:**

- Specific and actionable: "Border should be like this screenshot, not gray."
- Show examples: Include a reference image of the correct state
- Point to exact elements: Arrow points directly to the affected component
- Clear context: Explain why/what pattern to follow

❌ **Avoid:**

- Vague descriptions: "Make it better"
- Missing context: Not showing what it should look like
- Ambiguous targets: Arrow doesn't clearly point to one element
- Assuming knowledge: Not referencing existing patterns in the codebase

## Example Annotation Workflow

### Step 1: Initial Screenshot

Developer implements feature based on written specs.

### Step 2: Annotated Feedback

Reviewer takes screenshot and adds annotations:

1. **Annotation Box**: "I didn't ask for this. I just wanted the down arrow after ads to have a circle around it like other mobile pages."
   - **Arrow**: Points to the dropdown chevron
   - **Reference**: Shows Brand page with circular dropdown button

2. **Annotation Box**: "The titles and icons need to be vertically centered with each other like this."
   - **Arrow**: Points to misaligned title and icon
   - **Reference**: Shows correctly aligned example

3. **Annotation Box**: "Border should be like this screenshot, not gray."
   - **Arrow**: Points to card border
   - **Reference**: Shows card with purple gradient border

### Step 3: Implementation

Developer:

1. Reads all annotations carefully
2. Identifies patterns/components mentioned (e.g., "like other mobile pages")
3. Searches codebase for reference implementations
4. Applies changes based on exact specifications
5. Updates documentation if new patterns emerge

## Common Annotation Patterns

### Pattern References

**Format**: "Make it like [Component/Page] does it"
**Example**: "...have a circle around it like other mobile pages."
**Implementation**: Search codebase for similar pattern (MobileBrand.tsx, MobileApps.tsx)

### Visual Alignment

**Format**: "X and Y need to be [alignment] with each other"
**Example**: "The titles and icons need to be vertically centered with each other"
**Implementation**: Use flexbox alignment, proper display properties

### Style Matching

**Format**: "Should be like this screenshot, not [current state]"
**Example**: "Border should be like this screenshot, not gray."
**Implementation**: Compare CSS values, match exact colors/sizes from reference

### Component Consistency

**Format**: "Use [Component] instead of [current approach]"
**Example**: "Pick a business is a pill just like the pills in Canva AI"
**Implementation**: Import and use existing Easel components

## Best Practices

### For Reviewers/Designers

1. **Be Specific**: Always point to exact elements
2. **Show Examples**: Include reference images from the app
3. **One Annotation Per Issue**: Don't combine multiple unrelated changes
4. **Reference Patterns**: Mention where the correct pattern exists
5. **Explain Why**: Give context (consistency, matching other pages, etc.)

### For Developers

1. **Read All Annotations**: Don't miss any - they're all connected
2. **Search Codebase**: Find the referenced patterns/components
3. **Understand Context**: Know why a change is being requested
4. **Verify References**: Look at actual implementation, not just description
5. **Check Consistency**: Ensure changes match the design system

## Annotation Checklist

Before submitting an annotated screenshot, verify:

- [ ] All arrows point to specific, identifiable elements
- [ ] Text boxes contain clear, actionable instructions
- [ ] Reference examples are included where needed
- [ ] Existing patterns/components are mentioned by name
- [ ] Multiple related changes are clearly connected
- [ ] Screenshots show the current rendered state (not mockups)

## Common Scenarios

### Scenario 1: Wrong Component Used

```
Annotation: "This should be a Pill component like in CanvaAI, not a custom button"
Arrow: Points to custom button
Reference: Screenshot of CanvaAI pills
```

### Scenario 2: Alignment Issue

```
Annotation: "The titles and icons need to be vertically centered"
Arrow: Points to misaligned elements
Reference: Screenshot showing correct alignment
```

### Scenario 3: Styling Mismatch

```
Annotation: "Border should be purple like this, not gray"
Arrow: Points to gray border
Reference: Screenshot of purple border from comparison card
```

### Scenario 4: Missing Pattern

```
Annotation: "The dropdown needs a circle around it like Brand and Apps pages"
Arrow: Points to plain dropdown chevron
Reference: Screenshot from MobileBrand showing circular button
```

## Tips for Success

1. **Take Fresh Screenshots**: Always capture current state before annotating
2. **Use Contrast**: Make sure annotations are visible against background
3. **Number Multiple Points**: If many changes, number them for clarity
4. **Group Related Changes**: Keep connected changes together visually
5. **Include Context**: Show enough of the UI for orientation
6. **Verify After Changes**: Take new screenshots to confirm implementation

## Tools Recommended

- **Screenshot**: Browser DevTools, OS screenshot tools
- **Annotation**: Any image editor (Preview, Sketch, Figma, Photoshop, etc.)
- **Sharing**: Direct image upload, linked storage, or embedded in issues/PRs

## Related Documentation

- [coding_guide.md](./coding_guide.md) - Component patterns
- `easel-prototype` skill - Design system components, tokens, and icons
- [mobile_design.md](./mobile_design.md) - Mobile-specific patterns

---

**Remember**: Good annotations lead to accurate implementations. The more specific and visual your feedback, the better the results!
