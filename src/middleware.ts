import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  // Persisted via the NEXT_LOCALE cookie automatically by next-intl.
});

export const config = {
  // Skip API routes, Next internals, and static files.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
