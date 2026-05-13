# MobilePageLayout

A reusable layout component for mobile pages that ensures consistent padding, margins, and structure across all mobile pages.

## Features

- **Consistent 16px horizontal padding** for title, search, and content areas
- **Gradient background** with purple-blue theme
- **Mobile home header** with avatar
- **White header on scroll** - Automatically shows white header background when user scrolls (works on all pages)
- **Optional search box** with customizable placeholder
- **Standardized title area** with customizable weight

## Usage

```tsx
import MobilePageLayout from '@/shared_components/MobilePageLayout';

export default function YourPage() {
  return (
    <MobilePageLayout title="Page Title" searchPlaceholder="Search..." showSearch={true}>
      {/* Your page content with paddingX="2u" where needed */}
      <Box paddingX="2u">
        <YourContent />
      </Box>
    </MobilePageLayout>
  );
}
```

## Props

| Prop                | Type                 | Default    | Description                         |
| ------------------- | -------------------- | ---------- | ----------------------------------- |
| `title`             | `string`             | required   | Page title displayed at the top     |
| `titleWeight`       | `'normal' \| 'bold'` | `'normal'` | Font weight of the title            |
| `showSearch`        | `boolean`            | `true`     | Whether to show the search box      |
| `searchPlaceholder` | `string`             | `'Search'` | Placeholder text for the search box |
| `children`          | `ReactNode`          | required   | Page content                        |

## Content Padding

The layout provides:

- **Title area**: 16px horizontal padding (automatic)
- **Search box**: 16px horizontal padding (automatic via `MobileSearchBox`)
- **Content area**: Children should apply `paddingX="2u"` (16px) where needed

## Pages Using This Component

- **Home** (`/pages/Home`) - "Your designs" with icon grid
- **Templates** (`/pages/Templates`) - Template browsing with filters and carousels
- **Projects** (`/pages/Projects`) - "All projects" with designs, folders, images, videos
- **More** (`/pages/More`) - Settings and menu items

## Design Decisions

1. **16px Standard**: All horizontal padding is standardized to 16px (`2u` in Easel tokens) for visual alignment
2. **Gradient Background**: Shared gradient background creates consistent brand experience
3. **Optional Search**: Not all pages need search, so it's optional via `showSearch` prop
4. **Flexible Children**: Content area accepts any children, allowing page-specific layouts

## Future Pages

When creating new mobile pages, use this layout component to ensure consistency:

```tsx
export default function NewMobilePage() {
  return (
    <MobilePageLayout title="New Page" searchPlaceholder="Search new stuff">
      <Box paddingX="2u">{/* Your content here with proper 16px padding */}</Box>
    </MobilePageLayout>
  );
}
```
