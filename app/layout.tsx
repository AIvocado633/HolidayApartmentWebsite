import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

export const metadata: Metadata = {
  title: 'Ferienwohnung XYZ | Urlaub in der Rhön',
  description:
    'Gemütliche Souterrainwohnung in einem kleinen Dorf mitten in der Rhön. Natur pur, frische Luft und echte Ruhe – euer Zuhause auf Zeit.',
  keywords: [
    'Ferienwohnung',
    'Rhön',
    'Urlaub in der Natur',
    'Ferienwohnung Deutschland',
    'Rhönblick',
    'Souterrain',
  ],
  openGraph: {
    title: 'Ferienwohnung Rhönblick | Urlaub in der Rhön',
    description:
      'Gemütliche Souterrainwohnung in einem kleinen Dorf mitten in der Rhön. Natur pur, frische Luft und echte Ruhe.',
    type: 'website',
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
