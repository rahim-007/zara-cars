import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './QualityAssurance.css'

gsap.registerPlugin(ScrollTrigger)

const INSPECTION_IMAGE = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&q=80&fit=crop'

const PILLARS = [
  {
    id: 'engine',
    title: 'Engine & Powertrain Diagnostics',
    tag: '42 CHECKS',
    desc: 'Complete technical assessment of internal combustion health, transmission smoothness, and fluid integrity.',
    points: [
      'Compression & cylinder pressure testing',
      'Transmission gear shifting & clutch / torque converter check',
      'Zero oil, coolant, or transmission fluid leakage',
      'Exhaust manifold, turbocharger & OBD-II ECU scanner scan',
    ],
  },
  {
    id: 'chassis',
    title: 'Chassis & Non-Accidental Guarantee',
    tag: '36 CHECKS',
    desc: 'Uncompromising verification that the car has never suffered structural collision or water submersion.',
    points: [
      '100% Non-Accidental guarantee on aprons, pillars & underbody',
      'Flood-free certified — zero waterline rust or harness corrosion',
      'Suspension struts, bushings, ball joints & steering rack test',
      'Brake disc & pad thickness certified minimum 70% life remaining',
    ],
  },
  {
    id: 'cabin',
    title: 'Electricals, Air Conditioning & Cabin',
    tag: '38 CHECKS',
    desc: 'Ensuring every comfort and safety feature operates like it did the day it rolled out of the factory.',
    points: [
      'Sub-zero climate control AC chiller load test',
      'Airbag sensor checks, ABS module & electronic stability control',
      'Infotainment touchscreen, 360° camera & parking sensor test',
      'Full interior deep sanitization & paint protective polish',
    ],
  },
  {
    id: 'legal',
    title: '100% Verified Title & Free RC Transfer',
    tag: '24 CHECKS',
    desc: 'Complete peace of mind with legal documentation handled end-to-end by our in-house team at Sri Balaji Complex.',
    points: [
      'Original RC, verified chassis & engine number stamping',
      'Zero outstanding bank hypothecation & prompt bank NOC',
      'No pending traffic e-challans or blacklisting on Vahan portal',
      'Free RTO Name Transfer guarantee to the buyer',
    ],
  },
]

export default function QualityAssurance() {
  const [activeTab, setActiveTab] = useState(0)
  const sectionRef   = useRef(null)
  const contentRef   = useRef(null)
  const imgCardRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Graceful scrubbed entrance as user scrolls into the section
      gsap.fromTo(imgCardRef.current,
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

      gsap.fromTo(contentRef.current.children,
        { opacity: 0.2, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            end: 'top 70%',
            scrub: 0.6,
          },
        }
      )

      // Parallax on workshop visual that directly matches scroll velocity
      const img = imgCardRef.current?.querySelector('.qa__visual-img')
      if (img) {
        gsap.to(img, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="qa" id="assurance">
      <div className="container">
        
        {/* Section Header */}
        <div className="qa__header">
          <div className="eyebrow">
            <span className="divider-line" />
            <span>140-POINT CERTIFICATION · ZERO COMPROMISE</span>
          </div>
          <h2 className="qa__title">
            Meticulously Inspected.<br />
            <span className="text-champagne">100% Peace of Mind.</span>
          </h2>
          <p className="qa__subtitle">
            At Zara Cars, we don't just sell secondhand cars — we certify them. Every vehicle at our 
            Sri Balaji Complex showroom passes an exhaustive 140-point technical, structural, and legal evaluation.
          </p>
        </div>

        {/* Interactive Inspection Grid */}
        <div className="qa__grid">
          
          {/* Left: Interactive Tabs */}
          <div ref={contentRef} className="qa__pillars">
            <div className="qa__tabs" role="tablist">
              {PILLARS.map((p, i) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={activeTab === i}
                  onClick={() => setActiveTab(i)}
                  className={`qa__tab ${activeTab === i ? 'qa__tab--active' : ''}`}
                  data-cursor-text="INSPECT"
                >
                  <div className="qa__tab-top">
                    <span className="qa__tab-num">0{i + 1}</span>
                    <span className="qa__tab-tag">{p.tag}</span>
                  </div>
                  <h3 className="qa__tab-title">{p.title}</h3>
                </button>
              ))}
            </div>

            {/* Active Pillar Details Card */}
            <div className="qa__panel">
              <div className="qa__panel-header">
                <span className="qa__panel-index">CHECKPOINT GROUP 0{activeTab + 1}</span>
                <h4 className="qa__panel-title">{PILLARS[activeTab].title}</h4>
                <p className="qa__panel-desc">{PILLARS[activeTab].desc}</p>
              </div>

              <ul className="qa__points">
                {PILLARS[activeTab].points.map((pt, idx) => (
                  <li key={idx} className="qa__point">
                    <span className="qa__point-check">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="qa__point-text">{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="qa__panel-footer">
                <div className="qa__seal-badge">
                  <span className="qa__seal-dot" />
                  <span>Zara Cars Certified Standard</span>
                </div>
                <a
                  href={`https://wa.me/919876543210?text=Hello%20Zara%20Cars,%20I%20would%20like%20to%20view%20the%20140-point%20inspection%20report%20for%20available%20cars.`}
                  target="_blank"
                  rel="noreferrer"
                  className="qa__panel-btn"
                  data-cursor-text="INQUIRE"
                >
                  Ask For Inspection Report
                </a>
              </div>
            </div>

          </div>

          {/* Right: Workshop Visual Card */}
          <div ref={imgCardRef} className="qa__visual">
            <div className="qa__visual-frame">
              <img
                src={INSPECTION_IMAGE}
                alt="Zara Cars 140-Point Inspection Bay"
                className="qa__visual-img"
                loading="lazy"
              />
              <div className="qa__visual-overlay" />

              {/* Floating Live Inspection Badge */}
              <div className="qa__badge qa__badge--top">
                <div className="qa__badge-pulse" />
                <div>
                  <span className="qa__badge-title">140 / 140 POINTS CLEARED</span>
                  <span className="qa__badge-sub">Ready for Delivery at Sri Balaji Complex</span>
                </div>
              </div>

              {/* Trust Features Strip */}
              <div className="qa__badges-bottom">
                <div className="qa__mini-stat">
                  <span className="qa__mini-val">100%</span>
                  <span className="qa__mini-lbl">Non-Accidental</span>
                </div>
                <div className="qa__mini-divider" />
                <div className="qa__mini-stat">
                  <span className="qa__mini-val">0 ₹</span>
                  <span className="qa__mini-lbl">RC Transfer Fee</span>
                </div>
                <div className="qa__mini-divider" />
                <div className="qa__mini-stat">
                  <span className="qa__mini-val">1 Yr</span>
                  <span className="qa__mini-lbl">Engine Warranty</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
