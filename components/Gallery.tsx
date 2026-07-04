import Image from 'next/image';

type GalleryImage = {
  src: string;
  alt: string;
  aspect: 'video' | 'square';
};

const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
    alt: 'Bright living room with alpine views through floor-to-ceiling windows',
    aspect: 'video',
  },
  {
    src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
    alt: 'Master bedroom with white linen and natural wood accents',
    aspect: 'square',
  },
  {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    alt: 'Modern kitchen with marble countertops and professional appliances',
    aspect: 'square',
  },
  {
    src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
    alt: 'Heated outdoor pool surrounded by lush greenery',
    aspect: 'video',
  },
  {
    src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    alt: 'Spa bathroom with rainfall shower and freestanding bathtub',
    aspect: 'square',
  },
  {
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    alt: 'Private garden terrace with sun loungers and mountain backdrop',
    aspect: 'square',
  },
  {
    src: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80',
    alt: 'Cosy fireplace corner with handcrafted wooden furniture',
    aspect: 'video',
  },
  {
    src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    alt: 'Exterior view of the villa at golden hour',
    aspect: 'square',
  },
];

type GalleryItemProps = {
  image: GalleryImage;
  index: number;
};

const GalleryItem = ({ image, index }: GalleryItemProps): React.JSX.Element => {
  const isWide = image.aspect === 'video';

  return (
    <figure
      className={`relative overflow-hidden group bg-beige ${
        isWide ? 'aspect-video col-span-1 sm:col-span-2' : 'aspect-square'
      }`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        quality={80}
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        sizes={
          isWide
            ? '(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw'
            : '(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw'
        }
        loading={index < 3 ? 'eager' : 'lazy'}
      />
      {/* Hover overlay */}
      <div
        className="absolute inset-0 bg-accent/0 group-hover:bg-accent/20 transition-colors duration-300"
        aria-hidden="true"
      />
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
          <p className="label-overline">Our spaces</p>
          <h2 id="gallery-heading" className="heading-lg max-w-xl">
            A Glimpse Inside Villa Sonnenschein
          </h2>
          <p className="font-body text-base text-accent-muted max-w-lg leading-relaxed">
            Every corner of our property has been designed with care. Explore
            the interiors, outdoor areas, and stunning surroundings.
          </p>
        </header>

        {/* Gallery grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          role="list"
          aria-label="Property photo gallery"
        >
          {GALLERY_IMAGES.map((image, index) => (
            <GalleryItem key={image.src} image={image} index={index} />
          ))}
        </div>

        <p className="font-body text-sm text-warm-500 text-center mt-6">
          {GALLERY_IMAGES.length} photos · Professional photography
        </p>
      </div>
    </section>
  );
};

export default Gallery;
