import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Crawlers only read robots.txt from the domain root, so this file did nothing
// while the site was served from the github.io project subdirectory. On the
// site's own domain it is read for real — an over-broad rule here now actually
// costs us pages.
//
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
