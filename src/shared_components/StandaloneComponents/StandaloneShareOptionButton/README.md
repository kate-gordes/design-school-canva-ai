# Standalone Share Option Button

A fully self-contained React component that creates share action buttons matching Canva's design without any external dependencies.

## Features

- ✅ **Zero Dependencies**: No Easel, no external UI libraries
- ✅ **Pure React + CSS**: Only uses React and vanilla CSS
- ✅ **Flexible Icons**: Accepts icon as component or element
- ✅ **Selection State**: Visual feedback for selected actions
- ✅ **Hover Effects**: Smooth transitions and interactions
- ✅ **TypeScript Ready**: Full TypeScript support included
- ✅ **Accessible**: Proper focus states and keyboard support
- ✅ **Responsive**: Optimized for mobile and desktop
- ✅ **Lightweight**: Only ~3KB total

## Installation

Simply copy these files to your project:

```
StandaloneShareOptionButton/
├── index.tsx          # Main component
├── styles.css         # All styling
├── demo.tsx          # Usage example
└── README.md         # This file
```

## Usage

### Basic Usage

```tsx
import StandaloneShareOptionButton from './StandaloneShareOptionButton';

// Create your icon component
const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

function MyComponent() {
  return (
    <StandaloneShareOptionButton
      icon={DownloadIcon}
      label="Download"
      onClick={() => console.log('Download clicked')}
    />
  );
}
```

### With Selection State

```tsx
import React, { useState } from 'react';
import StandaloneShareOptionButton from './StandaloneShareOptionButton';

function MyComponent() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  return (
    <StandaloneShareOptionButton
      icon={DownloadIcon}
      label="Download"
      onClick={() => setSelectedAction('download')}
      selected={selectedAction === 'download'}
    />
  );
}
```

### In a Grid (Share Menu Style)

```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '8px'
}}>
  <StandaloneShareOptionButton icon={DownloadIcon} label="Download" onClick={...} />
  <StandaloneShareOptionButton icon={PresentIcon} label="Present" onClick={...} />
  <StandaloneShareOptionButton icon={CheckIcon} label="Request approval" onClick={...} />
  <StandaloneShareOptionButton icon={LinkIcon} label="View-only link" onClick={...} />
</div>
```

## Props

| Prop        | Type                              | Required | Default | Description                |
| ----------- | --------------------------------- | -------- | ------- | -------------------------- |
| `icon`      | `ReactNode \| ComponentType<any>` | Yes      | -       | Icon component or element  |
| `label`     | `string`                          | Yes      | -       | Button label text          |
| `onClick`   | `() => void`                      | Yes      | -       | Click handler function     |
| `selected`  | `boolean`                         | No       | `false` | Whether button is selected |
| `className` | `string`                          | No       | `''`    | Additional CSS classes     |

## Customization

### Colors

Override button colors:

```css
.share-option-button {
  background: your-background-color;
}

.share-option-button:hover {
  background-color: your-hover-color;
}

.share-option-icon--selected {
  border-color: your-accent-color;
  color: your-accent-color;
}
```

### Icon Size

Modify icon container size:

```css
.share-option-icon {
  width: 56px; /* Larger icon container */
  height: 56px;
}

.share-option-icon svg {
  width: 24px; /* Larger icon */
  height: 24px;
}
```

### Label Styling

Customize label appearance:

```css
.share-option-label {
  font-size: 13px;
  font-weight: 500;
  color: your-text-color;
}
```

### Button Dimensions

Adjust button size:

```css
.share-option-button {
  min-height: 90px; /* Taller button */
  padding: 16px 12px;
}
```

## Examples

### With Inline SVG Icon

```tsx
<StandaloneShareOptionButton
  icon={
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="..." />
    </svg>
  }
  label="My Action"
  onClick={() => console.log('Clicked')}
/>
```

### With Icon Component

```tsx
const MyIcon = () => <svg>...</svg>;

<StandaloneShareOptionButton
  icon={MyIcon}
  label="My Action"
  onClick={() => console.log('Clicked')}
/>;
```

### With Image Icon

```tsx
<StandaloneShareOptionButton
  icon={<img src="icon.png" alt="" width="20" height="20" />}
  label="My Action"
  onClick={() => console.log('Clicked')}
/>
```

### With Custom Class

```tsx
<StandaloneShareOptionButton
  icon={DownloadIcon}
  label="Download"
  onClick={() => console.log('Download')}
  className="my-custom-class"
/>
```

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Behavior

- **Desktop**: Full-size buttons (48px icon, 12px label)
- **Mobile**: Slightly smaller (40px icon, 11px label)
- Maintains usability across all screen sizes

## Accessibility

- Proper button semantics
- Focus visible states
- Keyboard navigation
- Screen reader friendly
- Touch-friendly tap targets

## Migration from Easel

If you're migrating from the Easel ShareOptionButton:

1. Replace the import:

   ```tsx
   // Old (Easel)
   import { ShareOptionButton } from '@/shared_components/Header/ShareOptionButton';

   // New (Standalone)
   import StandaloneShareOptionButton from './StandaloneShareOptionButton';
   ```

2. Update icon usage:

   ```tsx
   // Old (Easel) - Easel icon components
   import { DownloadIcon } from '@canva/easel/icons';
   <ShareOptionButton icon={DownloadIcon} ... />

   // New (Standalone) - Custom SVG icons
   const DownloadIcon = () => <svg>...</svg>;
   <StandaloneShareOptionButton icon={DownloadIcon} ... />
   ```

3. Props remain mostly the same:
   ```tsx
   // Both old and new
   <Button icon={IconComponent} label="Label" onClick={handler} selected={isSelected} />
   ```

## Performance

- **Minimal Re-renders**: Optimized component structure
- **No Dependencies**: No external libraries to load
- **GPU Accelerated**: CSS transitions use transform and opacity
- **Total Size**: ~3KB (gzipped: ~1KB)

## Troubleshooting

### Icon not showing

- Verify icon is a valid React element or component
- Check SVG viewBox and paths are correct
- Ensure stroke or fill colors are set

### Button not clickable

- Check onClick prop is provided
- Verify button isn't disabled
- Check z-index isn't blocking clicks

### Styling looks wrong

- Ensure styles.css is imported
- Check for CSS conflicts with global styles
- Verify class names match

### Selected state not working

- Pass `selected` prop as boolean
- Update state in onClick handler
- Check CSS for selected classes

## License

This component is designed to be framework-agnostic and can be used in any React project without licensing concerns.
