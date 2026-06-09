import { useState } from 'react'
import servicesData from '../../data/servicesData'
import './AppointmentForm.css'

// API URL.  Empty string -> same-origin (works on Netlify once /api/*
// is wired up by netlify.toml).  Override with VITE_API_URL if you
// ever need to point the frontend at a different host.
const API_URL = import.meta.env.VITE_API_URL || ''

const TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '01:00 PM - 03:00 PM',
  '03:00 PM - 05:00 PM',
  '05:00 PM - 07:00 PM',
]

const STEPS = [
  { id: 1, label: 'Customer Details', icon: 'user' },
  { id: 2, label: 'Vehicle Details', icon: 'car' },
  { id: 3, label: 'Select Services', icon: 'wrench' },
  { id: 4, label: 'Date & Time', icon: 'calendar' },
]

function StepIcon({ name }) {
  const common = {
    width: 22,
    height: 22,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  if (name === 'user') {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  }
  if (name === 'car') {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
        <circle cx="6.5" cy="16.5" r="2.5" />
        <circle cx="16.5" cy="16.5" r="2.5" />
      </svg>
    )
  }
  if (name === 'wrench') {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    )
  }
  if (name === 'calendar') {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
  }
  return null
}

function AppointmentForm({ currentStep: externalStep, setCurrentStep: setExternalStep }) {
  const [internalStep, setInternalStep] = useState(1)
  const isControlled = externalStep !== undefined && setExternalStep !== undefined
  const currentStep = isControlled ? externalStep : internalStep
  const setCurrentStep = isControlled ? setExternalStep : setInternalStep

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    vehicleModel: '',
    vehicleType: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  })

  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [trackingId, setTrackingId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step) => {
    const errors = {}
    if (step === 1) {
      if (formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address'
      if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(formData.phone)) errors.phone = 'Invalid phone number (10 digits)'
    } else if (step === 2) {
      if (!formData.vehicleNumber.trim()) errors.vehicleNumber = 'Vehicle number is required'
    } else if (step === 3) {
      if (!formData.serviceType) errors.serviceType = 'Please select a service'
    } else if (step === 4) {
      if (!formData.preferredDate) errors.preferredDate = 'Please select a date'
      else {
        const selected = new Date(formData.preferredDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selected <= today) errors.preferredDate = 'Date must be in the future'
      }
    }
    return errors
  }

  const handleNext = () => {
    const errors = validateStep(currentStep)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setFieldErrors({})
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: 'idle', message: '' })

    const errors = validateStep(4)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setSubmitting(true)
    setFieldErrors({})

    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const serverErrors = {}
          data.errors.forEach((err) => {
            serverErrors[err.field] = err.message
          })
          setFieldErrors(serverErrors)
        }
        throw new Error(data.message || 'Failed to book appointment')
      }

      setStatus({
        type: 'success',
        message: 'Booking confirmed! Check your email for details. We will contact you within 24 hours.',
      })
      setTrackingId(data.data.trackingId)

      setFormData({
        name: '',
        email: '',
        phone: '',
        vehicleNumber: '',
        vehicleModel: '',
        vehicleType: '',
        serviceType: '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
      })
      setCurrentStep(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Network error. Please check your connection and try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const resetForm = () => {
    setStatus({ type: 'idle', message: '' })
    setTrackingId('')
    setCurrentStep(1)
  }

  if (status.type === 'success' && trackingId) {
    return (
      <div className="appointment-success">
        <div className="success-icon">✅</div>
        <h2>Booking Confirmed!</h2>
        <p className="success-message">{status.message}</p>
        <div className="tracking-box">
          <span className="tracking-label">Your Tracking ID</span>
          <span className="tracking-id">{trackingId}</span>
        </div>
        <p className="success-note">
          Please save this tracking ID for future reference. You can call us at
          <strong> +91 78528 72600</strong> with this ID for any queries.
        </p>
        <button type="button" className="button-primary" onClick={resetForm}>
          Book Another Appointment
        </button>
      </div>
    )
  }

  return (
    <form className="appointment-form" onSubmit={handleSubmit} noValidate>
      {status.type === 'error' && (
        <div className="form-alert form-alert-error">{status.message}</div>
      )}

      <h2 className="form-step-title">{STEPS[currentStep - 1].label}</h2>

      {currentStep === 1 && (
        <div className="form-step">
          <label>
            FULL NAME <span className="required">*</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={fieldErrors.name ? 'input-error' : ''}
              disabled={submitting}
            />
            {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
          </label>

          <label>
            PHONE NUMBER <span className="required">*</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10 digit mobile number"
              className={fieldErrors.phone ? 'input-error' : ''}
              disabled={submitting}
            />
            {fieldErrors.phone && <span className="error-text">{fieldErrors.phone}</span>}
          </label>

          <label>
            EMAIL ADDRESS <span className="required">*</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={fieldErrors.email ? 'input-error' : ''}
              disabled={submitting}
            />
            {fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}
          </label>
        </div>
      )}

      {currentStep === 2 && (
        <div className="form-step">
          <label>
            VEHICLE NUMBER <span className="required">*</span>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="e.g., RJ20AB1234"
              className={fieldErrors.vehicleNumber ? 'input-error' : ''}
              disabled={submitting}
              style={{ textTransform: 'uppercase' }}
            />
            {fieldErrors.vehicleNumber && <span className="error-text">{fieldErrors.vehicleNumber}</span>}
          </label>

          <label>
            VEHICLE MODEL
            <input
              type="text"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              placeholder="e.g., Honda City"
              disabled={submitting}
            />
          </label>

          <label>
            VEHICLE TYPE
            <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} disabled={submitting}>
              <option value="">Select vehicle type</option>
              <option value="hatchback">Hatchback</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="muv">MUV</option>
              <option value="luxury">Luxury</option>
            </select>
          </label>
        </div>
      )}

      {currentStep === 3 && (
        <div className="form-step">
          <label>
            SELECT SERVICE <span className="required">*</span>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className={fieldErrors.serviceType ? 'input-error' : ''}
              disabled={submitting}
            >
              <option value="">Choose a service</option>
              {servicesData.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
            {fieldErrors.serviceType && (
              <span className="error-text">{fieldErrors.serviceType}</span>
            )}
          </label>

          <label>
            ADDITIONAL NOTES
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tell us about any specific issues or requirements..."
              rows={4}
              disabled={submitting}
              maxLength={500}
            />
            <span className="char-count">{formData.notes.length}/500</span>
          </label>
        </div>
      )}

      {currentStep === 4 && (
        <div className="form-step">
          <label>
            PREFERRED DATE <span className="required">*</span>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              min={getMinDate()}
              className={fieldErrors.preferredDate ? 'input-error' : ''}
              disabled={submitting}
            />
            {fieldErrors.preferredDate && (
              <span className="error-text">{fieldErrors.preferredDate}</span>
            )}
          </label>

          <label>
            PREFERRED TIME
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="">Any time</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="form-actions">
        {currentStep > 1 && (
          <button type="button" className="button-secondary step-back-btn" onClick={handleBack} disabled={submitting}>
            ← Back
          </button>
        )}
        {currentStep < 4 ? (
          <button type="button" className="button-primary step-next-btn" onClick={handleNext} disabled={submitting}>
            Next →
          </button>
        ) : (
          <button type="submit" className="button-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        )}
      </div>
    </form>
  )
}

export default AppointmentForm
export { STEPS, StepIcon }
