import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

type FooterLink = {
  label: string;
  href: string;
};

const NAVIGATION_LINKS: FooterLink[] = [
  { label: 'Ausstattung', href: '#amenities' },
  { label: 'Fotogalerie', href: '#gallery' },
  { label: 'Jetzt anfragen', href: '#contact' },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
  { label: 'Impressum', href: '/impressum' },
  { label: 'Cookie-Hinweis', href: '/cookies' },
];

const Footer = (): React.JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent text-cream" aria-label="Site footer">
      {/* Main footer content */}
      <div className="section-container section-padding py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col gap-1">
              <span className="font-heading text-xl font-semibold text-cream">
                Villa XYZ
              </span>
              <span className="font-body text-xs tracking-widest uppercase text-cream/50">
                Ferienwohnung
              </span>
            </div>
            <p className="font-body text-sm text-cream/70 leading-relaxed max-w-xs">
              Eine gemütliche Souterrainwohnung in einem kleinen Dorf mitten
              in der Rhön – für alle, die echte Natur und Stille suchen.
            </p>

          </div>

          {/* Navigation links */}
          <nav aria-label="Footer navigation">
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-cream/50 mb-4">
              Menü
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-cream/70 hover:text-cream transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-4 h-px bg-cream/20 group-hover:bg-warm-400 group-hover:w-6 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal links */}
          <nav aria-label="Legal links">
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-cream/50 mb-4">
              Rechtliches
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-cream/70 hover:text-cream transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ExternalLink
                      size={11}
                      className="text-cream/30 group-hover:text-warm-400 transition-colors"
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact info */}
          <address className="not-italic flex flex-col gap-3">
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-cream/50 mb-1">
              Kontakt
            </h3>
            <a
              href="mailto:hallo@XYZ-ferien.de"
              className="flex items-start gap-2.5 text-cream/70 hover:text-cream transition-colors duration-200 group"
            >
              <Mail
                size={14}
                className="mt-0.5 flex-shrink-0 group-hover:text-warm-300 transition-colors"
                aria-hidden="true"
              />
              <span className="font-body text-sm">
                hallo@XYZ-ferien.de
              </span>
            </a>
            <a
              href="tel:+491234567890"
              className="flex items-center gap-2.5 text-cream/70 hover:text-cream transition-colors duration-200 group"
            >
              <Phone
                size={14}
                className="flex-shrink-0 group-hover:text-warm-300 transition-colors"
                aria-hidden="true"
              />
              <span className="font-body text-sm">+49 .......</span>
            </a>
            <div className="flex items-start gap-2.5 text-cream/70">
              <MapPin
                size={14}
                className="mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="font-body text-sm">
                Sandroth 15
                <br />
                36145 Kleinsassen
                <br />
                Hessen, Deutschland
              </span>
            </div>
          </address>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="section-container section-padding py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-cream/40">
            © {currentYear} Ferienwohnung XYZ. Alle Rechte vorbehalten.
          </p>
          <p className="font-body text-xs text-cream/30">
            Mit Liebe zur Natur gestaltet.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
