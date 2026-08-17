import Image, { type StaticImageData } from 'next/image';
import openPlanRoom from '../pictures/web/wohn-schlafbereich.jpg';
import livingArea from '../pictures/web/wohnbereich.jpg';
import kitchen from '../pictures/web/kueche.jpg';
import bedroom from '../pictures/web/schlafbereich.jpg';
import bathroom from '../pictures/web/bad.jpg';
import wasserkuppe from '../pictures/web/wasserkuppe.jpg';
import milseburg from '../pictures/web/milseburg.jpg';

// How a photo sits in its group's grid: a column span paired with the ratio the
// tile is displayed at.
//
// Every room photo is 4:3 straight out of the camera, so the tiles showing them
// are 4:3 as well. A 16:9 tile would crop a quarter off each frame, which is the
// opposite of what this section is for — the point is to show how much room
// there is. The bath is the one native portrait (3:4); only the two landscapes
// are natively 16:9.
type TileKind = 'lead' | 'half' | 'wide' | 'narrow' | 'view';

type GalleryImage = {
  id: string;
  src: StaticImageData;
  label: string;
  alt: string;
  tile: TileKind;
};

type GalleryGroup = {
  id: string;
  title: string;
  description: string;
  // Each group sizes its own grid, so neither has to compromise for the other.
  gridClasses: string;
  images: GalleryImage[];
};

const GALLERY_GROUPS: GalleryGroup[] = [
  {
    id: 'wohnung',
    title: 'Die Wohnung',
    // The one thing the photos alone cannot say. Labelling the two areas
    // separately reads as two rooms unless the layout is spelled out, and a
    // guest who books for four on that assumption finds out on arrival.
    description:
      'Wohn- und Schlafbereich liegen in einem offenen Raum, getrennt durch eine Holzlamellenwand – dazu die eigene Küche und das Bad.',
    gridClasses: 'grid-cols-1 lg:grid-cols-6',
    images: [
      // Leads the group because it is the only photo that settles the layout
      // question on sight: the slat wall stands mid-frame with the bed on one
      // side and the couch on the other, and both the ceiling and the tiled
      // floor run through unbroken behind it.
      {
        id: 'wohn-schlafbereich',
        src: openPlanRoom,
        label: 'Wohn- & Schlafbereich',
        alt: 'Der offene Wohn-/Schlafraum: links das Doppelbett, rechts die Couchgarnitur mit Couchtisch, dazwischen eine raumhohe Holzlamellenwand als Raumteiler – Decke und Fliesenboden laufen durch',
        tile: 'lead',
      },
      // These two share the row below on purpose: seeing the halves of the room
      // side by side backs up what the lead photo just showed.
      {
        id: 'wohnbereich',
        src: livingArea,
        label: 'Wohnbereich',
        alt: 'Wohnbereich mit großer Couchgarnitur, Couchtisch, Fernseher und Fenster zum Garten',
        tile: 'half',
      },
      {
        id: 'schlafbereich',
        src: bedroom,
        label: 'Schlafbereich',
        alt: 'Schlafbereich mit Doppelbett, Nachttisch und großem Kleiderschrank mit Spiegeltüren, abgetrennt durch eine Holzlamellenwand, die den Raum vom Wohnbereich trennt',
        tile: 'half',
      },
      {
        id: 'kueche',
        src: kitchen,
        label: 'Küche & Essbereich',
        alt: 'Helle Küche in Buchenholz mit Ceranfeld, Spülmaschine und Esstisch für vier Personen',
        tile: 'wide',
      },
      {
        id: 'bad',
        src: bathroom,
        label: 'Badezimmer',
        alt: 'Badezimmer mit Eckdusche, Waschbecken und WC, hell gefliest mit bunten Akzenten',
        tile: 'narrow',
      },
    ],
  },
  {
    id: 'umgebung',
    title: 'Die Rhön ringsum',
    description: 'Was direkt vor der Haustür auf euch wartet.',
    gridClasses: 'grid-cols-1 sm:grid-cols-2',
    images: [
      // Both run at 16:9 so the row stays flush. That crops some sky and
      // foreground off the natively 4:3 Milseburg, which is the cheaper loss:
      // the Wasserkuppe's radar dome sits far to the right of its frame and a
      // 4:3 tile would cut the subject out altogether.
      {
        id: 'milseburg',
        src: milseburg,
        label: 'Milseburg',
        alt: 'Herbstlicher Blick von der Maulkuppe über bunte Wälder auf den Felsgipfel der Milseburg',
        tile: 'view',
      },
      {
        id: 'wasserkuppe',
        src: wasserkuppe,
        label: 'Wasserkuppe',
        alt: 'Wanderer auf einem Wiesenweg zur Wasserkuppe, oben die Radarkuppel unter Sommerwolken',
        tile: 'view',
      },
    ],
  },
];

