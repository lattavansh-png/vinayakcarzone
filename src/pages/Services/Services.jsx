import ServiceCard from '../../components/ServiceCard/ServiceCard'
import servicesData from '../../data/servicesData'
import './Services.css'

function Services() {
  return (
    <div className="services-page section-container">
      <div className="section-header">
        <span className="eyebrow">Our Services</span>
        <h2>Complete Car Care Solutions</h2>
        <p className="section-copy">
          From routine maintenance to specialized repairs, our skilled technicians handle it all with precision, transparency, and care.
        </p>
      </div>
      <div className="service-grid">
        {servicesData.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      <div className="services-help">
        <div>
          <h3>Not Sure What Service You Need?</h3>
          <p>
            Book a general car checkup and our technicians will diagnose any issues and recommend the right services for your vehicle.
          </p>
        </div>
        <div className="help-actions">
          <a className="button-primary" href="/book">
            Book General Checkup
          </a>
          <a className="button-secondary" href="/contact">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

export default Services
