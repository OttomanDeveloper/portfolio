// src/data/profile.ts
export const profile = {
  name: 'Muhammad Usman',
  alias: 'Ottoman Coder',
  aliasArabic: 'عُثماني',
  tagline: 'Senior Flutter / Mobile Engineer',
  taglineLong: 'Senior Flutter / mobile · Ottoman Coder · Islamabad · production iOS & Android',
  basedIn: 'Islamabad, PK',
  basedNote: 'remote-friendly worldwide',
  email: 'ottomandeveloper@gmail.com',
  resumeHref: '/cv.pdf',
  available: 'Available for new work',
  availableLong: 'Open to remote work, long-term contracts, and partnership opportunities.',
  previousWork: {
    text: 'AI fitness app w/ BLE',
    at: 'BeInMedia · Nmo AI',
    href: 'https://www.beinmedia.com/',
    ended: 'September 2026',
  },
  now: {
    month: "JUN '26",
    items: [
      { key: 'building', text: 'personal apps — calmness, fitness, streaming' },
      { key: 'reading',  text: 'Designing Data-Intensive Apps' },
      { key: 'learning', text: 'on-device LLMs (Gemini Nano)' },
      { key: 'side',     text: 'tanquery v1 stabilization' },
    ],
  },
  stats: [
    { num: '600K', unit: '+', desc: 'peak users on Legend TV' },
    { num: '50',   unit: '+', desc: 'production apps shipped' },
    { num: '#1',              desc: 'Play Store category, 5 months' },
    { num: '13',   unit: ' pkgs', desc: 'open-source on pub.dev' },
  ],
} as const;
