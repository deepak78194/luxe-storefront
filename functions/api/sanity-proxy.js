/**
 * Cloudflare Pages Function — POST /api/sanity-proxy
 *
 * Validates the session token (issued by /api/admin-login), then proxies
 * Sanity data mutations/queries to the Sanity API adding the write token
 * server-side — the token never reaches the browser.
 *
 * Required CF Pages secrets:
 *   ADMIN_JWT_SECRET    – same secret used in admin-login.js
 *   SANITY_PROJECT_ID   – Sanity project ID
 *   SANITY_WRITE_TOKEN  – Editor-role Sanity token (stays server-side)
 *
 * Expected request body (JSON):
 *   {
 *     path: "v2024-01-01/data/mutate/<dataset>",   // or "…/query/<dataset>"
 *     body: { mutations: [...] }                    // Sanity mutation/query payload
 *   }
 */

async function hmacVerify(message, signature, secret) {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const sigBytes = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
    return crypto.subtle.verify(
      'HMAC', key, sigBytes, new TextEncoder().encode(message)
    );
  } catch {
    return false;
  }
}

async function verifySessionToken(token, secret) {
  if (!token || !secret) return false;
  const dotIdx = token.indexOf('.');
  if (dotIdx === -1) return false;
  const exp = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  if (Date.now() > Number(exp)) return false; // expired
  return hmacVerify(exp, sig, secret);
}

// Only allow Sanity data API paths (mutate or query)
const ALLOWED_PATH = /^v\d{4}-\d{2}-\d{2}\/data\/(mutate|query)\//;

export async function onRequestPost({ request, env }) {
  const sessionToken = request.headers.get('X-Session-Token') ?? '';

  if (!(await verifySessionToken(sessionToken, env.ADMIN_JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let reqBody;
  try {
    reqBody = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { path, body: sanityBody } = reqBody ?? {};

  if (!path || !ALLOWED_PATH.test(path)) {
    return Response.json({ error: 'Invalid or disallowed Sanity path' }, { status: 400 });
  }

  if (!env.SANITY_PROJECT_ID || !env.SANITY_WRITE_TOKEN) {
    console.error('SANITY_PROJECT_ID or SANITY_WRITE_TOKEN env var is not set');
    return Response.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const sanityUrl = `https://${env.SANITY_PROJECT_ID}.api.sanity.io/${path}`;

  const upstreamResp = await fetch(sanityUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`,
    },
    body: JSON.stringify(sanityBody),
  });

  const text = await upstreamResp.text();
  return new Response(text, {
    status: upstreamResp.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
