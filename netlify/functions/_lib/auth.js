// =============================================================
// JWT auth helpers
// -------------------------------------------------------------
// Uses the Web Crypto API available in the Netlify Functions
// runtime (and Node 18+). No external deps.
// =============================================================

const enc = new TextEncoder()
const dec = new TextDecoder()

const b64urlEncode = (buf) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let str = ''
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i])
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const b64urlDecode = (str) => {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  const b64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

const hmacKey = async (secret) =>
  crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )

const timingSafeEqualStr = (a, b) => {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

export const signJwt = async (payload, secret, expiresIn = '7d') => {
  if (!secret) throw new Error('JWT_SECRET is not set')
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const exp = now + parseExpiry(expiresIn)
  const fullPayload = { ...payload, iat: now, exp }
  const headerB64 = b64urlEncode(enc.encode(JSON.stringify(header)))
  const payloadB64 = b64urlEncode(enc.encode(JSON.stringify(fullPayload)))
  const signingInput = `${headerB64}.${payloadB64}`
  const key = await hmacKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(signingInput))
  const sigB64 = b64urlEncode(new Uint8Array(sig))
  return `${signingInput}.${sigB64}`
}

export const verifyJwt = async (token, secret) => {
  if (!token || !secret) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [headerB64, payloadB64, sigB64] = parts
  const signingInput = `${headerB64}.${payloadB64}`
  const key = await hmacKey(secret)
  let ok = false
  try {
    ok = await crypto.subtle.verify(
      'HMAC',
      key,
      b64urlDecode(sigB64),
      enc.encode(signingInput)
    )
  } catch {
    return null
  }
  if (!ok) return null
  let payload
  try {
    payload = JSON.parse(dec.decode(b64urlDecode(payloadB64)))
  } catch {
    return null
  }
  if (payload.exp && Math.floor(Date.now() / 1000) >= payload.exp) return null
  return payload
}

const parseExpiry = (str) => {
  if (typeof str === 'number') return str
  const m = /^(\d+)([smhd])$/.exec(String(str))
  if (!m) return 7 * 24 * 60 * 60 // default 7d
  const n = parseInt(m[1], 10)
  switch (m[2]) {
    case 's': return n
    case 'm': return n * 60
    case 'h': return n * 60 * 60
    case 'd': return n * 24 * 60 * 60
    default: return n
  }
}

// Extract a Bearer token from an Authorization header
export const extractToken = (authHeader) => {
  if (!authHeader) return null
  const m = /^Bearer\s+(.+)$/i.exec(authHeader.trim())
  return m ? m[1] : null
}

// Build a small per-IP rate limiter backed by Netlify Blobs.
// (Lightweight - in-memory for warm invocations would also work,
// but Blobs gives us persistence across cold starts.)
export const rateLimit = async ({ key, windowMs = 15 * 60 * 1000, max = 10 }) => {
  const { getStore } = await import('@netlify/blobs')
  const store = getStore('rate_limits')
  const now = Date.now()
  let bucket = { hits: [] }
  try {
    const stored = await store.get(key, { type: 'json' })
    if (stored && typeof stored === 'object' && Array.isArray(stored.hits)) {
      bucket = stored
    }
  } catch {
    // Fall through with default empty bucket
  }
  bucket.hits = (bucket.hits || []).filter((t) => now - t < windowMs)
  if (bucket.hits.length >= max) {
    return { allowed: false, retryAfterMs: windowMs - (now - bucket.hits[0]) }
  }
  bucket.hits.push(now)
  try {
    await store.setJSON(key, bucket)
  } catch (err) {
    console.error('rateLimit setJSON error:', err)
  }
  return { allowed: true }
}
