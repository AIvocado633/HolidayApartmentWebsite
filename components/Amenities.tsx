import {
  Wifi,
  Car,
  ChefHat,
  Mountain,
  Flower2,
  WashingMachine,
  Flame,
  TreePine,
  UtensilsCrossed,
  Coffee,
  MapPin,
  Baby,
  type LucideIcon,
} from 'lucide-react';

type Amenity = {
  icon: LucideIcon;
  label: string;
  description: string;
};

const AMENITIES: Amenity[] = [
  {
    icon: Wifi,
    label: 'Schnelles WLAN',
    description: 'Stabile Internetverbindung in der gesamten Wohnung',
  },
  {
    icon: ChefHat,
    label: 'Voll ausgestattete Küche',
    description: 'Herd, Backofen, Kühlschrank, Kaffeemaschine und alles Wichtige',
  },
  {
    icon: WashingMachine,
    label: 'Waschmaschine',
    description: 'Zur freien Verfügung während des Aufenthalts',
  },
  {
    icon: Car,
    label: 'Kostenfreie Parkmöglichkeit',
    description: 'Ausreichend Parkmöglichkeiten direkt vor dem Haus',
  },
  {
    icon: Flower2,
    label: 'Eigener Gartenbereich',
    description: 'Ruhige Sitzecke im Grünen – für entspannte Abende draussen',
  },
  {
    icon: Mountain,
    label: 'Wanderwege vor der Tür',
    description: 'Direkter Einstieg ins Rhöner Wegenetz – kein Auto nötig',
  },
  {
    icon: UtensilsCrossed,
    label: 'Grill / BBQ',
    description: 'Holzkohlegrill auf der Terrasse zur Mitbenutzung',
  },
  {
    icon: Flame,
    label: 'Gemütliche Wärme',
    description: 'Elektrische Heizung und gemütliches Wohngefühl im Souterrain',
  },
  {
    icon: TreePine,
    label: 'Natur & Stille',
    description: 'Kleines Dorf, kein Durchgangsverkehr – echte Erholung',
  },
  {
    icon: Coffee,
    label: 'Willkommenskorb',
    description: 'Lokale Produkte und Kaffee zur Begrüßung',
  },
  {
    icon: MapPin,
    label: 'Zentrale Lage in der Rhön',
    description: 'Nähe zu Wasserkuppe, Fulda und den schönsten Aussichtspunkten',
  },
  {
    icon: Baby,
    label: 'Familienfreundlich',
    description: 'Reisebett und Kinderstuhl auf Anfrage verfügbar',
  },
];

type AmenityCardProps = {
  amenity: Amenity;
};

const AmenityCard = ({ amenity }: AmenityCardProps): React.JSX.Element => {
  const Icon = amenity.icon;

  return (
    <article className="card p-6 flex flex-col gap-4 group">
      <div className="w-12 h-12 flex items-center justify-center bg-cream border border-beige text-warm-600 group-hover:bg-accent group-hover:text-cream group-hover:border-accent transition-all duration-200">
        <Icon size={22} aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="heading-sm text-lg font-semibold text-accent">
          {amenity.label}
        </h3>
        <p className="font-body text-sm text-accent-muted leading-relaxed">
          {amenity.description}
        </p>
      </div>
    </article>
  );
};

const Amenities = (): React.JSX.Element => {
  return (
    <section
      id="amenities"
      className="py-20 md:py-28 bg-cream"
      aria-labelledby="amenities-heading"
    >
      <div className="section-container section-padding">
        {/* Section header */}
        <header className="flex flex-col items-center text-center gap-4 mb-16">
          <p className="label-overline">Was wir bieten</p>
          <h2 id="amenities-heading" className="heading-lg max-w-xl">
            Alles für einen schönen Aufenthalt
          </h2>
          <p className="font-body text-base text-accent-muted max-w-lg leading-relaxed">
            Die Wohnung ist gemütlich eingerichtet und mit allem Wichtigen
            ausgestattet – damit ihr einfach ankommen und die Rhön genießen könnt.
          </p>
        </header>

        {/* Amenity grid */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="list"
        >
          {AMENITIES.map((amenity) => (
            <li key={amenity.label}>
              <AmenityCard amenity={amenity} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Amenities;
