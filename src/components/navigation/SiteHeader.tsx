import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { ArrowUpRight, Close } from '../ui/Icons';
import { CONTACT } from '../../lib/site';
import { useDialog } from '../../hooks/useUi';

const NAV_ITEMS = [
  { label: 'Residences', to: '/residences' },
  { label: 'Architecture', to: '/architecture' },
  { label: '3D Explorer', to: '/explorer' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function SiteHeader() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const panelRef = useDialog(menuOpen, closeMenu);

  const isLegal = location.pathname === '/privacy' || location.pathname === '/terms';
  const solid = scrolled || isLegal;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const media = window.matchMedia('(min-width: 941px)');
    const onChange = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header${solid ? ' is-solid' : ''}`}>
        <div className="nav-inner">
          <Logo />
          <nav className="nav-links" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/contact#enquiry" className="btn btn--small btn--ghost nav-cta">
            Private Viewing
            <ArrowUpRight size={13} />
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="nav-toggle__bars" aria-hidden="true">
              <span />
              <span />
            </span>
            <span>Menu</span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={`mobile-menu${menuOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu__head">
          <span className="mobile-menu__eyebrow">Vanguard Estates — Menu</span>
          <button type="button" className="mobile-menu__close" onClick={closeMenu}>
            Close
            <Close size={15} />
          </button>
        </div>
        <nav aria-label="Mobile primary">
          <ul className="mobile-menu__links">
            {[{ label: 'Home', to: '/' }, ...NAV_ITEMS].map((item, index) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `mobile-menu__link${isActive ? ' is-active' : ''}`
                  }
                  onClick={closeMenu}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__foot">
          <div className="mobile-menu__contact">
            <span>Private enquiries</span>
            <a href={`mailto:${CONTACT.email}`} tabIndex={menuOpen ? 0 : -1}>
              {CONTACT.email}
            </a>
            <a href={CONTACT.phoneHref} tabIndex={menuOpen ? 0 : -1}>
              {CONTACT.phone}
            </a>
          </div>
          <div className="mobile-menu__meta">
            {CONTACT.offices.map((office) => (
              <span key={office.city}>{office.city}</span>
            ))}
          </div>
          <Link
            to="/contact#enquiry"
            className="btn btn--gold mobile-menu__cta"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            Request a Private Viewing
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
