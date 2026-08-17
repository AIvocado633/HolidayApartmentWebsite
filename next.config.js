/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // No basePath: the site is served from the root of its own domain. It used to
  // need '/HolidayApartmentWebsite' while it lived on the github.io project URL,
  // which is a subdirectory. Reintroducing one would prefix every asset and
  // internal link with a path the domain does not have.
  //
  // Every photo is a static import from pictures/web/, already resized and
  // stripped of EXIF by scripts/optimize-images.mjs. There is no remote source
  // left to allow-list, and `output: 'export'` has no server to optimise on
  // request anyway — the files ship exactly as they are committed.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
