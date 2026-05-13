# Slot Manifest Schema

Written by `target-capture` to `.porter-workspace/<PageName>/manifest.json`.
Read by `page-porter` (orchestrator) to know what slots to process.

## JSON Schema

```typescript
interface SlotManifest {
  pageName: string; // e.g. "AnonHome"
  monorepoPath: string; // e.g. "pages/anon_home"
  prototypeRoute: string; // e.g. "/anon-home"
  pageEntryPoint: string; // monorepo-relative path to the page's root component, e.g. "pages/anon_home/index.tsx"
  shellImport: string | null; // monorepo-relative path to the shell layout component, if any
  slots: SlotEntry[];
  sharedComponents: string[]; // e.g. ["header", "footer"] — handled separately from slots
  screenshots: Record<string, string>; // optional: viewport → file path (for human reference only)
}

interface SlotEntry {
  slotName: string; // e.g. "HERO_EDITORIAL"
  sourcePath: string; // monorepo-relative, e.g. "pages/anon_home/body/hero_editorial_video"
  screenshotRegion?: string; // path to cropped screenshot for this slot (optional)
  order: number; // render order on page (0 = topmost)
  requiredAdvisories: AdvisoryFlag[]; // which advisory files slot-porter must load
}

type AdvisoryFlag =
  | 'scrollAwareHeader'
  | 'footer'
  | 'navFlyout'
  | 'inlineSvg'
  | 'designCreationShortcuts';
```

## Example

```json
{
  "pageName": "AnonHome",
  "monorepoPath": "pages/anon_home",
  "prototypeRoute": "/anon-home",
  "pageEntryPoint": "pages/anon_home/index.tsx",
  "shellImport": null,
  "slots": [
    {
      "slotName": "HERO_EDITORIAL",
      "sourcePath": "pages/anon_home/body/hero_editorial_video",
      "order": 0,
      "requiredAdvisories": ["inlineSvg"]
    },
    {
      "slotName": "SHOWCASES",
      "sourcePath": "pages/anon_home/body/showcases",
      "order": 1,
      "requiredAdvisories": []
    },
    {
      "slotName": "SPOTLIGHT",
      "sourcePath": "pages/anon_home/body/spotlight",
      "order": 2,
      "requiredAdvisories": []
    },
    {
      "slotName": "TEMPLATES",
      "sourcePath": "pages/anon_home/body/templates",
      "order": 3,
      "requiredAdvisories": []
    },
    {
      "slotName": "ECOSYSTEM",
      "sourcePath": "pages/anon_home/body/ecosystem",
      "order": 4,
      "requiredAdvisories": []
    },
    {
      "slotName": "FOOTER_BANNER",
      "sourcePath": "pages/anon_home/body/footer_banner",
      "order": 5,
      "requiredAdvisories": []
    }
  ],
  "sharedComponents": ["header", "footer"],
  "screenshots": {}
}
```

## Advisory flags — when to set them

| Flag                      | Set when                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `scrollAwareHeader`       | Slot is the page header, or a slot that requires knowing header variant/scroll behavior |
| `footer`                  | Slot is `sharedComponents` footer                                                       |
| `navFlyout`               | Source files import from `ui/nav/redesign/portable/header/menu_bar` or similar          |
| `inlineSvg`               | Any `.inline.svg` import found in source files during target-capture                    |
| `designCreationShortcuts` | Source files import from `ui/design_creation/shortcut/` or `design_spec_icon`           |

The `sharedComponents` array tells the orchestrator which shared components (header, footer) need to be ported in addition to the slots. These are handled separately — the orchestrator spawns dedicated slot-porter runs for "header" and "footer" using the advisory files.
