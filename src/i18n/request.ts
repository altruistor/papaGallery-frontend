import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../lang/${locale ?? 'ru'}.json`)).default,
  locale: locale ?? 'ru'
}));