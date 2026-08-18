import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PROPERTY_NAME } from '@/lib/site';

// Without this file Next serves its own built-in 404, which reads "This page
// could not be found." in English on an otherwise German site. `output: export`
// writes whatever stands here to out/404.html, which is the file GitHub Pages
// serves for any unknown path under the site.
export const metadata: Metadata = {
  title: `Seite nicht gefunden | ${PROPERTY_NAME}`,
};

type SuggestedLink = {
  label: string;
  description: string;
  href: string;
};

// Where a mistyped or outdated URL was most likely heading. Rooted at "/" rather
// than left as bare fragments: from this page a "#gallery" would only rewrite
// the hash and stay put.
const SUGGESTED_LINKS: SuggestedLink[] = [
  {
    label: 'Fotogalerie',
    description: 'Offener Wohn-/Schlafraum, Küche und Bad',
    href: '/#gallery',
  },
  {
    label: 'Preise & Verfügbarkeit',
    description: 'Freie Termine im Belegungskalender',
    href: '/#pricing',
  },
  {
    label: 'Anfrage senden',
    description: 'Wir melden uns innerhalb von 24 Stunden',
    href: '/#contact',
  },
];

const NotFound = (): React.JSX.Element => {
  return (
    <div className="bg-cream">
      {/* The header is fixed, so the first block has to clear its height. */}
      <section
        aria-labelledby="not-found-heading"
        className="section-container section-padding pt-32 pb-20 md:pb-28 max-w-3xl"
      >
        <header className="flex flex-col gap-4 mb-12">
          <p className="label-overline">Fehler 404</p>
          <h1 id="not-found-heading" className="heading-lg">
            Diese Seite gibt es nicht
          </h1>
          <p className="font-body text-base text-accent-muted leading-relaxed">
            Vielleicht ist der Link veraltet, oder in die Adresse hat sich ein
            Tippfehler eingeschlichen. Die Wohnung steht jedenfalls noch. Von
            hier aus findet ihr zurück.
          </p>
        </header>

        <ul className="flex flex-col" role="list">
          {SUGGESTED_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex items-center justify-between gap-4 py-5 border-t border-beige"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="font-heading text-lg text-accent">
                    {link.label}
                  </span>
                  <span className="font-body text-sm text-accent-muted">
                    {link.description}
                  </span>
                </span>
                <ArrowRight
                  size={18}
                  className="flex-shrink-0 text-warm-400 group-hover:text-accent transition-colors duration-200"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14 pt-8 border-t border-beige">
          <Link href="/" className="btn-ghost gap-2 pl-0">
            <ArrowLeft size={16} aria-hidden="true" />
            Zurück zur Startseite
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
