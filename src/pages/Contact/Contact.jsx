import './Contact.css'

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="section-container">
          <p className="contact-eyebrow">CONTACT US</p>
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-desc">
            Have questions? We'd love to hear from you. Reach out to us for all your car service needs.
          </p>
        </div>
      </div>

      <div className="section-container contact-content">
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h2>Visit Our Workshop</h2>
            <p>V8W3+WM9, Dausa Bypass, Dausa, Rajasthan 303303</p>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h2>Call Us</h2>
            <a href="tel:+917852872600">+91 78528 72600</a>
            <p className="contact-card-sub">Available 24/7 for emergencies</p>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2>Email Us</h2>
            <a href="mailto:helpdesk@vinayakcarzone.in">helpdesk@vinayakcarzone.in</a>
            <p className="contact-card-sub">We'll respond within 24 hours</p>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2>Working Hours</h2>
            <p>Monday - Sunday: 9:00 AM - 7:00 PM</p>
            <p className="contact-card-emergency">Emergency: 24/7 Available</p>
          </div>
        </div>

        <div className="contact-map-section">
          <h2>Find Our Workshop</h2>
          <div className="contact-map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14232.704960265259!2d76.3058578254089!3d26.897901293627818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396d8d006d00c315%3A0x77463ccf34dea911!2sVinayak%20Car%20Zone!5e0!3m2!1sen!2sin!4v1781076423410!5m2!1sen!2sin"
              width="100%"
              height="450"
              className="contact-map"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vinayak Car Zone Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
