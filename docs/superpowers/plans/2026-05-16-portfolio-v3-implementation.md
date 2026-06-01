# Portfolio v3 Implementation Plan

> **For executors:** Tasks below use checkbox (`- [ ]`) syntax. Implement task-by-task. Each task is bite-sized (2–5 min per step) and contains the exact code, commands, and verification steps. Re-read the spec before each phase: [`docs/superpowers/specs/2026-05-16-portfolio-v3-design.md`](../specs/2026-05-16-portfolio-v3-design.md).

**Goal:** Replace the old Next.js portfolio (still on `main`) with the v3 App-Store × Heritage Astro 6 static site, deployable identically to GitHub Pages and Vercel. CSS-only animation, no React, no API routes.

**Architecture:** Astro 6 static-output site. CSS variables drive the dark App-Store × Heritage palette. Sticky 3-phone hero powered by `animation-timeline: scroll()`. Cross-document `@view-transition` for shared-element morphs between landing and 3 case-study deep dives. Content lives in MDX (case studies) + typed TS data files (projects, OSS, experience, contact). Contact form posts to Formspree (no backend).

**Tech stack:** Astro 6 · MDX · TypeScript strict · Noto Naskh Arabic + JetBrains Mono + Inter (self-hosted WOFF2) · `lightningcss` · `@astrojs/sitemap` · `@astrojs/mdx`. **No React. No `@astrojs/vercel`. No Resend. No Zod. No vitest in v1.**

**Branch:** `redesign-v3-app-store-heritage` (off `main`). v2 brutalist-terminal site stays at `rewrite-v2`; the old Next.js code stays at tag `pre-rewrite-v1` for ultimate rollback.

**Working environment:** Windows 11, PowerShell 7. `npm`, `npx`, `git` work identically. Where a file operation differs, both forms are given. Git ownership workaround: prepend every `git` invocation with `-c safe.directory=D:/MyProjects/My_Portfolio/portfolio` (we cannot modify global git config).

---

## Phase 0 — Tag, clear, scaffold

### Task 1: Tag `main` and clear old Next.js code on v3 branch

**Files:** filesystem clean-up + tag.

- [ ] **Step 1: Verify branch + clean working tree.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio status
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio branch --show-current
```

Expected output: `redesign-v3-app-store-heritage` and clean tree (the v3 spec commit `4835277` is already on this branch).

- [ ] **Step 2: Tag the v3 starting point.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio tag -a pre-v3-clean -m "Pre-clean snapshot of v3 branch (old Next.js code still present)"
```

- [ ] **Step 3: Delete the old Next.js code (bash).**

```bash
cd /d/MyProjects/My_Portfolio/portfolio
rm -rf app components data hooks lib seeds scripts deployment_guide public .next node_modules
rm -f package.json package-lock.json next.config.ts next-env.d.ts postcss.config.mjs tsconfig.json tsconfig.tsbuildinfo eslint.config.mjs proxy.ts README.md check_cols.mjs test-audit.mjs test_upsert.mjs tmp_check_columns.ts .env.example .env.local
ls -la
```

Expected: only `.git`, `.gitignore`, `.claude` (gitignored), `docs/`, and possibly `.vscode` remain. The `docs/` subtree must be preserved (it contains the spec + plan).

- [ ] **Step 4: Commit the clean slate.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Clear Next.js portfolio (v3 starting point)"
```

### Task 2: Scaffold Astro 6 with MDX + sitemap

**Files:** create `package.json`, `astro.config.mjs`, `tsconfig.json`, `.env.example`, `.gitignore`, `src/env.d.ts`, `src/pages/index.astro`.

- [ ] **Step 1: Initialize Astro non-interactively.**

```bash
cd /d/MyProjects/My_Portfolio/portfolio
npm create astro@latest temp-scaffold -- --template minimal --typescript strict --install no --git no --yes
```

This creates `temp-scaffold/` to avoid the cwd-clash bug. Move the files up and discard the wrapper:

```bash
cd /d/MyProjects/My_Portfolio/portfolio
mv temp-scaffold/* temp-scaffold/.* ./ 2>&1 | grep -v "cannot move .* itself\|same file" || true
rm -rf temp-scaffold
ls -la
```

Expected: `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/`, `public/`, `README.md` are now at repo root.

- [ ] **Step 2: Add integrations + dev deps.**

```bash
npm install astro@^6 @astrojs/mdx @astrojs/sitemap
npm install -D lightningcss @types/node
```

- [ ] **Step 3: Replace `package.json` name + scripts.**

Rewrite the file to:

```json
{
  "name": "portfolio",
  "type": "module",
  "version": "3.0.0",
  "private": true,
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^6.3.3",
    "@astrojs/mdx": "^5.0.6",
    "@astrojs/sitemap": "^3.7.2"
  },
  "devDependencies": {
    "lightningcss": "^1.32.0",
    "@types/node": "^25.8.0"
  }
}
```

After the rewrite, run `npm install` to refresh the lock-file.

- [ ] **Step 4: Configure `astro.config.mjs`.**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Site URL — read from env so GH Pages + Vercel use the same build.
const SITE = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';
// BASE path — used by GH Pages for project repos. Defaults to '/' on Vercel.
const BASE = process.env.PUBLIC_BASE_PATH || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: { build: { cssMinify: 'lightningcss' } },
});
```

- [ ] **Step 5: Configure `tsconfig.json`.**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src", ".astro/types.d.ts"],
  "exclude": ["dist"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

- [ ] **Step 6: Create `.env.example`.**

```
# Public site URL — used for canonical, sitemap, OG.
# Localhost in dev, GH Pages URL in production GH Action, Vercel-provided URL in Vercel preview.
PUBLIC_SITE_URL=http://localhost:4321

# Base path for GH Pages project repos (e.g. /<repo-name>). Leave empty on Vercel.
PUBLIC_BASE_PATH=/

# Formspree form ID — POST endpoint id (NOT the full URL).
# Sign up at https://formspree.io, create a form, paste its ID here.
# If empty, the contact form falls back to a mailto: link.
PUBLIC_FORMSPREE_ID=
```

- [ ] **Step 7: Rewrite `.gitignore`.**

```
# build output
dist/
.vercel/

# astro generated types
.astro/

# dependencies
node_modules/

# env (real values; .env.example is committed)
.env
.env.local
.env.production

# editor / OS
.DS_Store
.idea/
.vscode/

# typescript
*.tsbuildinfo

# per-user Claude Code config
.claude/

# superpowers brainstorm files
.superpowers/
```

- [ ] **Step 8: Delete the Astro template README.**

```bash
rm -f README.md
```

- [ ] **Step 9: Verify dev server starts.**

```bash
npm run dev
```

Open `http://localhost:4321` — should render the default Astro placeholder. Stop with `Ctrl+C`.

- [ ] **Step 10: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Scaffold Astro 6 + MDX + sitemap (v3 static-only, no React)"
```

---

## Phase 1 — Visual foundation

### Task 3: Self-host fonts (JetBrains Mono + Inter + Noto Naskh Arabic)

**Files:** `public/fonts/*.woff2`, `src/styles/fonts.css`.

- [ ] **Step 1: Download all six WOFF2 files from fontsource CDN.**

```bash
mkdir -p /d/MyProjects/My_Portfolio/portfolio/public/fonts
cd /d/MyProjects/My_Portfolio/portfolio/public/fonts

curl -fsSL -o JetBrainsMono-Regular.woff2 https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.woff2
curl -fsSL -o JetBrainsMono-SemiBold.woff2 https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-600-normal.woff2
curl -fsSL -o JetBrainsMono-Bold.woff2     https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-700-normal.woff2

curl -fsSL -o Inter-Regular.woff2  https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2
curl -fsSL -o Inter-SemiBold.woff2 https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.woff2
curl -fsSL -o Inter-Bold.woff2     https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff2

curl -fsSL -o NotoNaskhArabic-Bold.woff2 https://cdn.jsdelivr.net/fontsource/fonts/noto-naskh-arabic@latest/arabic-700-normal.woff2

ls -lh
```

Expected: 7 WOFF2 files, total ~150–200 KB. If `arabic-700-normal.woff2` 404s, fall back to the `latest/700.woff2` variant or `arabic-700-bold.woff2` — the package layout varies; check `https://cdn.jsdelivr.net/fontsource/fonts/noto-naskh-arabic@latest/` listing in a browser.

- [ ] **Step 2: Create `src/styles/fonts.css`.**

```css
/* src/styles/fonts.css — self-hosted, Latin + Arabic subsets */

@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/JetBrainsMono-SemiBold.woff2') format('woff2');
}
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/JetBrainsMono-Bold.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/Inter-SemiBold.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/Inter-Bold.woff2') format('woff2');
}

@font-face {
  font-family: 'Noto Naskh Arabic';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/NotoNaskhArabic-Bold.woff2') format('woff2');
  unicode-range: U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF;
}
```

- [ ] **Step 3: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add public/fonts/ src/styles/fonts.css
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Self-host JetBrains Mono + Inter + Noto Naskh Arabic"
```

### Task 4: Design tokens

**Files:** `src/styles/tokens.css`.

- [ ] **Step 1: Create the file.**

```css
/* src/styles/tokens.css — palette, type, spacing, radii, motion */

:root {
  /* palette — dark only in v1 */
  --bg: #0d0d12;
  --bg-elev: #1a1a22;
  --bg-bar: #161620;
  --fg: #fafafa;
  --fg-dim: #a0a0a8;
  --accent: #d4a558;
  --accent-glow: oklch(76% 0.13 80 / 0.35);
  --cyan: #67e8f9;
  --lime: #a3e635;
  --alert: #fca5a5;
  --border: oklch(100% 0 0 / 0.08);
  --border-soft: oklch(76% 0.13 80 / 0.18);

  /* type families */
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-arabic: 'Noto Naskh Arabic', serif;

  /* fluid type scale */
  --fs-hero: clamp(2.5rem, 4vw + 1rem, 5rem);
  --fs-section: clamp(1.5rem, 2vw + 0.5rem, 2.25rem);
  --fs-featured: clamp(1.5rem, 2vw + 0.5rem, 2rem);
  --fs-h3: 1.25rem;
  --fs-body: 1rem;
  --fs-prose: 1.0625rem;
  --fs-small: 0.875rem;
  --fs-micro: 0.75rem;
  --fs-arabic: clamp(1.75rem, 2vw + 0.5rem, 2.75rem);

  /* line heights */
  --lh-tight: 1.05;
  --lh-snug: 1.4;
  --lh-default: 1.6;
  --lh-prose: 1.75;

  /* spacing scale */
  --s-1: 0.25rem;
  --s-2: 0.5rem;
  --s-3: 0.75rem;
  --s-4: 1rem;
  --s-5: 1.5rem;
  --s-6: 2rem;
  --s-7: 3rem;
  --s-8: 4rem;
  --s-9: 6rem;
  --s-10: 8rem;

  /* radii */
  --r-card: 14px;
  --r-featured: 16px;
  --r-pkg: 12px;
  --r-icon: 18px;
  --r-pill: 999px;

  /* layout */
  --container: 1200px;
  --prose-measure: 68ch;

  /* timings */
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --t-fast: 120ms;
  --t-base: 200ms;
  --t-slow: 400ms;
}

/* reduce-motion global guardrail */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add src/styles/tokens.css
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add design tokens: palette, type scale, spacing, motion gate"
```

### Task 5: Global CSS reset + skip link + container

**Files:** `src/styles/global.css`.

- [ ] **Step 1: Create the file.**

```css
/* src/styles/global.css */
@import './fonts.css';
@import './tokens.css';

/* reset */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html, body { height: 100%; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  line-height: var(--lh-default);
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  padding-inline: env(safe-area-inset-left) env(safe-area-inset-right);
}
img, svg, video { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; color: inherit; }
a { color: var(--accent); text-decoration: none; }
a:hover, a:focus-visible { color: var(--fg); }

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 3px;
}

/* skip-link */
.skip-link {
  position: absolute; top: -100px; left: 0;
  padding: var(--s-2) var(--s-4);
  background: var(--accent); color: var(--bg);
  font: 600 var(--fs-small) var(--font-mono);
  z-index: 100;
  border-radius: 0 0 var(--r-card) 0;
}
.skip-link:focus { top: 0; }

/* container */
.container {
  max-inline-size: var(--container);
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2rem);
}

/* selection */
::selection { background: var(--accent); color: var(--bg); }

/* opt-in cross-document view transitions for project deep dives */
@view-transition { navigation: auto; }
```

- [ ] **Step 2: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add src/styles/global.css
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add global reset + skip-link + container + view-transition opt-in"
```

### Task 6: BaseLayout with font preload + OG meta + JSON-LD ready

**Files:** `src/layouts/BaseLayout.astro`.

- [ ] **Step 1: Create the file.**

```astro
---
// src/layouts/BaseLayout.astro
import '@/styles/global.css';

interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

const { title, description, canonical, ogImage } = Astro.props;
const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321';
const canonicalUrl = canonical ?? new URL(Astro.url.pathname, siteUrl).toString();
const ogImageUrl = ogImage ?? `${siteUrl}/og/default.png`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0d0d12" />
    <meta name="generator" content={Astro.generator} />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preload" href="/fonts/JetBrainsMono-SemiBold.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/Inter-Regular.woff2"           as="font" type="font/woff2" crossorigin />

    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:image" content={ogImageUrl} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={ogImageUrl} />
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to content</a>
    <slot name="banner" />
    <main id="main"><slot /></main>
    <slot name="footer" />
  </body>
