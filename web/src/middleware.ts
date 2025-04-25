import createMiddleware from 'next-intl/middleware';
import { localePrefix } from './navigation';
import { locales } from './config/site';

export default createMiddleware({
  locales,
  localePrefix,
  defaultLocale: 'en'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/', // Match root for potential redirection
    '/(en)/:path*', // Match only English paths
    '/((?!_next|_vercel|.*\\..*).*)' // Exclude static files, etc.
  ]
};
