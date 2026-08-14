import Image, { type StaticImageData } from 'next/image';
import livingRoom from '../pictures/web/wohnzimmer.jpg';
import kitchen from '../pictures/web/kueche.jpg';
import bedroom from '../pictures/web/schlafzimmer.jpg';
import bathroom from '../pictures/web/bad.jpg';
// Same file the hero uses, so the browser reuses the already-downloaded copy.
import surroundings from '../pictures/web/rhoen-landschaft.jpg';

type GalleryImage = {
  id: string;
  src: StaticImageData;
  label: string;
  alt: string;
  aspect: 'video' | 'square' | 'portrait';
};

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'wohnzimmer',
    src: livingRoom,
    label: 'Wohnzimmer',
    alt: 'Wohnzimmer mit großer Couchgarnitur, Couchtisch, Fernseher und Fenster zum Garten',
    aspect: 'video',
  },
  {
    id: 'kueche',
    src: kitchen,
    label: 'Küche & Essbereich',
    alt: 'Helle Küche in Buchenholz mit Ceranfeld, Spülmaschine und Esstisch für vier Personen',
    aspect: 'video',
  },
  {
    id: 'schlafzimmer',
    src: bedroom,
    label: 'Schlafzimmer',
    alt: 'Schlafzimmer mit Doppelbett, Nachttisch und großem Kleiderschrank mit Spiegeltüren',
    aspect: 'video',
  },
  {
    id: 'bad',
    src: bathroom,
    label: 'Badezimmer',
    alt: 'Badezimmer mit Eckdusche, Waschbecken und WC, hell gefliest mit bunten Akzenten',
    aspect: 'portrait',
  },
  {
    id: 'umgebung',
    src: surroundings,
    label: 'Umgebung',
    alt: 'Blick auf einen bewaldeten Rhönberg direkt hinter dem Dorf',
    aspect: 'square',
  },
];

// The aspect ratio sets the tile height while it is alone in its row. As soon as
// a tile shares a row with a taller one it drops the ratio and stretches to the
// row height instead, so every row keeps a flush bottom edge.
const ASPECT_CLASSES: Record<GalleryImage['aspect'], string> = {
  video: 'aspect-video sm:col-span-2',
  portrait: 'aspect-[3/4] lg:aspect-auto',
  square: 'aspect-square sm:aspect-auto',
};

const SIZES: Record<GalleryImage['aspect'], string> = {
  video: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw',
  portrait: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  square: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
};

type GalleryItemProps = {
  image: GalleryImage;
  index: number;
};

const GalleryItem = ({ image, index }: GalleryItemProps): React.JSX.Element => {
  return (
    <figure
      role="listitem"
      className={`relative overflow-hidden group bg-beige ${ASPECT_CLASSES[image.aspect]}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        sizes={SIZES[image.aspect]}
        loading={index === 0 ? 'eager' : 'lazy'}
      />
      {/* Hover overlay */}
      <div
        className="absolute inset-0 bg-accent/0 group-hover:bg-accent/20 transition-colors duration-300"
        aria-hidden="true"
      />
      {/* Room label */}
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-accent/70 to-transparent px-4 pt-8 pb-3">
        <span className="font-body text-xs font-semibold uppercase tracking-widest text-cream">
          {image.label}
        </span>
      </figcaption>
    </figure>
  );
};

const Gallery = (): React.JSX.Element => {
  return (
    <section
      id="gallery"
      className="py-20 md:py-28 bg-beige-light"
      aria-labelledby="gallery-heading"
    >
      <div className="section-container section-padding">
        {/* Section header */}
        <header className="flex flex-col items-center text-center gap-4 mb-14">
          <p className="label-overline">Unsere Räume</p>
          <h2 id="gallery-heading" className="heading-lg max-w-xl">
            Ein Blick in die Ferienwohnung
          </h2>
          <p className="font-body text-base text-accent-muted max-w-lg leading-relaxed">
            Wohnzimmer, Küche, Schlafzimmer und Bad – seht selbst, wie ihr bei uns
            wohnt. Und was direkt vor der Haustür auf euch wartet.
          </p>
        </header>

        {/* Gallery grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          role="list"
          aria-label="Fotos der Ferienwohnung"
        >
          {GALLERY_IMAGES.map((image, index) => (
            <GalleryItem key={image.id} image={image} index={index} />
          ))}
        </div>

        <p className="font-body text-sm text-warm-500 text-center mt-6">
          {GALLERY_IMAGES.length} Fotos · Wohnzimmer, Küche, Schlafzimmer & Bad
        </p>
      </div>
    </section>
  );
};

export default Gallery;
