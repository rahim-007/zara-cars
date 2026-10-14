import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './Header.css'

const navLinks = [
  { name: 'Inventory', href: '#inventory' },
  { name: '140-Pt Assurance', href: '#assurance' },
  { name: 'Sell / Trade-In', href: '#trade-in' },
  { name: 'Showroom', href: '#showroom' },
  { name: 'Contact', href: '#contact' },
]

const LOGO_SRC = '/zara-logo.png'

export default function Header() {
  const headerRef = useRef(null)
  const brandRef  = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Scroll glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Brand entrance after preloader exits
  useEffect(() => {

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap.fromTo(brandRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.65, ease: 'power3.out' }
        )
        gsap.fromTo('.header__nav-link, .header__cta',
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, stagger: 0.06, duration: 0.55, ease: 'power3.out' }
        )
      }, headerRef)
      return () => ctx.revert()
    }, 1100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <header ref={headerRef} className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner container">

        {/* Brand — real Zara Cars logo */}
        <a ref={brandRef} href="/" className="header__brand" aria-label="Zara Cars home" data-cursor>
          <img
            src={LOGO_SRC}
            alt="Zara Cars"
            className="header__logo-img"
            width="130"
            height="52"
          />
        </a>


        {/* Desktop nav */}
        <nav className="header__nav" aria-label="Primary navigation">
          <ul className="header__nav-list">
            {navLinks.map(link => (
              <li key={link.name}>
                <a href={link.href} className="header__nav-link" data-cursor>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <a href="#showroom" className="header__cta" data-cursor-text="VISIT">
          Book Showroom Visit
        </a>

        {/* Hamburger */}
        <button
          className={`header__hamburger${menuOpen ? ' header__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`header__drawer${menuOpen ? ' header__drawer--open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          <ul className="header__drawer-list">
            {navLinks.map(link => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="header__drawer-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <a href="#showroom" className="header__drawer-cta" onClick={() => setMenuOpen(false)}>
            Book Showroom Visit
          </a>
        </nav>
      </div>
    </header>
  )
}
