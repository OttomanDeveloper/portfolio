# Resume: Fiverr Showcase project research

Multi-session research task to populate the dedicated Projects section of the portfolio with 21 client/personal projects from the user's Fiverr Showcase folder.

## Source

```
C:\Users\postp\Downloads\Fiverr Showcase-20260601T153111Z-3-001\Fiverr Showcase\
```

22 project folders (Project 1 – Project 22). **Project 9 is already done = Legend TV** (converted to `public/screens/legend_*.avif`, lives in `FeaturedProjects.astro` as the commercial featured card).

## Image storage decision (locked)

Bundle AVIFs in `public/screens/`. Originals stay in a gitignored `_originals/` if used at all. ~170 images × ~70KB AVIF = ~12 MB total committed. No CDN, no separate repo. Same pattern proven on Legend TV.

Conversion recipe (template — run inline as a one-shot mjs script then delete):

```js
import sharp from 'sharp';
const out = await sharp(src)
  .resize({ width: 720, withoutEnlargement: true })
  .avif({ quality: 65, effort: 6 })
  .toFile(`public/screens/${slug}_${screen}.avif`);
```

## Per-project schema (target for `src/data/projects.ts`)

```ts
{
  slug: 'kebab-case',
  name: 'Display Name',
  packageId: 'com.foo.bar' | null,
  year: 2021,                            // from screenshot filename timestamp
  role: 'sole developer' | 'lead' | 'contractor',
  client: 'Brand / "Three Ottoman" / NDA / Fiverr (anonymous)',
  category: 'Rewards' | 'Logistics' | 'Streaming' | 'Wallpapers' | ...,
  tagline: '1-line punchy summary',
  description: '2-3 sentences',
  motive: 'what problem it solved (USER PROVIDED)',
  techStack: ['Flutter', 'Firebase', 'BLoC', ...],
  features: ['Daily spin', 'Coin economy', ...],
  status: 'live' | 'shipped' | 'shelved' | 'prototype' | 'nda',
  storeLink: 'https://play.google.com/...' | null,
  githubLink: 'https://github.com/...' | null,
  screens: ['lucky-spin_home.avif', 'lucky-spin_play.avif', ...],
  featured: false,
}
```

## 6 gap questions to ask user per project

What I can derive automatically: **year (timestamp), packageId (filename), category (visual), screen names (visual), color scheme, language, visible features, tech hints (Flutter UI patterns)**.

What I CANNOT derive — ask user:

1. **Role** — sole dev, lead, or contractor?
2. **Client** — own brand / specific client name / Fiverr anonymous / NDA?
3. **Status now** — live, shelved, private, NDA?
4. **Links** — Play Store / GitHub URL, or "none"
5. **Motive in one sentence** — what problem it actually solved
6. **Tech-stack confirmation** — I'll guess from UI patterns, user confirms/corrects

## Pre-scanned package IDs

From filename scan (saves time in research sessions):

| # | Files | Package ID | Likely app | Cross-match? |
|---|---|---|---|---|
| 1  | 6  | com.wisbig.reward                          | Wisbig Rewards | new |
| 2  | 5  | com.wallpapers.zamanali.footballwallpaper  | Football Wallpapers | new |
| 3  | 6  | com.saveit.down.saveit                     | SaveIt downloader | maybe = status-saver |
| 4  | 4  | com.tfpdl                                  | TFPDL movies | new |
| 5  | 6  | (WhatsApp generic, no pkg)                 | unknown — visual analysis | ? |
| 6  | 10 | (WhatsApp generic)                         | unknown | ? |
| 7  | 4  | (WhatsApp generic)                         | unknown | ? |
| 8  | 11 | (WhatsApp generic)                         | unknown | ? |
| 9  | 6  | (WhatsApp generic — done)                  | **Legend TV** ✓ DONE | done |
| 10 | 6  | (WhatsApp generic)                         | unknown | ? |
| 11 | 6  | (WhatsApp generic)                         | unknown | ? |
| 12 | 4  | (WhatsApp generic)                         | unknown | ? |
| 13 | 7  | com.technicalusman.developer.rewardpay     | RewardPay | **his brand** |
| 14 | 3  | com.rohandev.allin1                        | All-In-1 (Rohan client) | new |
| 15 | 4  | com.fbsaver.fbsaver                        | FB Saver | new |
| 16 | 20 | com.jinniu.shipox                          | ShipOX logistics (LARGE) | maybe = couriergo |
| 17 | 5  | com.hosteladmin.adminhostelfinder          | Hostel Finder admin | new |
| 18 | 35 | com.todomanage.icare                       | ICare (LARGEST) | matches existing icare entry — but pkg suggests care/task mgmt not meditation, confirm with user |
| 19 | 5  | com.example.meetbook_admin                 | MeetBook admin | new |
| 20 | 9  | com.videodownloader.udownload              | UDownload | matches existing udownload — enrich |
| 21 | 10 | com.threeottoman.luckyspin                 | Lucky Spin | **his brand** |
| 22 | 15 | screenshot_*.png (no pkg)                  | unknown — visual analysis | ? |

## Cross-check against current `src/data/projects.ts` (8 entries)

Already present: `lifelink`, `udownload`, `yt-master`, `grouper`, `status-saver`, `icare`, `couriergo`, `bill-checker`.

- **udownload** = Project 20 — enrich with richer fields + add `screens`
- **icare** = Project 18 — verify (package "todomanage" suggests it's actually task/care mgmt, NOT meditation as currently described — likely a copy mistake)
- **status-saver**, **couriergo**, **lifelink**, **yt-master**, **grouper**, **bill-checker** — likely sit inside Projects 5–12 (the WhatsApp-named ones); confirm via visual analysis

## Recommended session cadence

| Batch | Projects | Why |
|---|---|---|
| Batch A | 1, 2, 13, 21 | Quick wins: user's own brand projects + clear package IDs |
| Batch B | 3, 4, 14, 15 | More single-package small projects |
| Batch C | 17, 19, 22 | Smaller admin/meetbook projects |
| Batch D | 5, 6, 7 (WA generic) | Need visual analysis, cross-check existing projects.ts |
| Batch E | 8, 10, 11, 12 (WA generic) | Same |
| Batch F | 16 (20 files) + 18 (35 files) + 20 enrich | Heavy projects, do alone |

Process per batch:
1. Fresh session
2. Paste: "Resume project research, do batch X (projects N, M, ...)"
3. I read images, present derived data + ask 6 gap questions per project
4. User answers
5. I convert images to AVIF, write entries, commit, end session

## What's locked in before research begins

- Calm hero with Now widget (`▸ NOW · JUN '26`)
- Featured Projects 2-up (Legend TV + UDownload) with horizontal card layout, ~130px shot
- Legend TV: 6 AVIFs in `public/screens/legend_*.avif`
- UDownload: uses existing `u_download_1.avif`
- `profile.ts` has `now` block alongside `currentlyShipping`
- `index.astro` references `FeaturedProjects` (deleted old `FeaturedLegendTV`)

## UI design for Projects section — deferred

User chose "Decide later — just collect the data for now". After all data is in, propose card style: 2-col matching Featured Projects, OR denser App-Store-style 3-4-col grid.
