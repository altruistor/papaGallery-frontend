import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'ru';
  return {
    locale,
    messages: (await import(`../lang/${locale}.json`)).default,
  };
});