import ogImageSrc from '@/assets/images/optimized/ladniy-exterior-1.webp';

export const SITE = {
  title: 'МорошкаЛес',
  tagline: 'Заводские дома из кедра',
  description:
    'МорошкаЛес — заводские модульные и каркасные дома, бани и коммерческие здания из кедра. Камерная сушка до 12%, ЧПУ, под ключ за 10 дней.',
  description_short:
    'МорошкаЛес — заводские дома и бани из кедра под ключ за 10 дней.',
  url: 'https://moroshkales.com',
  author: 'МорошкаЛес',
};

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    inLanguage: 'ru-RU',
    '@id': SITE.url,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: {
      '@type': 'WebSite',
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
    },
  },
};

export const OG = {
  locale: 'ru_RU',
  type: 'website',
  url: SITE.url,
  title: `${SITE.title}: Заводские дома из кедра под ключ`,
  description:
    'Заводские дома, бани и коммерческие здания из кедра. Камерная сушка, ЧПУ, сборка за 10 дней. Честно и на поколения.',
  image: ogImageSrc,
};
