// src/lib/contact-schema.ts
import { z } from 'zod';

export const ContactSchema = z.object({
  from: z.string().email({ message: 'Please enter a valid email' }),
  about: z.string().min(2).max(120),
  body: z.string().min(10).max(4000),
  // honeypot — must be empty
  website: z.string().max(0, { message: 'spam' }).optional().default(''),
  // submitted-too-fast guard (ms since render)
  startedAt: z.number().int().nonnegative(),
});

export type ContactPayload = z.infer<typeof ContactSchema>;

export const MIN_FILL_MS = 2000;
