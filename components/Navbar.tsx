'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, CalendarDays } from 'lucide-react';

type NavLink = {
  label: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { label: 'Ausstattung', href: '#amenities' },
  { label: 'Galerie', href: '#gallery' },
  { label: 'Preise', href: '#pricing' },
  { label: 'Kontakt', href: '#contact' },
];

const Navbar = (): React.JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = (): void => setIsMobileMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-sm shadow-sm border-b border-beige'
            : 'bg-transparent'
        }`}
      >
        <nav
          className="section-container section-padding flex items-center justify-between h-18"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col leading-none group"
            onClick={closeMobileMenu}
          >
            <span
              className={`font-heading text-xl font-semibold tracking-tight transition-colors duration-300 ${
                isScrolled ? 'text-accent' : 'text-cream'
              } group-hover:text-warm-400`}
            >
              Ferienwohnung Rhönblick
            </span>
            <span
              className={`font-body text-xs tracking-widest uppercase transition-colors duration-300 ${
                isScrolled ? 'text-warm-500' : 'text-cream/70'
              }`}
            >
              Urlaub in der Rhön
            </span>
          </Link>

          {/* Desktop navigation links */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-body text-sm font-medium transition-colors duration-200 hover:text-warm-400 ${
                    isScrolled ? 'text-accent-muted' : 'text-cream/90'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="#contact"
              className={`btn-primary flex items-center gap-2 ${
                isScrolled
                  ? 'bg-accent text-cream'
                  : 'bg-cream text-accent hover:bg-beige-light'
              }`}
            >
              <CalendarDays size={16} />
              Anfragen
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`md:hidden p-2 transition-colors duration-200 ${
              isScrolled
                ? 'text-accent hover:text-accent-muted'
                : 'text-cream hover:text-cream/70'
            }`}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile slide-out menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-accent/40 backdrop-blur-sm md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-out menu panel */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-full bg-cream shadow-2xl md:hidden transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-beige">
            <span className="font-heading text-lg text-accent">Menu</span>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-2 text-accent-muted hover:text-accent transition-colors"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-6 py-8">
            <ul className="flex flex-col gap-1" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block font-body text-base font-medium text-slate-text py-3 border-b border-beige/50 hover:text-warm-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Panel CTA */}
          <div className="px-6 pb-10">
            <Link
              href="#contact"
              onClick={closeMobileMenu}
              className="btn-primary w-full justify-center gap-2"
            >
              <CalendarDays size={16} />
              Anfragen
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
