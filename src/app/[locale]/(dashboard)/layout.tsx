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

export default async function DashboardLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card dark:bg-slate-900 overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Rakeza</h1>
        </div>
        <nav className="px-4 py-6 space-y-2">
          {/* Navigation items will be added here */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-16 border-b border-border bg-card dark:bg-slate-900 flex items-center px-6">
          {/* Header will contain user menu, theme toggle, etc */}
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }));
}