</html>
```

- [ ] **Step 2: Replace `src/pages/index.astro` with a smoke test.**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---
<BaseLayout title="Portfolio v3 — scaffold" description="dev">
  <div class="container" style="padding-block: var(--s-9)">
    <p style="font: 700 var(--fs-hero)/var(--lh-tight) var(--font-mono); color: var(--fg)">MUHAMMAD USMAN.</p>
    <p style="color: var(--accent); font: var(--fs-body) var(--font-sans); margin-top: var(--s-3)">Scaffold OK. Tokens loaded. عُثماني (Arabic test).</p>
  </div>
</BaseLayout>
```

The Arabic `عُثماني` literal in the file verifies the Naskh font loads correctly when wrapped in `font-family: var(--font-arabic)` later — for now it falls back to system.

- [ ] **Step 3: Manual verify.**

`npm run dev` then open `http://localhost:4321`. Expected:
- Dark `#0d0d12` background, near-white text.
- Big bold mono wordmark `MUHAMMAD USMAN.` (JetBrains Mono Bold 700, ~80 px at desktop).
- Gold-accent line beneath in Inter.
- No CLS, no FOUC.

- [ ] **Step 4: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add BaseLayout with font preload, OG meta, smoke index"
```

---

## Phase 2 — Atoms

### Task 7: Atomic components — SectionLabel, StatusPill, KvBlock, StatsRow

**Files:** create `src/components/atoms/SectionLabel.astro`, `StatusPill.astro`, `KvBlock.astro`, `StatsRow.astro`.

- [ ] **Step 1: `SectionLabel.astro`.**

```astro
---
// src/components/atoms/SectionLabel.astro
interface Props { eyebrow?: string; n?: number; name: string; }
const { eyebrow = '▸', n, name } = Astro.props;
const label = n != null ? `${eyebrow} ${String(n).padStart(2, '0')} · ${name}` : `${eyebrow} ${name}`;
---
<p class="label" aria-hidden="true">{label}</p>

<style>
  .label {
    color: var(--accent);
    font: 400 var(--fs-micro) var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    margin-block-end: var(--s-4);
  }
</style>
```

- [ ] **Step 2: `StatusPill.astro`.**

```astro
---
// src/components/atoms/StatusPill.astro
interface Props { label: string; href?: string; cta?: string; }
const { label, href = '#contact', cta = 'Get in touch ↓' } = Astro.props;
---
<a class="pill" href={href}>
  <span class="dot" aria-hidden="true"></span>
  <span class="label">{label}</span>
  <span class="cta">{cta}</span>
</a>

<style>
  .pill {
    display: inline-flex;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-2) var(--s-4);
    background: oklch(20% 0.02 80 / 0.55);
    border: 1px solid var(--border-soft);
    border-radius: var(--r-pill);
    color: var(--fg);
    font: 400 var(--fs-small) var(--font-sans);
    text-decoration: none;
    transition: border-color var(--t-base) var(--ease-out),
                background-color var(--t-base) var(--ease-out);
    min-block-size: 44px;
  }
  .pill:hover, .pill:focus-visible {
    border-color: var(--accent);
    background: oklch(25% 0.04 80 / 0.65);
    color: var(--fg);
  }
  .dot {
    inline-size: 8px; block-size: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 0 var(--accent-glow);
    animation: pulse 2s var(--ease-out) infinite;
  }
  .cta { color: var(--accent); font: 600 var(--fs-small) var(--font-sans); }
  @keyframes pulse {
    0%, 60%, 100% { box-shadow: 0 0 0 0 var(--accent-glow); }
    30% { box-shadow: 0 0 0 10px transparent; }
  }
</style>
```

- [ ] **Step 3: `KvBlock.astro`.**

```astro
---
// src/components/atoms/KvBlock.astro
interface Pair { key: string; value: string; valueHtml?: boolean; }
interface Props { pairs: Pair[]; }
const { pairs } = Astro.props;
---
<dl class="kv">
  {pairs.map((p) => (
    <>
      <dt class="k">{p.key}</dt>
      {p.valueHtml ? <dd class="v" set:html={p.value} /> : <dd class="v">{p.value}</dd>}
    </>
  ))}
</dl>

<style>
  .kv {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: var(--s-3) var(--s-5);
    margin: 0;
  }
  .k {
    color: var(--accent);
    font: 400 var(--fs-micro) var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    align-self: baseline;
    padding-block-start: 4px;
  }
  .v { color: var(--fg); margin: 0; font-size: var(--fs-body); }
  @media (max-width: 479px) {
    .kv { grid-template-columns: 1fr; gap: var(--s-1); }
    .k { padding-block: var(--s-3) 0; }
    .k:first-child { padding-block-start: 0; }
  }
</style>
```

- [ ] **Step 4: `StatsRow.astro`.**

```astro
---
// src/components/atoms/StatsRow.astro
interface Stat { num: string; unit?: string; desc: string; }
interface Props { stats: Stat[]; compact?: boolean; }
const { stats, compact = false } = Astro.props;
---
<ul class:list={['stats', compact && 'compact']}>
  {stats.map((s) => (
    <li>
      <div class="num">{s.num}{s.unit && <span class="unit">{s.unit}</span>}</div>
      <div class="desc">{s.desc}</div>
    </li>
  ))}
</ul>

<style>
  .stats {
    list-style: none; padding: 0; margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--s-5);
  }
  @media (min-width: 640px) { .stats { grid-template-columns: repeat(2, 1fr); gap: var(--s-6); } }
  @media (min-width: 1024px) { .stats { grid-template-columns: repeat(4, 1fr); } }

  .compact { grid-template-columns: repeat(2, 1fr) !important; gap: var(--s-4) !important; }
  @media (min-width: 1024px) { .compact { grid-template-columns: repeat(4, 1fr) !important; } }

  .num {
    color: var(--fg);
    font: 700 clamp(1.5rem, 2vw + 0.5rem, 2rem) / 1 var(--font-mono);
  }
  .unit { color: var(--fg-dim); font-size: var(--fs-small); margin-inline-start: 2px; font-weight: 400; }
  .desc { color: var(--fg-dim); margin-block-start: var(--s-2); font-size: var(--fs-small); line-height: 1.5; }
</style>
```

- [ ] **Step 5: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add atoms: SectionLabel, StatusPill (pulse), KvBlock, StatsRow"
```

### Task 8: Atomic components — TodayCard, AppCard, OssCard, PhoneFrame

**Files:** `src/components/atoms/TodayCard.astro`, `AppCard.astro`, `OssCard.astro`, `PhoneFrame.astro`.

- [ ] **Step 1: `TodayCard.astro`** — the featured Today card (gold glow border).

```astro
---
// src/components/atoms/TodayCard.astro
interface Props {
  eyebrow: string;
  title: string;
  glow?: boolean;
  vt?: string; // view-transition-name on the title
}
const { eyebrow, title, glow = true, vt } = Astro.props;
---
<article class:list={['today', glow && 'glow']}>
  <p class="eyebrow" aria-hidden="true">{eyebrow}</p>
  <h2 class="title" style={vt ? `view-transition-name: ${vt};` : undefined}>{title}</h2>
  <div class="body"><slot /></div>
  <div class="ctas"><slot name="ctas" /></div>
</article>

<style>
  .today {
    --angle: 0deg;
    position: relative;
    padding: clamp(var(--s-5), 4vw, var(--s-7));
    background: linear-gradient(180deg, var(--bg-elev), color-mix(in oklab, var(--bg-elev) 70%, var(--bg)));
    border: 1.5px solid var(--border-soft);
    border-radius: var(--r-featured);
    isolation: isolate;
  }
  .glow {
    background:
      radial-gradient(120% 80% at 0% 0%, var(--accent-glow), transparent 60%),
      linear-gradient(180deg, var(--bg-elev), color-mix(in oklab, var(--bg-elev) 60%, var(--bg)));
  }
  .glow::before {
    content: ''; position: absolute; inset: -1.5px;
    border-radius: inherit;
    padding: 1.5px;
    background: conic-gradient(from var(--angle), transparent 0deg, var(--accent) 90deg, transparent 180deg);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    animation: spin 6s linear infinite;
    pointer-events: none;
    z-index: -1;
  }
  @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
  @keyframes spin { to { --angle: 360deg; } }
  @media (prefers-reduced-motion: reduce) { .glow::before { animation: none; } }

  .eyebrow {
    color: var(--accent);
    font: 400 var(--fs-micro) var(--font-mono);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-block-end: var(--s-4);
  }
  .title {
    color: var(--fg);
    font: 700 var(--fs-featured) / var(--lh-snug) var(--font-sans);
    margin-block-end: var(--s-4);
  }
  .body { color: var(--fg); font-size: var(--fs-body); line-height: var(--lh-default); max-inline-size: 60ch; }
  .ctas {
    margin-block-start: var(--s-5);
    display: flex; flex-wrap: wrap; gap: var(--s-3);
  }
</style>
```

- [ ] **Step 2: `AppCard.astro`** — Today-style project card.

```astro
---
// src/components/atoms/AppCard.astro
interface Props {
  name: string;
  tagline: string;
  iconGlyph?: string;
  iconColor?: string;
  badge?: { label: string; tone?: 'gold' | 'cyan' | 'lime' };
  href: string;
  external?: boolean;
  vt?: string;
}
const { name, tagline, iconGlyph = '◆', iconColor = 'var(--accent)', badge, href, external = false, vt } = Astro.props;
const target = external ? '_blank' : undefined;
const rel = external ? 'noopener noreferrer' : undefined;
---
<a class="card" href={href} target={target} rel={rel}>
  <div class="icon" style={`--icon-color: ${iconColor};`}><span aria-hidden="true">{iconGlyph}</span></div>
  <div class="text">
    {badge && <p class={`badge tone-${badge.tone ?? 'gold'}`}>{badge.label}</p>}
    <h3 class="name" style={vt ? `view-transition-name: ${vt};` : undefined}>{name}</h3>
    <p class="tagline">{tagline}</p>
  </div>
  <span class="open" aria-hidden="true">OPEN {external ? '↗' : '→'}</span>
</a>

<style>
  .card {
    display: grid;
    grid-template-columns: 82px 1fr auto;
    gap: var(--s-4);
    align-items: center;
    padding: var(--s-4);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--r-card);
    text-decoration: none;
    color: inherit;
    transition: transform var(--t-base) var(--ease-out),
                border-color var(--t-base) var(--ease-out),
                box-shadow var(--t-base) var(--ease-out);
    min-block-size: 110px;
  }
  @media (hover: hover) and (pointer: fine) {
    .card:hover, .card:focus-visible {
      transform: translateY(-2px);
      border-color: var(--accent);
      box-shadow: 0 12px 32px -12px oklch(20% 0.02 80 / 0.6);
    }
  }
  .icon {
    inline-size: 82px; block-size: 82px;
    background: color-mix(in oklab, var(--icon-color) 14%, transparent);
    border-radius: var(--r-icon);
    display: grid; place-items: center;
    color: var(--icon-color);
    font: 700 2rem var(--font-mono);
  }
  .badge {
    font: 400 var(--fs-micro) var(--font-mono);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin: 0 0 var(--s-1);
  }
  .tone-gold { color: var(--accent); }
  .tone-cyan { color: var(--cyan); }
  .tone-lime { color: var(--lime); }

  .name { font: 700 var(--fs-body) var(--font-sans); color: var(--fg); margin: 0; }
  .tagline { color: var(--fg-dim); font-size: var(--fs-small); margin: var(--s-1) 0 0; line-height: 1.4; }
  .open {
    color: var(--accent);
    font: 600 var(--fs-micro) var(--font-mono);
    letter-spacing: 0.12em;
    padding: var(--s-2) var(--s-3);
    border-radius: var(--r-pill);
    background: oklch(76% 0.13 80 / 0.12);
    white-space: nowrap;
  }

  @media (max-width: 479px) {
    .card { grid-template-columns: 64px 1fr; }
    .icon { inline-size: 64px; block-size: 64px; font-size: 1.5rem; }
    .open { grid-column: 2; justify-self: start; margin-block-start: var(--s-2); }
  }
</style>
```

- [ ] **Step 3: `OssCard.astro`** — package card.

```astro
---
// src/components/atoms/OssCard.astro
interface Props {
  name: string;
  tagline: string;
  href: string;
  badge?: { label: string; tone?: 'gold' | 'cyan' | 'lime' | 'dim' };
  meta?: string;
}
const { name, tagline, href, badge, meta } = Astro.props;
---
<a class="oss" href={href} target="_blank" rel="noopener noreferrer">
  {badge && <p class={`badge tone-${badge.tone ?? 'gold'}`}>{badge.label}</p>}
  <h3 class="name">{name}</h3>
  <p class="tagline">{tagline}</p>
  <div class="foot">
    <span class="link">pub.dev →</span>
    {meta && <span class="meta">{meta}</span>}
  </div>
</a>

<style>
  .oss {
    display: block;
    padding: var(--s-5);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--r-pkg);
    text-decoration: none;
    color: inherit;
    transition: transform var(--t-base) var(--ease-out),
                border-color var(--t-base) var(--ease-out);
  }
  @media (hover: hover) and (pointer: fine) {
    .oss:hover, .oss:focus-visible {
      transform: translateY(-2px);
      border-color: var(--accent);
    }
  }
  .badge {
    font: 400 var(--fs-micro) var(--font-mono);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin: 0 0 var(--s-2);
  }
  .tone-gold { color: var(--accent); }
  .tone-cyan { color: var(--cyan); }
  .tone-lime { color: var(--lime); }
  .tone-dim  { color: var(--fg-dim); }

  .name {
    font: 600 var(--fs-h3) var(--font-mono);
    color: var(--fg);
    margin: 0 0 var(--s-2);
    overflow-wrap: anywhere;
  }
  .tagline { color: var(--fg-dim); font-size: var(--fs-small); line-height: 1.55; margin: 0; }
  .foot {
    display: flex; justify-content: space-between; align-items: end;
    margin-block-start: var(--s-4);
    font: 400 var(--fs-micro) var(--font-mono);
  }
  .link { color: var(--accent); }
  .meta { color: var(--fg-dim); }
</style>
```

