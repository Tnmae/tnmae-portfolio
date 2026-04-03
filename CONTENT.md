# Content Specification

Replace all `[PLACEHOLDER]` values with your real information before handing off to the coding agent.

---

## 1. Hero Section

```
Overline:   "Available for work" (or remove if not job-seeking)
Heading:    [YOUR FULL NAME]
Subheading: [YOUR TITLE — e.g., "Full-Stack Engineer & Creative Developer"]
Body:       [1–2 sentence tagline, e.g.,
             "I build fast, beautiful, accessible web products —
              from pixel-perfect UIs to scalable backend systems."]
CTA button: "View My Work"  → scrolls to #projects
Secondary:  "Download Resume" → links to /assets/resume.pdf
```

---

## 2. About Section

```
Overline:   "01 / ABOUT"
Heading:    "A little about me"
Body (2–3 paragraphs):
  Paragraph 1: Who you are, where you're based, current role/status.
  Paragraph 2: Your background — how you got into tech, what drives you.
  Paragraph 3: Outside of work — hobbies, interests (humanizes the page).

Optional:   Profile photo at /assets/images/avatar.jpg
            (square or portrait, 400×400px minimum)
```

---

## 3. Skills Section

```
Overline: "02 / SKILLS"
Heading:  "What I work with"

Skill Groups (customize freely):

  Languages:
    [e.g., Python, JavaScript, TypeScript, Go, Java, C++]

  Frontend:
    [e.g., React, Next.js, Vue, Svelte, HTML5, CSS3, Tailwind]

  Backend:
    [e.g., Node.js, FastAPI, Django, Express, GraphQL, REST]

  Data & ML:
    [e.g., PostgreSQL, MongoDB, Redis, TensorFlow, PyTorch, Pandas]

  DevOps & Cloud:
    [e.g., Docker, Kubernetes, AWS, GCP, GitHub Actions, CI/CD]

  Tools:
    [e.g., Git, Figma, VS Code, Postman, Linux]
```

---

## 4. Projects Section

```
Overline: "03 / PROJECTS"
Heading:  "Things I've built"

--- Project 1 ---
Title:        [PROJECT NAME]
Description:  [2–3 sentences: what it does, why you built it, key challenge solved]
Tags:         [e.g., React · Node.js · PostgreSQL · Deployed on Vercel]
Live URL:     [https://your-project.com]  (or omit if not deployed)
Repo URL:     [https://github.com/you/project]
Screenshot:   /assets/images/project-1.webp  (1200×750px recommended)
Featured:     true  (shows larger/prominent on desktop)

--- Project 2 ---
[Repeat above structure]

--- Project 3 ---
[Repeat above structure]

... (add 3–6 projects total)
```

---

## 5. Contact Section

```
Overline:  "04 / CONTACT"
Heading:   "Let's work together"
Body:      [1–2 sentences, e.g.,
            "I'm currently open to full-time and freelance opportunities.
             Drop me a line and I'll get back to you within 24 hours."]

Email CTA: [your@email.com]  (large, clickable mailto: link)

Social Links:
  GitHub:   https://github.com/[username]
  LinkedIn: https://linkedin.com/in/[username]
  Twitter:  https://twitter.com/[username]  (optional)
  Resume:   /assets/resume.pdf  (optional icon link)
```

---

## 6. Footer

```
Text: "Designed & built by [YOUR NAME] · [YEAR]"
```

---

## Meta / SEO

```html
<title>[Your Name] — [Your Title]</title>
<meta name="description" content="[Your 1-sentence pitch]">
<meta property="og:title" content="[Your Name] — Portfolio">
<meta property="og:image" content="/assets/images/og-preview.jpg">  <!-- 1200×630px -->
<link rel="canonical" href="https://[yourdomain.com]">
```

---

## Assets Checklist

- [ ] `hero-bg.mp4` or `hero-bg.webm` — ambient looping video (muted, no audio needed) OR supply a static `hero-bg.jpg` as fallback
- [ ] `avatar.jpg` — profile photo (optional)
- [ ] `project-1.webp` through `project-N.webp` — project screenshots
- [ ] `resume.pdf` — downloadable CV
- [ ] `og-preview.jpg` — social share card (1200×630px)
- [ ] Favicon — `favicon.ico` or `favicon.svg`
