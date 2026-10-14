import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Showcase.css'

gsap.registerPlugin(ScrollTrigger)

const SHOWCASE_IMAGE = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=85&fit=crop&crop=center'

const features = [
  {
    number: '01',
    title: 'Best Price Assurance',
    body: 'Guaranteed transparent pricing with maximum market value on every vehicle in our Sri Balaji Complex showroom.',
  },
  {
    number: '02',
    title: 'Multi-Point Quality Check',
    body: 'Rigorous multi-stage inspection ensuring peak mechanical and aesthetic condition before delivery.',
  },
  {
    number: '03',
    title: 'Trusted Ownership & Support',
    body: 'Complete verified documentation, genuine vehicle history, and dependable client care established since 2023.',
  },
]

export default function Showcase() {
  const sectionRef  = useRef(null)
  const imageRef    = useRef(null)
  const clipRef     = useRef(null)
  const eyebrowRef  = useRef(null)
  const titleRef    = useRef(null)
  const bodyRef     = useRef(null)
  const featuresRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image clip-path reveal — smooth, visible curtain opening tied directly to scroll
      gsap.fromTo(clipRef.current,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            end: 'top 65%',
            scrub: 0.6,
          },
        }
      )

      // Parallax that directly matches scroll
      gsap.to(imageRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      })

      // Eyebrow & Title
      gsap.fromTo(eyebrowRef.current,
        { opacity: 0.2, x: -25 },
        {
          opacity: 1, x: 0, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 95%', end: 'top 75%', scrub: 0.5 },
        }
      )

      const chars = titleRef.current.querySelectorAll('.sh-char')
      gsap.fromTo(chars,
        { y: '80%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          stagger: 0.02,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Body text
      gsap.fromTo(bodyRef.current,
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
        }
      )

      // Feature items — clear, visible cascade with 0.65s duration
      featuresRef.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { opacity: 0, x: -24 },
          {
            opacity: 1, x: 0,
            duration: 0.65,
            ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
          }
        )
        const line = el.querySelector('.showcase__feature-line')
        if (line) {
          gsap.fromTo(line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.65,
              ease: 'power2.inOut',
              transformOrigin: 'left center',
              delay: i * 0.08 + 0.1,
              scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Char split helper
  const titleWords = [
    { text: 'Pre-Owned\u00A0without', accent: false },
    { text: 'compromise.', accent: true },
  ]

  return (
    <section ref={sectionRef} className="showcase" id="why-zara">
      <div className="showcase__layout">

        {/* Left — image panel */}
        <div className="showcase__image-panel" aria-hidden="true">
          <div ref={clipRef} className="showcase__image-clip">
            <img
              ref={imageRef}
              src={SHOWCASE_IMAGE}
              alt="Zara Cars Certified Quality"
              className="showcase__image"
              loading="lazy"
              decoding="async"
            />
            <div className="showcase__image-tint" />
          </div>
          {/* Corner label */}
          <div className="showcase__image-badge">
            <span className="showcase__image-badge-dot" />
            <span>Best Price &amp; Service · Est. 2023</span>
          </div>
        </div>

        {/* Right — content */}
        <div className="showcase__content">

          <span ref={eyebrowRef} className="eyebrow">
            <span className="divider-line" />
            Why Zara Cars
          </span>

          <h2
            ref={titleRef}
            className="showcase__title"
            aria-label="Engineering without compromise."
          >
            {titleWords.map(({ text, accent }) => (
              <span key={text} className="showcase__title-line">
                {text.split('').map((ch, i) => (
                  <span
                    key={i}
                    className={`sh-char${accent ? ' sh-char--accent' : ''}`}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <p ref={bodyRef} className="showcase__body">
            Located at Sri Balaji Complex on the Kanchipuram to Chengalpattu Main Road,
            every automobile in our collection is backed by our founding standard:
            best price and best service is our assurance.
          </p>

          <ul className="showcase__features" aria-label="Key differentiators">
            {features.map((f, i) => (
              <li
                key={f.number}
                ref={el => { featuresRef.current[i] = el }}
                className="showcase__feature"
              >
                <span className="showcase__feature-line" aria-hidden="true" />
                <div className="showcase__feature-inner">
                  <span className="showcase__feature-num">{f.number}</span>
                  <div>
                    <h3 className="showcase__feature-title">{f.title}</h3>
                    <p className="showcase__feature-desc">{f.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  )
}
