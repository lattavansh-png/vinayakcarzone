// =============================================================
// Single catch-all Netlify Function (Web Standard Request/Response)
// -------------------------------------------------------------
// Netlify will invoke this for /api/* (see netlify.toml).
// Uses the standard Web `Request` → `Response` pattern supported
// by the Netlify Functions runtime.
// =============================================================
import { handle } from './_lib/router.js'

export default async (request, context) => {
  return await handle(request, context)
}
