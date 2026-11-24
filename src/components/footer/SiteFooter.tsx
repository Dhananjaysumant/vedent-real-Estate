import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { ArrowUpRight } from '../ui/Icons';
import { CONTACT, DEMO_NOTE } from '../../lib/site';
import { properties } from '../../data/properties';

const exploreLinks = [
  { label: 'All Residences', to: '/residences' },
  { label: 'The 3D Explorer', to: '/explorer' },
  { label: 'Architecture & Philosophy', to: '/architecture' },
  { label: 'About Vanguard', to: '/about' },
  { label: 'Private Viewing', to: '/contact' },
];

export function SiteFooter() {
  return (
    <footer className="site-footer dark-section" aria-labelledby="footer-heading">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <h2 id="footer-heading">
              The art
              <br />
              of <em>living.</em>
            </h2>
            <p>
              Residences of enduring architectural quality, created around landscape, light and the
              way people actually live.
            </p>
          </div>

          <div className="footer-col">
            <h3>Explore</h3>
            <nav aria-label="Footer navigation">
              <ul className="footer-links">
                {exploreLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="footer-col">
            <h3>Residences</h3>
            <ul className="footer-links">
              {properties.map((property) => (
                <li key={property.slug}>
                  <Link to={`/residences/${property.slug}`}>
                    {property.name}
                    <span className="sr-only"> — demonstration property</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3>Enquiries</h3>
            <div className="footer-contact">
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              <span>
                {CONTACT.offices.map((office) => office.city).join(' · ')}
              </span>
              <div className="footer-socials">
                {CONTACT.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} (external, Vanguard Estates demonstration)`}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
              <Link to="/contact#enquiry" className="link-arrow" style={{ marginTop: '0.6rem' }}>
                Request a viewing
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-disclaimer">
          <strong>Demonstration project.</strong> {DEMO_NOTE} Contact details use the reserved{' '}
          <code>.example</code> domain and fictional telephone numbers. Photography is represented by
          original architectural illustrations pending final asset production. No listing, offer,
          investment outcome or availability is implied.
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Vanguard Estates. All rights reserved.</span>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <a href="#top" className="footer-top-link">
            Back to top
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
