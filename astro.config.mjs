// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Site URL — used for canonical, sitemap and OG tags.
// Priority: explicit PUBLIC_SITE_URL (e.g. a custom domain) wins; otherwise on
// Vercel fall back to the stable production domain so links never point at
// localhost even if PUBLIC_SITE_URL was never set in the dashboard.
const VERCEL_PROD = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const SITE =
  process.env.PUBLIC_SITE_URL ||
  (VERCEL_PROD ? `https://${VERCEL_PROD}` : 'http://localhost:4321');
// BASE path — used by GH Pages for project repos. Defaults to '/' on Vercel.
const BASE = process.env.PUBLIC_BASE_PATH || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: { build: { cssMinify: 'lightningcss' } },
});
