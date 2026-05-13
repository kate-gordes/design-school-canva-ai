# Select Component System

This folder contains a complete, organized select component system with separated concerns:

## 📁 Folder Structure

```
src/components/ui/Select/
├── index.ts                    # Main exports
├── triggers/                   # Trigger components
│   ├── BaseInput/             # Input-style trigger
│   └── PillTrigger/           # Pill-style trigger
├── menu/                      # Menu components
│   └── BaseSelect/            # Dropdown menu
├── combo/                     # Combined components
│   └── SelectCombo/           # Combines trigger + menu
└── examples/                  # Usage examples
    ├── ExampleNewDropdown/    # Input trigger example
    └── ExamplePillDropdown/   # Pill trigger example
```

## 🎯 Components

### Triggers (What the user clicks)

- **BaseInput**: Button-style trigger with title/value layout
- **PillTrigger**: Pill-style trigger using Easel Pill component

### Menu (The dropdown that opens)

- **BaseSelect**: The dropdown menu with options and search

### Combined (Complete solution)

- **SelectCombo**: Combines trigger + menu + state management

## 💡 Usage

```tsx
import { SelectCombo } from '@/shared_components/Select';

// Input-style dropdown
<SelectCombo triggerType="input" title="Sort by" options={options} />

// Pill-style dropdown
<SelectCombo triggerType="pill" placeholder="Filter" options={options} />
```

## 🏗️ Architecture Benefits

- ✅ **Separation of concerns** - Trigger vs Menu logic
- ✅ **Reusable components** - Mix and match as needed
- ✅ **Organized structure** - Clear folder hierarchy
- ✅ **Type safety** - Full TypeScript support
- ✅ **Examples included** - Clear usage patterns
