import type { APIRoute } from 'astro';

// Dynamic robots.txt so the Sitemap directive is an absolute URL derived from the
// configured `site` (PUBLIC_SITE_URL). A relative sitemap path is invalid per spec
// and breaks on subpath hosts (e.g. GitHub Pages).
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
