# Ottoman Coder — Portfolio

Personal portfolio for **Muhammad Usman** (Ottoman Coder), Senior Mobile Engineer.
Built with [Astro](https://astro.build) as a fully static, zero-runtime-JS site:
project showcase, in-depth case studies, experience, tech stack and open-source work.

**Live:** https://ottomandeveloper.github.io/portfolio/

## Stack

- **Astro 6** (`output: 'static'`) — no client-side framework, ships zero JS by default
- **MDX** content collections for case studies
- **`@astrojs/sitemap`** for sitemap generation
- **lightningcss** for CSS minification
- **sharp** for image/asset generation (AVIF screenshots, favicons, OG image)
- Plain CSS with design tokens (`src/styles/tokens.css`), no UI library

## Project structure

```
src/
├── components/
│   ├── atoms/        # smallest building blocks (cards, pills, labels)
│   ├── molecules/    # composed UI (status banner, etc.)
│   └── sections/     # full page sections (Hero, FeaturedProjects, StackGrid, HireMe…)
├── content/
│   └── projects/     # case studies as .mdx (legend-tv, lifelink, alcopass, udownload, icare)
├── data/             # typed data the site renders from
│   ├── profile.ts    # name, headline, stats, "now"
│   ├── showcase.ts   # full project catalogue (34 projects)
│   ├── experience.ts # roles + projects per role
│   ├── stack.ts      # tech stack by category
│   ├── openSource.ts # pub.dev packages
│   └── contact.ts    # links (LinkedIn, Medium, YouTube…)
├── layouts/          # BaseLayout (head/SEO), CaseStudyLayout
├── lib/paths.ts      # withBase() — base-path helper for GitHub Pages subpaths
├── pages/            # index, projects, projects/[...slug] (case studies)
└── styles/           # tokens, global, fonts

public/               # static assets served as-is (screens/, fonts/, og/, favicons, cv.pdf)
scripts/              # one-off Node asset-generation scripts (sharp)
```

The site is **data-driven**: most content lives in `src/data/*.ts` and
`src/content/projects/*.mdx`, not hardcoded in components.

## Local development

Requires **Node >= 22.12.0**.

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:4321
npm run build      # production build to ./dist
npm run preview    # preview the production build locally
```

## Environment variables

Copy `.env.example` to `.env` and fill in as needed. All are optional for local dev.

| Variable | Purpose | Default |
|---|---|---|
| `PUBLIC_SITE_URL` | Canonical, sitemap and OG base URL | `http://localhost:4321` |
| `PUBLIC_BASE_PATH` | Base path for project-repo deploys (e.g. `/portfolio`) | `/` |
| `PUBLIC_FORMSPREE_ID` | Formspree form ID for the contact form (falls back to `mailto:` if empty) | empty |

On Vercel, `PUBLIC_SITE_URL` auto-resolves to the production domain when unset.
On GitHub Pages, the deploy workflow injects both `PUBLIC_SITE_URL` and
`PUBLIC_BASE_PATH` automatically.

## Adding a case study

1. Create `src/content/projects/<slug>.mdx` with frontmatter:

   ```yaml
   ---
   title: My Project
   tagline: One-line summary.
   stack: [Flutter, BLoC, Firebase]
   stats:
     - { num: '600K', unit: '+', desc: 'peak users' }
   order: 6
   liveUrl: https://...      # optional → "Open live" CTA
   sourceUrl: https://...    # optional → "Source on GitHub" CTA
   ---

   ## The brief
   First-person prose, code refs in `backticks`.
   ```

2. Link it from the catalogue by adding `caseHref: '/projects/<slug>'` to the
   matching entry in `src/data/showcase.ts`.

The route is generated automatically by `src/pages/projects/[...slug].astro`.

## Deployment

### GitHub Pages
`.github/workflows/deploy-pages.yml` builds and deploys on every push to `main`.
It uses `actions/configure-pages` to detect the Pages origin and base path, so it
works for both user pages and project repos with no manual config. To enable:
**Settings → Pages → Source: GitHub Actions**, then push to `main`.

### Vercel
`vercel.json` is preconfigured (`npm ci` install, `dist` output, Astro framework).
Import the repo in Vercel and it builds on push. Set `PUBLIC_SITE_URL` to a custom
domain if you use one.

## License

Personal project. Source is published for reference. The brand ("Ottoman Coder"),
profile content, screenshots and case-study text are **not** licensed for reuse.
