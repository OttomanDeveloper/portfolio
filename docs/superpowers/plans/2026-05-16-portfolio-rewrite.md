# Portfolio Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Next.js + Supabase portfolio with a faster, more distinctive Astro 5 + MDX site in the "brutalist terminal" design direction, deployed as a static build to the same `ottomancoder.com` domain.

**Architecture:** Astro 5 static site, content-as-code (MDX case studies + typed TS data files), minimal React (only ContactForm), no CMS/database. CSS variables drive light/dark theming. Three JS islands total, <8KB gzipped. New code lives on a `rewrite-v2` branch with `main` tagged `pre-rewrite-v1` for rollback.

**Tech Stack:** Astro 5, MDX, React 19 (one island), TypeScript 5, Resend (email), Vitest (tests), self-hosted JetBrains Mono + Inter fonts. Hosted on Vercel.

**Source spec:** [docs/superpowers/specs/2026-05-16-portfolio-rewrite-design.md](../specs/2026-05-16-portfolio-rewrite-design.md) — re-read before each task; this plan implements that spec verbatim.

**Working environment:** Windows 11, PowerShell 7 default. All `git`, `npm`, and `npx` commands work identically. Where a file operation differs by shell, both forms are given.

---

## Phase 0: Branch + scaffold

### Task 1: Tag main and create rewrite-v2 branch

**Files:**
- Modify: nothing yet — pure git operations

- [ ] **Step 1: Verify clean working tree, fetch latest**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio status
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio fetch origin
```

Expected: `nothing to commit, working tree clean`. If dirty, stash or commit first.

- [ ] **Step 2: Tag current main as rollback point**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio tag -a pre-rewrite-v1 -m "Snapshot of Next.js + Supabase portfolio before brutalist terminal rewrite"
```

Verify: `git tag -l pre-rewrite-v1` prints `pre-rewrite-v1`.

- [ ] **Step 3: Create and switch to rewrite-v2 branch**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio checkout -b rewrite-v2
```

Verify: `git branch --show-current` prints `rewrite-v2`.

### Task 2: Delete old Next.js code

**Files:**
- Delete: `app/`, `components/`, `data/`, `hooks/`, `lib/`, `seeds/`, `scripts/`, `deployment_guide/`, `public/`, `package.json`, `package-lock.json`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `tsconfig.json`, `tsconfig.tsbuildinfo`, `eslint.config.mjs`, `proxy.ts`, `README.md`, `check_cols.mjs`, `test-audit.mjs`, `test_upsert.mjs`, `tmp_check_columns.ts`, `.env.example`, `.env.local`
- Keep: `.git/`, `.gitignore`, `docs/`, `.claude/`, `.superpowers/`

- [ ] **Step 1: Delete the old code (PowerShell)**

```powershell
Remove-Item -Recurse -Force app, components, data, hooks, lib, seeds, scripts, deployment_guide, public, .next
Remove-Item -Force package.json, package-lock.json, next.config.ts, next-env.d.ts, postcss.config.mjs, tsconfig.json, tsconfig.tsbuildinfo, eslint.config.mjs, proxy.ts, README.md, check_cols.mjs, test-audit.mjs, test_upsert.mjs, tmp_check_columns.ts -ErrorAction SilentlyContinue
Remove-Item -Force .env.example, .env.local -ErrorAction SilentlyContinue
```

- [ ] **Step 2: Verify only allowed files remain**

```bash
ls -la /d/MyProjects/My_Portfolio/portfolio
```

Expected: only `.git`, `.gitignore`, `.claude`, `.superpowers`, `docs`, and nothing else. If `node_modules` survives, also delete: `Remove-Item -Recurse -Force node_modules`.

- [ ] **Step 3: Commit the clean slate**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Clear Next.js + Supabase portfolio (rewrite-v2 starting point)"
```

### Task 3: Scaffold Astro 5 with MDX + React

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.env.example`, `.gitignore` (extend), `src/env.d.ts`

- [ ] **Step 1: Initialize Astro with the minimal template (non-interactive)**

```bash
npm create astro@latest . -- --template minimal --typescript strict --install no --git no --yes
```

Expected: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `public/favicon.svg` are created.

- [ ] **Step 2: Add integrations and runtime deps**

```bash
npm install astro@^5 @astrojs/mdx @astrojs/react @astrojs/sitemap react@^19 react-dom@^19 zod resend
npm install -D @types/react @types/react-dom vitest @vitest/coverage-v8 happy-dom @testing-library/react @testing-library/user-event @types/node
```

- [ ] **Step 3: Configure `astro.config.mjs`**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ottomancoder.com',
  output: 'static',
  integrations: [
    mdx(),
    react(),
    sitemap(),
  ],
  vite: {
    build: { cssMinify: 'lightningcss' },
  },
});
```

- [ ] **Step 4: Extend `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src", ".astro/types.d.ts"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

- [ ] **Step 5: Create `.env.example`**

```
# Resend API key for /api/contact endpoint
RESEND_API_KEY=re_xxx_replace_me

# Recipient address for contact form submissions
CONTACT_TO_EMAIL=usman@ottomancoder.com

# Public site URL (used for OG, sitemap, JSON-LD)
PUBLIC_SITE_URL=https://ottomancoder.com
```

- [ ] **Step 6: Extend `.gitignore`**

Append (after the existing rules):

```
# astro
dist/
.astro/

# env (real values)
.env
.env.local
.env.production
```

- [ ] **Step 7: Verify scaffold runs**

```bash
npm run dev
```

Expected: dev server starts on `http://localhost:4321` showing the Astro placeholder page. Stop the server with Ctrl+C.

- [ ] **Step 8: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Scaffold Astro 5 + MDX + React + sitemap"
```

---

## Phase 1: Visual foundation

### Task 4: Self-host JetBrains Mono + Inter

**Files:**
- Create: `public/fonts/JetBrainsMono-Regular.woff2`, `public/fonts/JetBrainsMono-SemiBold.woff2`, `public/fonts/Inter-Regular.woff2`, `public/fonts/Inter-SemiBold.woff2`
- Create: `src/styles/fonts.css`

- [ ] **Step 1: Download the four font files**

```bash
mkdir -p /d/MyProjects/My_Portfolio/portfolio/public/fonts
cd /d/MyProjects/My_Portfolio/portfolio/public/fonts

# JetBrains Mono — Latin subset, 400 + 600
curl -L -o JetBrainsMono-Regular.woff2 https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.woff2
curl -L -o JetBrainsMono-SemiBold.woff2 https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-600-normal.woff2

# Inter — Latin subset, 400 + 600
curl -L -o Inter-Regular.woff2 https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2
curl -L -o Inter-SemiBold.woff2 https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.woff2

ls -lh
```

Expected: four `.woff2` files between 15-40KB each.

- [ ] **Step 2: Create `src/styles/fonts.css`**

```css
/* src/styles/fonts.css — self-hosted, latin subset only */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
  size-adjust: 100%;
}

@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/JetBrainsMono-SemiBold.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  size-adjust: 100%;
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/Inter-SemiBold.woff2') format('woff2');
}
```

- [ ] **Step 3: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add public/fonts/ src/styles/fonts.css
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Self-host JetBrains Mono + Inter (400/600, latin)"
```

### Task 5: Design tokens (dark + light)

**Files:**
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Create `src/styles/tokens.css` with both themes**

Use the exact palette from spec §7.2. Dark is default; `[data-theme="light"]` overrides.

```css
/* src/styles/tokens.css — color, spacing, type tokens */

:root,
:root[data-theme='dark'] {
  --bg: #0a0a0a;
  --bg-elev: #111111;
  --bg-bar: #161616;
  --fg: #fafafa;
  --fg-dim: #a3a3a3;
  --accent: #a3e635;
  --key: #fde047;
  --link: #67e8f9;
  --alert: #fca5a5;
  --border: #1f1f1f;
  --border-soft: #262626;

  --shadow-elev: 0 0 0 1px var(--border) inset;
}

:root[data-theme='light'] {
  --bg: #fafaf6;
  --bg-elev: #f1f1ed;
  --bg-bar: #e8e8e2;
  --fg: #0a0a0a;
  --fg-dim: #525252;
  --accent: #3f6212;
  --key: #854d0e;
  --link: #0e7490;
  --alert: #b91c1c;
  --border: #d4d4d0;
  --border-soft: #dcdcd8;
}

/* type */
:root {
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  --font-sans: 'Inter', system-ui, -apple-system, Segoe UI, sans-serif;

  /* fluid hero — clamps between 26 → 38px */
  --fs-hero: clamp(1.625rem, 1rem + 2vw, 2.375rem);
  --fs-h2: 1.375rem;   /* 22px */
  --fs-h3: 1.125rem;   /* 18px */
  --fs-base: 0.9375rem; /* 15px */
  --fs-sm: 0.8125rem;  /* 13px */
  --fs-xs: 0.75rem;    /* 12px */
  --fs-prose: 1rem;    /* 16px — case study body */

  --lh-tight: 1.15;
  --lh-snug: 1.55;
  --lh-default: 1.7;
  --lh-loose: 1.75;
}

/* spacing scale */
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 10px;
  --space-4: 14px;
  --space-5: 18px;
  --space-6: 22px;
  --space-7: 28px;
  --space-8: 36px;
  --space-9: 48px;
  --space-10: 64px;

  --radius: 10px;
  --radius-sm: 4px;

  --container: 880px;
  --prose-measure: 68ch;
}

/* opt-in to motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add src/styles/tokens.css
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add design tokens: palette, type scale, spacing, motion gate"
```

### Task 6: Global CSS — reset + base styles

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
/* src/styles/global.css */
@import './fonts.css';
@import './tokens.css';

/* reset */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html, body { height: 100%; }
body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-mono);
  font-size: var(--fs-base);
  line-height: var(--lh-default);
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  scroll-behavior: smooth;
}
img, svg, video { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; color: inherit; }

a { color: var(--link); text-decoration: none; border-bottom: 1px solid color-mix(in oklab, var(--link) 40%, transparent); padding-bottom: 1px; }
a:hover, a:focus-visible { border-bottom-color: var(--link); }

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 3px;
}

/* skip link */
.skip-link {
  position: absolute; top: -100px; left: 0;
  padding: 8px 14px; background: var(--accent); color: var(--bg);
  z-index: 100; border-radius: 0 0 var(--radius-sm) 0;
}
.skip-link:focus { top: 0; }

/* container */
.container {
  max-width: var(--container);
  margin-inline: auto;
  padding-inline: var(--space-5);
}
@media (min-width: 640px) { .container { padding-inline: var(--space-7); } }

/* selection */
::selection { background: var(--accent); color: var(--bg); }
```

- [ ] **Step 2: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add src/styles/global.css
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add global reset + base styles + skip-link + container"
```

