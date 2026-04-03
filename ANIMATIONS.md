# Animation Spec

All animations should feel cinematic and purposeful — inspired by the Google Meroë scroll-storytelling experience. Every reveal should feel like a curtain lifting, not a pop-in.

---

## Core Principle: Scroll-Driven Reveals

Use `IntersectionObserver` (threshold: 0.15) to toggle a `.visible` class on elements as they enter the viewport. All reveal animations start hidden via CSS, then animate in when `.visible` is added.

```css
/* Base state — hidden */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity var(--duration-slow) var(--ease-out),
              transform var(--duration-slow) var(--ease-out);
}

/* Revealed state */
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## Animation Inventory

### 1. Hero — Text Word Reveal
- Split the hero heading into individual `<span>` words.
- Stagger each word: `animation-delay: calc(N * 80ms)`.
- Animation: `translateY(100%) → translateY(0)` with `overflow: hidden` on parent (clip reveal).

```css
@keyframes wordReveal {
  from { transform: translateY(110%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
```

### 2. Hero — Ambient Background
- Option A: Looping MP4/WebM video, `autoplay muted loop playsinline`.
- Option B: Animated gradient mesh using CSS `@keyframes` + `background-position`.
- Option C: Canvas-based particle field (subtle, low density).
- Overlay: `linear-gradient(to bottom, transparent 60%, #0a0a0a)` to fade into content.

### 3. Nav — Scroll Appearance
- At page top: transparent background.
- After 80px scroll: transition to `background: rgba(10,10,10,0.85); backdrop-filter: blur(12px)`.

```js
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});
```

### 4. Section Headers — Slide Up
- Overline: fade in, 200ms delay.
- Heading: `translateY(24px) → 0`, 400ms, 100ms delay after overline.

### 5. Project Cards — Staggered Grid
- Cards in the grid each receive `.reveal` with increasing delay:
  ```js
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
    observer.observe(card);
  });
  ```
- Hover: `transform: translateY(-6px); box-shadow: 0 20px 60px rgba(232,200,122,0.12);`

### 6. Skill Tags — Wave Cascade
- Tags appear one by one in a left-to-right wave within each category.
- Delay: `i * 30ms` per tag.

### 7. Contact — Large CTA Hover
- Email link: underline expands from 0 to full width on hover (CSS `::after` pseudo-element scale).

```css
.email-link::after {
  content: '';
  display: block;
  height: 2px;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 300ms var(--ease-out);
}
.email-link:hover::after { transform: scaleX(1); }
```

### 8. Cursor (Optional Desktop Only)
- Custom cursor: small circle that follows the pointer with slight lag (`lerp`).
- On hovering interactive elements: cursor expands to a larger ring.

---

## Reduced Motion

Wrap ALL transitions and animations in:

```css
@media (prefers-reduced-motion: no-preference) {
  /* animation rules here */
}
```

When reduced motion is preferred, elements should simply appear instantly (no translate, no delay).

---

## Performance Notes

- Use `will-change: transform, opacity` only on elements that are actively animating.
- Remove `will-change` after animation completes via JS to free GPU layers.
- Prefer `transform` and `opacity` — they are compositor-only and won't trigger layout.
- Avoid animating `height`, `width`, `margin`, or `top/left`.
- Video background: include `<source type="video/webm">` first (smaller file size), MP4 as fallback.
