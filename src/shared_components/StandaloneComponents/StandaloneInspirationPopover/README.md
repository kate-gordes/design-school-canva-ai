# Standalone Inspiration Popover

A fully self-contained React component that recreates the Canva inspiration popover design without any external dependencies.

## Features

- ✅ **Zero Dependencies**: No Easel, no external UI libraries
- ✅ **Pure React + CSS**: Only uses React and vanilla CSS
- ✅ **Fully Responsive**: Works on desktop, tablet, and mobile
- ✅ **Smooth Animations**: Fade in/out and scale animations
- ✅ **TypeScript Ready**: Full TypeScript support included
- ✅ **Accessible**: Backdrop click to close, proper focus management
- ✅ **Modern Design**: Matches Canva's design system aesthetics

## Installation

Simply copy these files to your project:

```
StandaloneInspirationPopover/
├── index.tsx          # Main component
├── styles.css         # All styling
├── demo.tsx          # Usage example
└── README.md         # This file
```

## Usage

```tsx
import React, { useState } from 'react';
import StandaloneInspirationPopover from './StandaloneInspirationPopover';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Inspiration Popover</button>

      <StandaloneInspirationPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        inspirationTitle="Retro-themed pub poster for young adults"
        inspirationCategory="POSTER"
      />
    </>
  );
}
```

## Props

| Prop                  | Type         | Required | Description                              |
| --------------------- | ------------ | -------- | ---------------------------------------- |
| `isOpen`              | `boolean`    | Yes      | Controls if the popover is visible       |
| `onClose`             | `() => void` | Yes      | Called when the popover should be closed |
| `inspirationTitle`    | `string`     | No       | The title to display in the header       |
| `inspirationCategory` | `string`     | No       | The category type (for future use)       |

## Customization

### Colors

The component uses CSS custom properties that you can override:

```css
.popover-container {
  /* Primary colors */
  --primary-color: rgb(139, 92, 246);
  --primary-hover: rgb(124, 58, 237);
  --primary-active: rgb(109, 40, 217);

  /* Text colors */
  --text-primary: rgb(14, 19, 24);
  --text-secondary: rgb(107, 114, 126);

  /* Background colors */
  --background-primary: white;
  --background-secondary: rgb(242, 243, 245);
  --border-color: rgb(229, 230, 235);
}
```

### Layout

You can modify the dimensions by updating these CSS variables:

```css
.popover-container {
  width: 1400px; /* Change modal width */
  height: 800px; /* Change modal height */
  padding: 40px; /* Change internal padding */
}
```

### Content

The content is easily customizable by modifying the JSX in the component:

- Update the "About" section text
- Modify the design tips list
- Change the key details sidebar content
- Customize the bottom placeholder area

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure

```
StandaloneInspirationPopover/
├── index.tsx          # Main React component (2.5KB)
├── styles.css         # All CSS styling (4.8KB)
├── demo.tsx          # Usage demo component
└── README.md         # Documentation
```

## Migration from Easel

If you're migrating from the Easel version:

1. Replace `Dialog` and `DialogContent` imports with this component
2. Replace `Box`, `Text`, `Button`, `Spacer` with standard HTML elements
3. Update prop names: `open` → `isOpen`, `onRequestClose` → `onClose`
4. Remove any Easel-specific styling props

## License

This component is designed to be framework-agnostic and can be used in any React project without licensing concerns.
