import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CATEGORIES, BUDGETS } from '../data/cars'
import { inventoryService } from '../services/inventoryService'
import CarDetailsModal from './CarDetailsModal'
import './Collection.css'

gsap.registerPlugin(ScrollTrigger)

// 3D tilt effect on mouse hover
function useTilt(ref) {
  const onMouseMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    gsap.to(ref.current, {
      rotateY: dx * 6,
      rotateX: -dy * 5,
      transformPerspective: 900,
      ease: 'power2.out',
      duration: 0.4,
    })
  }, [ref])

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return
    gsap.to(ref.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
  }, [ref])

  return { onMouseMove, onMouseLeave }
}

function PreOwnedCard({ car, onSelectCar }) {
  const cardRef = useRef(null)
  const innerRef = useRef(null)
  const { onMouseMove, onMouseLeave } = useTilt(innerRef)

  const isSold = car.status === 'sold'
  const whatsappLink = isSold
    ? `https://wa.me/919876543210?text=${encodeURIComponent(
        `Hello Zara Cars! I noticed the ${car.year} ${car.name} (${car.price}) listed at No. 1, Sri Balaji Complex is marked as Sold. Please notify me if a similar certified unit becomes available.`
      )}`
    : `https://wa.me/919876543210?text=${encodeURIComponent(
        `Hello Zara Cars! I am interested in the ${car.year} ${car.name} (${car.price}) listed at No. 1, Sri Balaji Complex. Please share test drive availability and inspection details.`
      )}`

  return (
    <article
      ref={cardRef}
      className={`car-card ${isSold ? 'car-card--sold' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div ref={innerRef} className="car-card__inner">
        
        {/* Car Image Container with Click to View Details */}
        <div
          className="car-card__image-wrap"
          onClick={() => onSelectCar(car)}
          data-cursor-text="DETAILS"
        >
          <img
            src={car.image}
            alt={car.name}
            className="car-card__image"
            loading="lazy"
            decoding="async"
          />
          <div className="car-card__image-overlay" />
          
          <div className="car-card__tags-top">
            <span className="car-card__tag">{car.tag || 'Certified Pre-Owned'}</span>
            {isSold ? (
              <span className="car-card__badge" style={{ background: '#dc2626', color: '#ffffff', borderColor: '#ef4444' }}>
                SOLD
              </span>
            ) : (
              <span className="car-card__badge">{car.badge || '140-PT CERTIFIED'}</span>
            )}
          </div>

          <div className="car-card__price-badge">
            <span className="car-card__price">{car.price}</span>
            <span className="car-card__price-sub">{car.priceSub}</span>
          </div>
        </div>

        {/* Card Content Details */}
        <div className="car-card__body">
          
          <div
            className="car-card__header"
            onClick={() => onSelectCar(car)}
            data-cursor-text="DETAILS"
          >
            <h3 className="car-card__name">{car.name}</h3>
            <span className="car-card__year">{car.year}</span>
          </div>

          {/* Quick Specifications Pill Bar */}
          <div className="car-card__specs-row">
            <span className="car-card__spec-pill">{car.km}</span>
            <span className="car-card__spec-pill">{car.fuel}</span>
            <span className="car-card__spec-pill">{car.owner}</span>
          </div>

          <p className="car-card__desc">{car.desc}</p>

          {/* Action CTAs */}
          <div className="car-card__actions">
            <button
              onClick={() => onSelectCar(car)}
              className="car-card__btn-details"
              data-cursor-text="SPECS"
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>View Details</span>
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="car-card__btn-wa"
              data-cursor-text="WHATSAPP"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </article>
  )
}

export default function Collection() {
  const [vehicles, setVehicles] = useState([])
  const [filter, setFilter] = useState('all')
  const [budgetFilter, setBudgetFilter] = useState('all')
  const [selectedCar, setSelectedCar] = useState(null)

  const sectionRef  = useRef(null)
  const titleRef    = useRef(null)
  const lineRef     = useRef(null)
  const subtitleRef = useRef(null)
  const gridRef     = useRef(null)

  useEffect(() => {
    const unsubscribe = inventoryService.subscribe((list) => {
      setVehicles(list || [])
    })
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  const filteredCars = vehicles.filter(c => {
    const matchesCategory = filter === 'all' || c.category === filter
    const matchesBudget   = budgetFilter === 'all' || c.budget === budgetFilter
    return matchesCategory && matchesBudget
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal - scrubbed so it matches scroll velocity perfectly
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            end: 'top 75%',
            scrub: 0.5,
          },
        }
      )

      // Accent line expansion on scroll
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'power2.out',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            end: 'top 75%',
            scrub: 0.5,
          },
        }
      )

      // Subtitle
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            end: 'top 72%',
            scrub: 0.5,
          },
        }
      )

      // Card 3D entrance: directly scrubbed to scroll so you feel and see the cars gliding up in 3D perspective
      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children)
        
        cards.forEach((card) => {
          gsap.fromTo(card,
            {
              opacity: 0.15,
              y: 50,
              rotateX: 6,
              transformPerspective: 1000,
              scale: 0.96,
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 95%',
                end: 'top 70%',
                scrub: 0.6,
              },
            }
          )

          // Continuous parallax scrub on each car card image
          const img = card.querySelector('.car-card__image')
          if (img) {
            gsap.to(img, {
              yPercent: 14,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            })
          }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [filter, budgetFilter, vehicles.length])

  return (
    <section ref={sectionRef} className="collection" id="inventory">
      <div className="container">
        
        {/* Header */}
        <div className="collection__header">
          <div className="collection__title-wrap">
            <div className="eyebrow">
              <span className="divider-line" />
              <span>HANDPICKED INVENTORY · SRI BALAJI SHOWROOM</span>
            </div>
            <h2 ref={titleRef} className="collection__title">
              Certified Pre-Owned Fleet.
            </h2>
            <div ref={lineRef} className="collection__accent-line" />
          </div>

          <p ref={subtitleRef} className="collection__subtitle">
            Every car in our Sri Balaji showroom is multi-point verified, road-tested, and priced with 
            uncompromising value. <strong>Best price &amp; best service is our assurance.</strong>
          </p>
        </div>

        {/* Dual Filter Controls: Category + Budget */}
        <div className="collection__filter-controls">
          
          {/* Category Tabs */}
          <div className="collection__filter-row">
            <span className="collection__filter-heading">Category:</span>
            <div className="collection__filters" role="tablist">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={filter === cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`collection__filter-btn ${filter === cat.id ? 'collection__filter-btn--active' : ''}`}
                  data-cursor-text="FILTER"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Tabs */}
          <div className="collection__filter-row">
            <span className="collection__filter-heading">Budget:</span>
            <div className="collection__filters" role="tablist">
              {BUDGETS.map(b => (
                <button
                  key={b.id}
                  role="tab"
                  aria-selected={budgetFilter === b.id}
                  onClick={() => setBudgetFilter(b.id)}
                  className={`collection__budget-btn ${budgetFilter === b.id ? 'collection__budget-btn--active' : ''}`}
                  data-cursor-text="BUDGET"
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Vehicle Cards Grid or Empty State */}
        {filteredCars.length === 0 ? (
          <div className="collection__empty-state">
            <p className="collection__empty-text">No certified vehicles match both filters.</p>
            <button
              onClick={() => { setFilter('all'); setBudgetFilter('all'); }}
              className="collection__reset-btn"
            >
              Reset Filters to View All Cars
            </button>
          </div>
        ) : (
          <div ref={gridRef} className="collection__grid">
            {filteredCars.map(car => (
              <PreOwnedCard
                key={car.id}
                car={car}
                onSelectCar={setSelectedCar}
              />
            ))}
          </div>
        )}

      </div>

      {/* Dedicated Vehicle Details Modal View */}
      {selectedCar && (
        <CarDetailsModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </section>
  )
}
