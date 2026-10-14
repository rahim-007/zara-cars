import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const CAR_IMAGE = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1920&q=85&fit=crop&crop=center'

function splitToChars(str, baseClass = 'hero__char') {
  return str.split('').map((ch, i) => (
    <span key={i} className={`${baseClass}${ch === ' ' ? ` ${baseClass}--space` : ''}`} aria-hidden="true">
      {ch === ' ' ? '\u00A0' : ch}
    </span>
  ))
}

export default function Hero() {
  const sectionRef      = useRef(null)
  const pinWrapRef      = useRef(null)
  const carWrapRef      = useRef(null)
  const carImgRef       = useRef(null)
  const beamLeftRef     = useRef(null)
  const beamRightRef    = useRef(null)
  const lensFlareRef    = useRef(null)
  const headlineRef     = useRef(null)
  const eyebrowRef      = useRef(null)
  const subRef          = useRef(null)
  const actionsRef      = useRef(null)
  const telemetryHudRef = useRef(null)
  const speedLinesRef   = useRef(null)

  const [ignited, setIgnited] = useState(false)
  const ignitedRef = useRef(false)

  // Toggle Headlight Ignition manually
  const toggleIgnition = () => {
    setIgnited(prev => {
      const next = !prev
      ignitedRef.current = next
      if (next) {
        gsap.to([beamLeftRef.current, beamRightRef.current], { opacity: 0.9, duration: 0.4, ease: 'power2.out' })
        gsap.to(lensFlareRef.current, { opacity: 0.85, duration: 0.4, ease: 'power2.out' })
      } else {
        gsap.to([beamLeftRef.current, beamRightRef.current], { opacity: 0, duration: 0.3 })
        gsap.to(lensFlareRef.current, { opacity: 0, duration: 0.3 })
      }
      return next
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Cinematic Intro Timeline
      const introTl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } })

      introTl
        .fromTo(carWrapRef.current,
          { scale: 1.12, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' }
        )
        .fromTo(eyebrowRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55 },
          '-=0.8'
        )
        .fromTo(headlineRef.current?.querySelectorAll('.hero__char') || [],
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, stagger: 0.025, duration: 0.75, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(subRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.35'
        )
        .fromTo(actionsRef.current?.children || [],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 },
          '-=0.25'
        )
        .fromTo(telemetryHudRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.55 },
          '-=0.3'
        )

      // 2. High-Tier Pinned Camera Surge & Acceleration
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapRef.current,
          start: 'top top',
          end: '+=110%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress > 0.08 && !ignitedRef.current) {
              ignitedRef.current = true
              setIgnited(true)
            }
          }
        }
      })

      scrollTl
        // Car surges towards camera
        .to(carImgRef.current, {
          scale: 1.36,
          yPercent: 12,
          ease: 'power1.inOut',
        }, 0)
        // Dual laser beams flare open
        .to([beamLeftRef.current, beamRightRef.current], {
          opacity: 1,
          scaleY: 1.35,
          ease: 'power2.in',
        }, 0.06)
        .to(lensFlareRef.current, {
          opacity: 0.85,
          scale: 1.45,
          ease: 'power2.in',
        }, 0.1)
        // Speed lines streak past
        .to(speedLinesRef.current, {
          opacity: 0.7,
          scaleY: 1.4,
          ease: 'power1.in',
        }, 0.08)
        // 3D Typography split
        .to('.hero__word--0', {
          xPercent: -45,
          opacity: 0,
          rotateY: -15,
          ease: 'power2.in',
        }, 0)
        .to('.hero__word--2', {
          xPercent: 55,
          opacity: 0,
          rotateY: 15,
          ease: 'power2.in',
        }, 0)
        .to('.hero__word--1', {
          scale: 1.45,
          opacity: 0,
          filter: 'blur(8px)',
          ease: 'power2.in',
        }, 0.08)
        .to([subRef.current, actionsRef.current, telemetryHudRef.current, eyebrowRef.current], {
          opacity: 0,
          y: -35,
          ease: 'power2.in',
        }, 0)

    }, pinWrapRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pinWrapRef} className="hero-pin-wrapper">
      <section ref={sectionRef} className={`hero ${ignited ? 'hero--ignited' : ''}`} id="hero">
        
        {/* Dynamic Background Car Stage */}
        <div ref={carWrapRef} className="hero__stage" aria-hidden="true">
          <img
            ref={carImgRef}
            src={CAR_IMAGE}
            alt="Zara Cars Certified Pre-Owned Vehicle"
            className="hero__car-img"
            fetchPriority="high"
          />
          <div className="hero__vignette" />
          
          {/* Dual LED Headlight Laser Beams */}
          <div
            ref={beamLeftRef}
            className={`hero__beam hero__beam--left ${ignited ? 'hero__beam--active' : ''}`}
          />
          <div
            ref={beamRightRef}
            className={`hero__beam hero__beam--right ${ignited ? 'hero__beam--active' : ''}`}
          />
          {/* Central Anamorphic Lens Flare */}
          <div
            ref={lensFlareRef}
            className={`hero__lens-flare ${ignited ? 'hero__lens-flare--active' : ''}`}
          />

          {/* Speed Streaks on scroll */}
          <div ref={speedLinesRef} className="hero__speed-lines" />
        </div>

        {/* Ambient Noise Film Grain */}
        <div className="hero__noise" aria-hidden="true" />

        {/* Floating Telemetry HUD — Tailored strictly to Certified Pre-Owned */}
        <div ref={telemetryHudRef} className="hero__hud" aria-hidden="true">
          <div className="hero__hud-panel">
            <div className="hero__hud-header">
              <span className="hero__hud-pulse" />
              <span className="hero__hud-tag">SRI BALAJI SHOWROOM · KANCHIPURAM</span>
            </div>
            <div className="hero__hud-grid">
              <div className="hero__hud-stat">
                <span className="hero__hud-val">140-PT</span>
                <span className="hero__hud-unit">INSPECTED</span>
              </div>
              <div className="hero__hud-stat">
                <span className="hero__hud-val">100%</span>
                <span className="hero__hud-unit">TITLE CLEAR</span>
              </div>
              <div className="hero__hud-stat">
                <span className="hero__hud-val">EST. 2023</span>
                <span className="hero__hud-unit">BEST PRICE ASSURED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="hero__content container">
          
          <div ref={eyebrowRef} className="eyebrow hero__eyebrow">
            <span className="divider-line" />
            <span>Zara Cars · Certified Pre-Owned Automobiles · Est. 2023</span>
          </div>

          <h1 ref={headlineRef} className="hero__headline" aria-label="Drive With Assurance.">
            <span className="hero__word hero__word--0">
              <span className="hero__word-inner">{splitToChars('Drive')}</span>
            </span>
            <span className="hero__word hero__word--1">
              <span className="hero__word-inner">{splitToChars('With')}</span>
            </span>
            <span className="hero__word hero__word--2">
              <span className="hero__word-inner">{splitToChars('Assurance.')}</span>
            </span>
          </h1>

          <p ref={subRef} className="hero__sub">
            No. 1, Sri Balaji Complex, Kanchipuram to Chengalpattu Main Road. 
            Discover meticulously tested, multi-brand certified pre-owned cars. 
            <strong> Best price &amp; best service is our assurance.</strong>
          </p>

          <div ref={actionsRef} className="hero__actions">
            {/* Interactive Ignition Switch */}
            <button
              onClick={toggleIgnition}
              className={`hero__ignition-btn ${ignited ? 'hero__ignition-btn--active' : ''}`}
              data-cursor-text={ignited ? 'IGNITED' : 'IGNITE'}
              aria-label="Toggle vehicle headlights"
            >
              <span className="hero__ignition-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </span>
              <span>{ignited ? 'Headlights Active' : 'Start Ignition'}</span>
            </button>

            <a href="#inventory" className="hero__btn-primary" data-cursor-text="CARS">
              <span>Explore Cars</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            <a href="#showroom" className="hero__btn-ghost" data-cursor-text="VISIT">
              Showroom Location
            </a>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="hero__scroll-indicator" aria-hidden="true">
          <div className="hero__scroll-mouse">
            <div className="hero__scroll-wheel" />
          </div>
          <span>Scroll to Accelerate</span>
        </div>

      </section>
    </div>
  )
}
