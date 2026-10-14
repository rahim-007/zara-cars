import { useState, useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Header from '../components/Header'
import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import Marquee from '../components/Marquee'
import CarTelemetry from '../components/CarTelemetry'
import FleetHorizontal from '../components/FleetHorizontal'
import Collection from '../components/Collection'
import QualityAssurance from '../components/QualityAssurance'
import SellTradeIn from '../components/SellTradeIn'
import Showcase from '../components/Showcase'
import ShowroomLocation from '../components/ShowroomLocation'
import Footer from '../components/Footer'
import Preloader from '../components/Preloader'
import Cursor from '../components/Cursor'

gsap.registerPlugin(ScrollTrigger)

export default function PublicPage() {
  const [loaded, setLoaded] = useState(false)

  // Initialize Lenis Ultra-Smooth Luxury Inertia Scroll
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true })

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const lenis = new Lenis({
      duration: isTouch ? 0.9 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
    })

    // Synchronize Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const updateTicker = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    // Re-calculate triggers on window resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <Cursor />
      <Preloader onComplete={() => {
        setLoaded(true)
        setTimeout(() => {
          ScrollTrigger.refresh()
        }, 100)
      }} />
      
      <div className={`app${loaded ? ' app--ready' : ''}`}>
        <Header />
        
        <main>
          {/* Cinema Ignition Hero with Headlight Reveal & Smooth Parallax */}
          <Hero />

          {/* Key Figures with Live GSAP Scroll Counters */}
          <StatsBar />

          {/* Kinetic Champagne Brand Ticker Tape */}
          <Marquee />

          {/* Pinned 3D Car Anatomy Diagnostics & 140-Point Inspection Scrub */}
          <CarTelemetry />

          {/* Pinned Horizontal Certified Pre-Owned Fleet Runway */}
          <FleetHorizontal />

          {/* Interactive Certified Pre-Owned Vehicle Inventory */}
          <Collection />

          {/* 140-Point Technical Certification & Title Assurance */}
          <QualityAssurance />

          {/* Instant Valuation & Car Exchange / Trade-In Module */}
          <SellTradeIn />

          {/* Core Values: Best Price & Best Service Is Our Assurance */}
          <Showcase />

          {/* Physical Showroom Location: No. 1, Sri Balaji Complex */}
          <ShowroomLocation />
        </main>

        <Footer />
      </div>
    </>
  )
}
