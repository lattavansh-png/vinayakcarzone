import Appointment from '../models/Appointment.js'
import { sendBookingConfirmation, sendAdminNotification } from '../services/emailService.js'

/**
 * @desc    Create a new appointment (public)
 * @route   POST /api/appointments
 * @access  Public
 */
export const createAppointment = async (req, res, next) => {
  try {
    const { name, email, phone, serviceType, preferredDate, preferredTime, vehicleNumber, vehicleModel, notes } = req.body

    // Create appointment
    const appointment = await Appointment.create({
      name,
      email,
      phone,
      serviceType,
      preferredDate: new Date(preferredDate),
      preferredTime,
      vehicleNumber,
      vehicleModel,
      notes,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
    })

    // Send emails (don't await - send in background so user doesn't wait)
    Promise.allSettled([
      sendBookingConfirmation(appointment),
      sendAdminNotification(appointment),
    ]).catch((err) => console.error('Email send error:', err))

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! We will contact you shortly to confirm.',
      data: {
        id: appointment._id,
        trackingId: appointment.trackingId,
        status: appointment.status,
        name: appointment.name,
        serviceType: appointment.serviceType,
        preferredDate: appointment.preferredDate,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get appointment by ID or tracking ID (public - with tracking ID)
 * @route   GET /api/appointments/:id
 * @access  Public
 */
export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params

    // Try to find by tracking ID first, then by MongoDB ID
    let appointment = await Appointment.findOne({ trackingId: id })
      .select('-ipAddress')

    if (!appointment) {
      // Check if valid MongoDB ID
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        appointment = await Appointment.findById(id).select('-ipAddress')
      }
    }

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found. Please check your tracking ID.',
      })
    }

    res.status(200).json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all appointments (admin)
 * @route   GET /api/admin/appointments
 * @access  Private/Admin
 * @query   status, page, limit, search
 */
export const getAllAppointments = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20, sort = '-createdAt' } = req.query

    // Build filter
    const filter = {}
    if (status && status !== 'all') {
      filter.status = status
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i')
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { trackingId: searchRegex },
        { vehicleNumber: searchRegex },
      ]
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-ipAddress'),
      Appointment.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get single appointment (admin)
 * @route   GET /api/admin/appointments/:id
 * @access  Private/Admin
 */
export const getSingleAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).select('-ipAddress')

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      })
    }

    res.status(200).json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update appointment status (admin)
 * @route   PATCH /api/admin/appointments/:id
 * @access  Private/Admin
 */
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-ipAddress')

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete appointment (admin)
 * @route   DELETE /api/admin/appointments/:id
 * @access  Private/Admin
 */
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get dashboard statistics (admin)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [
      total,
      pending,
      confirmed,
      completed,
      todayCount,
      thisWeekCount,
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow },
      }),
      Appointment.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ])

    // Service type breakdown
    const serviceBreakdown = await Appointment.aggregate([
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        confirmed,
        completed,
        todayCount,
        thisWeekCount,
        serviceBreakdown,
      },
    })
  } catch (error) {
    next(error)
  }
}
