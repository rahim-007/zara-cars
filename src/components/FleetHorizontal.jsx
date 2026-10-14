import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FleetHorizontal.css'

gsap.registerPlugin(ScrollTrigger)

const FLEET_CARS = [
  {
    id: '01',
    name: 'BMW 3 Series 330i M-Sport',
    tag: 'LUXURY PRE-OWNED',
    tagline: 'German Engineering · Single Owner',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=85&fit=crop',
    specs: [
      { label: 'POWER', val: '258 BHP' },
      { label: 'ODOMETER', val: '34,200 KM' },
      { label: 'PRICE', val: '₹ 38.50 L' },
      { label: 'GEARBOX', val: '8-Spd Steptronic' },
    ],
    colors: [
      { name: 'Portimao Blue', hex: '#1b3b6f', glow: 'rgba(27, 59, 111, 0.5)' },
      { name: 'Mineral White', hex: '#f0f2f5', glow: 'rgba(240, 242, 245, 0.4)' },
      { name: 'Black Sapphire', hex: '#111215', glow: 'rgba(200, 169, 106, 0.4)' },
      { name: 'Champagne Gold', hex: '#c8a96a', glow: 'rgba(200, 169, 106, 0.6)' },
    ],
  },
  {
    id: '02',
    name: 'Mahindra Thar LX 4x4',
    tag: 'CERTIFIED ADVENTURE 4X4',
    tagline: 'Iconic 4WD Hard Top · Company Maintained',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&q=85&fit=crop',
    specs: [
      { label: 'ENGINE', val: '2.2L mHawk' },
      { label: 'ODOMETER', val: '18,900 KM' },
      { label: 'PRICE', val: '₹ 14.20 L' },
      { label: 'DRIVE', val: 'Shift-on-Fly 4WD' },
    ],
    colors: [
      { name: 'Napoli Black', hex: '#141416', glow: 'rgba(200, 169, 106, 0.4)' },
      { name: 'Red Rage', hex: '#8b1e1e', glow: 'rgba(139, 30, 30, 0.5)' },
      { name: 'Rocky Beige', hex: '#6b6357', glow: 'rgba(107, 99, 87, 0.4)' },
      { name: 'Aquamarine', hex: '#2e5b66', glow: 'rgba(46, 91, 102, 0.4)' },
    ],
  },
  {
    id: '03',
    name: 'Hyundai Creta SX(O) Turbo',
    tag: 'EXECUTIVE COMPACT SUV',
    tagline: 'Panoramic Sunroof · Bose Premium Audio',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1600&q=85&fit=crop',
    specs: [
      { label: 'POWER', val: '140 BHP' },
      { label: 'ODOMETER', val: '28,400 KM' },
      { label: 'PRICE', val: '₹ 14.85 L' },
      { label: 'TRANSMISSION', val: '7-Speed DCT' },
    ],
    colors: [
      { name: 'Phantom Black', hex: '#0f1115', glow: 'rgba(200, 169, 106, 0.4)' },
      { name: 'Polar White', hex: '#e8edf2', glow: 'rgba(232, 237, 242, 0.4)' },
      { name: 'Titan Grey', hex: '#4a4e54', glow: 'rgba(74, 78, 84, 0.4)' },
      { name: 'Champagne Glow', hex: '#c8a96a', glow: 'rgba(200, 169, 106, 0.5)' },
    ],
  },
  {
    id: '04',
    name: 'Mercedes-Benz C-Class C200',
    tag: 'LUXURY PRE-OWNED SALOON',
    tagline: 'Burmester 3D · Immaculate Condition',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=85&fit=crop',
    specs: [
      { label: 'ENGINE', val: '1.5L Mild-Hybrid' },
      { label: 'ODOMETER', val: '39,500 KM' },
      { label: 'PRICE', val: '₹ 36.25 L' },
      { label: 'GEARBOX', val: '9G-Tronic Auto' },
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0a0b0e', glow: 'rgba(200, 169, 106, 0.4)' },
      { name: 'Iridium Silver', hex: '#8f9499', glow: 'rgba(143, 148, 153, 0.4)' },
      { name: 'Cavansite Blue', hex: '#162847', glow: 'rgba(22, 40, 71, 0.5)' },
      { name: 'Champagne Gold', hex: '#c8a96a', glow: 'rgba(200, 169, 106, 0.6)' },
    ],
  },
]

