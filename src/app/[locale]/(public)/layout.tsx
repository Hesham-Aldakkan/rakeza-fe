import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

const SUPPORTED_LOCALES = ['ar', 'en'] as const;

type Locale = (typeof SUPPORTED_LOCALES)[number];

function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

interface LayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function PublicLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      {children}
    </div>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }));
}
