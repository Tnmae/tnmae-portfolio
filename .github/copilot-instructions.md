# Project Guidelines

## Code Style
- Use React function components in JavaScript (`.jsx`) with named constants and default export per file.
- Follow existing styling approach: component-level inline `style={{ ... }}` for section/component layout, and global tokens/utilities in `src/index.css`.
- Reuse existing CSS custom properties (colors, timing, easing) from `src/index.css` instead of introducing one-off values when an equivalent token exists.
- Keep section IDs and anchor targets consistent (`hero`, `about`, `skills`, `projects`, `contact`) because scroll state and nav highlighting depend on them.

## Architecture
- App is a single-page React + Vite portfolio. Root orchestration is in `src/App.jsx`.
- `src/App.jsx` owns active section detection from scroll position and passes `activeSection` to `Nav`.
- Section components live in `src/components/` and are rendered in order by `App`: `Hero`, `About`, `Skills`, `Projects`, `Contact`.
- Hero includes a React Three Fiber canvas background (`@react-three/fiber`, `@react-three/drei`); preserve graceful behavior when changing hero visuals.

## Component Patterns

Replicate these proven patterns when adding or modifying components:

### Scroll-Triggered Reveals (Framer Motion)
Use `whileInView` + viewport margin for staggered animations as sections enter viewport. See [`src/components/Skills.jsx`](src/components/Skills.jsx) and [`src/components/Projects.jsx`](src/components/Projects.jsx) for container/child stagger pattern:
```jsx
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 }
};
```

### Interactive Hover Physics (Magnetic Effect)
[`src/components/Nav.jsx`](src/components/Nav.jsx) applies spring-based offset to nav links on mousemove. Use Framer Motion's `useSpring` + ref-based mouse tracking for magnetic polish.

### Text Reveal & Typewriter Effect
[`src/components/Hero.jsx`](src/components/Hero.jsx) splits text into characters and animates per-character. Custom `useTypewriter` hook is internal; reuse pattern for similar reveal interactions.

### Interactive Card Tilt
[`src/components/Projects.jsx`](src/components/Projects.jsx) implements TiltCard with pointer tracking and CSS perspective transforms. Store tilt angles in component state (x, y rotation).

### 3D Background Scenes
- **React Three Fiber canvas** ([`src/components/Scene3D.jsx`](src/components/Scene3D.jsx)): Positioned absolutely behind content; manage z-index carefully. Include optional `warpSpeed` mode for dramatic effects.
- **CSS-Driven animated dots** ([`src/components/BackgroundDots.jsx`](src/components/BackgroundDots.jsx)): Pointer tracking via `requestAnimationFrame` + CSS custom properties; no JS animations. Preserve this pattern for performance.

### Reduced Motion Accessibility
All Framer Motion animations and scroll triggers automatically respect `@media (prefers-reduced-motion: no-preference)`. Never bypass this; it's enforced in `src/index.css`.

### Custom Cursor & Playful Details
[`src/components/CustomCursor.jsx`](src/components/CustomCursor.jsx) overrides default cursor. Easter eggs are encouraged (e.g., Konami code ↑↑↓↓←→←→BA activates `warpSpeed` mode in [`src/App.jsx`](src/App.jsx)); keep the editorial tone fun but purposeful.

## Build and Test
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Preview production build: `npm run preview`
- There is currently no configured test or lint script in `package.json`; do not invent commands in automation.

## Conventions
- Preserve the dark, editorial visual direction and tokenized palette; avoid introducing unrelated themes or UI frameworks.
- Keep animations purposeful and performant (prefer `opacity` + `transform`; avoid layout-thrashing animation properties).
- Use existing content/data patterns: hardcoded section content and local arrays in components unless explicitly asked to refactor data sourcing.
- Resume links assume `public/assets/resume.pdf`; keep that path stable unless the asset strategy is intentionally changed.
- When updating docs or implementation guidance, link to canonical docs below instead of duplicating full specs.

## Canonical Docs
- Design system and visual rules: `DESIGN_SYSTEM.md`
- Animation behavior and reduced-motion expectations: `ANIMATIONS.md`
- Content source-of-truth and placeholders: `CONTENT.md`
- Section and layout requirements: `STRUCTURE.md`
- Stack and performance constraints: `TECH_STACK.md`
