import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Heads up: crawlers only read robots.txt from the domain root. While the site
// lives at aivocado633.github.io/HolidayApartmentWebsite/ this file is served
// from the subdirectory, so it is ignored — the root belongs to the user's own
// GitHub Pages repo, which we cannot write to. It starts working by itself once
// the site moves to a custom domain and serves from the root.
//
// The sitemap is unaffected: it can live anywhere and be submitted to Search
// Console directly.
// Metadata routes are treated as dynamic handlers by default, which `output:
// export` rejects outright. This pins it to a file emitted at build time.
export const dynamic = 'force-static';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
  },
  sitemap: `${SITE_URL}/sitemap.xml`,
});

export default robots;
