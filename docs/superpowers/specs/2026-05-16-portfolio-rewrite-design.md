# Portfolio Rewrite — Design Spec

**Date:** 2026-05-16
**Owner:** Muhammad Usman (Ottoman Coder)
**Status:** approved (pending user spec review)
**Domain:** TBD — a new domain to be registered by the user (`ottomancoder.com` is no longer owned). Treated as an `PUBLIC_SITE_URL` env var throughout the build so nothing hardcodes it. (Current site lives under `d:/MyProjects/My_Portfolio/portfolio`.)

---

## 1. Why we're rewriting

The current portfolio (Next.js 16 + Supabase + admin CMS + Framer Motion) is functional but visually generic — indigo/purple gradients, glass-morphism, Inter sans, BentoGrid: the 2024 AI-portfolio template. It hides the user's strongest credibility signals (600K-user streaming platform; a Dart package adopted by Google's official team; 50+ shipped apps) behind a design that says nothing distinctive about him.

We are replacing it with a faster, more distinctive site whose personality matches the user's actual identity: a senior mobile engineer who ships in production. The two non-negotiable user requirements are **readability** for visitors and **responsive design** across most screen sizes — both override any aesthetic flourish.

## 2. Goals

- **Distinctive.** Cannot be mistaken for any other dev portfolio in the first three seconds.
- **Readable.** Body 15px+, line-height ≥1.7 for prose, WCAG AA contrast everywhere.
- **Fast.** Static rendered, ≤8KB JS gzipped on landing, target LCP <0.8s on a throttled 3G profile.
- **Responsive.** No horizontal scroll at any viewport ≥320px wide. Tap targets ≥44×44px on touch.
- **Maintainable by one person.** Content lives in MDX + typed TS data files in the repo; no CMS, no database.

## 3. Non-goals

