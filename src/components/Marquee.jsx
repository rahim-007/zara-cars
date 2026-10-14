import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Marquee.css'

gsap.registerPlugin(ScrollTrigger)

const PHRASE = 'Zara Cars · Best Price & Best Service Is Our Assurance · Certified Pre-Owned · Est. 2023 · Sri Balaji Complex ·'
const REPEATED = Array(4).fill(PHRASE).join(' ')

export default function Marquee() {
  const trackRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Direct tactile connection: as you scroll, the marquee tracks scroll momentum
      gsap.to(trackRef.current, {
        xPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="marquee" aria-hidden="true">
      <div ref={trackRef} className="marquee__track">
        <span className="marquee__text">{REPEATED}&nbsp;</span>
        <span className="marquee__text" aria-hidden="true">{REPEATED}&nbsp;</span>
      </div>
    </div>
  )
}
