# Portfolio v3 — Design Spec

**Date:** 2026-05-16
**Owner:** Muhammad Usman (Ottoman Coder)
**Status:** awaiting user approval
**Branch:** `redesign-v3-app-store-heritage` (from `main`)
**Supersedes:** [`2026-05-16-portfolio-rewrite-design.md`](2026-05-16-portfolio-rewrite-design.md) (v2 brutalist terminal — kept on `rewrite-v2` branch as historical record)

---

## 1. Why v3

v2 (brutalist terminal) is a working, deployable Astro 6 site. The user reviewed it, then asked for a complete redesign with a different brief: animated, unique, showcasing apps + open-source + web demos + an "available for work" status, and runnable on **GitHub Pages and Vercel** (which forbids server-side `/api` routes — strictly static).

v3 is a fresh start from `main`. v2 stays at tag `pre-rewrite-v1` and branch `rewrite-v2` as rollback / reference.

Two new context drops between v2 and v3 changed the design materially:
- **9 open-source packages** in scope (not 2) — including `vision_ai` (on-device gesture/emotion in Flutter), the `tanquery` family (TanStack Query → Dart port), `newpipeextractor_dart`. Plus the headline Google-adopted `firebase_admin_sdk`.
- **Two live web demos** already hosted at `ottomandeveloper.github.io`: **Chronos** (scroll-driven Big Bang→today, 30+ CustomPainters, single Ticker @ 60fps) and **PiggyToken** (crypto landing demo). Chronos in particular is a flex that rhymes with v3's scroll-driven aesthetic.
- 31 real Android screenshots across 7 apps (bill_checker, courier, grouper, icare, status_getter, u_download, yt_master) available as raw assets.

## 2. Goals

- **Distinctive.** Cannot be mistaken for the v0/Lovable/Vercel template aesthetic.
- **Animated, but composite-thread only.** Scroll-driven CSS animations, view transitions, micro-interactions. Smooth at 60fps on a Snapdragon 695-era Android.
- **Readable + responsive** (carried over from v2 as non-negotiable). Body ≥16px, line-height ≥1.6 for prose, WCAG AA contrast everywhere, fluid type with `clamp()`, no horizontal scroll at 320px.
- **Static.** Builds to `dist/` and serves identically from GitHub Pages and Vercel. No server-side runtime.
- **Three contact channels reachable in one tap from any viewport.** No buried mailto.
- **Available-for-work status surfaced in three places** (hero pill, dedicated section, sticky mobile banner).

## 3. Non-goals

- No CMS / database.
- No server-side runtime — no `/api` routes.
- No React. No Framer Motion. No GSAP. No Lenis. No Three.js.
- No multi-language / RTL site (the Arabic mark is a static wordmark only, not localised content).
- No blog (case studies are project documentation, not posts).
- No comments, no analytics dashboards, no user accounts.
- No autoplay video on the landing page.
- No light-mode toggle in v1 — design committed to dark; light is a v2 stretch.

## 4. Design direction

**App Store × Heritage.** Dark backdrop (`#0d0d12`), one signal colour: warm gold (`#d4a558`). Project tiles styled like iOS App Store "Today" featured cards. Google-adopted package treated as a hero featured card — that's the headline credential.

A small Naskh Arabic wordmark — **عُثماني** — sits in the top corner of the hero as a brand mark for "Ottoman Coder." It's a static glyph, not localised text. Type system pairs **JetBrains Mono SemiBold** (display, hero, all-caps headings) with **Inter** (UI / body / cards) and **Noto Naskh Arabic** (the single wordmark).

Motion is exclusively native-CSS: `animation-timeline: scroll() / view()`, `@property` for animated gradients, cross-document `@view-transition` for shared-element morphs between the landing page and the 3 case-study pages. Zero animation libraries.

