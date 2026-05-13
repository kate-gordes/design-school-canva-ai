# 🏗️ Brand Kit System Architecture

## 🎯 **Quick Reference**

| Question                                 | Answer                                              |
| ---------------------------------------- | --------------------------------------------------- |
| **Where is selected brand kit tracked?** | `src/providers/App.tsx` → `state.selectedBrandKit`  |
| **Where are empty state rules?**         | `src/pages/Brand/data/state.ts` → `BRAND_KIT_STATE` |
| **Where is the actual data?**            | `src/pages/Brand/data/brandKits.json`               |
| **How do components access it?**         | `useAppContext()` or `useCategoryEmptyState()`      |
| **How do I change brand kits?**          | `setSelectedBrandKit('Brand Kit Name')`             |

---

## 📊 **System Layers**

```
┌─────────────────────────────────────────────────────────────┐
│  🌍 GLOBAL STATE LAYER (Runtime)                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  File: src/providers/App.tsx                                │
│                                                              │
│  Tracks: selectedBrandKit (string)                          │
│  Default: 'Canva Brand Kit'                                 │
│  Updates: Via setSelectedBrandKit()                         │
│  Access: useAppContext()                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓ triggers
┌─────────────────────────────────────────────────────────────┐
│  📊 DATA LAYER (Static)                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  File: src/pages/Brand/data/brandKits.json (1.0MB)         │
│                                                              │
│  Contains:                                                   │
│  • 4 brand kits                                             │
│  • 793 assets (with URLs, metadata)                         │
│  • 83 folders (with names, item counts)                     │
│  • 44 categories                                            │
│                                                              │
│  Loaded: Once at app startup                                │
│  Access: getBrandKit(selectedBrandKit)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓ rules from
┌─────────────────────────────────────────────────────────────┐
│  📋 CONFIGURATION LAYER (Static)                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  File: src/pages/Brand/data/state.ts                        │
│                                                              │
│  Defines:                                                    │
│  • Empty state rules (People/Icons = empty)                 │
│  • Navigation config (which categories in sidebar)          │
│  • Custom messages (Developers/Charts special message)      │
│  • Brand kit metadata (logos, availability)                 │
│                                                              │
│  Access: shouldShowEmptyState(), getCategoryConfig()        │
└─────────────────────────────────────────────────────────────┘
                            ↓ consumed by
┌─────────────────────────────────────────────────────────────┐
│  ⚛️  COMPONENT LAYER (React)                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Files: src/pages/Brand/views/*.tsx (17 components)         │
│                                                              │
│  Uses:                                                       │
│  • useCategoryEmptyState() hook                             │
│  • useAppContext() for brandKitData                         │
│  • Automatic re-render on brand kit change                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 **State Update Flow**

### **When User Changes Brand Kit:**

```
1. User Action
   └─> BrandKitSelector dropdown clicked
       └─> User selects "People Brand Kit"

2. State Update
   └─> setSelectedBrandKit('People Brand Kit')
       └─> dispatch({ type: 'SET_SELECTED_BRAND_KIT', payload: 'People Brand Kit' })
           └─> App.tsx reducer updates state.selectedBrandKit

3. Data Reload
   └─> App.tsx useMemo triggers
       └─> brandKitData = getBrandKit('People Brand Kit')
           └─> Loads from brandKits.json

4. Rules Applied
   └─> Components call shouldShowEmptyState()
       └─> Checks state.ts configuration
           └─> Returns empty state flags

5. Components Re-render
   └─> All Brand views receive:
       • New brandKitData
       • New selectedBrandKit
       • Updated empty states
       └─> UI updates automatically ✨
