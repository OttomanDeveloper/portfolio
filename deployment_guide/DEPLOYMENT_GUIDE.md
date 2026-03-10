# Ottoman Portfolio — Complete Deployment & Setup Guide

> **For first-time developers and non-technical users.** Everything you need to deploy, configure, and run this portfolio from zero — no prior knowledge of the codebase required.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Structure](#2-project-structure)
3. [Prerequisites](#3-prerequisites)
4. [Installation](#4-installation)
5. [Environment Setup](#5-environment-setup)
6. [Database Setup](#6-database-setup)
7. [Seed & Demo Data](#7-seed--demo-data)
8. [Deployment](#8-deployment)
9. [SEO, Branding & Admin Features](#9-seo-branding--admin-features)
10. [Package Management](#10-package-management)
11. [Security Best Practices](#11-security-best-practices)
12. [Troubleshooting](#12-troubleshooting)
13. [Update & Maintenance](#13-update--maintenance)
14. [Final Verification Checklist](#14-final-verification-checklist)

---

## 1. Project Overview

The **Ottoman Portfolio** is a full-stack, production-grade developer portfolio with a premium visitor-facing site and a fully featured Admin Panel.

### Key Features

| Feature | Description |
|---|---|
| **Dynamic Projects Grid** | Projects fetched live from the database, filterable by platform |
| **Case Study Modals** | Full project deep-dives in animated popups with Markdown support |
| **Career Timeline** | Automated experience years calculation |
| **About Me & Tech Stack** | Data-driven profile with tech-stack clusters |
| **Reviews System** | Visitors submit testimonials; admin moderates with pending → published flow |
| **Contact Form** | Stored in Supabase; admin manages status (unread → replied) |
| **Admin Panel** | Full CRUD for all content — desktop, tablet, and mobile responsive |
| **Dynamic Branding** | Site title and favicon managed from Admin Panel (no code changes) |
| **SEO Ready** | JSON-LD schema, Open Graph, sitemap.xml, robots.txt — all dynamic |

### Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **UI & Animations** | Framer Motion, Lucide React, Sonner |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel (recommended) |
| **Analytics** | @vercel/speed-insights |

---

## 2. Project Structure

```
portfolio/
│
├── app/                          ← Next.js App Router pages and layouts
│   ├── layout.tsx                ←   Root HTML layout (metadata, fonts, providers)
│   ├── page.tsx                  ←   Main visitor landing page (/)
│   ├── globals.css               ←   Global CSS variables and Tailwind v4 config
│   ├── robots.ts                 ←   /robots.txt endpoint
│   ├── sitemap.ts                ←   /sitemap.xml endpoint
│   └── admin/                   ←   Admin panel (protected)
│       ├── layout.tsx            ←     Sidebar + mobile navigation layout
│       ├── actions.ts            ←     Server Actions (all database writes)
│       ├── dashboard/page.tsx    ←     Stats overview
│       ├── about/page.tsx        ←     Edit profile, skills, social links, favicon
│       ├── projects/page.tsx     ←     Project CRUD
│       ├── experience/page.tsx   ←     Experience CRUD
│       ├── reviews/page.tsx      ←     Review moderation
│       ├── messages/page.tsx     ←     Contact message management
│       ├── settings/page.tsx     ←     Site taglines and descriptions
│       └── login/page.tsx        ←     Admin login page (optional auth)
│
├── components/
│   ├── sections/                 ← Full page sections (Hero, Projects, etc.)
│   └── ui/                      ← Reusable atoms (Button, Card, Modal, etc.)
│
├── lib/
│   ├── api-server.ts             ← Server-side data fetch functions
│   ├── types.ts                  ← TypeScript type definitions
│   ├── animations.ts             ← Framer Motion presets
│   ├── utils.ts                  ← General utility functions
│   └── supabase/
│       ├── client.ts             ←   Browser Supabase client
│       ├── server.ts             ←   Server-side Supabase client
│       └── storage.ts            ←   File upload helpers
│
├── seeds/                        ← Demo data and import scripts
│   ├── profile.json              ←   Developer profile
│   ├── projects.json             ←   5 portfolio projects
│   ├── experience.json           ←   3 work history entries
│   ├── reviews.json              ←   8 client testimonials
│   ├── messages.json             ←   5 sample contact messages
│   ├── import-seeds.mjs          ←   Run via `npm run seed`
│   └── reset-seeds.mjs           ←   Run via `npm run seed:reset`
│
├── deployment_guide/             ← This documentation folder
│   ├── DEPLOYMENT_GUIDE.md       ←   THIS FILE — complete single-file guide
│   ├── schema.sql                ←   Full database schema
│   └── seeds_import.sql          ←   SQL seed data (alternative to npm run seed)
│
├── public/                       ← Static files served as-is
├── hooks/                        ← Custom React hooks
├── .env.example                  ← Template for environment variables
├── .env.local                    ← Your actual credentials (NEVER commit!)
├── next.config.ts                ← Next.js configuration
├── tsconfig.json                 ← TypeScript compiler options
└── package.json                  ← Dependencies and npm scripts
```

### What to Modify as a New Developer

| Where to Change | What to Update |
|---|---|
| Admin Panel → About Me | Your real name, bio, avatar, social links, tech stacks |
| Admin Panel → Projects | Add your real projects (delete demo ones first) |
| Admin Panel → Experience | Add your work history |
| Admin Panel → Settings | Update site taglines and contact description |
| `app/globals.css` | Change accent color variables if desired |

---

## 3. Prerequisites

Everything you need installed before running this project.

### Software

| Requirement | Version | Check Command |
|---|---|---|
| Node.js | v18+ (v20 LTS recommended) | `node -v` |
| npm | v9+ | `npm -v` |
| Git | Any | `git --version` |

**Install links:**
- **Node.js**: [nodejs.org](https://nodejs.org/) — download the LTS version
- **Git (Windows)**: [git-scm.com](https://git-scm.com/)
- **Git (Mac)**: `xcode-select --install`
- **Git (Linux)**: `sudo apt install git`

### Services

| Service | Cost | Purpose |
|---|---|---|
| [Supabase](https://supabase.com) | Free tier | Database, storage, optional auth |
| [Vercel](https://vercel.com) | Free tier | Hosting (recommended) |

### Prerequisites Checklist

```
[ ] Node.js v18+ installed — run: node -v
[ ] npm v9+ installed — run: npm -v
[ ] Git installed — run: git --version
[ ] Supabase account created at supabase.com
[ ] VS Code installed (recommended editor)
[ ] Vercel / Netlify account ready (for production deployment)
```

---

## 4. Installation

Follow these steps **in order**. Each step builds on the previous.

### Step 1 — Get the Code

**Option A — Clone from GitHub (Recommended)**:

```bash
git clone https://github.com/your-username/your-repo.git
cd portfolio
```

**Option B — Download ZIP**:
1. Go to your GitHub repo → click the green **Code** button → **Download ZIP**
2. Extract and navigate to the folder in your terminal

### Step 2 — Install Dependencies

```bash
npm install
```

Downloads all required packages into `node_modules`. Takes 1–2 minutes on first run.

> **Peer dependency warnings?** Try: `npm install --legacy-peer-deps`

### Step 3 — Create Environment File

```bash
# Windows
copy .env.example .env.local

# Mac / Linux
cp .env.example .env.local
```

Then open `.env.local` and fill in your Supabase credentials (see Section 5).

### Step 4 — Import the Database Schema

1. Log into [supabase.com](https://supabase.com) → open your project
2. Click **SQL Editor** → **New Query**
3. Open `deployment_guide/schema.sql`, copy all content, paste and click **Run**

(Full instructions in Section 6.)

### Step 5 — Import Demo Data (Optional but Recommended)

```bash
npm run seed
```

Populates the portfolio with professional dummy content so you can see it in action immediately.

### Step 6 — Start the Development Server

```bash
npm run dev
```

Open your browser:
- **Visitor Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/dashboard

### Step 7 — Build for Production (Before Deploying)

```bash
npm run build
```

If the build succeeds with zero errors, the project is ready to deploy. See Section 8.

---

## 5. Environment Setup

The project needs **3 environment variables** to connect to Supabase.

### Required Variables

```bash
# .env.local — NEVER commit this file to Git

NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

| Variable | Visible in Browser? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Public key for read operations (protected by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ Server only | Admin key for write operations — NEVER expose publicly |

### How to Get Your Supabase Credentials

**Step 1 — Create a Supabase Project**:
1. Go to [supabase.com](https://supabase.com) and log in
2. Click **New Project** → fill in project name, password, and region
3. Wait ~2 minutes for provisioning

**Step 2 — Find Your API Keys**:
1. Click **Project Settings** (gear icon in left sidebar) → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

**Step 3 — Paste Into `.env.local`**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

> **No spaces around the `=` sign.** Keys go directly after `=`.

### For Production (Vercel)

Add variables in the Vercel dashboard — **not** in a file:
1. Vercel project → **Settings** → **Environment Variables**
2. Add all 3 variables with their values
3. Click **Save** and redeploy

### Environment Troubleshooting

| Problem | Solution |
|---|---|
| `Missing env variable` error | Check `.env.local` is in project root, not a subfolder |
| Site loads but data is empty | Verify `NEXT_PUBLIC_SUPABASE_URL` is correct |
| Admin saves failing | Verify `SUPABASE_SERVICE_ROLE_KEY` is correct with no trailing spaces |
| Variables not updating | Restart the dev server after any `.env.local` changes |

---

## 6. Database Setup

This project uses **Supabase** (free PostgreSQL database).

### Database Overview — 6 Tables

| Table | Purpose |
|---|---|
| `profile` | Developer identity: name, bio, avatar, social links, tech stack, taglines |
| `projects` | Portfolio items shown in the Projects section |
| `experience` | Career history shown in the Experience timeline |
| `reviews` | Visitor testimonials (pending → published → archived flow) |
| `messages` | Contact form submissions from visitors |
| `settings` | Key-value store for site taglines and descriptions |

### Importing the Schema

The schema file is: **`deployment_guide/schema.sql`**

**Method A — Supabase SQL Editor (Easiest)**:
1. Open Supabase → SQL Editor → New Query
2. Copy the full contents of `deployment_guide/schema.sql`
3. Paste into the editor and click **Run**
4. You should see: `Success. No rows returned`

**Method B — psql CLI (Advanced)**:
```bash
psql -h db.YOUR-PROJECT-ID.supabase.co -U postgres -d postgres -f deployment_guide/schema.sql
```

### Verify Tables Were Created

1. Supabase → **Table Editor** (left sidebar)
2. You should see all 6 tables: `profile`, `projects`, `experience`, `reviews`, `messages`, `settings`

### Set Up Storage (For File Uploads)

The admin panel allows uploading avatars, project images, resumes, and favicons. These go into a Supabase Storage bucket.

**Create the bucket**:
1. Supabase → **Storage** → **New Bucket**
2. Name: `portfolio`
3. Enable **Public bucket** ✅
4. Click **Save**

> The bucket must be public so uploaded images load on the visitor site.

### Row Level Security (RLS) Summary

RLS is automatically enabled when you run the schema:

| Table | Visitors (anon) | Admin (service key) |
|---|---|---|
| `profile` | Read ✅ | Full access ✅ |
| `projects` | Read ✅ | Full access ✅ |
| `experience` | Read ✅ | Full access ✅ |
| `reviews` | Read published only ✅ | Full access ✅ |
| `messages` | Insert only ✅ | Full access ✅ |
| `settings` | Read ✅ | Full access ✅ |

### Resetting the Database

```bash
# Using npm script
npm run seed:reset

# Or via Supabase SQL Editor
TRUNCATE TABLE projects, experience, reviews, messages, settings RESTART IDENTITY;
DELETE FROM profile;
```

---

## 7. Seed & Demo Data

The project ships with a complete set of professional dummy data so you can see a fully populated portfolio immediately.

### What's Included

| Table | Records | Content |
|---|---|---|
| `profile` | 1 | Alex Ottoman — Lead Full-Stack Engineer |
| `projects` | 5 | Zenith Banking, Nebula AI, Aether Social, Catalyst CRM, Momentum Fitness |
| `experience` | 3 | Apex Digital Studio, Pixel Perfect Studio, InnovateTech Labs |
| `reviews` | 8 | Professional client testimonials (all published) |
| `messages` | 5 | Sample contact form submissions |
| `settings` | 2 | Site taglines and contact descriptions |

### Import via npm (Recommended)

```bash
# Step 1: Reset any existing data
npm run seed:reset

# Step 2: Import all demo data
npm run seed
```

### Expected Output

```
🌱  Ottoman Portfolio — Seed Importer
    Connecting to: https://xxxx.supabase.co
──────────────────────────────────────────────────
  → Seeding profile...     ✅  Profile seeded.
  → Seeding projects...    ✅  5 projects seeded.
  → Seeding experience...  ✅  3 experience entries seeded.
  → Seeding reviews...     ✅  8 reviews seeded.
  → Seeding messages...    ✅  5 messages seeded.
  → Seeding settings...    ✅  Settings seeded.
──────────────────────────────────────────────────
🎉  All seed data imported successfully!
```

### Import via SQL (Alternative)

1. Open Supabase → SQL Editor → New Query
2. Copy the contents of `deployment_guide/seeds_import.sql`
3. Paste and click **Run**

### Demo Portfolio Preview

After seeding, the site displays:

**Projects:**
| Project | Stack | Platforms |
|---|---|---|
| Zenith Banking | Next.js, Supabase, Stripe | Web |
| Nebula AI Platform | React, GPT-4, PostgreSQL | Web |
| Aether Social | React Native, Solidity, IPFS | iOS, Android, Web |
| Catalyst CRM | Next.js, Supabase, Resend | Web |
| Momentum Fitness | React Native, FastAPI, TensorFlow | iOS, Android |

**Experience:**
| Company | Role | Period |
|---|---|---|
| Apex Digital Studio | Lead Full-Stack Engineer | Mar 2023 – Present |
| Pixel Perfect Studio | Mid-Level Full-Stack Developer | Jun 2021 – Feb 2023 |
| InnovateTech Labs | Junior Software Engineer | Jan 2018 – May 2021 |

### Replacing Demo Data With Your Own

Once happy with the layout, replace content in the Admin Panel:
1. `/admin/about` → update name, bio, avatar, social links, tech stacks
2. `/admin/projects` → delete demo projects, add your real ones
3. `/admin/experience` → update your career history
4. `/admin/reviews` → delete demo reviews (or keep and add real ones)
5. `/admin/settings` → update taglines and contact description

---

## 8. Deployment

### Option A — Vercel (Recommended, Free)

Vercel is built by the Next.js team — zero configuration needed.

**Step 1 — Push Code to GitHub**:
```bash
git init
git add .
git commit -m "initial portfolio"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

**Step 2 — Connect to Vercel**:
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Click **Import** next to your GitHub repository
3. Vercel auto-detects Next.js — no build settings needed

**Step 3 — Add Environment Variables**:
In the Vercel project (Settings → Environment Variables):
- `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
- `SUPABASE_SERVICE_ROLE_KEY` = your service role key

**Step 4 — Deploy**:
Click **Deploy**. After ~2 minutes, your portfolio is live at `https://your-project.vercel.app`.

Every push to `main` auto-deploys. Pull request previews are created for every PR.

---

### Option B — Netlify

1. Push to GitHub (same as above)
2. [netlify.com](https://netlify.com) → **Add New Site → Import from Git**
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. Add environment variables under **Site Settings → Environment**
5. Click **Deploy**

---

### Option C — VPS / Self-Hosted Linux Server

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone the repository
git clone https://github.com/your-username/your-repo.git
cd portfolio

# 4. Create .env.local with your credentials
nano .env.local

# 5. Install dependencies
npm install

# 6. Build for production
npm run build

# 7. Start the production server
npm start      # runs on port 3000

# Optional: keep alive with PM2
npm install -g pm2
pm2 start "npm start" --name "ottoman-portfolio"
pm2 save
pm2 startup
```

---

### Option D — Docker

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://... \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  --build-arg SUPABASE_SERVICE_ROLE_KEY=... \
  -t ottoman-portfolio .

docker run -p 3000:3000 ottoman-portfolio
```

---

### Updating Content After Deployment

All content is managed through the **Admin Panel** — no code changes or redeployments needed:
1. Go to `https://your-site.com/admin/dashboard`
2. Edit projects, experience, reviews, messages, and settings
3. Changes are saved to Supabase and immediately visible on your live site

### Redeploying After Code Changes

```bash
git add .
git commit -m "your change description"
git push
# Vercel / Netlify auto-detect the push and redeploy automatically
```

---

## 9. SEO, Branding & Admin Features

### Dynamic Metadata (SEO)

The portfolio auto-generates all SEO metadata from the database via `app/layout.tsx`:

- **`<title>`**: Pulled from the `site_title` field in your profile
- **`<meta name="description">`**: Your tagline from the database
- **Open Graph / Twitter cards**: Profile image + bio for social sharing
- **JSON-LD Person schema**: Injected for Google rich results
- **`/sitemap.xml`**: Dynamically generated via `app/sitemap.ts`
- **`/robots.txt`**: Blocks `/admin/` from indexing, allows all other pages

**Verify SEO after deployment**:
1. View page source → check for `<title>`, `<meta>` tags, and `<script type="application/ld+json">`
2. Visit `https://your-site.com/sitemap.xml`
3. Visit `https://your-site.com/robots.txt`

---

### Dynamic Branding (No Code Required)

**Changing the Browser Tab Title**:
1. Admin Panel → **About Me** → **Search & Branding** section
2. Update **Browser Tab Title** → **Save Changes**

**Updating the Favicon**:
1. Admin Panel → **About Me** → **Search & Branding** section → **Change Icon**
2. Upload a square image (32×32 or 64×64 PNG/ICO recommended)
3. The system automatically compresses, uploads to Supabase Storage, and updates metadata

---

### Case Study Markdown

Projects support **GitHub Flavored Markdown** in the Full Description field:

1. Admin Panel → **Projects** → edit a project
2. In the **Full Description** field, use Markdown:

```markdown
# Project Overview

A next-generation fintech platform for 12K+ users.

## Core Features
- Real-time transaction processing
- AI spending categorization
- Multi-currency support

## Results
| Metric | Value |
|---|---|
| Users | 12,000+ |
| Uptime | 99.9% |
```

3. Click **Save Changes** — the visitor popup renders this with premium styling.

**Supported Markdown**: Headers, bold/italic, lists, code blocks, tables, links.

---

### Admin Panel — What You Can Manage

| Admin Route | What You Can Edit |
|---|---|
| `/admin/dashboard` | Stats overview |
| `/admin/about` | Name, bio, tagline, avatar, resume, social links, tech stacks, site title, favicon |
| `/admin/projects` | Add / edit / delete portfolio projects with full case study content |
| `/admin/experience` | Add / edit / delete career history entries |
| `/admin/reviews` | Moderate testimonials: pending → published → archived |
| `/admin/messages` | View and manage contact form submissions |
| `/admin/settings` | Site-wide taglines and contact section text |

---

## 10. Package Management

### Viewing Current Packages

```bash
npm list --depth=0
```

### Checking for Updates

```bash
npm outdated
```

### Updating All Packages Safely

```bash
npm update    # only patch and minor versions — no breaking changes
```

### Updating a Specific Package

```bash
npm install package-name@latest

# Examples:
npm install next@latest
npm install framer-motion@latest
npm install @supabase/supabase-js@latest
```

### Installing a New Package

```bash
npm install package-name           # runtime dependency
npm install --save-dev package-name # dev-only dependency
```

### Removing a Package

```bash
npm uninstall package-name
```

### Full Clean Reinstall

```bash
# Windows
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Mac / Linux
rm -rf node_modules package-lock.json
npm install
```

### Security Audit

```bash
npm audit           # list vulnerabilities
npm audit fix       # auto-fix safe ones
npm audit fix --force  # force-fix (may update majors — use carefully)
```

### Key Dependencies

| Package | Purpose |
|---|---|
| `next` | Core framework |
| `react` / `react-dom` | UI rendering |
| `@supabase/supabase-js` | Database client |
| `@supabase/ssr` | Server-side Supabase |
| `framer-motion` | Animations |
| `tailwindcss` | CSS styling |
| `lucide-react` | Icon library |
| `react-hook-form` | Form state management |
| `zod` | Schema validation |
| `sonner` | Toast notifications |
| `react-markdown` | Markdown rendering |
| `@vercel/speed-insights` | Performance analytics |

---

## 11. Security Best Practices

### Never Commit `.env.local`

Your `.env.local` file contains secret API keys. It's already in `.gitignore`, but verify:

```bash
git status   # .env.local should NOT appear in the list

# If it does, remove it from tracking:
git rm --cached .env.local
```

### Variable Visibility Rules

| Variable | Visible In Browser | Safe to Expose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | ✅ Yes (protected by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ Server only | ❌ NEVER — bypasses all RLS |

### Never Hard-Code Secrets

```typescript
// ❌ WRONG — never do this
const supabase = createClient('https://xxxx.supabase.co', 'eyJ...')

// ✅ CORRECT — always use env vars
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Database Security

- **RLS is enabled** on all 6 tables — even if someone finds your anon key, they can only read public data
- The `SUPABASE_SERVICE_ROLE_KEY` is only used in `app/admin/actions.ts` (server-side only)
- Never make admin writes from client-side components

### Securing the Admin Panel

By default the admin panel is accessible to anyone with the URL. To add full login protection:
1. Supabase → Authentication → Users → create an admin user
2. Update `app/admin/login/page.tsx` to use `supabase.auth.signInWithPassword()`
3. Add middleware in `middleware.ts` to redirect unauthenticated users from `/admin/` to `/admin/login`

### If Your Keys Are Ever Exposed

1. Immediately rotate keys: Supabase → Project Settings → API → Reset keys
2. Update `.env.local` and Vercel environment variables with new keys
3. Remove keys from git history if accidentally committed

### Production Security Checklist

```
[ ] .env.local is in .gitignore and NOT committed to git
[ ] SUPABASE_SERVICE_ROLE_KEY is only used in server-side code
[ ] RLS is enabled on all 6 database tables
[ ] Storage bucket is public for reads, write-protected server-side
[ ] No hardcoded secrets in any source file
[ ] Vercel environment variables are set (not hardcoded in vercel.json)
```

---

## 12. Troubleshooting

### Site Shows Empty / Blank Sections

| Cause | Solution |
|---|---|
| `.env.local` is missing | Create it from `.env.example` |
| Wrong Supabase URL or key | Copy fresh keys from Supabase → Project Settings → API |
| Database tables don't exist | Run the schema SQL in Supabase SQL Editor |
| No seed data imported | Run `npm run seed` |
| Dev server not restarted after env change | Stop and restart `npm run dev` |

---

### `Missing environment variable NEXT_PUBLIC_SUPABASE_URL`

```bash
# Check the file exists
ls .env.local    # Mac/Linux
dir .env.local   # Windows

# Check the contents
cat .env.local   # Mac/Linux
type .env.local  # Windows
```

No extra spaces, quotes, or special characters around the `=` sign.

---

### Build Fails With TypeScript Errors

```bash
npx tsc --noEmit    # check TypeScript errors
npm run lint        # check ESLint errors
```

Review each error and fix the type mismatches in the referenced file.

---

### `new row violates row-level security policy`

All admin write operations **must** go through Next.js Server Actions in `app/admin/actions.ts` using the `SUPABASE_SERVICE_ROLE_KEY`. Never make admin writes from client-side components.

---

### Images Not Loading

```typescript
// Add to next.config.ts → images → remotePatterns:
{ protocol: 'https', hostname: 'your-image-host.com', pathname: '/**' }
```

Restart the dev server after saving.

---

### `npm install` Fails With Peer Dependency Errors

```bash
npm install --legacy-peer-deps
```

---

### Port 3000 Already In Use

```bash
# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

---

### Admin Panel Shows Blank

**Cause**: `SUPABASE_SERVICE_ROLE_KEY` is wrong or missing.

1. Go to Supabase → Project Settings → API
2. Copy the `service_role` key (the longer of the two keys)
3. Update `.env.local` and restart the dev server

---

### Seed Command Fails

| Error | Fix |
|---|---|
| `Missing environment variables` | Check `.env.local` credentials |
| `relation does not exist` | Run schema SQL first — tables don't exist yet |
| `violates not-null constraint` | Use latest `schema.sql` — schema mismatch |
| Profile row conflict | Run `npm run seed:reset` first |

---

### Changes in Admin Don't Show on Visitor Site

```bash
Ctrl+C                            # stop server
Remove-Item -Recurse -Force .next # Windows — clear Next.js cache
rm -rf .next                      # Mac/Linux
npm run dev                       # restart
```

---

### Vercel Deployment Fails

| Error | Fix |
|---|---|
| Build fails | Fix TS/lint errors locally first with `npm run build` |
| Environment variables missing | Add all 3 variables in Vercel → Settings → Environment Variables |
| Function timeout | Supabase project may be paused — check supabase.com |

**For any unlisted issue**: Check the browser console (F12) → check Supabase → Logs → search the error on [stackoverflow.com](https://stackoverflow.com).

---

## 13. Update & Maintenance

### Updating Content (No Code Required)

| What to Update | Admin Panel Route |
|---|---|
| Name, bio, tagline, avatar | `/admin/about` |
| Social links | `/admin/about` |
| Tech stack sections | `/admin/about` |
| Favicon / browser tab icon | `/admin/about` |
| Portfolio projects | `/admin/projects` |
| Career experience | `/admin/experience` |
| Testimonial reviews | `/admin/reviews` |
| Contact text and taglines | `/admin/settings` |

### Updating Dependencies

```bash
npm outdated          # show available updates
npm update            # safe patch/minor updates
npm audit             # check for vulnerabilities
npm audit fix         # auto-fix safe ones
```

### Updating Next.js

```bash
npm install next@latest react@latest react-dom@latest
npm run build         # verify no breaking changes before deploying
```

### Adding a New Database Column

```sql
-- In Supabase SQL Editor:
ALTER TABLE projects ADD COLUMN video_url TEXT DEFAULT '';
```

After changing the schema, also update:
- `lib/types.ts` (TypeScript types)
- The relevant admin page form
- The relevant fetch function in `lib/api-server.ts`

### Backing Up Your Data

```sql
-- Manual backup via Supabase SQL Editor:
SELECT * FROM profile;
SELECT * FROM projects;
SELECT * FROM experience;
SELECT * FROM reviews;
SELECT * FROM messages;
SELECT * FROM settings;
```

```bash
# Or using Supabase CLI:
supabase db dump -f backup.sql
```

### Clearing Next.js Cache

```bash
Remove-Item -Recurse -Force .next  # Windows
rm -rf .next                       # Mac/Linux
npm run dev
```

### Recommended Maintenance Schedule

| Frequency | Task |
|---|---|
| **Monthly** | Run `npm outdated`, apply safe updates with `npm update` |
| **Quarterly** | Update major dependencies, run full test after |
| **Quarterly** | Run `npm audit` and fix vulnerabilities |
| **As needed** | Update portfolio content via Admin Panel |

---

## 14. Final Verification Checklist

Before going live, confirm every item:

```
SETUP
[ ] Node.js v18+ is installed
[ ] npm install completed without errors
[ ] .env.local is populated with real Supabase credentials

DATABASE
[ ] deployment_guide/schema.sql imported (all 6 tables exist in Supabase)
[ ] Seed data imported (profile, projects, experience, reviews visible)
[ ] Supabase Storage bucket 'portfolio' created and set to Public

DEVELOPMENT
[ ] npm run dev starts without errors
[ ] Visitor site loads at http://localhost:3000
[ ] Projects section shows portfolio items
[ ] Reviews section shows published reviews
[ ] Contact form submits a message to Supabase
[ ] Admin dashboard loads at /admin/dashboard

ADMIN PANEL
[ ] Can create, edit, delete a project
[ ] Can create, edit, delete an experience entry
[ ] Can publish/archive a review
[ ] Can view and change message status
[ ] About Me page saves profile data including Site Title
[ ] Site Favicon can be uploaded and updated
[ ] Settings page updates site taglines

SEO & BRANDING
[ ] Browser tab shows your custom Site Title
[ ] Browser tab shows your custom Favicon
[ ] /sitemap.xml is accessible
[ ] /robots.txt is accessible and disallows /admin/
[ ] Open Graph meta tags are present in page source

PRODUCTION BUILD
[ ] npm run build completes with zero errors
[ ] All environment variables added to hosting platform (Vercel/Netlify)
[ ] Deployed URL loads the visitor site correctly
[ ] Admin Panel works on the deployed URL
```

---

*Ottoman Portfolio Deployment Guide — March 2026*
*For issues, review the error in your browser console or Supabase logs.*
