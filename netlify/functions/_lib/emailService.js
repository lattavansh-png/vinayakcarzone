// =============================================================
// Email service for Netlify Functions
// Lazy nodemailer setup - only when SMTP env vars are set.
// Same templates as server/services/emailService.js.
// =============================================================

const SERVICE_LABELS = {
  'denting-painting': 'Denting & Painting',
  'car-spa-cleaning': 'Car Spa & Cleaning',
  'batteries': 'Battery Check/Replacement',
  'suspension-fitments': 'Suspension & Fitments',
  'clutch-body-parts': 'Clutch & Body Parts',
  'general-service': 'General Service',
  'car-inspections': 'Car Inspections',
  'ac-service-repair': 'AC Service & Repair',
  'tyres-wheel-care': 'Tyres & Wheel Care',
  'detailing-services': 'Detailing Services',
  'windshield-lights': 'Windshield & Lights',
  'insurance-claims': 'Insurance Claims',
  'other': 'Other',
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

let transporter = null
const getTransporter = async () => {
  if (transporter !== null) return transporter
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    transporter = false
    return false
  }
  const nodemailer = await import('nodemailer')
  transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  return transporter
}

const buildCustomerHtml = (a, serviceLabel, dashboardUrl) => {
  const timeRow = a.preferredTime
    ? '<tr><td style="padding: 8px 0; color: #475569; font-weight: bold;">Time Slot:</td><td style="padding: 8px 0; color: #0f172a;">' + a.preferredTime + '</td></tr>'
    : ''
  const vehicleNumRow = a.vehicleNumber
    ? '<tr><td style="padding: 8px 0; color: #475569; font-weight: bold;">Vehicle Number:</td><td style="padding: 8px 0; color: #0f172a;">' + a.vehicleNumber + '</td></tr>'
    : ''
  const vehicleModelRow = a.vehicleModel
    ? '<tr><td style="padding: 8px 0; color: #475569; font-weight: bold;">Vehicle Model:</td><td style="padding: 8px 0; color: #0f172a;">' + a.vehicleModel + '</td></tr>'
    : ''
  const notesBlock = a.notes
    ? '<p><strong>Your Notes:</strong><br>' + a.notes + '</p>'
    : ''
  return [
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head>',
    '<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; padding: 20px;">',
    '<div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">',
    '<div style="background: #dc2626; color: white; padding: 30px; text-align: center;">',
    '<h1 style="margin: 0; font-size: 28px;">Vinayak Car Zone</h1>',
    '<p style="margin: 8px 0 0; opacity: 0.95;">Your trusted car care partner</p>',
    '</div>',
    '<div style="padding: 30px;">',
    '<h2 style="color: #0f172a; margin-top: 0;">Booking Received! ✅</h2>',
    '<p>Dear <strong>' + a.name + '</strong>,</p>',
    '<p>Thank you for choosing Vinayak Car Zone. We have received your appointment request and our team will contact you within 24 hours to confirm.</p>',
    '<div style="background: #fee2e2; color: #dc2626; padding: 18px; text-align: center; border-radius: 8px; font-size: 18px; font-weight: bold; margin: 24px 0;">Tracking ID: ' + a.trackingId + '</div>',
    '<div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">',
    '<h3 style="margin-top: 0; color: #0f172a;">Booking Details</h3>',
    '<table style="width: 100%; border-collapse: collapse;">',
    '<tr><td style="padding: 8px 0; color: #475569; font-weight: bold; width: 40%;">Service:</td><td style="padding: 8px 0; color: #0f172a;">' + serviceLabel + '</td></tr>',
    '<tr><td style="padding: 8px 0; color: #475569; font-weight: bold;">Preferred Date:</td><td style="padding: 8px 0; color: #0f172a;">' + formatDate(a.preferredDate) + '</td></tr>',
    timeRow, vehicleNumRow, vehicleModelRow,
    '<tr><td style="padding: 8px 0; color: #475569; font-weight: bold;">Status:</td><td style="padding: 8px 0; color: #f59e0b; font-weight: bold; text-transform: uppercase;">' + a.status + '</td></tr>',
    '</table></div>',
    notesBlock,
    '<p><strong>What happens next?</strong></p>',
    '<ul><li>Our team will call you within 24 hours to confirm the appointment</li>',
    '<li>Please save your tracking ID for future reference</li>',
    '<li>You can reach us at +91 78528 72600 for any queries</li></ul>',
    '<p style="margin-top: 30px;">Best regards,<br><strong>Team Vinayak Car Zone</strong></p>',
    '</div>',
    '<div style="background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0;">',
    '<p style="margin: 0 0 8px;">V8W3+WM9, Dausa Bypass, Dausa, Rajasthan 303303</p>',
    '<p style="margin: 0;">📞 +91 78528 72600 | ✉️ helpdesk@vinayakcarzone.in</p>',
    '<p style="font-size: 12px; margin-top: 10px; color: #94a3b8;">This is an automated email. Please do not reply.</p>',
    '</div></div></body></html>',
  ].join('')
}

