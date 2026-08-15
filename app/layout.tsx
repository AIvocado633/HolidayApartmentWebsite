import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PROPERTY_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/site';

const PAGE_TITLE = `${PROPERTY_NAME} | Urlaub in der Rhön`;
const OG_IMAGE_URL = `${SITE_URL}/og.jpg`;

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

// Every URL below is written out in full rather than left relative. Next resolves
// a relative path against metadataBase with `new URL()`, and a leading slash
// discards the path segment — so "/og.jpg" would resolve to the domain root and
// drop the /HolidayApartmentWebsite basePath, pointing crawlers and WhatsApp at
// a 404.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: PAGE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    'Ferienwohnung',
    'Rhön',
    'Urlaub in der Natur',
    'Ferienwohnung Zum Biebertal',
    'Kleinsassen',
    'Hofbieber',
    'Souterrain',
  ],
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'de_DE',
    siteName: PROPERTY_NAME,
    url: `${SITE_URL}/`,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Blick auf die Rhöner Landschaft mit bewaldeten Hügeln',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps): React.JSX.Element => {
  return (
    <html
      lang="de"
      className={`${playfairDisplay.variable} ${plusJakartaSans.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