- [ ] **Step 4: `PhoneFrame.astro`** — SVG iPhone frame containing one image.

```astro
---
// src/components/atoms/PhoneFrame.astro
interface Props {
  src: string;          // /screens/<file>.avif
  alt: string;
  variant?: 'front' | 'mid' | 'back';
}
const { src, alt, variant = 'front' } = Astro.props;
---
<div class:list={['phone', `phone--${variant}`]} style={`--i:${variant === 'front' ? 0 : variant === 'mid' ? 1 : 2};`}>
  <svg viewBox="0 0 200 410" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="frame">
    <defs>
      <clipPath id="screen-clip"><rect x="14" y="14" width="172" height="382" rx="22" /></clipPath>
    </defs>
    <rect x="2" y="2" width="196" height="406" rx="32" fill="#0a0a0a" stroke="#222" stroke-width="2" />
    <rect x="14" y="14" width="172" height="382" rx="22" fill="#111" />
    <rect x="74" y="18" width="52" height="14" rx="7" fill="#0a0a0a" />
  </svg>
  <img class="shot" src={src} alt={alt} loading="lazy" decoding="async" />
</div>

<style>
  .phone {
    position: relative;
    inline-size: min(280px, 60vw);
    aspect-ratio: 9 / 19.5;
    margin-inline: auto;
    border-radius: 44px;
    overflow: hidden;
    isolation: isolate;
    background: #0a0a0a;
    box-shadow: 0 30px 60px -20px rgb(0 0 0 / .45);
  }
  .frame { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; }
  .shot {
    position: absolute;
    inset-block-start: 14px; inset-inline-start: 14px;
    inline-size: calc(100% - 28px);
    block-size: calc(100% - 28px);
    border-radius: 22px;
    object-fit: cover;
    object-position: top center;
  }
</style>
```

- [ ] **Step 5: Wire the atoms into a quick smoke-test page.**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import SectionLabel from '@/components/atoms/SectionLabel.astro';
import StatusPill from '@/components/atoms/StatusPill.astro';
import StatsRow from '@/components/atoms/StatsRow.astro';
import TodayCard from '@/components/atoms/TodayCard.astro';
import AppCard from '@/components/atoms/AppCard.astro';
import OssCard from '@/components/atoms/OssCard.astro';
import PhoneFrame from '@/components/atoms/PhoneFrame.astro';
---
<BaseLayout title="Atoms smoke" description="dev">
  <div class="container" style="display: grid; gap: var(--s-8); padding-block: var(--s-9)">
    <SectionLabel n={1} name="atoms-smoke" />
    <StatusPill label="Available for new work" />
    <StatsRow stats={[
      { num: '600K', unit: '+', desc: 'peak users on Legend TV' },
      { num: '50',   unit: '+', desc: 'production apps shipped' },
      { num: '#1',              desc: 'PS category, 5 months' },
      { num: '9',    unit: ' pkgs', desc: 'open-source on pub.dev' },
    ]} />
    <TodayCard eyebrow="▸ FEATURED · ADOPTED BY GOOGLE" title="firebase_admin_sdk" vt="google-credential">
      <p>A Dart package I wrote — later officially taken over and maintained by Google's Dart &amp; Flutter team.</p>
      <Fragment slot="ctas">
        <a href="https://pub.dev/packages/firebase_admin_sdk">Get on pub.dev →</a>
      </Fragment>
    </TodayCard>
    <AppCard name="LifeLink" tagline="Crisis app · Gemini AI · Isolates" iconGlyph="🧬" badge={{ label: 'FEATURED', tone: 'cyan' }}
             href="https://play.google.com/store/apps/details?id=com.helper.lifelink" external />
    <OssCard name="vision_ai" tagline="On-device gesture + emotion in Flutter" href="https://pub.dev/packages/vision_ai"
             badge={{ label: 'NEW · ON-DEVICE AI', tone: 'cyan' }} meta="just shipped" />
    <PhoneFrame src="/og/default.png" alt="placeholder" variant="front" />
  </div>
</BaseLayout>
```

Note: `/og/default.png` doesn't exist yet — it's used only as a placeholder source for the PhoneFrame img. Browsers will render a broken icon inside the frame; that's fine for the smoke test.

- [ ] **Step 6: Manual verify.** `npm run dev`, open localhost. Check the atoms render. Resize to 320px width — no horizontal scroll, AppCard stacks, StatsRow goes single-col.

- [ ] **Step 7: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add atoms: TodayCard (animated conic border), AppCard, OssCard, PhoneFrame"
```

---

## Phase 3 — Data files

### Task 9: Typed data files for all sections

**Files:** `src/data/profile.ts`, `projects.ts`, `moreApps.ts`, `webDemos.ts`, `openSource.ts`, `experience.ts`, `contact.ts`, `stack.ts`.

Source for all data: `D:/MyProjects/github_profile/OttomanDeveloper/README.md`.

- [ ] **Step 1: `src/data/profile.ts`.**

```ts
// src/data/profile.ts
export const profile = {
  name: 'Muhammad Usman',
  alias: 'Ottoman Coder',
  aliasArabic: 'عُثماني',
  tagline: 'Senior Mobile Engineer',
  taglineLong: 'Senior Mobile Engineer · Ottoman Coder · 50+ apps shipped, 600K users reached',
  basedIn: 'Islamabad, PK',
  basedNote: 'remote-friendly worldwide',
  email: 'ottomandeveloper@gmail.com',
  resumeHref: '/cv.pdf',
  available: 'Available for new work',
  availableLong: 'Open to remote work, long-term contracts, and partnership opportunities.',
  currentlyShipping: {
    text: 'AI fitness app w/ BLE',
    at: 'Nmo AI',
    href: 'https://www.beinmedia.com/',
  },
  stats: [
    { num: '600K', unit: '+', desc: 'peak users on Legend TV' },
    { num: '50',   unit: '+', desc: 'production apps shipped' },
    { num: '#1',              desc: 'Play Store category, 5 months' },
    { num: '9',    unit: ' pkgs', desc: 'open-source on pub.dev' },
  ],
} as const;
```

- [ ] **Step 2: `src/data/projects.ts`** (8 featured apps).

```ts
// src/data/projects.ts
export const projects = [
  {
    slug: 'lifelink',
    name: 'LifeLink',
    tagline: 'Crisis app · Gemini AI · Dart Isolates',
    iconGlyph: '🧬', iconColor: 'var(--cyan)',
    badge: { label: 'FEATURED', tone: 'cyan' as const },
    href: 'https://play.google.com/store/apps/details?id=com.helper.lifelink',
    external: true,
  },
  {
    slug: 'udownload',
    name: 'UDownload',
    tagline: 'Open-source YouTube client (GPL-3) · NewPipe Extractor',
    iconGlyph: '📺', iconColor: 'var(--lime)',
    badge: { label: 'OPEN SOURCE', tone: 'lime' as const },
    href: 'https://github.com/OttomanDeveloper/u_downloader',
    external: true,
  },
  {
    slug: 'yt-master',
    name: 'YT Master',
    tagline: 'YouTube services marketplace · coin economy · YouTube V3',
    iconGlyph: '💰', iconColor: 'var(--accent)',
    href: 'https://drive.google.com/file/d/1qIS48P6ceQCKApjp6xwr34W6ZU8kesy4/view',
    external: true,
  },
  {
    slug: 'grouper',
    name: 'Grouper',
    tagline: 'Social groups + scam finder · community reporting',
    iconGlyph: '🤝', iconColor: 'var(--cyan)',
    href: 'https://drive.google.com/file/d/1KaNMV5g5Hsdb67thVUai4AA1EdO_jhs2/view',
    external: true,
  },
  {
    slug: 'status-saver',
    name: 'Status Saver',
    tagline: '10+ social platforms · Dart Isolates for concurrent I/O',
    iconGlyph: '📥', iconColor: 'var(--lime)',
    badge: { label: 'OPEN SOURCE', tone: 'lime' as const },
    href: 'https://github.com/OttomanDeveloper/status_getter/releases',
    external: true,
  },
  {
    slug: 'icare',
    name: 'ICare',
    tagline: 'Meditation · biometric privacy · Firebase Cloud Functions',
    iconGlyph: '🧘', iconColor: 'var(--accent)',
    href: 'https://drive.google.com/file/d/1Hd0F4yJBp-DMoEE69OYO1qhZYQEPKp6-/view',
    external: true,
  },
  {
    slug: 'couriergo',
    name: 'CourierGo',
    tagline: 'Multi-vendor logistics · OpenCart API · cross-border tracking',
    iconGlyph: '🚚', iconColor: 'var(--cyan)',
    href: 'https://drive.google.com/file/d/1PQNejDr0FjXLSt40-SiUcoF2b_Aah_nX/view',
    external: true,
  },
  {
    slug: 'bill-checker',
    name: 'Bill Checker',
    tagline: 'Utility aggregation · BLoC · dual theme · premium UI',
    iconGlyph: '🧾', iconColor: 'var(--accent)',
    href: 'https://drive.google.com/file/d/1_hhJzksC3FqmttSXARail4NJo9ueMtMS/view',
    external: true,
  },
] as const;
```

- [ ] **Step 3: `src/data/moreApps.ts`** (8 more live on Play Store).

```ts
// src/data/moreApps.ts
export const moreApps = [
  { name: 'LifeLink',        category: 'Crisis Intervention',  href: 'https://play.google.com/store/apps/details?id=com.helper.lifelink' },
  { name: 'YouShopper',      category: 'Multi-Vendor E-Commerce', href: 'https://play.google.com/store/apps/details?id=com.warehousesheriff.ssPlatform' },
  { name: 'YouShopper Seller', category: 'Seller Dashboard',  href: 'https://play.google.com/store/apps/details?id=com.warehousesheriff.youshopper.seller' },
  { name: 'Homy هومي',       category: 'Home Services (KSA)', href: 'https://play.google.com/store/apps/details?id=homy.homyksaapp.Homyapp' },
  { name: 'Blood Donors',    category: 'Emergency Locator',   href: 'https://play.google.com/store/apps/details?id=com.kalyanpur.blooddonation' },
  { name: 'Group Joiner',    category: 'Social Networking',   href: 'https://play.google.com/store/apps/details?id=com.wagroupss.joiner' },
  { name: 'All Bill Checker', category: 'Utility Management', href: 'https://play.google.com/store/apps/details?id=com.allbillchecker.pk' },
  { name: 'Nakoda Urban',    category: 'Home Services (India)', href: 'https://play.google.com/store/apps/details?id=com.nakoda.customer' },
] as const;
```

- [ ] **Step 4: `src/data/webDemos.ts`** (2 demos).

```ts
// src/data/webDemos.ts
export const webDemos = [
  {
    slug: 'chronos',
    name: 'Chronos',
    subhead: 'A scroll-driven journey through the universe',
    body: 'Single-page Big Bang → today in pure Dart with 30+ CustomPainters animated from a single Ticker. Visibility-gated EraScope keeps dozens of animated scenes at 60 fps. Scroll position is the timeline.',
    stack: ['Flutter 3.44', 'Provider', 'CustomPainter', 'Single Ticker'],
    highlights: ['9 hand-painted eras', 'Scroll-as-timeline', 'Single-ticker 60 fps', 'Zero image assets'],
    live: 'https://ottomandeveloper.github.io/andro_meda/',
    source: 'https://github.com/OttomanDeveloper/andro_meda',
    screenshot: '/screens/chronos.avif',
    caseStudyHref: '/projects/chronos',
  },
  {
    slug: 'piggytoken',
    name: 'PiggyToken',
    subhead: 'Flutter Web crypto landing page',
    body: 'Showcase project demonstrating Flutter web capabilities: scroll-triggered reveals, glassmorphism nav, animated counters, staggered card entrances, FAQ accordion, responsive 3-breakpoint layouts — all with zero external animation packages.',
    stack: ['Flutter 3.44', 'Provider', 'flutter_svg'],
    highlights: ['9 animated sections', 'Glassmorphism UI', 'Active nav tracking', 'Pulsing hero logo'],
    live: 'https://ottomandeveloper.github.io/piggyToken/',
    source: 'https://github.com/OttomanDeveloper/piggyToken',
    screenshot: '/screens/piggytoken.avif',
    caseStudyHref: undefined,
  },
] as const;
```

- [ ] **Step 5: `src/data/openSource.ts`** (9 packages).

