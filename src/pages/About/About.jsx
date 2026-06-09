import { Link } from 'react-router-dom'
import './about.css'

const STATS = [
  { value: '98%', label: 'Happy Customers' },
  { value: '24/7', label: 'Emergency Service' },
  { value: '10+', label: 'Skilled Technicians' },
  { value: 'All Brands', label: 'Serviced' },
]

const MANAGEMENT = [
  {
    name: 'Ganga Sahay Kundara',
    role: 'General Manager',
    exp: '28+ Years',
    img: '/team/ganga-sahay-kundara.jpg',
    desc: 'An industry veteran with extensive hands-on experience in automobile servicing and workshop management, ensuring operational excellence and high service standards.',
  },
  {
    name: 'Kiran Kumar Prajapat',
    role: 'Service Advisor',
    exp: '12+ Years',
    img: '/team/kiran-kumar-prajapat.jpg',
    desc: 'A customer-focused professional specializing in service consultation, ensuring smooth communication between clients and the technical team.',
  },
]

const TECHNICIANS = [
  {
    name: 'Tipu Sultan',
    exp: '11+ Years',
    img: '/team/tipu-sultan.jpg',
    desc: 'Skilled technician specializing in vehicle diagnostics and repair, ensuring efficient and reliable service.',
  },
  {
    name: 'Vijay Mahawar',
    exp: '12+ Years',
    img: '/team/vijay-mahawar.jpg',
    desc: 'Experienced professional with strong expertise in handling complex automotive issues with accuracy and care.',
  },
]

const INSURANCE_PARTNERS = [
  'ICICI Lombard',
  'HDFC ERGO',
  'Bajaj Allianz',
  'New India Assurance',
  'National Insurance',
  'United India',
  'Tata AIG',
  'Reliance General',
]

const GALLERY = [
  { src: '/about/service-bay.jpg', alt: 'Service Bay', span: true },
  { src: '/about/parts-store.jpg', alt: 'Parts Store' },
  { src: '/about/hydraulic-lifts.jpg', alt: 'Hydraulic Lifts' },
  { src: '/about/equipment.jpg', alt: 'Equipment' },
  { src: '/about/workshop-floor.jpg', alt: 'Workshop Floor' },
]

function About() {
  return (
    <div className="about-page">
      {/* ====== HERO ====== */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="section-container about-hero-inner">
          <span className="about-tag">About Us</span>
          <h1 className="about-hero-title">
            Your Trusted <span className="text-red">Car Care</span> Partner
          </h1>
          <p className="about-hero-desc">
            Vinayak Car Zone is a newly established car service workshop in Dausa, Rajasthan,
            committed to providing exceptional car service and repair solutions.
          </p>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="about-stats">
        <div className="section-container about-stats-grid">
          {STATS.map((s) => (
            <div key={s.label} className="about-stat">
              <div className="about-stat-value">{s.value}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== OUR STORY ====== */}
      <section className="about-story">
        <div className="section-container about-story-grid">
          <div className="about-story-text">
            <span className="about-tag-sm">Our Story</span>
            <h2 className="about-section-title">Commitment to Excellence</h2>
            <div className="about-story-paras">
              <p>
                Vinayak Car Zone is a newly established car service workshop dedicated to
                providing honest, reliable, and affordable car service to the people of Dausa
                and surrounding areas in Rajasthan.
              </p>
              <p>
                Our workshop is equipped with modern diagnostic equipment and staffed by
                skilled automotive technicians with extensive hands-on experience in handling
                multiple car brands and services.
              </p>
              <p>
                We are committed to building long-term relationships with our customers
                through quality workmanship, transparent pricing, and exceptional customer
                service.
              </p>
            </div>
          </div>
          <div className="about-story-images">
            <img src="/about/service-bay.jpg" alt="Service Bay" loading="lazy" />
            <img src="/about/parts-store.jpg" alt="Parts Store" loading="lazy" />
            <img src="/about/hydraulic-lifts.jpg" alt="Hydraulic Lifts" loading="lazy" />
            <img src="/about/equipment.jpg" alt="Equipment" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ====== MANAGEMENT TEAM ====== */}
      <section className="about-team about-team-management">
        <div className="section-container">
          <div className="about-section-header">
            <span className="about-tag-sm">Management</span>
            <h2 className="about-section-title">Our Management Team</h2>
          </div>
          <div className="about-team-grid about-team-grid-2">
            {MANAGEMENT.map((m) => (
              <div key={m.name} className="about-team-card">
                <div className="about-team-photo">
                  <img src={m.img} alt={m.name} loading="lazy" />
                </div>
                <div className="about-team-body">
                  <h3 className="about-team-name">{m.name}</h3>
                  <span className="about-team-role">{m.role}</span>
                  <span className="about-team-exp">{m.exp}</span>
                  <p className="about-team-desc">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== EXPERT TECHNICIANS ====== */}
      <section className="about-team about-team-technicians">
        <div className="section-container">
          <div className="about-section-header">
            <span className="about-tag-sm">Our Experts</span>
            <h2 className="about-section-title">Expert Technicians</h2>
          </div>
          <div className="about-team-grid about-team-grid-2">
            {TECHNICIANS.map((t) => (
              <div key={t.name} className="about-team-card">
                <div className="about-team-photo">
                  <img src={t.img} alt={t.name} loading="lazy" />
                </div>
                <div className="about-team-body">
                  <h3 className="about-team-name">{t.name}</h3>
                  <span className="about-team-exp">{t.exp} Experience</span>
                  <p className="about-team-desc">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== INSURANCE PARTNERS ====== */}
      <section className="about-insurance">
        <div className="section-container">
          <div className="about-section-header about-section-header-light">
            <span className="about-tag-sm-light">Insurance Partners</span>
            <h2 className="about-section-title about-section-title-light">
              Cashless Insurance Claims
            </h2>
            <p className="about-insurance-desc">
              We are partnered with almost all major insurance companies for hassle-free
              cashless insurance claim services. Get your car repaired without any
              out-of-pocket expenses.
            </p>
          </div>
          <div className="about-insurance-grid">
            {INSURANCE_PARTNERS.map((p) => (
              <div key={p} className="about-insurance-pill">
                <span aria-hidden="true">🛡️</span>
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== WORKSHOP GALLERY ====== */}
      <section className="about-gallery">
        <div className="section-container">
          <div className="about-section-header">
            <span className="about-tag-sm">Our Workshop</span>
            <h2 className="about-section-title">Modern Facility</h2>
          </div>
          <div className="about-gallery-grid">
            {GALLERY.map((g) => (
              <div key={g.alt} className={`about-gallery-item ${g.span ? 'span-tall' : ''}`}>
                <img src={g.src} alt={g.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="about-cta">
        <div className="section-container about-cta-inner">
          <h2 className="about-cta-title">Ready to Experience the Best Car Service in Dausa?</h2>
          <p className="about-cta-desc">
            Book your appointment today and let our experts take care of your vehicle.
          </p>
          <div className="about-cta-buttons">
            <Link to="/book" className="about-cta-btn about-cta-btn-primary">
              Book Appointment
            </Link>
            <a
              href="https://wa.me/917852872600"
              target="_blank"
              rel="noopener noreferrer"
              className="about-cta-btn about-cta-btn-outline"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
