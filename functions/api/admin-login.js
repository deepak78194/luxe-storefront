/**
 * Cloudflare Pages Function — POST /api/admin-login
 *
 * Validates the admin password against the CF Pages secret ADMIN_PASSWORD.
 * On success returns a short-lived HMAC-signed session token.
 *
 * Required CF Pages secrets (set in CF dashboard → Settings → Environment variables):
 *   ADMIN_PASSWORD      – the admin password (replaces the one that was in the browser bundle)
 *   ADMIN_JWT_SECRET    – random 32+ char string used to sign session tokens
 */

async function hmacSign(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign(
    'HMAC', key, new TextEncoder().encode(message)
  );
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { password } = body ?? {};

  if (!env.ADMIN_PASSWORD || !password || password !== env.ADMIN_PASSWORD) {
    // Constant-time-ish delay to resist brute-force timing attacks
    await new Promise((r) => setTimeout(r, 200));
    return Response.json({ ok: false }, { status: 401 });
  }

  if (!env.ADMIN_JWT_SECRET) {
    console.error('ADMIN_JWT_SECRET env var is not configured');
    return Response.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });
  }

  // Token format: "<expiry_ms>.<base64_hmac>"
  const exp = Date.now() + 8 * 60 * 60 * 1000; // 8 hours
  const sig = await hmacSign(String(exp), env.ADMIN_JWT_SECRET);
  const token = `${exp}.${sig}`;

  return Response.json({ ok: true, token });
}
