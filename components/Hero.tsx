import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, CalendarDays, MapPin } from 'lucide-react';
import heroImage from '@/public/hero.jpg';

const Hero = (): React.JSX.Element => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background image */}
      <Image
        src={heroImage}
        alt="Blick auf die Rhöner Landschaft mit bewaldeten Hügeln"
        fill
        priority
        quality={85}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-accent/60 via-accent/40 to-accent/70"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 section-container section-padding text-center text-cream flex flex-col items-center gap-6 pt-24 pb-16">
        {/* Overline label */}
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-cream/70 animate-fade-in">
          <MapPin size={12} className="inline mr-1 mb-0.5" aria-hidden="true" />
          Rhön, Deutschland
        </p>

        {/* Main heading */}
        <h1 className="heading-xl text-cream max-w-4xl animate-fade-in">
          Euer Zuhause{' '}
          <em className="not-italic text-warm-300">in der Rhön</em>
        </h1>

        {/* Sub-heading */}
        <p className="font-body text-base sm:text-lg md:text-xl text-cream/80 max-w-2xl leading-relaxed animate-fade-in">
          Eine gemütliche Souterrainwohnung in einem kleinen, ruhigen Dorf –
          umgeben von Wiesen, Wäldern und frischer Rhönluft. Wanderwege
          direkt vor der Tür, kein Verkehr, echte Stille.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 animate-fade-in">
          <Link
            href="#contact"
            className="btn-primary bg-cream text-accent hover:bg-beige px-8 py-4 text-base gap-2"
          >
            <CalendarDays size={18} />
            Verfügbarkeit anfragen
          </Link>
          <Link
            href="#gallery"
            className="btn-outline border-cream/60 text-cream hover:bg-cream/10 hover:text-cream px-8 py-4 text-base"
          >
            Fotos ansehen
          </Link>
        </div>

        {/* Quick stats */}
        <dl className="flex flex-wrap justify-center gap-x-10 gap-y-4 mt-8 pt-8 border-t border-cream/20 w-full max-w-xl animate-fade-in">
          {[
            { label: 'Schlafzimmer', value: '2' },
            { label: 'Max. Personen', value: '4' },
            { label: 'Quadratmeter', value: 'XX' },
            { label: 'Bewertung', value: '4.9★' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <dt className="font-body text-xs text-cream/60 uppercase tracking-wider">
                {stat.label}
              </dt>
              <dd className="font-heading text-2xl text-cream font-semibold">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll indicator */}
      <a
        href="#amenities"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/60 hover:text-cream transition-colors duration-200 animate-bounce z-10"
        aria-label="Scroll to amenities"
      >
        <ArrowDown size={28} />
      </a>
    </section>
  );
};

export default Hero;
