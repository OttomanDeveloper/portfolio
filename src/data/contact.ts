// src/data/contact.ts
export const contact = [
  { label: 'LinkedIn',       href: 'https://www.linkedin.com/in/ottomancoder/',     glyph: 'in', tone: 'gold' as const, copy: undefined as string | undefined },
  { label: 'Email',          href: 'mailto:ottomandeveloper@gmail.com',              glyph: '@',  tone: 'gold' as const, copy: 'ottomandeveloper@gmail.com' as string | undefined },
  { label: 'WhatsApp',       href: 'https://wa.me/message/4DIU6JPIALUGK1',          glyph: 'wa', tone: 'lime' as const, copy: undefined as string | undefined },
  { label: 'YouTube',        href: 'https://www.youtube.com/@OttomanCoder',         glyph: '▶',  tone: 'gold' as const, copy: undefined as string | undefined },
  { label: 'Stack Overflow', href: 'https://stackoverflow.com/users/15117215',      glyph: 'SO', tone: 'gold' as const, copy: undefined as string | undefined },
  { label: 'Resume PDF',     href: '/cv.pdf',                                        glyph: 'PDF', tone: 'cyan' as const, copy: undefined as string | undefined },
] as const;
