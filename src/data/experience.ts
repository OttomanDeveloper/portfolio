// src/data/experience.ts
export type ExperienceProject = { name: string; slug?: string };
export type Experience = {
  period: string;
  role: string;
  company: string;
  companyHref: string | null;
  body: string;
  // Projects shipped during this role. `slug` links to the project's gallery on
  // /projects (#proj-<slug>); a chip with no slug is shown as plain text.
  projects?: ExperienceProject[];
  // Freelance umbrella role — show an "all projects" link after the highlights.
  allLink?: boolean;
};

export const experience: Experience[] = [
  {
    period: 'Jul 2024 → present',
    role: 'Senior Mobile App Developer',
    company: 'BeInMedia · Nmo AI',
    companyHref: 'https://www.beinmedia.com/',
    body: 'AI-powered fitness app — BLE health-device sync, Gemini AI coaching, Flutter architecture for a cross-functional international team.',
    projects: [{ name: 'Nmo AI · BLE fitness' }],
  },
  {
    period: 'Nov 2020 → present',
    role: 'Senior Mobile App Developer',
    company: 'Ottoman Coder · freelance',
    companyHref: null,
    body: '50+ production apps for clients in PK, IN, SA, AU, TH, LA. Audited 20+ legacy codebases. Product-led engineering directly with founders.',
    projects: [
      { name: 'Legend TV', slug: 'legend-tv' },
      { name: 'LifeLink', slug: 'lifelink' },
      { name: 'AlcoPass', slug: 'alcopass' },
      { name: 'iCare', slug: 'icare' },
      { name: 'Chronos', slug: 'chronos' },
    ],
    allLink: true,
  },
  {
    period: 'Nov 2022 → May 2023',
    role: 'Senior Mobile Software Engineer',
    company: 'SD Cold Logistics · YouShopper',
    companyHref: null,
    body: 'Built 3 separate apps (Customer, Seller, Delivery) all live on Play Store. Coin-based monetisation, OneSignal, YouTube V3. Zero-downtime backend migration.',
    projects: [{ name: 'YouShopper (3 apps)', slug: 'youshopper' }],
  },
  {
    period: 'Sep 2021 → Mar 2023',
    role: 'Senior Flutter Developer',
    company: 'Fulfil Supply Chain',
    companyHref: null,
    body: 'Cross-border e-commerce — OpenCart API, real-time inventory sync across countries. Firebase Auth + FCM. Measurable startup-time gains.',
    projects: [{ name: 'CourierGo', slug: 'couriergo' }],
  },
  {
    period: 'May 2022 → Oct 2022',
    role: 'Senior Flutter Developer',
    company: 'HomyKSA',
    companyHref: null,
    body: 'Home services marketplace for Saudi Arabia — real-time order matching, payments, worker management.',
    projects: [{ name: 'Homy', slug: 'homy' }],
  },
];
