# 🔄 Migration Guide

## Quick Migration Steps

### 1. Update Imports

**Replace all old imports:**

```typescript
// ❌ Old imports
import { useAppContext } from '@/hooks/useAppContext';
import { shouldShowEmptyState } from '@/pages/Brand/ExternalData/brandKitState';
import { getBrandKitByName } from '@/pages/Brand/ExternalData/allBrandKitsData';
import { getCategoryImage } from '@/pages/Brand/ExternalData/categoryImages';

// ✅ New single import
import { useCategoryEmptyState, getCategoryImage, getBrandKit } from '@/pages/Brand/data';
```

### 2. Update Component Logic

**Before:**

```typescript
function IconsPage() {
  const { selectedBrandKit } = useAppContext();
  const shouldShowEmpty = shouldShowEmptyState(selectedBrandKit, 'Icons');
  const emptyMessage = getEmptyStateMessage(selectedBrandKit, 'Icons');
  const categoryImage = getCategoryImage(selectedBrandKit, 'Icons');

  return shouldShowEmpty ? (
    <EmptyBrandKitSection
      categoryName="Icons"
      imageUrl={categoryImage}
      title={emptyMessage.title}
      description={emptyMessage.description}
    />
  ) : (
    <IconsContent />
  );
}
```

**After:**

```typescript
function IconsPage() {
  const { shouldShowEmptyState, emptyStateMessage } = useCategoryEmptyState('Icons');
  const categoryImage = getCategoryImage('Icons'); // Now automatically uses selected brand kit

  return shouldShowEmptyState ? (
    <EmptyBrandKitSection
      categoryName="Icons"
      imageUrl={categoryImage}
      title={emptyStateMessage.title}
      description={emptyStateMessage.description}
    />
  ) : (
    <IconsContent />
  );
}
```

### 3. Files to Update

Run these commands to update all files:

```bash
# Find all files that need updating
grep -r "ExternalData" src/pages/Brand/views/
grep -r "shouldShowEmptyState.*selectedBrandKit" src/pages/Brand/views/
grep -r "getBrandKitByName" src/pages/Brand/
```

### 4. Automated Migration

You can use this sed script to help with the migration:

```bash
# Update imports
find src/pages/Brand/views/ -name "*.tsx" -exec sed -i '' \
  's|@/pages/Brand/ExternalData/brandKitState|@/pages/Brand/data|g' {} \;

find src/pages/Brand/views/ -name "*.tsx" -exec sed -i '' \
  's|@/pages/Brand/ExternalData/categoryImages|@/pages/Brand/data|g' {} \;

# Update function calls
find src/pages/Brand/views/ -name "*.tsx" -exec sed -i '' \
  's|getBrandKitByName|getBrandKit|g' {} \;
```

### 5. Test Each Component

After migration, test each component:

1. **Icons.tsx** - Check empty state for People Brand Kit
2. **Charts.tsx** - Check empty state for Canva Developers
3. **Photos.tsx** - Check empty state for Canva China
4. **Graphics.tsx** - Check empty state for Canva China
5. **AllAssets.tsx** - Check brand kit switching
6. **Other views** - Check brand banner titles

### 6. Remove Old Files

After successful migration:

```bash
rm -rf src/pages/Brand/ExternalData/
rm -rf src/pages/Brand/output/
```

## Common Issues

### TypeScript Errors

If you see TypeScript errors about missing types:

```typescript
// Add this import
import type { BrandKitName } from '@/pages/Brand/data';
```

### Hook Dependency Warnings

If you see React hook dependency warnings:

```typescript
// The new hooks handle dependencies automatically
const { shouldShowEmptyState } = useCategoryEmptyState('Icons');
// No need to add selectedBrandKit to dependencies
```

### Image Loading Issues

If category images aren't loading:

```typescript
// Make sure you're using the new image function
import { getCategoryImage } from '@/pages/Brand/data';

// This now automatically uses the selected brand kit
const imageUrl = getCategoryImage('Icons');
```
