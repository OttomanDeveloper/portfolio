// src/data/profile.ts
export const profile = {
  name: 'Muhammad Usman',
  alias: 'Ottoman Coder',
  tagline: 'Senior Mobile Engineer',
  basedIn: 'Islamabad, PK',
  basedNote: 'remote-friendly worldwide',
  currentlyShipping: {
    text: 'AI fitness app w/ BLE',
    at: 'Nmo AI',
    href: 'https://www.beinmedia.com/',
  },
  stackSummary: 'Flutter · Dart · Gemini · BLE · Firebase · Supabase',
  openTo: ['full-time', 'contract', 'advisory'],
  email: 'ottomandeveloper@gmail.com',
  resumeHref: '/cv.pdf',
  stats: [
    { num: '600K', unit: '+', desc: 'peak users on Legend TV streaming platform' },
    { num: '50',   unit: '+', desc: 'production apps shipped for clients worldwide' },
    { num: '#1',              desc: 'Play Store category for 5 consecutive months' },
    { num: '1',    unit: ' pkg', desc: "adopted & maintained by Google's Dart team" },
  ],
} as const;