```

---

## 📦 **Data Storage Breakdown**

### **brandKits.json (1.0MB)**

```json
{
  "BRAND_KITS_DATA": {
    "Canva Brand Kit": {
      "brandKitName": "Canva Brand Kit",
      "totalAssets": 507,
      "totalCategories": 16,
      "categories": [
        {
          "categoryName": "Canva Values",
          "section": "Internal Brand",
          "assetCount": 13,
          "folderCount": 2,
          "folders": [
            {
              "id": "folder_canva_values_1",
              "name": "Values Accessible",
              "itemCount": 6
            }
          ],
          "assets": [
            {
              "id": "asset_1",
              "filename": "Crazy_Big_Goals.svg",
              "thumbnailUrl": "https://...",
              "dimensions": { "width": 800, "height": 800 }
            }
          ]
        }
      ]
    }
  }
}
```

**What it stores:**

- ✅ Asset URLs (thumbnails & full size)
- ✅ Folder structures
- ✅ Asset metadata (dimensions, upload dates)
- ✅ Category organization

---

### **state.ts**

```typescript
export const BRAND_KIT_STATE = {
  'Canva Brand Kit': {
    name: 'Canva Brand Kit',
    logoUrl: '', // Empty = use default Canva logo
    totalAssets: 507,
    isAvailable: true,
    categories: {
      'Canva Values': {
        categoryName: 'Canva Values',
        contentStatus: 'has_content', // 👈 RULE: Show real content
        assetCount: 13,
        showInNav: true, // 👈 RULE: Show in sidebar
      },
    },
  },
  'People Brand Kit': {
    categories: {
      'Icons': {
        contentStatus: 'empty', // 👈 RULE: Show empty state
        showInNav: true,
      },
    },
  },
};
```

**What it configures:**

- ✅ Empty vs content status
- ✅ Sidebar visibility
- ✅ Custom messages
- ✅ Brand logos

---

### **App.tsx (Global State)**

```typescript
// Initial state
const initialState: AppState = {
  theme: 'light',
  sidebarVisible: true,
  selectedBrandKit: 'Canva Brand Kit',  // 👈 ONLY brand kit runtime state
};

// Reducer
case 'SET_SELECTED_BRAND_KIT':
  return { ...state, selectedBrandKit: action.payload };

// Auto-load data based on selection
const brandKitData = useMemo(() => {
  return getBrandKit(state.selectedBrandKit);
}, [state.selectedBrandKit]);

// Expose to components
const contextValue = {
  selectedBrandKit,
  setSelectedBrandKit,
  brandKitData,
  // ...
};
```

---

## 🎬 **Example: "Canva Values" Folders**

### **The Journey of Folder Data:**

```
1. DATA SOURCE (brandKits.json)
   ↓
   {
     "Canva Brand Kit": {
       "categories": [{
         "categoryName": "Canva Values",
         "folderCount": 2,
         "folders": [
           { "name": "Values Accessible", "itemCount": 6 },
           { "name": "Drive Excellence", "itemCount": 6 }
         ]
       }]
     }
   }

2. LOADED INTO MEMORY (App.tsx)
   ↓
   brandKitData = getBrandKit('Canva Brand Kit')

3. COMPONENT ACCESSES (CanvaValues.tsx)
   ↓
   const { brandKitData } = useAppContext();
   const category = getCategory(brandKitData, 'Canva Values');

4. FOLDERS PROCESSED
   ↓
   const cleanFolders = useMemo(() => {
     // Clean names, remove duplicates
     return category.folders.map(f => ({
       id: f.id,
       name: f.name.replace(/special chars/g, ''),
       itemCount: f.itemCount
     }));
   });

5. RENDERED TO UI
   ↓
   <FoldersSection folders={cleanFolders} />

   DISPLAYS:
   📁 Values Accessible (6 items)
   📁 Drive Excellence (6 items)
```

---

## 🎯 **State vs Configuration vs Data**

| Aspect      | Runtime State                 | Configuration            | Data                |
| ----------- | ----------------------------- | ------------------------ | ------------------- |
| **File**    | `App.tsx`                     | `state.ts`               | `brandKits.json`    |
| **Type**    | ⚡ Changes                    | 📋 Static                | 📊 Static           |
| **Example** | `selectedBrandKit = 'People'` | `Icons: 'empty'`         | `assets: [...]`     |
| **Updates** | On user action                | Never (hardcoded)        | Never (loaded once) |
| **Purpose** | Track selection               | Define behavior          | Store content       |
| **Access**  | `useAppContext()`             | `shouldShowEmptyState()` | `getBrandKit()`     |

---

## 🎊 **Complete System Diagram**

```
┌──────────────────────────────────────────────────────────┐
│                     USER INTERFACE                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ BrandBanner │  │  Selector   │  │  Category   │      │
│  │  with Logo  │  │  Dropdown   │  │    View     │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                 │                 │             │
└─────────┼─────────────────┼─────────────────┼─────────────┘
          │                 │                 │
          │                 │                 │
