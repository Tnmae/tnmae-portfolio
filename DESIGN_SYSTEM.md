# Design System

Inspired by Google Arts & Culture's Meroë site: immersive, editorial, cinematic.

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-surface` | `#111111` | Card / panel backgrounds |
| `--color-border` | `#222222` | Subtle dividers |
| `--color-accent` | `#e8c87a` | Golden highlight (CTAs, active nav) |
| `--color-accent-soft` | `#c8a85a33` | Glow effects, hover overlays |
| `--color-text-primary` | `#f0ece4` | Headings, hero text |
| `--color-text-secondary` | `#9a9488` | Body copy, captions |
| `--color-tag` | `#1e1e1e` | Skill tags background |

---

## Typography

```css
/* Display — large headings, hero section */
font-family: 'Cormorant Garamond', serif;
font-weight: 300–700;

/* UI / Body — navigation, labels, body text */
font-family: 'DM Sans', sans-serif;
font-weight: 300–500;

/* Monospace — code blocks, skill tags */
font-family: 'JetBrains Mono', monospace;
```

### Type Scale

| Name | Size | Usage |
|---|---|---|
| `hero` | `clamp(3.5rem, 10vw, 8rem)` | Hero name/title |
| `section-title` | `clamp(2rem, 5vw, 4rem)` | Section headings |
| `card-title` | `1.5rem` | Project card titles |
| `body` | `1rem / 1.75` | Paragraphs |
| `label` | `0.75rem` | Tags, captions, overlines |

---

## Spacing

Uses an 8px base grid.
```
xs: 8px | sm: 16px | md: 24px | lg: 48px | xl: 80px | xxl: 128px
```

---

## Motion Tokens

```css
--duration-fast: 200ms;
--duration-base: 400ms;
--duration-slow: 800ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);       /* Spring-like reveal */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* Smooth transitions */
```

---

## Visual Style Rules

1. **Dark-first**: Every section uses dark backgrounds. Never use white backgrounds.
2. **Grain overlay**: Apply a subtle noise texture (SVG filter or CSS) over the entire page at 3–5% opacity to add depth.
3. **Accent sparingly**: The gold `--color-accent` should appear in small doses — nav dot, underlines, hover states, CTAs.
4. **Full-bleed sections**: Every major section (`<section>`) occupies `min-height: 100vh`.
5. **Parallax depth**: Background images/meshes move at 0.5× scroll speed relative to content.
6. **No harsh borders**: Use `box-shadow` and `backdrop-filter` instead of solid borders on cards.
7. **Image treatment**: Project screenshots get a subtle golden duotone or desaturated filter until hover (full color on hover).

---

## Component Patterns

### Nav Bar
- Fixed top, transparent background that gains `backdrop-filter: blur(12px)` + subtle border on scroll.
- Left: name/logo in display font.
- Right: anchor links + active dot indicator animated with CSS.

### Hero Section
- Fullscreen with looping ambient video/canvas background (particle or gradient mesh).
- Centered large display text with animated word reveal (chars staggered, translateY + opacity).
- Scroll indicator arrow pulsing at the bottom.

### Section Header
- Overline label in mono font (e.g., `02 / PROJECTS`).
- Large display heading below.
- Optional thin horizontal rule on the left.

### Project Card
- Dark surface, rounded 8px.
- Hover: card lifts (`translateY(-6px)`), border glows with accent color.
- Contains: screenshot (top), title, description, tag list, and links.

### Skill Tags
- Pill-shaped, mono font, dark background.
- Grouped by category.

### Contact Section
- Minimal. Large mailto link in display font. Social icon links below.
