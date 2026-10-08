/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Receives contact-form submissions from the static site and delivers an
 * email. The provider integration is currently STUBBED: sendEmail() only
 * logs the inquiry. To go live, implement a provider (example: Resend)
 * inside sendEmail() and add the API key as a Pages environment variable
 * (e.g. RESEND_API_KEY) — no front-end changes required.
 */

const EMAIL_TO = 'hello@elenavoss.com';

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const { name, email, service, message, website } = data ?? {};

  // Honeypot — silently accept bot submissions without sending anything.
  if (website) return json({ ok: true });

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return json({ ok: false, error: 'Name, email and message are required' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Invalid email address' }, 400);
  }

  try {
    await sendEmail(env, { name, email, service, message });
    return json({ ok: true });
  } catch (err) {
    console.error('contact: email failed', err);
    return json({ ok: false, error: 'Failed to send message' }, 500);
  }
}

/**
 * STUBBED email delivery — replace the body of this function with a real
 * provider call. The rest of the code (validation, routing, error
 * handling) already works against this interface.
 *
 * Example with Resend:
 *
 *   const res = await fetch('https://api.resend.com/emails', {
 *     method: 'POST',
 *     headers: {
 *       Authorization: `Bearer ${env.RESEND_API_KEY}`,
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({
 *       from: 'site@yourdomain.com',
 *       to: EMAIL_TO,
 *       reply_to: inquiry.email,
 *       subject: `New inquiry from ${inquiry.name}`,
 *       text: [
 *         `Name: ${inquiry.name}`,
 *         `Email: ${inquiry.email}`,
 *         `Service: ${inquiry.service || 'not specified'}`,
 *         '',
 *         inquiry.message,
 *       ].join('\n'),
 *     }),
 *   });
 *   if (!res.ok) throw new Error(`Resend error: ${res.status}`);
 */
async function sendEmail(env, inquiry) {
  console.log('contact inquiry (stub — not delivered):', JSON.stringify(inquiry));
  return { delivered: false, provider: 'stub' };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
