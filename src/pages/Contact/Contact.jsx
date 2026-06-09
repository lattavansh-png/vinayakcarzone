import './Contact.css'

function Contact() {
  return (
    <div className="contact-page section-container">
      <div className="section-header">
        <p className="eyebrow">Contact</p>
        <h1>Reach out for service and support</h1>
      </div>
      <div className="contact-grid">
        <div className="contact-card">
          <h2>Location</h2>
          <p>V8W3+WM9, Dausa Bypass, Dausa, Rajasthan 303303</p>
        </div>
        <div className="contact-card">
          <h2>Phone</h2>
          <a href="tel:+917852872600">+91 78528 72600</a>
        </div>
        <div className="contact-card">
          <h2>Email</h2>
          <a href="mailto:helpdesk@vinayakcarzone.in">helpdesk@vinayakcarzone.in</a>
        </div>
        <div className="contact-card">
          <h2>Working Hours</h2>
          <p>Mon - Sun: 9:00 AM - 7:00 PM</p>
          <p>Emergency: 24/7 Available</p>
        </div>
      </div>
    </div>
  )
}

export default Contact
