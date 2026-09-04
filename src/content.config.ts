// https://docs.astro.build/en/guides/content-collections/#defining-collections

import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const housesCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/houses',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      area: z.string(),
      type: z.string(),
      bedrooms: z.string(),
      features: z.string(),
      mainImage: image(),
      mainImageAlt: z.string(),
    }),
});

export const collections = {
  houses: housesCollection,
};
