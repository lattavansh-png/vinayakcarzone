import './Gallery.css'

const IMAGES = Array.from({ length: 14 }).map((_, i) => `/gallery/gallery-${String(i + 1).padStart(2, '0')}.jpg`)

function Gallery() {
  return (
    <section className="gallery-section section-container">
      <div className="section-header">
        <p className="eyebrow">Gallery</p>
        <h2>Our Workshop & Work</h2>
      </div>
      <div className="gallery-grid">
        {IMAGES.map((src) => (
          <a key={src} className="gallery-item" href={src} target="_blank" rel="noreferrer">
            <img src={src} alt={src.split('/').pop()} loading="lazy" />
          </a>
        ))}
      </div>
    </section>
  )
}

export default Gallery
