import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // https://docs.astro.build/en/guides/images/#authorizing-remote-images
  site: 'https://moroshka-les.ru',
  image: {
    domains: ['images.unsplash.com', 'ui-avatars.com'],
  },
  // i18n: {
  //   defaultLocale: "en",
  //   locales: ["en", "fr"],
  //   fallback: {
  //     fr: "en",
  //   },
  //   routing: {
  //     prefixDefaultLocale: false,
  //   },
  // },
  prefetch: true,
  integrations: [sitemap()],
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
