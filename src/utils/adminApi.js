// API helper for admin authentication & management endpoints.
// Same-origin by default (works on Netlify once /api/* is wired
// up by netlify.toml).  Override with VITE_API_URL if needed.
const API_URL = import.meta.env.VITE_API_URL || ''

const TOKEN_KEY = 'vcz_admin_token'
const ADMIN_KEY = 'vcz_admin_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getStoredAdmin = () => {
  try {
    const raw = localStorage.getItem(ADMIN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setAuth = (token, admin) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
}

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ADMIN_KEY)
}

const request = async (path, { method = 'GET', body, auth = false } = {}) => {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (!token) {
      throw new Error('Not authenticated. Please log in.')
    }
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Try parse JSON (may be empty for 204)
  let data = null
  try {
    data = await res.json()
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status})`
    const error = new Error(message)
    error.status = res.status
    error.data = data
    throw error
  }

  return data
}

export const adminLogin = (email, password) =>
  request('/api/admin/login', { method: 'POST', body: { email, password } })

export const fetchMe = () => request('/api/admin/me', { auth: true })

export const fetchStats = () => request('/api/appointments/admin/stats', { auth: true })

export const fetchAppointments = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value)
    }
  })
  const qs = query.toString()
  return request(`/api/appointments/admin/all${qs ? `?${qs}` : ''}`, { auth: true })
}

export const updateStatus = (id, status) =>
  request(`/api/appointments/admin/${id}`, { method: 'PATCH', body: { status }, auth: true })

export const deleteAppointment = (id) =>
  request(`/api/appointments/admin/${id}`, { method: 'DELETE', auth: true })

export const changePassword = (currentPassword, newPassword) =>
  request('/api/admin/change-password', {
    method: 'PATCH',
    body: { currentPassword, newPassword },
    auth: true,
  })

export { API_URL }
