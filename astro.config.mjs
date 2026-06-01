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
