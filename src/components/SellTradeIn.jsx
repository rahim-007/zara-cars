import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './SellTradeIn.css'

gsap.registerPlugin(ScrollTrigger)

const SEGMENTS = [
  { id: 'hatchback', label: 'Hatchback', baseMin: 4.5, baseMax: 6.8 },
  { id: 'sedan', label: 'Executive Sedan', baseMin: 7.0, baseMax: 11.5 },
  { id: 'suv', label: 'Compact / Full SUV', baseMin: 9.5, baseMax: 15.0 },
  { id: 'luxury', label: 'Luxury (BMW/Merc/Audi)', baseMin: 22.0, baseMax: 38.0 },
]

const YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018]

const KM_OPTIONS = [
  { id: 'under30', label: 'Under 30,000 km', multiplier: 1.08 },
  { id: '30to60', label: '30,000 – 60,000 km', multiplier: 1.0 },
  { id: '60to90', label: '60,000 – 90,000 km', multiplier: 0.92 },
  { id: 'above90', label: 'Above 90,000 km', multiplier: 0.85 },
]

export default function SellTradeIn() {
  const [selectedSegment, setSelectedSegment] = useState(SEGMENTS[2]) // default SUV
  const [selectedYear, setSelectedYear] = useState(2022)
  const [selectedKm, setSelectedKm] = useState(KM_OPTIONS[1])

  const sectionRef = useRef(null)
  const cardRef    = useRef(null)

  // Calculate dynamic valuation estimate
  const yearDelta = (selectedYear - 2018) * 0.05
  const estMin = ((selectedSegment.baseMin * (1 + yearDelta)) * selectedKm.multiplier).toFixed(2)
  const estMax = ((selectedSegment.baseMax * (1 + yearDelta)) * selectedKm.multiplier).toFixed(2)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0.2, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            end: 'top 70%',
            scrub: 0.6,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const whatsappMsg = encodeURIComponent(
    `Hello Zara Cars! I am interested in selling/exchanging my car at Sri Balaji Complex.\n` +
    `Details: Year: ${selectedYear}, Segment: ${selectedSegment.label}, KM: ${selectedKm.label}.\n` +
    `Please arrange a free inspection.`
  )

  return (
    <section ref={sectionRef} className="trade-in" id="trade-in">
      <div className="container">
        
        {/* Section Header */}
        <div className="trade-in__header">
          <div className="eyebrow">
            <span className="divider-line" />
            <span>SELL OR UPGRADE · TOP DOLLAR EVALUATION</span>
          </div>
          <h2 className="trade-in__title">
            Sell or Exchange Your Car<br />
            <span className="text-champagne">At Guaranteed Best Value</span>
          </h2>
          <p className="trade-in__subtitle">
            Looking to upgrade or cash out? Get a transparent, market-leading appraisal from Zara Cars. 
            Free doorstep valuation, spot payment, and 100% legal RTO transfer.
          </p>
        </div>

        {/* Interactive Estimator Bento Container */}
        <div ref={cardRef} className="trade-in__box">
          
          {/* Left: Interactive Valuation Controls */}
          <div className="trade-in__controls">
            
            {/* Step 1: Vehicle Segment */}
            <div className="trade-in__step">
              <label className="trade-in__label">
                <span className="trade-in__step-num">1</span>
                <span>Select Vehicle Segment</span>
              </label>
              <div className="trade-in__chip-grid">
                {SEGMENTS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSegment(s)}
                    className={`trade-in__chip ${selectedSegment.id === s.id ? 'trade-in__chip--active' : ''}`}
                    type="button"
                    data-cursor-text="SELECT"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Manufacturing Year */}
            <div className="trade-in__step">
              <label className="trade-in__label">
                <span className="trade-in__step-num">2</span>
                <span>Registration Year</span>
              </label>
              <div className="trade-in__year-scroll">
                {YEARS.map(yr => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`trade-in__year-btn ${selectedYear === yr ? 'trade-in__year-btn--active' : ''}`}
                    type="button"
                    data-cursor-text="YEAR"
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Kilometers Driven */}
            <div className="trade-in__step">
              <label className="trade-in__label">
                <span className="trade-in__step-num">3</span>
                <span>Odometer / Kilometers Driven</span>
              </label>
              <div className="trade-in__chip-grid">
                {KM_OPTIONS.map(km => (
                  <button
                    key={km.id}
                    onClick={() => setSelectedKm(km)}
                    className={`trade-in__chip ${selectedKm.id === km.id ? 'trade-in__chip--active' : ''}`}
                    type="button"
                    data-cursor-text="KM"
                  >
                    {km.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Instant Valuation Result Card */}
          <div className="trade-in__result-panel">
            <div className="trade-in__result-top">
              <span className="trade-in__result-tag">ESTIMATED VALUATION RANGE</span>
              <div className="trade-in__result-price">
                <span className="trade-in__result-currency">₹</span>
                <span className="trade-in__result-range">{estMin} – {estMax}</span>
                <span className="trade-in__result-unit">LAKHS*</span>
              </div>
              <p className="trade-in__result-note">
                *Estimated market value for {selectedYear} {selectedSegment.label} ({selectedKm.label}). 
                Final value determined after physical 140-point inspection at Sri Balaji Complex.
              </p>
            </div>

            {/* 3 Pillars of Zara Cars Sell/Exchange Guarantee */}
            <div className="trade-in__perks">
              <div className="trade-in__perk">
                <span className="trade-in__perk-dot" />
                <div>
                  <strong>Instant Payment:</strong> Bank transfer in under 30 minutes.
                </div>
              </div>
              <div className="trade-in__perk">
                <span className="trade-in__perk-dot" />
                <div>
                  <strong>Free RC Transfer:</strong> 100% legal ownership handover.
                </div>
              </div>
              <div className="trade-in__perk">
                <span className="trade-in__perk-dot" />
                <div>
                  <strong>Exchange Bonus:</strong> Up to ₹25,000 on trading in for another car.
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Call to Action */}
            <div className="trade-in__cta-wrap">
              <a
                href={`https://wa.me/919876543210?text=${whatsappMsg}`}
                target="_blank"
                rel="noreferrer"
                className="trade-in__btn-primary"
                data-cursor-text="GET VALUE"
              >
                <span>Book Free Inspection at Sri Balaji Complex</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              <a href="#showroom" className="trade-in__btn-subtle" data-cursor-text="MAP">
                Drive Down to Showroom: Kanchipuram to Chengalpattu Main Rd
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
