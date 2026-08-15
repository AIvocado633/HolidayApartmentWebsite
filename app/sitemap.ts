import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Metadata routes are treated as dynamic handlers by default, which `output:
// export` rejects outright. This pins it to a file emitted at build time.
export const dynamic = 'force-static';

// next.config.js sets `trailingSlash: true`, so the exported URLs end in a slash
// and the sitemap has to match — otherwise every entry points at a redirect.
const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: `${SITE_URL}/`,
    changeFrequency: 'monthly',
    priority: 1,
  },
  {
    url: `${SITE_URL}/impressum/`,
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/datenschutz/`,
    changeFrequency: 'yearly',
    priority: 0.3,
  },
];

export default sitemap;