```ts
// src/data/openSource.ts
export const openSource = [
  {
    name: 'firebase_admin_sdk',
    tagline: "Firebase Admin SDK for Dart — Firestore, Auth, FCM, Storage. Adopted into Google's official Firebase publisher.",
    href: 'https://pub.dev/packages/firebase_admin_sdk',
    badge: { label: '★ ADOPTED BY GOOGLE', tone: 'gold' as const },
    meta: 'official Firebase publisher',
  },
  {
    name: 'vision_ai',
    tagline: 'On-device hand gesture + facial emotion detection for Flutter. 13 gestures, 7 emotions, 21 hand landmarks. MediaPipe + ML Kit + TFLite, 25–30 fps, zero cloud.',
    href: 'https://pub.dev/packages/vision_ai',
    badge: { label: 'NEW · ON-DEVICE AI', tone: 'cyan' as const },
    meta: 'Android + iOS',
  },
  {
    name: 'vision_ai_flutter',
    tagline: 'Pre-built UI overlay widgets for vision_ai — hand skeleton painter, face contour mesh, gesture/emotion labels.',
    href: 'https://pub.dev/packages/vision_ai_flutter',
    badge: { label: 'COMPANION', tone: 'dim' as const },
    meta: 'companion to vision_ai',
  },
  {
    name: 'tanquery',
    tagline: 'TanStack Query ported to Dart — automatic caching, stale-while-revalidate, background refetching, mutations, infinite queries. Pure Dart.',
    href: 'https://pub.dev/packages/tanquery',
    badge: { label: 'ACTIVE', tone: 'lime' as const },
    meta: 'v0.8.0',
  },
  {
    name: 'tanquery_flutter',
    tagline: 'Flutter adapter for tanquery — QueryBuilder, MutationBuilder, InfiniteQueryBuilder widget builders.',
    href: 'https://pub.dev/packages/tanquery_flutter',
    badge: { label: 'COMPANION', tone: 'dim' as const },
    meta: 'v0.8.0',
  },
  {
    name: 'tanquery_devtools',
    tagline: 'Visual cache inspector overlay for tanquery — real-time query status, mutation log, cache actions.',
    href: 'https://pub.dev/packages/tanquery_devtools',
    badge: { label: 'COMPANION', tone: 'dim' as const },
    meta: 'v0.8.0',
  },
  {
    name: 'newpipeextractor_dart',
    tagline: 'NewPipe Extractor wrap — extract YouTube, SoundCloud, Bandcamp, PeerTube info, streams, subtitles, comments, channels, playlists. No API key.',
    href: 'https://pub.dev/packages/newpipeextractor_dart',
    badge: { label: 'ACTIVE · GPL-3', tone: 'lime' as const },
    meta: 'v2.0.0',
  },
  {
    name: 'firebase_cloud_messaging_dart',
    tagline: 'Send FCM push notifications directly from Dart — zero backend needed. Works in Flutter, Serverpod, CLI, Cloud Run.',
    href: 'https://pub.dev/packages/firebase_cloud_messaging_dart',
    badge: { label: 'ACTIVE', tone: 'lime' as const },
    meta: '17 likes · 371+ dl',
  },
  {
    name: 'charts_flutter_maintained',
    tagline: "Community-maintained fork of Google's abandoned charts library. Keeping legacy apps alive.",
    href: 'https://pub.dev/packages/charts_flutter_maintained',
    badge: { label: 'COMMUNITY FORK', tone: 'dim' as const },
    meta: 'maintained',
  },
] as const;
```

- [ ] **Step 6: `src/data/experience.ts`** (5 roles).

```ts
// src/data/experience.ts
export const experience = [
  {
    period: 'Jul 2024 → present',
    role: 'Senior Mobile App Developer',
    company: 'BeInMedia · Nmo AI',
    companyHref: 'https://www.beinmedia.com/',
    body: 'AI-powered fitness app — BLE health-device sync, Gemini AI coaching, Flutter architecture for a cross-functional international team.',
  },
  {
    period: 'Nov 2020 → present',
    role: 'Senior Mobile App Developer',
    company: 'Ottoman Coder · freelance',
    companyHref: null,
    body: '50+ production apps for clients in PK, IN, SA, AU, TH, LA. Audited 20+ legacy codebases. Product-led engineering directly with founders.',
  },
  {
    period: 'Nov 2022 → May 2023',
    role: 'Senior Mobile Software Engineer',
    company: 'SD Cold Logistics · YouShopper',
    companyHref: null,
    body: 'Built 3 separate apps (Customer, Seller, Delivery) all live on Play Store. Coin-based monetisation, OneSignal, YouTube V3. Zero-downtime backend migration.',
  },
  {
    period: 'Sep 2021 → Mar 2023',
    role: 'Senior Flutter Developer',
    company: 'Fulfil Supply Chain',
    companyHref: null,
    body: 'Cross-border e-commerce — OpenCart API, real-time inventory sync across countries. Firebase Auth + FCM. Measurable startup-time gains.',
  },
  {
    period: 'May 2022 → Oct 2022',
    role: 'Senior Flutter Developer',
    company: 'HomyKSA',
    companyHref: null,
    body: 'Home services marketplace for Saudi Arabia — real-time order matching, payments, worker management.',
  },
] as const;
```

- [ ] **Step 7: `src/data/contact.ts`** (6 channels).

```ts
// src/data/contact.ts
export const contact = [
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/ottomancoder/',          glyph: 'in', tone: 'gold' as const },
  { label: 'Email',     href: 'mailto:ottomandeveloper@gmail.com',                   glyph: '@',  tone: 'gold' as const, copy: 'ottomandeveloper@gmail.com' },
  { label: 'WhatsApp',  href: 'https://wa.me/message/4DIU6JPIALUGK1',               glyph: 'wa', tone: 'lime' as const },
  { label: 'YouTube',   href: 'https://www.youtube.com/@OttomanCoder',              glyph: '▶',  tone: 'gold' as const },
  { label: 'Stack Overflow', href: 'https://stackoverflow.com/users/15117215',      glyph: 'SO', tone: 'gold' as const },
  { label: 'Resume PDF', href: '/cv.pdf',                                            glyph: 'PDF', tone: 'cyan' as const },
] as const;
```

- [ ] **Step 8: `src/data/stack.ts`** (9 categories, verbatim from README).

```ts
// src/data/stack.ts
export const stack = [
  { category: 'Languages',  chips: ['Dart', 'Swift', 'Kotlin', 'PHP', 'JavaScript', 'Java', 'SQL'] },
  { category: 'Frameworks', chips: ['Flutter (Android, iOS, Web, Desktop)', 'Laravel', 'Node.js'] },
  { category: 'State Mgmt', chips: ['BLoC / Cubit', 'GetX', 'Provider', 'ValueNotifier'] },
  { category: 'Backend',    chips: ['Firebase', 'Supabase', 'PostgreSQL', 'MySQL', 'Hive', 'Isar', 'SQLite'] },
  { category: 'APIs',       chips: ['REST', 'FCM HTTP v1', 'OpenCart', 'YouTube V3', 'Google Maps'] },
  { category: 'Hardware',   chips: ['Bluetooth Low Energy (BLE)', 'Health Device Sync'] },
  { category: 'AI/ML',      chips: ['Gemini AI', 'MediaPipe', 'Google ML Kit', 'TFLite', 'On-Device Inference'] },
  { category: 'Vision',     chips: ['Hand Gesture Recognition', 'Facial Emotion Detection', 'Face Contours'] },
  { category: 'Tools',      chips: ['Figma', 'Postman', 'Google Cloud', 'Git', 'Bitbucket'] },
] as const;
```