## 5. Tech stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Astro 6**, static output | Identical build for GitHub Pages + Vercel. SSG, no runtime. |
| Content | **MDX** for case studies, typed TS data files for everything else | Same pattern v2 used. Versioned in git. |
| Styling | Plain CSS + CSS variables, no Tailwind | The design system is small + bespoke. `@layer` for cascade. `lightningcss` for minify. |
| Animation | **100% CSS** — `animation-timeline: scroll()/view()`, `@view-transition`, `@property` | Zero JS animation libs. Composite-thread only. Falls back gracefully where unsupported. |
| Interactivity | **Vanilla TS** for ThemeToggle (no-op v1), copy-email, contact-form-submit | No React. Total JS budget: under 5 KB gzipped. |
| Contact backend | **Formspree free tier** (50 submissions/mo) | Works from static site. No env vars needed in HTML — POST to the Formspree action URL. Fallback: `mailto:` link below form. |
| Hosting | **GitHub Pages** (primary) + **Vercel** (deploy preview / CDN) | Both serve the same `dist/` build. Astro config respects `base` path for GitHub Pages subpath. |
| Fonts | Self-hosted **JetBrains Mono 400/600**, **Inter 400/600**, **Noto Naskh Arabic 700** | WOFF2, Latin + Arabic subsets. `font-display: swap`, preloaded. |
| Analytics | None by default; if added, GoatCounter or Plausible | Privacy-friendly. Decided at deploy time. |

Removed vs. v2: `@astrojs/react`, `@astrojs/vercel` adapter, `react`/`react-dom`, `resend`, `zod` (no contact-form schema needed — Formspree validates), `vitest` (no API to test — v1 ships without). Kept: `@astrojs/mdx`, `@astrojs/sitemap`.

## 6. Information architecture

```
ottomandeveloper.github.io/<repo>/        — or custom domain on Vercel
├── /                                       One long scroll, 10 sections
│   ├── #hero                                wordmark + Arabic mark + status pill + phone stack
│   ├── #google-story                        Featured Today card — firebase_admin_sdk adoption
│   ├── #legend-tv                           Featured hero project — Legend TV case
│   ├── #web-demos                           Chronos + PiggyToken with lazy iframe previews
│   ├── #projects                            App Store "Today" grid of 8 featured apps
│   ├── #opensource                          Grid of 9 published packages
│   ├── #experience                          Timeline of 5 roles
│   ├── #stack                               8 stack categories, chip rows
│   ├── #status                              Available-for-work section (dedicated)
│   └── #contact                             6 channels + Formspree-backed form
│
├── /projects/legend-tv                      Deep dive case study (MDX)
├── /projects/firebase-admin-sdk             The Google adoption story (MDX)
├── /projects/chronos                        Scroll-driven Flutter Web (MDX, embedded live demo)
│
├── /cv.pdf                                  Resume (compiled or pre-built)
└── /404                                     Custom 404 in the same visual language
```

Mobile-only: a thin sticky **status banner** at the top of every page reading `● Available for new work · tap for contact ↓`.

## 7. Visual system

### 7.1 Palette (dark only in v1)

| Token | Value | Use | Contrast on `#0d0d12` |
|---|---|---|---|
| `--bg` | `#0d0d12` | page background | — |
| `--bg-elev` | `#1a1a22` | card background | — |
| `--bg-bar` | `#161620` | nav / sticky banner | — |
| `--fg` | `#fafafa` | primary text | 19.1 : 1 |
| `--fg-dim` | `#a0a0a8` | secondary text, captions | 7.4 : 1 |
| `--accent` | `#d4a558` | signal — gold | 9.2 : 1 |
| `--accent-glow` | `oklch(76% 0.13 80 / 0.35)` | featured-card backlit glow | — |
| `--cyan` | `#67e8f9` | "live / featured" accent on project cards | 12.0 : 1 |
| `--lime` | `#a3e635` | "in progress / current" badge | 13.6 : 1 |
| `--alert` | `#fca5a5` | error / unavailable | 7.5 : 1 |
| `--border` | `oklch(100% 0 0 / 0.08)` | card borders | — |
| `--border-soft` | `oklch(76% 0.13 80 / 0.18)` | gold-tinted dividers | — |

Every text/background pair listed passes WCAG AA (≥4.5:1) and most pass AAA (≥7:1).

### 7.2 Typography

