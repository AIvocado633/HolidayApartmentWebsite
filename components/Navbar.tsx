'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, CalendarDays } from 'lucide-react';

type NavLink = {
  label: string;
  href: string;
};

// The targets are sections of the home page, so the links have to be rooted
// there rather than bare fragments — from a subpage like /impressum a bare
// "#gallery" only rewrites the hash and goes nowhere.
const NAV_LINKS: NavLink[] = [
  { label: 'Ausstattung', href: '/#amenities' },
  { label: 'Galerie', href: '/#gallery' },
  { label: 'Preise', href: '/#pricing' },
  { label: 'Kontakt', href: '/#contact' },
];

const ENQUIRY_HREF = '/#contact';

// The mobile panel holds only links and the close button today; the wider
// selector keeps the focus trap correct if a control is ever added to it.
const FOCUSABLE_SELECTOR: string =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Tailwind's md breakpoint, where the panel and its toggle both disappear.
const DESKTOP_MEDIA_QUERY: string = '(min-width: 768px)';

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

const Navbar = (): React.JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const pathname = usePathname();
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // The panel claims aria-modal, so while it is open it has to earn that: focus
  // starts inside it, Tab cannot leave it, Escape closes it, and the page behind
  // it does not scroll. Closing hands focus back to the toggle so a keyboard
  // user carries on where they left off.
  useEffect(() => {
    const panel = menuPanelRef.current;
    const toggle = menuToggleRef.current;
    if (!isMobileMenuOpen || !panel) return;

    // The panel is still visibility:hidden at this point — the transition that
    // reveals it only clears that on its first frame, and nothing inside a
    // hidden subtree can take focus. Wait for that frame before reaching in.
    let focusFrame = 0;
    focusFrame = requestAnimationFrame(() => {
      focusFrame = requestAnimationFrame(() => {
        getFocusableElements(panel)[0]?.focus();
      });
    });

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(panel);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      // Focus that has already escaped the panel — a click on the overlay, say —
      // is pulled back in on the next Tab rather than left outside.
      const hasLeft = !(active instanceof HTMLElement) || !panel.contains(active);

      if (event.shiftKey && (active === first || hasLeft)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || hasLeft)) {
        event.preventDefault();
        first.focus();
      }
    };

    // Panel and toggle are both md:hidden, so turning a phone to landscape would
    // strand the menu open with nothing on screen to close it — and the page
    // still locked.
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleDesktopChange = (event: MediaQueryListEvent): void => {
      if (event.matches) setIsMobileMenuOpen(false);
    };

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', handleDesktopChange);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleDesktopChange);
      document.body.style.overflow = previousBodyOverflow;
      toggle?.focus();
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = (): void => setIsMobileMenuOpen(false);

  // Only the home page puts a hero image behind the bar, so only there can it
  // start out transparent with cream lettering. Every other page has a cream
  // background, where that lettering would be invisible until the first scroll —
  // and a short page may not scroll at all.
  const isHomePage = pathname === '/';
  const hasSolidBackground = isScrolled || !isHomePage;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          hasSolidBackground
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
            className="flex flex-col leading-none group pr-4"
            onClick={closeMobileMenu}
          >
            <span
              className={`font-heading text-base min-[360px]:text-lg sm:text-xl font-semibold tracking-tight transition-colors duration-300 ${
                hasSolidBackground ? 'text-accent' : 'text-cream'
              } group-hover:text-warm-400`}
            >
              {/* Non-breaking space keeps the break after "Ferienwohnung"
                  on very narrow phones instead of splitting the name. */}
              Ferienwohnung Zum&nbsp;Biebertal
            </span>
            <span
              className={`font-body text-xs tracking-widest uppercase transition-colors duration-300 ${
                hasSolidBackground ? 'text-warm-500' : 'text-cream/70'
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
                    hasSolidBackground ? 'text-accent-muted' : 'text-cream/90'
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
              href={ENQUIRY_HREF}
              className={`btn-primary flex items-center gap-2 ${
                hasSolidBackground
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
            ref={menuToggleRef}
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`md:hidden p-2 transition-colors duration-200 ${
              hasSolidBackground
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
      {/* Visibility, not just the transform: a panel that is merely pushed
          off-screen keeps its links in the tab order. Transitioning visibility
          alongside the transform holds it visible for the slide-out, then hides
          it — so the closed panel has nothing left to focus. */}
      <div
        ref={menuPanelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-full bg-cream shadow-2xl md:hidden transform transition-[transform,visibility] duration-300 ease-out ${
          isMobileMenuOpen ? 'visible translate-x-0' : 'invisible translate-x-full'
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
              href={ENQUIRY_HREF}
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
