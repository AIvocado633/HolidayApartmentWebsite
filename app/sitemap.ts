import type { MetadataRoute } from 'next';
import { BOOKINGS_UPDATED_AT } from '@/lib/bookings';
import {
  AGB_LAST_UPDATED,
  IMPRESSUM_LAST_UPDATED,
  PRIVACY_LAST_UPDATED,
  SITE_URL,
} from '@/lib/site';

// Metadata routes are treated as dynamic handlers by default, which `output:
// export` rejects outright. This pins it to a file emitted at build time.
export const dynamic = 'force-static';

// next.config.js sets `trailingSlash: true`, so the exported URLs end in a slash
// and the sitemap has to match — otherwise every entry points at a redirect.
//
// Every `lastModified` is a real content date rather than the build time. The
// availability sync rebuilds the site every few hours, and stamping that moment
// onto all four entries would claim the Impressum changes twice a day — the kind
// of lastmod Search stops trusting once it no longer matches what it crawls. The
// home page tracks the availability, because the price calendar is the part of
// it that actually moves.
const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: `${SITE_URL}/`,
    lastModified: BOOKINGS_UPDATED_AT,
    changeFrequency: 'monthly',
    priority: 1,
  },
  {
    url: `${SITE_URL}/impressum/`,
    lastModified: IMPRESSUM_LAST_UPDATED,
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/datenschutz/`,
    lastModified: PRIVACY_LAST_UPDATED,
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/agb/`,
    lastModified: AGB_LAST_UPDATED,
    changeFrequency: 'yearly',
    priority: 0.3,
  },
];

export default sitemap;