| Use | Family | Weight | Size | Line-height |
|---|---|---|---|---|
| Hero wordmark | JetBrains Mono | 700 | `clamp(2.5rem, 4vw + 1rem, 5rem)` (40–80px) | 1.05 |
| Section heading | JetBrains Mono | 600, uppercase, `letter-spacing: 0.05em` | `clamp(1.5rem, 2vw + 0.5rem, 2.25rem)` (24–36px) | 1.2 |
| Project / OSS card name | Inter | 600 | 1rem (16px) | 1.4 |
| Featured card title | Inter | 700 | `clamp(1.5rem, 2vw + 0.5rem, 2rem)` (24–32px) | 1.25 |
| Body / prose | Inter | 400 | 1rem (16px) | 1.6 |
| Case-study prose | Inter | 400 | 1.0625rem (17px) | 1.75 |
| Labels / metadata | JetBrains Mono | 400, uppercase, `letter-spacing: 0.18em` | 0.75rem (12px) | 1 |
| Arabic wordmark | Noto Naskh Arabic | 700 | `clamp(1.75rem, 2vw + 0.5rem, 2.75rem)` | 1 |

`text-wrap: balance` on all headings ≤ h3. `text-wrap: pretty` on prose paragraphs.

### 7.3 Spacing & layout

Spacing scale (rem-based for fluid scale):
`--s-1: 0.25rem · --s-2: 0.5rem · --s-3: 0.75rem · --s-4: 1rem · --s-5: 1.5rem · --s-6: 2rem · --s-7: 3rem · --s-8: 4rem · --s-9: 6rem · --s-10: 8rem`

Container: `max-inline-size: 1200px`, `padding-inline: clamp(1rem, 4vw, 2rem)`. Sections gap (between blocks): `clamp(4rem, 8vw, 8rem)`.

Card radii: 14px (project Today card) · 16px (featured Today card) · 12px (OSS card) · 18px (app icon inside card).

### 7.4 Motion — the full inventory

| # | Where | Tech | Notes |
|---|---|---|---|
| 1 | **Phone-stack hero**: 3 sticky phones drift on scroll | `animation-timeline: scroll(root)` on `transform` + `opacity` only | Spec: front phone (cycles screenshots) pinned; mid + back phones translate-up/right and fade as scroll progresses. ~80 KB total payload (3 AVIFs + SVG frame). |
| 2 | **Section reveal** | `animation-timeline: view(); animation-range: entry 0% cover 30%` | Slide-up + fade. One CSS rule, no observer. IntersectionObserver fallback for unsupported browsers. |
| 3 | **Featured Today card border glow** | `@property --angle <angle>` + `conic-gradient` rotation | GPU-cheap. Continuous 6s rotation. Pauses on `prefers-reduced-motion`. |
| 4 | **Hover micro-interactions** on cards | `transition: transform 200ms cubic-bezier(.2,.8,.2,1)` on `translateY(-2px) scale(1.01)` | Gated by `@media (hover: hover) and (pointer: fine)`. |
| 5 | **Available-for-work pill pulse** | Pure CSS `@keyframes` on `box-shadow` + `opacity` of an `::after` ring | Gentle 2s pulse. Disabled by `prefers-reduced-motion`. |
| 6 | **Cross-document view transitions** | `@view-transition { navigation: auto }` + `view-transition-name: project-title-<slug>` on the card title + the case-study heading | Native shared-element morph between landing card and case-study page. Browser does the morph; no JS. |
| 7 | **Scroll-progress bar at top of case-study pages** | `animation-timeline: scroll(root); transform: scaleX()` | 2-rule CSS, no JS. |

Global guardrail (ship once in `global.css`):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 8. Landing page — sections in detail

### 8.1 `#hero`