// Below `lg` the apartment group collapses to a single column, so every tile
// falls back to its native ratio and nothing is cropped at all. The spans only
// come into play at six columns, where the rows work out as 6 / 3+3 / 4+2 —
// with or without the lead tile.
const TILE_CLASSES: Record<TileKind, string> = {
  // The only tile cropped away from its source ratio, and only just: 3:2 trims
  // about 5% off the top and bottom, which here is bare ceiling and foreground
  // floor tile. A full-width 4:3 would be taller than most screens, and a wider
  // 16:9 would start cutting into the slat wall where it stops short of the
  // ceiling — the detail that shows it is a divider rather than a wall.
  //
  // Below lg it keeps the full 4:3 frame, because that is where the tile is
  // smallest and every pixel counts for making out the bed through the slats.
  lead: 'aspect-[4/3] lg:col-span-6 lg:aspect-[3/2]',
  half: 'aspect-[4/3] lg:col-span-3',
  wide: 'aspect-[4/3] lg:col-span-4',
  // Pairs with `wide` to fill the six columns. It drops its own ratio at lg and
  // stretches to the row height instead, which lands it just short of square. A
  // narrower span would crop the shower and the WC out of the frame.
  //
  // The square in between is there because a full-width 3:4 tile on a tablet is
  // nearly a screen tall. It trims the ceiling and the floor tiles, which is the
  // part of this photo nobody came for.
  narrow: 'aspect-[3/4] sm:aspect-square lg:col-span-2 lg:aspect-auto',
  view: 'aspect-[16/9]',
};

const SIZES: Record<TileKind, string> = {
  lead: '100vw',
  half: '(max-width: 1024px) 100vw, 50vw',
  wide: '(max-width: 1024px) 100vw, 67vw',
  narrow: '(max-width: 1024px) 100vw, 34vw',
  view: '(max-width: 640px) 100vw, 50vw',
};

// Only the very first photo of the first group is worth fetching eagerly.
const FIRST_IMAGE_ID = GALLERY_GROUPS[0]?.images[0]?.id;

const TOTAL_IMAGES = GALLERY_GROUPS.reduce(
  (total, group) => total + group.images.length,
  0,
);

type GalleryItemProps = {
  image: GalleryImage;
};

const GalleryItem = ({ image }: GalleryItemProps): React.JSX.Element => {
  return (
    <figure
      role="listitem"
      className={`relative overflow-hidden group bg-beige ${TILE_CLASSES[image.tile]}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        sizes={SIZES[image.tile]}
        loading={image.id === FIRST_IMAGE_ID ? 'eager' : 'lazy'}
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

type GallerySectionProps = {
  group: GalleryGroup;
};

const GallerySection = ({ group }: GallerySectionProps): React.JSX.Element => {
  const headingId = `gallery-${group.id}-heading`;

  return (
    <div>
      <header className="flex flex-col gap-2 mb-6">
        <h3 id={headingId} className="heading-sm text-xl">
          {group.title}
        </h3>
        <p className="font-body text-sm text-accent-muted max-w-2xl leading-relaxed">
          {group.description}
        </p>
      </header>

      <div
        className={`grid gap-3 ${group.gridClasses}`}
        role="list"
        aria-labelledby={headingId}
      >
        {group.images.map((image) => (
          <GalleryItem key={image.id} image={image} />
        ))}
      </div>
    </div>
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
          <p className="label-overline">Fotos</p>
          <h2 id="gallery-heading" className="heading-lg max-w-xl">
            Ein Blick in die Ferienwohnung
          </h2>
          <p className="font-body text-base text-accent-muted max-w-lg leading-relaxed">
            Seht selbst, wie ihr bei uns wohnt – und was direkt vor der Haustür
            auf euch wartet.
          </p>
        </header>

        {/* The flat and the landscape around it are two different promises, so
            they get two labelled groups rather than one mixed grid. */}
        <div className="flex flex-col gap-14">
          {GALLERY_GROUPS.map((group) => (
            <GallerySection key={group.id} group={group} />
          ))}
        </div>

        <p className="font-body text-sm text-warm-500 text-center mt-10">
          {TOTAL_IMAGES}&nbsp;Fotos · Offener Wohn-/Schlafraum, Küche &amp; Bad ·
          Rhön ringsum
        </p>
      </div>
    </section>
  );
};

export default Gallery;
