# Standalone Gradient Text

A fully self-contained React component that creates beautiful gradient text effects without any external dependencies.

## Features

- ✅ **Zero Dependencies**: No Easel, no external UI libraries
- ✅ **Pure React + CSS**: Only uses React and vanilla CSS
- ✅ **Multiple Sizes**: Small, medium, large, and xlarge variants
- ✅ **Flexible Alignment**: Left, center, and right alignment options
- ✅ **Semantic HTML**: Choose any HTML tag (h1, h2, h3, span, div, etc.)
- ✅ **Mobile Optimized**: Special mobile variant for smaller screens
- ✅ **Fully Responsive**: Automatically adjusts on different screen sizes
- ✅ **Browser Compatibility**: Includes fallbacks for older browsers
- ✅ **Accessibility**: High contrast mode and reduced motion support
- ✅ **TypeScript Ready**: Full TypeScript support included

## Installation

Simply copy these files to your project:

```
StandaloneGradientText/
├── index.tsx          # Main component
├── styles.css         # All styling
├── demo.tsx          # Usage example
└── README.md         # This file
```

## Usage

```tsx
import React from 'react';
import StandaloneGradientText from './StandaloneGradientText';

function MyComponent() {
  return (
    <StandaloneGradientText size="xlarge" alignment="center" tagName="h1">
      Beautiful Gradient Text
    </StandaloneGradientText>
  );
}
```

## Props

| Prop        | Type                                                              | Required | Default     | Description                 |
| ----------- | ----------------------------------------------------------------- | -------- | ----------- | --------------------------- |
| `children`  | `React.ReactNode`                                                 | Yes      | -           | The text content to display |
| `size`      | `'small' \| 'medium' \| 'large' \| 'xlarge'`                      | No       | `'xlarge'`  | Text size variant           |
| `variant`   | `'default' \| 'mobile'`                                           | No       | `'default'` | Layout variant              |
| `tagName`   | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'span' \| 'div'` | No       | `'h1'`      | HTML tag to render          |
| `alignment` | `'left' \| 'center' \| 'right'`                                   | No       | `'center'`  | Text alignment              |
| `className` | `string`                                                          | No       | `''`        | Additional CSS classes      |

## Examples

### Basic Usage

```tsx
<StandaloneGradientText>Hello World</StandaloneGradientText>
```

### Different Sizes

```tsx
<StandaloneGradientText size="small">Small Text</StandaloneGradientText>
<StandaloneGradientText size="medium">Medium Text</StandaloneGradientText>
<StandaloneGradientText size="large">Large Text</StandaloneGradientText>
<StandaloneGradientText size="xlarge">XLarge Text</StandaloneGradientText>
```

### Different Alignments

```tsx
<StandaloneGradientText alignment="left">Left Aligned</StandaloneGradientText>
<StandaloneGradientText alignment="center">Center Aligned</StandaloneGradientText>
<StandaloneGradientText alignment="right">Right Aligned</StandaloneGradientText>
```

### Different HTML Tags

```tsx
<StandaloneGradientText tagName="h1">Main Heading</StandaloneGradientText>
<StandaloneGradientText tagName="h2">Sub Heading</StandaloneGradientText>
<StandaloneGradientText tagName="span">Inline Text</StandaloneGradientText>
```

### Mobile Variant

```tsx
<StandaloneGradientText variant="mobile" size="xlarge">
  Mobile Optimized Text
</StandaloneGradientText>
```

## Customization

### Gradient Colors

You can customize the gradient by overriding the CSS:

```css
.gradient-text {
  background-image: linear-gradient(to bottom right, #your-color-1, #your-color-2, #your-color-3);
}
```

### Font Properties

Customize typography:

```css
.gradient-text {
  font-family: 'Your Font', sans-serif;
  font-weight: 600;
  letter-spacing: -1.5px;
}
```

### Size Customization

Override specific size variants:

```css
.gradient-text--xlarge {
  font-size: 48px;
  line-height: 52px;
}
```

### Drop Shadow

Modify or remove the drop shadow:

```css
.gradient-text {
  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2));
  /* Or remove it entirely */
  /* filter: none; */
}
```

## Browser Support

- ✅ Chrome/Edge 88+ (full gradient support)
- ✅ Firefox 78+ (full gradient support)
- ✅ Safari 14+ (full gradient support)
- ✅ Older browsers (fallback to solid color)

### Fallback Behavior

For browsers that don't support `background-clip: text`, the component automatically falls back to a solid purple color (`#5a32fa`).

## Accessibility

The component includes several accessibility features:

- **High Contrast Mode**: Automatically switches to regular text color in high contrast mode
- **Reduced Motion**: Removes animations when user prefers reduced motion
- **Semantic HTML**: Uses proper heading tags for screen readers
- **Color Fallback**: Ensures text is readable even without gradient support

## Performance

- **Lightweight**: ~2KB total (component + styles)
- **No Runtime Dependencies**: Pure CSS gradients with no JavaScript animations
- **GPU Accelerated**: Uses CSS properties that leverage hardware acceleration

## Migration from Easel

If you're migrating from the Easel GradientText:

1. Replace the import:

   ```tsx
   // Old (Easel)
   import { Title } from '@canva/easel';

   // New (Standalone)
   import StandaloneGradientText from './StandaloneGradientText';
   ```

2. Update the component usage:

   ```tsx
   // Old (Easel)
   <Title size="xlarge" className={styles.gradientText}>
     Text
   </Title>

   // New (Standalone)
   <StandaloneGradientText size="xlarge">
     Text
   </StandaloneGradientText>
   ```

3. Remove Easel token imports from CSS files

## License

This component is designed to be framework-agnostic and can be used in any React project without licensing concerns.
