import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, CalendarDays, MapPin } from 'lucide-react';
import heroImage from '../pictures/web/rhoen-landschaft.jpg';

type HeroStat = {
  label: string;
  value: string;
  hint?: string;
};

// "Schlafbereich: 1" read as a bedroom count and set up the wrong expectation —
// the flat is one open room with a slat wall between the sleeping and living
// halves, and a guest should learn that here rather than on arrival.
const HERO_STATS: HeroStat[] = [
  { label: 'Wohn-/Schlafraum', value: '1', hint: 'offen, mit Raumteiler' },
  { label: 'Personen', value: '2', hint: '+ 2 auf dem Schlafsofa möglich' },
  { label: 'Quadratmeter', value: '60' },
];

const Hero = (): React.JSX.Element => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Startbereich"
    >
      {/* Background image */}
      <Image
        src={heroImage}
        alt="Blick auf die Rhöner Landschaft mit bewaldeten Hügeln"
        fill
        priority
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
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <dt className="font-body text-xs text-cream/60 uppercase tracking-wider">
                {stat.label}
              </dt>
              <dd className="font-heading text-2xl text-cream font-semibold">
                {stat.value}
              </dd>
              {stat.hint && (
                <dd className="font-body text-xs text-cream/70 whitespace-nowrap">
                  {stat.hint}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll indicator. The centring lives on the wrapper because the bounce
          keyframes animate `transform`, which would otherwise overwrite the
          `-translate-x-1/2` and leave the arrow half its width off-centre. */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#amenities"
          className="block text-cream/60 hover:text-cream transition-colors duration-200 animate-bounce"
          aria-label="Weiter zur Ausstattung"
        >
          <ArrowDown size={28} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
