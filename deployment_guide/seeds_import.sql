-- ============================================================
-- OTTOMAN PORTFOLIO — SEED DATA (SQL VERSION)
-- Use this to populate your Supabase database via SQL Editor
-- if you prefer not to use the `npm run seed` command.
--
-- How to use:
--   1. Open your Supabase project → SQL Editor → New Query
--   2. Copy and paste this entire file
--   3. Click Run
-- ============================================================

-- ============================================================
-- CLEANUP (run this first to avoid duplicates on re-import)
-- ============================================================
TRUNCATE TABLE projects, experience, reviews, messages, settings RESTART IDENTITY;
DELETE FROM profile WHERE id = '00000000-0000-0000-0000-000000000001';

-- ============================================================
-- 1. PROFILE
-- ============================================================
INSERT INTO profile (
  id, full_name, tagline, bio, philosophy,
  avatar_url, contact_email, whatsapp_number,
  social_links, tech_stacks,
  apps_delivered, happy_clients, experience_start_date,
  site_title
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Alex Ottoman',
  'Architecting Premium Digital Ecosystems Through Code & Strategic Design',
  'I''m a lead full-stack engineer with 7+ years of experience shipping high-performing web and mobile products for startups, agencies, and enterprise clients. I specialize in Next.js, React Native, and Supabase — building systems that are fast, beautiful, and built to last.

I believe that exceptional software is the intersection of engineering precision and design intentionality. I don''t just write code — I craft experiences that make users say ''wow'' and codebases that make developers say ''finally''.',
  'Code is communication. Every function, component, and architecture decision is a message to the next developer who reads it — and that developer is often me at 2am. Write with clarity, build with intention.',
  'https://api.dicebear.com/7.x/notionists/svg?seed=ottoman&backgroundColor=6366f1',
  'alex@example.com',
  '+1 (555) 000-0000',
  '{"github": "https://github.com", "linkedin": "https://linkedin.com", "twitter": "https://twitter.com", "instagram": "https://instagram.com"}',
  '{"Mobile": ["React Native", "Expo", "Flutter"], "Frontend": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"], "Backend": ["Node.js", "Express", "FastAPI", "Python", "PostgreSQL", "Supabase", "Redis"], "DevOps & Tools": ["Docker", "GitHub Actions", "Vercel", "AWS", "Figma", "Stripe"]}',
  42,
  28,
  '2018',
  'Alex Ottoman — Lead Full-Stack Engineer'
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  tagline = EXCLUDED.tagline,
  site_title = EXCLUDED.site_title;

-- ============================================================
-- 2. PROJECTS
-- ============================================================
INSERT INTO projects (name, description, full_description, languages, platforms, github_url, live_url, vibrant_color, bullets, stats)
VALUES

(
  'Zenith Banking',
  'Next-generation digital banking platform with real-time transactions and AI-driven insights.',
  '# Zenith Banking

Zenith Banking is a full-stack fintech platform designed for modern consumers who need complete visibility and control over their finances.

## The Problem

Existing banking apps were slow, cluttered, and gave users almost no intelligence about their own money. Zenith was built to change that.

## What Was Built

- Real-time account balances with optimistic UI updates
- AI-powered spending categorization using OpenAI API
- Multi-currency support with live exchange rates
- End-to-end Stripe payment integration
- WCAG 2.1 AA accessibility compliance

## Results

| Metric | Value |
|---|---|
| Users Onboarded | 12,000+ |
| Transactions/Day | 50,000 |
| Uptime | 99.97% |
| Avg Response Time | 180ms |',
  ARRAY['TypeScript', 'Next.js', 'Tailwind CSS', 'Supabase', 'Stripe', 'OpenAI API'],
  ARRAY['Web'],
  'https://github.com',
  'https://example.com',
  '#6366f1',
  ARRAY[
    'Real-time transaction processing with optimistic UI updates',
    'AI spending categorization using OpenAI GPT-4',
    'Multi-currency support with live exchange rates',
    'End-to-end Stripe payment and payout integration',
    'WCAG 2.1 AA accessibility compliant throughout'
  ],
  '[{"label": "Users Onboarded", "value": "12K+"}, {"label": "Transactions/Day", "value": "50K"}, {"label": "Uptime", "value": "99.97%"}, {"label": "Avg Response", "value": "180ms"}]'
),

(
  'Nebula AI Platform',
  'AI-powered content generation SaaS — text, images, and code in one unified workspace.',
  '# Nebula AI Platform

Nebula is a multi-modal AI SaaS application enabling creators, marketers, and developers to generate high-quality content at scale.

## The Problem

Teams were juggling 4–5 separate AI tools. Nebula unified them into one seamless workspace with shared context, billing, and collaboration.

## What Was Built

- Unified workspace for text, image, and code generation
- Team collaboration with real-time co-editing
- Version history and prompt library
- Usage analytics dashboard
- Stripe subscription and credit-based billing

## Results

| Metric | Value |
|---|---|
| Prompts Processed | 2M+ |
| Active Teams | 800 |
| Avg AI Response | 1.2s |
| MRR | $28,000 |',
  ARRAY['TypeScript', 'React', 'Node.js', 'OpenAI API', 'Stable Diffusion', 'PostgreSQL', 'Stripe'],
  ARRAY['Web'],
  'https://github.com',
  'https://example.com',
  '#8b5cf6',
  ARRAY[
    'Multi-modal AI: text, images, and code generation in one workspace',
    'Team workspaces with role-based access control',
    'Real-time collaboration and version history',
    'Usage analytics dashboard for admins and team leads',
    'Stripe subscription and credit billing system'
  ],
  '[{"label": "Prompts Processed", "value": "2M+"}, {"label": "Active Teams", "value": "800"}, {"label": "Avg AI Response", "value": "1.2s"}, {"label": "Monthly Revenue", "value": "$28K"}]'
),

(
  'Aether Social',
  'Decentralized social network with on-chain identity and direct creator monetization.',
  '# Aether Social

Aether Social is a Web3-native social platform giving users full ownership of their identity and content via Ethereum smart contracts.

## The Problem

Centralized platforms collect and monetize user data. Aether flips the model — users own their content, creators get paid directly.

## What Was Built

- On-chain identity via ENS and user-controlled wallets
- Token-gated posts with creator-set access conditions
- Decentralized content storage on IPFS
- Direct crypto tips — ETH and ERC-20 token support
- Cross-platform: native iOS, Android, and web PWA

## Results

| Metric | Value |
|---|---|
| Monthly Active Users | 28,000 |
| Posts Created | 140,000+ |
| Creator Revenue | $180,000 |
| Chain Transactions | 320,000 |',
  ARRAY['React Native', 'Solidity', 'Ethers.js', 'TypeScript', 'IPFS', 'Expo'],
  ARRAY['iOS', 'Android', 'Web'],
  'https://github.com',
  'https://example.com',
  '#f59e0b',
  ARRAY[
    'On-chain identity via ENS and user-controlled wallets',
    'Token-gated posts with creator-set access conditions',
    'Decentralized content storage on IPFS',
    'Direct crypto tips — ETH and ERC-20 token support',
    'Cross-platform: native iOS, Android, and web PWA'
  ],
  '[{"label": "Monthly Users", "value": "28K"}, {"label": "Posts Created", "value": "140K+"}, {"label": "Creator Revenue", "value": "$180K"}, {"label": "Chain Txns", "value": "320K"}]'
),

(
  'Catalyst CRM',
  'Lightweight CRM for growing agencies — pipelines, contacts, and automated follow-up sequences.',
  '# Catalyst CRM

Catalyst is a modern sales pipeline and CRM tool designed for small-to-mid agencies who find Salesforce overwhelming and Notion too manual.

## What Was Built

- Drag-and-drop Kanban sales pipelines
- Automated follow-up email sequences via Resend
- Client health score based on activity signals
- Real-time board updates with Supabase Realtime
- CSV import/export for bulk contact management

## Results

| Metric | Value |
|---|---|
| Agencies Using | 120+ |
| Deals Closed | 3,200 |
| Emails Sent | 890,000 |
| Time Saved/Week | 4.2 hrs |',
  ARRAY['Next.js', 'TypeScript', 'Supabase', 'Resend', 'Tailwind CSS', 'Framer Motion'],
  ARRAY['Web'],
  'https://github.com',
  'https://example.com',
  '#10b981',
  ARRAY[
    'Drag-and-drop Kanban pipeline with real-time board sync',
    'Automated email follow-up sequences via Resend',
    'Client health score based on activity signals',
    'CSV import/export for bulk contact management',
    'Role-based access — account managers see only their clients'
  ],
  '[{"label": "Agencies Using", "value": "120+"}, {"label": "Deals Closed", "value": "3,200"}, {"label": "Emails Sent", "value": "890K"}, {"label": "Time Saved/Wk", "value": "4.2 hrs"}]'
),

(
  'Momentum Fitness',
  'AI-powered personal trainer app that adapts workouts to your real performance and goals.',
  '# Momentum Fitness

Momentum is a cross-platform fitness application that uses on-device machine learning to create personalized workout plans that adapt over time.

## The Problem

Most fitness apps give you a static plan. Real fitness requires adaptation. Momentum does this automatically.

## What Was Built

- On-device AI personalization using TensorFlow Lite
- Apple Health and Google Fit biometric sync
- Gamified streak and achievement system
- Video exercise demonstrations with rep counting
- Social challenges and friend leaderboards

## Results

| Metric | Value |
|---|---|
| App Downloads | 45,000 |
| Workouts Logged | 320,000 |
| App Store Rating | 4.8 ★ |
| Day-30 Retention | +22% |',
  ARRAY['React Native', 'Expo', 'FastAPI', 'Python', 'TensorFlow Lite', 'TypeScript'],
  ARRAY['iOS', 'Android'],
  'https://github.com',
  '',
  '#ef4444',
  ARRAY[
    'On-device AI workout personalization with TensorFlow Lite',
    'Apple Health and Google Fit biometric data sync',
    'Gamified streak and achievement system',
    'Video exercise demos with rep counting via camera',
    'Social challenges and friend leaderboards'
  ],
  '[{"label": "App Downloads", "value": "45K"}, {"label": "Workouts Logged", "value": "320K"}, {"label": "App Store Rating", "value": "4.8 ★"}, {"label": "Day-30 Retention", "value": "+22%"}]'
);

-- ============================================================
-- 3. EXPERIENCE
-- ============================================================
INSERT INTO experience (company, position, start_date, end_date, location, description, technologies, achievements)
VALUES

(
  'Apex Digital Studio',
  'Lead Full-Stack Engineer',
  'Mar 2023',
  'Present',
  'Remote (USA)',
  ARRAY[
    'Architected and delivered a multi-tenant SaaS CRM used by 120+ agencies, reducing client onboarding time by 40%',
    'Led a cross-functional team of 5 engineers — weekly code reviews, architectural standards, and sprint planning',
    'Migrated a legacy PHP monolith to a Next.js + Supabase microservice architecture, improving page load by 65%',
    'Implemented CI/CD pipelines with GitHub Actions, cutting deployment time from 45 minutes to under 8 minutes',
    'Established a shared component library in Storybook adopted across 3 product lines'
  ],
  ARRAY['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Docker', 'GitHub Actions', 'Resend', 'Tailwind CSS'],
  ARRAY[
    'Promoted to Lead Engineer after 6 months for exceptional delivery velocity',
    'Reduced production incidents by 72% through systematic testing',
    'Received company Engineer of the Year recognition for Q1 2024'
  ]
),

(
  'Pixel Perfect Studio',
  'Mid-Level Full-Stack Developer',
  'Jun 2021',
  'Feb 2023',
  'Remote (EU)',
  ARRAY[
    'Developed and maintained 8+ client web applications using React and Node.js with full test coverage',
    'Collaborated with UI/UX designers to implement pixel-perfect interfaces from Figma prototypes',
    'Built a custom e-commerce engine integrated with Stripe handling $2M+ in annual transaction volume',
    'Optimised React bundle sizes by 38% through code splitting, lazy loading, and dependency auditing',
    'Mentored 2 junior developers on modern JavaScript patterns and clean code practices'
  ],
  ARRAY['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Figma', 'Jest', 'AWS S3'],
  ARRAY[
    'Delivered the flagship e-commerce platform 2 weeks ahead of schedule',
    'Zero critical production incidents over 18 months of ownership',
    'Client satisfaction rating of 9.6/10 across all delivered projects'
  ]
),

(
  'InnovateTech Labs',
  'Junior Software Engineer',
  'Jan 2018',
  'May 2021',
  'New York, NY (Hybrid)',
  ARRAY[
    'Built RESTful APIs in Express.js for internal tooling used by 200+ employees across 4 departments',
    'Contributed to a React Native cross-platform mobile app shipped to 15,000+ users on iOS and Android',
    'Implemented automated testing suites achieving 85% code coverage with Jest and React Testing Library',
    'Participated in Agile sprints, standups, and retrospectives in a team of 12 engineers',
    'Integrated third-party APIs including Google Maps, Twilio SMS, and SendGrid email services'
  ],
  ARRAY['JavaScript', 'React', 'React Native', 'Node.js', 'Express', 'MySQL', 'Jest', 'Git'],
  ARRAY[
    'Graduated from junior to mid-level role within 18 months',
    'Won internal hackathon with an AI-powered meeting summariser tool',
    'Published 2 internal npm packages used across 5+ company projects'
  ]
);

-- ============================================================
-- 4. REVIEWS / TESTIMONIALS
-- ============================================================
INSERT INTO reviews (customer_name, review_text, customer_photo, is_verified, status)
VALUES

(
  'Sarah Mitchell',
  'Alex delivered our banking dashboard 3 weeks ahead of schedule with a level of polish we didn''t think was possible in that timeframe. The codebase is clean, the performance is exceptional, and the UI is genuinely beautiful. Easily the best engineering hire we''ve made in 4 years.',
  'https://api.dicebear.com/7.x/notionists/svg?seed=sarah&backgroundColor=6366f1',
  true, 'published'
),
(
  'James Okonkwo',
  'We brought Alex in for a critical refactor of our legacy CRM and he transformed it into a modern, maintainable codebase in 6 weeks. What impressed us most was his ability to balance speed with quality — we had zero regressions post-deployment. Will absolutely work with him again.',
  'https://api.dicebear.com/7.x/notionists/svg?seed=james&backgroundColor=f59e0b',
  true, 'published'
),
(
  'Priya Sharma',
  'The Nebula AI platform Alex built for us is our core product and it works flawlessly. He proactively suggested architectural improvements that saved us months of tech debt, and he communicated clearly throughout. The code reviews he left behind became our internal standards document.',
  'https://api.dicebear.com/7.x/notionists/svg?seed=priya&backgroundColor=10b981',
  true, 'published'
),
(
  'Carlos Mendes',
  'Truly rare to find someone who understands both product and engineering at Alex''s level. He asked exactly the right questions before writing a single line of code, which meant every feature shipped was exactly what we needed. Our users noticed the quality immediately — support tickets dropped 30%.',
  'https://api.dicebear.com/7.x/notionists/svg?seed=carlos&backgroundColor=8b5cf6',
  true, 'published'
),
(
  'Emily Zhao',
  'Professional, fast, and genuinely cares about the outcome. Alex built our React Native fitness app from scratch and delivered an experience that felt premium and native on both iOS and Android. The gamification system he designed single-handedly boosted our Day-30 retention by 22%.',
  'https://api.dicebear.com/7.x/notionists/svg?seed=emily&backgroundColor=ef4444',
  true, 'published'
),
(
  'David Keller',
  'We had a tight deadline for our investor demo and Alex not only hit it but exceeded expectations. The product looked like it had been built over months, not 3 weeks. He was always reachable, always delivering, and always two steps ahead of problems. Highly recommend without hesitation.',
  'https://api.dicebear.com/7.x/notionists/svg?seed=david&backgroundColor=14b8a6',
  true, 'published'
),
(
  'Aisha Nwosu',
  'Working with Alex was a masterclass in how modern software should be built. His attention to accessibility, performance, and SEO was outstanding — our Lighthouse scores went from the 50s to consistent 95+. Our organic search traffic grew 140% within 2 months of the relaunch.',
  'https://api.dicebear.com/7.x/notionists/svg?seed=aisha&backgroundColor=f97316',
  true, 'published'
),
(
  'Tom Harrington',
  'Alex is the kind of developer who makes everyone around him better. His code is self-documenting, his PR descriptions are thorough, and he always has time to explain his architectural choices. Our whole team leveled up just from reviewing his work. An absolute asset on any collaborative project.',
  'https://api.dicebear.com/7.x/notionists/svg?seed=tom&backgroundColor=a855f7',
  true, 'published'
);

-- ============================================================
-- 5. MESSAGES (Sample admin inbox)
-- ============================================================
INSERT INTO messages (name, email, subject, message, status)
VALUES

(
  'Sarah Mitchell',
  'sarah.mitchell@apexfintech.io',
  'Banking Dashboard Project — Collaboration Inquiry',
  'Hi Alex, I came across your portfolio and I''m genuinely impressed by the Zenith Banking case study. We''re building a similar product for a Series A fintech startup — a multi-currency expense management tool for SMEs. We''d love to discuss a 3-month engagement starting next quarter. Are you available for a discovery call this week?',
  'replied'
),
(
  'Marcus Webb',
  'marcus@growthloop.co',
  'React Native App — Urgent Timeline',
  'Hey Alex — we have a mobile MVP that needs to be done in 8 weeks. I know that''s tight but we have a trade show commitment we can''t move. The app is a B2B field sales tool — offline-first, with CRM sync and barcode scanning. Budget is flexible for the right developer. Can we jump on a call today or tomorrow?',
  'read'
),
(
  'Yuki Tanaka',
  'yuki.tanaka@designsync.jp',
  'Next.js Performance Audit',
  'Hello, I found you through a recommendation on Twitter/X. Our Next.js e-commerce platform has serious performance issues — Largest Contentful Paint is over 6 seconds on mobile. We''re losing customers at checkout. I''d love to bring you on for a performance audit and remediation sprint.',
  'unread'
),
(
  'Fatima Al-Rashidi',
  'fatima@cloudnovatech.ae',
  'Full-Stack Developer for SaaS MVP',
  'Hi Alex, we''re a Dubai-based tech consultancy building a SaaS product for the real estate industry — an AI-driven property valuation and market analytics platform. We''re looking for a lead developer to own the technical architecture and build the first version. Remote-friendly, 6-month contract.',
  'read'
),
(
  'Thomas Brennan',
  'thomas@brennanagency.ie',
  'Just wanted to say — brilliant portfolio!',
  'Alex, I''m not reaching out for a project right now — I just spent 20 minutes going through your portfolio site and it''s genuinely one of the best developer portfolios I''ve ever seen. The case study modals, the smooth animations, the clean layout. Really well done. Keep doing what you''re doing. — Tom',
  'read'
);

-- ============================================================
-- 6. SETTINGS
-- ============================================================
INSERT INTO settings (key, value) VALUES
(
  'experience_config',
  '{"auto_increment": true, "start_year": 2018, "manual_override": null}'
),
(
  'site_content',
  '{"contact_description": "I''m currently open to new opportunities and freelance projects. Whether you have a question or just want to say hi, my inbox is always open.", "projects_tagline": "A curated selection of my recent works, ranging from mobile applications to complex web systems.", "narrative_tagline": "A specialized window into the vision, metrics, and technological foundation I bring to every project."}'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================
-- Done! Visit your site to see the portfolio populated.
-- ============================================================
