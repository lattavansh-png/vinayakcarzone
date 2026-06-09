import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminLogin, setAuth, getToken } from '../../utils/adminApi'
import './AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (getToken()) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      const data = await adminLogin(email.trim(), password)
      setAuth(data.data.token, data.data.admin)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <Link to="/" className="admin-login-logo" aria-label="Vinayak Car Zone">
            <img src="/logo.png" alt="Vinayak Car Zone" />
          </Link>
          <h1>Admin Portal</h1>
          <p>Sign in to manage appointments and bookings</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="admin-alert admin-alert-error">{error}</div>}

          <label className="admin-field">
            <span>Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vinayakcarzone.in"
              autoComplete="email"
              required
              disabled={loading}
            />
          </label>

          <label className="admin-field">
            <span>Password</span>
            <div className="admin-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </label>

          <button type="submit" className="button-primary admin-login-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/" className="admin-back-link">
            ← Back to website
          </Link>
          <p className="admin-login-note">
            Restricted area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