### Task 7: BaseLayout with theme pre-paint script

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

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
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />

    <!-- theme pre-paint: prevents FOUC -->
    <script is:inline>
      (function () {
        try {
          const stored = localStorage.getItem('theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const theme = stored === 'light' || stored === 'dark'
            ? stored
            : (prefersDark ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', theme);
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    </script>

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preload" href="/fonts/JetBrainsMono-Regular.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/JetBrainsMono-SemiBold.woff2" as="font" type="font/woff2" crossorigin />

    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />

    <!-- Open Graph -->
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
    <main id="main"><slot /></main>
  </body>
</html>
```

- [ ] **Step 2: Replace the placeholder home page**

Overwrite `src/pages/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---
<BaseLayout title="Muhammad Usman" description="Senior Mobile App Engineer">
  <div class="container" style="padding-block: 64px">
    <p style="color: var(--accent)">$ scaffold complete — sections coming.</p>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Manual verify**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected:
- Page renders with dark background, lime accent text
- Switch system theme (or DevTools → Rendering → Emulate prefers-color-scheme: light): page flips to light palette without flicker
- View source → `<html data-theme="dark">` or `"light"` present *before* any other content paints

- [ ] **Step 4: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add BaseLayout with theme pre-paint, font preload, OG meta"
```

### Task 8: Atomic terminal components

**Files:**
- Create: `src/components/TerminalFrame.astro`
- Create: `src/components/KvBlock.astro`
- Create: `src/components/StatsRow.astro`
- Create: `src/components/SectionLabel.astro`

- [ ] **Step 1: `TerminalFrame.astro` — the bar + body chrome**

```astro
---
// src/components/TerminalFrame.astro
interface Props { tab?: string; meta?: string; }
const { tab = 'muhammad@ottomancoder ~ %', meta = '' } = Astro.props;
---
<div class="term">
  <div class="term-bar">
    <span class="dot dot-r" aria-hidden="true"></span>
    <span class="dot dot-y" aria-hidden="true"></span>
    <span class="dot dot-g" aria-hidden="true"></span>
    <span class="tab">{tab}</span>
    {meta && <span class="meta">{meta}</span>}
  </div>
  <div class="term-body"><slot /></div>
</div>

<style>
  .term {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .term-bar {
    display: flex; align-items: center; gap: 8px;
    background: var(--bg-bar);
    padding: 11px 16px;
    border-bottom: 1px solid var(--border-soft);
    font-size: var(--fs-xs);
    color: var(--fg-dim);
  }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot-r { background: #f87171; }
  .dot-y { background: #facc15; }
  .dot-g { background: #84cc16; }
  .tab {
    margin-left: var(--space-4);
    padding: 3px 10px;
    background: var(--bg);
    border-radius: var(--radius-sm);
    color: var(--fg);
  }
  .meta { margin-left: auto; }
  .term-body {
    padding: var(--space-5);
    font-size: var(--fs-base);
    line-height: var(--lh-default);
  }
  @media (min-width: 640px) { .term-body { padding: var(--space-7); } }
  @media (min-width: 1024px) { .term-body { padding: var(--space-8); } }
</style>
```

- [ ] **Step 2: `KvBlock.astro` — key/value identity grid**

```astro
---
// src/components/KvBlock.astro
interface Pair { key: string; value: string; valueHtml?: boolean; }
interface Props { pairs: Pair[]; }
const { pairs } = Astro.props;
---
<dl class="kv">
  {pairs.map((p) => (
    <>
      <dt class="k">{p.key}</dt>
      {p.valueHtml
        ? <dd class="v" set:html={p.value} />
        : <dd class="v">{p.value}</dd>}
    </>
  ))}
</dl>

<style>
  .kv {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: var(--space-3) var(--space-5);
    margin: 0;
    font-size: var(--fs-base);
  }
  .k { color: var(--key); margin: 0; }
  .v { color: var(--fg); margin: 0; }
  @media (max-width: 479px) {
    .kv { grid-template-columns: 1fr; gap: var(--space-1); }
    .k { margin-top: var(--space-3); }
  }
</style>
```

- [ ] **Step 3: `StatsRow.astro` — 4-stat headline grid**

```astro
---
// src/components/StatsRow.astro
interface Stat { num: string; unit?: string; desc: string; }
interface Props { label?: string; stats: Stat[]; }
const { label, stats } = Astro.props;
---
<section class="stats">
  {label && <p class="label" aria-hidden="true">▸ {label}</p>}
  <ul class="grid">
    {stats.map((s) => (
      <li>
        <div class="num">{s.num}{s.unit && <span class="unit">{s.unit}</span>}</div>
        <div class="desc">{s.desc}</div>
      </li>
    ))}
  </ul>
</section>

<style>
  .stats { margin-top: var(--space-7); padding-top: var(--space-6); border-top: 1px dashed var(--border-soft); }
  .label { color: var(--fg-dim); font-size: var(--fs-xs); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: var(--space-4); }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
    list-style: none; padding: 0; margin: 0;
  }
  @media (min-width: 640px) { .grid { gap: var(--space-7); } }
  @media (min-width: 1024px) { .grid { grid-template-columns: repeat(4, 1fr); } }
  .num { font-size: 1.875rem; font-weight: 600; line-height: 1; color: var(--fg); }
  .unit { font-size: var(--fs-sm); color: var(--fg-dim); margin-left: 2px; }
  .desc { color: var(--fg); margin-top: var(--space-2); font-size: var(--fs-sm); line-height: 1.5; }
</style>
```

- [ ] **Step 4: `SectionLabel.astro` — `// — #name` marker**

```astro
---
// src/components/SectionLabel.astro
interface Props { n: number; name: string; }
const { n, name } = Astro.props;
---
<p class="label" aria-hidden="true">// {n} — #{name}</p>

<style>
  .label {
    color: var(--fg-dim);
    font-size: var(--fs-xs);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: var(--space-3);
  }
</style>
```

- [ ] **Step 5: Smoke-test atoms on the home page**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import TerminalFrame from '@/components/TerminalFrame.astro';
import KvBlock from '@/components/KvBlock.astro';
import StatsRow from '@/components/StatsRow.astro';
import SectionLabel from '@/components/SectionLabel.astro';
---
<BaseLayout title="atoms smoke" description="dev">
  <div class="container" style="padding-block: 48px; display: grid; gap: 24px;">
    <SectionLabel n={1} name="whoami" />
    <TerminalFrame>
      <KvBlock pairs={[
        { key: 'based', value: 'Islamabad, PK' },
        { key: 'links', value: '<a href="#">github</a> · <a href="#">linkedin</a>', valueHtml: true },
      ]} />
      <StatsRow label="proof of work" stats={[
        { num: '600K', unit: '+', desc: 'peak users' },
        { num: '50', unit: '+', desc: 'apps shipped' },
        { num: '#1', desc: 'category 5 months' },
        { num: '1', unit: ' pkg', desc: 'adopted by Google' },
      ]} />
    </TerminalFrame>
  </div>
</BaseLayout>
```

- [ ] **Step 6: Manual verify**

`npm run dev`. Open `http://localhost:4321`. Expected:
- Terminal frame with traffic-light dots renders cleanly
- kv block: keys yellow, values white, 2-column grid on desktop, single column under 480px (resize)
- Stats: 2×2 grid up to 1023px, 4 across at 1024+
- All text legible, no overflow at 320px width

- [ ] **Step 7: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add atomic terminal components: TerminalFrame, KvBlock, StatsRow, SectionLabel"
```

---

## Phase 2: Data files

### Task 9: Typed data files for landing content

**Files:**
- Create: `src/data/profile.ts`, `src/data/socials.ts`, `src/data/stack.ts`, `src/data/experience.ts`, `src/data/openSource.ts`

- [ ] **Step 1: `src/data/profile.ts`**

```ts
// src/data/profile.ts
export const profile = {
  name: 'Muhammad Usman',
  alias: 'Ottoman Coder',
  tagline: 'Senior Mobile Engineer',
  basedIn: 'Islamabad, PK',
  basedNote: 'remote-friendly worldwide',
  currentlyShipping: {
    text: 'AI fitness app w/ BLE',
    at: 'Nmo AI',
    href: 'https://www.beinmedia.com/',
  },
  stackSummary: 'Flutter · Dart · Gemini · BLE · Firebase · Supabase',
  openTo: ['full-time', 'contract', 'advisory'],
  email: 'usman@ottomancoder.com',
  resumeHref: '/cv.pdf',
  stats: [
    { num: '600K', unit: '+', desc: 'peak users on Legend TV streaming platform' },
    { num: '50',   unit: '+', desc: 'production apps shipped for clients worldwide' },
    { num: '#1',              desc: 'Play Store category for 5 consecutive months' },
    { num: '1',    unit: ' pkg', desc: "adopted & maintained by Google's Dart team" },
  ],
} as const;
```

- [ ] **Step 2: `src/data/socials.ts`**

```ts
// src/data/socials.ts
export const socials = [
  { label: 'github',   href: 'https://github.com/OttomanDeveloper' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/ottomancoder/' },
  { label: 'pub.dev',  href: 'https://pub.dev/publishers/ottomancoder.com/packages' },
  { label: 'youtube',  href: 'https://www.youtube.com/@OttomanCoder' },
  { label: 'cv.pdf',   href: '/cv.pdf' },
] as const;
```

- [ ] **Step 3: `src/data/stack.ts`**

```ts
// src/data/stack.ts
export const stack = [
  { category: 'core',         chips: ['Dart', 'Flutter', 'iOS', 'Android', 'Web', 'Desktop'] },
  { category: 'state-mgmt',   chips: ['BLoC / Cubit', 'GetX', 'Provider'] },
  { category: 'ai',           chips: ['Gemini', 'on-device LLM', 'LLM API integration'] },
  { category: 'backend',      chips: ['Firebase', 'Supabase', 'PostgreSQL', 'MySQL', 'Hive', 'Isar', 'SQLite'] },
  { category: 'integrations', chips: ['BLE (flutter_blue_plus)', 'FCM HTTP v1', 'OpenCart', 'YouTube v3', 'OneSignal', 'AdMob', 'AppLovin'] },
  { category: 'languages',    chips: ['Dart', 'Kotlin (basic)', 'JavaScript', 'PHP', 'SQL'] },
  { category: 'tools',        chips: ['Figma', 'Postman', 'Git/GitHub', 'Bitbucket', 'GCP', 'Play Store'] },
] as const;
```

- [ ] **Step 4: `src/data/experience.ts`**

```ts
// src/data/experience.ts
export const experience = [
  {
    hash: 'a1b2c3d',
    role: 'Flutter Developer',
    where: 'BeInMedia · Nmo AI',
    whereHref: 'https://www.beinmedia.com/',
    date: 'Jul 2024 → present',
    location: 'remote / Cairo',
    body: 'Shipping Nmo AI — AI fitness app for MENA market. BLE sync with health devices. Drove Flutter architecture for cross-functional team.',
  },
  {
    hash: 'e4f5g6h',
    role: 'Senior Mobile Developer',
    where: 'Ottoman Coder · freelance',
    date: 'Nov 2020 → present',
    location: 'Upwork · Fiverr · Malt',
    body: '50+ production apps for international clients across PK, IN, SA, AU, TH. Audited 20+ legacy codebases. Product-led engineering with founders.',
  },
  {
    hash: 'i7j8k9l',
    role: 'Flutter Developer',
    where: 'YouShopper · SD Cold Logistics',
    date: 'Nov 2022 → May 2023',
    location: 'remote',
    body: 'Three Flutter apps for one e-commerce ecosystem. Coin-based monetization, YouTube V3, OneSignal. Zero-downtime backend migration.',
  },
  {
    hash: 'm1n2o3p',
    role: 'Flutter Developer',
    where: 'Fulfil Supply Chain',
    date: 'Sep 2021 → Mar 2023',
    location: 'remote / Bangkok',
    body: 'Cross-border e-commerce rebuild. OpenCart API integration. Firebase Auth/FCM. Measurable startup & transition perf wins.',
  },
] as const;
```

- [ ] **Step 5: `src/data/openSource.ts`**

```ts
// src/data/openSource.ts
export const openSource = [
  {
    name: 'firebase_admin_sdk',
    href: 'https://pub.dev/packages/firebase_admin_sdk',
    desc: 'Comprehensive Firebase Admin SDK for Dart — Firestore, Auth, FCM, Cloud Storage, Security Rules.',
    highlight: "Later officially taken over by the Google Dart & Flutter team.",
    badge: '★ ADOPTED BY GOOGLE',
    featured: true,
    stats: null,
  },
  {
    name: 'firebase_cloud_messaging_dart',
    href: 'https://pub.dev/packages/firebase_cloud_messaging_dart',
    desc: 'Zero-dependency FCM HTTP v1 sender — works in Flutter, Serverpod, CLI, Cloud Run with ADC, structured errors, retries.',
    highlight: null,
    badge: null,
    featured: false,
    stats: { likes: 17, downloads: '371+' },
  },
] as const;
```

- [ ] **Step 6: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add src/data/
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add typed data files: profile, socials, stack, experience, openSource"
```

---

## Phase 3: Landing sections

### Task 10: Hero section

**Files:**
- Create: `src/components/sections/Hero.astro`

- [ ] **Step 1: Create `src/components/sections/Hero.astro`**

```astro
---
// src/components/sections/Hero.astro
import TerminalFrame from '@/components/TerminalFrame.astro';
import KvBlock from '@/components/KvBlock.astro';
import StatsRow from '@/components/StatsRow.astro';
import { profile } from '@/data/profile';
import { socials } from '@/data/socials';

const linksHtml = socials.map((s) => `<a href="${s.href}">${s.label}</a>`).join(' · ');
const currHtml = `<span class="tag">▸ shipping</span>${profile.currentlyShipping.text} at <a href="${profile.currentlyShipping.at_href ?? profile.currentlyShipping.href}">${profile.currentlyShipping.at}</a>`;
const openToHtml = `<span class="alert-tag">●</span>${profile.openTo.join(' · ')}`;

const pairs = [
  { key: 'based',     value: `${profile.basedIn}<span class="dim"> · ${profile.basedNote}</span>`, valueHtml: true },
  { key: 'currently', value: currHtml, valueHtml: true },
  { key: 'stack',     value: profile.stackSummary },
  { key: 'open to',   value: openToHtml, valueHtml: true },
  { key: 'links',     value: linksHtml, valueHtml: true },
];
---
<section id="whoami" aria-labelledby="whoami-name">
  <TerminalFrame meta="utf-8 · readme.md">
    <p class="prompt"><span class="dim">$</span> <span class="accent">cat</span> README.md</p>
    <h1 id="whoami-name" class="wordmark">{profile.name}</h1>
    <p class="tagline"># {profile.alias} · {profile.tagline}</p>
    <KvBlock pairs={pairs} />
    <StatsRow label="proof of work" stats={[...profile.stats]} />
    <p class="prompt next"><span class="dim">$</span> <span class="accent blink">cd ./projects</span></p>
  </TerminalFrame>
</section>

<style>
  .prompt { font-family: var(--font-mono); }
  .next { margin-top: var(--space-7); }
  .dim { color: var(--fg-dim); }
  .accent { color: var(--accent); }
  .wordmark {
    font-family: var(--font-mono);
    font-size: var(--fs-hero);
    font-weight: 600;
    line-height: var(--lh-tight);
    letter-spacing: -0.02em;
    margin: var(--space-5) 0 var(--space-1);
    color: var(--fg);
  }
  .tagline {
    color: var(--accent);
    font-size: var(--fs-base);
    margin-bottom: var(--space-6);
  }
  /* kv inline classes referenced via set:html */
  :global(#whoami .v .tag) {
    display: inline-block; padding: 2px 9px; margin-right: 6px;
    background: color-mix(in oklab, var(--accent) 18%, transparent);
    color: var(--accent); border-radius: var(--radius-sm); font-size: var(--fs-sm);
  }
  :global(#whoami .v .alert-tag) {
    display: inline-block; padding: 2px 9px; margin-right: 6px;
    background: color-mix(in oklab, var(--alert) 18%, transparent);
    color: var(--alert); border-radius: var(--radius-sm); font-size: var(--fs-sm);
  }
  :global(#whoami .v .dim) { color: var(--fg-dim); }
  .blink::after {
    content: '▌'; color: var(--accent); margin-left: 3px;
    animation: blink 1.1s steps(2) infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .blink::after { animation: none; }
  }
</style>
```

- [ ] **Step 2: Fix data shape — add `at_href` field to profile**

Edit `src/data/profile.ts`'s `currentlyShipping` to add an explicit `href` (the Astro template above references both). Replace:

```ts
  currentlyShipping: {
    text: 'AI fitness app w/ BLE',
    at: 'Nmo AI',
    href: 'https://www.beinmedia.com/',
  },
```

(No change needed — the `at_href ?? href` fallback in Hero handles it. Keep as is.)

- [ ] **Step 3: Wire Hero into the home page**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/sections/Hero.astro';
import { profile } from '@/data/profile';
---
<BaseLayout
  title={`${profile.name} — ${profile.tagline}`}
  description={`${profile.alias}. ${profile.tagline}. ${profile.basedIn}.`}
>
  <div class="container" style="padding-block: var(--space-7);">
    <Hero />
  </div>
</BaseLayout>
```

- [ ] **Step 4: Manual verify**

`npm run dev`. Expected:
- Hero terminal frame with wordmark "Muhammad Usman" at ~38px
- Lime tagline below
- 5-row kv block with key/value pairs
- 4 stats grid (4-across at desktop, 2×2 below 1024px, single-column under 480px for kv)
- Blinking `cd ./projects` cursor
- Toggle `prefers-reduced-motion` in DevTools → cursor stops blinking

- [ ] **Step 5: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add #whoami hero section with real profile data + reduced-motion respect"
```

### Task 11: Projects list section

**Files:**
- Create: `src/components/sections/ProjectsList.astro`

- [ ] **Step 1: Create `src/components/sections/ProjectsList.astro`**

This pulls from the Content Collection. Since the collection isn't set up yet, this task includes a placeholder import that Task 13 fills in. For now, we'll inline a typed list and replace in Task 13.

```astro
---
// src/components/sections/ProjectsList.astro
import TerminalFrame from '@/components/TerminalFrame.astro';
import SectionLabel from '@/components/SectionLabel.astro';

// Temporary inline list — replaced by Content Collection import in Task 13
type Row = {
  slug: string;
  name: string;
  featured: boolean;
  current?: boolean;
  desc: string;
  tags: string;
  year: string;
  cta: { label: string; href: string };
};

const projects: Row[] = [
  { slug: 'legend-tv', name: 'legend-tv', featured: true,
    desc: 'Self-built Urdu-dubbed streaming platform. <span class="dim">600K+ users · $20K+ rev · #1 Play Store category for 5 months.</span>',
    tags: 'flutter · firebase · admob · rest', year: '2020–22',
    cta: { label: 'case study →', href: '/projects/legend-tv' } },
  { slug: 'lifelink', name: 'lifelink', featured: true,
    desc: 'Crisis-intervention app with Gemini AI for empathetic mood support &amp; Dart Isolates for passive background tracking.',
    tags: 'flutter · bloc · gemini · firebase · isolates', year: '2023',
    cta: { label: 'case study →', href: '/projects/lifelink' } },
  { slug: 'nmo-ai', name: 'nmo-ai', featured: false, current: true,
    desc: 'AI-powered fitness app for MENA market. BLE sync with scales / heart-rate monitors. On-device + cloud inference.',
    tags: 'flutter · ble · gemini · firebase · ai-personalization', year: '2024–',
    cta: { label: 'case study →', href: '/projects/nmo-ai' } },
  { slug: 'youshopper-suite', name: 'youshopper-suite', featured: false,
    desc: 'Three production apps for one e-commerce ecosystem: Customer, Seller, Delivery. Coin-based monetization, OneSignal, YouTube V3.',
    tags: 'flutter · provider · firebase · youtube-api', year: '2022–23',
    cta: { label: 'case study →', href: '/projects/youshopper-suite' } },
  { slug: 'status-getter', name: 'status-getter', featured: false,
    desc: 'Multi-platform media downloader. 10+ social platforms via custom extraction engine. Dart Isolates for concurrent I/O.',
    tags: 'flutter · bloc · isolates · admob · open-source', year: '2022',
    cta: { label: 'github →', href: 'https://github.com/OttomanDeveloper/status_getter' } },
];
---
<section id="projects" aria-labelledby="projects-h">
  <SectionLabel n={2} name="projects" />
  <TerminalFrame>
    <p class="prompt"><span class="dim">$</span> <span class="accent">ls -la</span> <span class="fg">./projects</span> <span class="dim">--pinned --sort=impact</span></p>
    <h2 id="projects-h" class="sr-only">Featured projects</h2>
    <ul class="rows">
      {projects.map((p) => (
        <li class="row">
          <span class="ico" aria-hidden="true">▸</span>
          <div class="body">
            <p class="nm">
              {p.name}
              {p.featured && <span class="star" aria-label="featured">★</span>}
              {p.current && <span class="dim"> (current)</span>}
            </p>
            <p class="desc" set:html={p.desc} />
            <p class="tags">{p.tags}</p>
          </div>
          <span class="yr">{p.year}</span>
          <a class="cta" href={p.cta.href}>{p.cta.label}</a>
        </li>
      ))}
    </ul>
    <p class="archive"><span class="dim">$</span> <span class="accent">ls</span> ./archive  <span class="dim"># 45+ other apps shipped for clients · ask if curious</span></p>
  </TerminalFrame>
</section>

<style>
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .prompt { font-family: var(--font-mono); margin-bottom: var(--space-4); }
  .dim { color: var(--fg-dim); }
  .accent { color: var(--accent); }
  .fg { color: var(--fg); }
  .rows { list-style: none; padding: 0; margin: 0; }
  .row {
    display: grid;
    grid-template-columns: 18px 1fr 80px 110px;
    column-gap: var(--space-4);
    padding: var(--space-3) 0;
    border-bottom: 1px dashed var(--border-soft);
    align-items: baseline;
  }
  .row:last-child { border-bottom: 0; }
  .ico { color: var(--accent); }
  .nm { color: var(--fg); font-weight: 600; margin: 0; }
  .star { color: var(--key); margin-left: 4px; }
  .desc { color: var(--fg); font-size: var(--fs-sm); margin: 2px 0 0; line-height: 1.55; }
  .tags { color: var(--fg-dim); font-size: var(--fs-xs); margin: 4px 0 0; }
  .yr { color: var(--fg-dim); font-size: var(--fs-sm); text-align: right; }
  .cta { color: var(--link); font-size: var(--fs-sm); text-align: right; border-bottom: 1px solid color-mix(in oklab, var(--link) 40%, transparent); }
  .archive { margin-top: var(--space-4); font-family: var(--font-mono); }

  @media (max-width: 640px) {
    .row { grid-template-columns: 18px 1fr; row-gap: var(--space-1); }
    .yr, .cta { grid-column: 2; text-align: left; }
    .cta { padding-top: var(--space-1); }
  }
  @media (pointer: coarse) {
    .cta { min-height: 44px; display: inline-flex; align-items: center; }
  }
</style>
```

- [ ] **Step 2: Wire into home page**

In `src/pages/index.astro`, add import and render below `<Hero />`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/sections/Hero.astro';
import ProjectsList from '@/components/sections/ProjectsList.astro';
import { profile } from '@/data/profile';
---
<BaseLayout
  title={`${profile.name} — ${profile.tagline}`}
  description={`${profile.alias}. ${profile.tagline}. ${profile.basedIn}.`}
>
  <div class="container" style="display:grid; gap: var(--space-9); padding-block: var(--space-7);">
    <Hero />
    <ProjectsList />
  </div>
</BaseLayout>
```

- [ ] **Step 3: Manual verify**

Reload `http://localhost:4321`. Expected:
- Section label `// 2 — #projects` above the terminal frame
- 5 project rows with featured ★ on legend-tv and lifelink
- "case study →" links visible on right (desktop); stacked on mobile
- "(current)" badge on nmo-ai
- archive line at the bottom

- [ ] **Step 4: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add #projects section (inline data — wired to Content Collection in Task 13)"
```

### Task 12: Open source, Experience, Stack, Contact sections

**Files:**
- Create: `src/components/sections/OpenSourceCards.astro`
- Create: `src/components/sections/ExperienceLog.astro`
- Create: `src/components/sections/StackTree.astro`
- Create: `src/components/sections/ContactSection.astro`

- [ ] **Step 1: `OpenSourceCards.astro`**

```astro
---
import TerminalFrame from '@/components/TerminalFrame.astro';
import SectionLabel from '@/components/SectionLabel.astro';
import { openSource } from '@/data/openSource';
---
<section id="opensource" aria-labelledby="os-h">
  <SectionLabel n={3} name="opensource" />
  <TerminalFrame>
    <p class="prompt"><span class="dim">$</span> <span class="accent">dart pub publisher</span> <span class="fg">ottomancoder.com</span></p>
    <h2 id="os-h" class="sr-only">Published packages</h2>
    <ul class="pkgs">
      {openSource.map((p) => (
        <li class:list={['pkg', p.featured && 'featured']}>
          <div>
            <a class="nm" href={p.href}>{p.name}</a>
            <p class="desc">
              {p.desc}
              {p.highlight && <span class="hl">{' '}{p.highlight}</span>}
            </p>
          </div>
          <div class="meta">
            {p.badge && <span class="badge">{p.badge}</span>}
            {p.stats && (
              <p class="nums">{p.stats.likes} likes<br />{p.stats.downloads} dl</p>
            )}
            <a class="link" href={p.href}>pub.dev →</a>
          </div>
        </li>
      ))}
    </ul>
  </TerminalFrame>
</section>

<style>
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .prompt { font-family: var(--font-mono); margin-bottom: var(--space-4); }
  .dim { color: var(--fg-dim); }
  .accent { color: var(--accent); }
  .fg { color: var(--fg); }
  .pkgs { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--space-3); }
  .pkg {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--space-5);
    padding: var(--space-4) var(--space-5);
    background: var(--bg-elev);
    border: 1px solid var(--border-soft);
    border-radius: var(--radius-sm);
  }
  .pkg.featured {
    border-color: var(--key);
    background: linear-gradient(180deg, color-mix(in oklab, var(--key) 8%, transparent), transparent);
  }
  .nm { color: var(--fg); font-weight: 600; font-size: var(--fs-base); border: 0; }
  .desc { color: var(--fg); font-size: var(--fs-sm); line-height: 1.6; margin: 4px 0 0; }
  .hl { color: var(--fg); font-weight: 600; }
  .meta { text-align: right; }
  .badge { font-size: var(--fs-xs); padding: 3px 8px; border-radius: var(--radius-sm);
    background: color-mix(in oklab, var(--key) 18%, transparent); color: var(--key); display: inline-block; }
  .nums { color: var(--fg-dim); font-size: var(--fs-xs); margin: 8px 0 4px; line-height: 1.4; }
  .link { color: var(--link); font-size: var(--fs-sm); }

  @media (max-width: 640px) {
    .pkg { grid-template-columns: 1fr; }
    .meta { text-align: left; }
  }
</style>
```

- [ ] **Step 2: `ExperienceLog.astro`**

```astro
---
import TerminalFrame from '@/components/TerminalFrame.astro';
import SectionLabel from '@/components/SectionLabel.astro';
import { experience } from '@/data/experience';
---
<section id="experience" aria-labelledby="exp-h">
  <SectionLabel n={4} name="experience" />
  <TerminalFrame>
    <p class="prompt"><span class="dim">$</span> <span class="accent">git log</span> <span class="fg">--all --oneline ./career</span></p>
    <h2 id="exp-h" class="sr-only">Work experience</h2>
    <ol class="entries">
      {experience.map((e) => (
        <li class="entry">
          <p class="hdr">
            <span class="hash">{e.hash}</span>
            <span class="role">{e.role}</span>
            <span class="dim"> @ </span>
            {e.whereHref ? <a class="where" href={e.whereHref}>{e.where}</a> : <span class="where">{e.where}</span>}
            <span class="when">{e.date} · {e.location}</span>
          </p>
          <p class="body">{e.body}</p>
        </li>
      ))}
    </ol>
  </TerminalFrame>
</section>

<style>
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .prompt { font-family: var(--font-mono); margin-bottom: var(--space-4); }
  .dim { color: var(--fg-dim); }
  .accent { color: var(--accent); }
  .fg { color: var(--fg); }
  .entries { list-style: none; padding: 0; margin: 0; }
  .entry { padding: var(--space-3) 0; border-bottom: 1px dashed var(--border-soft); }
  .entry:last-child { border-bottom: 0; }
  .hdr { margin: 0; line-height: 1.6; }
  .hash { color: var(--key); margin-right: 8px; }
  .role { color: var(--fg); font-weight: 600; }
  .where { color: var(--accent); border-bottom-color: color-mix(in oklab, var(--accent) 40%, transparent); }
  .when { color: var(--fg-dim); font-size: var(--fs-xs); margin-left: var(--space-3); display: inline-block; }
  .body { color: var(--fg); font-size: var(--fs-sm); line-height: 1.6; margin: 4px 0 0; max-width: 700px; }
  @media (max-width: 640px) {
    .when { display: block; margin: 4px 0 0; }
  }
</style>
```

- [ ] **Step 3: `StackTree.astro`**

```astro
---
import TerminalFrame from '@/components/TerminalFrame.astro';
import SectionLabel from '@/components/SectionLabel.astro';
import { stack } from '@/data/stack';
---
<section id="stack" aria-labelledby="stack-h">
  <SectionLabel n={5} name="stack" />
  <TerminalFrame>
    <p class="prompt"><span class="dim">$</span> <span class="accent">cat</span> <span class="fg">.tools/manifest.toml</span></p>
    <h2 id="stack-h" class="sr-only">Tech stack</h2>
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
  </TerminalFrame>
</section>

<style>
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .prompt { font-family: var(--font-mono); margin-bottom: var(--space-4); }
  .dim { color: var(--fg-dim); }
  .accent { color: var(--accent); }
  .fg { color: var(--fg); }
  .grid { display: grid; grid-template-columns: 110px 1fr; gap: var(--space-2) var(--space-5); margin: 0; }
  .k { color: var(--key); align-self: baseline; }
  .v { margin: 0; }
  .chip {
    display: inline-block; padding: 1px 8px; margin: 1px 4px 1px 0;
    background: color-mix(in oklab, var(--fg) 6%, transparent);
    border-radius: 3px; font-size: var(--fs-sm);
    color: var(--fg);
  }
  @media (max-width: 479px) {
    .grid { grid-template-columns: 1fr; gap: var(--space-1); }
    .k { margin-top: var(--space-3); }
  }
</style>
```

- [ ] **Step 4: `ContactSection.astro` (static shell; React form added in Task 17)**

```astro
---
import TerminalFrame from '@/components/TerminalFrame.astro';
import SectionLabel from '@/components/SectionLabel.astro';
import ContactForm from '@/components/islands/ContactForm';
import { profile } from '@/data/profile';
---
<section id="contact" aria-labelledby="contact-h">
  <SectionLabel n={6} name="contact" />
  <TerminalFrame>
    <p class="prompt"><span class="dim">$</span> <span class="accent">echo</span> <span class="cyn">"$MSG"</span> | <span class="accent">mail</span> <span class="fg">{profile.email}</span></p>
    <h2 id="contact-h" class="sr-only">Contact</h2>

    <ContactForm client:idle to={profile.email} />

    <p class="alt">
      <span class="dim"># or reach me anywhere:</span><br />
      <span class="key">▸</span> <a href={`mailto:${profile.email}`}>{profile.email}</a>
      &nbsp;<span class="key">▸</span> <a href="https://twitter.com/ottomancoder">@ottomancoder</a>
      (twitter/linkedin/github/youtube)
    </p>
  </TerminalFrame>
</section>

<style>
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .prompt { font-family: var(--font-mono); margin-bottom: var(--space-4); }
  .dim { color: var(--fg-dim); }
  .accent { color: var(--accent); }
  .cyn { color: var(--link); }
  .fg { color: var(--fg); }
  .key { color: var(--key); }
  .alt { margin-top: var(--space-4); line-height: 1.8; }
</style>
```

> Note: `ContactForm` doesn't exist yet — Task 21 creates it. To unblock this task, add a stub now:

```bash
mkdir -p /d/MyProjects/My_Portfolio/portfolio/src/components/islands
```

Create `src/components/islands/ContactForm.tsx`:

```tsx
// src/components/islands/ContactForm.tsx — stub; replaced in Task 17
export default function ContactForm({ to }: { to: string }) {
  return (
    <p style={{ color: 'var(--fg-dim)', fontStyle: 'italic' }}>
      [contact form coming in Task 17 — mail {to}]
    </p>
  );
}
```

- [ ] **Step 5: Add all four sections to home page**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/sections/Hero.astro';
import ProjectsList from '@/components/sections/ProjectsList.astro';
import OpenSourceCards from '@/components/sections/OpenSourceCards.astro';
import ExperienceLog from '@/components/sections/ExperienceLog.astro';
import StackTree from '@/components/sections/StackTree.astro';
import ContactSection from '@/components/sections/ContactSection.astro';
import { profile } from '@/data/profile';
---
<BaseLayout
  title={`${profile.name} — ${profile.tagline}`}
  description={`${profile.alias}. ${profile.tagline}. ${profile.basedIn}.`}
>
  <div class="container" style="display:grid; gap: var(--space-9); padding-block: var(--space-7);">
    <Hero />
    <ProjectsList />
    <OpenSourceCards />
    <ExperienceLog />
    <StackTree />
    <ContactSection />
  </div>
</BaseLayout>
```

- [ ] **Step 6: Manual verify**

`npm run dev`. Scroll through home page. Expected:
- All 6 sections render: #whoami → #projects → #opensource → #experience → #stack → #contact
- firebase_admin_sdk card has yellow border and "ADOPTED BY GOOGLE" badge
- git log entries each have a hash chip, role bold, where in accent, date dim
- Stack categories: keys in yellow, chips wrap on narrow viewports
- Contact: prompt + stub message + plain socials line
- At 320px viewport: no horizontal scroll, everything stacks readably

- [ ] **Step 7: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add #opensource, #experience, #stack, #contact sections + assemble landing"
```

---

## Phase 4: Case studies

### Task 13: Content Collection schema + projects/[slug] page

**Files:**
- Create: `src/content/config.ts`
- Create: `src/layouts/CaseStudyLayout.astro`
- Create: `src/pages/projects/[...slug].astro`
- Modify: `src/components/sections/ProjectsList.astro` (replace inline data with collection import)

- [ ] **Step 1: Define the Content Collection schema**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    tagline: z.string(),
    role: z.string(),
    yearsLabel: z.string(),
    years: z.object({
      start: z.number(),
      end: z.union([z.number(), z.literal('present')]),
    }),
    stack: z.array(z.string()),
    status: z.enum(['live', 'retired', 'in-progress']),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    stats: z.array(z.object({
      num: z.string(),
      unit: z.string().optional(),
      desc: z.string(),
    })).max(4),
    featured: z.boolean().default(false),
    order: z.number(),
    draft: z.boolean().default(false),
    archiveCount: z.number().optional(),
    // optional richer description for the landing #projects row
    // (may include inline HTML like <span class="dim">…</span>)
    listingDesc: z.string().optional(),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Create `src/layouts/CaseStudyLayout.astro`**

```astro
---
// src/layouts/CaseStudyLayout.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import TerminalFrame from '@/components/TerminalFrame.astro';
import KvBlock from '@/components/KvBlock.astro';
import StatsRow from '@/components/StatsRow.astro';

interface Props {
  title: string;
  slug: string;
  tagline: string;
  role: string;
  yearsLabel: string;
  stack: string[];
  status: 'live' | 'retired' | 'in-progress';
  links: { label: string; href: string }[];
  stats: { num: string; unit?: string; desc: string }[];
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
}

const { title, slug, tagline, role, yearsLabel, stack, status, links, stats, prev, next } = Astro.props;

const linksHtml = links.length
  ? links.map((l) => `<a href="${l.href}">${l.label} →</a>`).join(' · ')
  : '<span class="dim">—</span>';

const pairs = [
  { key: 'role',   value: role },
  { key: 'years',  value: yearsLabel },
  { key: 'stack',  value: stack.join(' · ') },
  { key: 'status', value: `<span class="status status-${status}">${status}</span>`, valueHtml: true },
  { key: 'links',  value: linksHtml, valueHtml: true },
];
---
<BaseLayout title={`${title} — case study`} description={tagline.replace(/^#\s*/, '')}>
  <div class="container" style="padding-block: var(--space-7); display: grid; gap: var(--space-8);">
    <TerminalFrame meta={`case-study · ${slug}.mdx`}>
      <p class="crumb">
        <a href="/">~</a> / <a href="/#projects">projects</a> / <span class="here">{slug}</span>
      </p>
      <h1 class="title">{title}</h1>
      <p class="tagline">{tagline}</p>
      <div class="meta-wrap">
        <KvBlock pairs={pairs} />
      </div>
      <StatsRow stats={stats} />
      <article class="prose"><slot /></article>
      <nav class="navfoot" aria-label="More case studies">
        <span class="dim">$</span> <a href="/#projects">← back to projects</a>
        {prev && (<>· <a href={`/projects/${prev.slug}`}>← {prev.title}</a></>)}
        {next && (<>· <a href={`/projects/${next.slug}`}>{next.title} →</a></>)}
      </nav>
    </TerminalFrame>
  </div>
</BaseLayout>

<style>
  .crumb { color: var(--fg-dim); font-size: var(--fs-sm); margin: 0 0 var(--space-5); }
  .here { color: var(--fg); }
  .title { color: var(--fg); font-size: 1.75rem; font-weight: 600; line-height: 1.15; margin: 0 0 var(--space-1); font-family: var(--font-mono); }
  .tagline { color: var(--accent); font-size: var(--fs-base); margin: 0 0 var(--space-5); }
  .meta-wrap { padding: var(--space-4) 0; border-top: 1px dashed var(--border-soft); border-bottom: 1px dashed var(--border-soft); }
  :global(.status) { font-family: var(--font-mono); padding: 1px 8px; border-radius: 3px; font-size: var(--fs-sm); }
  :global(.status-live) { color: var(--accent); background: color-mix(in oklab, var(--accent) 12%, transparent); }
  :global(.status-retired) { color: var(--fg-dim); background: color-mix(in oklab, var(--fg-dim) 12%, transparent); }
  :global(.status-in-progress) { color: var(--link); background: color-mix(in oklab, var(--link) 12%, transparent); }

  .prose {
    font-family: var(--font-sans);
    font-size: var(--fs-prose);
    line-height: var(--lh-loose);
    color: var(--fg);
    max-width: var(--prose-measure);
    margin-top: var(--space-6);
  }
  .prose :global(h2),
  .prose :global(h3) {
    font-family: var(--font-mono);
    color: var(--fg);
    font-weight: 600;
    margin: var(--space-7) 0 var(--space-3);
    line-height: 1.2;
  }
  .prose :global(h2) { font-size: var(--fs-h2); }
  .prose :global(h3) { font-size: var(--fs-h3); }
  .prose :global(h2)::before,
  .prose :global(h3)::before { content: '## '; color: var(--accent); }
  .prose :global(p) { margin: 0 0 var(--space-4); }
  .prose :global(ul), .prose :global(ol) { margin: 0 0 var(--space-4) 0; padding-left: var(--space-5); }
  .prose :global(li) { margin-bottom: var(--space-2); }
  .prose :global(code) {
    background: var(--bg-elev); color: var(--key);
    padding: 1px 6px; border-radius: 3px;
    font-size: 0.9em; font-family: var(--font-mono);
  }
  .prose :global(pre) {
    background: var(--bg-elev); padding: var(--space-4); border-radius: var(--radius-sm);
    overflow-x: auto;
    border: 1px solid var(--border-soft);
  }
  .prose :global(pre code) { background: transparent; padding: 0; }
  .prose :global(blockquote) {
    border-left: 3px solid var(--accent);
    padding-left: var(--space-4);
    margin: var(--space-5) 0;
    color: var(--fg-dim);
  }

  .navfoot { margin-top: var(--space-8); padding-top: var(--space-4); border-top: 1px dashed var(--border-soft); font-family: var(--font-mono); }
  .dim { color: var(--fg-dim); }
</style>
```

- [ ] **Step 3: Dynamic page `src/pages/projects/[...slug].astro`**

```astro
---
// src/pages/projects/[...slug].astro
import { getCollection, type CollectionEntry } from 'astro:content';
import CaseStudyLayout from '@/layouts/CaseStudyLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects', (e) => !e.data.draft);
  const sorted = projects.sort((a, b) => a.data.order - b.data.order);
  return sorted.map((entry, i) => ({
    params: { slug: entry.slug },
    props: {
      entry,
      prev: i > 0 ? { slug: sorted[i - 1].slug, title: sorted[i - 1].data.title } : null,
      next: i < sorted.length - 1 ? { slug: sorted[i + 1].slug, title: sorted[i + 1].data.title } : null,
    },
  }));
}

interface Props {
  entry: CollectionEntry<'projects'>;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

const { entry, prev, next } = Astro.props;
const { Content } = await entry.render();
const d = entry.data;
---
<CaseStudyLayout
  title={d.title}
  slug={d.slug}
  tagline={d.tagline}
  role={d.role}
  yearsLabel={d.yearsLabel}
  stack={d.stack}
  status={d.status}
  links={d.links}
  stats={d.stats}
  prev={prev}
  next={next}
>
  <Content />
</CaseStudyLayout>
```

- [ ] **Step 4: Update `ProjectsList.astro` to read from the collection**

Replace the inline array in `src/components/sections/ProjectsList.astro` with collection-driven rendering. New `---` frontmatter:

```astro
---
import { getCollection } from 'astro:content';
import TerminalFrame from '@/components/TerminalFrame.astro';
import SectionLabel from '@/components/SectionLabel.astro';

const allProjects = await getCollection('projects', (e) => !e.data.draft);
const projects = allProjects.sort((a, b) => a.data.order - b.data.order);
---
```

Replace the `<ul>` body to read from `projects`:

```astro
<ul class="rows">
  {projects.map((p) => {
    const d = p.data;
    const isCurrent = d.status === 'in-progress';
    const yearStart = d.years.start;
    const yearEnd = d.years.end === 'present' ? '' : String(d.years.end).slice(-2);
    const yearLabel = d.years.end === 'present' ? `${String(yearStart).slice(-2)}–` : `${String(yearStart).slice(-2)}–${yearEnd}`;
    const ctaLabel = p.slug === 'status-getter' ? 'github →' : 'case study →';
    const ctaHref  = p.slug === 'status-getter'
      ? (d.links.find((l) => /github/i.test(l.label))?.href ?? `/projects/${p.slug}`)
      : `/projects/${p.slug}`;
    return (
      <li class="row">
        <span class="ico" aria-hidden="true">▸</span>
        <div class="body">
          <p class="nm">
            {p.slug}
            {d.featured && <span class="star" aria-label="featured">★</span>}
            {isCurrent && <span class="dim"> (current)</span>}
          </p>
          <p class="desc" set:html={d.listingDesc ?? d.tagline.replace(/^#\s*/, '')} />
          <p class="tags">{d.stack.join(' · ').toLowerCase()}</p>
        </div>
        <span class="yr">20{yearLabel}</span>
        <a class="cta" href={ctaHref}>{ctaLabel}</a>
      </li>
    );
  })}
</ul>
```

(Keep the existing `<style>` block as-is.)

- [ ] **Step 5: Create the projects content directory**

```bash
mkdir -p /d/MyProjects/My_Portfolio/portfolio/src/content/projects
```

Add a single test MDX to verify the pipeline (full content comes in Tasks 14–18):

`src/content/projects/legend-tv.mdx`:

```mdx
---
title: Legend TV
slug: legend-tv
tagline: '# self-built Urdu-dubbed streaming platform'
role: 'solo founder · designer · engineer'
yearsLabel: '2020 – 2022'
years: { start: 2020, end: 2022 }
stack: [Flutter, Firebase, AdMob, REST APIs]
status: retired
links:
  - { label: play store, href: 'https://play.google.com/store' }
stats:
  - { num: '600K', unit: '+', desc: 'peak active users' }
  - { num: '$20K', unit: '+', desc: 'year-1 revenue' }
  - { num: '#1', desc: 'PS category · 5 mo' }
  - { num: '3', desc: 'countries · PK · IN · SA' }
featured: true
order: 1
---

## the bet

Smoke-test content — Task 14 replaces with the real case study.
```

- [ ] **Step 6: Manual verify**

`npm run dev`. Expected:
- Home page #projects section now shows only `legend-tv` (with placeholder ★) because that's the only MDX file
- Visit `http://localhost:4321/projects/legend-tv`
- Case study renders: terminal frame, breadcrumb `~ / projects / legend-tv`, big title, lime tagline, metadata kv, 4-stat strip, then "the bet" h2 with `##` prefix in lime, then prose
- TypeScript compiles cleanly: `npx astro check`

- [ ] **Step 7: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Wire Content Collection: schema, [slug] page, CaseStudyLayout, ProjectsList from collection"
```

### Task 14: Write legend-tv.mdx case study

**Files:**
- Modify: `src/content/projects/legend-tv.mdx`

- [ ] **Step 1: Replace the placeholder with the full case study**

```mdx
---
title: Legend TV
slug: legend-tv
tagline: '# self-built Urdu-dubbed streaming platform'
role: 'solo founder · designer · engineer'
yearsLabel: '2020 – 2022'
years: { start: 2020, end: 2022 }
stack: [Flutter, Firebase, AdMob, 'REST APIs']
status: retired
links: []
stats:
  - { num: '600K', unit: '+', desc: 'peak active users' }
  - { num: '$20K', unit: '+', desc: 'year-1 revenue' }
  - { num: '#1', desc: 'PS category · 5 mo' }
  - { num: '3', desc: 'countries · PK · IN · SA' }
featured: true
order: 1
listingDesc: 'Self-built Urdu-dubbed streaming platform. <span class="dim">600K+ users · $20K+ rev · #1 Play Store category for 5 months.</span>'
---

## the bet

Urdu-speaking audiences in Pakistan, India, and Saudi Arabia had access to a flood of foreign streaming content, but very little dubbed in their own language. The bet was simple: ship a streaming experience that prioritized Urdu dubs first, and most users would never need anything else.

## building solo

The whole stack was Flutter on the client and Firebase on the server. I built the content ingestion pipeline, the player, the recommendation surface, the ad mediation, and the subscription flow myself. The hardest call was sticking with AdMob mediation early instead of negotiating direct ad deals — it paid off when scale hit and CPM tuning could happen automatically.

## what scale taught me

- Cold-start latency on low-end Androids was the difference between #6 and #1 in category — every `100ms` shaved off the splash mattered.
- Caching *thumbnails*, not just video segments, cut perceived browsing time in half.
- Firebase costs at 600K users teach you very fast which reads can be denormalized.
- Ad mediation tuning is its own discipline — the highest-CPM network isn't always the highest-revenue network for *your* fill rate.

## the numbers

`600,000+` peak users. `$20,000+` revenue in year one from ad mediation + subscriptions. `#1` in the Play Store entertainment category for 5 consecutive months across Pakistan, India, and Saudi Arabia.

## retirement

Legend TV is retired — content licensing got prohibitively expensive at scale and the unit economics stopped working. But every architectural lesson from it is alive in the apps I've shipped since: how to design a Flutter app that holds up on low-end hardware, how to instrument for product decisions, how to run a single-person product team.
```

- [ ] **Step 2: Manual verify**

`http://localhost:4321/projects/legend-tv` — full case study renders, prose in Inter sans at 16px, h2/h3 in mono with `##` prefix, code spans highlighted, italic *emphasis* renders.

- [ ] **Step 3: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add src/content/projects/legend-tv.mdx
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Write legend-tv case study"
```

### Task 15: Write lifelink.mdx case study

**Files:**
- Create: `src/content/projects/lifelink.mdx`

- [ ] **Step 1: Create the file**

```mdx
---
title: LifeLink
slug: lifelink
tagline: '# crisis-intervention app with Gemini AI + passive background tracking'
role: 'lead Flutter engineer'
yearsLabel: '2023'
years: { start: 2023, end: 2023 }
stack: [Flutter, BLoC, Gemini, Firebase, 'Dart Isolates']
status: live
links:
  - { label: play store, href: 'https://play.google.com/store/apps/details?id=com.helper.lifelink' }
stats:
  - { num: '0%', desc: 'measurable battery hit from passive tracking' }
  - { num: '24/7', desc: 'background sleep/stress/movement signals' }
  - { num: '1st', desc: 'Flutter consumer health app shipping Gemini' }
  - { num: 'live', desc: 'on Play Store today' }
featured: true
order: 2
listingDesc: 'Crisis-intervention app with Gemini AI for empathetic mood support &amp; Dart Isolates for passive background tracking.'
---

## the problem

A user in crisis needs support *now* — not three taps later, and not after the app has woken up from cold start. LifeLink had to passively watch for the signals that something was wrong (sleep disruption, sustained stress patterns, unusual stillness) and route the user to the right intervention without ever feeling surveilled.

## passive without parasitic

The hard engineering question was: how do you run continuous background analysis on a phone without destroying battery or warm-pocket trust? The answer was **Dart Isolates**. Sensor reads, signal smoothing, and pattern detection all run off the UI thread, batched into windowed reads, and woken only when a threshold crosses. The user-facing app stays light; the always-on layer never blocks paint.

## empathetic Gemini

When LifeLink does intervene, the conversational layer uses **Google Gemini** for empathetic mood support — one of the earliest Flutter consumer health apps to ship Gemini in a live production context. Prompt engineering for crisis support is its own discipline: every response is bounded, never diagnostic, always routed toward action (call this hotline, message this contact, breathe with me for 60 seconds).

## what I'd do differently

- On-device classification for the simpler trigger patterns would cut cloud cost and improve latency under poor connectivity.
- A "trusted-contact" handoff was scoped out of v1; in retrospect it should have been the v1 hero feature.
```

- [ ] **Step 2: Manual verify**

`http://localhost:4321/projects/lifelink` renders the case study; home page #projects now lists both legend-tv and lifelink, both featured.

- [ ] **Step 3: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add src/content/projects/lifelink.mdx
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Write lifelink case study"
```

### Task 16: Write nmo-ai.mdx case study

**Files:**
- Create: `src/content/projects/nmo-ai.mdx`

- [ ] **Step 1: Create the file**

```mdx
---
title: Nmo AI
slug: nmo-ai
tagline: '# AI-powered fitness + BLE health-device sync for the MENA market'
role: 'Flutter developer · architecture lead'
yearsLabel: '2024 – present'
years: { start: 2024, end: 'present' }
stack: [Flutter, BLE, Gemini, Firebase, 'AI personalization']
status: in-progress
links: []
stats:
  - { num: 'MENA', desc: 'regional launch market' }
  - { num: 'BLE', desc: 'scales + heart-rate monitors sync' }
  - { num: 'AI', desc: 'on-device + cloud personalization' }
  - { num: '2024–', desc: 'ongoing build' }
featured: false
order: 3
listingDesc: 'AI-powered fitness app for MENA market. BLE sync with scales / heart-rate monitors. On-device + cloud inference.'
---

> Some implementation details are intentionally omitted — Nmo AI is unreleased. The shape of what we're building is what matters.

## the build

Nmo AI is an AI-driven fitness and health application targeting users in the MENA region — a market underserved by Western fitness products and with specific cultural, linguistic, and dietary requirements that English-first apps don't meet.

## BLE everywhere

Smart scales, heart rate monitors, and chest straps all talk over Bluetooth Low Energy via the `flutter_blue_plus` plugin. Pairing flows are notoriously bad on mobile fitness apps; we're investing heavily in making the device handshake feel like magic — surface the right device first, retry without prompting, sync silently.

## personalization

Gemini drives the adaptive coaching layer. The interesting design question is *what is sent to the cloud and what stays on device* — sensitive biometric signals are processed locally where possible, with cloud inference reserved for higher-level coaching decisions that benefit from broader context.

## architecture

I'm driving Flutter architecture decisions for a cross-functional international team — code structure, state management patterns (BLoC), build pipeline, and the always-thorny question of how to keep an app this sensor-heavy maintainable as the team grows.
```

> **YAML quoting note:** the schema accepts `z.literal('present')` so `years.end` must be a string literal. The `'present'` quotes above are required; YAML would otherwise parse the unquoted `present` as a different node and the schema validation would fail.

- [ ] **Step 2: Manual verify**

`http://localhost:4321/projects/nmo-ai` renders, status badge shows `in-progress` in cyan, home #projects shows "(current)" tag.

- [ ] **Step 3: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add src/content/projects/nmo-ai.mdx
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Write nmo-ai case study (current work)"
```

### Task 17: Write youshopper-suite.mdx case study

**Files:**
- Create: `src/content/projects/youshopper-suite.mdx`

- [ ] **Step 1: Create the file**

```mdx
---
title: YouShopper Suite
slug: youshopper-suite
tagline: '# three production apps for one multi-vendor e-commerce ecosystem'
role: 'lead Flutter engineer'
yearsLabel: '2022 – 2023'
years: { start: 2022, end: 2023 }
stack: [Flutter, Provider, Firebase, 'YouTube V3', OneSignal]
status: live
links:
  - { label: customer app, href: 'https://play.google.com/store/apps/details?id=com.warehousesheriff.ssPlatform' }
  - { label: seller app, href: 'https://play.google.com/store/apps/details?id=com.warehousesheriff.youshopper.seller' }
stats:
  - { num: '3', desc: 'separate Flutter apps shipped' }
  - { num: '1', desc: 'shared backend (zero-downtime migrated)' }
  - { num: 'YT V3', desc: 'API integration for content channels' }
  - { num: 'live', desc: 'on Play Store today' }
featured: false
order: 4
listingDesc: 'Three production apps for one e-commerce ecosystem: Customer, Seller, Delivery. Coin-based monetization, OneSignal, YouTube V3.'
---

## three apps, one ecosystem

The YouShopper platform serves three distinct audiences — buyers, sellers, and delivery partners — and each needs its own app with its own UX assumptions. I architected and shipped all three as separate Flutter apps that share a backend, code patterns, and design system but ship independently and update on their own cadence.

## the coin economy

A central design feature was a **coin-based monetization system** that lets users earn in-app currency by engaging with content (YouTube V3 integration for video channels) and spend it across the marketplace. OneSignal push notifications close the loop — real-time alerts when coins are earned, orders move state, or sellers respond.

## zero-downtime migration

Halfway through, the seller platform needed a backend migration that absolutely could not interrupt live transactions. Coordinated with backend engineers to ship a dual-write phase, validated traffic on both, then cut over without a service window. Sellers never noticed.

## what shipped

Customer app — browse, cart, checkout, coin balance. Seller app — listings, orders, fulfilment, coin payouts. Delivery app — route, pickup, drop confirmation. All three on Play Store, all three still maintained.
```

- [ ] **Step 2: Manual verify**

`http://localhost:4321/projects/youshopper-suite` renders with two Play Store links.

- [ ] **Step 3: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add src/content/projects/youshopper-suite.mdx
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Write youshopper-suite case study"
```

### Task 18: Write status-getter.mdx case study

**Files:**
- Create: `src/content/projects/status-getter.mdx`

- [ ] **Step 1: Create the file**

```mdx
---
title: Status Getter
slug: status-getter
tagline: '# multi-platform media downloader powered by Dart Isolates'
role: 'solo author · open source'
yearsLabel: '2022'
years: { start: 2022, end: 2022 }
stack: [Flutter, BLoC, 'Dart Isolates', AdMob]
status: live
links:
  - { label: github, href: 'https://github.com/OttomanDeveloper/status_getter' }
stats:
  - { num: '10+', desc: 'social platforms supported' }
  - { num: '4 ★', desc: 'GitHub stars' }
  - { num: '0', desc: 'UI jank under heavy I/O' }
  - { num: 'OSS', desc: 'open source on GitHub' }
featured: false
order: 5
listingDesc: 'Multi-platform media downloader. 10+ social platforms via custom extraction engine. Dart Isolates for concurrent I/O.'
---

## the itch

WhatsApp statuses, Instagram reels, TikTok clips, YouTube shorts — every platform has its own way of restricting downloads. Status Getter scratches that itch by reverse-engineering each platform's media URL pattern and exposing them through one shared download surface.

## the extraction engine

The core is a pluggable **extraction engine** that routes a URL through platform-specific handlers, each responsible for resolving the underlying media asset. Adding a new platform is one file. The engine is the part of the codebase I'm proudest of — well-bounded, no inter-handler coupling, fully tested.

## isolates for I/O

Concurrent downloads under poor connectivity used to make the UI freeze. Moving the I/O loop into a **Dart Isolate** killed the jank entirely — the main thread paints at 60fps no matter how many parallel transfers are running.

## why it's open

Open source on GitHub. The platform handlers are a moving target (sites change their URL schemes constantly) and that's a maintenance burden the community is better at sharing than any one developer.
```

- [ ] **Step 2: Manual verify**

`http://localhost:4321/projects/status-getter` renders. Home #projects row shows `github →` (not `case study →`) because of the slug-specific CTA logic in Task 13.

- [ ] **Step 3: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add src/content/projects/status-getter.mdx
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Write status-getter case study"
```

---

## Phase 5: Side pages

### Task 19: /uses, /now, /404 pages

**Files:**
- Create: `src/pages/uses.astro`, `src/pages/now.astro`, `src/pages/404.astro`

- [ ] **Step 1: `src/pages/uses.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import TerminalFrame from '@/components/TerminalFrame.astro';
---
<BaseLayout title="Uses — Muhammad Usman" description="The hardware and software setup behind Ottoman Coder's daily work.">
  <div class="container" style="padding-block: var(--space-7); display: grid; gap: var(--space-6);">
    <p class="crumb"><a href="/">~</a> / <span class="here">uses</span></p>

    <TerminalFrame meta="setup">
      <p class="prompt"><span class="dim">$</span> <span class="accent">cat</span> <span class="fg">./hardware</span></p>
      <dl class="kv">
        <dt>laptop</dt>   <dd>MacBook Pro 14" <span class="dim">· M-series · 16GB</span></dd>
        <dt>phone</dt>    <dd>iPhone + Pixel <span class="dim">· cross-platform QA</span></dd>
        <dt>display</dt>  <dd>2K external · 27"</dd>
      </dl>
      <p class="prompt" style="margin-top: var(--space-6)"><span class="dim">$</span> <span class="accent">cat</span> <span class="fg">./software</span></p>
      <dl class="kv">
        <dt>editor</dt>   <dd>VS Code <span class="dim">· Cursor for AI</span></dd>
        <dt>terminal</dt> <dd>Warp + zsh</dd>
        <dt>font</dt>     <dd>JetBrains Mono</dd>
        <dt>design</dt>   <dd>Figma</dd>
        <dt>notes</dt>    <dd>Obsidian + Apple Notes</dd>
      </dl>
    </TerminalFrame>
  </div>
</BaseLayout>

<style>
  .crumb { font-family: var(--font-mono); color: var(--fg-dim); font-size: var(--fs-sm); }
  .here { color: var(--fg); }
  .prompt { font-family: var(--font-mono); margin-bottom: var(--space-3); }
  .dim { color: var(--fg-dim); }
  .accent { color: var(--accent); }
  .fg { color: var(--fg); }
  .kv { display: grid; grid-template-columns: 110px 1fr; gap: var(--space-2) var(--space-5); margin: 0; }
  .kv dt { color: var(--key); }
  .kv dd { margin: 0; color: var(--fg); }
  @media (max-width: 479px) {
    .kv { grid-template-columns: 1fr; gap: 0; }
    .kv dt { margin-top: var(--space-3); }
  }
</style>
```

- [ ] **Step 2: `src/pages/now.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import TerminalFrame from '@/components/TerminalFrame.astro';

// HAND-UPDATE THIS DATE ON EACH REFRESH OF THE PAGE'S CONTENT
const lastUpdated = '2026-05-16';
---
<BaseLayout title="Now — Muhammad Usman" description="What I'm shipping this week.">
  <div class="container" style="padding-block: var(--space-7); display: grid; gap: var(--space-6);">
    <p class="crumb"><a href="/">~</a> / <span class="here">now</span></p>

    <TerminalFrame meta="last-updated">
      <p class="meta">▸ last updated: {lastUpdated}</p>
      <p class="prompt"><span class="dim">$</span> <span class="accent">ps -aux</span> <span class="fg">--mine</span></p>
      <ul class="ps">
        <li><span class="fg">▸</span> <span class="link">nmo-ai</span>  <span class="dim"># BLE health-device sync v2</span></li>
        <li><span class="fg">▸</span> <span class="link">gemini-features</span> <span class="dim"># adaptive workout coaching</span></li>
        <li><span class="fg">▸</span> <span class="link">cs degree</span> <span class="dim"># Virtual University of Pakistan</span></li>
        <li><span class="fg">▸</span> <span class="link">open source</span> <span class="dim"># maintaining firebase_cloud_messaging_dart</span></li>
      </ul>
      <p class="foot dim"># inspired by /now from nownownow.com<br />
        # also: i'm open to chat — see <a href="/#contact">#contact</a></p>
    </TerminalFrame>
  </div>
</BaseLayout>

<style>
  .crumb { font-family: var(--font-mono); color: var(--fg-dim); font-size: var(--fs-sm); }
  .here { color: var(--fg); }
  .meta { color: var(--fg-dim); margin-bottom: var(--space-3); }
  .prompt { font-family: var(--font-mono); margin-bottom: var(--space-3); }
  .ps { list-style: none; padding: 0; margin: 0 0 var(--space-5); display: grid; gap: var(--space-1); }
  .dim { color: var(--fg-dim); }
  .accent { color: var(--accent); }
  .link { color: var(--link); }
  .fg { color: var(--fg); }
  .foot { font-family: var(--font-mono); font-size: var(--fs-sm); line-height: 1.7; }
</style>
```

- [ ] **Step 3: `src/pages/404.astro`**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import TerminalFrame from '@/components/TerminalFrame.astro';
---
<BaseLayout title="404 — not found" description="That path does not exist.">
  <div class="container" style="padding-block: var(--space-9);">
    <TerminalFrame meta="error · 404">
      <p class="ln"><span class="dim">$</span> <span class="accent">cd</span> {Astro.url.pathname}</p>
      <p class="err"><span class="alert">zsh: no such file or directory:</span> {Astro.url.pathname}</p>
      <p class="ln" style="margin-top: var(--space-5)"><span class="dim">$</span> <span class="accent">cd</span> <a href="/">/</a></p>
    </TerminalFrame>
  </div>
</BaseLayout>

<style>
  .ln { font-family: var(--font-mono); margin: 0; line-height: 1.8; }
  .err { font-family: var(--font-mono); margin: var(--space-3) 0 0; }
  .dim { color: var(--fg-dim); }
  .accent { color: var(--accent); }
  .alert { color: var(--alert); }
</style>
```

- [ ] **Step 4: Manual verify**

`npm run dev`. Visit:
- `/uses` — hardware + software lists
- `/now` — last-updated, ps -aux entries, foot note
- `/this-does-not-exist` — 404 page with `zsh: no such file or directory` and a return link

- [ ] **Step 5: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add /uses, /now, /404 side pages"
```

---

## Phase 6: Interactive islands

### Task 20: ThemeToggle + copy-email vanilla TS

**Files:**
- Create: `src/components/islands/ThemeToggle.ts`, `src/components/islands/ThemeToggle.astro`
- Create: `src/components/islands/CopyEmail.ts`, `src/components/islands/CopyEmail.astro`
- Modify: `src/layouts/BaseLayout.astro` (mount ThemeToggle in the top right)
- Modify: `src/components/sections/ContactSection.astro` (use CopyEmail)

- [ ] **Step 1: `src/components/islands/ThemeToggle.ts`**

```ts
// src/components/islands/ThemeToggle.ts
type Theme = 'system' | 'light' | 'dark';
const KEY = 'theme';

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

function current(): Theme {
  const stored = localStorage.getItem(KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

function cycle(t: Theme): Theme {
  return t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system';
}

function icon(t: Theme): string {
  return t === 'light' ? '☀' : t === 'dark' ? '☾' : '⌘';
}

export function mountThemeToggle(btn: HTMLButtonElement) {
  let theme = current();
  btn.textContent = icon(theme);
  btn.setAttribute('aria-label', `theme: ${theme} — click to cycle`);
  btn.addEventListener('click', () => {
    theme = cycle(theme);
    if (theme === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
    apply(theme);
    btn.textContent = icon(theme);
    btn.setAttribute('aria-label', `theme: ${theme} — click to cycle`);
  });
  // react to system pref changes while in system mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (current() === 'system') apply('system');
  });
}
```

- [ ] **Step 2: `src/components/islands/ThemeToggle.astro`**

```astro
---
// src/components/islands/ThemeToggle.astro
---
<button id="theme-toggle" type="button" aria-label="theme toggle">⌘</button>

<script>
  import { mountThemeToggle } from './ThemeToggle.ts';
  const el = document.getElementById('theme-toggle');
  if (el instanceof HTMLButtonElement) mountThemeToggle(el);
</script>

<style>
  #theme-toggle {
    position: fixed;
    top: 14px;
    right: 14px;
    z-index: 50;
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--bg-elev);
    color: var(--fg);
    border: 1px solid var(--border);
    font-family: var(--font-mono);
    font-size: 16px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  #theme-toggle:hover { border-color: var(--accent); }
  @media (pointer: coarse) { #theme-toggle { width: 44px; height: 44px; } }
</style>
```

- [ ] **Step 3: `src/components/islands/CopyEmail.ts`**

```ts
// src/components/islands/CopyEmail.ts
export function mountCopyEmail(btn: HTMLButtonElement, email: string) {
  const original = btn.dataset.originalLabel ?? btn.textContent ?? email;
  btn.dataset.originalLabel = original;
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      btn.textContent = '✓ copied';
      btn.setAttribute('aria-label', 'email copied to clipboard');
      setTimeout(() => {
        btn.textContent = original;
        btn.setAttribute('aria-label', `copy ${email} to clipboard`);
      }, 2000);
    } catch (err) {
      window.location.href = `mailto:${email}`;
    }
  });
}
```

- [ ] **Step 4: `src/components/islands/CopyEmail.astro`**

```astro
---
interface Props { email: string; }
const { email } = Astro.props;
---
<button class="copy" data-email={email} type="button">{email}</button>

<script>
  import { mountCopyEmail } from './CopyEmail.ts';
  document.querySelectorAll<HTMLButtonElement>('button.copy[data-email]').forEach((btn) => {
    const email = btn.dataset.email;
    if (email) mountCopyEmail(btn, email);
  });
</script>

<style>
  .copy {
    background: none; border: 0; padding: 0;
    color: var(--link); font: inherit; cursor: pointer;
    border-bottom: 1px solid color-mix(in oklab, var(--link) 40%, transparent);
  }
  .copy:hover { border-bottom-color: var(--link); }
  @media (pointer: coarse) { .copy { min-height: 44px; } }
</style>
```

- [ ] **Step 5: Mount ThemeToggle in BaseLayout**

Edit `src/layouts/BaseLayout.astro`. Add import to the frontmatter:

```ts
import ThemeToggle from '@/components/islands/ThemeToggle.astro';
```

Add the component inside `<body>` before the skip link:

```astro
  <body>
    <ThemeToggle />
    <a href="#main" class="skip-link">Skip to content</a>
    <main id="main"><slot /></main>
  </body>
```

- [ ] **Step 6: Wire CopyEmail into ContactSection**

In `src/components/sections/ContactSection.astro`, replace the plain `<a href="mailto:...">{profile.email}</a>` with:

```astro
import CopyEmail from '@/components/islands/CopyEmail.astro';
// ...in body:
<CopyEmail email={profile.email} />
```

- [ ] **Step 7: Manual verify**

`npm run dev`.
- Theme toggle in top-right cycles `⌘ → ☀ → ☾ → ⌘` on click; theme actually changes; persists across reload
- Click the email button in #contact: text changes to `✓ copied` for 2s
- Open new tab, paste — clipboard has `usman@ottomancoder.com`
- DevTools → disable clipboard permission → click again → falls back to `mailto:`

- [ ] **Step 8: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add ThemeToggle + CopyEmail vanilla TS islands"
```

### Task 21: Contact form React island + API endpoint

**Files:**
- Modify: `src/components/islands/ContactForm.tsx` (replace stub)
- Create: `src/pages/api/contact.ts`
- Create: `src/lib/contact-schema.ts`
- Create: `tests/contact.test.ts`
- Modify: `astro.config.mjs` — add Vercel adapter for the API route
- Modify: `package.json` — add test script

- [ ] **Step 1: Add Vercel adapter (enables /api routes)**

```bash
npm install @astrojs/vercel
```

Update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://ottomancoder.com',
  output: 'static',
  adapter: vercel(),
  integrations: [mdx(), react(), sitemap()],
  vite: { build: { cssMinify: 'lightningcss' } },
});
```

- [ ] **Step 2: Shared schema `src/lib/contact-schema.ts`**

```ts
// src/lib/contact-schema.ts
import { z } from 'zod';

export const ContactSchema = z.object({
  from: z.string().email({ message: 'Please enter a valid email' }),
  about: z.string().min(2).max(120),
  body: z.string().min(10).max(4000),
  // honeypot — must be empty
  website: z.string().max(0, { message: 'spam' }).optional().default(''),
  // submitted-too-fast guard (ms since render)
  startedAt: z.number().int().nonnegative(),
});

export type ContactPayload = z.infer<typeof ContactSchema>;

export const MIN_FILL_MS = 2000;
```

- [ ] **Step 3: API endpoint `src/pages/api/contact.ts`**

```ts
// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { ContactSchema, MIN_FILL_MS } from '@/lib/contact-schema';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), { status: 400 });
  }

  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });
  }
  const { from, about, body, website, startedAt } = parsed.data;
  if (website && website.length > 0) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 }); // silently drop
  }
  if (Date.now() - startedAt < MIN_FILL_MS) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 }); // silently drop
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return new Response(JSON.stringify({ error: 'misconfigured' }), { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: 'ottomancoder.com <noreply@ottomancoder.com>',
    to,
    replyTo: from,
    subject: `[ottomancoder.com] ${about}`,
    text: `From: ${from}\nAbout: ${about}\n\n${body}`,
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
```

- [ ] **Step 4: React form `src/components/islands/ContactForm.tsx`**

```tsx
// src/components/islands/ContactForm.tsx
import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm({ to }: { to: string }) {
  const startedAt = useRef<number>(Date.now());
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { startedAt.current = Date.now(); }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      from: String(fd.get('from') ?? ''),
      about: String(fd.get('about') ?? ''),
      body: String(fd.get('body') ?? ''),
      website: String(fd.get('website') ?? ''),
      startedAt: startedAt.current,
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === 'string' ? data.error : "couldn't send. try again or email me directly.");
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setError("network error. try again or email me directly.");
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="cf" role="status" aria-live="polite">
        <p className="ok">✓ sent. i'll reply within ~24h.</p>
      </div>
    );
  }

  return (
    <form className="cf" onSubmit={onSubmit} noValidate>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
      <label className="ln">
        <span className="k">from:</span>
        <input name="from" type="email" required placeholder="your@email.com" />
      </label>
      <label className="ln">
        <span className="k">about:</span>
        <input name="about" type="text" required minLength={2} maxLength={120}
          placeholder="role · contract · advice · just saying hi" />
      </label>
      <label className="ln">
        <span className="k">body:</span>
        <textarea name="body" required minLength={10} maxLength={4000}
          placeholder={`i'll read every message and reply within ~24h`} />
      </label>
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? '▸ sending…' : '▸ send'}
      </button>
      {error && <p className="err" role="alert">{error}</p>}
      <p className="fallback">
        or email me directly: <a href={`mailto:${to}`}>{to}</a>
      </p>

      <style>{`
        .cf {
          margin-top: 12px; padding: 18px 20px;
          background: var(--bg-elev); border: 1px solid var(--border-soft);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono); font-size: var(--fs-base);
        }
        .ln { display: block; padding: 4px 0; }
        .k { color: var(--key); display: inline-block; min-width: 64px; }
        .cf input, .cf textarea {
          background: var(--bg); border: 1px solid var(--border-soft);
          color: var(--fg); font-family: inherit; font-size: inherit;
          padding: 6px 10px; border-radius: var(--radius-sm);
          width: 100%; max-width: 320px; outline: none;
        }
        .cf textarea { width: 100%; max-width: 480px; min-height: 80px; }
        .cf input:focus, .cf textarea:focus { border-color: var(--accent); }
        .cf button {
          margin-top: 10px; padding: 8px 16px;
          background: var(--accent); color: var(--bg);
          border: 0; border-radius: var(--radius-sm);
          font: inherit; font-weight: 600; cursor: pointer;
          min-height: 44px;
        }
        .cf button:disabled { opacity: 0.6; cursor: progress; }
        .err { color: var(--alert); margin-top: 8px; font-size: var(--fs-sm); }
        .ok { color: var(--accent); margin: 0; }
        .fallback { color: var(--fg-dim); font-size: var(--fs-sm); margin-top: 8px; }
      `}</style>
    </form>
  );
}
```

- [ ] **Step 5: Add test script + vitest config**

`package.json` — add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts`:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: { provider: 'v8' },
  },
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
});
```

- [ ] **Step 6: Write the failing test for the API endpoint**

`tests/contact.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContactSchema, MIN_FILL_MS } from '@/lib/contact-schema';

