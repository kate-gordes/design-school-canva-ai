# 🎯 Brand Kit System - Complete Architecture Guide

> **Comprehensive documentation for understanding the entire Brand Kit system**

---

## 📖 **Table of Contents**

1. [System Overview](#system-overview)
2. [What Is Being Tracked & Where](#what-is-being-tracked--where)
3. [Data Flow Architecture](#data-flow-architecture)
4. [Quick Start Guide](#quick-start-guide)
5. [File Structure](#file-structure)
6. [API Reference](#api-reference)
7. [React Hooks](#react-hooks)
8. [Empty State System](#empty-state-system)
9. [Best Practices](#best-practices)

---

## 🌟 **System Overview**

The Brand Kit system manages **4 brand kits** with **793 total assets** across **44 categories**:

| Brand Kit            | Assets | Categories | Status    |
| -------------------- | ------ | ---------- | --------- |
| **Canva Brand Kit**  | 507    | 16         | ✅ Active |
| **People Brand Kit** | 191    | 10         | ✅ Active |
| **Canva Developers** | 80     | 9          | ✅ Active |
| **Canva China**      | 15     | 9          | ✅ Active |

### **Key Features:**

- ✅ **Brand kit switching** - Users can switch between brand kits
- ✅ **Dynamic content** - Each brand kit has different categories, assets, and folders
- ✅ **Empty state management** - Automatically shows empty states for missing content
- ✅ **Folder support** - 83 total folders across brand kits
- ✅ **Type-safe** - Full TypeScript support

---

## 🗂️ **What Is Being Tracked & Where**

### **🎯 The Big Picture:**

```
┌─────────────────────────────────────────────────────────────┐
│  GLOBAL APP STATE (Runtime)                                 │
│  📍 Location: src/providers/App.tsx                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ⚡ selectedBrandKit: 'Canva Brand Kit'                     │
│     👆 THE ONLY RUNTIME STATE FOR BRAND KITS                │
│        Changes when user switches brand kits                │
└─────────────────────────────────────────────────────────────┘
           │
           │ Auto-loads data ↓
           │
┌─────────────────────────────────────────────────────────────┐
│  BRAND KIT DATA (Static Files)                              │
│  📍 Location: src/pages/Brand/data/                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📊 brandKits.json      - All assets, folders, categories   │
│  📋 state.ts            - Business rules & config           │
│  🖼️  images.ts           - Category thumbnail mappings      │
│  📝 types.ts            - TypeScript definitions            │
│  ⚛️  hooks.ts            - React hooks                      │
│  🎯 index.ts            - Main API entry point              │
└─────────────────────────────────────────────────────────────┘
```

---

### **1️⃣ Runtime State (What Changes)**

**📍 Location:** `src/providers/App.tsx`

**What's tracked:**

```typescript
{
  selectedBrandKit: 'Canva Brand Kit'; // 👈 ONLY runtime state
}
```

**How to access:**

```typescript
import { useAppContext } from '@/hooks/useAppContext';

const { selectedBrandKit, setSelectedBrandKit, brandKitData } = useAppContext();
```

**How to change:**

```typescript
setSelectedBrandKit('People Brand Kit'); // Triggers re-render
```

---

### **2️⃣ Static Data (What Doesn't Change)**

**📍 Location:** `src/pages/Brand/data/`

#### **A. Brand Kit Data** (`brandKits.json` - 1.0MB)

Contains **all the actual content**:

- ✅ All 793 assets with URLs
- ✅ All 83 folders
- ✅ All 44 categories
- ✅ Asset metadata (dimensions, timestamps, etc.)

**Example structure:**

```json
{
  "BRAND_KITS_DATA": {
    "Canva Brand Kit": {
      "brandKitName": "Canva Brand Kit",
      "totalAssets": 507,
      "categories": [
        {
          "categoryName": "Logos",
          "assetCount": 89,
          "folderCount": 9,
          "folders": [{ "id": "folder_1", "name": "Primary Logos", "itemCount": 12 }],
          "assets": [{ "id": "asset_1", "filename": "logo.svg", "thumbnailUrl": "..." }]
        }
      ]
    }
  }
}
```

---

#### **B. Business Rules** (`state.ts`)

Defines **how the UI should behave** for each brand kit:

```typescript
export const BRAND_KIT_STATE = {
  'People Brand Kit': {
    categories: {
      'Icons': {
        contentStatus: 'empty', // 👈 Show empty state
        showInNav: true, // 👈 Show in sidebar
      },
      'Photos': {
        contentStatus: 'has_content', // 👈 Show real content
        showInNav: true,
      },
    },
  },
};
```

**What it configures:**

- ✅ Which categories are empty vs have content
- ✅ Which categories show in navigation
- ✅ Custom empty state messages
- ✅ Brand kit logos and metadata

---

#### **C. Image Mappings** (`images.ts`)

Maps **category names to thumbnail images**:

```typescript
const brandKitCategoryImages = {
  'Canva Brand Kit': {
    'Logos': localLogoImage,
    'Colors': externalColorImage,
  },
  'People Brand Kit': {
    'Logos': sharedLogoImage,
  },
};
```

---

## 🔄 **Data Flow Architecture**

### **Complete Flow Diagram:**

```
┌──────────────────────────────────────────────────────────┐
│  👤 USER ACTION                                           │
│  User selects "People Brand Kit" from dropdown           │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│  🎛️  COMPONENT (BrandKitSelector)                        │
│  setSelectedBrandKit('People Brand Kit')                 │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│  🌍 GLOBAL STATE UPDATE (App.tsx)                        │
│  dispatch({ type: 'SET_SELECTED_BRAND_KIT', ... })      │
│  state.selectedBrandKit = 'People Brand Kit'             │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│  📊 DATA AUTO-LOADED (App.tsx - useMemo)                 │
│  brandKitData = getBrandKit('People Brand Kit')          │
│  ↓ Loads from brandKits.json                            │
│  ↓ Returns { categories: [...], folders: [...], ... }   │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│  📋 BUSINESS RULES APPLIED (state.ts)                    │
│  shouldShowEmptyState('People Brand Kit', 'Icons')       │
│  ↓ Checks BRAND_KIT_STATE configuration                 │
│  ↓ Returns true (Icons is empty for People Brand Kit)   │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│  ⚛️  COMPONENTS RE-RENDER                                 │
│  All Brand views receive:                                │
│  • brandKitData (new data)                               │
│  • selectedBrandKit (new name)                           │
│  • Empty state flags (from state.ts)                     │
│                                                           │
│  Icons.tsx renders EmptyBrandKitSection ✅               │
│  Photos.tsx shows 13 folders ✅                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 **Quick Start Guide**

### **Get Brand Kit Data**

```typescript
import { getBrandKit, getAllBrandKitNames } from '@/pages/Brand/data';

// Get all available brand kits
const brandKits = getAllBrandKitNames();
// → ['Canva Brand Kit', 'People Brand Kit', 'Canva Developers', 'Canva China']

// Get specific brand kit data
const peopleBrandKit = getBrandKit('People Brand Kit');
// → { brandKitName: '...', categories: [...], totalAssets: 191, ... }
```

---

### **Check Empty States**

```typescript
import { shouldShowEmptyState } from '@/pages/Brand/data';

// Check if category should show empty state
const isEmpty = shouldShowEmptyState('People Brand Kit', 'Icons');
// → true (People Brand Kit has no icons)

const hasContent = shouldShowEmptyState('Canva Brand Kit', 'Logos');
// → false (Canva Brand Kit has 89 logos)
```

---

### **Use in React Components**

```typescript
import { useCategoryEmptyState } from '@/pages/Brand/data';

function IconsPage() {
  // Automatically uses selectedBrandKit from global context
  const { shouldShowEmptyState, emptyStateMessage } = useCategoryEmptyState('Icons');

  return shouldShowEmptyState ? (
    <EmptyState title={emptyStateMessage.title} />
  ) : (
    <IconsContent />
  );
}
```

---

## 📁 **File Structure**

```
src/pages/Brand/data/
├── index.ts           # 🎯 Main entry point - IMPORT FROM HERE
│                      #    Re-exports everything from other files
│                      #    Main API functions (getBrandKit, etc.)
│
├── brandKits.json     # 📊 All brand kit data (1.0MB)
│                      #    4 brand kits, 793 assets, 83 folders
│                      #    Assets, folders, categories, metadata
│
├── state.ts           # 📋 Business rules & configuration
│                      #    Empty state rules per brand kit
│                      #    Navigation configuration
│                      #    Custom empty messages
│                      #    Brand kit metadata (logos, counts)
│
├── hooks.ts           # ⚛️ React hooks
│                      #    useCategoryEmptyState()
│                      #    useBrandKitState()
│                      #    Auto-connects to global context
│
├── types.ts           # 📝 TypeScript definitions
│                      #    BrandKit, Category, BrandKitAsset
│                      #    Folder, BrandKitName, etc.
│
├── images.ts          # 🖼️ Category thumbnail mappings
│                      #    Maps category names to images
│                      #    Different images per brand kit
│
├── README.md          # 📖 This documentation
└── MIGRATION.md       # 🔄 Migration guide from old system
```

---

## 🎯 **API Reference**

### **Data Access Functions**

```typescript
// Get all brand kit names
getAllBrandKitNames(): BrandKitName[]
// → ['Canva Brand Kit', 'People Brand Kit', 'Canva Developers', 'Canva China']

// Get specific brand kit data
getBrandKit(name: BrandKitName): BrandKit | null
// → Full brand kit object with all categories, assets, folders

// Get all brand kits
getAllBrandKits(): Record<BrandKitName, BrandKit>
// → Object with all 4 brand kits

// Get specific category from a brand kit
getCategory(brandKit: BrandKit, categoryName: string): Category | null
// → Category with assets and folders

// Get categories filtered by section
getCategoriesBySection(brandKit: BrandKit, section: string): Category[]
// → Array of categories in specific section
```

---

### **Empty State Functions**

```typescript
// Check if category should show empty state
shouldShowEmptyState(brandKitName: BrandKitName, categoryName: string): boolean
// → true if should show EmptyBrandKitSection

// Get empty state message
getEmptyStateMessage(brandKitName: BrandKitName, categoryName: string): {
  title: string;
  description: string;
}
// → Returns custom or default empty state message

// Get category configuration
getCategoryConfig(brandKitName: BrandKitName, categoryName: string): CategoryConfig | null
// → Configuration including contentStatus, assetCount, showInNav
```

---

### **Brand Kit Configuration**

```typescript
// Get brand kit configuration
getBrandKitConfig(brandKitName: BrandKitName): BrandKitConfig | null
// → Logo URL, total assets, categories config, availability

// Get brand kit logo URL
getBrandKitLogo(brandKitName: BrandKitName): string
// → Logo URL or empty string for default

// Get navigation categories
getNavigationCategories(brandKitName: BrandKitName): CategoryConfig[]
// → Categories that should appear in sidebar navigation
```

---

### **Helper Functions**

```typescript
// Convert category name to URL-friendly ID
categoryNameToViewId(categoryName: string): string
// → 'Canva Values' becomes 'canva-values'

// Get category image
getCategoryImage(brandKitName: BrandKitName, categoryName: string): string
// → Image URL for category thumbnail
```

---

## ⚛️ **React Hooks**

### **`useCategoryEmptyState(categoryName)`**

**Most commonly used** - Perfect for individual category pages.

```typescript
function IconsPage() {
  const {
    shouldShowEmptyState,    // boolean - show empty state?
    emptyStateMessage,       // { title, description }
    categoryConfig           // Full category configuration
  } = useCategoryEmptyState('Icons');

  return shouldShowEmptyState ? (
    <EmptyBrandKitSection
      categoryName="Icons"
      title={emptyStateMessage.title}
      description={emptyStateMessage.description}
    />
  ) : (
    <IconsContent />
  );
}
```

**How it works:**

1. Automatically gets `selectedBrandKit` from global context
2. Looks up empty state rules in `state.ts`
3. Returns everything you need for that category
4. Memoized - only re-calculates when brand kit or category changes

---

### **`useBrandKitState()`**

**Full brand kit state** - Useful for complex components.

```typescript
function BrandKitDashboard() {
  const {
    selectedBrandKit,        // 'People Brand Kit'
    brandKitConfig,          // Full config from state.ts
    shouldShowEmptyState,    // Function for any category
    navigationCategories,    // Categories for sidebar
    logoUrl,                 // Brand kit logo
    totalAssets,             // Total asset count
    isAvailable              // Is brand kit selectable?
  } = useBrandKitState();

  return (
    <div>
      <h1>{selectedBrandKit}</h1>
      <img src={logoUrl} alt="Brand logo" />
      <p>Total assets: {totalAssets}</p>

      {navigationCategories.map(category => (
        <CategoryLink
          key={category.categoryName}
          name={category.categoryName}
          isEmpty={shouldShowEmptyState(category.categoryName)}
        />
      ))}
    </div>
  );
}
```

---

## 🏗️ **What Each File Tracks**

### **📊 `brandKits.json` - The Actual Data**

**Purpose:** Stores all the real content

**Contains:**

- ✅ 793 assets with full metadata
- ✅ 83 folders across all brand kits
- ✅ 44 categories with asset counts
- ✅ Asset URLs, dimensions, upload dates
- ✅ Folder names and item counts

**Example:**

```json
{
  "BRAND_KITS_DATA": {
    "Canva Brand Kit": {
      "brandKitName": "Canva Brand Kit",
      "totalAssets": 507,
      "categories": [
        {
          "categoryName": "Canva Values",
          "folderCount": 2,
          "folders": [
            { "id": "folder_1", "name": "Values Accessible", "itemCount": 6 },
            { "id": "folder_2", "name": "Drive Excellence", "itemCount": 6 }
          ],
          "assetCount": 13,
          "assets": [{ "id": "asset_1", "filename": "Crazy_Big_Goals.svg", "thumbnailUrl": "..." }]
        }
      ]
    }
  }
}
```

**Size:** 1.0MB (16,105 lines)

---

### **📋 `state.ts` - Business Rules & Configuration**

**Purpose:** Defines how the UI should behave

**Contains:**

- ✅ Empty state rules (which categories are empty)
- ✅ Navigation rules (which categories show in sidebar)
- ✅ Custom messages (special empty state text)
- ✅ Brand kit metadata (logos, availability)

**Example:**

```typescript
export const BRAND_KIT_STATE = {
  'People Brand Kit': {
    name: 'People Brand Kit',
    logoUrl: 'https://...',
    totalAssets: 191,
    isAvailable: true,
    categories: {
      'Icons': {
        categoryName: 'Icons',
        contentStatus: 'empty', // 👈 RULE: Show empty state
        assetCount: 0,
        showInNav: true, // 👈 RULE: Show in sidebar
      },
      'Photos': {
        categoryName: 'Photos',
        contentStatus: 'has_content', // 👈 RULE: Show real content
        assetCount: 101,
        showInNav: true,
      },
    },
  },
};
```

**Key Point:** This is **static configuration**, not runtime state!

---

### **🖼️ `images.ts` - Category Thumbnails**

**Purpose:** Maps category names to thumbnail images

**Contains:**

- ✅ Image URLs for each category
- ✅ Different images per brand kit
- ✅ Mix of local and external images

**Example:**

```typescript
export const brandKitCategoryImages = {
  'Canva Brand Kit': {
    'Logos': 'https://example.com/logos.jpg',
    'Colors': 'https://example.com/colors.jpg',
  },
  'People Brand Kit': {
    'Logos': 'https://example.com/people-logos.jpg',
  },
};
```

---

### **📝 `types.ts` - TypeScript Definitions**

**Purpose:** Type safety for all brand kit data

**Contains:**

```typescript
export interface BrandKit {
  brandKitName: string;
  totalAssets: number;
  totalCategories: number;
  categories: Category[];
}

export interface Category {
  categoryName: string;
  section: string;
  assetCount: number;
  folderCount: number;
  folders: Folder[];
  assets: BrandKitAsset[];
}

export interface Folder {
  id: string;
  name: string;
  itemCount: number;
}

export interface BrandKitAsset {
  id: string;
  filename: string;
  thumbnailUrl: string;
  fullSizeUrl: string;
  type: string;
  // ... more properties
}
```

---

## 🎯 **Empty State System**

### **How Empty States Are Determined**

**Rule:** A category shows `EmptyBrandKitSection` when:

1. **Explicitly configured in `state.ts`:**

   ```typescript
   contentStatus: 'empty' | 'placeholder';
   ```

2. **Checked via function:**

   ```typescript
   shouldShowEmptyState('People Brand Kit', 'Icons');
   // → Returns true
   ```

3. **Used in component:**
   ```typescript
   const { shouldShowEmptyState } = useCategoryEmptyState('Icons');
   // → Automatically handles current brand kit
   ```

---

### **Empty State Configuration Map**

| Brand Kit            | Empty Categories        | Reason                               |
| -------------------- | ----------------------- | ------------------------------------ |
| **Canva Brand Kit**  | None                    | All categories have content          |
| **People Brand Kit** | Icons                   | 0 assets                             |
| **Canva Developers** | Charts                  | 1 placeholder asset (custom message) |
| **Canva China**      | Photos, Graphics, Icons | 1 placeholder asset each             |

---

### **Custom Empty Messages**

Some categories have special messages:

```typescript
// Canva Developers - Charts
{
  title: "Communicate on brand with chart styles",
  description: "Ask your admin to define the default look of your charts..."
}

// Default message for all others
{
  title: "Stay on brand, together",
  description: "Ask your admin to add brand assets..."
}
```

---

## 🔍 **Where Everything Lives**

### **State Tracking Locations:**

| What                   | Where                             | Type          | Example Value                       |
| ---------------------- | --------------------------------- | ------------- | ----------------------------------- |
| **Selected Brand Kit** | `providers/App.tsx`               | Runtime State | `'Canva Brand Kit'`                 |
| **Empty State Rules**  | `pages/Brand/data/state.ts`       | Static Config | `Icons: 'empty'`                    |
| **Brand Kit Data**     | `pages/Brand/data/brandKits.json` | Static Data   | `{ assets: [...], folders: [...] }` |
| **Category Images**    | `pages/Brand/data/images.ts`      | Static Config | `Logos: 'url...'`                   |
| **Brand Kit Logos**    | `pages/Brand/data/state.ts`       | Static Config | `logoUrl: 'https://...'`            |

---

## 🔌 **How Components Access State**

### **Option 1: Direct Context Access**

```typescript
import { useAppContext } from '@/hooks/useAppContext';

function MyComponent() {
  const {
    selectedBrandKit, // 👈 Current brand kit name
    setSelectedBrandKit, // 👈 Function to change it
    brandKitData, // 👈 Auto-loaded data for current brand kit
  } = useAppContext();

  // Change brand kit
  const switchToPeople = () => {
    setSelectedBrandKit('People Brand Kit');
  };

  // Access current data
  const logos = brandKitData?.categories.find(c => c.categoryName === 'Logos');
}
```

**Used in:**

- ✅ All 17 Brand view components
- ✅ BrandBanner
- ✅ BrandKitSelector
- ✅ ContextualNav

---

### **Option 2: Smart Hooks** (Recommended)

```typescript
import { useCategoryEmptyState, getCategory } from '@/pages/Brand/data';
import { useAppContext } from '@/hooks/useAppContext';

function LogosPage() {
  const { brandKitData } = useAppContext();
  const { shouldShowEmptyState } = useCategoryEmptyState('Logos');

  // Get category data
  const logosCategory = useMemo(() => {
    return getCategory(brandKitData, 'Logos');
  }, [brandKitData]);

  // Access folders and assets
  const folders = logosCategory?.folders || [];
  const assets = logosCategory?.assets || [];
}
```

---

## 📊 **Complete State Architecture**

### **The Three Layers:**

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: GLOBAL RUNTIME STATE                          │
│  📍 src/providers/App.tsx                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                          │
│  What changes at runtime:                               │
│  • selectedBrandKit: string                             │
│                                                          │
│  How to change it:                                      │
│  • setSelectedBrandKit('People Brand Kit')              │
│                                                          │
│  How to access it:                                      │
│  • useAppContext()                                      │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  LAYER 2: STATIC CONFIGURATION                          │
│  📍 src/pages/Brand/data/state.ts                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                          │
│  What's configured (never changes at runtime):          │
│  • Which categories are empty                           │
│  • Which categories show in navigation                  │
│  • Custom empty state messages                          │
│  • Brand kit logos and metadata                         │
│                                                          │
│  How to use it:                                         │
│  • shouldShowEmptyState(brandKit, category)             │
│  • getCategoryConfig(brandKit, category)                │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: ACTUAL DATA                                   │
│  📍 src/pages/Brand/data/brandKits.json                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                          │
│  What's stored (loaded once at startup):                │
│  • 793 assets with URLs and metadata                    │
│  • 83 folders with names and item counts                │
│  • 44 categories across 4 brand kits                    │
│  • Asset dimensions, timestamps, etc.                   │
│                                                          │
│  How to access it:                                      │
│  • getBrandKit(name)                                    │
│  • getCategory(brandKit, categoryName)                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎬 **Real-World Example**

### **Scenario: User Views "Canva Values" in "Canva Brand Kit"**

```typescript
// 1️⃣ User navigates to /brand?view=canva-values
//    Component: CanvaValues.tsx

// 2️⃣ Component accesses global state
const { brandKitData, selectedBrandKit } = useAppContext();
// selectedBrandKit = 'Canva Brand Kit' (from App.tsx global state)
// brandKitData = getBrandKit('Canva Brand Kit') (auto-loaded)

// 3️⃣ Component gets category data
const canvaValuesCategory = getCategory(brandKitData, 'Canva Values');
// Returns: { categoryName: 'Canva Values', folderCount: 2, assetCount: 13, ... }

// 4️⃣ Component processes folders
const cleanFolders = useMemo(() => {
  // Takes canvaValuesCategory.folders (2 folders)
  // Cleans names, removes duplicates
  // Returns: [
  //   { id: 'folder_1', name: 'Values Accessible', itemCount: 6 },
  //   { id: 'folder_2', name: 'Drive Excellence', itemCount: 6 }
  // ]
}, [canvaValuesCategory]);

// 5️⃣ Component renders
<FoldersSection folders={cleanFolders} />  // Shows 2 folders
<LogoAssetsSection assets={assets} />       // Shows 13 assets
```

---

### **Scenario: User Switches to "People Brand Kit"**

```typescript
// 1️⃣ User clicks BrandKitSelector dropdown
setSelectedBrandKit('People Brand Kit');

// 2️⃣ Global state updates (App.tsx)
state.selectedBrandKit = 'People Brand Kit';

// 3️⃣ brandKitData auto-reloads (App.tsx - useMemo)
brandKitData = getBrandKit('People Brand Kit');
// Loads different data from brandKits.json

// 4️⃣ All components re-render with new data
// CanvaValues.tsx now shows:
const canvaValuesCategory = getCategory(brandKitData, 'Canva Values');
// Returns: null (People Brand Kit doesn't have Canva Values)

// Component shows: "No Canva Values available in this brand kit."
```

---

## 🎯 **State Management Summary**

### **What's NOT in `state.ts`:**

- ❌ Currently selected brand kit (in `App.tsx`)
- ❌ User interactions (in component `useState`)
- ❌ Actual asset data (in `brandKits.json`)

### **What IS in `state.ts`:**

- ✅ Empty state rules (which categories are empty per brand kit)
- ✅ Navigation configuration (which categories show in sidebar)
- ✅ Custom messages (special empty state text)
- ✅ Brand kit metadata (logos, asset counts, availability)

---

## 🗺️ **Navigation Flow**

### **How Users Navigate:**

```
User clicks sidebar
       ↓
Brand > Canva Values
       ↓
URL: /brand?view=canva-values
       ↓
index.tsx routes to CanvaValues.tsx
       ↓
CanvaValues.tsx gets selectedBrandKit from context
       ↓
Loads data for that brand kit
       ↓
Shows folders and assets
```

---

## 🔧 **How to Add a New Brand Kit**

1. **Add data to `brandKits.json`:**

   ```json
   {
     "BRAND_KITS_DATA": {
       "My New Brand Kit": {
         "brandKitName": "My New Brand Kit",
         "categories": [...]
       }
     }
   }
   ```

2. **Add configuration to `state.ts`:**

   ```typescript
   'My New Brand Kit': {
     name: 'My New Brand Kit',
     logoUrl: 'https://...',
     totalAssets: 100,
     isAvailable: true,
     categories: {
       'Logos': { contentStatus: 'has_content', showInNav: true, ... }
     }
   }
   ```

3. **Add images to `images.ts`:**

   ```typescript
   const myNewBrandKitImages = {
     'Logos': logoImage,
     'Colors': colorImage,
   };
   ```

4. **Done!** The brand kit will automatically:
   - ✅ Appear in BrandKitSelector dropdown
   - ✅ Load its data when selected
   - ✅ Show correct empty states
   - ✅ Display in navigation

---

## 🎯 **Key Takeaways**

1. **Runtime State:** `selectedBrandKit` lives in **`App.tsx`** (global state)
2. **Static Config:** Empty rules, navigation config in **`state.ts`**
3. **Actual Data:** Assets, folders in **`brandKits.json`**
4. **Access Pattern:** Use hooks (`useCategoryEmptyState`) for simplicity
5. **Automatic:** When you change `selectedBrandKit`, everything updates automatically

---

## 📞 **Common Questions**

### **Q: Where is the selected brand kit stored?**

**A:** In global app state: `src/providers/App.tsx` → `state.selectedBrandKit`

### **Q: How do I change the selected brand kit?**

**A:** Call `setSelectedBrandKit('Brand Kit Name')` from `useAppContext()`

### **Q: Where is the actual brand kit data?**

**A:** In `src/pages/Brand/data/brandKits.json` (1.0MB JSON file)

### **Q: How do empty states work?**

**A:** Rules defined in `state.ts`, checked via `shouldShowEmptyState()` function

### **Q: How do I add folders to a category?**

**A:** Add them to `brandKits.json`, component will automatically render them using `cleanFolders` logic

### **Q: Why two state files?**

**A:**

- `App.tsx` = **Runtime** state (what user selected)
- `state.ts` = **Configuration** (business rules, what should happen)

---

## 🚀 **Getting Started**

```typescript
// 1. Import from single entry point
import { useCategoryEmptyState, getBrandKit, getAllBrandKitNames } from '@/pages/Brand/data';

// 2. Use hooks in components
const { shouldShowEmptyState } = useCategoryEmptyState('Icons');

// 3. Access global state when needed
const { selectedBrandKit, setSelectedBrandKit } = useAppContext();

// 4. Everything else is automatic! 🎉
```

---

## 📈 **System Benefits**

- ✅ **Single source of truth** - One place for all brand kit logic
- ✅ **Automatic updates** - Change brand kit, everything updates
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Memoized** - Efficient re-rendering
- ✅ **Declarative** - Components describe what they need, not how to get it
- ✅ **Maintainable** - Add new brand kits without touching components

---

## 🎊 **That's It!**

The Brand Kit system is a **clean, three-layer architecture**:

1. **Runtime Layer** (`App.tsx`) - What's selected right now
2. **Configuration Layer** (`state.ts`) - Rules and behavior
3. **Data Layer** (`brandKits.json`) - Actual content

Everything is connected through **hooks and context**, making it easy to use and maintain! 🚀
