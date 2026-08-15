import Image, { type StaticImageData } from 'next/image';
import livingArea from '../pictures/web/wohnbereich.jpg';
import kitchen from '../pictures/web/kueche.jpg';
import bedroom from '../pictures/web/schlafbereich.jpg';
import bathroom from '../pictures/web/bad.jpg';
import wasserkuppe from '../pictures/web/wasserkuppe.jpg';
import milseburg from '../pictures/web/milseburg.jpg';

type GalleryImage = {
  id: string;
  src: StaticImageData;
  label: string;
  alt: string;
  aspect: 'video' | 'portrait' | 'landscape' | 'banner';
};

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'wohnbereich',
    src: livingArea,
    label: 'Wohnbereich',
    alt: 'Wohnbereich mit großer Couchgarnitur, Couchtisch, Fernseher und Fenster zum Garten',
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
    id: 'schlafbereich',
    src: bedroom,
    label: 'Schlafbereich',
    alt: 'Schlafbereich mit Doppelbett, Nachttisch und großem Kleiderschrank mit Spiegeltüren, abgetrennt durch eine Holzlamellenwand',
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
    id: 'milseburg',
    src: milseburg,
    label: 'Milseburg',
    alt: 'Herbstlicher Blick von der Maulkuppe über bunte Wälder auf den Felsgipfel der Milseburg',
    aspect: 'landscape',
  },
  // Closes the gallery full width. Its radar dome sits far to the right, so a
  // narrow tile would crop the subject out — the banner keeps the frame intact.
  {
    id: 'wasserkuppe',
    src: wasserkuppe,
    label: 'Wasserkuppe',
    alt: 'Wanderer auf einem Wiesenweg zur Wasserkuppe, oben die Radarkuppel unter Sommerwolken',
    aspect: 'banner',
  },
];

// The aspect ratio sets the tile height while it is alone in its row. As soon as
// a tile shares a row with a taller one it drops the ratio and stretches to the
// row height instead, so every row keeps a flush bottom edge.
//
// At least one tile per row has to keep its ratio, otherwise the row has no
// height to stretch to and collapses. The tall portrait bath is that anchor at
// two columns; at four columns it hands over to the `video` tile beside it.
//
// On column spans: six tiles do not tile a four-column grid with spans of 1 and
// 2 alone — the sums only work out if all six span 2, which would crop the
// portrait bath into a letterbox. Letting the closing landscape run the full
// width solves it, and the rows land as 2+2 / 2+1+1 / 4.
const ASPECT_CLASSES: Record<GalleryImage['aspect'], string> = {
  video: 'aspect-video sm:col-span-2',
  portrait: 'aspect-[3/4] lg:aspect-auto',
  landscape: 'aspect-[4/3] sm:aspect-auto',
  banner: 'aspect-video sm:col-span-2 lg:col-span-4 lg:aspect-[21/9]',
};

const SIZES: Record<GalleryImage['aspect'], string> = {
  video: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw',
  portrait: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  landscape: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  banner: '100vw',
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
            Wohn- und Schlafbereich, Küche und Bad – seht selbst, wie ihr bei
            uns wohnt. Und was direkt vor der Haustür auf euch wartet.
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
          {GALLERY_IMAGES.length}&nbsp;Fotos · Wohn- &amp; Schlafbereich, Küche &amp;
          Bad · Rhön ringsum
        </p>
      </div>
    </section>
  );
};

export default Gallery;
