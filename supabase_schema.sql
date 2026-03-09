-- SUPABASE DATABASE SCHEMA FOR PORTFOLIO

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    languages TEXT[] NOT NULL,
    platforms TEXT[] NOT NULL,
    github_url TEXT NOT NULL,
    live_url TEXT DEFAULT '',
    vibrant_color TEXT NOT NULL,
    bullets TEXT[] NOT NULL,
    stats JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Experience Table
CREATE TABLE IF NOT EXISTS experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT[] NOT NULL,
    technologies TEXT[] NOT NULL,
    achievements TEXT[] DEFAULT '[]'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Profile / About Me Table
CREATE TABLE IF NOT EXISTS profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bio TEXT NOT NULL,
    core_values JSONB NOT NULL,
    metrics JSONB NOT NULL,
    philosophy TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Settings Table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Settings
INSERT INTO settings (key, value) VALUES 
('experience_config', '{"auto_increment": true, "start_year": 2018, "manual_override": null}')
ON CONFLICT (key) DO NOTHING;

-- Security Policies (RLS)
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access for experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read access for profile" ON profile FOR SELECT USING (true);

-- Admin Full Access (Authenticated)
CREATE POLICY "Admin full access for projects" ON projects ALL TO authenticated USING (true);
CREATE POLICY "Admin full access for experience" ON experience ALL TO authenticated USING (true);
CREATE POLICY "Admin full access for profile" ON profile ALL TO authenticated USING (true);
CREATE POLICY "Admin full access for settings" ON settings ALL TO authenticated USING (true);
