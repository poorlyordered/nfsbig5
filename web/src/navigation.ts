import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from './config/site';

export const localePrefix = 'always';  // Changed from 'as-needed' to 'always'

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
