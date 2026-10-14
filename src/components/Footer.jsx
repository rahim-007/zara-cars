import './Footer.css'

const year = new Date().getFullYear()

const footerLinks = {
  Showroom: ['Certified Collection', 'Executive Sedans', 'Performance SUVs', 'Fresh Arrivals'],
  Services: ['Quality Certification', 'Car Exchange / Trade-In', 'Competitive Financing', 'Ownership Transfer'],
  Location: ['No. 1, Sri Balaji Complex', 'Kanchipuram–Chengalpattu Rd', 'Open 7 Days a Week', 'Direction & Map'],
}

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__main container">
        {/* Brand column */}
        <div className="footer__brand-col">
          <a href="/" className="footer__brand" aria-label="Zara Cars home" data-cursor>
            <img
              src="/zara-logo-full.png"
              alt="Zara Cars — Best Price & Best Service Is Our Assurance"
              className="footer__logo-img"
              width="230"
              height="92"
            />
          </a>
          <p className="footer__tagline">
            Best Price &amp; Best Service Is Our Assurance.<br />
            Curated premium automobiles delivered with uncompromising trust.
          </p>
          
          <div className="footer__showroom">
            <span className="footer__showroom-eyebrow">Main Showroom</span>
            <address className="footer__contact">
              <span className="footer__address-line">No. 1, Sri Balaji Complex</span>
              <span className="footer__address-line">Kanchipuram to Chengalpattu Main Road</span>
              <span className="footer__address-pill">Est. 2023</span>
            </address>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading} className="footer__link-col">
            <h4 className="footer__col-heading">{heading}</h4>
            <ul className="footer__link-list">
              {links.map(link => (
                <li key={link}>
                  <a href="#collection" className="footer__link">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bottom container">
        <p className="footer__legal">
          &copy; {year} Zara Cars Limited. All rights reserved.
        </p>
        <div className="footer__legal-links">
          <a href="#" className="footer__legal-link">Privacy</a>
          <a href="#" className="footer__legal-link">Terms</a>
          <a href="#" className="footer__legal-link">Cookies</a>
          <a href="/admin" className="footer__legal-link" style={{ color: 'var(--c-champagne)', fontWeight: 500 }}>
            Dealership Portal &rarr;
          </a>
        </div>
      </div>
    </footer>
  )
}
