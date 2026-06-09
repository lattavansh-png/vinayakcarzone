import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import Services from '../pages/Services/Services'
import Contact from '../pages/Contact/Contact'
import BookAppointment from '../pages/BookAppointment/BookAppointment'
import AdminLogin from '../pages/AdminLogin/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard'

function AppRoutes() {
  return (
    <Routes>
      {/* Public site routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/book" element={<BookAppointment />} />
      <Route path="/book-appointment" element={<BookAppointment />} />

      {/* Admin routes (kept off the main navbar intentionally) */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  )
}

export default AppRoutes
