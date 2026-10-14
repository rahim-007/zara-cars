import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './Preloader.css'

export default function Preloader({ onComplete }) {
  const rootRef     = useRef(null)
  const panelRef    = useRef(null)
  const logoWrapRef = useRef(null)
  const markRef     = useRef(null)
  const shimmerRef  = useRef(null)
  const tagRef      = useRef(null)
  const barRef      = useRef(null)
  const glowPinRef  = useRef(null)

  const [percent, setPercent] = useState(0)
  const [status, setStatus]   = useState('VERIFYING SHOWROOM FLEET...')

  useEffect(() => {
    const counterObj = { val: 0 }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        onComplete()
        if (rootRef.current) rootRef.current.style.display = 'none'
      },
    })

    // 1 — Logo emerges with depth, blur clearance and subtle scale
    tl.fromTo(markRef.current,
      { opacity: 0, scale: 0.9, y: 22, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' }
    )
    // 2 — Tagline tracks into view
    .fromTo(tagRef.current,
      { opacity: 0, y: 10, letterSpacing: '0.36em' },
      { opacity: 1, y: 0, letterSpacing: '0.22em', duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
    // 3 — Shimmer sweep light across the logo
    .fromTo(shimmerRef.current,
      { xPercent: -120, opacity: 0 },
      { xPercent: 120, opacity: 0.75, duration: 1.3, ease: 'power2.inOut' },
      '-=0.7'
    )
    // 4 — Progress bar fills with live percentage counter and diagnostic status
    .to(counterObj, {
      val: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        const p = Math.round(counterObj.val)
        setPercent(p)
        if (p < 35) {
          setStatus('VERIFYING SHOWROOM FLEET...')
        } else if (p < 75) {
          setStatus('140-POINT CERTIFICATION ACTIVE...')
        } else if (p < 99) {
          setStatus('AUTHENTICATING SRI BALAJI INVENTORY...')
        } else {
          setStatus('READY FOR IGNITION')
        }
      },
    }, '-=0.9')
    .fromTo(barRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.5, ease: 'power2.inOut', transformOrigin: 'left center' },
      '<'
    )
    .fromTo(glowPinRef.current,
      { left: '0%' },
      { left: '100%', duration: 1.5, ease: 'power2.inOut' },
      '<'
    )
    // 5 — Satisfying hold at 100% so the completed state and branding register
    .to({}, { duration: 0.4 })
    // 6 — Majestic cinema shutter slide-up to reveal the Hero car
    .to(panelRef.current, {
      yPercent: -100,
      duration: 0.95,
      ease: 'power4.inOut',
    })

    return () => tl.kill()
  }, [onComplete])

  return (
    <div ref={rootRef} className="preloader">
      <div ref={panelRef} className="preloader__panel">
        
        {/* Ambient champagne backlight glow */}
        <div className="preloader__glow" aria-hidden="true" />

        {/* Real Zara Cars full lockup logo with shimmer sweep */}
        <div ref={logoWrapRef} className="preloader__logo-wrap">
          <div className="preloader__logo-inner">
            <img
              ref={markRef}
              src="/zara-logo-full.png"
              alt="Zara Cars — Best Price & Best Service Is Our Assurance"
              className="preloader__logo"
              width="420"
              height="180"
            />
            {/* Shimmer sweep light */}
            <div ref={shimmerRef} className="preloader__shimmer" aria-hidden="true" />
          </div>
        </div>

        {/* Showroom Location & Founding Tagline */}
        <p ref={tagRef} className="preloader__tag">
          No. 1, Sri Balaji Complex · Kanchipuram · Est. 2023
        </p>

        {/* Progress & Live Telemetry Deck */}
        <div className="preloader__telemetry">
          <div className="preloader__telemetry-row">
            <span className="preloader__status">
              <span className="preloader__status-dot" />
              {status}
            </span>
            <span className="preloader__counter">
              {percent < 10 ? `0${percent}` : percent}%
            </span>
          </div>

          <div className="preloader__bar-track">
            <div ref={barRef} className="preloader__bar-fill" />
            <div ref={glowPinRef} className="preloader__bar-pin" />
          </div>
        </div>

      </div>
    </div>
  )
}
