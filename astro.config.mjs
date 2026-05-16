// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Site URL — read from env so the eventual real domain is a one-line swap.
// Falls back to localhost for `npm run dev` builds.
const SITE = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: vercel(),
  integrations: [
    mdx(),
    react(),
    sitemap(),
  ],
  vite: {
    build: { cssMinify: 'lightningcss' },
  },
});
