/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/HolidayApartmentWebsite',
  // Every photo is a static import from pictures/web/, already resized and
  // stripped of EXIF by scripts/optimize-images.mjs. There is no remote source
  // left to allow-list, and `output: 'export'` has no server to optimise on
  // request anyway — the files ship exactly as they are committed.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
