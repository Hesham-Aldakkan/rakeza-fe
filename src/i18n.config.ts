import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (
      await (locale === 'ar'
        ? import('./messages/ar.json')
        : import('./messages/en.json'))
    ).default,
  };
});
