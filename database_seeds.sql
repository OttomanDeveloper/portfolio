-- ============================================================
-- OTTOMAN PORTFOLIO - DATABASE SEED DATA
-- Run AFTER database_schema.sql
-- ============================================================
-- HOW TO RUN:
--   Supabase SQL Editor → paste and run
--   OR
--   psql -h <host> -U postgres -d postgres -f database_seeds.sql
-- ============================================================

-- ============================================================
-- PROFILE (About Me)
-- ============================================================
INSERT INTO profile (
    name, tagline, bio, philosophy,
    core_values, metrics, social_links, tech_stacks,
    avatar_url, resume_url, contact_email, whatsapp_number,
    apps_delivered, happy_clients, experience_start_date
) VALUES (
    'Alex Morgan',
    'Architecting premium digital ecosystems through code and strategic design.',
    'I am a full-stack developer with over 6 years of experience building scalable, high-performance web and mobile applications. I am passionate about clean code, exceptional user experiences, and turning complex problems into elegant solutions.',
    'I believe that great software is built at the intersection of technical excellence and thoughtful design. Every line of code is an opportunity to create something meaningful.',
    '[
      {"icon": "Code2",     "title": "Clean Code",    "description": "I write maintainable, well-documented code that teams love to work with."},
      {"icon": "Layers",    "title": "Full Stack",     "description": "From database design to pixel-perfect UIs, I handle the entire stack."},
      {"icon": "Zap",       "title": "Performance",   "description": "I obsess over load times, SEO scores, and runtime efficiency."}
    ]',
    '{"apps_delivered": 42, "happy_clients": 35, "years_experience": 6}',
    '{"github": "https://github.com/alexmorgan", "linkedin": "https://linkedin.com/in/alexmorgan", "twitter": "https://twitter.com/alexmorgan", "instagram": "https://instagram.com/alexmorgan"}',
    '{"Languages": ["TypeScript", "Python", "Dart", "SQL"], "Frameworks": ["Next.js", "React", "Flutter", "FastAPI"], "Tools": ["Supabase", "Docker", "Figma", "Git"], "Platforms": ["Vercel", "AWS", "Firebase"]}',
    'https://avatars.githubusercontent.com/u/9919?v=4',
    '',
    'alex@example.com',
    '+15550001234',
    42,
    35,
    '2018'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- PROJECTS (5 realistic samples)
-- ============================================================
INSERT INTO projects (name, description, full_description, languages, platforms, github_url, vibrant_color, bullets, stats) VALUES

(
    'TradeFlow Dashboard',
    'A real-time SaaS analytics platform for commodity traders with live P&L tracking.',
    'TradeFlow is a full-stack SaaS platform designed for independent commodity traders. It provides a live profit-and-loss dashboard, trade journal, risk calculator, and market news aggregation. The backend is powered by FastAPI with WebSocket connections for real-time price feeds.',
    ARRAY['TypeScript', 'Python', 'PostgreSQL'],
    ARRAY['Web', 'Desktop'],
    'https://github.com/alexmorgan/tradeflow',
    '#f59e0b',
    ARRAY[
        'Real-time WebSocket price feeds from 3 exchanges',
        'Automated P&L calculation with multi-currency support',
        'Interactive charting library with 15+ indicator types',
        'PDF trade report generation',
        'Role-based access control for team accounts'
    ],
    '[{"label": "Users", "value": "1,200+"}, {"label": "Trades Tracked", "value": "850K"}, {"label": "Uptime", "value": "99.9%"}]'
),

(
    'Petto – Pet Care App',
    'A Flutter mobile app connecting pet owners with local vets and groomers.',
    'Petto is a cross-platform mobile application built with Flutter and Supabase. Pet owners can book vet appointments, track vaccination records, find nearby groomers, and join a community forum. The app uses push notifications and background sync for appointment reminders.',
    ARRAY['Dart', 'TypeScript'],
    ARRAY['iOS', 'Android'],
    'https://github.com/alexmorgan/petto',
    '#10b981',
    ARRAY[
        'Geolocation-based vet and groomer discovery',
        'In-app booking with calendar integration',
        'Pet health record management with photo uploads',
        'Community forum with moderation tools',
        'Push notifications via Firebase Cloud Messaging'
    ],
    '[{"label": "Downloads", "value": "28K"}, {"label": "Rating", "value": "4.8★"}, {"label": "Active Users", "value": "12K"}]'
),

