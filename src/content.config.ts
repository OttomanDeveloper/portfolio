// src/content.config.ts — Astro 6 Content Collection schema
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    role: z.string(),
    yearsLabel: z.string(),
    years: z.object({
      start: z.number(),
      end: z.union([z.number(), z.literal('present')]),
    }),
    stack: z.array(z.string()),
    status: z.enum(['live', 'retired', 'in-progress']),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    stats: z.array(z.object({
      num: z.string(),
      unit: z.string().optional(),
      desc: z.string(),
    })).max(4),
    featured: z.boolean().default(false),
    order: z.number(),
    draft: z.boolean().default(false),
    // optional richer description for the landing #projects row
    listingDesc: z.string().optional(),
  }),
});

export const collections = { projects };
