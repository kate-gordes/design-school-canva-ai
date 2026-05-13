# The Canva Prototype

A high quality, end-to-end template of Canva built with the real Easel design system — the same components used in production.

🌐 **[Live demo](https://jude-canva-prototype.flyingfox.canva-experiments.com/)**

---

## Setup

**1. Clone the repo**

```bash
cd ~ && mkdir -p work && cd work && git clone git@github.com:canvanauts/canva-prototype.git
```

**2. Open the folder in Cursor** at `~/work/canva-prototype`

**3. Install dependencies**

```bash
npm install
```

**4. Start the dev server**

```bash
npm start
```

Then open **http://localhost:5173/**

---

## Deploying

Build a static bundle and deploy to [Flying Fox](https://flyingfox.canva-experiments.com/) hosting.

---

## Assets & images

The prototype splits assets into two lanes based on size:

| Lane       | Where to put it | When to use it                                                         | How it's served                                                |
| ---------- | --------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Bundle** | `src/assets/…`  | Anything under ~100 KB (icons, small illustrations, config JSON, SVGs) | Base64-inlined into a separate `assets.js` chunk at build time |
| **CDN**    | `assets-cdn/…`  | Anything larger (photos, brand kits, app screenshots, demo imagery)    | Uploaded to Flying Fox and served from a CDN URL at runtime    |

### Bundle lane — `src/assets/`

Drop the file somewhere under `src/assets/`, then import it normally:

```tsx
import logo from '@/assets/icons/canva-ai-logo.svg';

<img src={logo} alt="Canva AI" />;
```

Vite will inline it into `assets.js` (kept separate from the main app code so edits to the app don't invalidate the image cache).

### CDN lane — `assets-cdn/`

Put the file in `assets-cdn/<folder>/<file>` — the path maps 1:1 to the CDN URL. Then reference it using the `cdn()` helper:

```ts
import { cdn } from '@/utils/cdn';

const heroImage = cdn('brand-images/hero.png');

// In JSX:
<img src={cdn('apps/featured/typeform.png')} />;
```

No leading slash on the path. In dev, Vite serves `assets-cdn/` locally so you don't need the CDN online to test.

### Uploading `assets-cdn/` to the shared CDN

Files under `assets-cdn/` are served from the shared prototype CDN at `https://public.canva-experiments.com/canva-prototype/` (the default for `VITE_CDN_URL`). The folder structure under `assets-cdn/` maps 1:1 to the URL path.

### Using your own CDN

> ⚠️ **Heads up for user testing.** If you host CDN assets on your own URL, they **won't be available in user testing** — For anything that needs to work for user testing, put it in the **`public/`** folder instead (bundled and deployed with your project).

Set `VITE_CDN_URL` in `.env` to point at your own bucket or hostname:

```bash
VITE_CDN_URL=https://your-prefix.example.com/
```

Then deploy `assets-cdn/` to that location.

### Analysing the bundle

To see what's in each chunk (treemap visualisation):

```bash
npm run build:analyse
```

## Support

Our goal is for every team to have their own master prototype they own and maintain — with Creative Technology here to help you get there and keep going.

Reach out in [#creative-tech](https://canva.enterprise.slack.com/archives/C06KG6JPBGB) on Slack and we can:

- Answer questions
- Fix bugs
- Build out missing product areas for your team
- Build advanced features like AI and real data
- Help solve complex, unusual interaction design problems
- Arrange a training session for you or your team
- Join your parties
