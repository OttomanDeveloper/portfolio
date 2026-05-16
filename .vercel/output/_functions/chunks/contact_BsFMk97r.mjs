import 'resend';
import { z } from 'zod';

const ContactSchema = z.object({
  from: z.string().email({ message: "Please enter a valid email" }),
  about: z.string().min(2).max(120),
  body: z.string().min(10).max(4e3),
  // honeypot — must be empty
  website: z.string().max(0, { message: "spam" }).optional().default(""),
  // submitted-too-fast guard (ms since render)
  startedAt: z.number().int().nonnegative()
});
const MIN_FILL_MS = 2e3;

const prerender = false;
const POST = async ({ request }) => {
  let json;
  try {
    json = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400 });
  }
  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });
  }
  const { from, about, body, website, startedAt } = parsed.data;
  if (website && website.length > 0) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  if (Date.now() - startedAt < MIN_FILL_MS) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  {
    return new Response(JSON.stringify({ error: "misconfigured" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