- No CMS / admin panel.
- No client-side data fetching, no Supabase, no third-party form service.
- No multi-language / i18n (English only).
- No blog. (Case studies are not blog posts; they're project documentation.)
- No comments, no analytics dashboards, no user accounts.
- No Framer Motion. No scroll-jacking. No parallax. No glass-morphism.

## 4. Design direction

**Brutalist Terminal.** Pure black background, JetBrains Mono primary type, terminal-shell metaphor (`$ command` prompts, `~/path` breadcrumbs, kv blocks, `git log`-style timelines). The landing page reads like a polished `README.md` rendered in a terminal. No decorative animation; the only motion is a 1.1s cursor blink that respects `prefers-reduced-motion`.

Rationale: this direction is credible to the engineer audience the user wants to reach (recruiters, founders, fellow devs), authentically reflects his identity as someone who ships code, and avoids the indistinguishable "modern SaaS" aesthetic.

## 5. Tech stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Astro 5** | Static-first, zero JS by default, Content Collections fit MDX case studies perfectly, React islands available for the 2-3 interactive bits. |
| Content | **MDX + typed TS data files** | Case studies in `src/content/projects/*.mdx`. Profile, experience, stack, socials in `src/data/*.ts`. Versioned in git. |
| Styling | **Plain CSS + CSS variables** | No Tailwind (overkill at this scale; the design system is small and stable). `@layer` for cascade discipline. CSS custom properties drive light/dark theming. |
| Interactive islands | **React 19 (sparingly)** | Only `ContactForm.tsx` uses React. `ThemeToggle` and `copy-email` are vanilla TS. |
| Email | **Resend** | Simple HTTPS API, called server-side from an Astro endpoint. No client-side keys. |
| Hosting | **Vercel** (or Cloudflare Pages) | Static + edge function for `/api/contact`. CDN globally. |
| Fonts | **Self-hosted JetBrains Mono + Inter** | WOFF2, Latin subset, `font-display: swap`, preloaded. No Google Fonts request. |
| Analytics | **Optional, none by default** | Decided at deploy time; if added, prefer privacy-friendly Plausible/Umami over GA. |

We are dropping: Next.js, Supabase (`@supabase/ssr`, `@supabase/supabase-js`), `framer-motion`, `react-hook-form`, `react-markdown`, `sonner`, `@radix-ui/react-slot`, `@vercel/speed-insights` (default off), and the entire `/admin` subtree.

## 6. Information architecture

```
<site>/
├── /                  one-page README — top-to-bottom scroll, deep-link anchors
│   ├── #whoami        hero — name, role, identity kv block, "proof of work" stats
│   ├── #projects      ls-style directory listing of 5 featured projects
│   ├── #opensource    pub.dev packages (firebase_admin_sdk featured)
│   ├── #experience    git log timeline of roles
│   ├── #stack         categorized tech chips
│   └── #contact       mail-style form + plain socials
│
├── /projects/[slug]   MDX case study per project
│   ├── legend-tv
│   ├── lifelink
│   ├── nmo-ai
│   ├── youshopper-suite
│   └── status-getter
│
├── /uses              hardware + software setup
├── /now               current focus, "ps -aux --mine" style
├── /cv.pdf            static download (compiled from existing LaTeX resume)
└── /404               terminal-styled "command not found"
```

## 7. Visual system

### 7.1 Typography

| Use | Family | Size | Line-height |
|---|---|---|---|
| All UI chrome (kv blocks, prompts, nav, headings on landing) | JetBrains Mono 400/600 | 13–15px | 1.55–1.7 |
| Hero wordmark | JetBrains Mono 600 | clamp(26px, 4vw, 38px) | 1.1 |
| Section labels (`// — #name`) | JetBrains Mono 400, uppercase | 12px, 0.14em tracking | 1 |
| **Case study prose (MDX `<p>`, `<li>`)** | **Inter 400** | **16px** | **1.75** |
| Case study `<h2>/<h3>` | JetBrains Mono 600 | 18–22px | 1.2 |
| Footnotes / dim text | JetBrains Mono 400 | 13px | 1.65 |

Rationale for the mixed-type rule: monospace reads slower in long-form than a well-tuned sans. Mono stays in "chrome" contexts (where it conveys identity) and prose blocks switch to Inter. This is a hard rule, not a preference.

### 7.2 Color palette

Defined as CSS custom properties on `:root` for dark mode and overridden in `:root[data-theme="light"]`.

| Token | Dark | Light | Use | Min contrast on bg |
|---|---|---|---|---|
| `--bg` | `#0a0a0a` | `#fafaf6` | page background | — |
| `--bg-elev` | `#111111` | `#f1f1ed` | panels, package cards | — |
| `--bg-bar` | `#161616` | `#e8e8e2` | terminal title bar | — |
| `--fg` | `#fafafa` | `#0a0a0a` | primary text | 20.5:1 |
| `--fg-dim` | `#a3a3a3` | `#525252` | secondary text, captions | 7.2:1 / 7.5:1 |
| `--accent` | `#a3e635` | `#3f6212` | shell prompt, ▸ markers, primary CTA | 13.5:1 / 6.8:1 |
| `--key` | `#fde047` | `#854d0e` | kv block keys, gitlog hashes | 15.8:1 / 7.1:1 |
| `--link` | `#67e8f9` | `#0e7490` | hyperlinks | 12.3:1 / 5.2:1 |
| `--alert` | `#fca5a5` | `#b91c1c` | "open to: full-time" tag, errors | 7.4:1 / 5.4:1 |
| `--border` | `#1f1f1f` | `#d4d4d0` | panel borders | — |
| `--border-soft` | `#262626` (dashed) | `#dcdcd8` (dashed) | row dividers | — |

Every text/bg pair listed passes WCAG AA (≥4.5:1) and most pass AAA (≥7:1).

### 7.3 Spacing & layout

- Base spacing unit: 4px. Used values: 4 · 8 · 10 · 14 · 18 · 22 · 28 · 36 · 48 · 64.
- Page max-width: 880px (centered). Prose blocks inside case studies cap at 68ch.
- Terminal panel padding: 28px (mobile 18-22px), 36px (desktop ≥1024).
- Section gap on landing: 32px (mobile) → 48px (desktop).
- Card/panel border-radius: 10px throughout.

### 7.4 Motion

- Cursor blink on the trailing `$ scroll for projects` prompt. CSS `@keyframes blink` 1.1s steps(2).
- Smooth scroll for in-page anchors (CSS `scroll-behavior: smooth`).
- Hover transitions on links/buttons: `transform`/`opacity` only, ≤120ms.
- **All motion gated behind `@media (prefers-reduced-motion: no-preference)`** — by default, anything besides micro-hover is off.

### 7.5 Theme switching

Default to system preference via `prefers-color-scheme`. A small `ThemeToggle` in the top-right of the terminal bar lets the user override; persisted in `localStorage` under key `theme` with values `system | light | dark`. Theme applied via `data-theme` attribute on `<html>` to avoid FOUC (set inline at the top of `<head>` before paint).

## 8. Landing page sections

### 8.1 `#whoami` (hero)

Terminal frame with three traffic-light dots, tab label `muhammad@ottomancoder ~ %`, prompt `$ cat README.md`, then:

- 38px mono wordmark: **Muhammad Usman**
- Tag line in `--accent`: `# Ottoman Coder · Senior Mobile Engineer`
- Identity kv block — keys: `based`, `currently`, `stack`, `open to`, `links`
- Divider, then `▸ proof of work` label and a 4-stat grid:
  - `600K+` — peak users on Legend TV streaming platform
  - `50+` — production apps shipped for clients worldwide
  - `#1` — Play Store category for 5 consecutive months
  - `1 pkg` — adopted & maintained by Google's Dart team
- Cursor-blink prompt `$ cd ./projects`

### 8.2 `#projects`

`$ ls -la ./projects --pinned --sort=impact` heading, then a dashed-divider list of 5 project rows. Each row: `▸` icon · name (★ for featured) · meta description with key metric · tech tags · year · `case study →` link.

Featured 5: legend-tv ★ · lifelink ★ · nmo-ai · youshopper-suite · status-getter.

Closing line: `$ ls ./archive   # 45+ other apps shipped for clients · ask if curious`.

### 8.3 `#opensource`

`$ dart pub publisher ottomancoder.com` heading, then two package cards:

- **firebase_admin_sdk** — gold-bordered featured card with `★ ADOPTED BY GOOGLE` badge.
- **firebase_cloud_messaging_dart** — standard card with likes / downloads stats.

### 8.4 `#experience`

`$ git log --all --oneline ./career` heading, then `git log`-style entries. Each entry's first line: yellow hash chip · bold role · `@` · accent company name · dim date+location. Body: 1–2 sentence summary.

Roles, reverse-chronological: BeInMedia / Nmo AI (Jul 2024–present) · Ottoman Coder freelance (Nov 2020–present) · YouShopper / SD Cold Logistics (Nov 2022–May 2023) · Fulfil Supply Chain (Sep 2021–Mar 2023).

### 8.5 `#stack`

`$ cat .tools/manifest.toml` heading, then a categorized 2-column key/value grid: `core` · `state-mgmt` · `ai` · `backend` · `integrations` · `languages` · `tools`. Each value is a wrap-friendly row of pill chips.

### 8.6 `#contact`

`$ echo "$MSG" | mail ottomandeveloper@gmail.com` heading. Form panel with three labeled inputs (`from:`, `about:`, `body:`) and a `▸ send` button. Plain socials line below: email link + `@ottomancoder` at twitter/linkedin/github/youtube.

## 9. Case study template (`/projects/[slug]`)

Layout, top to bottom:

1. Terminal frame with breadcrumb `~ / projects / [slug]`.
2. Big mono title (28px).
3. Single-line accent tag: `# <one-line description>`.
4. Metadata kv block — `role`, `years`, `stack`, `status`, `links` (Play Store, demo, repo as applicable).
5. 4-stat headline strip — project-specific numbers.
6. **MDX prose** (Inter sans, 16px, line-height 1.75, max 68ch). Authored as conventional Markdown headings (`##`, `###`), styled with mono `##` prefix in the rendered output.
7. Optional embedded gallery component (`<Screenshots />`) — lazy-loaded `<img>`s in a flex row, no carousel JS.
8. Footer: `$ cd ..` · "back to projects" link · "next: [slug] →" link if applicable.

MDX frontmatter contract (validated by Astro Content Collections `defineCollection` schema in `src/content/config.ts`):

```ts
{
  title: string,
  slug: string,
  tagline: string,           // "# self-built Urdu-dubbed streaming platform"
  role: string,
  yearsLabel: string,        // "2020 – 2022"
  years: { start: number, end: number | "present" },
  stack: string[],
  status: "live" | "retired" | "in-progress",
  links: { label: string, href: string }[],
  stats: { num: string, unit?: string, desc: string }[],   // max 4
  featured: boolean,
  order: number,
  draft?: boolean,
}
```

Five MDX files at launch: `legend-tv.mdx` · `lifelink.mdx` · `nmo-ai.mdx` · `youshopper-suite.mdx` · `status-getter.mdx`. Content drawn from the existing LaTeX resume and `usman_profile_research.md` in `d:/MyProjects/my_resume/`.

## 10. Side pages

### `/uses`
Terminal-list layout. Two sub-sections: `./hardware` (laptop, phone, display) and `./software` (editor, terminal, font, design, notes). User confirms specific values before launch; placeholders in this spec are illustrative.

### `/now`
Tiny page styled as `$ ps -aux --mine` output — 4–6 bullet lines of current focus, each as a single line `▸ keyword # description`. Includes a `last updated: YYYY-MM-DD` line that the user updates by hand on each refresh (no automation). Inspired by the `/now` page convention at nownownow.com.

## 11. Interactive components (JS budget)

Only three islands ship JavaScript to the browser. Estimated total: **<8KB gzipped**.

| Component | File | Tech | Behavior |
|---|---|---|---|
| Contact form | `src/components/islands/ContactForm.tsx` | React 19 | Controlled form, client-side validation (email format + non-empty body), submits POST `/api/contact`, optimistic UI (`▸ sending…`), success/error states accessible to screen readers. |
| Theme toggle | `src/components/islands/ThemeToggle.ts` | Vanilla TS, mounted via `<script>` | Cycles `system → light → dark`, writes `localStorage.theme`, updates `<html data-theme>`. ~600 bytes minified. |
| Copy email | `src/components/islands/copy-email.ts` | Vanilla TS | Click-to-copy `ottomandeveloper@gmail.com` to clipboard, swaps button label to `✓ copied` for 2s. ~400 bytes minified. |

Server-side: `src/pages/api/contact.ts` validates payload with Zod, sends via Resend, returns 200/400/500. Spam mitigation: honeypot field + minimum-fill-time (>2s) — no rate limiting at v1 (portfolio scale; revisit only if abuse appears).

Pure-CSS behaviors (no JS): smooth scroll, hover transitions, cursor blink, light/dark theming (driven by `data-theme` attribute set inline pre-paint), responsive grid layouts.

## 12. Responsive plan

Explicit breakpoints, applied via `@media (min-width: …)`:

| Viewport | Hero stats | Project rows | kv blocks | Terminal padding |
|---|---|---|---|---|
| ≥1024 | 4-col | 4-col grid | 2-col | 32–36px |
| ≥640 | 2×2 | 4-col, tighter | 2-col | 26–28px |
| ≥480 | 2×2 | title + meta stack | 2-col, smaller | 22–24px |
| <480 | 1×4 stacked | fully stacked | 1-col | 18–20px |

Additional rules:
- Hero wordmark: `clamp(26px, 4vw, 38px)`.
- Case study prose: **16px at every viewport** (never shrinks below readable).
- Stack chips: `flex-wrap: wrap` with consistent 6px gap.
- Tap targets: every link, chip, button has min 44×44px hit area on touch viewports (`@media (pointer: coarse)`).
- No horizontal scroll at any viewport ≥320px. Tested by hand at 320 · 375 · 414 · 768 · 1024 · 1440 widths.
- Hero `kv` grid: `grid-template-columns: 110px 1fr` → single-column under 480px.

## 13. Performance & accessibility targets

| Metric | Target |
|---|---|
| LCP (3G Slow throttle, mobile) | <0.8s |
| Total JS shipped (landing) | <8KB gzipped |
| Total CSS shipped | <12KB gzipped |
| Initial HTML payload (gzipped) | <14KB |
| Lighthouse Performance | ≥98 mobile, 100 desktop |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |
| WCAG conformance | AA minimum; AAA where achievable without compromising design |
| Cumulative Layout Shift | 0 (fonts preloaded + sized with `size-adjust`) |

Accessibility implementation notes:
- Skip-to-content link visible on focus.
- All decorative ASCII / `▸` markers wrapped in `aria-hidden`.
- Form inputs have `<label>` (visually rendered as part of the mono kv style).
- Focus-visible outlines on all interactive elements, never `outline: none`.
- Color is never the sole indicator of state.
- `<html lang="en">` set.

## 14. SEO & social

- Per-page `<title>` and `<meta name="description">` (Astro `<SEO>` component or inline).
- JSON-LD `Person` schema on the landing page (carried over from current site, simplified).
- Static `robots.txt` and Astro-generated `sitemap.xml`.
- Open Graph + Twitter Card meta on landing and every case study.
- Static Open Graph image per case study, generated at build time from each project's title and tagline (implementation choice — `satori`, Astro's image API, or a hand-templated SVG-to-PNG step — left to the plan); single site-wide OG as fallback.

