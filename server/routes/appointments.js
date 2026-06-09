import express from 'express'
import rateLimit from 'express-rate-limit'
import {
  createAppointment,
  getAppointmentById,
  getAllAppointments,
  getSingleAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getDashboardStats,
} from '../controllers/appointmentController.js'
import { protect, restrictTo } from '../middleware/auth.js'
import { validate, appointmentSchema, statusUpdateSchema } from '../middleware/validate.js'

const router = express.Router()

// Rate limiter for the public booking endpoint only.
// This prevents spam on the booking form without throttling admin routes.
const bookingLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10, // 10 requests per window
  message: {
    success: false,
    message: 'Too many booking requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// ========== PUBLIC ROUTES ==========

// Create new appointment (rate-limited to prevent spam)
router.post('/', bookingLimiter, validate(appointmentSchema), createAppointment)

// Get appointment by ID or tracking ID
router.get('/:id', getAppointmentById)

// ========== ADMIN ROUTES (PROTECTED) ==========

// All routes below require admin authentication
router.use(protect)

// Dashboard stats
router.get('/admin/stats', getDashboardStats)

// Get all appointments (with filtering & pagination)
router.get('/admin/all', getAllAppointments)

// Get single appointment
router.get('/admin/:id', getSingleAppointment)

// Update appointment status
router.patch('/admin/:id', validate(statusUpdateSchema), updateAppointmentStatus)

// Delete appointment
router.delete('/admin/:id', restrictTo('super-admin'), deleteAppointment)

export default router
