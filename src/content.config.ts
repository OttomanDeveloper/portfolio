// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    stack: z.array(z.string()),
    stats: z.array(z.object({ num: z.string(), unit: z.string().optional(), desc: z.string() })).max(4),
    heroImage: z.string().optional(),
    liveUrl: z.string().url().optional(),
    sourceUrl: z.string().url().optional(),
    order: z.number(),
  }),
});

export const collections = { projects };
