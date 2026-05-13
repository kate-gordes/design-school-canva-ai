# Banner Component System

This folder contains a complete, organized banner component system:

## 📁 Folder Structure

```
src/components/ui/Banners/
├── index.ts                    # Main exports
├── README.md                   # This documentation
├── Banner/                     # Base banner component
│   ├── index.tsx              # Complex configurable banner
│   ├── Banner.module.css      # Banner styles
│   ├── BannerBackground.tsx   # Background component
│   ├── BannerBackground.module.css # Background styles
│   └── assets/                # Banner assets
├── HeroBanner/                # Hero banner component
│   ├── index.tsx              # Hero banner for apps/marketing
│   └── HeroBanner.module.css  # Hero banner styles
└── CarouselBanner/            # Carousel banner component
    ├── index.tsx              # Banner with carousel of cards
    └── CarouselBanner.module.css # Carousel banner styles
```

## 🎯 Components

### Banner (Base Component)

- **Purpose**: Flexible, configurable banner with overlay system
- **Features**: Actions, title/subtitle, badges, image credit, search bar
- **Usage**: Complex banners with multiple interactive elements

### HeroBanner

- **Purpose**: Hero banners for app/marketing pages
- **Features**: Badge, title, subtitle, CTA button, single image
- **Usage**: App landing pages, feature announcements

### CarouselBanner

- **Purpose**: Banner with horizontal carousel of cards
- **Features**: Title, subtitle, scrollable card carousel
- **Usage**: Trending apps, featured content sections

## 💡 Usage

```tsx
import { Banner, HeroBanner, CarouselBanner } from '@/shared_components/Banners';

// Hero banner for apps
<HeroBanner
  title="Tenor"
  subtitle="Bring content to life with GIFs"
  buttonText="Browse GIFs"
  images={[bannerImage]}
/>

// Carousel banner for sections
<CarouselBanner
  title="Featured Apps"
  subtitle="Discover popular tools"
  cards={featuredCards}
/>

// Complex configurable banner
<Banner
  type="hero"
  display="large"
  title="Custom Banner"
  actions={bannerActions}
/>
```

## 🏗️ Architecture Benefits

- ✅ **Organized structure** - All banners in one place
- ✅ **Type safety** - Full TypeScript support
- ✅ **Reusable components** - Mix and match as needed
- ✅ **Consistent API** - Similar prop patterns
- ✅ **Asset management** - Centralized banner assets
