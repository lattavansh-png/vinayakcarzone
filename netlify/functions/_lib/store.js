// =============================================================
// Storage layer using Netlify Blobs
// -------------------------------------------------------------
// Two named stores are used:
//   - "appointments": one blob per appointment, key = id
//   - "admins":       one blob per admin,     key = id
// =============================================================
import { getStore } from '@netlify/blobs'

const APPOINTMENTS_STORE = 'appointments'
const ADMINS_STORE = 'admins'

// Generate a reasonably-unique id without external libs
export const generateId = (prefix = '') => {
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 10)
  return `${prefix}${ts}${rand}`
}

// ---------- Appointments ----------
export const getAppointmentsStore = () => getStore(APPOINTMENTS_STORE)

export const saveAppointment = async (appointment) => {
  const store = getAppointmentsStore()
  await store.setJSON(appointment._id, appointment)
  return appointment
}

export const getAppointmentById = async (id) => {
  const store = getAppointmentsStore()
  try {
    return await store.get(id, { type: 'json' })
  } catch {
    return null
  }
}

export const findAppointmentByTrackingId = async (trackingId) => {
  const store = getAppointmentsStore()
  const { blobs } = await store.list()
  for (const blob of blobs) {
    const apt = await store.get(blob.key, { type: 'json' })
    if (apt && apt.trackingId === trackingId) return apt
  }
  return null
}

export const listAppointments = async () => {
  const store = getAppointmentsStore()
  const { blobs } = await store.list()
  const items = await Promise.all(
    blobs.map((b) => store.get(b.key, { type: 'json' }))
  )
  return items.filter(Boolean)
}

export const deleteAppointment = async (id) => {
  const store = getAppointmentsStore()
  await store.delete(id)
}

// ---------- Counters (for tracking-id generation) ----------
const COUNTERS_STORE = 'counters'
export const getCountersStore = () => getStore(COUNTERS_STORE)

export const getNextDailyCount = async () => {
  const store = getCountersStore()
  const today = new Date()
  const dateStr =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0')
  const key = `appointments_${dateStr}`
  let counter
  try {
    counter = await store.get(key, { type: 'json' })
  } catch {
    counter = { count: 0 }
  }
  counter.count = (counter.count || 0) + 1
  await store.setJSON(key, counter)
  return counter.count
}

// ---------- Admins ----------
export const getAdminsStore = () => getStore(ADMINS_STORE)

export const saveAdmin = async (admin) => {
  const store = getAdminsStore()
  await store.setJSON(admin._id, admin)
  return admin
}

export const findAdminByEmail = async (email) => {
  const store = getAdminsStore()
  const { blobs } = await store.list()
  const target = (email || '').toLowerCase()
  for (const blob of blobs) {
    const admin = await store.get(blob.key, { type: 'json' })
    if (admin && admin.email && admin.email.toLowerCase() === target) {
      return admin
    }
  }
  return null
}

export const getAdminById = async (id) => {
  const store = getAdminsStore()
  try {
    return await store.get(id, { type: 'json' })
  } catch {
    return null
  }
}

// Seed the default admin (idempotent). Called from auth-protected
// endpoints so seeding happens lazily on first request.
export const ensureDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return null

  const existing = await findAdminByEmail(email)
  if (existing) return existing

  // Don't ship the bcryptjs native dep to Netlify Functions; we
  // hash with a small pure-JS sha-256 + salt + iterations.
  // This is plenty for an admin account that has rate-limited
  // login attempts and lives behind a JWT.
  const passwordHash = await hashPassword(password)

  const admin = {
    _id: generateId('adm_'),
    name: process.env.ADMIN_NAME || 'Admin',
    email: email.toLowerCase(),
    passwordHash,
    role: 'super-admin',
    isActive: true,
    lastLogin: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await saveAdmin(admin)
  return admin
}

// ---------- Password hashing (pure JS, no native deps) ----------
// PBKDF2 via Web Crypto API (available in Netlify Functions runtime)
const ITERATIONS = 100_000

export const hashPassword = async (password) => {
  const salt = crypto.randomUUID().replace(/-/g, '')
  const hash = await pbkdf2(password, salt, ITERATIONS)
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`
}

export const verifyPassword = async (password, stored) => {
  if (!stored || typeof stored !== 'string') return false
  const parts = stored.split('$')
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false
  const iterations = parseInt(parts[1], 10)
  const salt = parts[2]
  const expected = parts[3]
  const actual = await pbkdf2(password, salt, iterations)
  return timingSafeEqual(actual, expected)
}

const pbkdf2 = async (password, salt, iterations) => {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  )
  return bufferToHex(new Uint8Array(bits))
}

const bufferToHex = (buf) =>
  Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

const timingSafeEqual = (a, b) => {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return result === 0
}
