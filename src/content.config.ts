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
      slogan: z.string().optional(),
      dimensions: z.string().optional(),
      ceilingHeight: z.string().optional(),
      insulation: z.string().optional(),
      windows: z.string().optional(),
      rooms: z.array(z.object({ name: z.string(), area: z.string() })).optional(),
      details: z.string().optional(),
      callout: z.string().optional(),
    }),
});

const blogCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      mainImage: image().optional(),
      mainImageAlt: z.string().optional(),
    }),
});

export const collections = {
  houses: housesCollection,
  blog: blogCollection,
};
