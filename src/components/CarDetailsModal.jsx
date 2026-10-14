import { useState, useEffect } from 'react'
import './CarDetailsModal.css'

export default function CarDetailsModal({ car, onClose }) {
  const [activePhoto, setActivePhoto] = useState(0)

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!car) return null

  const photos = car.gallery && car.gallery.length > 0 ? car.gallery : [car.image]

  const whatsappMsg = encodeURIComponent(
    `Hello Zara Cars! I am interested in the ${car.year} ${car.name} (Price: ${car.price}) listed at No. 1, Sri Balaji Complex showroom.\n\nPlease share test drive availability and complete inspection report.`
  )
  const whatsappUrl = `https://wa.me/919876543210?text=${whatsappMsg}`

  const testDriveMsg = encodeURIComponent(
    `Hello Zara Cars! I want to schedule a test drive for the ${car.year} ${car.name} at your Sri Balaji Complex showroom (Kanchipuram to Chengalpattu Main Road). When can I visit?`
  )
  const testDriveUrl = `https://wa.me/919876543210?text=${testDriveMsg}`

  return (
    <div className="car-modal__backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="car-modal__container" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Top Bar */}
        <div className="car-modal__top-bar">
          <div className="car-modal__top-info">
            <span className="car-modal__showroom-tag">
              <span className="car-modal__pulse-dot" />
              ZARA CARS CERTIFIED · NO. 1 SRI BALAJI COMPLEX
            </span>
            <span className="car-modal__badge">{car.badge}</span>
          </div>

          <button
            onClick={onClose}
            className="car-modal__close-btn"
            aria-label="Close vehicle details"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="car-modal__content">
          
          {/* Section 1: Hero Header & Gallery */}
          <div className="car-modal__hero-grid">
            
            {/* Gallery Viewport */}
            <div className="car-modal__gallery">
              <div className="car-modal__main-photo-wrap">
                <img
                  src={photos[activePhoto]}
                  alt={`${car.name} preview`}
                  className="car-modal__main-photo"
                />
                <div className="car-modal__photo-overlay" />
                <span className="car-modal__photo-tag">{car.tag}</span>
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="car-modal__thumbs">
                  {photos.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={`car-modal__thumb ${activePhoto === i ? 'car-modal__thumb--active' : ''}`}
                      type="button"
                    >
                      <img src={src} alt={`${car.name} view ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Pricing & Vehicle Headline */}
            <div className="car-modal__header-card">
              <div className="car-modal__title-group">
                <div className="car-modal__year-pill">{car.year} MODEL</div>
                <h2 className="car-modal__car-name">{car.name}</h2>
                <p className="car-modal__tagline">{car.desc}</p>
              </div>

              {/* Price Display */}
              <div className="car-modal__pricing-block">
                <div className="car-modal__price-main">
                  <span className="car-modal__price-figure">{car.price}</span>
                  <span className="car-modal__price-sub">{car.priceSub}</span>
                </div>
                {car.originalPrice && (
                  <div className="car-modal__savings-badge">
                    <span className="car-modal__orig-price">New Car: {car.originalPrice}</span>
                    <span className="car-modal__save-text">{car.savings}</span>
                  </div>
                )}
              </div>

              {/* Essential Pillars Grid */}
              <div className="car-modal__meta-grid">
                <div className="car-modal__meta-box">
                  <span className="car-modal__meta-label">Odometer</span>
                  <span className="car-modal__meta-val">{car.km}</span>
                </div>
                <div className="car-modal__meta-box">
                  <span className="car-modal__meta-label">Fuel &amp; Gearbox</span>
                  <span className="car-modal__meta-val">{car.fuel}</span>
                </div>
                <div className="car-modal__meta-box">
                  <span className="car-modal__meta-label">Ownership</span>
                  <span className="car-modal__meta-val">{car.owner}</span>
                </div>
                <div className="car-modal__meta-box">
                  <span className="car-modal__meta-label">RTO Registration</span>
                  <span className="car-modal__meta-val">{car.rto}</span>
                </div>
                <div className="car-modal__meta-box">
                  <span className="car-modal__meta-label">Insurance</span>
                  <span className="car-modal__meta-val">{car.insurance}</span>
                </div>
                <div className="car-modal__meta-box">
                  <span className="car-modal__meta-label">Warranty</span>
                  <span className="car-modal__meta-val text-champagne">{car.warranty}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Section 2: Key Features & Equipment */}
          {car.highlights && car.highlights.length > 0 && (
            <div className="car-modal__section">
              <h3 className="car-modal__section-title">
                <span className="divider-line" />
                Key Equipment &amp; Features
              </h3>
              <div className="car-modal__features-grid">
                {car.highlights.map((feat, idx) => (
                  <div key={idx} className="car-modal__feature-pill">
                    <span className="car-modal__feature-check">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Technical Specifications */}
          {car.specs && car.specs.length > 0 && (
            <div className="car-modal__section">
              <h3 className="car-modal__section-title">
                <span className="divider-line" />
                Technical Specifications
              </h3>
              <div className="car-modal__specs-table">
                {car.specs.map((sp, idx) => (
                  <div key={idx} className="car-modal__spec-row">
                    <span className="car-modal__spec-name">{sp.label}</span>
                    <span className="car-modal__spec-value">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: 140-Point Diagnostic Inspection Clearance */}
          {car.checks && car.checks.length > 0 && (
            <div className="car-modal__section">
              <h3 className="car-modal__section-title">
                <span className="divider-line" />
                140-Point Showroom Certification Report
              </h3>
              <div className="car-modal__checks-grid">
                {car.checks.map((chk, idx) => (
                  <div key={idx} className="car-modal__check-card">
                    <div className="car-modal__check-top">
                      <span className="car-modal__check-cat">{chk.category}</span>
                      <span className="car-modal__check-badge">{chk.status}</span>
                    </div>
                    <p className="car-modal__check-detail">{chk.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Showroom Location Assurance Card */}
          <div className="car-modal__assurance-box">
            <div className="car-modal__assurance-text">
              <h4>Best Price &amp; Best Service Is Our Assurance</h4>
              <p>
                Available for immediate inspection &amp; test drive at <strong>No. 1, Sri Balaji Complex, Kanchipuram to Chengalpattu Main Road</strong>. 
                Complete documentation, spot financing assistance, and free RTO transfer included.
              </p>
            </div>
            <div className="car-modal__assurance-seal">
              <span className="car-modal__seal-tag">EST. 2023</span>
              <span className="car-modal__seal-motto">ZARA CARS</span>
            </div>
          </div>

        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="car-modal__actions-bar">
          <div className="car-modal__action-price-summary">
            <span className="car-modal__summary-label">TOTAL PRICE</span>
            <span className="car-modal__summary-price">{car.price}</span>
          </div>

          <div className="car-modal__action-btns">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="car-modal__btn-whatsapp"
              data-cursor-text="WHATSAPP"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Enquire on WhatsApp</span>
            </a>

            <a
              href={testDriveUrl}
              target="_blank"
              rel="noreferrer"
              className="car-modal__btn-testdrive"
              data-cursor-text="BOOK"
            >
              <span>Book Test Drive</span>
            </a>

            <a
              href="tel:+919876543210"
              className="car-modal__btn-call"
              data-cursor-text="CALL"
              aria-label="Call Sri Balaji Showroom"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
