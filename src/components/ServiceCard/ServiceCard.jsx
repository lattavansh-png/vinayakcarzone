import './ServiceCard.css'

// Line-art SVG icons (line drawing style matching the image)
const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z" />
  </svg>
)

const BatteryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="18" height="11" rx="2" />
    <line x1="22" y1="11" x2="22" y2="14" />
    <line x1="6" y1="11" x2="6" y2="14" />
    <line x1="10" y1="11" x2="10" y2="14" />
    <line x1="14" y1="11" x2="14" y2="14" />
  </svg>
)

const getIcon = (id) => {
  if (id === 'car-spa-cleaning') return <SparklesIcon />
  if (id === 'batteries') return <BatteryIcon />
  return <WrenchIcon />
}

function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <div className="service-card-icon" aria-hidden="true">
        {getIcon(service.id)}
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <div className="service-card-divider" aria-hidden="true" />
      <a className="service-card-link" href="/book">
        Book Now
        <svg className="service-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </article>
  )
}

export default ServiceCard
