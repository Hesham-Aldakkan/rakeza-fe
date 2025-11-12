import type { Metadata } from 'next';
import { getConfig } from '@/lib/config';

const config = getConfig();

export const metadata: Metadata = {
  title: {
    default: config.site.name,
    template: `%s | ${config.site.name}`,
  },
  description: config.site.description,
  metadataBase: new URL(config.site.baseUrl),
  openGraph: {
    title: config.site.name,
    description: config.site.description,
    url: config.site.baseUrl,
    siteName: config.site.name,
    locale: 'ar_SA',
    type: 'website',
    images: config.site.ogImageUrl ? [{ url: config.site.ogImageUrl }] : [],
  },
  twitter: {
    card: 'summary_large_image',
    title: config.site.name,
    description: config.site.description,
    images: config.site.ogImageUrl ? [config.site.ogImageUrl] : [],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
