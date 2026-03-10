# Ottoman Portfolio

A full-stack, production-grade developer portfolio built with **Next.js 16**, **Supabase**, **Tailwind CSS v4**, and **Framer Motion**. 
Designed to be fast, beautiful, and fully manageable without touching a single line of code.

## ✨ Features

- 🎨 **Premium visitor site** — animated Hero, Projects grid, Experience timeline, Reviews carousel, Contact form
- 🔧 **Full Admin Panel** at `/admin/` — manage all content in real time without code changes
- 📱 **Fully responsive** — optimized for desktop, tablet, and mobile
- ⚡ **Performance first** — mobile-optimized animations, no unnecessary backdrop-blur, buttery smooth UI
- 🗄️ **Supabase-powered** — PostgreSQL database, file storage, and optional authentication
- 🔍 **SEO ready** — dynamic `<title>`, meta descriptions, Open Graph, JSON-LD Person schema, sitemap, robots.txt — all driven from the database
- 🖼️ **Dynamic branding** — change the browser tab title and favicon directly from the Admin Panel
- 📝 **Markdown case studies** — write rich project deep-dives with GitHub Flavored Markdown
- 🔒 **Secure by design** — Row Level Security on all tables, service role key server-side only

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
copy .env.example .env.local    # Windows
cp .env.example .env.local      # Mac/Linux
# Fill in your Supabase credentials (see deployment guide)

# 3. Import the database schema
# Open deployment_guide/schema.sql -> paste into Supabase SQL Editor -> Run

# 4. Seed with demo data
npm run seed

# 5. Start development server
npm run dev
```

- **Visitor Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/dashboard

## 📖 Full Deployment Guide

All setup, deployment, and maintenance instructions are in a single file:

**[deployment_guide/DEPLOYMENT_GUIDE.md](./deployment_guide/DEPLOYMENT_GUIDE.md)**

Covers everything:
- Prerequisites & step-by-step installation
- Supabase database setup (schema, storage, RLS)
- Environment variable configuration
- Deploying to Vercel, Netlify, VPS, or Docker
- SEO, branding, and Markdown case studies
- Troubleshooting, security, and maintenance

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Database & Storage | Supabase (PostgreSQL) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Toasts | Sonner |
| Analytics | @vercel/speed-insights |
| Deployment | Vercel (recommended) |

## 📜 NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Import demo data into Supabase |
| `npm run seed:reset` | Clear all database content |

## 📁 Key Files

| File | Purpose |
|---|---|
| `deployment_guide/DEPLOYMENT_GUIDE.md` | Complete setup & deployment guide |
| `deployment_guide/schema.sql` | Full PostgreSQL database schema |
| `deployment_guide/seeds_import.sql` | SQL seed data (alternative to npm run seed) |
| `.env.example` | Template for required environment variables |