## 15. Content migration

| Source | Destination |
|---|---|
| `data/projects.ts`, `data/experience.ts` (current repo) | `src/data/experience.ts`, `src/content/projects/*.mdx` (5 files) |
| `usman_resume.tex` (in `d:/MyProjects/my_resume/`) | compiled to `public/cv.pdf` at build time (or committed pre-built) |
| `usman_profile_research.md` (in `d:/MyProjects/my_resume/`) | source material for case-study MDX bodies |
| Existing project images / screenshots | `public/projects/<slug>/*.{webp,png}` |
| Supabase tables | dropped (data exported and consolidated into the above before deletion) |

## 16. Project layout (target)

```
src/
  content/
    config.ts                     # Content Collections schema
    projects/
      legend-tv.mdx
      lifelink.mdx
      nmo-ai.mdx
      youshopper-suite.mdx
      status-getter.mdx
  components/
    TerminalFrame.astro
    Hero.astro
    ProjectsList.astro
    OpenSourceCards.astro
    ExperienceLog.astro
    StackTree.astro
    ContactSection.astro
    KvBlock.astro
    StatsRow.astro
    SectionLabel.astro
    Footer.astro
    islands/
      ContactForm.tsx
      ThemeToggle.ts
      copy-email.ts
  layouts/
    BaseLayout.astro
    CaseStudyLayout.astro
  pages/
    index.astro
    projects/[...slug].astro
    uses.astro
    now.astro
    404.astro
    api/contact.ts
  data/
    profile.ts
    experience.ts
    stack.ts
    socials.ts
    openSource.ts
  styles/
    global.css
    tokens.css        # CSS custom properties for both themes
public/
  cv.pdf
  fonts/
    JetBrainsMono-Regular.woff2
    JetBrainsMono-SemiBold.woff2
    Inter-Regular.woff2
    Inter-SemiBold.woff2
  projects/<slug>/screenshots/*.webp
  favicon.svg
```

