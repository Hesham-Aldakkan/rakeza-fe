import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

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

export default async function AuthLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }));
}
