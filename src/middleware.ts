import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localeDetection: true,
});

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
