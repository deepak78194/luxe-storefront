/**
 * Cloudflare Pages Function — POST /api/sanity-upload
 *
 * Validates the session token, then uploads a multipart image to Sanity's
 * assets API with the write token added server-side.
 *
 * Required CF Pages secrets:
 *   ADMIN_JWT_SECRET    – same secret used in admin-login.js
 *   SANITY_PROJECT_ID   – Sanity project ID
 *   SANITY_DATASET      – Sanity dataset name (e.g. "production")
 *   SANITY_WRITE_TOKEN  – Editor-role Sanity token
 *
 * Expected request:
 *   POST /api/sanity-upload
 *   Header: X-Session-Token: <session-token>
 *   Body: multipart/form-data with a "file" field containing the image
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
  if (Date.now() > Number(exp)) return false;
  return hmacVerify(exp, sig, secret);
}

export async function onRequestPost({ request, env }) {
  const sessionToken = request.headers.get('X-Session-Token') ?? '';

  if (!(await verifySessionToken(sessionToken, env.ADMIN_JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!env.SANITY_PROJECT_ID || !env.SANITY_WRITE_TOKEN || !env.SANITY_DATASET) {
    console.error('Sanity env vars not configured for upload');
    return Response.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return Response.json({ error: 'No file field in form data' }, { status: 400 });
  }

  // Validate MIME type — only allow images
  if (!file.type.startsWith('image/')) {
    return Response.json({ error: 'Only image uploads are allowed' }, { status: 400 });
  }

  const apiVersion = env.SANITY_API_VERSION ?? '2024-01-01';
  const filename = encodeURIComponent(file.name ?? 'upload');
  const sanityUrl =
    `https://${env.SANITY_PROJECT_ID}.api.sanity.io` +
    `/v${apiVersion}/assets/images/${env.SANITY_DATASET}` +
    `?filename=${filename}`;

  const upstreamResp = await fetch(sanityUrl, {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`,
    },
    body: file.stream(),
    // Required for streaming request bodies in CF Workers
    duplex: 'half',
  });

  const data = await upstreamResp.json();
  return Response.json(data, { status: upstreamResp.status });
}
