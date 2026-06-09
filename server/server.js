import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import connectDB from './config/db.js'
import appointmentRoutes from './routes/appointments.js'
import authRoutes from './routes/auth.js'
import errorHandler from './middleware/errorHandler.js'
import Admin from './models/Admin.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
const startServer = async () => {
  await connectDB()

  // Auto-seed default admin (useful for first run / in-memory dev DBs).
  // Skipped silently if an admin with the configured email already exists.
  try {
    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL })
    if (!existing && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      await Admin.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'super-admin',
      })
      console.log(`🌱 Default admin seeded: ${process.env.ADMIN_EMAIL}`)
    }
  } catch (err) {
    console.warn('⚠️  Could not auto-seed admin:', err.message)
  }
}
startServer()

// Initialize Express
const app = express()

// Security middleware
app.use(helmet())

// CORS - allow frontend to make requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Rate limiting (prevents spam on booking endpoint)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10, // 10 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// NOTE: Rate limiter is applied specifically to the public POST booking route
// in routes/appointments.js so that admin routes (which are called frequently)
// are NOT throttled.

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vinayak Car Zone API is running',
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/appointments', appointmentRoutes)
app.use('/api/admin', authRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// Global error handler (must be last)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
})
