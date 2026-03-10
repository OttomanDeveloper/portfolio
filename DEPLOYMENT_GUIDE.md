# Ottoman Portfolio — Complete Deployment & Setup Guide

> **For first-time developers.** Everything you need to deploy, configure, and run this portfolio from scratch. No prior knowledge of the codebase required.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Structure Tree](#2-project-structure-tree)
3. [Requirements Before Deployment](#3-requirements-before-deployment)
4. [Installation Guide](#4-installation-guide)
5. [Database Schema](#5-database-schema)
6. [Data Import Guide](#6-data-import-guide)
7. [Seed Data](#7-seed-data)
8. [Dummy Portfolio Content](#8-dummy-portfolio-content)
9. [Updating Dependencies](#9-updating-dependencies)
10. [Database Connection Guide](#10-database-connection-guide)
11. [Authentication & Storage](#11-authentication--storage)
12. [Deployment Guide](#12-deployment-guide)
13. [Troubleshooting](#13-troubleshooting)
14. [Final Verification Checklist](#14-final-verification-checklist)
15. [SEO Configuration](#15-seo-configuration)
16. [Dynamic Branding (Title & Favicon)](#16-dynamic-branding-title--favicon)
17. [Case Study Markdown](#17-case-study-markdown)

---

## 1. Project Overview

The **Ottoman Portfolio** is a full-stack, production-grade developer portfolio with a premium visitor-facing site and a fully featured Admin Panel.

### Key Features
| Feature | Description |
|---|---|
| **Dynamic Projects Grid** | Projects are fetched live from the database, filterable by category |
| **Case Study Modals** | Full project deep-dives in animated modals |
| **Career Timeline** | Automated experience years calculation |
| **Narrative & Expertise** | Data-driven "About Me" with tech-stack clusters |
| **Reviews System** | Visitors can submit testimonials; admin moderates them |
| **Inquiries / Messages** | Contact form stored in DB; admin can manage statuses |
| **Admin Panel** | Full CRUD for all content, responsive on desktop & mobile |
| **Dynamic Settings** | Taglines, contact description, theme — all DB-controlled |

### Technology Stack
| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **UI** | Framer Motion, Lucide React, Sonner (toasts) |
| **Database** | Supabase (PostgreSQL) |
| **ORM / Client** | `@supabase/supabase-js`, `@supabase/ssr` |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel (recommended) |
| **Analytics** | @vercel/speed-insights |

---

## 2. Project Structure Tree

```
portfolio/
├── app/                          ← Next.js App Router
│   ├── admin/                    ← 🔒 Admin Panel (server-only)
│   │   ├── layout.tsx            ←   Sidebar + mobile nav
│   │   ├── dashboard/            ←   Stats overview
│   │   ├── about/                ←   Edit profile, skills, social links, favicon, site title
│   │   ├── projects/             ←   CRUD for portfolio projects
│   │   ├── experience/           ←   CRUD for work history
│   │   ├── reviews/              ←   Moderate and publish testimonials
│   │   ├── messages/             ←   Read and manage contact inquiries
│   │   └── settings/             ←   Site taglines and descriptions
│   ├── sitemap.ts                ← Dynamic sitemap (/sitemap.xml)
│   ├── robots.ts                 ← Dynamic robots.txt
│   ├── globals.css               ← Global Tailwind v4 styles + CSS vars
│   ├── layout.tsx                ← Root HTML layout + dynamic SEO metadata
│   └── page.tsx                  ← Public visitor landing page (JSON-LD schema)
│
├── components/
│   ├── sections/                 ← Page sections (Hero, Projects, About…)
│   └── ui/                       ← Reusable atoms: Button, Card, Modal…
│
├── lib/
│   ├── supabase/                 ← Supabase client helpers
│   ├── api-server.ts             ← Server-side data fetch functions
│   └── animations.ts             ← Framer Motion variant presets
│
├── seeds/                        ← 🌱 Demo data for new developers
│   ├── profile.json              ←   Developer profile
│   ├── projects.json             ←   5 portfolio projects
│   ├── experience.json           ←   3 work history entries
│   ├── reviews.json              ←   8 client testimonials
│   ├── messages.json             ←   5 sample contact messages
│   ├── import-seeds.js           ←   Import script (run via npm run seed)
│   └── reset-seeds.js            ←   Reset/clear all data
├── public/                       ← Static files served as-is
│
├── database-schema.sql           ← ✅ THE only schema file — import this first
├── database_seeds.sql            ← Optional: SQL alternative to npm run seed
├── .env.example                  ← Template — copy to .env.local
├── package.json                  ← Dependencies & scripts (includes npm run seed)
└── tsconfig.json                 ← TypeScript config
```

### What to modify as a new developer:
- **`app/admin/about/`** — Set your real name, bio, social links, tech stacks.
- **`app/admin/projects/`** — Add your real projects.
- **`app/admin/experience/`** — Add your work history.
- **`app/globals.css`** — Change accent color variables if desired.

---

## 3. Requirements Before Deployment

### Software Requirements
| Requirement | Version | Notes |
|---|---|---|
| Node.js | v18 or higher | v20 LTS recommended |
| npm | v9 or higher | Bundled with Node.js |
| Git | Any | For cloning the repo |
| Supabase Account | Free tier works | [supabase.com](https://supabase.com) |

### Services Required
- **Supabase Project**: Free tier provides all features needed.
- **Vercel Account** *(for deployment)*: Free tier is sufficient.

### Environment Variables

Create a file called `.env.local` in the project root. **Never commit this file to Git.**

```bash
# .env.local

# --------------------------------------------------
# SUPABASE (Required)
# Get these from: Supabase → Project Settings → API
# --------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **IMPORTANT**: The `SUPABASE_SERVICE_ROLE_KEY` has admin privileges.
> It must **NEVER** be exposed to the browser or stored in a public repo.
> It is only used inside Next.js Server Actions (server-side code).

---

## 4. Installation Guide

Follow these steps in order. Each step builds on the previous.

### Step 1 — Clone the Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd portfolio
```

### Step 2 — Install Dependencies
```bash
npm install
```
This will install all packages listed in `package.json`.

### Step 3 — Configure Environment Variables
```bash
# Copy the example file
copy .env.example .env.local   # (Windows)
cp .env.example .env.local     # (Mac/Linux)
```
Then open `.env.local` and fill in your Supabase credentials (see Section 3).

### Step 4 — Set Up the Database
1. Log in to [supabase.com](https://supabase.com) and create a new project.
2. Wait ~2 minutes for it to provision.
3. Go to **Project Settings → API**.
4. Copy your **Project URL** and **anon key** into `.env.local`.
5. Also copy the **service_role** key.

### Step 5 — Import the Database Schema
1. In Supabase, go to the **SQL Editor** (left sidebar).
2. Click **New Query**.
3. Open `database-schema.sql` from this project, copy all content.
4. Paste it into the SQL Editor and click **Run**.

### Step 6 — Import Seed Data (Optional but Recommended)
1. In the SQL Editor, click **New Query** again.
2. Open `database_seeds.sql`, copy all content.
3. Paste and click **Run**.

This populates the site with professional dummy content instantly.

### Step 7 — Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

The Admin Panel is at [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard).

### Step 8 — Build for Production
```bash
npm run build
```
If the build succeeds, the project is ready to deploy.

### Step 9 — Deploy to Vercel
See [Section 12](#12-deployment-guide) for full deployment instructions.

---

## 5. Database Schema

The project uses **6 tables** in a Supabase PostgreSQL database.

### Table Overview
| Table | Purpose |
|---|---|
| `profile` | Developer identity: name, bio, avatar, social links, tech stack |
| `projects` | Portfolio items shown in the Projects section |
| `experience` | Career history shown in the Experience timeline |
| `reviews` | Visitor testimonials with moderation status |
| `messages` | Contact form submissions |
| `settings` | Site-wide text config (taglines, descriptions) |

### Schema Relationships
```
profile         (singleton — one row for the developer)
projects        (many rows — each a portfolio item)
experience      (many rows — each a career milestone)
reviews         (many rows — pending/published/archived)
messages        (many rows — visitor contact submissions)
settings        (key-value pairs — site configuration)
```

### How to Import
The schema file is: **`database-schema.sql`**

**Method A — Supabase SQL Editor (Easiest)**:
1. Open Supabase → SQL Editor → New Query
2. Paste entire contents of `database-schema.sql`
3. Click Run

**Method B — psql CLI (Advanced)**:
```bash
psql -h db.YOUR-PROJECT-ID.supabase.co -U postgres -d postgres -f database-schema.sql
```
*(Get the host from Supabase → Project Settings → Database)*

---

## 6. Data Import Guide

### Importing Schema
Follow Step 5 in the Installation Guide above.

### Importing Seed Data
```sql
-- In Supabase SQL Editor, run:
-- Contents of database_seeds.sql
```

### Importing via Supabase Dashboard (No SQL)
You can also import data using the **Table Editor** in Supabase:
1. Supabase → Table Editor → Select a table
2. Click **Insert Row** to manually add data

### Resetting Data
To clear all data and start fresh:
```sql
TRUNCATE TABLE projects, experience, reviews, messages, settings RESTART IDENTITY;
DELETE FROM profile;
```

---

## 7. Seed Data

The project ships with a complete seed data system to help new developers see a populated portfolio immediately after setup.

### Seed Files

| File | Records | Purpose |
| --- | --- | --- |
| `seeds/profile.json` | 1 | Developer identity, bio, social links, tech stacks |
| `seeds/projects.json` | 5 | Full-featured portfolio projects with stats |
| `seeds/experience.json` | 3 | Detailed career history entries |
| `seeds/reviews.json` | 8 | Client testimonials (all `published`) |
| `seeds/messages.json` | 5 | Sample contact form submissions |
| `database_seeds.sql` | — | SQL alternative (for manual Supabase import) |

### Option A — Automated Import (Recommended)

Run the bundled import script with a single command:

```bash
npm run seed
```

This connects to your Supabase project using your `.env.local` credentials and inserts all demo data automatically.

### Option B — SQL Import (Manual)

1. Open **Supabase → SQL Editor → New Query**
2. Open `database_seeds.sql`, copy all content
3. Paste and click **Run**

### How to Reset Demo Data

To wipe all seeded data and start fresh:

```bash
npm run seed:reset
```

Then re-run the seed:
```bash
npm run seed
```

### Verifying the Import

After seeding, open Supabase → Table Editor and confirm:

- `profile` → 1 row
- `projects` → 5 rows
- `experience` → 3 rows
- `reviews` → 8 rows (all `published`)
- `messages` → 5 rows

---

## 8. Demo Portfolio Preview

After importing seed data, the site displays this example portfolio:

### Developer Profile

```
Name:     Alex Ottoman
Role:     Lead Full-Stack Engineer
Tagline:  Architecting Premium Digital Ecosystems Through Code & Strategic Design
Email:    alex@ottomandev.com
```

### Sample Projects

| Project | Platforms | Key Feature |
| --- | --- | --- |
| Zenith Banking | Web | AI spending insights, Stripe integration |
| Nebula AI Platform | Web | GPT-4 + Stable Diffusion multi-modal SaaS |
| Aether Social | iOS, Android, Web | On-chain identity, creator monetization |
| Catalyst CRM | Web | Drag-and-drop Kanban, email automation |
| Momentum Fitness | iOS, Android | AI workout personalization, HealthKit sync |

### Sample Experience

| Company | Role | Period |
| --- | --- | --- |
| Apex Digital Studio | Lead Full-Stack Engineer | Mar 2023 – Present |
| Pixel Perfect Studio | Mid-Level Full-Stack Developer | Jun 2021 – Feb 2023 |
| InnovateTech Labs | Junior Software Engineer | Jan 2018 – May 2021 |

### Sample Reviews

8 published testimonials from clients across fintech, AI, and mobile verticals.

---

## 9. Updating Dependencies

### Check for Outdated Packages
```bash
npm outdated
```
This shows all packages that have newer versions available.

### Update All Packages (Patch & Minor)
```bash
npm update
```
This is safe to run — it only upgrades to non-breaking versions.

### Update a Specific Package
```bash
npm install package-name@latest
# Example:
npm install framer-motion@latest
npm install next@latest
```

### Update to a Specific Version
```bash
npm install next@16.1.6
```

### Fix Dependency Conflicts
```bash
npm install --legacy-peer-deps
```

### Full Clean Reinstall
```bash
# Delete node_modules and lock file, then reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 10. Database Connection Guide

### How the Connection Works
1. **Browser-side** (public reads): Uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` → RLS policies control what's readable.
2. **Server-side** (admin writes): Uses `SUPABASE_SERVICE_ROLE_KEY` → bypasses RLS for secure admin operations.

### Connection Files
| File | Purpose |
|---|---|
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server-side Supabase client (uses cookies for auth) |
| `lib/supabase/storage.ts` | File upload helpers |
| `app/admin/actions.ts` | Server Actions using the service role key |

### Example Connection Settings
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## 11. Authentication & Storage

### Authentication Model
This project uses a **service-role key** pattern for admin access rather than a full auth login system.

- All admin pages under `/admin/` issue writes using `SUPABASE_SERVICE_ROLE_KEY`.
- There is a `/admin/login` page that can be connected to Supabase Auth for a full login flow.
- For production, it is **strongly recommended** to enable Supabase Auth and add email/password login.

### Setting Up Storage (For File Uploads)
The project uses Supabase Storage for:
- Resume PDF uploads
- Project icons / screenshots
- Review customer photos

**Steps to create the storage bucket:**
1. Supabase → **Storage** → **New Bucket**
2. Name it `portfolio`
3. Set **Public Bucket** = ✅ Enabled
4. Save

Your `next.config.ts` already has the Supabase hostname whitelisted for `next/image`.

### Row Level Security (RLS)
RLS policies are included in `database-schema.sql`. Summary:

| Table | Anon (Visitor) | Authenticated (Admin) |
|---|---|---|
| `profile` | Read ✅ | Full Access ✅ |
| `projects` | Read ✅ | Full Access ✅ |
| `experience` | Read ✅ | Full Access ✅ |
| `reviews` | Read published ✅ | Full Access ✅ |
| `messages` | Insert only ✅ | Full Access ✅ |
| `settings` | Read ✅ | Full Access ✅ |

---

## 12. Deployment Guide

### Option A — Vercel (Recommended — Free)

1. Push your code to a **GitHub** repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo.
3. In the Vercel dashboard, go to **Settings → Environment Variables**.
4. Add all three variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**.

> Vercel auto-detects Next.js. No build command configuration needed.

Every time you push to `main`, Vercel auto-deploys.

---

### Option B — Netlify

1. Push to GitHub.
2. Netlify → **Add New Site → Import from Git**.
3. Set **Build command**: `npm run build`
4. Set **Publish directory**: `.next`
5. Add environment variables in **Site Settings → Environment**.
6. Deploy.

---

### Option C — VPS / Self-Hosted

```bash
# 1. Clone on the server
git clone https://github.com/your-username/your-repo.git
cd portfolio

# 2. Install
npm install

# 3. Create .env.local with your credentials
nano .env.local

# 4. Build
npm run build

# 5. Start production server
npm start
# App runs on port 3000 by default

# Optional: use PM2 to keep it alive
npm install -g pm2
pm2 start "npm start" --name ottoman-portfolio
pm2 save
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

## 13. Troubleshooting

### ❌ Error: Could not find column 'xyz' in schema cache
**Cause**: The column name in code doesn't match the actual database column.
**Fix**: Open Supabase → Table Editor, check the exact column names.
In `app/admin/actions.ts`, ensure every key in the save payload exactly matches a database column.

---

### ❌ Error: missing environment variable NEXT_PUBLIC_SUPABASE_URL
**Cause**: `.env.local` file is missing or misnamed.
**Fix**:
```bash
# Check the file exists
ls .env.local   # Mac/Linux
dir .env.local  # Windows
```
Ensure there are no typos in variable names and no spaces around the `=` sign.

---

### ❌ Error: new row violates row-level security policy
**Cause**: You're trying to write data using the anon key, which is blocked by RLS.
**Fix**: All write operations (save, delete, update) must go through Next.js **Server Actions** that use the `SUPABASE_SERVICE_ROLE_KEY`. Never perform admin writes from client-side components.

---

### ❌ Build fails with TypeScript errors
**Fix**:
```bash
npm run lint
npx tsc --noEmit
```
Review the errors listed, correct type mismatches, and re-run.

---

### ❌ Images not loading
**Cause**: The image hostname is not whitelisted in `next.config.ts`.
**Fix**: Add the hostname to the `remotePatterns` array in `next.config.ts`:
```typescript
{ protocol: 'https', hostname: 'your-image-host.com', pathname: '/**' }
```

---

### ❌ Admin Panel shows blank page on mobile
**Cause**: The mobile header may be obscuring the content.
**Fix**: Ensure the main content area has `pt-24` padding on mobile to clear the fixed header.

---

### ❌ Seeds block on profile insert
**Cause**: A profile row may already exist with the same UUID.
**Fix**: The seeds use `ON CONFLICT (id) DO UPDATE`, so re-running is safe. If it still fails, delete the existing profile row first via Table Editor.

---

## 14. Final Verification Checklist

Before going live, confirm every item below:

```
SETUP
[ ] Node.js v18+ is installed
[ ] npm install completed without errors
[ ] .env.local is populated with real Supabase credentials

DATABASE
[ ] database-schema.sql was imported successfully (all 6 tables exist)
[ ] database_seeds.sql was imported (profile, projects, experience, reviews visible)
[ ] Supabase Storage bucket 'portfolio' created and set to Public

DEVELOPMENT
[ ] npm run dev starts without errors
[ ] Visitor site loads at http://localhost:3000
[ ] Projects section shows seed data
[ ] Reviews section shows published reviews
[ ] Contact form submits a message to Supabase

ADMIN PANEL
[ ] /admin/dashboard loads
[ ] Can create, edit, delete a project
[ ] Can create, edit, delete an experience entry
[ ] Can publish/archive a review
[ ] Can view and change message status
[ ] About Me page saves profile data (including Site Title)
[ ] Site Favicon can be uploaded and updated
[ ] Settings page updates site taglines

SEO & BRANDING
[ ] Browser tab shows the custom Site Title
[ ] Browser tab shows the custom Favicon
[ ] /sitemap.xml is accessible and contains the base URL
[ ] /robots.txt is accessible and disallows /admin/
[ ] Page source includes JSON-LD Person schema
[ ] Open Graph and Twitter meta tags are present in <head>

PRODUCTION BUILD
[ ] npm run build completes with zero errors
[ ] All environment variables added to hosting platform
[ ] Deployed URL loads the visitor site correctly
[ ] Admin Panel works on the deployed URL
```


---

## 15. SEO Configuration

The portfolio is pre-optimized for search engines using modern Next.js 16 best practices.

### Dynamic Metadata
Located in `app/layout.tsx`. It automatically fetches your profile data to set:
- **Title**: Your custom `site_title` from the database.
- **Description**: Your primary tagline.
- **Open Graph / Twitter**: Social sharing cards with your avatar and bio.
- **Canonical URLs**: Automatically generated based on `NEXT_PUBLIC_SITE_URL`.

### Search Engine Crawling
- **Sitemap**: Generated dynamically at `/sitemap.xml`.
- **Robots.txt**: Located at `/robots.txt`. It encourages indexing of the main site while protecting the `/admin/` area.

### Structured Data (JSON-LD)
The main landing page (`app/page.tsx`) injects a **Schema.org Person** object. This helps Google understand your professional identity, social profiles, and role.

---

## 16. Dynamic Branding (Title & Favicon)

You can maintain your brand identity directly from the Admin Panel without touching code.

### Changing the Browser Tab Title
1. Navigate to **Admin Panel → About Me**.
2. Locate the **Search & Branding** section.
3. Update the **Browser Tab Title** field.
4. Click **Save Changes**.

### Updating the Site Favicon
1. Navigate to **Admin Panel → About Me**.
2. In the **Search & Branding** section, click **Change Icon**.
3. Upload a square image (recommended: 32x32 or 64x64 PNG/ICO).
4. The system automatically:
   - Compresses the image for performance.
   - Uploads it to Supabase Storage.
   - Updates your site's metadata instantly.

## 17. Case Study Markdown

The portfolio supports **GitHub Flavored Markdown** for project case studies. This allows you to format your deep-dives with headers, lists, code blocks, and more.

### How to use Markdown:
1. Navigate to **Admin Panel → Projects**.
2. Edit an existing project or create a new one.
3. In the **Case Study (Markdown)** field, enter your content using standard markdown syntax:
   ```markdown
   # Project Overview
   
   A brief description of what was achieved.
   
   ## Core Features
   - Feature 1
   - Feature 2
   
   ### Technical Implementation
   ```javascript
   // Sample code block
   const project = "Ottoman";
   ```
4. Click **Save Changes**.

Instantly, the visitor-facing project popup will render this content with premium, polished styling.

---

*Generated for Ottoman Portfolio — March 2026*
*Report issues in the project repository.*
