# Tech Stack

Choose one of the two tracks below. Both produce the same visual result.

---

## Track A — Vanilla HTML/CSS/JS (Recommended for simplicity)

Best if you want zero build tools, easy deployment to GitHub Pages or Netlify.

| Layer | Choice | Notes |
|---|---|---|
| Markup | HTML5 (semantic) | Single `index.html` |
| Styles | CSS3 + CSS Custom Properties | Single `style.css` |
| Interactivity | Vanilla JS (ES2020+) | Single `main.js` |
| Fonts | Google Fonts CDN | Cormorant Garamond + DM Sans + JetBrains Mono |
| Icons | Lucide Icons (CDN) or inline SVG | Social links, arrow icons |
| Animations | CSS transitions + IntersectionObserver | No animation library needed |
| Deployment | GitHub Pages / Netlify / Vercel (drag-and-drop) | |

### Dependencies (CDN, no npm needed)
```html
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
```

---

## Track B — React + Vite (Recommended for component reuse)

Best if you want component-driven code, easier to extend over time.

| Layer | Choice | Version |
|---|---|---|
| Framework | React | 18+ |
| Build tool | Vite | 5+ |
| Styles | CSS Modules or plain CSS | — |
| Fonts | Google Fonts or `@fontsource` npm | — |
| Animations | Framer Motion | 11+ |
| Icons | `lucide-react` | latest |
| Deployment | Vercel (auto-deploy from GitHub) | — |

### Install
```bash
npm create vite@latest portfolio -- --template react
cd portfolio
npm install framer-motion lucide-react
npm run dev
```

---

## Shared Requirements (both tracks)

- **No external UI library** (no MUI, Chakra, Tailwind) — styles are custom per the design system.
- **No jQuery**.
- **Images**: use `<img loading="lazy">` and `.webp` format for all project screenshots.
- **Fonts**: preload the display font for the hero heading:
  ```html
  <link rel="preload" as="font" href="..." crossorigin>
  ```
- **Performance targets**:
  - Lighthouse Performance ≥ 90
  - First Contentful Paint < 1.5s
  - No layout shift on load (set explicit `width`/`height` on images)

---

## Deployment Checklist

- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1">` in `<head>`
- [ ] All asset paths are relative (no absolute `/` paths if deploying to a subdirectory)
- [ ] Resume PDF linked correctly at `/assets/resume.pdf`
- [ ] OG image set for social sharing
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled (automatic on Netlify/Vercel/GitHub Pages)
