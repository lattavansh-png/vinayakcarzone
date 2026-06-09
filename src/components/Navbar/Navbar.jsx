import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom'
import { getStoredAdmin, getToken, clearAuth, fetchStats } from '../../utils/adminApi'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Admin state
  const [admin] = useState(() => (isAdminRoute ? getStoredAdmin() : null))
  const [stats, setStats] = useState(null)

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Fetch quick stats for admin top bar
  useEffect(() => {
    if (!isAdminRoute) return
    if (!getToken()) {
      setStats(null)
      return
    }
    let cancelled = false
    const loadStats = async () => {
      try {
        const data = await fetchStats()
        if (!cancelled) setStats(data.data || null)
      } catch (err) {
        if (!cancelled) setStats(null)
      }
    }
    loadStats()
    // Refresh stats every 60 seconds
    const interval = setInterval(loadStats, 60000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [isAdminRoute, location.pathname])

  const closeMenu = () => setMenuOpen(false)

  const handleAdminLogout = () => {
    clearAuth()
    navigate('/admin/login', { replace: true })
  }

  const handleRefreshStats = () => {
    if (!isAdminRoute) return
    fetchStats()
      .then((data) => setStats(data.data || null))
      .catch(() => setStats(null))
  }

  return (
    <header className={`navbar ${isAdminRoute ? 'navbar-admin' : ''}`}>
      {/* ================= TOP BAR (public routes only) ================= */}
      {!isAdminRoute && (
        <div className="navbar-top section-container">
          <div className="navbar-top-left">
            <a className="navbar-top-item" href="tel:+917852872600">
              <span aria-hidden="true">📞</span>
              <span className="navbar-top-item-text">+91 78528 72600</span>
            </a>
            <a className="navbar-top-item navbar-top-item-address" href="https://maps.app.goo.gl/">
              <span aria-hidden="true">📍</span>
              <span className="navbar-top-item-text">Dausa bypass, Near AVM school, Dausa, Rajasthan</span>
            </a>
          </div>
          <div className="navbar-top-right">
            <span className="navbar-top-item navbar-top-item-hours">
              <span aria-hidden="true">⏰</span>
              <span className="navbar-top-item-text">Mon - Sun: 9:00 AM - 7:00 PM</span>
            </span>
            <span className="navbar-top-badge">24/7 Emergency</span>
          </div>
        </div>
      )}

      {/* ================= MAIN NAV ROW (public routes only) ================= */}
      {!isAdminRoute && (
        <div className="navbar-inner section-container">
          <NavLink className="brand" to="/" onClick={closeMenu} aria-label="Vinayak Car Zone - Home">
            <img src="/logo.png" alt="Vinayak Car Zone" className="brand-logo" />
          </NavLink>

          <button
            type="button"
            className={`navbar-toggle ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            id="primary-navigation"
            className={`navbar-menu ${menuOpen ? 'is-open' : ''}`}
          >
            <>
              <nav className="nav-links" onClick={closeMenu}>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/" end>
                  Home
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/about">
                  About
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/services">
                  Services
                </NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/book">
                  Book Appointment
                </NavLink>
                <NavLink className={({ isActive }) => `nav-cta ${isActive ? 'active' : ''}`} to="/contact">
                  Contact
                </NavLink>
              </nav>

              <NavLink className="button-link button-secondary navbar-book" to="/book" onClick={closeMenu}>
                Book Now
              </NavLink>
            </>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
