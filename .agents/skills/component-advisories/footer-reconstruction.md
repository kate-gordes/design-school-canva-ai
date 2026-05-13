# Advisory: Footer Reconstruction

Load this only when `requiredAdvisories` includes `footer`.

Source: `ui/nav/redesign/portable/footer/` — too service-heavy to import directly. Reconstruct statically with hardcoded data.

---

## Footer structure

```
<footer> flex, justify-center, bg: linear-gradient(transparent, #f6f7f8)
  container (max-width: 1920px)
    content (paddingX: 0→24px→48px→64px)
      logo row (80×30px wrapper)
      nav row:
        downloads column (width 271px @largeUp, 400px @xLargeUp)
          tagline: "Download Canva for free" (fontWeight: 500)
          buttons: Windows, Mac (ButtonLink variant="secondary")
        masonry nav (column-count 3→4, column-gap 16px)
          7 columns: Product, About, Plans, Inspiration, Help, Tools, Community
    addendum (border-top, paddingX: 0→32px→48px→64px, paddingTop 24px @900px)
      social icons (LinkedIn, Instagram, Facebook, TikTok, Pinterest, X, YouTube)
      legal (Privacy Policy, Terms of Use, © year Canva)
```

---

## CanvaLogo in footer — ALWAYS wrap in explicit dimensions

`CanvaLogo` renders `<span class="logo"><img /></span>` where `img { width: 100%; height: 100% }` — it sizes by container. Without explicit dimensions the logo fills the full parent width.

```tsx
<div style={{ width: 80, height: 30 }}>
  <CanvaLogo />
</div>
```

SVG intrinsic size: 80×30px. This matches the real footer logo display size.

---

## Social icons — always constrain SVG size

Some social icon SVGs are 512×512. Always add:

```css
.socialButton svg {
  max-width: 20px;
  max-height: 20px;
  width: 20px;
  height: 20px;
}
```

---

## Data extraction from live page

```javascript
() => {
  const footer = document.querySelector('footer');
  const navCols = [...footer.querySelectorAll('nav > ul > li')];
  return {
    tagline: footer.querySelector('[class*="tagline"], h2')?.textContent?.trim(),
    navColumnHeaders: navCols.map(li => li.querySelector('span, strong')?.textContent?.trim()),
  };
};
```

Use this to get the exact nav column headings and tagline text from `https://www.canva.com` via Chrome DevTools MCP at `localhost:1337`.
