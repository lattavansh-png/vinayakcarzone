import { useEffect, useState } from 'react'
import './OfferPopup.css'

function OfferPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Show the popup automatically when the homepage loads
    const t = setTimeout(() => setOpen(true), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    // Lock body scroll while popup is open
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // Close on ESC key
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  const handleBookNow = () => {
    setOpen(false)
    // Navigate to book page
    window.location.href = '/book'
  }

  return (
    <div
      className="offer-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-popup-title"
      onClick={(e) => {
        // Close when clicking the backdrop (but not the dialog itself)
        if (e.target === e.currentTarget) setOpen(false)
      }}
    >
      <div className="offer-popup">
        <button
          type="button"
          className="offer-popup-close"
          aria-label="Close offer"
          onClick={() => setOpen(false)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="offer-popup-header">
          <div className="offer-popup-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          </div>
          <p className="offer-popup-eyebrow">OPENING OFFER</p>
          <h2 id="offer-popup-title" className="offer-popup-price">
            <span className="offer-popup-currency">₹</span>999
          </h2>
          <p className="offer-popup-subtitle">Special Package</p>
        </div>

        <div className="offer-popup-body">
          <p className="offer-popup-includes">Package Includes:</p>

          <ul className="offer-popup-list">
            <li>
              <span className="offer-popup-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>5 Car Wash Services</span>
            </li>
            <li>
              <span className="offer-popup-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>5 Wheel Alignment Services</span>
            </li>
            <li>
              <span className="offer-popup-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>1 General Car Checkup</span>
            </li>
          </ul>

          <p className="offer-popup-validity">
            <strong>Validity:</strong> 1 Year from purchase
          </p>

          <button
            type="button"
            className="offer-popup-cta"
            onClick={handleBookNow}
          >
            BOOK NOW & SAVE
          </button>

          <p className="offer-popup-disclaimer">
            *Limited time offer. Terms & conditions apply.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OfferPopup