┌─────────▼─────────────────▼─────────────────▼─────────────┐
│               REACT CONTEXT (useAppContext)                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • selectedBrandKit: 'Canva Brand Kit'                     │
│  • setSelectedBrandKit(name)                               │
│  • brandKitData: { ... }                                   │
└────────────────────────┬───────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ brandKits    │ │   state.ts   │ │  images.ts   │
│   .json      │ │              │ │              │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ 793 assets   │ │ Empty rules  │ │ Thumbnails   │
│ 83 folders   │ │ Nav config   │ │ Per kit      │
│ 44 categories│ │ Messages     │ │ Per category │
└──────────────┘ └──────────────┘ └──────────────┘
       │                │                │
       └────────────────┴────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │   index.ts      │
              │   (Main API)    │
              └─────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │    hooks.ts     │
              │  (React Hooks)  │
              └─────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │   Components    │
              │  (17 views)     │
              └─────────────────┘
```

---

## 🔑 **Key Principles**

1. **Single Source of Truth**
   - Runtime state: `App.tsx`
   - Configuration: `state.ts`
   - Data: `brandKits.json`

2. **Separation of Concerns**
   - State management ≠ Configuration ≠ Data
   - Each layer has a specific purpose

3. **Declarative Components**
   - Components declare what they need
   - System provides it automatically

4. **Automatic Synchronization**
   - Change `selectedBrandKit`
   - Everything updates automatically

5. **Type Safety**
   - Full TypeScript support
   - Compile-time error checking

---

## 📍 **File Locations**

```
canva-prototype/
└── src/
    ├── providers/
    │   └── App.tsx                    ⚡ RUNTIME STATE TRACKED HERE
    │
    ├── types.ts                       📝 State type definitions
    │
    ├── pages/Brand/
    │   ├── data/                      📊 DATA & CONFIGURATION
    │   │   ├── index.ts               🎯 Main API
    │   │   ├── brandKits.json         📊 All content data
    │   │   ├── state.ts               📋 Business rules
    │   │   ├── hooks.ts               ⚛️ React hooks
    │   │   ├── types.ts               📝 Type definitions
    │   │   ├── images.ts              🖼️ Image mappings
    │   │   └── README.md              📖 Documentation
    │   │
    │   ├── views/                     🎨 VIEW COMPONENTS
    │   │   ├── AllAssets.tsx          Category grid
    │   │   ├── Icons.tsx              Icons view
    │   │   ├── Logos.tsx              Logos view
    │   │   ├── CanvaValues.tsx        Canva Values view
    │   │   └── ... (14 more views)
    │   │
    │   └── index.tsx                  🗺️ Main router
    │
    └── components/ui/
        ├── BrandKitSelector/          🎛️ Dropdown to switch brand kits
        ├── BrandBanner/               🏷️ Shows current brand kit
        └── EmptyBrandKitSection/      📭 Empty state component
```

---

## 🎯 **State Tracking in Detail**

### **What Gets Tracked:**

```typescript
// In src/providers/App.tsx
interface AppState {
  theme: ThemeMode;
  sidebarVisible: boolean;
  mobileMenuOpen: boolean;
  // ... other app-wide state

  selectedBrandKit: string; // 👈 THE ONLY BRAND KIT STATE
  //                            Values: 'Canva Brand Kit' |
  //                                    'People Brand Kit' |
  //                                    'Canva Developers' |
  //                                    'Canva China'
}
```

### **What Doesn't Get Tracked:**

❌ **Not tracked as state:**

- Individual category selections (handled by URL params)
- Empty state flags (computed from configuration)
- Brand kit data (loaded once from JSON)
- Folder visibility (computed from data)
- Asset selections (component-local state)

**Why?** These are either:

- Computed values (don't need storage)
- Static data (never changes)
- Local to components (not global)

---

## 🎯 **Summary**

**The entire Brand Kit system has ONLY ONE piece of runtime state:**

```typescript
selectedBrandKit: string; // In App.tsx
```

**Everything else is either:**

- 📊 **Static data** (in `brandKits.json`)
- 📋 **Configuration** (in `state.ts`)
- 🖼️ **Asset mappings** (in `images.ts`)
- 🧮 **Computed values** (derived from the above)

**This makes the system:**

- ✅ Simple to understand
- ✅ Easy to debug
- ✅ Performant (minimal state)
- ✅ Predictable (one source of truth)

---

For detailed API documentation and examples, see the main sections in [README.md](./README.md).
