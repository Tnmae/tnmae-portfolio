# Site Structure

Single-page application with smooth anchor-scroll navigation. All content lives in `index.html` (or `App.jsx` for React). No page routing needed.

---

## File / Folder Layout

```
portfolio/
├── index.html              # Entry point
├── style.css               # Global styles + CSS variables (or Tailwind config)
├── main.js                 # Scroll observer, animations, nav highlight logic
├── assets/
│   ├── fonts/              # Self-hosted fonts (optional)
│   ├── images/
│   │   ├── hero-bg.*       # Hero ambient background (video/webm or fallback jpg)
│   │   ├── project-1.*     # Project screenshots (optimized webp)
│   │   ├── project-2.*
│   │   └── ...
│   └── icons/              # SVG icons (GitHub, LinkedIn, etc.)
├── components/             # (React only)
│   ├── Nav.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Skills.jsx
│   ├── Projects.jsx
│   └── Contact.jsx
└── README.md
```

---

## Section Map

| # | ID | Label | Purpose |
|---|---|---|---|
| 0 | `#top` | — | Nav anchor, scroll-to-top |
| 1 | `#hero` | — | First impression, name, title, CTA |
| 2 | `#about` | About | Short bio, photo/avatar (optional) |
| 3 | `#skills` | Skills | Grouped tech/skill tags |
| 4 | `#projects` | Projects | 3–6 featured project cards |
| 5 | `#contact` | Contact | Email + social links |

---

## Navigation

```
[ Name / Logo ]  ——————  About · Skills · Projects · Contact  [ Resume ↗ ]
```

- Sticky/fixed position, full-width.
- Active section is highlighted via IntersectionObserver watching each `<section>`.
- On mobile: hamburger collapses into a slide-down overlay menu.

---

## HTML Skeleton

```html
<body>
  <nav id="nav">...</nav>

  <section id="hero">...</section>
  <section id="about">...</section>
  <section id="skills">...</section>
  <section id="projects">...</section>
  <section id="contact">...</section>

  <footer>...</footer>
</body>
```

---

## Responsive Breakpoints

| Name | Width | Notes |
|---|---|---|
| Mobile | `< 640px` | Single column, larger tap targets |
| Tablet | `640px – 1024px` | 2-column project grid |
| Desktop | `> 1024px` | 3-column grid, larger type scale |

---

## Accessibility Requirements

- All interactive elements have `:focus-visible` styles.
- Images have descriptive `alt` attributes.
- Reduced-motion: wrap all non-essential animations in `@media (prefers-reduced-motion: no-preference)`.
- Color contrast: text on dark bg meets WCAG AA (≥4.5:1).
- Semantic HTML5 elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