(
    'OmniBlog CMS',
    'A headless CMS with a visual page builder, multi-author support, and SEO tools.',
    'OmniBlog is a headless CMS built with Next.js and Supabase Storage. It features a drag-and-drop visual editor, multi-author workflows with approval queues, automatic image optimization, and advanced SEO meta management. Content is served via a REST API and GraphQL endpoint.',
    ARRAY['TypeScript', 'GraphQL', 'SQL'],
    ARRAY['Web'],
    'https://github.com/alexmorgan/omniblog',
    '#8b5cf6',
    ARRAY[
        'Drag-and-drop visual page builder',
        'Multi-author publishing workflow with reviews',
        'Automatic WebP image optimization on upload',
        'Built-in SEO analyzer with Lighthouse integration',
        'GraphQL + REST dual API for content delivery'
    ],
    '[{"label": "Sites Powered", "value": "85"}, {"label": "Articles Published", "value": "32K"}, {"label": "API Uptime", "value": "99.95%"}]'
),

(
    'ShipItFast CLI',
    'An open-source CLI tool that scaffolds Next.js projects with batteries included.',
    'ShipItFast is a developer productivity CLI that generates production-ready Next.js projects with pre-configured authentication, database schema, admin panel, dark mode, and CI/CD pipelines. It has over 3,000 GitHub stars and is used by developers across 40 countries.',
    ARRAY['TypeScript', 'Node.js', 'Shell'],
    ARRAY['CLI', 'Cross-Platform'],
    'https://github.com/alexmorgan/shipitfast',
    '#ef4444',
    ARRAY[
        'One-command project scaffolding in under 30 seconds',
        'Supports Supabase, PlanetScale, and Neon database presets',
        'Pre-wired auth with NextAuth.js or Clerk',
        'Interactive prompt-based configuration',
        'Automated GitHub Actions CI/CD setup'
    ],
    '[{"label": "GitHub Stars", "value": "3.2K"}, {"label": "Downloads/Mo", "value": "18K"}, {"label": "Contributors", "value": "47"}]'
),

(
    'Kanbu – Inventory System',
    'A warehouse inventory management system with barcode scanning and supplier portals.',
    'Kanbu is an enterprise-grade inventory management system for small to medium warehouses. It supports barcode/QR scanning via a mobile PWA, automated reorder triggers, supplier purchase order generation, and detailed stock reporting. It replaced manual spreadsheet workflows for a regional logistics company.',
    ARRAY['TypeScript', 'Python', 'PostgreSQL'],
    ARRAY['Web', 'PWA', 'Mobile'],
    'https://github.com/alexmorgan/kanbu',
    '#06b6d4',
    ARRAY[
        'Barcode and QR code scanning via device camera',
        'Automated low-stock reorder triggers via email',
        'Supplier portal with PO tracking',
        'FIFO/LIFO valuation reports',
        'Offline-first PWA with background sync'
    ],
    '[{"label": "SKUs Managed", "value": "45K"}, {"label": "Daily Scans", "value": "2,800"}, {"label": "Warehouses", "value": "12"}]'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- EXPERIENCE (3 realistic entries)
-- ============================================================
INSERT INTO experience (company, position, start_date, end_date, location, description, technologies, achievements) VALUES

(
    'NovaTech Solutions',
    'Senior Full-Stack Developer',
    'Mar 2022',
    'Present',
    'San Francisco, CA (Remote)',
    ARRAY[
        'Lead the architecture and development of a multi-tenant SaaS platform serving 5,000+ businesses',
        'Mentor a team of 4 junior developers through code reviews, pair programming, and technical workshops',
        'Collaborate with product and design teams to translate business requirements into technical specifications',
        'Maintain 99.9% uptime for production services through observability tooling and incident response'
    ],
    ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'AWS', 'Docker', 'Terraform'],
    ARRAY[
        'Reduced API response times by 62% through database query optimization and caching',
        'Architected a migration from monolith to microservices, cutting deployment time from 45 min to 8 min',
        'Introduced automated E2E testing, reducing post-release bugs by 80%'
    ]
),

