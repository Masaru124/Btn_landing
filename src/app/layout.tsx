import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://bottonificio1928.com'),
  title: 'BOTTONIFICIO 1928 — Atelier & Industrial Button Manufacture | Italian Precision Turning',
  description: 'Three generations of precision button turning. Ecuadorian corozo, smoked water buffalo horn, Australian nacre, lathe-turned brass, and plant-derived bio-resins. Savile Row and Haute Couture standard since 1928.',
  keywords: 'luxury buttons, corozo buttons, horn buttons, mother of pearl buttons, bespoke tailoring trims, button factory, bio-resin buttons, Savile Row buttons',
  openGraph: {
    title: 'BOTTONIFICIO 1928 — Precision Button Manufacture',
    description: 'Fastening the world\'s finest garments since 1928. Certified natural and recycled material atelier.',
    url: 'https://bottonificio1928.com',
    siteName: 'Bottonificio 1928',
    images: [
      {
        url: '/assets/hero_craft.jpg',
        width: 1200,
        height: 630,
        alt: 'Bottonificio 1928 Natural Specimen Buttons'
      }
    ],
    locale: 'en_GB',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
