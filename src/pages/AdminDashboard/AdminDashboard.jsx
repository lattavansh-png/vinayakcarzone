import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { fetchStats, fetchAppointments, updateStatus, deleteAppointment, clearAuth, getToken, getStoredAdmin } from '../../utils/adminApi'
import servicesData from '../../data/servicesData'
import './AdminDashboard.css'

const STATUSES = [
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'confirmed', label: 'Confirmed', color: '#10b981' },
  { value: 'in-progress', label: 'In Progress', color: '#8b5cf6' },
  { value: 'completed', label: 'Completed', color: '#ec4899' },
  { value: 'cancelled', label: 'Cancelled', color: '#6b7280' },
]
const STATUS_MAP = STATUSES.reduce((acc, s) => { acc[s.value] = s; return acc }, {})
const SERVICE_LABELS = servicesData.reduce((acc, s) => { acc[s.id] = s.title; return acc }, {})

const formatDate = (iso) => { if (!iso) return '—'; return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }
const formatDateTime = (iso) => { if (!iso) return '—'; return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }

const STAT_THEMES = {
  total: { iconBg: '#fde7e7', iconColor: '#dc2626', name: 'TOTAL BOOKINGS' },
  pending: { iconBg: '#fed7aa', iconColor: '#ea580c', name: 'PENDING' },
  confirmed: { iconBg: '#bbf7d0', iconColor: '#16a34a', name: 'CONFIRMED' },
  completed: { iconBg: '#e9d5ff', iconColor: '#9333ea', name: 'COMPLETED' },
  today: { iconBg: '#fce7f3', iconColor: '#db2777', name: 'TODAY' },
  thisWeek: { iconBg: '#fde7e7', iconColor: '#dc2626', name: 'THIS WEEK' },
}

const CalIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>)
const TrendUp = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" /></svg>)