(
    'Pixel & Code Agency',
    'Full-Stack Developer',
    'Jun 2020',
    'Feb 2022',
    'Austin, TX',
    ARRAY[
        'Delivered 18+ client projects across e-commerce, SaaS, and internal tooling verticals',
        'Designed and implemented RESTful APIs consumed by web and mobile frontends',
        'Integrated third-party services including Stripe, Twilio, and various mapping APIs',
        'Participated in client discovery workshops to define project scope and technical approach'
    ],
    ARRAY['React', 'Node.js', 'MongoDB', 'Flutter', 'Firebase', 'Stripe API'],
    ARRAY[
        'Delivered a high-traffic e-commerce platform (50K visits/day) with zero downtime during Black Friday',
        'Built a Flutter app that reached 10K downloads within its first month',
        'Improved team CI/CD pipeline, reducing build times by 40%'
    ]
),

(
    'Freelance',
    'Mobile App Developer',
    'Jan 2018',
    'May 2020',
    'Remote',
    ARRAY[
        'Designed, built, and launched 12 mobile applications for clients across retail, health, and edtech sectors',
        'Managed full project lifecycle from requirements gathering to App Store and Play Store submissions',
        'Built custom REST APIs to power mobile clients using Node.js and PostgreSQL',
        'Provided ongoing maintenance and feature development post-launch'
    ],
    ARRAY['Flutter', 'Dart', 'React Native', 'Node.js', 'PostgreSQL', 'Firebase'],
    ARRAY[
        'Published 12 apps with a combined total of 50K+ downloads',
        'Achieved a 5-star rating on 8 of 12 published applications',
        'Earned Fiverr Top Rated Seller badge within 12 months'
    ]
);

-- ============================================================
-- REVIEWS / TESTIMONIALS (8 samples)
-- ============================================================
INSERT INTO reviews (customer_name, review_text, is_verified, status) VALUES

('Sarah Thompson',
 'Alex delivered our SaaS platform ahead of schedule and exceeded every expectation. The code quality is impeccable and the admin panel he built has saved our team hours every week. Highly recommend!',
 true, 'published'),

('James Okonkwo',
 'Working with Alex was an absolute pleasure. He understood our requirements instantly and proposed solutions we hadn''t even considered. The final Flutter app looks stunning and performs flawlessly.',
 true, 'published'),

('Priya Sharma',
 'Alex rebuilt our legacy inventory system in 3 months. What impressed me most was his communication throughout the project — daily updates, no surprises, and a beautiful final product. Will definitely work with him again.',
 true, 'published'),

('Carlos Mendes',
 'Incredible attention to detail. Our e-commerce site went from a 45% mobile bounce rate to under 20% after Alex redesigned and optimised it. ROI was evident within the first quarter.',
 true, 'published'),

('Emma Wilson',
 'Alex helped us migrate from a slow WordPress setup to a modern Next.js platform. Page load times dropped from 6 seconds to under 1. Our SEO traffic doubled in 2 months. Remarkable work.',
 true, 'published'),

('Daniel Park',
 'Top-tier developer. Alex asked the right questions, pushed back constructively when needed, and delivered exactly what we needed. The codebase he left us is clean and well-documented.',
 true, 'published'),

('Amara Diallo',
 'I hired Alex for what I thought was a small project — he caught three critical security vulnerabilities before they became problems. His security-first mindset is rare and incredibly valuable.',
 false, 'published'),

('Lucas Ferreira',
 'Alex built our internal HR tool from scratch in 6 weeks. The data imports, role-based permissions, and reporting module all work perfectly. The team adopted it immediately with zero training needed.',
 true, 'published');

-- ============================================================
-- MESSAGES (sample contact form entries for admin demo)
-- ============================================================
INSERT INTO messages (name, email, message, status) VALUES
('John Doe', 'john@example.com', 'Hi Alex! I have a web app project in mind and would love to discuss it. Are you available for a 30-minute call this week?', 'unread'),
('Fatima Al-Rashid', 'fatima@startup.io', 'We are looking for a senior developer to join our team on a 3-month contract. Your portfolio is exactly what we need.', 'read'),
('Tom Bradley', 'tom@agency.co', 'Could you provide a quote for rebuilding our company website? We want a modern, fast, and SEO-optimised design.', 'replied');

-- ============================================================
-- END OF SEED DATA
-- ============================================================
