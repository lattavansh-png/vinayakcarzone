// =============================================================
// Tiny router for Netlify Functions (Web Standard Request/Response)
// -------------------------------------------------------------
// Maps URL paths to handler functions. All handlers receive
// the raw `Request` object and return a Web `Response` object.
// =============================================================

import { verifyJwt, extractToken, rateLimit } from './auth.js'
import { validateAppointment, validateLogin, validateStatusUpdate, validatePasswordChange } from './validate.js'
import {
  ensureDefaultAdmin, findAdminByEmail, getAdminById, saveAdmin, verifyPassword, hashPassword,
  saveAppointment, getAppointmentById, findAppointmentByTrackingId,
  listAppointments, deleteAppointment, getNextDailyCount, generateId,
} from './store.js'
import { sendBookingConfirmation, sendAdminNotification } from './emailService.js'

// ---------- response helpers ----------
const ok = (data, status = 200) =>
  new Response(JSON.stringify({ success: true, ...data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const fail = (status, message, extra = {}) =>
  new Response(JSON.stringify({ success: false, message, ...extra }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

// ---------- CORS headers ----------
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

const corsResponse = (status = 204) =>
  new Response('', { status, headers: corsHeaders })

// ---------- helpers ----------
const getClientIp = (request) => {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-nf-client-connection-ip') ||
    request.headers.get('client-ip') ||
    ''
  )
}

const requireAdmin = async (request) => {
  await ensureDefaultAdmin()

  const auth = request.headers.get('authorization') || request.headers.get('Authorization')
  const token = extractToken(auth)
  if (!token) return { error: { status: 401, message: 'Not authorized. Please log in to access this resource.' } }
  const payload = await verifyJwt(token, process.env.JWT_SECRET)
  if (!payload) return { error: { status: 401, message: 'Invalid or expired token. Please log in again.' } }
  const admin = await getAdminById(payload.id)
  if (!admin) return { error: { status: 401, message: 'Admin no longer exists.' } }
  if (!admin.isActive) return { error: { status: 401, message: 'Your account has been deactivated.' } }
  return { admin }
}

const trackingIdFor = async () => {
  const today = new Date()
  const dateStr =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0')
  const count = await getNextDailyCount()
  return 'VCZ-' + dateStr + '-' + String(count).padStart(3, '0')
}

// ---------- handlers ----------

// HEALTH
const health = async () =>
  ok({ message: 'Vinayak Car Zone API is running', timestamp: new Date().toISOString() })

// POST /api/appointments  (public, rate-limited)
const createAppointment = async (request) => {
  const ip = getClientIp(request)
  const rl = await rateLimit({
    key: 'booking:' + (ip || 'anon'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
  })
  if (!rl.allowed) {
    return fail(429, 'Too many booking requests, please try again later.')
  }

  let body = {}
  try { body = await request.json() } catch { body = {} }

  const v = validateAppointment(body)
  if (!v.ok) return fail(400, 'Validation failed', { errors: v.errors })
  const data = v.value

  const trackingId = await trackingIdFor()
  const now = new Date().toISOString()
  const appointment = {
    _id: generateId('apt_'),
    ...data,
    status: 'pending',
    trackingId,
    ipAddress: ip,
    createdAt: now,
    updatedAt: now,
  }
  await saveAppointment(appointment)

  // Fire-and-forget emails (don't await so user doesn't wait)
  Promise.allSettled([
    sendBookingConfirmation(appointment),
    sendAdminNotification(appointment),
  ]).catch((err) => console.error('Email send error:', err))

  return ok({
    message: 'Appointment booked successfully! We will contact you shortly to confirm.',
    data: {
      id: appointment._id,
      trackingId: appointment.trackingId,
      status: appointment.status,
      name: appointment.name,
      serviceType: appointment.serviceType,
      preferredDate: appointment.preferredDate,
    },
  }, 201)
}

// GET /api/appointments/:id  (public, by tracking id)
const getById = async (_request, { params }) => {
  const { id } = params
  let appointment = await findAppointmentByTrackingId(id)
  if (!appointment) appointment = await getAppointmentById(id)
  if (!appointment) return fail(404, 'Appointment not found. Please check your tracking ID.')
  const { ipAddress, ...safe } = appointment
  return ok({ data: safe })
}

// GET /api/appointments/admin/stats  (admin)
const getStats = async () => {
  const all = await listAppointments()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const count = (pred) => all.filter(pred).length
  const breakdown = {}
  all.forEach((a) => { breakdown[a.serviceType] = (breakdown[a.serviceType] || 0) + 1 })
  const serviceBreakdown = Object.entries(breakdown)
    .map(([id, count]) => ({ _id: id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return ok({
    data: {
      total: all.length,
      pending: count((a) => a.status === 'pending'),
      confirmed: count((a) => a.status === 'confirmed'),
      completed: count((a) => a.status === 'completed'),
      todayCount: count((a) => {
        const t = new Date(a.createdAt).getTime()
        return t >= today.getTime() && t < tomorrow.getTime()
      }),
      thisWeekCount: count((a) => new Date(a.createdAt).getTime() >= weekAgo.getTime()),
      serviceBreakdown,
    },
  })
}

// GET /api/appointments/admin/all?status=&search=&page=&limit=&sort=
const getAll = async (_request, { query }) => {
  const { status, search, page = 1, limit = 20, sort = '-createdAt' } = query
  let all = await listAppointments()

  if (status && status !== 'all') all = all.filter((a) => a.status === status)
  if (search) {
    const re = new RegExp(String(search), 'i')
    all = all.filter((a) =>
      re.test(a.name) || re.test(a.email) || re.test(a.phone) ||
      re.test(a.trackingId) || re.test(a.vehicleNumber)
    )
  }

  const sortKey = sort.startsWith('-') ? sort.slice(1) : sort
  const dir = sort.startsWith('-') ? -1 : 1
  all.sort((a, b) => {
    const va = a[sortKey] ?? ''
    const vb = b[sortKey] ?? ''
    if (va < vb) return -1 * dir
    if (va > vb) return 1 * dir
    return 0
  })

  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
  const total = all.length
  const items = all.slice((pageNum - 1) * limitNum, pageNum * limitNum)
    .map(({ ipAddress, ...rest }) => rest)

  return ok({
    data: items,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
      itemsPerPage: limitNum,
    },
  })
}

// GET /api/appointments/admin/:id
const getSingle = async (_request, { params }) => {
  const a = await getAppointmentById(params.id)
  if (!a) return fail(404, 'Appointment not found')
  const { ipAddress, ...safe } = a
  return ok({ data: safe })
}

// PATCH /api/appointments/admin/:id   body: { status }
const updateStatus = async (request, { params }) => {
  let body = {}
  try { body = await request.json() } catch { body = {} }
  const v = validateStatusUpdate(body)
  if (!v.ok) return fail(400, 'Validation failed', { errors: v.errors })
  const a = await getAppointmentById(params.id)
  if (!a) return fail(404, 'Appointment not found')
  a.status = v.value.status
  a.updatedAt = new Date().toISOString()
  await saveAppointment(a)
  const { ipAddress, ...safe } = a
  return ok({ message: 'Appointment status updated successfully', data: safe })
}

// DELETE /api/appointments/admin/:id   (super-admin only)
const remove = async (_request, { params, admin }) => {
  if (admin.role !== 'super-admin') {
    return fail(403, 'You do not have permission to perform this action.')
  }
  const a = await getAppointmentById(params.id)
  if (!a) return fail(404, 'Appointment not found')
  await deleteAppointment(params.id)
  return ok({ message: 'Appointment deleted successfully' })
}

// POST /api/admin/login
const login = async (request) => {
  await ensureDefaultAdmin()
  let body = {}
  try { body = await request.json() } catch { body = {} }
  const v = validateLogin(body)
  if (!v.ok) return fail(400, 'Validation failed', { errors: v.errors })

  const admin = await findAdminByEmail(v.value.email)
  if (!admin) return fail(401, 'Invalid email or password')
  if (!admin.isActive) return fail(401, 'Your account has been deactivated. Please contact super-admin.')

  const okPwd = await verifyPassword(v.value.password, admin.passwordHash)
  if (!okPwd) return fail(401, 'Invalid email or password')

  admin.lastLogin = new Date().toISOString()
  admin.updatedAt = admin.lastLogin
  await saveAdmin(admin)

  const { signJwt } = await import('./auth.js')
  const token = await signJwt(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN || '7d'
  )

  return ok({
    message: 'Login successful',
    data: {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    },
  })
}

// GET /api/admin/me
const me = async (_request, { admin }) =>
  ok({
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin,
    },
  })

// POST /api/admin/logout  (client just discards token)
const logout = async () =>
  ok({ message: 'Logged out successfully. Please remove the token from client.' })

// PATCH /api/admin/change-password   body: { currentPassword, newPassword }
const changePassword = async (request, { admin }) => {
  let body = {}
  try { body = await request.json() } catch { body = {} }
  const v = validatePasswordChange(body)
  if (!v.ok) return fail(400, 'Validation failed', { errors: v.errors })
  const { currentPassword, newPassword } = v.value
  const okPwd = await verifyPassword(currentPassword, admin.passwordHash)
  if (!okPwd) return fail(401, 'Current password is incorrect')
  admin.passwordHash = await hashPassword(newPassword)
  admin.updatedAt = new Date().toISOString()
  await saveAdmin(admin)
  return ok({ message: 'Password changed successfully. Please log in again.' })
}

// ---------- auth-wrapping middleware ----------
const withAdmin = (handler) => async (request, ctx) => {
  const r = await requireAdmin(request)
  if (r.error) return fail(r.error.status, r.error.message)
  return handler(request, ctx)
}

// ---------- route table ----------
// Patterns accept both /api/... (when reached via SPA redirect) and
// /... (when reached directly at /.netlify/functions/api/...).
const routes = [
  // health
  { method: 'GET',    pattern: /^\/(?:api\/)?health\/?$/,                                          handler: health },

  // public appointments
  { method: 'POST',   pattern: /^\/(?:api\/)?appointments\/?$/,                                    handler: createAppointment },
  { method: 'GET',    pattern: /^\/(?:api\/)?appointments\/([^\/]+)\/?$/, groups: ['id'],          handler: getById },

  // admin: appointments
  { method: 'GET',    pattern: /^\/(?:api\/)?appointments\/admin\/stats\/?$/,                     handler: withAdmin(getStats) },
  { method: 'GET',    pattern: /^\/(?:api\/)?appointments\/admin\/all\/?$/,                       handler: withAdmin(getAll) },
  { method: 'GET',    pattern: /^\/(?:api\/)?appointments\/admin\/([^\/]+)\/?$/, groups: ['id'],   handler: withAdmin(getSingle) },
  { method: 'PATCH',  pattern: /^\/(?:api\/)?appointments\/admin\/([^\/]+)\/?$/, groups: ['id'],   handler: withAdmin(updateStatus) },
  { method: 'DELETE', pattern: /^\/(?:api\/)?appointments\/admin\/([^\/]+)\/?$/, groups: ['id'],   handler: withAdmin(remove) },

  // admin: auth
  { method: 'POST',   pattern: /^\/(?:api\/)?admin\/login\/?$/,                                     handler: login },
  { method: 'GET',    pattern: /^\/(?:api\/)?admin\/me\/?$/,                                        handler: withAdmin(me) },
  { method: 'POST',   pattern: /^\/(?:api\/)?admin\/logout\/?$/,                                    handler: withAdmin(logout) },
  { method: 'PATCH',  pattern: /^\/(?:api\/)?admin\/change-password\/?$/,                          handler: withAdmin(changePassword) },
]

// ---------- main entry: handle(request, context) ----------
// Accepts a standard Web `Request` and returns a Web `Response`.
export const handle = async (request) => {
  try {
    const url = new URL(request.url)
    let path = url.pathname
    const method = request.method

    // Strip Netlify function prefix like /.netlify/functions/api
    path = path.replace(/^\/.netlify\/functions\/[^/]+/, '')
    if (!path.startsWith('/')) path = '/' + path
    const pathForMatch = path.length > 1 ? path.replace(/\/+$/, '') : path

    // CORS preflight
    if (method === 'OPTIONS') {
      return corsResponse(204)
    }

    // Build a query object from the URL
    const query = Object.fromEntries(url.searchParams.entries())
    const queryNum = {}
    for (const [k, v] of Object.entries(query)) {
      const n = parseInt(v, 10)
      queryNum[k] = isNaN(n) || String(n) !== v ? v : n
    }

    for (const r of routes) {
      if (r.method !== method) continue
      const m = r.pattern.exec(pathForMatch)
      if (!m) continue
      const params = {}
      if (r.groups) r.groups.forEach((name, i) => { params[name] = decodeURIComponent(m[i + 1]) })
      const response = await r.handler(request, { params, query: queryNum })
      // Add CORS headers to every response
      const newHeaders = new Headers(response.headers)
      Object.entries(corsHeaders).forEach(([k, v]) => {
        if (!newHeaders.has(k)) newHeaders.set(k, v)
      })
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      })
    }

    // No route matched
    return new Response(
      JSON.stringify({ success: false, message: `Route ${method} ${path} not found` }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Handler error:', err)
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error', error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
