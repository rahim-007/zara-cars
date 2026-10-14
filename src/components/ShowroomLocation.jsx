import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ShowroomLocation.css'

gsap.registerPlugin(ScrollTrigger)

const SHOWROOM_IMAGE = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=85&fit=crop'

export default function ShowroomLocation() {
  const sectionRef = useRef(null)
  const cardRef    = useRef(null)
  const imageRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax scroll on showroom preview that matches scroll
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      })

      // Card entrance reveal — smooth scrubbed elevation as user scrolls towards showroom
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

  return (
    <section ref={sectionRef} className="showroom" id="showroom">
      <div className="container">
        
        {/* Section Header */}
        <div className="showroom__header">
          <div>
            <span className="eyebrow">
              <span className="divider-line" />
              PHYSICAL SHOWROOM · ESTABLISHED 2023
            </span>
            <h2 className="showroom__title">
              Visit Zara Cars at<br />
              <span className="text-champagne">Sri Balaji Complex</span>
            </h2>
          </div>
          <p className="showroom__intro">
            Started in 2023 on the Kanchipuram to Chengalpattu Main Road, our showroom was built
            to redefine automotive purchasing with complete transparency, verified certification,
            and unmatched customer care.
          </p>
        </div>

        {/* Showroom Interactive Bento Box */}
        <div ref={cardRef} className="showroom__box">
          
          {/* Visual Showcase Stage */}
          <div className="showroom__media">
            <img
              ref={imageRef}
              src={SHOWROOM_IMAGE}
              alt="Zara Cars Showroom Kanchipuram"
              className="showroom__media-img"
            />
            <div className="showroom__media-tint" />
            
            {/* Holographic Badge */}
            <div className="showroom__badge">
              <div className="showroom__badge-dot" />
              <span>Showroom Open · Test Drives Available</span>
            </div>
          </div>

          {/* Details & Visiting Card */}
          <div className="showroom__details">
            
            {/* Official Assurance Motto Pill */}
            <div className="showroom__motto">
              <img
                src="/zara-logo-full.png"
                alt="Zara Cars Logo"
                className="showroom__motto-logo"
                width="180"
                height="72"
              />
            </div>

            <div className="showroom__address-block">
              <span className="showroom__label">Showroom Address</span>
              <h3 className="showroom__address-main">
                No. 1, Sri Balaji Complex
              </h3>
              <p className="showroom__address-sub">
                Kanchipuram to Chengalpattu Main Road,<br />
                Tamil Nadu, India · Established 2023
              </p>
            </div>

            {/* Practical Information */}
            <div className="showroom__info-grid">
              <div className="showroom__info-item">
                <span className="showroom__info-label">Hours</span>
                <span className="showroom__info-val">Mon – Sun: 9:00 AM – 8:30 PM</span>
              </div>
              <div className="showroom__info-item">
                <span className="showroom__info-label">Service Commitment</span>
                <span className="showroom__info-val">Multi-Point Certified Guarantee</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="showroom__actions">
              <a
                href="https://maps.google.com/?q=Sri+Balaji+Complex+Kanchipuram+to+Chengalpattu+Main+Road"
                target="_blank"
                rel="noreferrer"
                className="showroom__btn-primary"
                data-cursor-text="MAPS"
              >
                <span>Get Driving Directions</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              <a href="#contact" className="showroom__btn-ghost" data-cursor-text="INQUIRE">
                Contact Concierge
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
