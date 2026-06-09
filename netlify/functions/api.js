// =============================================================
// Single catch-all Netlify Function
// -------------------------------------------------------------
// Netlify will invoke this for /api/* (see netlify.toml).
// It delegates to the in-process router.
// =============================================================
import { handle } from './_lib/router.js'

export default async (event) => handle(event)
