import { z } from 'zod'

/**
 * Validation schemas using Zod
 * Provides strong, type-safe input validation
 */

// Appointment validation schema
// NOTE: serviceType enum must match the IDs used in src/data/servicesData.js
export const appointmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s.]+$/, 'Name can only contain letters, spaces, and dots'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),

  phone: z
    .string()
    .trim()
    .regex(
      /^(\+91[\s-]?)?[6-9]\d{9}$/,
      'Please provide a valid Indian phone number (10 digits)'
    ),

  serviceType: z.enum(
    [
      'denting-painting',
      'car-spa-cleaning',
      'batteries',
      'suspension-fitments',
      'clutch-body-parts',
      'general-service',
      'car-inspections',
      'ac-service-repair',
      'tyres-wheel-care',
      'detailing-services',
      'windshield-lights',
      'insurance-claims',
      'other',
    ],
    { errorMap: () => ({ message: 'Please select a valid service type' }) }
  ),

  preferredDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
    .refine((val) => {
      const date = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date > today
    }, 'Preferred date must be in the future'),

  preferredTime: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        [
          '',
          '09:00 AM - 11:00 AM',
          '11:00 AM - 01:00 PM',
          '01:00 PM - 03:00 PM',
          '03:00 PM - 05:00 PM',
          '05:00 PM - 07:00 PM',
        ].includes(val),
      'Invalid time slot'
    ),

  // Optional fields - allow empty string, undefined, or null
  vehicleNumber: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => (val == null ? '' : String(val).trim()))
    .refine((val) => val.length <= 20, 'Vehicle number too long')
    .optional(),

  vehicleModel: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => (val == null ? '' : String(val).trim()))
    .refine((val) => val.length <= 50, 'Vehicle model too long')
    .optional(),

  notes: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => (val == null ? '' : String(val).trim()))
    .refine((val) => val.length <= 500, 'Notes cannot exceed 500 characters')
    .optional(),
})

// Admin login validation schema
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
})

// Status update validation schema
export const statusUpdateSchema = z.object({
  status: z.enum(
    ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    { errorMap: () => ({ message: 'Invalid status value' }) }
  ),
})

/**
 * Generic validation middleware factory
 * Usage: validate(appointmentSchema)
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body)
    req.body = validated // Replace with validated & sanitized data
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      })
    }
    next(error)
  }
}
