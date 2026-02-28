import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Gift } from 'lucide-react';
import { BOOKING_URL, CONTACT } from '../data/services';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 header-scroll-transform ${
          scrolled || menuOpen
            ? 'bg-black/95 backdrop-blur-md shadow-md'
            : 'bg-black/50 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-[400ms] ${
            scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
          }`} style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 shrink-0">
              <img
                src="/Photoroom_20260213_195605.png"
                alt="Pro Clean Auto Detail Systems Logo"
                className={`w-auto transition-all duration-[400ms] ${
                  scrolled ? 'h-10 sm:h-12' : 'h-12 sm:h-14'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
            </Link>

            <div className="flex items-center gap-3">
              <a
                href={CONTACT.phoneLink}
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-white hover:text-brand-orange-light transition-colors"
              >
                <Phone className="w-4 h-4" />
                {CONTACT.phone}
              </a>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex px-5 py-2 bg-brand-red text-white text-sm font-semibold rounded-lg btn-apple-hover hover:shadow-lg hover:shadow-red-900/30"
              >
                Book Now
              </a>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg transition-colors text-white hover:bg-white/10 relative z-[80]"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 bg-black/60 z-[60] backdrop-blur-md"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed right-0 top-16 sm:top-20 bottom-0 w-full sm:w-96 z-[75] transition-all duration-300 ease-out ${
          menuOpen
            ? 'translate-x-0 opacity-100 pointer-events-auto'
            : 'translate-x-full opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(7, 10, 15, 0.98)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <nav className="h-full flex flex-col px-6 py-8 overflow-y-auto">
          <ul className="flex-1 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-4 text-lg font-semibold rounded-lg transition-all min-h-[48px] flex items-center relative ${
                      isActive
                        ? 'text-white'
                        : 'text-white hover:text-brand-orange-light'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-brand-red to-brand-orange-light" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-white/10 pt-8 space-y-4">
            <Link
              to="/gift-card"
              className="flex items-center gap-3 px-4 py-3 text-brand-orange-light hover:text-white transition-colors min-h-[48px] font-semibold"
            >
              <Gift className="w-5 h-5 shrink-0" />
              <span>Gift Cards</span>
            </Link>
            <a
              href={CONTACT.phoneLink}
              className="flex items-center gap-3 px-4 py-3 text-white hover:text-brand-orange-light transition-colors min-h-[48px]"
            >
              <Phone className="w-5 h-5 shrink-0" />
              <span className="font-medium">{CONTACT.phone}</span>
            </a>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-brand-red to-brand-orange text-white font-semibold rounded-lg btn-apple-hover hover:shadow-lg hover:shadow-red-900/40 min-h-[48px] flex items-center justify-center"
            >
              Book an Appointment
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