export default function FleetHorizontal() {
  const wrapperRef = useRef(null)
  const trackRef   = useRef(null)
  const [selectedColor, setSelectedColor] = useState({
    '01': FLEET_CARS[0].colors[3],
    '02': FLEET_CARS[1].colors[0],
    '03': FLEET_CARS[2].colors[0],
    '04': FLEET_CARS[3].colors[0],
  })

  const handleColorChange = (carId, color) => {
    setSelectedColor(prev => ({ ...prev, [carId]: color }))
  }

  useEffect(() => {
    if (!wrapperRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const getDistance = () => trackRef.current.scrollWidth - window.innerWidth

      gsap.to(trackRef.current, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      // Parallax effect on the giant background numbers
      gsap.utils.toArray('.fleet-slide__bg-num').forEach(num => {
        gsap.to(num, {
          xPercent: 35,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: 1.2,
          },
        })
      })

    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={wrapperRef} className="fleet-horizontal" id="fleet">
      <div ref={trackRef} className="fleet-horizontal__track">
        
        {/* Intro Billboard Slide */}
        <div className="fleet-slide fleet-slide--intro">
          <div className="fleet-intro__content">
            <span className="eyebrow">
              <span className="divider-line" />
              THE ZARA SHOWROOM RUNWAY
            </span>
            <h2 className="fleet-intro__title">
              Curated<br />
              <span className="text-champagne">Dominance.</span>
            </h2>
            <p className="fleet-intro__desc">
              From executive German saloons to rugged 4x4 off-roaders and family SUVs.
              Every vehicle inspected, authenticated, and delivered to Sri Balaji Complex showroom standards.
            </p>
            <div className="fleet-intro__indicator">
              <span>Scroll Runway Horizontally</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4 Supercar Slides */}
        {FLEET_CARS.map(car => {
          const activeGlow = selectedColor[car.id]?.glow || 'rgba(200, 169, 106, 0.4)'

          return (
            <div key={car.id} className="fleet-slide fleet-slide--car">
              {/* Giant Background Parallax Number */}
              <div className="fleet-slide__bg-num" aria-hidden="true">
                {car.id}
              </div>

              <div
                className="fleet-card"
                style={{
                  boxShadow: `0 24px 60px -20px ${activeGlow}`,
                }}
              >
                {/* Vehicle Image Stage */}
                <div className="fleet-card__media" data-cursor-text="DRIVE">
                  <img src={car.image} alt={car.name} className="fleet-card__img" />
                  <div className="fleet-card__overlay" />
                  <span className="fleet-card__tag">{car.tag}</span>
                </div>

                {/* Vehicle Details */}
                <div className="fleet-card__body">
                  <div className="fleet-card__header">
                    <div>
                      <span className="fleet-card__tagline">{car.tagline}</span>
                      <h3 className="fleet-card__name">{car.name}</h3>
                    </div>

                    {/* Colorway Switcher */}
                    <div className="fleet-card__colors">
                      <span className="fleet-card__colors-label">Finish:</span>
                      <div className="fleet-card__swatches">
                        {car.colors.map(col => (
                          <button
                            key={col.name}
                            onClick={() => handleColorChange(car.id, col)}
                            className={`fleet-card__swatch ${selectedColor[car.id]?.name === col.name ? 'fleet-card__swatch--active' : ''}`}
                            style={{ backgroundColor: col.hex }}
                            title={col.name}
                            aria-label={`Select ${col.name} color`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="fleet-card__specs">
                    {car.specs.map(sp => (
                      <div key={sp.label} className="fleet-card__spec">
                        <span className="fleet-card__spec-val">{sp.val}</span>
                        <span className="fleet-card__spec-label">{sp.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="fleet-card__actions">
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(
                        `Hello Zara Cars! I am interested in reserving a viewing for the ${car.name} (${car.specs[2].val}) at Sri Balaji Complex.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="fleet-card__cta"
                      data-cursor-text="WHATSAPP"
                    >
                      <span>Reserve Viewing at Sri Balaji</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          )
        })}

      </div>
    </section>
  )
}