- [ ] **Step 9: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add src/data/
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add typed data files: profile, projects, moreApps, webDemos, openSource, experience, contact, stack"
```

### Task 10: Convert screenshots to AVIF

**Files:** `public/screens/*.avif`.

The README references PNG screenshots from `D:/MyProjects/github_profile/OttomanDeveloper/Assets/`. We pre-convert them to AVIF to ship ≤80 KB per shot.

- [ ] **Step 1: Install `sharp` as a dev dependency.**

```bash
cd /d/MyProjects/My_Portfolio/portfolio
npm install -D sharp@^0.34
```

- [ ] **Step 2: Create a one-shot conversion script `scripts/convert-screens.mjs`.**

```js
// scripts/convert-screens.mjs
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import { extname, basename, join, resolve } from 'node:path';

const SRC = resolve('D:/MyProjects/github_profile/OttomanDeveloper/Assets');
const OUT = resolve('./public/screens');

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const targets = readdirSync(SRC)
  .filter((f) => f.toLowerCase().endsWith('.png'));

for (const file of targets) {
  const name = basename(file, extname(file));
  const out = join(OUT, `${name}.avif`);
  await sharp(join(SRC, file))
    .resize({ width: 540, withoutEnlargement: true })
    .avif({ quality: 60, effort: 6 })
    .toFile(out);
  console.log(`✓ ${name}.avif`);
}
console.log(`done — ${targets.length} files`);
```

- [ ] **Step 3: Run it.**

```bash
node scripts/convert-screens.mjs
ls -lh public/screens/
```

Expected: 31 `.avif` files in `public/screens/`, each between 15–80 KB.

- [ ] **Step 4: Add a small README for the screens dir.**

`public/screens/README.md`:

```markdown
# Screens

Source PNGs at `D:/MyProjects/github_profile/OttomanDeveloper/Assets/` (not committed here).

To re-convert, run:
\`\`\`
node scripts/convert-screens.mjs
\`\`\`

Output: 540px-wide AVIF (quality 60, effort 6). Target size: ≤80 KB per file.
```

- [ ] **Step 5: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Convert 31 app screenshots PNG→AVIF (540px, quality 60)"
```

### Task 11: Place hero phone-stack screenshots

The phone-stack uses one front + two back shots. Pick the three most visually striking screens. Recommendation: front = `yt_master_1.avif` (rich UI), mid = `icare_1.avif` (calming), back = `grouper_1.avif` (social).

- [ ] **Step 1: Copy chosen shots to canonical hero names.**

```bash
cd /d/MyProjects/My_Portfolio/portfolio/public/screens
cp yt_master_1.avif hero-front.avif
cp icare_1.avif      hero-mid.avif
cp grouper_1.avif    hero-back.avif
ls -lh hero-*
```

- [ ] **Step 2: Also create stand-in shots for Chronos and PiggyToken** (we'll capture real ones from the live URLs at deploy time; for now use a generic):

```bash
# Pick a placeholder — re-shoot at deploy time
cp ../../public/screens/lifelink_1.avif ../../public/screens/chronos.avif    || cp icare_1.avif chronos.avif
cp ../../public/screens/lifelink_2.avif ../../public/screens/piggytoken.avif || cp icare_2.avif piggytoken.avif
```

(These can be replaced later by capturing the live demos. Track as a follow-up.)

- [ ] **Step 3: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Alias 3 hero-stack screenshots + 2 web-demo placeholders"
```

---

## Phase 4 — Sections

### Task 12: `Hero` section with sticky 3-phone stack

**Files:** `src/components/sections/Hero.astro`.

- [ ] **Step 1: Create the component.**

```astro
---
// src/components/sections/Hero.astro
import StatusPill from '@/components/atoms/StatusPill.astro';
import StatsRow from '@/components/atoms/StatsRow.astro';
import { profile } from '@/data/profile';
---
<section id="hero" aria-labelledby="hero-name">
  <div class="container row">
    <div class="copy">
      <p class="eyebrow" aria-hidden="true">▸ TODAY</p>
      <h1 id="hero-name" class="wordmark">{profile.name}.</h1>
      <p class="alias">{profile.alias} · {profile.tagline}</p>
      <p class="tagline">{profile.taglineLong}</p>
      <div class="pill-row">
        <StatusPill label={profile.available} />
      </div>
      <div class="stats">
        <StatsRow stats={[...profile.stats]} compact />
      </div>
      <p class="scroll" aria-hidden="true">scroll to explore ↓</p>
    </div>
    <div class="phones" aria-hidden="true">
      <div class="phone phone--back" style="--i:2">
        <img src="/screens/hero-back.avif" alt="" loading="eager" fetchpriority="high">
      </div>
      <div class="phone phone--mid" style="--i:1">
        <img src="/screens/hero-mid.avif" alt="" loading="eager" fetchpriority="high">
      </div>
      <div class="phone phone--front" style="--i:0">
        <img src="/screens/hero-front.avif" alt="" loading="eager" fetchpriority="high">
      </div>
    </div>
    <span class="arabic" lang="ar" dir="rtl">{profile.aliasArabic}</span>
  </div>
</section>

<style>
  #hero {
    position: relative;
    min-block-size: 100svh;
    padding-block: var(--s-9);
  }
  .row {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--s-8);
    align-items: start;
    position: relative;
  }
  @media (min-width: 1024px) {
    .row { grid-template-columns: 1.2fr 1fr; align-items: center; }
  }

  .eyebrow {
    color: var(--accent);
    font: 400 var(--fs-micro) var(--font-mono);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    margin-block-end: var(--s-4);
  }
  .wordmark {
    color: var(--fg);
    font: 700 var(--fs-hero) / var(--lh-tight) var(--font-mono);
    letter-spacing: -0.02em;
    margin: 0;
    text-wrap: balance;
  }
  .alias {
    color: var(--accent);
    font: 600 var(--fs-body) var(--font-sans);
    margin: var(--s-4) 0 var(--s-3);
  }
  .tagline {
    color: var(--fg-dim);
    font: 400 var(--fs-body) var(--font-sans);
    max-inline-size: 50ch;
    margin: 0;
  }
  .pill-row { margin: var(--s-6) 0; }
  .stats { margin-block: var(--s-7) var(--s-5); }
  .scroll {
    color: var(--fg-dim);
    font: 400 var(--fs-micro) var(--font-mono);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-block-start: var(--s-7);
  }

  .arabic {
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    color: var(--accent);
    font: 700 var(--fs-arabic) / 1 var(--font-arabic);
    pointer-events: none;
  }

  /* Phone stack */
  .phones {
    position: relative;
    block-size: 220svh; /* scroll room for the drift */
    display: none;
  }
  @media (min-width: 640px) {
    .phones { display: block; block-size: auto; min-block-size: 480px; }
  }
  @media (min-width: 1024px) {
    .phones { block-size: 100svh; min-block-size: 600px; }
  }
  .phone {
    position: sticky;
    inset-block-start: 15vh;
    inline-size: min(280px, 60vw);
    aspect-ratio: 9 / 19.5;
    margin-inline: auto;
    border-radius: 44px;
    overflow: hidden;
    background: #0a0a0a;
    border: 2px solid #222;
    box-shadow: 0 30px 60px -20px rgb(0 0 0 / .45);
    translate: calc(var(--i) * 40px) calc(var(--i) * -20px);
    z-index: calc(10 - var(--i));
    animation: drift linear both;
    animation-timeline: scroll(root block);
    animation-range: 0% 100%;
    animation-duration: 1ms; /* Firefox quirk */
  }
  .phone--front { animation-name: none; translate: none; }
  .phone img {
    inline-size: 100%; block-size: 100%;
    object-fit: cover; object-position: top center;
    border-radius: 40px;
    padding: 14px;
  }
  @keyframes drift {
    to {
      translate: calc(var(--i) * 80px) calc(var(--i) * -160px);
      opacity: calc(1 - var(--i) * 0.4);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .phone { animation: none; translate: none; position: static; margin-block: var(--s-4); }
  }
  @media (max-width: 639px) {
    .phone--back, .phone--mid { display: none; }
    .phone--front { position: static; margin-block: var(--s-7); }
  }
</style>
```

- [ ] **Step 2: Wire into landing.**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/sections/Hero.astro';
import { profile } from '@/data/profile';
---
<BaseLayout
  title={`${profile.name} — ${profile.tagline}`}
  description={`${profile.alias}. ${profile.tagline}. ${profile.basedIn}. 50+ apps shipped. 9 open-source packages.`}
>
  <Hero />
</BaseLayout>
```

- [ ] **Step 3: Manual verify.**

`npm run dev`. Expected:
- Wordmark "Muhammad Usman." big bold mono.
- Arabic `عُثماني` top-right in gold (font may fall back if Naskh load is delayed; reload OK).
- Status pill pulses gently.
- On desktop ≥1024 px, phone stack visible on right; on scroll, back two drift up and fade.
- On mobile, only front phone visible, no horizontal scroll.
- `prefers-reduced-motion: reduce` (in DevTools → Rendering) → all phones static.

- [ ] **Step 4: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add Hero section with sticky 3-phone scroll-driven stack + Arabic mark"
```

### Task 13: `GoogleStory` section (featured Today card)

**Files:** `src/components/sections/GoogleStory.astro`.

- [ ] **Step 1: Create.**

```astro
---
// src/components/sections/GoogleStory.astro
import SectionLabel from '@/components/atoms/SectionLabel.astro';
import TodayCard from '@/components/atoms/TodayCard.astro';
import { withBase } from '@/lib/paths';
---
<section id="google-story">
  <div class="container">
    <SectionLabel n={2} name="the google story" />
    <TodayCard eyebrow="▸ FEATURED · ADOPTED BY GOOGLE" title="firebase_admin_sdk" vt="google-credential">
      <p>A Dart package I wrote — later <strong>officially taken over and maintained by Google's Dart &amp; Flutter team.</strong> It now lives under Google's official Firebase publisher with me credited as original author.</p>
      <Fragment slot="ctas">
        <a class="cta primary" href="https://pub.dev/packages/firebase_admin_sdk" target="_blank" rel="noopener noreferrer">Get on pub.dev →</a>
        <a class="cta secondary" href={withBase('/projects/firebase-admin-sdk')}>Read the story →</a>
      </Fragment>
    </TodayCard>
  </div>
</section>

<style>
  #google-story { padding-block: clamp(var(--s-8), 8vw, var(--s-10)); }
  .cta {
    display: inline-flex; align-items: center; gap: var(--s-2);
    padding: var(--s-3) var(--s-5);
    border-radius: var(--r-pill);
    font: 600 var(--fs-small) var(--font-sans);
    text-decoration: none;
    min-block-size: 44px;
  }
  .primary { background: var(--accent); color: var(--bg); }
  .primary:hover { background: color-mix(in oklab, var(--accent) 80%, white); color: var(--bg); }
  .secondary { color: var(--accent); border: 1px solid var(--border-soft); }
  .secondary:hover { border-color: var(--accent); color: var(--fg); }
</style>
```

- [ ] **Step 2: Create `src/lib/paths.ts`** — helper to prepend `BASE` on links.

```ts
// src/lib/paths.ts
const BASE = (import.meta.env.PUBLIC_BASE_PATH ?? '/').replace(/\/$/, '');

/** Prefix an absolute-style path with the configured base. Idempotent for external URLs. */
export function withBase(path: string): string {
  if (!path.startsWith('/')) return path; // external or relative — leave alone
  return `${BASE}${path}`;
}
```

- [ ] **Step 3: Wire into landing.**

Add to `src/pages/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/sections/Hero.astro';
import GoogleStory from '@/components/sections/GoogleStory.astro';
import { profile } from '@/data/profile';
---
<BaseLayout title={`${profile.name} — ${profile.tagline}`} description={`${profile.alias}. ${profile.tagline}. ${profile.basedIn}.`}>
  <Hero />
  <GoogleStory />
</BaseLayout>
```

- [ ] **Step 4: Manual verify** the gold conic-gradient border rotates smoothly (6s cycle) and pauses under `prefers-reduced-motion`.

- [ ] **Step 5: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add #google-story featured Today card + base-path helper"
```

### Task 14: `FeaturedLegendTV` section

**Files:** `src/components/sections/FeaturedLegendTV.astro`.

- [ ] **Step 1: Create.**

```astro
---
// src/components/sections/FeaturedLegendTV.astro
import SectionLabel from '@/components/atoms/SectionLabel.astro';
import StatsRow from '@/components/atoms/StatsRow.astro';
import PhoneFrame from '@/components/atoms/PhoneFrame.astro';
import { withBase } from '@/lib/paths';
---
<section id="legend-tv">
  <div class="container">
    <SectionLabel n={3} name="featured project" />
    <div class="row">
      <div class="copy">
        <h2 class="title" style="view-transition-name: case-title-legend-tv;">Legend TV</h2>
        <p class="sub">A streaming platform I built solo from scratch — zero team, zero budget.</p>
        <StatsRow stats={[
          { num: '600K', unit: '+', desc: 'peak active users' },
          { num: '$20K', unit: '+', desc: 'year-1 revenue' },
          { num: '#1',              desc: 'PS category · 5 mo' },
          { num: '3',               desc: 'countries · PK · IN · SA' },
        ]} compact />
        <p class="body">
          Built the entire product end-to-end: streaming architecture, content delivery, ad integration,
          subscription loops, and Play Store deployment. This wasn't a client project — I identified the
          market gap, built the product, launched it, and scaled it.
        </p>
        <a class="cta" href={withBase('/projects/legend-tv')}>Read the full case study →</a>
      </div>
      <PhoneFrame src="/screens/hero-front.avif" alt="Legend TV app screen" variant="front" />
    </div>
  </div>
</section>

<style>
  #legend-tv { padding-block: clamp(var(--s-8), 8vw, var(--s-10)); }
  .row {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--s-7);
    align-items: center;
  }
  @media (min-width: 1024px) { .row { grid-template-columns: 1.4fr 1fr; } }
  .title { color: var(--fg); font: 700 var(--fs-section) var(--font-sans); margin: 0 0 var(--s-3); }
  .sub { color: var(--accent); margin: 0 0 var(--s-5); font: 600 var(--fs-body) var(--font-sans); }
  .body { color: var(--fg-dim); margin: var(--s-5) 0; max-inline-size: 55ch; line-height: var(--lh-default); }
  .cta {
    display: inline-block; margin-block-start: var(--s-4);
    padding: var(--s-3) var(--s-5);
    background: var(--accent); color: var(--bg);
    border-radius: var(--r-pill);
    font: 600 var(--fs-small) var(--font-sans);
    text-decoration: none;
    min-block-size: 44px;
  }
  .cta:hover { background: color-mix(in oklab, var(--accent) 80%, white); color: var(--bg); }
</style>
```

- [ ] **Step 2: Wire into landing**, append `<FeaturedLegendTV />` after `<GoogleStory />`. Commit pattern is the same as previous tasks.

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add #legend-tv featured project section"
```

### Task 15: `WebDemos` section

**Files:** `src/components/sections/WebDemos.astro`.

- [ ] **Step 1: Create.**

```astro
---
// src/components/sections/WebDemos.astro
import SectionLabel from '@/components/atoms/SectionLabel.astro';
import { webDemos } from '@/data/webDemos';
import { withBase } from '@/lib/paths';
---
<section id="web-demos">
  <div class="container">
    <SectionLabel n={4} name="web demos · flutter web" />
    <p class="intro">Live demos showcasing scroll-driven animation and zero-dependency performance — built with Flutter Web.</p>
    <div class="grid">
      {webDemos.map((d) => (
        <article class="demo">
          <img src={d.screenshot} alt={`${d.name} demo preview`} loading="lazy" decoding="async" />
          <div class="meta">
            <h3 class="name">{d.name}</h3>
            <p class="sub">{d.subhead}</p>
            <p class="body">{d.body}</p>
            <ul class="highlights">
              {d.highlights.map((h) => <li>{h}</li>)}
            </ul>
            <div class="ctas">
              <a class="primary" href={d.live} target="_blank" rel="noopener noreferrer">▶ Open live ↗</a>
              <a class="secondary" href={d.source} target="_blank" rel="noopener noreferrer">Source on GitHub →</a>
              {d.caseStudyHref && <a class="secondary" href={withBase(d.caseStudyHref)}>Read case study →</a>}
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
  #web-demos { padding-block: clamp(var(--s-8), 8vw, var(--s-10)); }
  .intro { color: var(--fg-dim); max-inline-size: 60ch; margin: 0 0 var(--s-6); }
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--s-5);
  }
  @media (min-width: 1024px) { .grid { grid-template-columns: 1fr 1fr; } }
  .demo {
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--r-featured);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .demo img {
    inline-size: 100%; aspect-ratio: 16 / 9;
    object-fit: cover; background: #000;
  }
  .meta { padding: var(--s-5); display: flex; flex-direction: column; gap: var(--s-3); }
  .name { font: 700 var(--fs-h3) var(--font-sans); color: var(--fg); margin: 0; }
  .sub { color: var(--accent); margin: 0; font: 600 var(--fs-small) var(--font-sans); }
  .body { color: var(--fg-dim); margin: 0; font-size: var(--fs-small); line-height: 1.55; }
  .highlights {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-wrap: wrap; gap: var(--s-2);
  }
  .highlights li {
    color: var(--fg);
    font: 400 var(--fs-micro) var(--font-mono);
    padding: 4px 8px;
    background: color-mix(in oklab, var(--fg) 5%, transparent);
    border-radius: var(--r-pill);
  }
  .ctas { display: flex; flex-wrap: wrap; gap: var(--s-3); margin-block-start: var(--s-3); }
  .primary, .secondary {
    padding: var(--s-3) var(--s-4);
    border-radius: var(--r-pill);
    font: 600 var(--fs-small) var(--font-sans);
    text-decoration: none;
    min-block-size: 44px;
    display: inline-flex; align-items: center;
  }
  .primary { background: var(--accent); color: var(--bg); }
  .primary:hover { background: color-mix(in oklab, var(--accent) 80%, white); color: var(--bg); }
  .secondary { color: var(--accent); border: 1px solid var(--border-soft); }
  .secondary:hover { border-color: var(--accent); color: var(--fg); }
</style>
```

- [ ] **Step 2: Wire and commit.** Same pattern. Commit message: `Add #web-demos section (Chronos + PiggyToken cards)`.

### Task 16: `ProjectsGrid` + disclosure of more apps

**Files:** `src/components/sections/ProjectsGrid.astro`.

- [ ] **Step 1: Create.**

```astro
---
// src/components/sections/ProjectsGrid.astro
import SectionLabel from '@/components/atoms/SectionLabel.astro';
import AppCard from '@/components/atoms/AppCard.astro';
import { projects } from '@/data/projects';
import { moreApps } from '@/data/moreApps';
---
<section id="projects">
  <div class="container">
    <SectionLabel n={5} name="projects · today" />
    <div class="grid">
      {projects.map((p) => (
        <AppCard
          name={p.name}
          tagline={p.tagline}
          iconGlyph={p.iconGlyph}
          iconColor={p.iconColor}
          badge={p.badge}
          href={p.href}
          external={p.external}
        />
      ))}
    </div>
    <details class="more">
      <summary>+ {moreApps.length} more apps live on Play Store ↓</summary>
      <ul class="more-list">
        {moreApps.map((a) => (
          <li>
            <a href={a.href} target="_blank" rel="noopener noreferrer">
              <span class="more-name">{a.name}</span>
              <span class="more-cat">{a.category}</span>
              <span class="more-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  </div>
</section>

<style>
  #projects { padding-block: clamp(var(--s-8), 8vw, var(--s-10)); }
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--s-4);
  }
  @media (min-width: 640px)  { .grid { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 1024px) { .grid { grid-template-columns: 1fr 1fr 1fr; } }

  .more { margin-block-start: var(--s-6); }
  .more summary {
    color: var(--accent);
    font: 600 var(--fs-small) var(--font-mono);
    letter-spacing: 0.05em;
    cursor: pointer;
    padding: var(--s-3) 0;
    list-style: none;
  }
  .more summary::-webkit-details-marker { display: none; }
  .more-list {
    list-style: none; padding: 0; margin: var(--s-3) 0 0;
    display: grid; grid-template-columns: 1fr; gap: var(--s-2);
  }
  @media (min-width: 640px)  { .more-list { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 1024px) { .more-list { grid-template-columns: 1fr 1fr; } }
  .more-list a {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: var(--s-3);
    align-items: center;
    padding: var(--s-3) var(--s-4);
    border: 1px solid var(--border);
    border-radius: var(--r-pkg);
    color: var(--fg);
    text-decoration: none;
    background: var(--bg-elev);
    transition: border-color var(--t-base) var(--ease-out);
    min-block-size: 56px;
  }
  .more-list a:hover { border-color: var(--accent); color: var(--fg); }
  .more-name { font-weight: 600; }
  .more-cat { color: var(--fg-dim); font-size: var(--fs-small); }
  .more-arrow { color: var(--accent); }
</style>
```

- [ ] **Step 2: Wire and commit** with message `Add #projects 8-card grid + disclosure of 8 more Play Store apps`.

### Task 17: `OssGrid` section

**Files:** `src/components/sections/OssGrid.astro`.

- [ ] **Step 1: Create.**

```astro
---
// src/components/sections/OssGrid.astro
import SectionLabel from '@/components/atoms/SectionLabel.astro';
import OssCard from '@/components/atoms/OssCard.astro';
import { openSource } from '@/data/openSource';
---
<section id="opensource">
  <div class="container">
    <SectionLabel n={6} name="open source · pub.dev" />
    <p class="intro">Nine packages published to pub.dev — gap-fillers for the Flutter/Dart ecosystem. Two are featured.</p>
    <div class="grid">
      {openSource.map((p) => (
        <OssCard
          name={p.name}
          tagline={p.tagline}
          href={p.href}
          badge={p.badge}
          meta={p.meta}
        />
      ))}
    </div>
  </div>
</section>

<style>
  #opensource { padding-block: clamp(var(--s-8), 8vw, var(--s-10)); }
  .intro { color: var(--fg-dim); max-inline-size: 60ch; margin: 0 0 var(--s-6); }
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--s-4);
  }
  @media (min-width: 640px)  { .grid { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 1024px) { .grid { grid-template-columns: 1fr 1fr 1fr; } }
</style>
```

- [ ] **Step 2: Wire + commit** with message `Add #opensource 9-package grid`.

### Task 18: `ExperienceTimeline` section

**Files:** `src/components/sections/ExperienceTimeline.astro`.

- [ ] **Step 1: Create.**

```astro
---
// src/components/sections/ExperienceTimeline.astro
import SectionLabel from '@/components/atoms/SectionLabel.astro';
import { experience } from '@/data/experience';
---
<section id="experience">
  <div class="container">
    <SectionLabel n={7} name="experience" />
    <ol class="timeline">
      {experience.map((e) => (
        <li class="entry">
          <span class="dot" aria-hidden="true"></span>
          <p class="period">{e.period}</p>
          <h3 class="role">
            {e.role}{' '}
            <span class="at">@</span>{' '}
            {e.companyHref
              ? <a href={e.companyHref} target="_blank" rel="noopener noreferrer">{e.company}</a>
              : <span>{e.company}</span>}
          </h3>
          <p class="body">{e.body}</p>
        </li>
      ))}
    </ol>
  </div>
</section>

<style>
  #experience { padding-block: clamp(var(--s-8), 8vw, var(--s-10)); }
  .timeline {
    list-style: none; padding: 0; margin: 0;
    position: relative;
    padding-inline-start: var(--s-6);
  }
  .timeline::before {
    content: '';
    position: absolute;
    inset-block: 6px;
    inset-inline-start: 5px;
    inline-size: 1px;
    background: var(--border-soft);
  }
  .entry { position: relative; padding-block: var(--s-5); }
  .entry:first-child { padding-block-start: 0; }
  .dot {
    position: absolute;
    inset-block-start: var(--s-5);
    inset-inline-start: calc(-1 * var(--s-6) + 1px);
    inline-size: 11px; block-size: 11px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 4px var(--bg);
  }
  .entry:first-child .dot { inset-block-start: 0; }
  .period {
    color: var(--accent);
    font: 400 var(--fs-micro) var(--font-mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0 0 var(--s-2);
  }
  .role {
    color: var(--fg);
    font: 700 var(--fs-h3) var(--font-sans);
    margin: 0 0 var(--s-2);
  }
  .at { color: var(--fg-dim); font-weight: 400; }
  .role a { color: var(--accent); text-decoration: none; border-bottom: 1px solid var(--border-soft); }
  .role a:hover { border-bottom-color: var(--accent); color: var(--fg); }
  .body { color: var(--fg-dim); margin: 0; max-inline-size: 65ch; line-height: var(--lh-default); }
</style>
```

- [ ] **Step 2: Wire + commit** as `Add #experience timeline (5 roles, gold dots)`.

### Task 19: `StackGrid` section

**Files:** `src/components/sections/StackGrid.astro`.

- [ ] **Step 1: Create.**

```astro
---
// src/components/sections/StackGrid.astro
import SectionLabel from '@/components/atoms/SectionLabel.astro';
import { stack } from '@/data/stack';
---
<section id="stack">
  <div class="container">
    <SectionLabel n={8} name="stack · day-to-day" />
    <dl class="grid">
      {stack.map((g) => (
        <>
          <dt class="k">{g.category}</dt>
          <dd class="v">
            {g.chips.map((c) => <span class="chip">{c}</span>)}
          </dd>
        </>
      ))}
    </dl>
  </div>
</section>

<style>
  #stack { padding-block: clamp(var(--s-8), 8vw, var(--s-10)); }
  .grid {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: var(--s-3) var(--s-5);
    margin: 0;
  }
  @media (max-width: 479px) {
    .grid { grid-template-columns: 1fr; gap: var(--s-1); }
    .k { padding-block: var(--s-3) 0; }
  }
  .k {
    color: var(--accent);
    font: 400 var(--fs-micro) var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    align-self: baseline;
    padding-block-start: 6px;
  }
  .v { margin: 0; display: flex; flex-wrap: wrap; gap: var(--s-2); }
  .chip {
    display: inline-block;
    padding: 4px 10px;
    background: color-mix(in oklab, var(--fg) 5%, transparent);
    border: 1px solid var(--border);
    border-radius: var(--r-pill);
    font: 400 var(--fs-small) var(--font-sans);
    color: var(--fg);
  }
</style>
```

- [ ] **Step 2: Wire + commit** as `Add #stack 9-category chip grid`.

### Task 20: `StatusSection` + sticky mobile banner

**Files:** `src/components/sections/StatusSection.astro`, `src/components/molecules/StatusBanner.astro`.

- [ ] **Step 1: `StatusSection.astro`.**

```astro
---
// src/components/sections/StatusSection.astro
import SectionLabel from '@/components/atoms/SectionLabel.astro';
import TodayCard from '@/components/atoms/TodayCard.astro';
import { profile } from '@/data/profile';
import { withBase } from '@/lib/paths';
---
<section id="status">
  <div class="container">
    <SectionLabel n={9} name="availability" />
    <TodayCard eyebrow="● AVAILABLE" title={profile.available} glow={false}>
      <p>{profile.availableLong}</p>
      <p class="current">Currently shipping: <strong>{profile.currentlyShipping.text}</strong> at
        <a href={profile.currentlyShipping.href} target="_blank" rel="noopener noreferrer">{profile.currentlyShipping.at}</a>.</p>
      <Fragment slot="ctas">
        <a class="cta" href={withBase('#contact')}>Get in touch ↓</a>
      </Fragment>
    </TodayCard>
  </div>
</section>

<style>
  #status { padding-block: clamp(var(--s-8), 8vw, var(--s-10)); }
  .current { color: var(--fg-dim); margin-block-start: var(--s-3); }
  .current strong { color: var(--fg); font-weight: 600; }
  .cta {
    display: inline-flex; align-items: center; gap: var(--s-2);
    padding: var(--s-3) var(--s-5);
    background: var(--accent); color: var(--bg);
    border-radius: var(--r-pill);
    font: 600 var(--fs-small) var(--font-sans);
    text-decoration: none;
    min-block-size: 44px;
  }
  .cta:hover { background: color-mix(in oklab, var(--accent) 80%, white); color: var(--bg); }
</style>
```

- [ ] **Step 2: `StatusBanner.astro` — sticky mobile-only banner.**

```astro
---
// src/components/molecules/StatusBanner.astro
import { profile } from '@/data/profile';
import { withBase } from '@/lib/paths';
---
<a class="banner" href={withBase('#contact')}>
  <span class="dot" aria-hidden="true"></span>
  <span>● {profile.available} · tap for contact ↓</span>
</a>

<style>
  .banner {
    position: sticky;
    top: 0; left: 0; right: 0;
    z-index: 50;
    display: flex; align-items: center; justify-content: center; gap: var(--s-3);
    padding: var(--s-2) var(--s-4);
    background: var(--bg-bar);
    color: var(--accent);
    font: 600 var(--fs-small) var(--font-mono);
    border-block-end: 1px solid var(--border-soft);
    text-decoration: none;
    min-block-size: 36px;
  }
  .dot {
    inline-size: 8px; block-size: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
    animation: gleam 2s ease-in-out infinite;
  }
  @keyframes gleam {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @media (prefers-reduced-motion: reduce) { .dot { animation: none; } }
  @media (min-width: 1024px) { .banner { display: none; } }
</style>
```

- [ ] **Step 3: Mount the banner in `BaseLayout.astro`.**

In the `<slot name="banner" />` slot inside `<body>`. Inject via the landing page:

In `src/pages/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import StatusBanner from '@/components/molecules/StatusBanner.astro';
// ...other imports
---
<BaseLayout title={`${profile.name} — ${profile.tagline}`} description="...">
  <StatusBanner slot="banner" />
  <Hero />
  ...
</BaseLayout>
```

Add `<StatusBanner slot="banner" />` to **every page** (`uses`, `now`, project pages, 404) — or, for less repetition, mount it in `BaseLayout` directly (recommended). Update `BaseLayout` instead:

In `src/layouts/BaseLayout.astro` body:

```astro
  <body>
    <a href="#main" class="skip-link">Skip to content</a>
    <StatusBanner />
    <main id="main"><slot /></main>
    <slot name="footer" />
  </body>
```

And add `import StatusBanner from '@/components/molecules/StatusBanner.astro';` to the frontmatter. (Remove the redundant `<StatusBanner slot="banner" />` from `index.astro` if it was added.)

- [ ] **Step 4: Wire + commit** as `Add #status section + sticky mobile-only banner (3rd available-for-work surface)`.

### Task 21: `Contact` section

**Files:** `src/components/sections/Contact.astro`.

- [ ] **Step 1: Create.**

```astro
---
// src/components/sections/Contact.astro
import SectionLabel from '@/components/atoms/SectionLabel.astro';
import { contact } from '@/data/contact';
import { profile } from '@/data/profile';

const formspreeId = import.meta.env.PUBLIC_FORMSPREE_ID;
const formspreeAction = formspreeId ? `https://formspree.io/f/${formspreeId}` : null;
---
<section id="contact">
  <div class="container">
    <SectionLabel n={10} name="contact" />
    <h2 class="head">Reach me — pick a channel.</h2>

    <ul class="channels">
      {contact.map((c) => (
        <li>
          <a href={c.href}
             target={c.href.startsWith('http') ? '_blank' : undefined}
             rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
             class={`channel tone-${c.tone}`}
             data-copy={c.copy ?? null}>
            <span class="glyph" aria-hidden="true">{c.glyph}</span>
            <span class="label">{c.label}</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </li>
      ))}
    </ul>

    {formspreeAction ? (
      <form class="form" action={formspreeAction} method="POST" id="contact-form">
        <p class="form-head">Or write a message:</p>
        <label class="row">
          <span class="k">from:</span>
          <input name="email" type="email" required placeholder="your@email.com" />
        </label>
        <label class="row">
          <span class="k">subject:</span>
          <input name="subject" type="text" required minlength="2" maxlength="120" placeholder="role · contract · advice · saying hi" />
        </label>
        <label class="row">
          <span class="k">body:</span>
          <textarea name="message" required minlength="10" maxlength="4000" placeholder="i'll read every message and reply within ~24h"></textarea>
        </label>
        <input name="_gotcha" type="text" tabindex="-1" hidden autocomplete="off" />
        <button type="submit">▸ send</button>
        <p class="status" role="status" aria-live="polite" hidden></p>
      </form>
    ) : (
      <p class="fallback">
        Or write a direct message: <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <br /><span class="dim">(Contact form is disabled until <code>PUBLIC_FORMSPREE_ID</code> is set.)</span>
      </p>
    )}
  </div>
</section>

<script>
  const form = document.getElementById('contact-form');
  if (form instanceof HTMLFormElement) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector('.status');
      const btn = form.querySelector('button');
      if (!(status instanceof HTMLElement) || !(btn instanceof HTMLButtonElement)) return;
      btn.disabled = true; btn.textContent = '▸ sending…';
      status.hidden = true; status.textContent = '';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          form.style.display = 'none';
          status.hidden = false;
          status.textContent = "✓ sent. I'll reply within ~24h.";
          status.style.color = 'var(--accent)';
        } else {
          status.hidden = false;
          status.textContent = "Couldn't send. Try again or email directly.";
          status.style.color = 'var(--alert)';
          btn.disabled = false; btn.textContent = '▸ send';
        }
      } catch {
        status.hidden = false;
        status.textContent = 'Network error. Try again or email directly.';
        status.style.color = 'var(--alert)';
        btn.disabled = false; btn.textContent = '▸ send';
      }
    });
  }

  /* copy-on-click for the email channel */
  document.querySelectorAll<HTMLAnchorElement>('.channel[data-copy]').forEach((el) => {
    el.addEventListener('click', async (e) => {
      const txt = el.dataset.copy;
      if (!txt) return;
      try {
        e.preventDefault();
        await navigator.clipboard.writeText(txt);
        const orig = el.querySelector('.label')?.textContent ?? 'Email';
        const lbl = el.querySelector('.label');
        if (lbl) {
          lbl.textContent = '✓ copied';
          setTimeout(() => { if (lbl) lbl.textContent = orig; }, 2000);
        }
      } catch {
        /* fall back to native mailto: */
      }
    });
  });
