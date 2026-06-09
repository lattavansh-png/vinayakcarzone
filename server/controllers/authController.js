import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

/**
 * @desc    Login admin
 * @route   POST /api/admin/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find admin by email (include password for comparison)
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
      '+password'
    )

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact super-admin.',
      })
    }

    // Check password
    const isMatch = await admin.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Update last login
    admin.lastLogin = new Date()
    await admin.save({ validateBeforeSave: false })

    // Generate token
    const token = generateToken(admin._id)

    res.status(200).json({
      success: true,
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
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get current logged-in admin
 * @route   GET /api/admin/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id)

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Logout (client-side removes token)
 * @route   POST /api/admin/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Please remove the token from client.',
  })
}

/**
 * @desc    Change password
 * @route   PATCH /api/admin/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      })
    }

    const admin = await Admin.findById(req.admin._id).select('+password')

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    // Update password
    admin.password = newPassword
    await admin.save()

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please log in again.',
    })
  } catch (error) {
    next(error)
  }
}
