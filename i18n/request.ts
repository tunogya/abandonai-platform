import {getRequestConfig} from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
  const supportedLocales = ['en'];

  let locale = 'en'; // default fallback
  // Try to get locale from cookies
  const localeFromCookie = (await cookies()).get('locale')?.value;
  if (localeFromCookie) {
    // If in cookies, check if it's supported
    if (supportedLocales.includes(localeFromCookie)) {
      locale = localeFromCookie;
    }
  } else {
    // If not in cookies, try headers
    const acceptLanguage = (await headers()).get('accept-language');
    if (acceptLanguage) {
      for (const lang of acceptLanguage.split(', ')) {
        const langCode = lang.split('-')[0];
        if (supportedLocales.includes(langCode)) {
          locale = langCode;
          break;
        }
      }
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});