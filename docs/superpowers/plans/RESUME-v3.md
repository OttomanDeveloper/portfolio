# Portfolio v3 — Resume / Handoff

**Status:** Phases 0–6 complete. 5 pages building cleanly. Phase 7 (QA + deploy) is interactive and pending you.
**Branch:** `redesign-v3-app-store-heritage`
**Last updated:** 2026-06-01

---

## What's done — 7 commits

```
fff40b8  Phase 6: JSON-LD + robots + cv.pdf + vercel.json + GH Actions (0 KB JS shipped)
f2de3ea  Phase 5: content collection + CaseStudyLayout + 3 MDX + 404 (5 routes)
265a19a  Phase 4: 10 landing sections wired + StatusBanner
fb3ad8e  Phase 3: 8 typed data modules + 33 AVIFs
b7301c6  Phase 2: 8 atoms + smoke test
ca6a927  Phase 1: fonts + tokens + global CSS + BaseLayout
95fa8b3  Phase 0: scaffold Astro 6 + MDX + sitemap
```

Plus `88fc76e` (clear Next.js) and tag `pre-v3-clean` for rollback.

---

## What it ships

- **5 static pages**: `/`, `/projects/legend-tv`, `/projects/firebase-admin-sdk`, `/projects/chronos`, `/404`
- **10 landing sections** all verified by anchor grep: `#hero · #google-story · #legend-tv · #web-demos · #projects · #opensource · #experience · #stack · #status · #contact`
- **0 KB JS shipped** (vs spec target <5 KB) — Astro inlined the tiny scripts. Form submit + clipboard handlers live inline in the rendered HTML.
- **CSS-only animations**: sticky 3-phone scroll-driven hero · animated gold conic-gradient border on the Today card · pulsing status pill · gleaming mobile banner · scroll progress bar on case studies · `prefers-reduced-motion` respected everywhere.
- **9 open-source packages** rendered (firebase_admin_sdk + vision_ai featured, tanquery family, newpipeextractor_dart, charts_flutter_maintained, FCM-dart).
- **Available-for-work in 3 places**: hero pill + `#status` section + mobile-only sticky banner.
- **Contact form** posts to Formspree when `PUBLIC_FORMSPREE_ID` is set; mailto fallback otherwise.
- **GH Actions deploy workflow** + `vercel.json` so the same build serves identically from both targets.

---

## To verify locally

```bash
cd d:/MyProjects/My_Portfolio/portfolio
npm run dev      # http://localhost:4321
npm run build    # static build to dist/
npm run preview  # serves dist/
```

Visit each page and verify visually. Phone-stack drifts on scroll only on ≥1024px viewports (mobile sees just one).

---

## What's left (Phase 7 — your hands)

| # | Task | What you do |
|---|---|---|
| 1 | **Hand-make default OG image** | Create `public/og/default.png` at 1200×630, black bg, gold "MUHAMMAD USMAN." + Arabic mark + tagline. Figma or any image tool — 10 min job. The metas already reference it; replace the missing-image fallback. |
| 2 | **Sign up at [formspree.io](https://formspree.io)** | Free tier = 50 submissions/month. Copy the form ID into Vercel env var `PUBLIC_FORMSPREE_ID` + GH repo secret of the same name. |
| 3 | **Replace placeholder web-demo screenshots** | `public/screens/chronos.avif` and `public/screens/piggytoken.avif` are placeholders (copies of `icare_2.avif` / `icare_3.avif`). Capture real screenshots of the live demos and overwrite. |
| 4 | **Push branch + open PR** | `git push -u origin redesign-v3-app-store-heritage` |
| 5 | **Enable GH Pages** | Repo Settings → Pages → Source: GitHub Actions. Add `PUBLIC_FORMSPREE_ID` to Settings → Secrets. The workflow on `main` will deploy. |
| 6 | **Configure Vercel** | Import the repo; framework auto-detected as Astro (vercel.json pins it). Env vars: `PUBLIC_SITE_URL=https://your-domain`, `PUBLIC_FORMSPREE_ID=<id>`. Leave `PUBLIC_BASE_PATH` empty/unset. |
| 7 | **Responsive QA** | Open `npm run preview` in Chrome DevTools → emulate at 320 · 375 · 414 · 768 · 1024 · 1440. Check no horizontal scroll, tap targets ≥44px, sections readable. |
| 8 | **Lighthouse on live preview** | After Vercel/GH Pages deploys, run Lighthouse mobile on `/`, `/projects/legend-tv`, `/projects/chronos`. Target: Perf ≥99, A11y 100, Best Practices 100, SEO 100. |
| 9 | **Send a real test contact form submission** | Verify delivery to `ottomandeveloper@gmail.com`. |
| 10 | **Merge + cutover** | After QA passes, merge `redesign-v3-app-store-heritage` → `main` → tag `v3.0.0`. |

---

## Known gotchas

- **`pre-rewrite-v1` and `pre-v3-clean` tags** preserve the old Next.js portfolio and the v3 pre-clean state respectively. Ultimate rollback works.
- **Brand `<em>Ottoman Coder</em>` and Arabic `عُثماني`** rendered as static glyphs only — no full RTL/localised content.
- **`pub.dev publisher` URL** stays as `ottomancoder.com` — that's the namespace identifier and is still credited to you per your earlier correction.
- **Phone-stack drift requires modern browser** (Chrome/Edge 115+, Safari 26, Firefox 144+ behind flag). Older browsers see the front phone only — graceful degradation.

---

## File inventory

```
.github/workflows/deploy-pages.yml    GitHub Actions Pages deploy
.gitignore                            extended for v3
.env.example                          3 PUBLIC_ env vars
astro.config.mjs                      Astro 6 static + base path from env
package.json                          v3.0.0; no React
tsconfig.json                         strict + @/* alias
vercel.json                           pinned framework = astro
public/
  favicon.ico, favicon.svg            Astro defaults
  cv.pdf                              your resume
  robots.txt                          allow + sitemap
  fonts/                              7 woff2 (Latin + Arabic)
  screens/                            33 AVIF (28 real + 5 aliases) + README
src/
  content.config.ts                   collection schema (zod)
  content/projects/                   3 MDX case studies
  data/                               8 typed modules (profile, projects, moreApps,
                                      webDemos, openSource, experience, contact, stack)
  layouts/
    BaseLayout.astro                  head + skip link + StatusBanner + OG meta
    CaseStudyLayout.astro             scroll progress + view transitions + prose
  components/
    atoms/                            8 (SectionLabel, StatusPill, KvBlock, StatsRow,
                                      TodayCard, AppCard, OssCard, PhoneFrame)
    molecules/StatusBanner.astro      sticky mobile banner
    sections/                         10 sections (Hero, GoogleStory, FeaturedLegendTV,
                                      WebDemos, ProjectsGrid, OssGrid,
                                      ExperienceTimeline, StackGrid,
                                      StatusSection, Contact)
  lib/paths.ts                        withBase() helper
  pages/
    index.astro                       landing (10 sections + JSON-LD)
    404.astro                         custom 404
    projects/[...slug].astro          case study route
  styles/
    fonts.css                         7 @font-face declarations
    tokens.css                        palette + type + spacing + radii
    global.css                        reset + skip link + container + view-transition opt-in
scripts/
  convert-screens.mjs                 PNG → AVIF batch
docs/
  superpowers/specs/                  v3 design spec + earlier specs
  superpowers/plans/                  v3 implementation plan + this handoff
  design-explorations/                aesthetic-options.svg
```