</script>

<style>
  #contact { padding-block: clamp(var(--s-8), 8vw, var(--s-10)); }
  .head { color: var(--fg); font: 700 var(--fs-section) var(--font-sans); margin: 0 0 var(--s-6); }
  .channels {
    list-style: none; padding: 0; margin: 0 0 var(--s-7);
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--s-3);
  }
  @media (min-width: 640px)  { .channels { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 1024px) { .channels { grid-template-columns: 1fr 1fr 1fr; } }
  .channel {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    gap: var(--s-3);
    align-items: center;
    padding: var(--s-4);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--r-pkg);
    color: var(--fg);
    text-decoration: none;
    font: 600 var(--fs-body) var(--font-sans);
    transition: border-color var(--t-base) var(--ease-out);
    min-block-size: 64px;
  }
  .channel:hover, .channel:focus-visible { border-color: var(--accent); color: var(--fg); }
  .glyph {
    inline-size: 40px; block-size: 40px;
    display: grid; place-items: center;
    background: color-mix(in oklab, var(--accent) 12%, transparent);
    color: var(--accent);
    border-radius: var(--r-icon);
    font: 700 var(--fs-small) var(--font-mono);
  }
  .tone-cyan .glyph { background: color-mix(in oklab, var(--cyan) 12%, transparent); color: var(--cyan); }
  .tone-lime .glyph { background: color-mix(in oklab, var(--lime) 12%, transparent); color: var(--lime); }
  .arrow { color: var(--accent); }

  .form {
    display: grid;
    gap: var(--s-3);
    max-inline-size: 500px;
    padding: var(--s-5);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--r-card);
  }
  .form-head { color: var(--fg-dim); margin: 0 0 var(--s-3); font-size: var(--fs-small); }
  .row { display: grid; grid-template-columns: 80px 1fr; gap: var(--s-3); align-items: start; }
  .k { color: var(--accent); font: 400 var(--fs-micro) var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase; padding-block-start: 8px; }
  .form input, .form textarea {
    inline-size: 100%;
    padding: var(--s-3);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--r-pkg);
    color: var(--fg);
    font: 400 var(--fs-body) var(--font-sans);
  }
  .form textarea { min-block-size: 100px; resize: vertical; }
  .form input:focus, .form textarea:focus { outline: 2px solid var(--accent); outline-offset: 2px; border-color: var(--accent); }
  .form button {
    justify-self: start;
    padding: var(--s-3) var(--s-5);
    background: var(--accent);
    color: var(--bg);
    border: 0;
    border-radius: var(--r-pill);
    font: 600 var(--fs-small) var(--font-sans);
    cursor: pointer;
    min-block-size: 44px;
  }
  .form button:hover:not(:disabled) { background: color-mix(in oklab, var(--accent) 80%, white); }
  .form button:disabled { opacity: 0.6; cursor: not-allowed; }
  .status { margin: var(--s-2) 0 0; font: 600 var(--fs-small) var(--font-sans); }

  .fallback {
    padding: var(--s-5);
    background: var(--bg-elev);
    border: 1px dashed var(--border-soft);
    border-radius: var(--r-card);
    color: var(--fg-dim);
    line-height: var(--lh-default);
  }
  .fallback a { color: var(--accent); }
  .fallback .dim { color: var(--fg-dim); font-size: var(--fs-small); }
  .fallback code { background: var(--bg); padding: 2px 6px; border-radius: 4px; font: 400 var(--fs-small) var(--font-mono); color: var(--accent); }

  @media (max-width: 479px) {
    .row { grid-template-columns: 1fr; }
    .channel { grid-template-columns: 40px 1fr; }
    .channel .arrow { grid-column: 2; justify-self: end; }
  }
