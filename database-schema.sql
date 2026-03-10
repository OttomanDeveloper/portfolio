-- ============================================================
-- OTTOMAN PORTFOLIO — COMPLETE DATABASE SCHEMA
-- Supabase / PostgreSQL
-- Updated: 2026-03-10
-- ============================================================
-- HOW TO IMPORT:
--   1. Log into your Supabase project → open SQL Editor
--   2. Paste this entire file and click "Run"
--   OR
--   3. Use psql: psql -h <host> -U postgres -d postgres -f database-schema.sql
-- ============================================================

-- Enable UUID extension (Supabase enables this by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROJECTS TABLE
-- Stores portfolio projects visible on the visitor site.
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name             TEXT        NOT NULL,
    description      TEXT        NOT NULL,                       -- Short one-line summary
    full_description TEXT        NOT NULL,                       -- Long markdown-safe description
    languages        TEXT[]      NOT NULL DEFAULT '{}',          -- e.g. {React, TypeScript}
    platforms        TEXT[]      NOT NULL DEFAULT '{}',          -- e.g. {Web, iOS}
    github_url       TEXT        NOT NULL DEFAULT '',
    live_url         TEXT        DEFAULT '',
    vibrant_color    TEXT        NOT NULL DEFAULT '#818cf8',     -- Hex color for card accent
    bullets          TEXT[]      NOT NULL DEFAULT '{}',          -- Highlight bullet points
    stats            JSONB       DEFAULT '[]'::jsonb,            -- [{label, value}]
    created_at       TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ============================================================
-- 2. EXPERIENCE TABLE
-- Stores work history displayed in the Experience section.
-- ============================================================
CREATE TABLE IF NOT EXISTS experience (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    company      TEXT        NOT NULL,
    position     TEXT        NOT NULL,
    start_date   TEXT        NOT NULL,                           -- e.g. "Jan 2022"
    end_date     TEXT        NOT NULL DEFAULT 'Present',         -- e.g. "Present"
    location     TEXT        NOT NULL DEFAULT 'Remote',
    description  TEXT[]      NOT NULL DEFAULT '{}',              -- Bullet responsibilities
    technologies TEXT[]      NOT NULL DEFAULT '{}',              -- Tech stack used
    achievements TEXT[]      DEFAULT '{}',                       -- Notable achievements
    created_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ============================================================
-- 3. PROFILE TABLE
-- Stores the developer's About Me and site branding info.
-- ============================================================
CREATE TABLE IF NOT EXISTS profile (
    id                      UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                    TEXT        NOT NULL DEFAULT '',               -- Developer full name
    tagline                 TEXT        NOT NULL DEFAULT '',               -- Hero tagline
    bio                     TEXT        NOT NULL DEFAULT '',               -- Professional narrative
    philosophy              TEXT        NOT NULL DEFAULT '',               -- Philosophy quote
    avatar_url              TEXT        DEFAULT '',
    resume_url              TEXT        DEFAULT '',
    contact_email           TEXT        DEFAULT '',
    whatsapp_number         TEXT        DEFAULT '',
    youtube_url             TEXT        DEFAULT '',
    social_links            JSONB       DEFAULT '{}'::jsonb,               -- {github, linkedin, twitter, instagram}
    tech_stacks             JSONB       DEFAULT '{}'::jsonb,               -- {frontend:[...], backend:[...]}
    apps_delivered          INT         DEFAULT 0,
    happy_clients           INT         DEFAULT 0,
    experience_start_date   TEXT        DEFAULT '',
    manual_years_experience INT         DEFAULT NULL,
    narrativeTagline        TEXT        DEFAULT '',
    site_title              TEXT        DEFAULT '',                         -- Browser tab title (SEO)
    favicon_url             TEXT        DEFAULT '',                         -- Favicon URL (SEO)
    updated_at              TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- ============================================================
-- 4. MESSAGES TABLE
-- Stores contact form submissions from visitors.
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       TEXT        NOT NULL,
    email      TEXT        NOT NULL,
    subject    TEXT,
    message    TEXT        NOT NULL,
    status     TEXT        NOT NULL DEFAULT 'unread',            -- unread | read | replied
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ============================================================
-- 5. REVIEWS TABLE
-- Stores client testimonials.
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name  TEXT        NOT NULL,
    review_text    TEXT        NOT NULL,
    customer_photo TEXT        DEFAULT NULL,                     -- Supabase Storage URL
    is_verified    BOOLEAN     DEFAULT false,
    status         TEXT        NOT NULL DEFAULT 'pending',       -- pending | published | archived
    created_at     TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ============================================================
-- 6. SETTINGS TABLE
-- Key/value store for dynamic site configuration.
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
    key        TEXT        PRIMARY KEY,
    value      JSONB       NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- ============================================================
-- DEFAULT SETTINGS DATA
-- ============================================================
INSERT INTO settings (key, value) VALUES
('experience_config', '{"auto_increment": true, "start_year": 2018, "manual_override": null}'),
('site_content', '{
  "contact_description": "I am currently open to new opportunities and freelance projects. Feel free to reach out!",
  "projects_tagline": "A curated selection of my recent works, ranging from mobile applications to complex web systems.",
  "narrative_tagline": "A specialized window into the vision, metrics, and technological foundation I bring to every project."
}')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE projects   ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile    ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews    ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings   ENABLE ROW LEVEL SECURITY;

-- Public read access (visible to all site visitors)
CREATE POLICY "Public read access for projects"     ON projects   FOR SELECT USING (true);
CREATE POLICY "Public read access for experience"   ON experience FOR SELECT USING (true);
CREATE POLICY "Public read access for profile"      ON profile    FOR SELECT USING (true);
CREATE POLICY "Public read for published reviews"   ON reviews    FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access for settings"     ON settings   FOR SELECT USING (true);

-- Visitors can submit contact messages and reviews
CREATE POLICY "Public insert for messages"          ON messages   FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert for reviews"           ON reviews    FOR INSERT WITH CHECK (status = 'pending');

-- Admin full access (requires authenticated service role key)
CREATE POLICY "Admin full access for projects"      ON projects   ALL TO authenticated USING (true);
CREATE POLICY "Admin full access for experience"    ON experience ALL TO authenticated USING (true);
CREATE POLICY "Admin full access for profile"       ON profile    ALL TO authenticated USING (true);
CREATE POLICY "Admin full access for messages"      ON messages   ALL TO authenticated USING (true);
CREATE POLICY "Admin full access for reviews"       ON reviews    ALL TO authenticated USING (true);
CREATE POLICY "Admin full access for settings"      ON settings   ALL TO authenticated USING (true);

-- ============================================================
-- INDEXES (for query performance)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_reviews_status      ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at  ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_status     ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_updated_at  ON profile(updated_at DESC);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
