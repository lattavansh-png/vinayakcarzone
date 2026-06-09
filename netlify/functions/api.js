// =============================================================
// Single catch-all Netlify Function (v2 format)
// -------------------------------------------------------------
// Netlify will invoke this for /api/* (see netlify.toml).
// It delegates to the in-process router which returns a
// standard Web `Response` object.
// =============================================================
import { handle } from './_lib/router.js'

export default async (event, context) => {
  return await handle(event, context)
}