```
┌─────────────────────────────────────────────────────────┐
│  ▸ TODAY                                       عُثماني  │
│                                                         │
│  MUHAMMAD                                ┌──┐ ┌──┐ ┌──┐ │
│  USMAN.                                  │  │ │  │ │  │ │
│                                          │  │ │  │ │  │ │
│  Senior Mobile Engineer · Ottoman Coder  │  │ │  │ │  │ │
│  50+ apps shipped, 600K users reached    │  │ │  │ │  │ │
│                                          │  │ │  │ │  │ │
│  ● Available for new work    [Get in touch ↓] │  │     │ │
│                                                         │
│  600K+ users  ·  50+ apps  ·  #1 / 5 months             │
│                                                         │
│  scroll to explore ↓                                    │
└─────────────────────────────────────────────────────────┘
```

- Top-left: small mono label `▸ TODAY` (App Store cue).
- Top-right: **عُثماني** in Noto Naskh Arabic, gold.
- Wordmark: `MUHAMMAD USMAN.` in JetBrains Mono 700, white, two lines on narrow viewports.
- Tagline: Inter 400, dim. Includes alias + role + scale signal.
- **Status pill**: dim background, gold pulse dot, "Available for new work" + small CTA "Get in touch ↓" scrolling to `#contact`.
- Phone stack on the right (or below on mobile): 3 SVG iPhone frames containing 3 different real app screenshots (`legend-tv` hero, `lifelink` hero, `nmo-ai` hero or fallback). Sticky, scroll-driven (see §7.4 motion).
- Stats row: 3 inline stats at base of hero.
- Scroll cue: small mono link to `#google-story`.

### 8.2 `#google-story` (Featured Today card)

A single full-width gold-bordered card with backlit glow.

```
┌────────────────────────────────────────────────────────────┐
│  ▸ FEATURED · ADOPTED BY GOOGLE                            │
│                                                            │
│  firebase_admin_sdk                                        │
│  A Dart package I wrote — later officially taken over and  │
│  maintained by Google's Dart & Flutter team.               │
│                                                            │
│  [Get on pub.dev →]   [Read the story →]                   │
└────────────────────────────────────────────────────────────┘
```

- Animated border: rotating gold conic gradient, 6s cycle.
- Primary CTA links to pub.dev. Secondary CTA links to `/projects/firebase-admin-sdk`.
- `view-transition-name: google-credential` so the card morphs smoothly when the secondary CTA navigates.

### 8.3 `#legend-tv` (Featured hero project)

Project hero in the same Today-card aesthetic, two-column on desktop:

- Left: title `Legend TV`, tagline (single line), 4-stat strip (`600K+ users / $20K+ rev / #1 PS / 5 mo`), short paragraph excerpt, CTA `Read full case study →` → `/projects/legend-tv`.
- Right: one large phone mockup with a real Legend TV screenshot.

### 8.4 `#web-demos`

Two cards side-by-side on desktop, stacked on mobile.

```
┌──────────────────────────┐  ┌──────────────────────────┐
│  Chronos                 │  │  PiggyToken              │
│  Scroll-driven Big Bang  │  │  Crypto landing demo     │
│  → today journey in pure │  │  with scroll-triggered   │
│  Dart. 30+ CustomPainters│  │  reveals, animated       │
│  on a single Ticker @ 60 │  │  counters, glassmorphism │
│  fps. Hand-painted eras. │  │  nav.                    │
│                          │  │                          │
│  [▶ Open in new tab ↗]   │  │  [▶ Open in new tab ↗]   │
│  [Source on GitHub →]    │  │  [Source on GitHub →]    │
└──────────────────────────┘  └──────────────────────────┘
```

Each card has a high-quality static screenshot (or 1-frame hero capture) of the demo. **No live iframe on page load** — iframes loading Flutter Web are slow (CanvasKit ~1.5 MB cold). A "Preview" affordance can optionally swap the screenshot for the iframe on click, but the default is open-in-new-tab.

### 8.5 `#projects` (App Store Today grid)

8 featured apps in a `repeat(auto-fit, minmax(min(280px, 100%), 1fr))` grid:

| Slot | App | Tagline | Icon glyph | Link |
|---|---|---|---|---|
| 1 | LifeLink | Crisis app · Gemini AI · Isolates | 🧬 | Play Store |
| 2 | UDownload | Open-source YouTube client (GPL-3) | 📺 | GitHub |
| 3 | YT Master | YouTube services marketplace | 💰 | Test APK |
| 4 | Grouper | Social groups + scam finder | 🤝 | Test APK |
| 5 | Status Saver | Multi-platform downloader (Isolates) | 📥 | Releases |
| 6 | ICare | Meditation + biometric privacy | 🧘 | Test APK |
| 7 | CourierGo | Multi-vendor logistics | 🚚 | Test APK |
| 8 | Bill Checker | Utility aggregation | 🧾 | Test APK |

Each card: rounded 18px coloured icon tile (icon glyph centered) on left · name in Inter 600 · tagline in Inter 400 · `OPEN ↗` pill button on right. Hover: lift + glow.

Below grid: `+ 8 more apps live on Play Store →` linking to `#more-apps` (an expandable disclosure containing the rest from the README's "More Live Apps" table — YouShopper, Homy KSA, Blood Donors, etc.).

### 8.6 `#opensource` (9-package grid)

2-col grid (3 on wide viewports). First two cards get featured badges:

| Slot | Package | Badge | Tagline |
|---|---|---|---|
| 1 | `firebase_admin_sdk` | **★ ADOPTED BY GOOGLE** (gold) | Firebase Admin for Dart — adopted into the official Firebase publisher |
| 2 | `vision_ai` | **NEW · ON-DEVICE AI** (cyan) | Hand gesture + facial emotion in Flutter — 13 gestures, 7 emotions, MediaPipe + ML Kit + TFLite, 25–30 fps, zero cloud |
| 3 | `vision_ai_flutter` | Companion | Pre-built UI overlays for vision_ai |
| 4 | `tanquery` | Active | TanStack Query ported to Dart — pure Dart, no Flutter dependency |
| 5 | `tanquery_flutter` | Companion | Flutter adapter — QueryBuilder, MutationBuilder, InfiniteQueryBuilder |
| 6 | `tanquery_devtools` | Companion | Visual cache inspector overlay |
| 7 | `newpipeextractor_dart` | Active | NewPipe Extractor wrap — YouTube + SoundCloud + more, no API key |
| 8 | `firebase_cloud_messaging_dart` | Active | Send FCM directly from Dart — zero backend needed |
| 9 | `charts_flutter_maintained` | Community fork | Maintained fork of Google's abandoned charts library |

Each card: package name in JetBrains Mono · tagline in Inter · pub.dev `→` link · likes/downloads count when available.

### 8.7 `#experience`

Vertical timeline, 5 entries, most recent first. Each entry:

```
●─────────  Jul 2024 → present
            Senior Mobile App Developer @ BeInMedia (Nmo AI)
            AI-powered fitness app — BLE health-device sync, Gemini AI coaching, Flutter architecture.

●─────────  Nov 2020 → present
            Senior Mobile App Developer @ Ottoman Coder (freelance) · Upwork · Fiverr · Malt
            50+ production apps for clients in PK, IN, SA, AU, TH, LA. Audited 20+ legacy codebases.

●─────────  Nov 2022 → May 2023
            Senior Mobile Software Engineer @ SD Cold Logistics / YouShopper
            Built 3 separate apps. Coin-based monetisation, OneSignal, YouTube V3. Zero-downtime migration.

●─────────  Sep 2021 → Mar 2023
            Senior Flutter Developer @ Fulfil Supply Chain (Bangkok · remote)
            Cross-border e-commerce. OpenCart API. Firebase Auth + FCM.

●─────────  May 2022 → Oct 2022
            Senior Flutter Developer @ HomyKSA (Riyadh · remote)
            Home services marketplace for Saudi Arabia. Real-time order matching.
```

A thin vertical gold line connects the dots. Each row is left-aligned to the date and reads top-to-bottom on mobile (no horizontal scroll).

### 8.8 `#stack`

8 category rows, each a key + chip row. Categories taken verbatim from the README's "Core Stack" block:

`Languages` · `Frameworks` · `State Mgmt` · `Backend` · `APIs` · `Hardware` · `AI/ML` · `Vision` · `Tools`

Chip styling: 1px border in `--border`, 8px radius, 6px horizontal padding, Inter 400 14px.

### 8.9 `#status` (dedicated Available-for-work section)

```
┌────────────────────────────────────────────────────────────┐
│  ● AVAILABLE                                               │
│                                                            │
│  Open to remote work, long-term contracts, and             │
│  partnership opportunities.                                │
│                                                            │
│  Currently shipping: AI fitness app w/ BLE at Nmo AI       │
│                                                            │
│  [Get in touch →]    →  scrolls to #contact                │
└────────────────────────────────────────────────────────────┘
```

Same Today-card visual treatment as the Google story card, but with subdued gold-on-dark instead of glowing.

### 8.10 `#contact`

Two parts.

**Part A: 6 contact channels** in a `repeat(auto-fit, minmax(min(200px, 100%), 1fr))` grid:

| Channel | Action | Link |
|---|---|---|
| LinkedIn | `linkedin.com/in/ottomancoder` | external |
| Email | `mailto:ottomandeveloper@gmail.com` | mailto + copy-on-click |
| WhatsApp | `wa.me/message/4DIU6JPIALUGK1` | external |
| YouTube | `youtube.com/@OttomanCoder` | external |
| Stack Overflow | `stackoverflow.com/users/15117215` | external |
| Resume PDF | `/cv.pdf` | download |

Each channel card: icon glyph + label + small subtitle. Gold underline on hover.

**Part B: short contact form** (Formspree-backed):

```html
<form action="https://formspree.io/f/<form-id>" method="POST">
  <input name="email" type="email" required placeholder="your@email.com">
  <input name="subject" type="text" required placeholder="role · contract · advice · saying hi">
  <textarea name="message" required minlength="10" placeholder="…"></textarea>
  <input name="_gotcha" type="text" tabindex="-1" hidden> <!-- honeypot -->
  <button type="submit">▸ send</button>
</form>
```

On submit: Formspree returns JSON; vanilla TS swaps the form for `✓ sent. I'll reply within ~24h.`. If JS disabled, native form submit redirects to Formspree's thank-you page (configurable in the Formspree dashboard).

The form ID is read from `import.meta.env.PUBLIC_FORMSPREE_ID` at build time (with a `mailto:` fallback rendered if the env var is absent — keeps the site usable in PR previews without a real Formspree key).

## 9. Case study deep-dive pages (3)

Same `CaseStudyLayout.astro` for all three:

- Breadcrumb: `~ / projects / <slug>`
- Title (with `view-transition-name: case-title-<slug>` for the morph)
- Hero stat strip
- Inter prose body in MDX, `clamp(1rem, 0.9rem + 0.3vw, 1.0625rem)` font-size, `max-inline-size: 68ch`
- For Chronos: embedded `<iframe src="https://ottomandeveloper.github.io/andro_meda/" loading="lazy">` after the first paragraph, with an Open-in-new-tab fallback.

Three deep dives:

1. `/projects/legend-tv` — solo-built 600K-user streaming platform
2. `/projects/firebase-admin-sdk` — the Google adoption story
3. `/projects/chronos` — scroll-driven Flutter Web journey with live demo

(Other apps link directly to Play Store / GitHub from the projects grid — no per-app case study page for v1.)

## 10. Phone-stack hero — implementation detail

```astro
<section class="phone-stack" aria-label="Project showcase">
  <div class="phone phone--back"  style="--i:2"><img src="/screens/legend-tv.avif" alt=""></div>
  <div class="phone phone--mid"   style="--i:1"><img src="/screens/lifelink.avif"  alt=""></div>
  <div class="phone phone--front" style="--i:0"><img src="/screens/nmo-ai.avif"    alt=""></div>
</section>
```

```css
.phone-stack {
  position: relative;
  block-size: 200svh; /* gives scroll room for the stack to play out */
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
  box-shadow: 0 30px 60px -20px rgb(0 0 0 / .4);
  translate: calc(var(--i) * 40px) calc(var(--i) * -20px);
  z-index: calc(10 - var(--i));
  animation: drift linear both;
  animation-timeline: scroll(root block);
  animation-range: 0% 100%;
  animation-duration: 1ms; /* Firefox quirk — required */
}
@keyframes drift {
  to {
    translate: calc(var(--i) * 80px) calc(var(--i) * -160px);
    opacity: calc(1 - var(--i) * 0.4);
  }
}
.phone--front { animation-name: none; } /* front stays put */
.phone img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
@media (prefers-reduced-motion: reduce) {
  .phone { animation: none; translate: none; position: static; margin-block: 1rem; }
}
@media (max-width: 640px) {
  .phone--back, .phone--mid { display: none; }
  .phone--front { position: static; margin-inline: auto; }
}
```

SVG iPhone frame: source from shadcn.io's iPhone 15 Pro component (MIT licensed, ~6 KB inline), wrap each `<img>` inside the frame via a `<clipPath>`.

## 11. Responsive plan

Three breakpoints, mobile-first.

| Viewport | Hero stats | Phone stack | Projects grid | OSS grid | Contact channels |
|---|---|---|---|---|---|
| Base (<640px) | stacked 1-col | 1 phone (front only) | 1-col | 1-col | 1-col |
| `≥640px` | 3-col | 2 phones | 2-col | 2-col | 2-col |
| `≥1024px` | 3-col | 3 phones | 3-col | 3-col | 3-col |

Other rules:
- Hero wordmark: `clamp(2.5rem, 4vw + 1rem, 5rem)`.
- Container: `padding-inline: clamp(1rem, 4vw, 2rem)`.
- All grids use `repeat(auto-fit, minmax(min(280px, 100%), 1fr))` — auto-collapse without breakpoint media queries.
- Tap targets: ≥44 × 44 CSS px on touch viewports (`@media (pointer: coarse)`).
- No horizontal scroll at any viewport ≥320px wide.
- iOS-safe viewport heights: `100svh` for hero (never `100vh`).
- Safe-area-insets: `body { padding-inline: env(safe-area-inset-left) env(safe-area-inset-right) }`.

## 12. Performance + accessibility targets

| Metric | Target |
|---|---|
| LCP (mobile, throttled 3G Fast) | ≤ 0.8s |
| Total JS shipped (landing, gzipped) | **< 5 KB** (no React; only theme-toggle stub + copy-email + form-submit) |
| Total CSS shipped (gzipped) | < 15 KB |
| Initial HTML payload (gzipped) | < 18 KB |
| Lighthouse Performance | ≥ 99 mobile, 100 desktop |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |
| WCAG | AA across the board; AAA where achievable without compromising the design |
| Cumulative Layout Shift | 0 |
| INP | ≤ 200ms |

Accessibility implementation:
- `<html lang="en">`.
- Skip-to-content link visible on focus.
- All decorative glyphs (`▸`, `●`, `→`) wrapped in `aria-hidden="true"`.
- Form inputs each have `<label>` (visually styled inline, programmatically associated).
- `focus-visible` outlines on all interactive elements; never `outline: none`.
- Colour is never the sole indicator of state (badges include text).
- Live region for form submit: `<p role="status" aria-live="polite">`.
- The Arabic wordmark has `lang="ar"` and `dir="rtl"` locally.
- Animations gated by `prefers-reduced-motion`.

## 13. SEO + Open Graph

- Per-page `<title>` and `<meta name="description">`.
- Canonical URLs read from `import.meta.env.PUBLIC_SITE_URL` with localhost fallback.
- JSON-LD `Person` schema on the landing page (carried from v2 with the v3 corrections — gmail address, no domain hardcoding).
- Static `robots.txt` + Astro-generated `sitemap.xml`.
- Per-page Open Graph and Twitter Card meta.
- One **default OG image** baked at build time as a static PNG export (1200×630) using the same wordmark + Arabic mark + Google credential pull. Stored at `public/og/default.png`. Per-case-study OG images are deferred to v3.1.

## 14. Content sourcing

| Content | Source | Destination |
|---|---|---|
| Profile, stack summary, stats | `D:/MyProjects/github_profile/OttomanDeveloper/README.md` (authoritative) | `src/data/profile.ts` |
| 9 open-source packages | README "Open-Source Ecosystem" table | `src/data/openSource.ts` |
| 8 featured projects (icon, name, tagline, link) | README "Featured Projects" `<details>` blocks | `src/data/projects.ts` |
| 8 "more apps" (Play Store list) | README "More Live Apps" table | `src/data/moreApps.ts` |
| 2 web demos | README "Web Projects" table | `src/data/webDemos.ts` |
| 5 experience entries | README "Experience" table | `src/data/experience.ts` |
| 6 contact channels | README header badges | `src/data/contact.ts` |
| 31 raw screenshots | `D:/MyProjects/github_profile/OttomanDeveloper/Assets/*.png` | `public/screens/*.avif` (converted at build time or pre-converted, target ≤80 KB each) |
| Profile photo | `D:/MyProjects/github_profile/OttomanDeveloper/Assets/usman_profile.jpg` | `public/profile.avif` (optional — only used inside the meta OG image; not on the page itself in v1) |
| Resume PDF | `D:/MyProjects/my_resume/Muhammad_Usman_Resume.pdf` or compiled from `.tex` | `public/cv.pdf` |
| 3 case study bodies | new prose (informed by README) | `src/content/projects/*.mdx` |

## 15. Deployment

Two targets, **same build, same `dist/` output**.

### GitHub Pages
- Build: `astro build` with `site: 'https://ottomandeveloper.github.io'` + `base: '/<repo-name>'` (or root if user-page repo `OttomanDeveloper.github.io`).
- Deploy via GitHub Actions on push to `main`: workflow `.github/workflows/deploy-pages.yml` checks out, runs `npm ci && npm run build`, uploads `dist/`.

### Vercel
- Import repo, framework preset `Astro`, build command `npm run build`, output dir `dist`.
- Env vars: `PUBLIC_SITE_URL` (production) · `PUBLIC_FORMSPREE_ID` (optional).
- Used primarily for **deploy previews** on PRs; can also serve as production CDN if user prefers a Vercel-hosted custom domain.

**Same `astro.config.mjs`** for both — `base` derived from an env var so the build is portable.

## 16. Out of scope (v3 v1)

- Light mode toggle (dark only in v1).
- Per-case-study OG image generation (one site-wide OG; per-case OG = v3.1).
- Animated cross-document view transitions on the OSS package cards (only on featured Today cards and project cards).
- Live iframe embed of web demos on the landing page (we link to the live URL only; iframe lives inside the Chronos case study page).
- Blog / writing section.
- A `cmd+k` palette.
- Search.
- Tag-based browsing.
- Light/dark theme persistence.
- Internationalisation.

## 17. Acceptance criteria

The site is considered shipped when:

1. Landing page renders all 10 sections at `localhost:4321` with content sourced from the README — no Lorem ipsum, no placeholder text.
2. All 3 case study deep dives render at `/projects/[slug]` with prose-styled MDX.
3. `/uses` deprecated (was v2) — not present in v3. `/now` similarly not present.
4. Custom `/404` page in the v3 visual language.
5. The phone-stack hero animates smoothly when scrolled (3 phones drift) and gracefully collapses to a single static phone under `prefers-reduced-motion`.
6. Cross-document view transitions work between landing and case study pages on supporting browsers (Chrome ≥ 126, Safari ≥ 18.2, Firefox ≥ 144).
7. Available-for-work status is visible at first paint in three places (hero pill, `#status` section, mobile sticky banner).
8. The contact form submits to Formspree successfully (verified with a test submission) or — with no Formspree ID set — gracefully falls back to a `mailto:` link.
9. Lighthouse mobile scores (throttled): Performance ≥ 99, Accessibility 100, Best Practices 100, SEO 100.
10. Total transferred JS (Network tab, gzipped) on the landing page is < 5 KB.
11. Site renders without horizontal scroll at 320 / 375 / 414 / 768 / 1024 / 1440 viewports.
12. Successful deploy to both **GitHub Pages** and **Vercel preview**, with the same build output, no env-specific code branches.
13. Owner (Muhammad) reviews the deployed preview and approves before DNS / custom-domain cutover.
