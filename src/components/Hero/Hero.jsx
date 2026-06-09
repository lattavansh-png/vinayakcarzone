import './hero.css'

function Hero() {
  return (
    <section className="hero-banner">
      <div className="hero-content section-container">
        <div className="hero-visual">
          <div className="hero-image-wrap">
            <img src="/hero-bg.jpg" alt="Vinayak Car Zone Workshop" />
            <div className="hero-badge">
              <span>All<br />Brands</span>
            </div>
          </div>
        </div>

        <div className="hero-copy">
          <span className="hero-eyebrow">Trusted Car Service Center</span>
          <h1>
            Book Your Car Service <span>Online</span>
          </h1>
          <p>
            Expert car care at your fingertips. From routine maintenance to complex repairs,
            we've got you covered with transparent pricing and quality service.
          </p>

          <div className="hero-actions">
            <a className="button-primary" href="/book">
              Book Appointment
            </a>
            <a
              className="button-secondary"
              href="https://wa.me/917852872600?text=Hello%20Vinayak%20Car%20Zone%2C%0A%0AName%3A%20%0ACar%20Number%3A%20%0ACar%20Brand%20%26%20Model%3A%20%0AService%20Required%3A%20%0APreferred%20Date%3A%20%0APreferred%20Slot%3A%20"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