const buildAdminHtml = (a, serviceLabel, dashboardUrl) => {
  const dateStr = formatDate(a.preferredDate) + (a.preferredTime ? ' at ' + a.preferredTime : '')
  const vehicleRow = a.vehicleNumber
    ? '<tr><th style="text-align: left; padding: 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">Vehicle</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">' + a.vehicleNumber + (a.vehicleModel ? ' - ' + a.vehicleModel : '') + '</td></tr>'
    : ''
  const notesRow = a.notes
    ? '<tr><th style="text-align: left; padding: 10px; background: #f8fafc;">Notes</th><td style="padding: 10px;">' + a.notes + '</td></tr>'
    : ''
  return [
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head>',
    '<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; padding: 20px;">',
    '<div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">',
    '<div style="background: #dc2626; color: white; padding: 20px; text-align: center; font-size: 18px; font-weight: bold;">🔔 NEW APPOINTMENT BOOKING</div>',
    '<div style="padding: 30px;">',
    '<h2 style="margin-top: 0; color: #0f172a;">New Booking Received</h2>',
    '<p>A new appointment has been booked through the website.</p>',
    '<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">',
    '<tr><th style="text-align: left; padding: 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">Tracking ID</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">' + a.trackingId + '</td></tr>',
    '<tr><th style="text-align: left; padding: 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">Customer</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">' + a.name + '</td></tr>',
    '<tr><th style="text-align: left; padding: 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">Email</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:' + a.email + '" style="color: #dc2626;">' + a.email + '</a></td></tr>',
    '<tr><th style="text-align: left; padding: 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">Phone</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="tel:' + a.phone + '" style="color: #dc2626;">' + a.phone + '</a></td></tr>',
    '<tr><th style="text-align: left; padding: 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">Service</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">' + serviceLabel + '</td></tr>',
    '<tr><th style="text-align: left; padding: 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">Date</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">' + dateStr + '</td></tr>',
    vehicleRow, notesRow,
    '</table>',
    '<a href="' + dashboardUrl + '" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px;">View in Dashboard →</a>',
    '</div></div></body></html>',
  ].join('')
}

export const sendBookingConfirmation = async (appointment) => {
  const transport = await getTransporter()
  if (!transport) return
  const serviceLabel = SERVICE_LABELS[appointment.serviceType] || appointment.serviceType
  const dashboardUrl = (process.env.FRONTEND_URL || '') + '/admin/dashboard'
  try {
    await transport.sendMail({
      from: '"' + (process.env.SMTP_FROM_NAME || 'Vinayak Car Zone') + '" <' + (process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER) + '>',
      to: appointment.email,
      subject: 'Booking Confirmation - ' + appointment.trackingId,
      html: buildCustomerHtml(appointment, serviceLabel, dashboardUrl),
    })
  } catch (err) {
    console.error('Failed to send confirmation email:', err.message)
  }
}

export const sendAdminNotification = async (appointment) => {
  const transport = await getTransporter()
  if (!transport) return
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.SMTP_USER
  if (!adminEmail) return
  const serviceLabel = SERVICE_LABELS[appointment.serviceType] || appointment.serviceType
  const dashboardUrl = (process.env.FRONTEND_URL || '') + '/admin/dashboard'
  try {
    await transport.sendMail({
      from: '"' + (process.env.SMTP_FROM_NAME || 'Vinayak Car Zone') + '" <' + (process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER) + '>',
      to: adminEmail,
      subject: 'New Booking: ' + appointment.trackingId + ' - ' + appointment.name,
      html: buildAdminHtml(appointment, serviceLabel, dashboardUrl),
    })
  } catch (err) {
    console.error('Failed to send admin notification:', err.message)
  }
}
