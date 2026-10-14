import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './CarTelemetry.css'

gsap.registerPlugin(ScrollTrigger)

const STAGES = [
  {
    id: 'diagnostics',
    title: '140-POINT DIAGNOSTIC SCAN',
    subtitle: 'Powertrain, Transmission & Engine Health',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1600&q=85&fit=crop',
    stats: [
      { label: 'POINTS CHECKED', val: '140', unit: 'CRITERIA' },
      { label: 'ENGINE HEALTH', val: '100', unit: '% CERTIFIED' },
      { label: 'ECU SCAN', val: 'OBD-II', unit: 'ZERO ERROR' },
    ],
    hotspots: [
      { top: '44%', left: '48%', label: 'Cylinder Compression & Turbo', desc: 'Computerized compression check, zero oil or coolant leak guarantee' },
      { top: '65%', left: '52%', label: 'Transmission & Gear Shift', desc: 'Smooth torque converter & clutch engagement tested on road and dyno' },
    ],
  },
  {
    id: 'chassis',
    title: 'CHASSIS & ACCIDENT-FREE GUARANTEE',
    subtitle: 'Structural Aprons, Pillars & Flood-Free Title',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1600&q=85&fit=crop',
    stats: [
      { label: 'ACCIDENT DAMAGE', val: '0', unit: '% ZERO ACCIDENT' },
      { label: 'FLOOD INTEGRITY', val: '100', unit: '% WATERLINE FREE' },
      { label: 'FRAME ALIGNMENT', val: 'OEM', unit: 'FACTORY SPEC' },
    ],
    hotspots: [
      { top: '48%', left: '38%', label: 'Factory Pillar Welds', desc: 'Original OEM spot welds verified, zero frame pull or chassis tampering' },
      { top: '62%', left: '58%', label: 'Suspension Struts & Bushings', desc: 'Laser 4-wheel alignment, ball joints and steering rack tested' },
    ],
  },
  {
    id: 'title',
    title: 'CABIN COMFORT & 100% CLEAR TITLE',
    subtitle: 'Deep Detailing, Sub-Zero AC & Free RC Transfer',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=85&fit=crop',
    stats: [
      { label: 'RTO TRANSFER', val: 'FREE', unit: 'GUARANTEED' },
      { label: 'TITLE CLEARANCE', val: '100', unit: '% NO HYPOTHECATION' },
      { label: 'SHOWROOM TRUST', val: 'EST. 2023', unit: 'SRI BALAJI' },
    ],
    hotspots: [
      { top: '42%', left: '52%', label: 'Touchscreen ECU & Chiller AC', desc: 'Sub-zero climate control AC test and electronic sensor diagnostics' },
      { top: '60%', left: '30%', label: 'Complete Interior Detailing', desc: 'Ozone sanitization, stain extraction, and leather conditioning' },
    ],
  },
]

export default function CarTelemetry() {
  const containerRef = useRef(null)
  const pinRef       = useRef(null)
  const [activeStage, setActiveStage] = useState(0)
  const [activeHotspot, setActiveHotspot] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray('.telemetry__slide')

      // Set initial states
      gsap.set(slides.slice(1), { opacity: 0, scale: 0.95, yPercent: 10 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(2, Math.floor(self.progress * 3))
            setActiveStage(index)
          },
        },
      })

      // Slide 0 -> Slide 1
      tl.to(slides[0], { opacity: 0, scale: 1.08, yPercent: -8, ease: 'power2.inOut', duration: 1 }, 0.5)
        .to(slides[1], { opacity: 1, scale: 1, yPercent: 0, ease: 'power2.inOut', duration: 1 }, 0.5)
        // Slide 1 -> Slide 2
        .to(slides[1], { opacity: 0, scale: 1.08, yPercent: -8, ease: 'power2.inOut', duration: 1 }, 1.8)
        .to(slides[2], { opacity: 1, scale: 1, yPercent: 0, ease: 'power2.inOut', duration: 1 }, 1.8)

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="telemetry-wrapper" id="telemetry">
      <section ref={pinRef} className="telemetry">
        
        {/* Background Visual Slides */}
        <div className="telemetry__viewport" aria-hidden="true">
          {STAGES.map((stg, i) => (
            <div key={stg.id} className={`telemetry__slide telemetry__slide--${i}`}>
              <img src={stg.image} alt={stg.title} className="telemetry__slide-img" />
              <div className="telemetry__slide-overlay" />
              
              {/* Interactive Hotspots */}
              <div className="telemetry__hotspots">
                {stg.hotspots.map((spot, hi) => (
                  <div
                    key={hi}
                    className="telemetry__hotspot"
                    style={{ top: spot.top, left: spot.left }}
                    onMouseEnter={() => setActiveHotspot(spot)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    data-cursor-text="INSPECT"
                  >
                    <div className="telemetry__hotspot-ping" />
                    <div className="telemetry__hotspot-dot" />
                    <div className="telemetry__hotspot-popover">
                      <span className="telemetry__hotspot-title">{spot.label}</span>
                      <p className="telemetry__hotspot-desc">{spot.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Top Navigation Header */}
        <div className="telemetry__header container">
          <div className="telemetry__brand-tag">
            <span className="divider-line" />
            <span>ZARA CARS CERTIFICATION · SRI BALAJI SHOWROOM</span>
          </div>
          
          <div className="telemetry__trackers">
            {STAGES.map((stg, i) => (
              <div
                key={stg.id}
                className={`telemetry__tracker ${activeStage === i ? 'telemetry__tracker--active' : ''}`}
              >
                <div className="telemetry__tracker-bar">
                  <div className="telemetry__tracker-fill" />
                </div>
                <span className="telemetry__tracker-label">
                  0{i + 1} {stg.id.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Telemetry Data Deck — Bottom */}
        <div className="telemetry__deck container">
          <div className="telemetry__deck-inner">
            
            <div className="telemetry__stage-info">
              <span className="telemetry__stage-badge">
                PHASE 0{activeStage + 1} OF 03
              </span>
              <h2 className="telemetry__stage-title">
                {STAGES[activeStage].title}
              </h2>
              <p className="telemetry__stage-sub">
                {STAGES[activeStage].subtitle}
              </p>
            </div>

            {/* Dynamic Telemetry Stats Grid */}
            <div className="telemetry__stats-grid">
              {STAGES[activeStage].stats.map((stat, i) => (
                <div key={i} className="telemetry__stat-card">
                  <span className="telemetry__stat-val">{stat.val}</span>
                  <span className="telemetry__stat-unit">{stat.unit}</span>
                  <span className="telemetry__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

          </div>

          <div className="telemetry__scroll-hint">
            <span>Scroll to Advance Inspection</span>
            <div className="telemetry__scroll-line" />
          </div>
        </div>

      </section>
    </div>
  )
}