</style>
```

- [ ] **Step 2: Add Formspree ID to `.env.example`.** (Already done in Task 2 step 6 — verify it's present.)

- [ ] **Step 3: Wire + commit** as `Add #contact section (6 channels + Formspree form with mailto fallback)`.

---

## Phase 5 — Case study deep dives + 404

### Task 22: `CaseStudyLayout` + `[...slug]` route + first MDX (Legend TV)

**Files:** `src/content.config.ts`, `src/layouts/CaseStudyLayout.astro`, `src/pages/projects/[...slug].astro`, `src/content/projects/legend-tv.mdx`.

- [ ] **Step 1: `src/content.config.ts`** (collection schema).

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    stack: z.array(z.string()),
    stats: z.array(z.object({ num: z.string(), unit: z.string().optional(), desc: z.string() })).max(4),
    heroImage: z.string().optional(),
    liveUrl: z.string().url().optional(),
    sourceUrl: z.string().url().optional(),
    order: z.number(),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: `CaseStudyLayout.astro`.**

```astro
---
// src/layouts/CaseStudyLayout.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import StatsRow from '@/components/atoms/StatsRow.astro';
import { withBase } from '@/lib/paths';

interface Props {
  title: string;
  slug: string;
  tagline: string;
  stack: string[];
  stats: { num: string; unit?: string; desc: string }[];
  liveUrl?: string;
  sourceUrl?: string;
}
const { title, slug, tagline, stack, stats, liveUrl, sourceUrl } = Astro.props;
---
<BaseLayout title={`${title} — case study`} description={tagline}>
  <div class="progress" aria-hidden="true"></div>
  <article class="container">
    <p class="crumb">
      <a href={withBase('/')}>~</a> / <a href={withBase('/#projects')}>projects</a> / <span>{slug}</span>
    </p>
    <h1 class="title" style={`view-transition-name: case-title-${slug};`}>{title}</h1>
    <p class="tagline">{tagline}</p>
    <div class="meta">
      <p class="stack">{stack.join(' · ')}</p>
      <div class="ctas">
        {liveUrl && <a class="cta primary" href={liveUrl} target="_blank" rel="noopener noreferrer">▶ Open live ↗</a>}
        {sourceUrl && <a class="cta secondary" href={sourceUrl} target="_blank" rel="noopener noreferrer">Source on GitHub →</a>}
      </div>
    </div>
    <StatsRow stats={stats} compact />
    <div class="prose"><slot /></div>
    <p class="back"><a href={withBase('/#projects')}>← back to projects</a></p>
  </article>
</BaseLayout>

<style>
  .progress {
    position: fixed; inset-block-start: 0; inset-inline: 0;
    block-size: 3px;
    background: var(--accent);
    transform-origin: 0 50%;
    animation: progress linear both;
    animation-timeline: scroll(root block);
    animation-range: 0% 100%;
    animation-duration: 1ms;
    z-index: 100;
  }
  @keyframes progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @media (prefers-reduced-motion: reduce) { .progress { display: none; } }

  .container { padding-block: var(--s-9); max-inline-size: 720px; }

  .crumb { color: var(--fg-dim); font: 400 var(--fs-micro) var(--font-mono); letter-spacing: 0.12em; }
  .crumb a { color: var(--accent); }
  .crumb span { color: var(--fg); }
  .title { color: var(--fg); font: 700 clamp(2rem, 3vw + 0.5rem, 3rem) / var(--lh-tight) var(--font-sans); margin-block: var(--s-3) var(--s-2); }
  .tagline { color: var(--accent); font: 600 var(--fs-body) var(--font-sans); margin: 0 0 var(--s-5); }
  .meta {
    display: flex; flex-direction: column; gap: var(--s-3);
    padding-block: var(--s-4);
    border-block: 1px solid var(--border);
    margin-block-end: var(--s-6);
  }
  .stack { color: var(--fg-dim); margin: 0; font: 400 var(--fs-small) var(--font-mono); }
  .ctas { display: flex; flex-wrap: wrap; gap: var(--s-3); }
  .cta {
    padding: var(--s-2) var(--s-4);
    border-radius: var(--r-pill);
    font: 600 var(--fs-small) var(--font-sans);
    text-decoration: none;
    min-block-size: 36px;
    display: inline-flex; align-items: center;
  }
  .primary { background: var(--accent); color: var(--bg); }
  .secondary { color: var(--accent); border: 1px solid var(--border-soft); }
  .primary:hover { background: color-mix(in oklab, var(--accent) 80%, white); color: var(--bg); }
  .secondary:hover { border-color: var(--accent); color: var(--fg); }

  .prose { font-family: var(--font-sans); font-size: var(--fs-prose); line-height: var(--lh-prose); color: var(--fg-dim); }
  .prose :global(h2) { color: var(--fg); font: 700 var(--fs-section) var(--font-sans); margin: var(--s-7) 0 var(--s-3); }
  .prose :global(h3) { color: var(--fg); font: 700 var(--fs-h3) var(--font-sans); margin: var(--s-6) 0 var(--s-3); }
  .prose :global(p) { margin: 0 0 var(--s-4); }
  .prose :global(ul) { margin: 0 0 var(--s-4); padding-inline-start: var(--s-5); }
  .prose :global(li) { margin-block-end: var(--s-2); }
  .prose :global(strong) { color: var(--fg); font-weight: 600; }
  .prose :global(code) {
    background: var(--bg-elev);
    color: var(--accent);
    padding: 2px 6px;
    border-radius: 4px;
    font: 400 0.9em var(--font-mono);
  }
  .prose :global(iframe) {
    inline-size: 100%;
    aspect-ratio: 16 / 9;
    border: 1px solid var(--border-soft);
    border-radius: var(--r-featured);
    margin-block: var(--s-5);
  }

  .back { margin-block-start: var(--s-8); font: 600 var(--fs-small) var(--font-mono); }
  .back a { color: var(--accent); }
</style>
```

- [ ] **Step 3: `src/pages/projects/[...slug].astro`.**

```astro
---
// src/pages/projects/[...slug].astro
import { getCollection, render, type CollectionEntry } from 'astro:content';
import CaseStudyLayout from '@/layouts/CaseStudyLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

interface Props { entry: CollectionEntry<'projects'>; }
const { entry } = Astro.props;
const { Content } = await render(entry);
const d = entry.data;
---
<CaseStudyLayout
  title={d.title}
  slug={entry.id}
  tagline={d.tagline}
  stack={[...d.stack]}
  stats={[...d.stats]}
  liveUrl={d.liveUrl}
  sourceUrl={d.sourceUrl}
>
  <Content />
</CaseStudyLayout>
```

- [ ] **Step 4: `src/content/projects/legend-tv.mdx`.**

```mdx
---
title: Legend TV
tagline: A streaming platform I built solo — 600K users, #1 in category for 5 months.
stack: [Flutter, Firebase, REST APIs, AdMob]
stats:
  - { num: '600K', unit: '+', desc: 'peak active users' }
  - { num: '$20K', unit: '+', desc: 'year-1 revenue' }
  - { num: '#1', desc: 'PS category · 5 mo' }
  - { num: '3', desc: 'countries · PK · IN · SA' }
order: 1
---

## The bet

Urdu-speaking audiences in Pakistan, India, and Saudi Arabia had access to a flood of foreign streaming content, but very little dubbed in their own language. The bet was simple: ship a streaming experience that prioritised Urdu dubs first, and most users would never need anything else.

## Building solo

The whole stack was Flutter on the client and Firebase on the server. I built the content ingestion pipeline, the player, the recommendation surface, the ad mediation, and the subscription flow myself.

The hardest call was sticking with AdMob mediation early instead of negotiating direct ad deals — it paid off when scale hit and CPM tuning could happen automatically.

## What scale taught me

- Cold-start latency on low-end Androids was the difference between #6 and #1 in category — every `100ms` shaved off the splash mattered.
- Caching *thumbnails*, not just video segments, cut perceived browsing time in half.
- Firebase costs at 600K users teach you fast which reads can be denormalised.
- Ad mediation tuning is its own discipline — the highest-CPM network isn't always the highest-revenue for *your* fill rate.

## The numbers

`600,000+` peak users. `$20,000+` revenue in year one from ad mediation + subscriptions. `#1` in the Play Store entertainment category for 5 consecutive months across Pakistan, India, and Saudi Arabia.

## Retirement

Legend TV is retired — content licensing got prohibitively expensive at scale and the unit economics stopped working. But every architectural lesson from it is alive in the apps I've shipped since: how to design a Flutter app that holds up on low-end hardware, how to instrument for product decisions, how to run a single-person product team.
```

- [ ] **Step 5: Manual verify** `http://localhost:4321/projects/legend-tv` renders with the scroll-progress bar at top.

- [ ] **Step 6: Commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Case study layout + content collection + /projects/legend-tv"
```

### Task 23: Two more case studies — `firebase-admin-sdk` + `chronos`

**Files:** `src/content/projects/firebase-admin-sdk.mdx`, `src/content/projects/chronos.mdx`.

- [ ] **Step 1: `firebase-admin-sdk.mdx`.**

```mdx
---
title: firebase_admin_sdk
tagline: The Dart Firebase Admin SDK adopted into Google's official Firebase publisher.
stack: [Dart, Firestore, FCM, Auth, Cloud Storage]
stats:
  - { num: 'Google', desc: "Dart & Flutter team owners" }
  - { num: 'Author', desc: 'credited as original author' }
  - { num: '#1', desc: 'Firebase Admin in Dart' }
  - { num: 'OSS',   desc: 'maintained for years' }
liveUrl: https://pub.dev/packages/firebase_admin_sdk
order: 2
---

## What I built

A comprehensive Firebase Admin SDK for Dart covering **Firestore, Auth, FCM, Cloud Storage, and Security Rules** — the gaps that the official client SDK can't fill server-side. It started because I needed it for my own apps. It scaled because every other Dart developer needed it too.

## The handover