// We test the schema directly (the route is exercised manually via curl).
describe('ContactSchema', () => {
  const valid = {
    from: 'test@example.com',
    about: 'test',
    body: 'hello world hello',
    website: '',
    startedAt: Date.now() - (MIN_FILL_MS + 100),
  };

  it('accepts a valid payload', () => {
    expect(ContactSchema.parse(valid).from).toBe('test@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => ContactSchema.parse({ ...valid, from: 'not-an-email' })).toThrow();
  });

  it('rejects too-short body', () => {
    expect(() => ContactSchema.parse({ ...valid, body: 'short' })).toThrow();
  });

  it('rejects honeypot fill', () => {
    expect(() => ContactSchema.parse({ ...valid, website: 'http://spam.com' })).toThrow();
  });
});
```

- [ ] **Step 7: Run the test (expect FAIL — schema not yet imported correctly if `@` alias broken)**

```bash
npm test
```

Expected: 4 tests pass. If alias resolution fails, double-check `vitest.config.ts` and `tsconfig.json` paths agree.

- [ ] **Step 8: Manual verify**

`npm run dev`. In #contact section:
- Submit empty form → browser native validation triggers
- Submit too quickly (<2s after page load) → server silently accepts but no email sent
- Fill honeypot via DevTools and submit → server silently drops
- Fill normally with a valid Resend test key in `.env.local` → email arrives at `CONTACT_TO_EMAIL`

For local Resend testing without sending real email, use the Resend "test mode" API key (it accepts requests but doesn't deliver).

- [ ] **Step 9: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add ContactForm React island + /api/contact endpoint (Resend, honeypot, min-fill guard) + schema tests"
```

---

## Phase 7: SEO, OG, sitemap, CV

### Task 22: JSON-LD, sitemap, robots, CV

**Files:**
- Modify: `src/pages/index.astro` (add JSON-LD)
- Create: `public/robots.txt`
- Create: `public/cv.pdf` (compile from LaTeX or copy pre-built)

- [ ] **Step 1: Add JSON-LD Person schema to home page**

In `src/pages/index.astro`, inside `<BaseLayout>`, add at the top:

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  alternateName: profile.alias,
  jobTitle: profile.tagline,
  url: import.meta.env.PUBLIC_SITE_URL,
  image: `${import.meta.env.PUBLIC_SITE_URL}/og/default.png`,
  email: `mailto:${profile.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Islamabad', addressCountry: 'PK' },
  sameAs: [
    'https://github.com/OttomanDeveloper',
    'https://www.linkedin.com/in/ottomancoder/',
    'https://pub.dev/publishers/ottomancoder.com/packages',
    'https://www.youtube.com/@OttomanCoder',
    'https://twitter.com/ottomancoder',
  ],
})} />
```

- [ ] **Step 2: `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://ottomancoder.com/sitemap-index.xml
```

(Sitemap is generated automatically by `@astrojs/sitemap` at build.)

- [ ] **Step 3: Compile CV PDF**

From `d:/MyProjects/my_resume/usman_resume.tex` — compile and copy:

```powershell
# Requires a LaTeX distribution (MiKTeX or TeX Live). If not installed, see fallback.
cd /d/MyProjects/my_resume
pdflatex -interaction=nonstopmode usman_resume.tex
Copy-Item usman_resume.pdf /d/MyProjects/My_Portfolio/portfolio/public/cv.pdf
```

Fallback if pdflatex is unavailable: use the pre-built `Muhammad_Usman_Resume.pdf` already present:

```powershell
Copy-Item /d/MyProjects/my_resume/Muhammad_Usman_Resume.pdf /d/MyProjects/My_Portfolio/portfolio/public/cv.pdf
```

- [ ] **Step 4: Build and verify sitemap**

```bash
npm run build
ls dist/
```

Expected: `dist/sitemap-index.xml` and `dist/sitemap-0.xml` exist; `dist/cv.pdf` exists; index.html contains JSON-LD `<script type="application/ld+json">`.

- [ ] **Step 5: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Add JSON-LD Person schema, robots.txt, cv.pdf, sitemap generation"
```

### Task 23: OG images per case study

**Files:**
- Create: `src/lib/og.ts`
- Create: `src/pages/og/[...slug].png.ts`
- Modify: `src/layouts/CaseStudyLayout.astro` (pass `ogImage` to BaseLayout)
- Create: `public/og/default.png` (one site-wide fallback)

- [ ] **Step 1: Install `satori` + `@resvg/resvg-js`**

```bash
npm install satori @resvg/resvg-js
```

- [ ] **Step 2: OG template helper `src/lib/og.ts`**

```ts
// src/lib/og.ts
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const fontMonoRegular = fs.readFileSync(
  path.resolve('./public/fonts/JetBrainsMono-Regular.woff2')
);
const fontMonoBold = fs.readFileSync(
  path.resolve('./public/fonts/JetBrainsMono-SemiBold.woff2')
);

type Props = { title: string; tagline: string; slug: string };

export async function renderOgPng({ title, tagline, slug }: Props): Promise<Buffer> {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px', height: '630px',
          display: 'flex', flexDirection: 'column',
          background: '#0a0a0a', color: '#fafafa',
          padding: '56px 64px',
          fontFamily: 'JetBrains Mono',
        },
        children: [
          { type: 'div', props: { style: { color: '#a3a3a3', fontSize: 22, marginBottom: 24 }, children: `~ / projects / ${slug}` } },
          { type: 'div', props: { style: { fontSize: 88, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.05 }, children: title } },
          { type: 'div', props: { style: { color: '#a3e635', fontSize: 28, marginTop: 16 }, children: tagline.replace(/^#\s*/, '# ') } },
          { type: 'div', props: { style: { marginTop: 'auto', color: '#a3a3a3', fontSize: 22, display: 'flex', justifyContent: 'space-between' },
            children: [
              { type: 'div', props: { children: 'ottomancoder.com' } },
              { type: 'div', props: { children: 'Muhammad Usman' } },
            ],
          } },
        ],
      },
    },
    {
      width: 1200, height: 630,
      fonts: [
        { name: 'JetBrains Mono', data: fontMonoRegular, weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: fontMonoBold,    weight: 600, style: 'normal' },
      ],
    }
  );
  const png = new Resvg(svg).render().asPng();
  return Buffer.from(png);
}
```

> Note: woff2 isn't directly readable by satori on every platform. If the build fails on the woff2 read, convert to TTF and place at `public/fonts/JetBrainsMono-Regular.ttf` and `JetBrainsMono-SemiBold.ttf`; update `og.ts` paths accordingly. The fontsource CDN also offers TTF files.

- [ ] **Step 3: Dynamic OG route `src/pages/og/[...slug].png.ts`**

```ts
// src/pages/og/[...slug].png.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgPng } from '@/lib/og';

