-- ============================================================
-- OTTOMAN PORTFOLIO - SEED DATA
-- Populate your portfolio with realistic dummy content
-- ============================================================

-- 1. SEED PROFILE
INSERT INTO profile (
    id, name, tagline, bio, apps_delivered, happy_clients, experience_start_date, philosophy, 
    social_links, tech_stacks, avatar_url, contact_email, whatsapp_number
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Creative Ottoman',
    'Architecting Premium Digital Ecosystems & Aesthetic Experiences',
    'I specialize in building high-performance applications with a focus on modern user interfaces and robust backend architectures.',
    28, 100, '2019-01-01',
    'Simplicity is the ultimate sophistication.',
    '{"github": "https://github.com", "linkedin": "https://linkedin.com", "twitter": "https://twitter.com"}',
    '{"Frontend": ["Next.js", "React", "Tailwind"], "Backend": ["Node.js", "Supabase", "PostgreSQL"], "Mobile": ["Flutter", "React Native"]}',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    'hello@example.com',
    '+1234567890'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. SEED PROJECTS
INSERT INTO projects (name, description, full_description, vibrant_color, github_url, live_url, languages, platforms, bullets, stats)
VALUES 
(
    'Nebula Finance',
    'Next-gen wealth management app with real-time analytics.',
    'A high-performance banking dashboard featuring glassmorphic design and real-time transaction tracking.',
    '#818cf8',
    'https://github.com/example/nebula',
    'https://nebula.demo',
    '{"TypeScript", "Next.js", "Tailwind"}',
    '{"Web", "SaaS"}',
    '{"Secured with biometric auth", "Real-time crypto price tracking", "Advanced export features"}',
    '[{"label": "Active Users", "value": "10k+"}, {"label": "Uptime", "value": "99.9%"}]'
),
(
    'Aether Social',
    'Decentralized social networking for private communities.',
    'A blockchain-based social platform prioritizing user privacy and data ownership.',
    '#f472b6',
    'https://github.com/example/aether',
    null,
    '{"Solidity", "React Native"}',
    '{"Mobile", "Web3"}',
    '{"E2E encrypted messaging", "NFT profile verification", "Gasless transactions"}',
    '[{"label": "Downloads", "value": "50k"}, {"label": "Communities", "value": "1.2k"}]'
);

-- 3. SEED EXPERIENCE
INSERT INTO experience (company, position, start_date, end_date, location, description, technologies)
VALUES
(
    'Tech Horizons',
    'Senior Full Stack Engineer',
    '2022-01-01',
    'Present',
    'New York (Remote)',
    '{"Leading the development of a flagship SaaS product.", "Mentoring 4 junior developers.", "Architected the transition from REST to GraphQL."}',
    '{"Next.js", "Node.js", "AWS"}'
),
(
    'Pixel Perfect Studio',
    'UI Designer & Developer',
    '2020-05-01',
    '2021-12-30',
    'London, UK',
    '{"Designed and implemented complex design systems.", "Collaborated with Fortune 500 clients.", "Won Best UI Design 2021 award."}',
    '{"Figma", "React", "Framer Motion"}'
);

-- 4. SEED REVIEWS
INSERT INTO reviews (customer_name, review_text, status, is_verified)
VALUES
('Alice Johnson', 'Otoman is a wizard! The project was delivered ahead of schedule and the code quality is exceptional.', 'published', true),
('Bob Smith', 'Stunning design and rock-solid performance. Exactly what we were looking for.', 'published', true);

-- 5. SEED SETTINGS
INSERT INTO settings (key, value) VALUES
('site_content', '{
  "contact_description": "I am currently accepting new high-impact projects. Let''s build something great together.",
  "projects_tagline": "A selection of my technical masterpieces.",
  "narrative_tagline": "How I turned my passion for code into a career."
}') ON CONFLICT (key) DO NOTHING;
