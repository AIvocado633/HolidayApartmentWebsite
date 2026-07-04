/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/HolidayApartmentWebsite',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
