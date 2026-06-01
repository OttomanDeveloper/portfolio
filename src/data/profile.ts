// src/data/profile.ts
export const profile = {
  name: 'Muhammad Usman',
  alias: 'Ottoman Coder',
  aliasArabic: 'عُثماني',
  tagline: 'Senior Mobile Engineer',
  taglineLong: 'Senior Mobile Engineer · Ottoman Coder · 50+ apps shipped, 600K users reached',
  basedIn: 'Islamabad, PK',
  basedNote: 'remote-friendly worldwide',
  email: 'ottomandeveloper@gmail.com',
  resumeHref: '/cv.pdf',
  available: 'Available for new work',
  availableLong: 'Open to remote work, long-term contracts, and partnership opportunities.',
  currentlyShipping: {
    text: 'AI fitness app w/ BLE',
    at: 'Nmo AI',
    href: 'https://www.beinmedia.com/',
  },
  stats: [
    { num: '600K', unit: '+', desc: 'peak users on Legend TV' },
    { num: '50',   unit: '+', desc: 'production apps shipped' },
    { num: '#1',              desc: 'Play Store category, 5 months' },
    { num: '9',    unit: ' pkgs', desc: 'open-source on pub.dev' },
  ],
} as const;