Google's Dart & Flutter team reached out about taking ownership of the package as the home for their **official Firebase Admin SDK in Dart**. I transferred maintainership — credited as original author — and the package now lives under Google's official Firebase publisher.

## Why it matters

Most "open-source contributions" on portfolios are PRs to other people's repos. This one's different: it's a package I wrote from scratch that Google adopted as their official answer to a real gap. That's a rare signal.

## Where it lives

- [pub.dev/packages/firebase_admin_sdk →](https://pub.dev/packages/firebase_admin_sdk)
- Sister package — direct FCM from Dart without an Admin SDK: [`firebase_cloud_messaging_dart`](https://pub.dev/packages/firebase_cloud_messaging_dart)
```

- [ ] **Step 2: `chronos.mdx`** — embeds the live demo.

```mdx
---
title: Chronos
tagline: A scroll-driven journey through the universe — in pure Flutter Web, 60 fps.
stack: [Flutter 3.44, Provider, CustomPainter, "Single Ticker"]
stats:
  - { num: '30+', desc: 'CustomPainter scenes' }
  - { num: '60', unit: 'fps', desc: 'on a single Ticker' }
  - { num: '9',  desc: 'hand-painted eras' }
  - { num: '0',  desc: 'image assets used' }
liveUrl: https://ottomandeveloper.github.io/andro_meda/
sourceUrl: https://github.com/OttomanDeveloper/andro_meda
order: 3
---

## The brief

A single-page experience tracing the entire history of the cosmos — Big Bang to today — across **nine hand-painted eras** and a final developer reveal. Scroll position is the timeline. Drag, tap, and hover all interact with each scene. Fully responsive across mobile, tablet, and desktop.

## The constraint that shaped the build

**Zero image assets.** Every scene is drawn in pure Dart. No GIFs, no Lottie, no sprite sheets. Just **`CustomPainter`** and math. That meant rendering a stylised galaxy, conic-section comet orbits, math-driven creatures, sun rotations, and supernova explosions from primitives, every frame.

## How it stays at 60 fps

- A **single `Ticker`** drives all 30+ scenes — no per-scene controllers, no animation graph.
- **`EraScope`** gates visibility — only the on-screen era subscribes to per-frame updates. Off-screen scenes are dormant.
- All paints are `Canvas` calls; no widget rebuilds in the inner loop.
- Scroll position is the timeline, not a separate animation. One source of truth.

The result: dozens of animated scenes coexist without dropping a frame on mid-range hardware.

## See it

<iframe src="https://ottomandeveloper.github.io/andro_meda/" title="Chronos live demo" loading="lazy" allow="autoplay"></iframe>

## What I'd do differently

A small set of WebGL primitives for the heaviest scenes (galaxy spirals especially) would offload some compositor cost from the canvas pipeline. Worth a v2 experiment.
```

- [ ] **Step 3: Verify build.**

```bash
npm run build
ls dist/projects/
```

Expected: `firebase-admin-sdk/index.html`, `legend-tv/index.html`, `chronos/index.html`.

- [ ] **Step 4: Commit** as `Add 2 more case studies: firebase-admin-sdk + chronos (with live iframe)`.

### Task 24: Custom `/404` page

**Files:** `src/pages/404.astro`.

- [ ] **Step 1: Create.**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { withBase } from '@/lib/paths';
---
<BaseLayout title="404 — not found" description="That path does not exist.">
  <div class="container">
    <p class="eyebrow">▸ ERROR · 404</p>
    <h1 class="title">That page doesn't exist.</h1>
    <p class="sub">The URL <code>{Astro.url.pathname}</code> couldn't be found.</p>
    <a class="cta" href={withBase('/')}>← Back to home</a>
  </div>
</BaseLayout>

<style>
  .container { padding-block: var(--s-10); }
  .eyebrow {
    color: var(--accent);
    font: 400 var(--fs-micro) var(--font-mono);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    margin: 0 0 var(--s-4);
  }
  .title { color: var(--fg); font: 700 clamp(2rem, 4vw + 0.5rem, 3.5rem) / var(--lh-tight) var(--font-mono); margin: 0 0 var(--s-4); letter-spacing: -0.02em; }
  .sub { color: var(--fg-dim); margin: 0 0 var(--s-7); }
  .sub code { background: var(--bg-elev); padding: 2px 6px; border-radius: 4px; color: var(--accent); font: 400 var(--fs-small) var(--font-mono); }
  .cta {
    padding: var(--s-3) var(--s-5);
    background: var(--accent); color: var(--bg);
    border-radius: var(--r-pill);
    font: 600 var(--fs-small) var(--font-sans);
    text-decoration: none;
    display: inline-block;
    min-block-size: 44px;
  }
  .cta:hover { background: color-mix(in oklab, var(--accent) 80%, white); color: var(--bg); }
</style>
```

- [ ] **Step 2: Commit** as `Add custom 404 in v3 visual language`.

---

## Phase 6 — SEO, OG, CV, robots, deploy

### Task 25: JSON-LD on landing, robots.txt, sitemap, cv.pdf

**Files:** edit `src/pages/index.astro` to inject JSON-LD; add `public/robots.txt`, `public/cv.pdf`.

- [ ] **Step 1: Add JSON-LD `Person` schema to `index.astro` frontmatter + body.**

In the frontmatter:

```ts
const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321';
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  alternateName: profile.alias,
  jobTitle: profile.tagline,
  url: siteUrl,
  image: `${siteUrl}/og/default.png`,
  email: `mailto:${profile.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Islamabad', addressCountry: 'PK' },
  sameAs: [
    'https://github.com/OttomanDeveloper',
    'https://www.linkedin.com/in/ottomancoder/',
    'https://pub.dev/publishers/ottomancoder.com/packages',
    'https://www.youtube.com/@OttomanCoder',
    'https://stackoverflow.com/users/15117215',
  ],
};
```

In the body (inside `<BaseLayout>`, top):

```astro
<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

- [ ] **Step 2: `public/robots.txt`.**

```
User-agent: *
Allow: /

Sitemap: /sitemap-index.xml
```

- [ ] **Step 3: Copy CV PDF.**

```bash
cp "D:/MyProjects/my_resume/Muhammad_Usman_Resume.pdf" "D:/MyProjects/My_Portfolio/portfolio/public/cv.pdf"
ls -lh public/cv.pdf
```

- [ ] **Step 4: Build, verify sitemap generated.**

```bash
npm run build
ls dist/ | grep -i sitemap
```

Expected: `sitemap-index.xml`, `sitemap-0.xml` present.

- [ ] **Step 5: Commit** as `Add JSON-LD Person schema, robots.txt, cv.pdf, sitemap generation`.

### Task 26: Default OG image

**Files:** `public/og/default.png`.

The default OG image is a 1200×630 PNG. For v1, hand-build it as a simple gold-on-black card with the wordmark + Arabic mark + tagline + Google credential. Doable in Figma in 5 min — or use a one-shot Node script with `sharp` to composite text on a background.

Simplest: open any vector tool (Figma free, Inkscape) → 1200×630 → black background `#0d0d12` → "MUHAMMAD USMAN." 100 px JetBrains Mono Bold white → " عُثماني" 60 px gold top-right → "Senior Mobile Engineer · 50+ apps shipped · firebase_admin_sdk adopted by Google" 28 px Inter dim → export PNG to `public/og/default.png`.

If you don't want to leave the terminal, an SVG → PNG composite via sharp will do:

```bash
# scripts/make-og.mjs
node scripts/make-og.mjs
```

Where the script writes a 1200×630 SVG and pipes it through `sharp().png()`. (Not required for v1 ship; you can place a hand-made PNG and move on.)

- [ ] **Step 1: Place `public/og/default.png` (1200 × 630).**

```bash
mkdir -p public/og
# Place your designed PNG here. For a quick placeholder, copy the favicon:
cp public/favicon.svg public/og/default.png 2>/dev/null || true
```

(If `favicon.svg` is copied as-is, browsers will reject it as a PNG. Hand-make a real PNG before deploy.)

- [ ] **Step 2: Commit** as `Add default OG image (placeholder — replace with real 1200x630 PNG before deploy)`.

### Task 27: GitHub Actions workflow for Pages

**Files:** `.github/workflows/deploy-pages.yml`.

- [ ] **Step 1: Create the workflow.**

```yaml
# .github/workflows/deploy-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with: { fetch-depth: 0 }

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install deps
        run: npm ci

      - name: Build (with GH Pages base + site URL)
        env:
          PUBLIC_SITE_URL: ${{ steps.pages.outputs.origin }}
          PUBLIC_BASE_PATH: ${{ steps.pages.outputs.base_path }}
          PUBLIC_FORMSPREE_ID: ${{ secrets.PUBLIC_FORMSPREE_ID }}
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }

      - name: Configure Pages
        id: pages
        uses: actions/configure-pages@v5

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit** as `Add GitHub Actions workflow for GitHub Pages deploy`.

### Task 28: Vercel config (optional)

**Files:** `vercel.json`.

- [ ] **Step 1: Create `vercel.json` to pin framework.**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci"
}
```

- [ ] **Step 2: Commit** as `Pin Vercel framework preset = Astro via vercel.json`.

---

## Phase 7 — QA + ship

### Task 29: Manual responsive QA at 5 viewports

- [ ] **Step 1: Build production preview.**

```bash
npm run build && npm run preview
```

Open the preview URL.

- [ ] **Step 2: For each viewport, walk every page and confirm no horizontal scroll, tap targets ≥44 px, all sections readable:**

- 320 × 568 (iPhone SE)
- 375 × 667 (iPhone 8)
- 414 × 896 (iPhone 11 Pro Max)
- 768 × 1024 (iPad portrait)
- 1024 × 768 (iPad landscape)
- 1280 × 800 (desktop)
- 1440 × 900 (desktop wide)

Pages: `/`, `/projects/legend-tv`, `/projects/firebase-admin-sdk`, `/projects/chronos`, `/404`.

- [ ] **Step 3: Fix any regressions inline + commit.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Responsive QA pass: fix regressions at <viewports>"
```

(Skip the commit if no fixes.)

### Task 30: Lighthouse + a11y pass

- [ ] **Step 1:** Run Chrome DevTools → Lighthouse on `/`, `/projects/legend-tv`, `/projects/chronos`. Mobile + all categories.

- [ ] **Step 2:** Confirm scores meet acceptance criteria (§17 of spec): Perf ≥ 99, A11y 100, Best Practices 100, SEO 100.

- [ ] **Step 3:** Manual a11y walk-through:
  - Tab through every page; focus ring visible everywhere; skip link appears.
  - VoiceOver / NVDA: hero reads as `Muhammad Usman.` heading-level-1.
  - Disable CSS in DevTools: page still readable, ordered top-to-bottom.

- [ ] **Step 4:** Confirm shipped JS budget under spec target.

```bash
ls -lh dist/_astro/*.js 2>/dev/null
for f in dist/_astro/*.js; do gzip -c "$f" | wc -c; done
```

Sum: target **< 5 KB** gzipped.

- [ ] **Step 5: Commit** fixes as `Lighthouse + a11y pass`.

### Task 31: Push branch + open PR

- [ ] **Step 1: Push.**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio push -u origin redesign-v3-app-store-heritage
```

- [ ] **Step 2: Open PR via `gh` (or GitHub UI).**

```bash
gh pr create \
  --title "Rewrite v3: portfolio · App Store × Heritage · static (GH Pages + Vercel)" \
  --body "Implements docs/superpowers/specs/2026-05-16-portfolio-v3-design.md. See plan at docs/superpowers/plans/2026-05-16-portfolio-v3-implementation.md. Lighthouse 99/100/100/100, JS < 5 KB gz, no React, no API. Old code preserved at tags pre-rewrite-v1 (Next.js) and pre-v3-clean (rewrite-v2 brutalist)." \
  --base main --head redesign-v3-app-store-heritage
```

### Task 32: Deploy preview check + DNS cutover

- [ ] **Step 1:** Configure Vercel project: framework `Astro`, env `PUBLIC_SITE_URL` = your Vercel preview URL, `PUBLIC_FORMSPREE_ID` = real ID.

- [ ] **Step 2:** Configure GitHub Pages: enable in repo Settings → Pages → "GitHub Actions" deploy source. Add `PUBLIC_FORMSPREE_ID` as a repo secret.

- [ ] **Step 3:** Wait for both deploys. Walk QA checklist on the live preview URLs.

- [ ] **Step 4:** Send a real test contact submission, confirm receipt at `ottomandeveloper@gmail.com`.

- [ ] **Step 5:** Merge PR + DNS cutover (if you have a custom domain on Vercel; GH Pages serves on `<user>.github.io/<repo>`).

```bash
gh pr merge --squash --delete-branch
```

- [ ] **Step 6:** Tag the release.

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio checkout main
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio pull origin main
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio tag -a v3.0.0 -m "Portfolio v3 — App Store × Heritage"
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio push origin v3.0.0
```

---

## Done

Every spec section is now implemented:

- §4 (direction) → Tasks 4–8 (visual system) + 12–21 (sections)
- §5 (tech stack) → Task 2 (scaffold)
- §6 (IA) → Tasks 12–24 (sections + deep dives + 404)
- §7 (visual system) → Tasks 3–5 (fonts + tokens + global)
- §8 (landing sections) → Tasks 12–21
- §9 (case studies) → Tasks 22–23
- §10 (phone-stack hero) → Task 12
- §11 (responsive) → embedded in every section + Task 29
- §12 (perf + a11y) → Task 30
- §13 (SEO/OG) → Tasks 25–26
- §14 (content sourcing) → Tasks 9–11
- §15 (deployment) → Tasks 27–28 + Task 32
- §17 (acceptance criteria) → Tasks 29–32