function AdminDashboard() {
  const navigate = useNavigate()
  const [admin] = useState(() => getStoredAdmin())
  const [stats, setStats] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 20 })
  const [filters, setFilters] = useState({ status: 'all', search: '', page: 1, limit: 20 })
  const [searchInput, setSearchInput] = useState('')
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingList, setLoadingList] = useState(true)
  const [error, setError] = useState('')
  const [actionId, setActionId] = useState(null)
  const [toast, setToast] = useState(null)
  const [now, setNow] = useState(new Date())
  const [servicePeriod, setServicePeriod] = useState('thisMonth')
  const appointmentsRef = useRef(null)

  useEffect(() => { if (!getToken()) navigate('/admin/login', { replace: true }) }, [navigate])
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t) }, [])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t) }, [toast])
  const showToast = (type, message) => setToast({ type, message })

  const loadStats = useCallback(async () => {
    setLoadingStats(true)
    try { const data = await fetchStats(); setStats(data.data) }
    catch (err) {
      if (err.status === 401) { clearAuth(); navigate('/admin/login', { replace: true }); return }
      setError(err.message)
    } finally { setLoadingStats(false) }
  }, [navigate])

  const loadAppointments = useCallback(async () => {
    setLoadingList(true); setError('')
    try {
      const data = await fetchAppointments(filters)
      setAppointments(data.data || [])
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: filters.limit })
    } catch (err) {
      if (err.status === 401) { clearAuth(); navigate('/admin/login', { replace: true }); return }
      setError(err.message)
    } finally { setLoadingList(false) }
  }, [filters, navigate])

  useEffect(() => { loadStats() }, [loadStats])
  useEffect(() => { loadAppointments() }, [loadAppointments])
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => (prev.search === searchInput ? prev : { ...prev, search: searchInput, page: 1 }))
    }, 350)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleStatusFilter = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
    setTimeout(() => {
      if (appointmentsRef.current) {
        appointmentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    setFilters((prev) => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleStatusUpdate = async (id, status) => {
    setActionId(id)
    try { await updateStatus(id, status); showToast('success', 'Status updated'); await Promise.all([loadAppointments(), loadStats()]) }
    catch (err) {
      if (err.status === 401) { clearAuth(); navigate('/admin/login', { replace: true }); return }
      showToast('error', err.message || 'Failed')
    } finally { setActionId(null) }
  }
  const handleDelete = async (id, trackingId) => {
    if (!window.confirm(`Delete appointment ${trackingId}?`)) return
    setActionId(id)
    try { await deleteAppointment(id); showToast('success', 'Deleted'); await Promise.all([loadAppointments(), loadStats()]) }
    catch (err) {
      if (err.status === 401) { clearAuth(); navigate('/admin/login', { replace: true }); return }
      showToast('error', err.message || 'Failed')
    } finally { setActionId(null) }
  }
  const handleLogout = () => { clearAuth(); navigate('/admin/login', { replace: true }) }
  const handleRefresh = () => { loadStats(); loadAppointments() }
  const isSuperAdmin = admin?.role === 'super-admin'

  const serviceBreakdown = useMemo(() => {
    if (!stats?.serviceBreakdown) return []
    return stats.serviceBreakdown.map((item) => ({ ...item, label: SERVICE_LABELS[item._id] || item._id }))
  }, [stats])

  const totalServiceCount = serviceBreakdown.reduce((sum, s) => sum + s.count, 0)
  const formattedDate = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const formattedTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  const statCards = [
    { key: 'total', label: STAT_THEMES.total.name, value: stats?.total ?? 0, change: '+12%', changeDir: 'up', changeLabel: 'from last week', link: 'View all bookings',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" /><path d="M9 11V7a3 3 0 0 1 6 0v4" /></svg>,
      color: STAT_THEMES.total, filterStatus: 'all' },
    { key: 'pending', label: STAT_THEMES.pending.name, value: stats?.pending ?? 0, change: '↓ 8%', changeDir: 'down', changeLabel: 'from last week', link: 'View pending',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
      color: STAT_THEMES.pending, filterStatus: 'pending' },
    { key: 'confirmed', label: STAT_THEMES.confirmed.name, value: stats?.confirmed ?? 0, change: 'No change', changeDir: 'flat', changeLabel: '', link: 'View confirmed',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
      color: STAT_THEMES.confirmed, filterStatus: 'confirmed' },
    { key: 'completed', label: STAT_THEMES.completed.name, value: stats?.completed ?? 0, change: '↑ 0%', changeDir: 'up', changeLabel: 'from last week', link: 'View completed',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79" /><path d="M4 3h.01" /><path d="M22 8h.01" /><path d="M15 2h.01" /><path d="M22 20h.01" /><path d="M22 2 9.5 14.5l-2-2L13 7" /></svg>,
      color: STAT_THEMES.completed, filterStatus: 'completed' },
    { key: 'today', label: STAT_THEMES.today.name, value: stats?.todayCount ?? 0, change: 'No change', changeDir: 'flat', changeLabel: '', link: "Today's bookings",
      icon: <CalIcon />, color: STAT_THEMES.today, filterStatus: 'all' },
    { key: 'thisWeek', label: STAT_THEMES.thisWeek.name, value: stats?.thisWeekCount ?? 0, change: '↑ 15%', changeDir: 'up', changeLabel: 'from last week', link: "This week's bookings",
      icon: <TrendUp />, color: STAT_THEMES.thisWeek, filterStatus: 'all' },
  ]

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-inner section-container">
          <div className="admin-header-left">
            <Link to="/" className="admin-header-logo"><img src="/logo.png" alt="Vinayak Car Zone" /></Link>
            <div className="admin-header-text">
              <h1 className="admin-header-title">Admin Dashboard <span className="verified-badge" title="Verified"><svg viewBox="0 0 24 24" fill="#1d9bf0" width="20" height="20"><path d="M22.46 5.92c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.38 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.32 3.91A12.16 12.16 0 0 1 3 4.79a4.28 4.28 0 0 0 1.32 5.72 4.27 4.27 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.2 4.3 4.3 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.07a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.18-6.52 12.18-12.18 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 22.46 5.92z" /></svg></span></h1>
              <p className="admin-header-welcome">{admin ? `Welcome back, ${admin.name}!` : 'Welcome back, Admin!'} <span>👋</span></p>
              <div className="admin-header-meta">
                <span className="admin-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>{formattedDate}</span>
                <span className="admin-meta-sep">|</span>
                <span className="admin-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>{formattedTime}</span>
              </div>
            </div>
          </div>
          <div className="admin-header-actions">
            <Link to="/" className="admin-action-btn admin-action-view"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>View Site</Link>
            <button type="button" className="admin-action-btn admin-action-logout" onClick={handleLogout}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>Logout</button>
          </div>
        </div>
      </div>
      <div className="admin-dashboard-body section-container">
        {error && <div className="admin-alert admin-alert-error">{error}</div>}
        <div className="admin-stats">
          {statCards.map((card) => (
            <div key={card.key} className="admin-stat-card-new" onClick={() => handleStatusFilter(card.filterStatus)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleStatusFilter(card.filterStatus) }}>
              <div className="admin-stat-card-top">
                <div className="admin-stat-icon-new" style={{ background: card.color.iconBg, color: card.color.iconColor }}>{card.icon}</div>
                <span className="admin-stat-label-new">{card.label}</span>
              </div>
              <div className="admin-stat-value-new">{loadingStats ? '—' : (card.value ?? 0)}</div>
              <div className={`admin-stat-change admin-stat-change-${card.changeDir}`}>
                {card.changeDir === 'up' && card.change !== 'No change' && <span className="change-arrow">↑</span>}
                {card.changeDir === 'down' && <span className="change-arrow">↓</span>}
                <span>{card.change}</span>
                {card.changeLabel && <span className="change-label"> {card.changeLabel}</span>}
              </div>
              {card.link && <div className="admin-stat-link"><span>{card.link}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="9 18 15 12 9 6" /></svg></div>}
            </div>
          ))}
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <span className="admin-panel-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg></span>
              <h2>Service Type Breakdown</h2>
            </div>
            <select className="admin-period-select" value={servicePeriod} onChange={(e) => setServicePeriod(e.target.value)}>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
          {serviceBreakdown.length === 0 ? <div className="admin-empty">No service data yet.</div> : (
            <div className="admin-service-breakdown-new">
              <div className="admin-service-donut">
                <svg viewBox="0 0 120 120" width="160" height="160">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#fee2e2" strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#dc2626" strokeWidth="12" strokeDasharray="314.16 314.16" transform="rotate(-90 60 60)" strokeLinecap="round" />
                </svg>
                <div className="admin-service-donut-text"><span className="donut-pct">{totalServiceCount > 0 ? '100%' : '0%'}</span><span className="donut-label">of total</span></div>
              </div>
              <div className="admin-service-list">
                {serviceBreakdown.map((s) => {
                  const pct = totalServiceCount > 0 ? Math.round((s.count / totalServiceCount) * 100) : 0
                  return (
                    <div key={s._id} className="admin-service-item-new">
                      <div className="admin-service-row">
                        <div className="admin-service-info"><span className="admin-service-dot" /><span className="admin-service-name">{s.label}</span></div>
                        <span className="admin-service-count-new">{s.count}</span>
                      </div>
                      <div className="admin-service-row">
                        <div className="admin-service-bar-wrap"><div className="admin-service-bar-fill-new" style={{ width: `${pct}%` }} /></div>
                        <span className="admin-service-pct-new">{pct}%</span>
                      </div>
                      <div className="admin-service-sub">{s.count} Booking{s.count !== 1 ? 's' : ''}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="admin-panel" ref={appointmentsRef}>
          <div className="admin-panel-header"><h2>Appointments</h2>
            <div className="admin-panel-meta">
              {pagination.totalItems > 0 && <span>{pagination.totalItems} total · Page {pagination.currentPage} of {pagination.totalPages}</span>}
              <button type="button" className="admin-icon-btn" onClick={handleRefresh} title="Refresh">🔄</button>
            </div>
          </div>
          <div className="admin-filters">
            <div className="admin-filter-status">
              {['all', ...STATUSES.map((s) => s.value)].map((status) => (
                <button key={status} type="button" className={`admin-chip ${filters.status === status ? 'is-active' : ''}`} onClick={() => handleStatusFilter(status)}>
                  {status === 'all' ? 'All' : STATUS_MAP[status]?.label || status}
                </button>
              ))}
            </div>
            <input type="search" className="admin-search" placeholder="Search by name, email, phone..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          {loadingList ? <div className="admin-loading">Loading appointments…</div> : appointments.length === 0 ? (
            <div className="admin-empty"><span>📭</span><p>No appointments found.</p></div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Tracking ID</th><th>Customer</th><th>Service</th><th>Vehicle</th><th>Preferred</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {appointments.map((a) => {
                    const statusInfo = STATUS_MAP[a.status] || STATUS_MAP.pending
                    return (
                      <tr key={a._id}>
                        <td><code className="admin-tracking-id">{a.trackingId}</code></td>
                        <td><div className="admin-customer"><strong>{a.name}</strong><span>{a.email}</span><span>{a.phone}</span></div></td>
                        <td>{SERVICE_LABELS[a.serviceType] || a.serviceType}</td>
                        <td><div className="admin-vehicle"><span>{a.vehicleNumber || '—'}</span><span className="admin-vehicle-model">{a.vehicleModel || ''}</span></div></td>
                        <td><div className="admin-date"><span>{formatDate(a.preferredDate)}</span><span className="admin-time-slot">{a.preferredTime || 'Any time'}</span></div></td>
                        <td><span className="admin-status-pill" style={{ background: `${statusInfo.color}1a`, color: statusInfo.color }}>{statusInfo.label}</span></td>
                        <td><div className="admin-row-actions">
                          <select value={a.status} onChange={(e) => handleStatusUpdate(a._id, e.target.value)} disabled={actionId === a._id} className="admin-status-select">
                            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                          {isSuperAdmin && <button type="button" className="admin-delete-btn" onClick={() => handleDelete(a._id, a.trackingId)} disabled={actionId === a._id} title="Delete">🗑️</button>}
                        </div></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          {pagination.totalPages > 1 && (
            <div className="admin-pagination">
              <button type="button" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1} className="admin-page-btn">← Previous</button>
              <span className="admin-page-info">Page {pagination.currentPage} of {pagination.totalPages}</span>
              <button type="button" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages} className="admin-page-btn">Next →</button>
            </div>
          )}
        </div>
      </div>
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.message}</div>}
    </div>
  )
}

export default AdminDashboard
