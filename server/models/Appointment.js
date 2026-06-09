import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^(\+91[\s-]?)?[6-9]\d{9}$/,
        'Please provide a valid Indian phone number',
      ],
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: {
        values: [
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
        message: '{VALUE} is not a valid service type',
      },
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
      validate: {
        validator: function (value) {
          // Date must be in the future
          return value > new Date()
        },
        message: 'Preferred date must be in the future',
      },
    },
    preferredTime: {
      type: String,
      trim: true,
      enum: {
        values: [
          '',
          '09:00 AM - 11:00 AM',
          '11:00 AM - 01:00 PM',
          '01:00 PM - 03:00 PM',
          '03:00 PM - 05:00 PM',
          '05:00 PM - 07:00 PM',
        ],
        message: '{VALUE} is not a valid time slot',
      },
      default: '',
    },
    vehicleNumber: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [20, 'Vehicle number too long'],
      default: '',
    },
    vehicleModel: {
      type: String,
      trim: true,
      maxlength: [50, 'Vehicle model too long'],
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    trackingId: {
      type: String,
      unique: true,
      index: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
)

// Generate tracking ID before saving
appointmentSchema.pre('save', async function (next) {
  if (this.isNew && !this.trackingId) {
    const date = new Date()
    const dateStr =
      date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0')

    // Get count of today's appointments
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))
    const count = await mongoose.model('Appointment').countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    })

    this.trackingId = `VCZ-${dateStr}-${String(count + 1).padStart(3, '0')}`
  }
  next()
})

// Index for faster queries
appointmentSchema.index({ createdAt: -1 })
appointmentSchema.index({ status: 1, createdAt: -1 })
appointmentSchema.index({ email: 1 })

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function () {
  return this.preferredDate.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
appointmentSchema.set('toJSON', { virtuals: true })
appointmentSchema.set('toObject', { virtuals: true })

const Appointment = mongoose.model('Appointment', appointmentSchema)

export default Appointment
