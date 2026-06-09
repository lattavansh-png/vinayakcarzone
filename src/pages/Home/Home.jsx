import Hero from '../../components/Hero/Hero'
import ServiceCard from '../../components/ServiceCard/ServiceCard'
import servicesData from '../../data/servicesData'
import './Home.css'
import Gallery from '../../components/Gallery/Gallery'
import OfferPopup from '../../components/OfferPopup/OfferPopup'

// Inline SVG icons (line-art style) for the features section
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2 4 5v6c0 5 3.5 9.4 8 11 4.5-1.6 8-6 8-11V5l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M3 12h18" />
    <path d="M12 8v13" />
    <path d="M12 8c-2 0-4-1.5-4-3.5S10 3 12 3s4 1 4 2.5S14 8 12 8Z" />
    <path d="M12 8c2 0 4-1.5 4-3.5S14 3 12 3" />
  </svg>
)

function Home() {
  return (
    <div className="home-page">
      <Hero />
      <OfferPopup />

      <section className="special-offer section-container">
        <div className="special-offer-card">
          <div className="special-offer-icon" aria-hidden="true">
            <GiftIcon />
          </div>
          <div className="special-offer-text">
            <p className="offer-eyebrow">OPENING OFFER - ?999 Package</p>
            <p className="offer-copy">
              5 Car Wash + 5 Wheel Alignment + 1 General Checkup | Valid for 1 Year
            </p>
          </div>
          <a className="offer-book-btn" href="/book">
            BOOK NOW
          </a>
        </div>
      </section>

      <section className="features-section section-container">
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <ShieldIcon />
            </div>
            <h4>Genuine Parts</h4>
            <p>100% authentic OEM parts</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <ClockIcon />
            </div>
            <h4>Quick Service</h4>
            <p>Same day delivery</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <PeopleIcon />
            </div>
            <h4>Skilled Technicians</h4>
            <p>Trained professionals</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <StarIcon />
            </div>
            <h4>Quality Assured</h4>
            <p>Guaranteed satisfaction</p>
          </div>
        </div>
      </section>

      <section className="home-services section-container">
        <div className="section-header">
          <p className="section-eyebrow">OUR SERVICES</p>
          <h2>Complete Car Care Solutions</h2>
          <p className="section-desc">
            From routine maintenance to specialized repairs, our skilled team handles it all with precision and care.
          </p>
        </div>
        <div className="service-grid">
          {servicesData.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="view-all-wrapper">
          <a className="view-all-btn" href="/services">
            VIEW ALL SERVICES
            <svg className="view-all-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </section>

      <section className="why-choose-us section-container">
        <div className="why-choose-us-grid">
          <div className="why-choose-us-content">
            <p className="why-eyebrow">WHY CHOOSE US</p>
            <h2>Experience The Difference</h2>
            <ul className="why-list">
              <li>
                <span className="why-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <h4>Skilled Technicians</h4>
                  <p>Trained professionals for all car brands</p>
                </div>
              </li>
              <li>
                <span className="why-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <h4>Insurance Partnered</h4>
                  <p>Partnered with major insurance companies</p>
                </div>
              </li>
              <li>
                <span className="why-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <h4>Transparent Pricing</h4>
                  <p>No hidden charges, no surprises</p>
                </div>
              </li>
              <li>
                <span className="why-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <h4>Warranty on Service</h4>
                  <p>Peace of mind with every repair</p>
                </div>
              </li>
              <li>
                <span className="why-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <h4>24/7 Emergency Service</h4>
                  <p>Available round the clock for emergencies</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="why-choose-us-image">
            <img src="/gg.avif" alt="Vinayak Car Zone Workshop" />
            <div className="emergency-badge">
              <span className="emergency-badge-title">24/7</span>
              <span className="emergency-badge-sub">EMERGENCY SERVICE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section section-container">
        <div className="testimonials-header">
          <p className="testimonials-eyebrow">TESTIMONIALS</p>
          <h2>What Our Customers Say</h2>
        </div>
        <div className="testimonials-grid">
          <article className="testimonial-card">
            <div className="testimonial-stars" aria-label="5 out of 5 stars">
              <span>?</span><span>?</span><span>?</span><span>?</span><span>?</span>
            </div>
            <p className="testimonial-text">
              "Excellent service! My car feels brand new after the complete service. The team is professional and transparent about pricing."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">R</div>
              <div>
                <p className="author-name">Rajesh Kumar</p>
                <p className="author-car">Honda City</p>
              </div>
            </div>
          </article>
          <article className="testimonial-card">
            <div className="testimonial-stars" aria-label="5 out of 5 stars">
              <span>?</span><span>?</span><span>?</span><span>?</span><span>?</span>
            </div>
            <p className="testimonial-text">
              "Best car spa in Dausa! They took care of every detail. Highly recommend their cleaning services."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">P</div>
              <div>
                <p className="author-name">Priya Sharma</p>
                <p className="author-car">Maruti Swift</p>
              </div>
            </div>
          </article>
          <article className="testimonial-card">
            <div className="testimonial-stars" aria-label="5 out of 5 stars">
              <span>?</span><span>?</span><span>?</span><span>?</span><span>?</span>
            </div>
            <p className="testimonial-text">
              "Trustworthy and reliable. Their AC repair service saved me a lot of money. Great workshop!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">A</div>
              <div>
                <p className="author-name">Amit Patel</p>
                <p className="author-car">Hyundai Creta</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <Gallery />

      <section className="final-cta section-container">
        <div className="final-cta-card">
          <h2>Ready to Book Your Service?</h2>
          <p>Get your car serviced by skilled technicians. Book online or call us now!</p>
          <div className="cta-actions">
            <a className="button-primary cta-book" href="/book">
              BOOK APPOINTMENT
              <svg className="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a className="button-secondary cta-call" href="tel:+917852872600">
              <svg className="cta-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              CALL NOW
            </a>
          </div>
        </div>
      </section>

      <section className="location-section section-container">
        <div className="location-header">
          <p className="location-eyebrow">VISIT US</p>
          <h2>Find Our Workshop</h2>
        </div>
        <div className="location-grid">
          <div className="location-info">
            <div className="info-item">
              <div className="info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h4>Address</h4>
                <p>V8W3+WM9, Dausa Bypass, Dausa, Rajasthan 303303</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <h4>Phone</h4>
                <a href="tel:+917852872600">+91 78528 72600</a>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 14" />
                </svg>
              </div>
              <div>
                <h4>Working Hours</h4>
                <p className="info-hours">Monday - Sunday: 9:00 AM - 7:00 PM</p>
                <p className="info-emergency">Emergency: 24/7 Available</p>
              </div>
            </div>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3568.3522519999996!2d75.40891!3d27.30556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c71c5d5d5d5d5%3A0x5d5d5d5d5d5d5d5!2sVinayak%20Car%20Zone!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="430"
              className="location-map"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
