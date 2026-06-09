import { NavLink } from 'react-router-dom'
import './Footer.css'

// Line-art SVG icons matching the image style
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner section-container">
        <div className="footer-column footer-brand">
          <NavLink to="/" className="footer-logo">
            <img src="/logo.png" alt="Vinayak Car Zone" className="footer-logo-img" />
          </NavLink>
          <p className="footer-copy">
            Your trusted partner for all car service needs. Quality service, skilled technicians, and customer satisfaction guaranteed.
          </p>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/services">Services</NavLink>
            </li>
            <li>
              <NavLink to="/book">Book Appointment</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Services</h3>
          <ul className="footer-links footer-service-list">
            <li>AC Service & Repair</li>
            <li>Denting & Painting</li>
            <li>Car Spa & Cleaning</li>
            <li>Tyres & Wheel Care</li>
            <li>Insurance Claims</li>
          </ul>
        </div>

        <div className="footer-column footer-contact">
          <h3>Contact Us</h3>
          <ul className="footer-contact-list">
            <li>
              <span className="footer-icon" aria-hidden="true">
                <PinIcon />
              </span>
              <span>V8W3+WM9, Dausa Bypass, Dausa, Rajasthan 303303</span>
            </li>
            <li>
              <span className="footer-icon" aria-hidden="true">
                <PhoneIcon />
              </span>
              <a href="tel:+917852872600">+91 78528 72600</a>
            </li>
            <li>
              <span className="footer-icon" aria-hidden="true">
                <MailIcon />
              </span>
              <a href="mailto:helpdesk@vinayakcarzone.in">helpdesk@vinayakcarzone.in</a>
            </li>
            <li>
              <span className="footer-icon" aria-hidden="true">
                <ClockIcon />
              </span>
              <span>Mon - Sun: 9:00 AM - 7:00 PM</span>
            </li>
            <li>
              <span className="footer-icon footer-icon-emergency" aria-hidden="true">
                <ClockIcon />
              </span>
              <span className="footer-emergency">Emergency: 24/7 Available</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom section-container">
        <p>© 2026 Vinayak Car Zone. All rights reserved.</p>
        <a href="/admin/login">Admin Login</a>
      </div>
    </footer>
  )
}

export default Footer
