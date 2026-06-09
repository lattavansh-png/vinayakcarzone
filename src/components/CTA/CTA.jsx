import './CTA.css'

function CTA() {
  return (
    <section className="cta-panel section-container">
      <div>
        <p className="eyebrow">Need help choosing?</p>
        <h2>Book a general checkup and we’ll recommend the right service.</h2>
      </div>
      <a className="button-secondary" href="/book">
        Book General Checkup
      </a>
    </section>
  )
}

export default CTA
