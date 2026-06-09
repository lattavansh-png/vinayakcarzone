import express from 'express'
import { login, getMe, logout, changePassword } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { validate, loginSchema } from '../middleware/validate.js'

const router = express.Router()

// Public routes
router.post('/login', validate(loginSchema), login)

// Protected routes (require JWT)
router.get('/me', protect, getMe)
router.post('/logout', protect, logout)
router.patch('/change-password', protect, changePassword)

export default router
