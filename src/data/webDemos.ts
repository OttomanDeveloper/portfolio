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
    caseStudyHref: undefined as string | undefined,
  },
] as const;
