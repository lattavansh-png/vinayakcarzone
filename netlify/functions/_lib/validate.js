// =============================================================
// Validation schemas
// Mirrors server/middleware/validate.js but uses a tiny
// in-house implementation so we don't pull in zod.
// =============================================================

export const SERVICE_TYPES = [
  'denting-painting',
  'car-spa-cleaning',
  'batteries',
  'suspension-fitments',
  'clutch-body-parts',
  'general-service',
  'car-inspections',
  'ac-service-repair',
  'tyres-wheel-care',
  'detailing-services',
  'windshield-lights',
  'insurance-claims',
  'other',
]

export const TIME_SLOTS = [
  '',
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '01:00 PM - 03:00 PM',
  '03:00 PM - 05:00 PM',
  '05:00 PM - 07:00 PM',
]

export const APPOINTMENT_STATUSES = [
  'pending',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_RE = /^[a-zA-Z\s.]+$/
const PHONE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/

// Returns { ok: true, value } or { ok: false, errors: [{ field, message }] }
const runChecks = (field, value, checks) => {
  for (const c of checks) {
    const r = c(value)
    if (r !== true) return { field, message: r }
  }
  return null
}

export const validateAppointment = (body) => {
  const errors = []
  const data = { ...(body || {}) }

  // name
  {
    const v = (data.name || '').trim()
    let msg = null
    if (!v) msg = 'Name is required'
    else if (v.length < 2) msg = 'Name must be at least 2 characters'
    else if (v.length > 50) msg = 'Name cannot exceed 50 characters'
    else if (!NAME_RE.test(v)) msg = 'Name can only contain letters, spaces, and dots'
    if (msg) errors.push({ field: 'name', message: msg })
    else data.name = v
  }

  // email
  {
    const v = (data.email || '').trim().toLowerCase()
    if (!v) errors.push({ field: 'email', message: 'Email is required' })
    else if (!EMAIL_RE.test(v)) errors.push({ field: 'email', message: 'Please provide a valid email address' })
    else data.email = v
  }

  // phone
  {
    const v = (data.phone || '').trim()
    if (!v) errors.push({ field: 'phone', message: 'Phone number is required' })
    else if (!PHONE_RE.test(v)) errors.push({ field: 'phone', message: 'Please provide a valid Indian phone number (10 digits)' })
    else data.phone = v
  }

  // serviceType
  {
    const v = data.serviceType
    if (!v) errors.push({ field: 'serviceType', message: 'Service type is required' })
    else if (!SERVICE_TYPES.includes(v)) errors.push({ field: 'serviceType', message: 'Please select a valid service type' })
  }

  // preferredDate
  {
    const v = data.preferredDate
    if (!v) errors.push({ field: 'preferredDate', message: 'Preferred date is required' })
    else if (isNaN(Date.parse(v))) errors.push({ field: 'preferredDate', message: 'Invalid date format' })
    else {
      const d = new Date(v)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (d <= today) errors.push({ field: 'preferredDate', message: 'Preferred date must be in the future' })
      else data.preferredDate = new Date(v).toISOString()
    }
  }

  // preferredTime
  {
    const v = data.preferredTime
    if (v != null && v !== '' && !TIME_SLOTS.includes(v)) {
      errors.push({ field: 'preferredTime', message: 'Invalid time slot' })
    } else {
      data.preferredTime = v || ''
    }
  }

  // optional string fields
  for (const f of ['vehicleNumber', 'vehicleModel', 'notes']) {
    const max = f === 'notes' ? 500 : f === 'vehicleModel' ? 50 : 20
    if (data[f] != null && data[f] !== '') {
      const v = String(data[f]).trim()
      if (v.length > max) errors.push({ field: f, message: `${f} too long` })
      else data[f] = v
    } else {
      data[f] = ''
    }
  }

  if (errors.length) return { ok: false, errors }
  return { ok: true, value: data }
}

export const validateLogin = (body) => {
  const errors = []
  const email = (body?.email || '').trim().toLowerCase()
  const password = body?.password || ''
  if (!email || !EMAIL_RE.test(email)) errors.push({ field: 'email', message: 'Please provide a valid email' })
  if (!password) errors.push({ field: 'password', message: 'Password is required' })
  if (errors.length) return { ok: false, errors }
  return { ok: true, value: { email, password } }
}

export const validateStatusUpdate = (body) => {
  const status = body?.status
  if (!status || !APPOINTMENT_STATUSES.includes(status)) {
    return { ok: false, errors: [{ field: 'status', message: 'Invalid status value' }] }
  }
  return { ok: true, value: { status } }
}

export const validatePasswordChange = (body) => {
  const errors = []
  const currentPassword = body?.currentPassword || ''
  const newPassword = body?.newPassword || ''
  if (!currentPassword) errors.push({ field: 'currentPassword', message: 'Current password is required' })
  if (!newPassword) errors.push({ field: 'newPassword', message: 'New password is required' })
  else if (newPassword.length < 8) errors.push({ field: 'newPassword', message: 'New password must be at least 8 characters' })
  if (errors.length) return { ok: false, errors }
  return { ok: true, value: { currentPassword, newPassword } }
}