export async function getStaticPaths() {
  const projects = await getCollection('projects', (e) => !e.data.draft);
  return projects.map((entry) => ({
    params: { slug: entry.slug },
    props: { title: entry.data.title, tagline: entry.data.tagline },
  }));
}

export const GET: APIRoute = async ({ params, props }) => {
  const png = await renderOgPng({
    title: props.title,
    tagline: props.tagline,
    slug: String(params.slug),
  });
  return new Response(png, { headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=31536000, immutable' } });
};
```

- [ ] **Step 4: Site-wide default OG**

Build the site once; `dist/og/legend-tv.png` etc. will exist. Generate a one-off "default" by running a small Node script at the repo root, or just hand-create `public/og/default.png` as a 1200×630 PNG using any tool (Figma export). Acceptable v1: copy `dist/og/legend-tv.png` to `public/og/default.png`.

- [ ] **Step 5: Wire `ogImage` into CaseStudyLayout**

In `src/layouts/CaseStudyLayout.astro`, pass an `ogImage` prop to `BaseLayout`:

```astro
<BaseLayout
  title={`${title} — case study`}
  description={tagline.replace(/^#\s*/, '')}
  ogImage={new URL(`/og/${slug}.png`, import.meta.env.PUBLIC_SITE_URL).toString()}
>
```

- [ ] **Step 6: Build & verify**

```bash
npm run build
```

Expected: `dist/og/legend-tv.png` and one PNG per case study exist. Open one — should show terminal-styled OG with breadcrumb, big title, and tagline.

- [ ] **Step 7: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Generate per-case-study OG images at build time via satori"
```

---

## Phase 8: QA, deploy, ship

### Task 24: Responsive QA pass

**Files:**
- No code changes expected if previous tasks were done right; this task captures and fixes regressions.

- [ ] **Step 1: Build production preview**

```bash
npm run build && npm run preview
```

Open the preview URL.

- [ ] **Step 2: Test at each breakpoint**

For each viewport (use DevTools device emulation), walk all pages and confirm:

- **320 × 568 (iPhone SE)** — `/`, `/projects/legend-tv`, `/projects/nmo-ai`, `/uses`, `/now`, `/404`
- **375 × 667 (iPhone 8)** — same set
- **414 × 896 (iPhone 11 Pro Max)** — same set
- **768 × 1024 (iPad portrait)** — same set
- **1024 × 768 (iPad landscape)** — same set
- **1440 × 900 (desktop)** — same set

At each: **no horizontal scroll**, **no overlapping text**, **no clipped CTAs**, **theme toggle stays in top-right** without overlapping content, **tap targets ≥44px** on touch viewports.

- [ ] **Step 3: Fix any regressions inline**

Most likely problem areas:
- ProjectsList row at 320–479: ensure CTA stacks under description without horizontal scroll
- Hero kv values that contain inline `<a>` or `<span>` HTML: ensure they wrap, not overflow
- CaseStudyLayout breadcrumb on long slugs: ensure it wraps

For each fix, add a CSS rule (don't change layout structure) and re-verify.

- [ ] **Step 4: Commit**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Responsive QA pass: fix wrapping at 320–479px on hero kv + projects rows"
```

(If no fixes were needed: skip commit, note this in PR description.)

### Task 25: Lighthouse + accessibility pass

**Files:**
- No code expected; this is a verification gate.

- [ ] **Step 1: Run Lighthouse on production preview**

In Chrome DevTools → Lighthouse → Mobile + all categories. Run on:
- `/` (landing)
- `/projects/legend-tv` (case study)
- `/uses`

- [ ] **Step 2: Acceptance gate (from spec §13)**

For each page:
- **Performance**: ≥98
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

If Performance <98: most common causes are
- Unused fonts: confirm only the four files in `public/fonts/` are loaded.
- Image weight: confirm no PNG > 200KB.
- JS over budget: `dist/_astro/*.js` total gzipped should be <8KB. Inspect with `ls -lh dist/_astro/*.js`.

If Accessibility <100: most common cause is missing `aria-label` on icon-only buttons or insufficient contrast on a hover state. Fix and re-verify.

- [ ] **Step 3: Verify shipped JS budget**

```bash
ls -lh /d/MyProjects/My_Portfolio/portfolio/dist/_astro/ | grep -E '\.js$'
```

Expected: Total of all `.js` files <8KB after gzip. Use `gzip -c file | wc -c` to spot-check.

- [ ] **Step 4: Manual a11y walk-through**

- Tab through the page from start to finish: focus ring always visible, focus order top-to-bottom-left-to-right, skip-link appears at first Tab.
- VoiceOver / NVDA: hero reads as "Muhammad Usman, heading level 1", each section announces its heading, kv blocks read as definition list.
- Disable CSS in DevTools → page is still readable and ordered.

- [ ] **Step 5: Commit any fixes**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio add -A
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio commit -m "Lighthouse + a11y pass: fixes to reach 100/100"
```

### Task 26: Deploy preview + cutover

**Files:**
- No code; deployment workflow.

- [ ] **Step 1: Push rewrite-v2 to origin**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio push -u origin rewrite-v2
```

- [ ] **Step 2: Open PR (manual via GitHub UI or gh CLI)**

```bash
gh pr create --title "Rewrite portfolio: brutalist terminal · Astro 5 · drop Supabase" \
  --body "Implements docs/superpowers/specs/2026-05-16-portfolio-rewrite-design.md. See plan docs/superpowers/plans/2026-05-16-portfolio-rewrite.md. Lighthouse: 100/100/100/100. JS budget: under 8KB gzipped. Old code preserved at tag pre-rewrite-v1." \
  --base main \
  --head rewrite-v2
```

- [ ] **Step 3: Configure Vercel env vars**

In Vercel dashboard → Project → Settings → Environment Variables:

| Name | Value | Environments |
|---|---|---|
| `RESEND_API_KEY` | real key | Production, Preview |
| `CONTACT_TO_EMAIL` | `usman@ottomancoder.com` | Production, Preview |
| `PUBLIC_SITE_URL` | `https://ottomancoder.com` | Production |
| `PUBLIC_SITE_URL` | (preview URL) | Preview |

- [ ] **Step 4: Verify Vercel preview deploy**

Wait for Vercel to build the PR's preview URL. Visit it. Run through the same QA checklist as Task 24/25 on the live URL.

- [ ] **Step 5: Send a real test contact form submission**

From the live preview, submit a contact form to `CONTACT_TO_EMAIL` and confirm receipt.

- [ ] **Step 6: Merge + DNS confirmation**

After user (Muhammad) reviews and approves the live preview:

```bash
gh pr merge --squash --delete-branch
```

Confirm `ottomancoder.com` now serves the new site. If DNS still points elsewhere, update DNS at the registrar to Vercel's records.

- [ ] **Step 7: Final commit / tag**

```bash
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio checkout main
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio pull origin main
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio tag -a v2.0.0 -m "Portfolio rewrite live: brutalist terminal · Astro 5"
git -c safe.directory=D:/MyProjects/My_Portfolio/portfolio -C /d/MyProjects/My_Portfolio/portfolio push origin v2.0.0
```

---

## Done

Every section from the spec is now implemented:

- §4 (design direction) → Tasks 4–8 (visual system) + 10–12 (sections)
- §5 (tech stack) → Tasks 3, 21 (Astro + React + Resend + Vercel)
- §6 (IA) → Tasks 10–13, 19 (all pages)
- §7 (visual system) → Tasks 4–6 (fonts, tokens, global)
- §8 (landing sections) → Tasks 10–12
- §9 (case studies) → Tasks 13–18
- §10 (side pages) → Task 19
- §11 (JS budget) → Tasks 20–21
- §12 (responsive) → embedded in every component, validated in Task 24
- §13 (perf/a11y) → Task 25
- §14 (SEO/OG) → Tasks 22–23
- §15 (content migration) → Tasks 9, 14–18, 22 (cv.pdf)
- §17 (deployment) → Task 26
- §19 (acceptance criteria) → Tasks 24–26
