# Ottoman Portfolio — Complete Deployment & Setup Guide

> **Audience:** Developers setting up this project for the first time. No prior knowledge of the codebase is assumed.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Requirements](#2-system-requirements)
3. [Installation Steps](#3-installation-steps)
4. [Dependency Management](#4-dependency-management)
5. [Database Setup](#5-database-setup)
6. [Database Schema](#6-database-schema)
7. [Seed Data](#7-seed-data)
8. [Dummy Portfolio Content](#8-dummy-portfolio-content)
9. [Storage & File Upload Setup](#9-storage--file-upload-setup)
10. [Authentication Setup](#10-authentication-setup)
11. [Project Structure](#11-project-structure)
12. [Environment Variables Template](#12-environment-variables-template)
13. [Troubleshooting](#13-troubleshooting)
14. [Verification Checklist](#14-verification-checklist)

---

## 1. Project Overview

**Ottoman Portfolio** is a full-stack personal portfolio website designed to be managed entirely through a custom Admin Panel — no code editing required after initial setup.

### Key Features

| Feature | Description |
|---|---|
| 🎨 **Premium Visitor Site** | Animated hero, project showcase, about, experience, reviews, and contact sections |
| 🛠️ **Admin Panel** | A full CRUD dashboard at `/admin` for managing all content |
| 📝 **Projects Management** | Add / edit / delete portfolio projects with tech stacks, bullet highlights, and stats |
| 💼 **Experience Management** | Manage work history with timeline, achievements, and technologies |
| ⭐ **Reviews Moderation** | Approve, archive, or manually create client testimonials |
| 📬 **Inquiries Inbox** | View and manage contact form submissions |
| 🌗 **Dark / Light Mode** | System-aware theme with toggle |
| 📱 **Fully Responsive** | Looks great on mobile, tablet, and desktop |
| ⚡ **Performance First** | Built with Next.js App Router and Turbopack for fast builds |

### Tech Stack

- **Frontend / Backend:** Next.js 16 (App Router, React Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Database:** Supabase (PostgreSQL)
- **File Storage:** Supabase Storage
- **Deployment:** Vercel (recommended)

---

## 2. System Requirements

Before you begin, ensure your system has the following installed.

### Runtime

| Tool | Minimum Version | Check Command |
|---|---|---|
| **Node.js** | `≥ 20.x LTS` | `node -v` |
| **npm** | `≥ 10.x` | `npm -v` |

> **Windows users:** Install Node.js via [nodejs.org](https://nodejs.org) or using [nvm-windows](https://github.com/coreybutler/nvm-windows).  
> **macOS/Linux users:** Use [nvm](https://github.com/nvm-sh/nvm) for easy version switching.

### External Services

| Service | Purpose | Free Tier? |
|---|---|---|
| **Supabase** | PostgreSQL database + storage + auth | ✅ Yes |
| **GitHub** (optional) | For avatar images via GitHub API | ✅ Yes |
| **Vercel** (optional) | Deployment platform | ✅ Yes |

### Environment Variables (required)

```
NEXT_PUBLIC_SUPABASE_URL       # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY      # Supabase service role key (admin operations)
```

---

## 3. Installation Steps

### Step 1 — Clone the Repository

```bash
# Via HTTPS
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME/portfolio

# Via SSH
git clone git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME/portfolio
```

### Step 2 — Install Dependencies

```bash
npm install
```

This will install all packages listed in `package.json` including Next.js, Tailwind CSS, Supabase client, Framer Motion, and others.

### Step 3 — Configure Environment Variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

> ⚠️ **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

### Step 4 — Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

The Admin Panel is available at [http://localhost:3000/admin](http://localhost:3000/admin).

### Step 5 — Build for Production

```bash
npm run build
npm run start
```

Or deploy directly to Vercel (see [Authentication Setup](#10-authentication-setup) for Vercel environment variables).

---

## 4. Dependency Management

### Updating All Packages

```bash
# Check which packages are outdated
npm outdated

# Update all packages to their latest allowed versions (respects semver)
npm update

# Force update a specific package to its latest version
npm install package-name@latest
```

### Installing a New Package

```bash
# Production dependency
npm install package-name

# Development-only dependency
npm install --save-dev package-name
```

### Rebuilding the Lock File

If `package-lock.json` is corrupted or you want a clean install:

```bash
# Delete node_modules and lock file
rm -rf node_modules package-lock.json   # macOS/Linux
rmdir /s /q node_modules & del package-lock.json  # Windows CMD

# Reinstall from scratch
npm install
```

### Handling Version Conflicts

If you see `ERESOLVE` errors during install:

```bash
# Option 1: Let npm resolve conflicts automatically
npm install --legacy-peer-deps

# Option 2: Force install (not recommended for production)
npm install --force
```

To pin a package to a specific version:

```bash
npm install package-name@1.2.3
```

---

## 5. Database Setup

This project uses **Supabase** (PostgreSQL) as its database.

### Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**.
3. Choose a name, strong database password, and region closest to your users.
4. Wait ~2 minutes for the project to initialise.

### Step 2 — Get Your API Keys

In your Supabase project dashboard:

1. Go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
3. Paste them into your `.env.local` file.

> ⚠️ The **service_role key** has full database access. Never expose it on the client side or in public repositories.

### Step 3 — Create the Database Tables

1. In your Supabase project, open **SQL Editor**.
2. Click **New Query**.
3. Open the `database_schema.sql` file from this project.
4. Paste the entire contents into the editor.
5. Click **Run**.

You should see all tables created with Row Level Security enabled.

### Step 4 — (Optional) Load Seed Data

To populate the database with realistic example data:

1. In the Supabase SQL Editor, create a new query.
2. Open `database_seeds.sql` from this project.
3. Paste and run.

> This will insert a sample profile, 5 projects, 3 work experiences, 8 reviews, and 3 contact messages.

### Step 5 — Configure Storage Bucket

For review photos and resume uploads:

1. In Supabase, go to **Storage**.
2. Click **New Bucket**.
3. Name it `portfolio-assets`.
4. Check **Public bucket** (so uploaded images are accessible via URL).
5. Click **Create Bucket**.

#### Storage Policies

In the SQL Editor, run:

```sql
-- Allow public reads
CREATE POLICY "Public read for portfolio-assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-assets');

-- Allow authenticated uploads (admin)
CREATE POLICY "Admin upload for portfolio-assets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-assets');

-- Allow authenticated deletes (admin)
CREATE POLICY "Admin delete for portfolio-assets"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-assets');
```

### Step 6 — Configure Allowed Image Domains

Open `next.config.ts` and add your Supabase storage domain:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'YOUR_PROJECT_ID.supabase.co', // Replace with your project ID
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
};
```

---

## 6. Database Schema

The complete database schema is in **`database_schema.sql`** at the project root.

### Tables Summary

| Table | Purpose |
|---|---|
| `projects` | Portfolio projects (name, description, tech stack, stats) |
| `experience` | Work history (company, role, dates, responsibilities) |
| `profile` | About Me data (name, tagline, social links, tech stacks) |
| `reviews` | Client testimonials with moderation status |
| `messages` | Contact form submissions |
| `settings` | Key/value store for dynamic site configuration (taglines, etc.) |

### Table Details

**`projects`**
```
id              UUID        PRIMARY KEY
name            TEXT        NOT NULL
description     TEXT        NOT NULL  (short summary)
full_description TEXT        NOT NULL  (long description)
languages       TEXT[]      e.g. {TypeScript, Python}
platforms       TEXT[]      e.g. {Web, iOS}
github_url      TEXT
vibrant_color   TEXT        hex color for UI accent
bullets         TEXT[]      highlight bullet points
stats           JSONB       [{label, value}]
created_at      TIMESTAMPTZ
```

**`experience`**
```
id           UUID    PRIMARY KEY
company      TEXT    NOT NULL
position     TEXT    NOT NULL
start_date   TEXT    e.g. "Jan 2022"
end_date     TEXT    e.g. "Present"
location     TEXT
description  TEXT[]  bullet responsibilities
technologies TEXT[]  tech stack
achievements TEXT[]  notable wins
created_at   TIMESTAMPTZ
```

**`profile`**
```
id                      UUID
name                    TEXT  Developer name
tagline                 TEXT  Hero tagline
bio                     TEXT  Long bio
core_values             JSONB [{icon, title, description}]
metrics                 JSONB {apps_delivered, happy_clients}
social_links            JSONB {github, linkedin, twitter, instagram}
tech_stacks             JSONB {Languages:[...], Frameworks:[...]}
avatar_url              TEXT  GitHub avatar or uploaded image
resume_url              TEXT  Supabase Storage URL
contact_email           TEXT
whatsapp_number         TEXT
apps_delivered          INT
happy_clients           INT
```

**`reviews`**
```
id             UUID
customer_name  TEXT    NOT NULL
review_text    TEXT    NOT NULL
customer_photo TEXT    Supabase Storage URL (nullable)
is_verified    BOOLEAN default false
status         TEXT    pending | published | archived
created_at     TIMESTAMPTZ
```

**`settings`**
```
key        TEXT    PRIMARY KEY  (e.g. "site_content")
value      JSONB               (JSON object with sub-fields)
updated_at TIMESTAMPTZ
```

Important `settings` keys:
- `site_content.contact_description` — shown under "Let's Connect"
- `site_content.projects_tagline` — Projects section subtitle
- `site_content.narrative_tagline` — About section subtitle

### Importing the Schema

```bash
# Using psql CLI (if you have it installed)
psql -h db.YOUR_PROJECT_ID.supabase.co \
     -U postgres \
     -d postgres \
     -f database_schema.sql
```

Or via the Supabase SQL Editor (recommended for beginners).

---

## 7. Seed Data

**`database_seeds.sql`** contains realistic dummy data to populate all tables instantly.

### What's Included

| Table | Records |
|---|---|
| `profile` | 1 complete profile (Alex Morgan) |
| `projects` | 5 real-world projects with stats |
| `experience` | 3 work experiences |
| `reviews` | 8 client testimonials |
| `messages` | 3 sample contact messages |

### How to Import

1. Open Supabase SQL Editor.
2. Paste contents of `database_seeds.sql`.
3. Click **Run**.

> ⚠️ Run `database_schema.sql` first before running seeds.

---

## 8. Dummy Portfolio Content

The seed data uses the following fictional developer persona — feel free to replace all content via the Admin Panel after setup.

### Sample Profile

- **Name:** Alex Morgan
- **Tagline:** "Architecting premium digital ecosystems through code and strategic design."
- **Email:** alex@example.com
- **Skills:** TypeScript, Python, Dart, Next.js, Flutter, Supabase, Docker

### Sample Projects

| Project | Stack | Highlight |
|---|---|---|
| TradeFlow Dashboard | TypeScript, Python, PostgreSQL | Real-time SaaS analytics for traders |
| Petto – Pet Care App | Flutter, Dart | 28K downloads, 4.8★ rating |
| OmniBlog CMS | TypeScript, GraphQL | Headless CMS with visual editor |
| ShipItFast CLI | TypeScript, Node.js | 3.2K GitHub stars CLI scaffolding tool |
| Kanbu – Inventory System | TypeScript, Python | Barcode scanning, warehouse management |

### Sample Experiences

1. **NovaTech Solutions** — Senior Full-Stack Developer (2022–Present)
2. **Pixel & Code Agency** — Full-Stack Developer (2020–2022)
3. **Freelance** — Mobile App Developer (2018–2020)

---

## 9. Storage & File Upload Setup

### What Uses Storage

| Feature | File Type | Where Uploaded |
|---|---|---|
| Review customer photos | JPEG/PNG | `portfolio-assets/review-photos/` |
| Developer avatar | JPEG/PNG | External URL (GitHub avatar recommended) |
| Resume / CV | PDF | `portfolio-assets/resumes/` |

### Supabase Storage Configuration

1. Create a bucket named `portfolio-assets` (see [Database Setup](#step-5--configure-storage-bucket)).
2. Set bucket to **Public**.
3. Apply the storage RLS policies from the SQL above.

### File Size Limits

| Type | Max Size |
|---|---|
| Review photos | 1 MB |
| Resume PDF | 5 MB |

File size validation is enforced on the admin upload inputs.

### Uploaded File URL Format

Files uploaded to Supabase Storage are accessible at:

```
https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/portfolio-assets/FILEPATH
```

---

## 10. Authentication Setup

### How Authentication Works

This project uses a **simple admin path** at `/admin` without a formal login screen. Admin operations (creating, editing, deleting content) are secured at the API level using the **Supabase Service Role Key**, which is stored as a server-side environment variable and never exposed to the browser.

> The visitor-facing site is completely public. The admin panel is protected only by the fact that it requires server-side secrets to write data.

### Adding a Login Screen (Recommended for Production)

If you want to add a real login screen:

1. Enable **Email Auth** in Supabase → Authentication → Providers.
2. Create an admin user in Supabase → Authentication → Users.
3. Add middleware to `middleware.ts` to check session before allowing `/admin` routes.

### Supabase Auth Configuration

In your Supabase dashboard:

1. Go to **Authentication → Settings**
2. Set **Site URL** to your production domain (e.g. `https://yourdomain.com`)
3. Add `http://localhost:3000` to **Additional Redirect URLs** for development

### Environment Variables for Auth

No additional environment variables are needed for the current setup. The three keys in `.env.local` cover all admin operations.

---

## 11. Project Structure

```
portfolio/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root HTML layout (fonts, theme provider)
│   ├── page.tsx                 # Main visitor home page
│   ├── globals.css              # Global styles + Tailwind base
│   └── admin/                   # Protected admin panel
│       ├── page.tsx             # Admin dashboard overview
│       ├── actions.ts           # Server Actions for admin writes (uses service role)
│       ├── about/
│       │   ├── page.tsx         # Edit profile, taglines, tech stacks
│       │   └── actions.ts       # Save profile + settings server action
│       ├── projects/
│       │   └── page.tsx         # Add/edit/delete projects
│       ├── experience/
│       │   └── page.tsx         # Add/edit/delete work experience
│       ├── reviews/
│       │   └── page.tsx         # Moderation dashboard for testimonials
│       └── inquiries/
│           └── page.tsx         # View contact form messages
│
├── components/
│   ├── sections/                # Major visitor page sections
│   │   ├── Hero.tsx             # Landing hero with name and tagline
│   │   ├── Projects.tsx         # Project cards grid
│   │   ├── About.tsx            # About Me / core values section
│   │   ├── Experience.tsx       # Timeline of work history
│   │   ├── Reviews.tsx          # Client testimonials grid
│   │   └── Contact.tsx          # Contact form + info
│   └── ui/                      # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── SectionHeading.tsx
│       ├── ProjectCard.tsx
│       ├── ReviewForm.tsx       # Visitor review submission modal
│       └── ...
│
├── lib/
│   ├── api.ts                   # Client-side Supabase fetch functions
│   ├── api-server.ts            # Server-side Supabase fetch functions
│   ├── animations.ts            # Framer Motion animation presets
│   └── supabase/
│       ├── client.ts            # Browser Supabase client
│       └── server.ts            # Server Supabase client (uses cookies)
│
├── data/
│   ├── projects.ts              # Static fallback project data
│   └── experience.ts            # Static fallback experience data
│
├── public/                      # Static assets (favicon, images)
│
├── database_schema.sql          # ← Complete DB schema to import
├── database_seeds.sql           # ← Sample data to import
├── .env.example                 # ← Copy to .env.local and fill in
├── next.config.ts               # Next.js config (allowed image domains)
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

---

## 12. Environment Variables Template

Copy this to `.env.local` and fill in your values.

```env
# ========================================================
# SUPABASE — Required for all database operations
# Get these from: supabase.com → Your Project → Settings → API
# ========================================================

# Your project URL (safe to expose, it's public)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co

# Anon/public key (safe to expose, protected by RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key — KEEP SECRET — never expose on client side
# Used by Server Actions for admin writes that bypass RLS
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Never add `SUPABASE_SERVICE_ROLE_KEY` to any client-side code or expose it in git.

---

## 13. Troubleshooting

### ❌ Database connection failure

**Symptom:** Pages load with fallback static data, or console shows `Error fetching from Supabase`.

**Solutions:**
1. Verify `.env.local` exists and is not named `.env` (the project requires `.env.local`).
2. Confirm `NEXT_PUBLIC_SUPABASE_URL` starts with `https://` and ends with `.supabase.co`.
3. Check that the Supabase project is active (not paused) in your Supabase dashboard.
4. Restart the dev server after changing environment variables: `Ctrl+C` → `npm run dev`.

---

### ❌ "Could not find column 'X' in the schema cache"

**Symptom:** Admin save operations fail with a schema cache error.

**Solutions:**
1. The database schema may be out of date. Re-run `database_schema.sql` in the SQL Editor.
2. If a column was recently added, Supabase may need a moment to refresh. Wait 30 seconds and retry.
3. Verify the column name in the SQL schema file matches exactly what the code sends.

---

### ❌ npm install fails / ERESOLVE error

**Solution:**
```bash
npm install --legacy-peer-deps
```

If using Node.js <20, upgrade Node first:
```bash
# Using nvm
nvm install 20
nvm use 20
npm install
```

---

### ❌ Build error: `Module not found`

**Solution:**
```bash
# Clean build cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

---

### ❌ Images not loading (broken image icons)

**Symptom:** Review photos or avatar images show as broken.

**Solutions:**
1. Ensure `next.config.ts` includes your Supabase storage hostname under `remotePatterns`.
2. Verify the Supabase Storage bucket is set to **Public**.
3. Check the image URL in the database is correct and accessible in a browser.

---

### ❌ Changes in `.env.local` not taking effect

Next.js only reads `.env.local` at startup. After any change:
```bash
# Stop the dev server (Ctrl+C) and restart
npm run dev
```

---

### ❌ Admin panel not saving data ("Row Level Security" error)

**Symptom:** Console shows an RLS or permission error when saving from the admin panel.

**Solutions:**
1. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`.
2. This key must **not** start with `NEXT_PUBLIC_` — it must remain server-side only.
3. Confirm the key is the `service_role` key and not the `anon` key (they look similar).

---

### ❌ Dark mode not working

The theme is controlled by the `ThemeProvider` component and stored in `localStorage`. If it's not persisting:
1. Hard refresh the page: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (macOS).
2. Clear browser localStorage for the site.

---

## 14. Verification Checklist

Use this checklist to confirm your deployment is complete and working correctly.

### Environment Setup
- [ ] Node.js v20+ is installed (`node -v`)
- [ ] npm v10+ is installed (`npm -v`)
- [ ] `.env.local` file exists with all three Supabase keys filled in
- [ ] `npm install` completed without errors

### Database
- [ ] Supabase project is created and ACTIVE (green status)
- [ ] `database_schema.sql` has been run in the SQL Editor
- [ ] All 6 tables are visible under **Table Editor** in Supabase
- [ ] Row Level Security is enabled for all tables
- [ ] Supabase Storage bucket `portfolio-assets` exists and is set to Public
- [ ] Storage RLS policies have been applied

### Visitor Site
- [ ] `npm run dev` starts without errors
- [ ] [http://localhost:3000](http://localhost:3000) loads the portfolio home page
- [ ] Hero section shows the developer name and tagline
- [ ] Projects section loads data (or shows empty state if no projects added yet)
- [ ] Contact form submits without errors

### Admin Panel
- [ ] [http://localhost:3000/admin](http://localhost:3000/admin) loads the dashboard
- [ ] Profile can be saved without errors (Admin → About Me → Save)
- [ ] A new project can be created (Admin → Projects → Add New Project)
- [ ] A new experience can be created (Admin → Experience → Add Experience)
- [ ] Reviews tab shows seeded reviews (if seed was run)
- [ ] Inquiries page shows contact messages

### Production Build
- [ ] `npm run build` completes without errors
- [ ] `npm run start` serves the production build correctly
- [ ] All environment variables are configured in your hosting platform (Vercel, etc.)

---

## Deployment to Vercel (Recommended)

1. Push your code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **New Project**.
3. Import your GitHub repository.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**.

Vercel automatically detects Next.js and configures the build command (`next build`) and output directory (`.next`).

---

*Generated for the Ottoman Portfolio project. Last updated: March 2026.*
