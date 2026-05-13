# Advisory: Design Creation Shortcut Buttons

Load this only when `requiredAdvisories` includes `designCreationShortcuts`.

The Home page shortcut carousel (Presentation, Social Media, Video, etc.) uses a **custom icon system** distinct from generic `ui/base/icons/` Easel icons.

---

## ⛔ NEVER use generic Easel icons for these buttons

Icons like `<PresentIcon>`, `<VideoIcon>`, `<DocumentIcon>` from `ui/base/icons/` are wrong for shortcut carousel buttons. The shapes and the colored circle system are different.

---

## Source files

| File                                                                          | Purpose                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------- |
| `ui/design_creation/design_spec_icon/icons/visual_suite/1color/*.inline.svg`  | The SVG icons (one per category)          |
| `ui/design_creation/design_spec_icon/design_creation_shortcut_icon_color.css` | CSS custom properties for colored circles |
| `ui/design_creation/shortcut/design_creation_shortcut.css`                    | Layout and sizing                         |

---

## Icon file mapping

All files live in `ui/design_creation/design_spec_icon/icons/visual_suite/1color/`. SVGs have `fill="#191E26"` → replace with `fill="currentColor"`.

| Category       | SVG file                       |
| -------------- | ------------------------------ |
| Presentation   | `icon_presentation.inline.svg` |
| Social Media   | `icon_social.inline.svg`       |
| Video          | `icon_video.inline.svg`        |
| Print          | `icon_print.inline.svg`        |
| Doc / Document | `icon_docs.inline.svg`         |
| Whiteboard     | `icon_whiteboard.inline.svg`   |
| Sheets         | `icon_sheets.inline.svg`       |
| Interactive    | `icon_interactive.inline.svg`  |
| Websites       | `icon_websites.inline.svg`     |
| Email          | `icon_email.inline.svg`        |
| More           | `icon_more.inline.svg`         |

---

## Color system — resolved values per category

| Category             | Circle background | Icon color                           |
| -------------------- | ----------------- | ------------------------------------ |
| Presentation         | `#FF6105`         | white                                |
| Social Media         | `#FF3B4B`         | white                                |
| Video                | `#E950F7`         | white                                |
| Print                | `#992BFF`         | white                                |
| Doc                  | `#13A3B5`         | white                                |
| Whiteboard           | `#0BA84A`         | white                                |
| Sheets               | `#138EFF`         | white                                |
| Interactive          | `#A21CAF`         | white                                |
| Websites             | `#4A53FA`         | white                                |
| Email                | `#5334EB`         | white                                |
| More                 | `#6453D0`         | white                                |
| Upload / Custom Size | `#F2F3F5`         | `#0D1216` (dark icon on gray circle) |

---

## Visual structure

```
div.container (hover trigger)
  a.card
    Rows (center aligned, gap="1u")
      div.thumbnailContainer (48×48px, flex center, position: relative)
        div.thumbnailCircle (position: absolute, 100%×100%, borderRadius: 9999px, bg=circleColor)
        span (dangerouslySetInnerHTML — 32×32 SVG icon)
      div.labelContainer (width: 80px, min-height: 40px)
        TruncatedText (label, bold, xsmall/small size)
```

```css
.thumbnailContainer {
  width: 48px;
  height: 48px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.thumbnailCircle {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  transition: transform 0.3s ease;
}
.container:hover .thumbnailCircle {
  transform: scale(1.05);
}
.labelContainer {
  width: 80px;
  min-height: 40px;
}
/* ≥900px */
.labelContainer {
  width: 88px;
}

/* Icon color */
.iconWrapper {
  color: #ffffff;
} /* default: white on colored circle */
.iconWrapper.dark {
  color: #0d1216;
} /* upload/custom: dark on gray circle */
```

---

## Implementation — inline SVGs as string constants

Since prototype TSX cannot import `.inline.svg` directly, read each file and store as a constant:

```tsx
// Read file, replace fill="#191E26" with fill="currentColor"
const ICON_PRESENTATION = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <path fill="currentColor" d="..."/>
</svg>`;

// Render:
<span dangerouslySetInnerHTML={{ __html: ICON_PRESENTATION }} />;
```

---

## Variant: `variantVisualSuite` (always use this for static shortcuts)

The prototype always uses `variantVisualSuite` for standard category shortcuts:

- Circle background = **primary color** (bright color)
- Icon = **white** (or dark for upload/custom)

**Do NOT use `variantDesignSpec`** — that's for server-provided items with pastel circles and brand-colored icons.

---

## Hover behavior

- Circle: `transform: scale(1.05)` on `.container:hover .thumbnailCircle`
- Subtitle label: `opacity: 0 → 1` on hover (`.visibleOnHover` class)
- Skip the full sprite sheet animation — use `transform: scale(1.05)` only

---

## Magic Layers and Photo Editor thumbnails

**Magic Layers**: PNG thumbnail instead of SVG icon, no colored circle background.

1. Source PNG: `pages/home/launchpad/shortcut_carousel/thumbnails/magic_layers.png`
2. Import from monorepo path and render as `<img>` at 56×56px (overflows the 48×48 circle — `max-width: none; flex-shrink: 0` required to prevent CSS reset from capping at 48px):
   ```tsx
   import magicLayersThumbnail from '../../../../../canva/web/src/pages/home/launchpad/shortcut_carousel/thumbnails/magic_layers.png';
   // Render:
   <img src={magicLayersThumbnail} className={styles.thumbnailImg} alt="Magic Layers" />;
   ```

**Photo Editor**: The prototype represents a logged-in user **with uploaded photos**, so always use the **"has thumbnail" state** (not the camera icon state):

- No colored circle background (`NONE` color)
- 56×56 photo thumbnail (same overflow sizing as Magic Layers)
- The actual thumbnail is a user-uploaded photo served from Canva's CDN — not a local monorepo asset

**How to get the correct thumbnail:**

1. Open canva.com in Chrome with DevTools MCP active
2. Run:
   ```js
   Array.from(document.querySelectorAll('button'))
     .find(b => b.textContent?.includes('Photo editor'))
     ?.querySelector('img')?.src;
   ```
3. `curl -o src/pages/home/SHORTCUTS/photo_editor_thumbnail.png "<CDN_URL>"`
4. Import and use the downloaded file:
   ```tsx
   import photoEditorThumbnail from './photo_editor_thumbnail.png';
   <img src={photoEditorThumbnail} className={styles.thumbnailImg} alt="Photo editor" />;
   ```

**⚠️ The `photo_shortcut_icon.svg` camera icon is the no-thumbnail fallback** (user has no photos). Never use it in the prototype — it renders as a white SVG on a pink circle and is only correct when the user has no uploaded photos.

**⛔ Do not invent placeholder images** from unrelated monorepo paths (e.g. `alice-240p.png`, avatar assets, story assets). Always download the actual image from canva.com and save it locally in the slot directory.