## 17. Deployment & operations

- **Build:** `astro build` → static `dist/` + one edge function for `/api/contact`.
- **Host:** Vercel (or Cloudflare Pages with Workers for the contact endpoint).
- **Env vars:** `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, optional `PLAUSIBLE_DOMAIN`.
- **Domain:** new domain to be registered by the user (the old `ottomancoder.com` is no longer owned). Until registered, deploy to a Vercel-provided subdomain; the site URL is read from `PUBLIC_SITE_URL` env var so the swap is one config change. Deploy previews on each PR regardless.
- **Migration cutover:** new site built on a dedicated git branch (`rewrite-v2`) inside the existing repo, with the current `app/`, `components/`, `data/`, `seeds/`, `lib/`, `hooks/`, and `deployment_guide/` trees deleted on that branch. Tested end-to-end via a deploy preview, then merged to `main` and DNS swapped. Old code remains in git history (and on the `main` snapshot tagged `pre-rewrite-v1`).

## 18. Out of scope (for v1)

- Blog or writings section.
- Newsletter signup.
- Search.
- Tag-based browsing of projects.
- i18n.
- An `/api/og` endpoint that generates OG images on the fly (we generate at build time only).
- Light/dark *animated* transitions.
- A `cmd+k` palette.

These are not no-forever items; they are not v1.

## 19. Acceptance criteria

Site is considered shipped when:

1. Landing page renders at `http://localhost:4321` (Astro dev) with all 6 sections populated from real data — no Lorem ipsum, no placeholder copy.
2. All 5 case studies are written in MDX and reachable at `/projects/[slug]`.
3. `/uses`, `/now`, `/404`, `/cv.pdf` all reachable.
4. Contact form successfully delivers a test email via Resend.
5. Light/dark theming works; manual override persists across reloads.
6. Lighthouse scores (mobile, throttled): Perf ≥98, A11y 100, Best Practices 100, SEO 100.
7. Manual responsive QA at 320 · 375 · 768 · 1024 · 1440 widths — no horizontal scroll, no broken layout, tap targets all ≥44px.
8. Total transferred JS on the landing page (DevTools Network tab, gzipped) is **<8KB**.
9. The user (Muhammad) reviews the live preview and approves before DNS cutover.
