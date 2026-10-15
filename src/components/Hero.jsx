import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 240
const FRAME_BASE_PATH = '/hero-frames'

function getFrameSrc(index) {
  const frameNum = String(index + 1).padStart(4, '0')
  return `${FRAME_BASE_PATH}/frame-${frameNum}.jpg`
}

const WHATSAPP_ENQUIRY_URL = `https://wa.me/919876543210?text=${encodeURIComponent(
  'Hello Zara Cars! I am interested in exploring your certified luxury collection. Please share showroom consultation details.'
)}`

export default function Hero() {
  const pinWrapRef = useRef(null)
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const canvasWrapRef = useRef(null)

  // Text Elements
  const heroContentRef = useRef(null)
  const eyebrowRef = useRef(null)
  const headlineRef = useRef(null)
  const subtextRef = useRef(null)
  const actionsRef = useRef(null)
  const scrollIndicatorRef = useRef(null)
  const watermarkRef = useRef(null)

  // Revealed Outro Stage Elements
  const outroContentRef = useRef(null)
  const telemetryHudRef = useRef(null)

  // Frame sequence storage
  const imagesRef = useRef([])
  const loadedIndicesRef = useRef(new Set())
  const lastDrawnIndexRef = useRef(-1)

  // Draw a specific image to the canvas with high-DPI and aspect-ratio preservation ('cover')
  const drawImageToCanvas = useCallback((img) => {
    const canvas = canvasRef.current
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const targetW = Math.round(rect.width * dpr)
    const targetH = Math.round(rect.height * dpr)

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
    }

    const imgW = img.naturalWidth || 1280
    const imgH = img.naturalHeight || 720
    const imgRatio = imgW / imgH
    const canvasRatio = targetW / targetH

    let renderW, renderH, offsetX, offsetY

    if (canvasRatio > imgRatio) {
      renderW = targetW
      renderH = targetW / imgRatio
      offsetX = 0
      offsetY = (targetH - renderH) / 2
    } else {
      renderH = targetH
      renderW = targetH * imgRatio
      offsetX = (targetW - renderW) / 2
      offsetY = 0
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH)
  }, [])

  // Find the closest loaded frame to targetIndex
  const getNearestLoadedImage = useCallback((targetIndex) => {
    const images = imagesRef.current
    if (images[targetIndex] && images[targetIndex].complete && images[targetIndex].naturalWidth > 0) {
      return images[targetIndex]
    }

    let minDiff = Infinity
    let bestImg = null

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = images[i]
      if (img && img.complete && img.naturalWidth > 0) {
        const diff = Math.abs(i - targetIndex)
        if (diff < minDiff) {
          minDiff = diff
          bestImg = img
        }
      }
    }
    return bestImg
  }, [])

  const renderFrame = useCallback((frameIndex) => {
    if (frameIndex === lastDrawnIndexRef.current) return
    const img = getNearestLoadedImage(frameIndex)
    if (img) {
      drawImageToCanvas(img)
      lastDrawnIndexRef.current = frameIndex
    }
  }, [drawImageToCanvas, getNearestLoadedImage])

  // Preload frame sequences: Frame 0 immediately, keyframes next, then sequential
  useEffect(() => {
    let isCancelled = false
    const images = new Array(TOTAL_FRAMES)
    imagesRef.current = images

    // 1. Immediately load frame 0
    const firstImg = new Image()
    firstImg.src = getFrameSrc(0)
    firstImg.onload = () => {
      if (isCancelled) return
      images[0] = firstImg
      loadedIndicesRef.current.add(0)
      drawImageToCanvas(firstImg)
      lastDrawnIndexRef.current = 0
    }
    images[0] = firstImg

    // 2. Also load the final frame (frame 239) for end-state fallback
    const lastImg = new Image()
    lastImg.src = getFrameSrc(TOTAL_FRAMES - 1)
    lastImg.onload = () => {
      if (isCancelled) return
      images[TOTAL_FRAMES - 1] = lastImg
      loadedIndicesRef.current.add(TOTAL_FRAMES - 1)
    }
    images[TOTAL_FRAMES - 1] = lastImg

    // 3. Staggered priority loading: load every 4th frame first
    const keyframeIndices = []
    for (let i = 4; i < TOTAL_FRAMES - 1; i += 4) {
      keyframeIndices.push(i)
    }

    const loadSingle = (idx) => {
      if (images[idx]) return Promise.resolve()
      return new Promise((resolve) => {
        const img = new Image()
        img.src = getFrameSrc(idx)
        img.onload = () => {
          if (!isCancelled) {
            images[idx] = img
            loadedIndicesRef.current.add(idx)
          }
          resolve()
        }
        img.onerror = () => {
          resolve()
        }
      })
    }

    const loadQueue = async () => {
      // Step A: load keyframes with concurrency limit of 6
      const concurrency = 6
      for (let i = 0; i < keyframeIndices.length; i += concurrency) {
        if (isCancelled) return
        const batch = keyframeIndices.slice(i, i + concurrency)
        await Promise.all(batch.map(loadSingle))
      }

      // Step B: load all remaining frames
      const remaining = []
      for (let i = 1; i < TOTAL_FRAMES - 1; i++) {
        if (!images[i]) remaining.push(i)
      }

      for (let i = 0; i < remaining.length; i += concurrency) {
        if (isCancelled) return
        const batch = remaining.slice(i, i + concurrency)
        await Promise.all(batch.map(loadSingle))
      }
    }

    loadQueue()

    return () => {
      isCancelled = true
    }
  }, [drawImageToCanvas])

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const idx = lastDrawnIndexRef.current >= 0 ? lastDrawnIndexRef.current : 0
      const img = getNearestLoadedImage(idx)
      if (img) drawImageToCanvas(img)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawImageToCanvas, getNearestLoadedImage])

  // GSAP ScrollTrigger Animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      // Reduced motion: show frame 239 directly with no scroll pinning
      const finalImg = new Image()
      finalImg.src = getFrameSrc(TOTAL_FRAMES - 1)
      finalImg.onload = () => drawImageToCanvas(finalImg)
      return
    }

    const pinWrap = pinWrapRef.current
    if (!pinWrap) return

    const ctx = gsap.context(() => {
      // 1. Initial Hero Entrance Animation on page load
      const entranceTl = gsap.timeline({
        delay: 0.2,
        defaults: { ease: 'power3.out' },
      })

      entranceTl
        .fromTo(
          canvasWrapRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
        )
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.7'
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.45'
        )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          actionsRef.current?.children || [],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.2'
        )
        .fromTo(
          telemetryHudRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.6 },
          '-=0.4'
        )

      // 2. Master Scroll-Driven Cinematic Sequence
      const isMobile = window.innerWidth < 768
      const scrollDistance = isMobile ? '+=230%' : '+=300%'

      const frameTracker = { frame: 0 }

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrap,
          start: 'top top',
          end: scrollDistance,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress
            const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES))
            renderFrame(targetFrame)
          },
        },
      })

      // A. Frame Scrub + Camera Zoom & Vertical Elevation
      scrollTl
        .to(frameTracker, {
          frame: TOTAL_FRAMES - 1,
          ease: 'none',
          duration: 1,
        }, 0)
        .to(
          canvasWrapRef.current,
          {
            scale: isMobile ? 1.08 : 1.15,
            yPercent: 4,
            ease: 'power1.inOut',
            duration: 1,
          },
          0
        )

      // B. Initial Hero Text Transition: soft fade out as veil begins to pull back
      scrollTl.to(
        [eyebrowRef.current, headlineRef.current, subtextRef.current, actionsRef.current],
        {
          opacity: 0,
          y: -40,
          ease: 'power2.in',
          duration: 0.26,
        },
        0.05
      )

      scrollTl.to(
        scrollIndicatorRef.current,
        {
          opacity: 0,
          duration: 0.15,
          ease: 'power1.in',
        },
        0.04
      )

      scrollTl.to(
        watermarkRef.current,
        {
          opacity: 0.14,
          scale: 1.1,
          duration: 0.5,
          ease: 'power1.inOut',
        },
        0.15
      )

      // C. Outro Stage Reveal (When car is fully unveiled & headlights blaze)
      if (outroContentRef.current) {
        scrollTl
          .fromTo(
            outroContentRef.current,
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' },
            0.76
          )
          .to(
            outroContentRef.current,
            { opacity: 0.95, duration: 0.15 },
            0.85
          )
      }
    }, pinWrap)

    return () => ctx.revert()
  }, [renderFrame, drawImageToCanvas])

  return (
    <div ref={pinWrapRef} className="hero-pin-wrapper">
      <section ref={sectionRef} className="hero" id="hero">
        
        {/* Cinematic Canvas Video-Frame Stage */}
        <div ref={canvasWrapRef} className="hero__canvas-wrap" aria-hidden="true">
          <canvas ref={canvasRef} className="hero__canvas" />
          <div className="hero__vignette" />
          <div className="hero__ambient-glow" />
        </div>

        {/* Ambient Film Texture */}
        <div className="hero__noise" aria-hidden="true" />

        {/* Subtle Background Editorial Watermark */}
        <div ref={watermarkRef} className="hero__watermark" aria-hidden="true">
          ZARA CARS
        </div>

        {/* Floating Verified Showroom HUD (Top Right) */}
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
                <span className="hero__hud-unit">ASSURED LUXURY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Cinematic Content (Frame 0 — Draped Mystery & Initial Invitation) */}
        <div ref={heroContentRef} className="hero__content container">
          
          <div ref={eyebrowRef} className="hero__eyebrow">
            <span className="hero__eyebrow-line" />
            <span className="hero__eyebrow-text">PREMIUM AUTOMOBILES</span>
          </div>

          <h1 ref={headlineRef} className="hero__headline">
            <span className="hero__headline-word">BEYOND</span>
            <span className="hero__headline-word hero__headline-word--accent">ORDINARY.</span>
          </h1>

          <p ref={subtextRef} className="hero__sub">
            Discover exceptional cars. Find the one that moves you.
          </p>

          <div ref={actionsRef} className="hero__actions">
            <a
              href="#inventory"
              className="hero__btn-primary"
              data-cursor-text="COLLECTION"
              aria-label="Explore our collection"
            >
              <span>EXPLORE OUR COLLECTION</span>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2 8h12M9 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              href={WHATSAPP_ENQUIRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__btn-wa"
              data-cursor-text="WHATSAPP"
              aria-label="Enquire on WhatsApp"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>ENQUIRE ON WHATSAPP</span>
            </a>
          </div>

        </div>

        {/* Revealed Outro Culmination Overlay (Frames 180-240 when car is ignited) */}
        <div ref={outroContentRef} className="hero__outro container" aria-hidden="true">
          <div className="hero__outro-inner">
            <div className="hero__outro-badge">
              <span className="hero__outro-dot" />
              <span>ZARA CARS · CERTIFIED PRE-OWNED</span>
            </div>
            <h2 className="hero__outro-headline">
              UNVEILED. READY FOR THE ROAD.
            </h2>
            <p className="hero__outro-desc">
              Every vehicle undergoes rigorous 140-point diagnostics with transparent documentation.
            </p>
            <div className="hero__outro-actions">
              <a href="#inventory" className="hero__outro-btn" data-cursor-text="DISCOVER">
                <span>VIEW SHOWROOM INVENTORY</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Subtle Cinematic Scroll Indicator */}
        <div ref={scrollIndicatorRef} className="hero__scroll-indicator" aria-hidden="true">
          <div className="hero__scroll-pill">
            <div className="hero__scroll-dot" />
          </div>
          <span className="hero__scroll-label">SCROLL TO UNVEIL</span>
        </div>

      </section>
    </div>
  )
}
