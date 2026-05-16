// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { ContactSchema, MIN_FILL_MS } from '@/lib/contact-schema';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), { status: 400 });
  }

  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });
  }
  const { from, about, body, website, startedAt } = parsed.data;
  if (website && website.length > 0) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 }); // silently drop
  }
  if (Date.now() - startedAt < MIN_FILL_MS) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 }); // silently drop
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  // Sender address must be on a domain verified in your Resend account.
  // Default `onboarding@resend.dev` works out of the box for testing; swap
  // to `noreply@your-domain.com` after verifying your real domain.
  const sender = import.meta.env.RESEND_FROM || 'onboarding@resend.dev';
  if (!apiKey || !to) {
    return new Response(JSON.stringify({ error: 'misconfigured' }), { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `Ottoman Coder <${sender}>`,
    to,
    replyTo: from,
    subject: `[portfolio contact] ${about}`,
    text: `From: ${from}\nAbout: ${about}\n\n${body}`,
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
