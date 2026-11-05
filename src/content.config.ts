import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Editable page copy. `home.md` holds the whole one-page site's headings and text;
 * `thanks.md` and `404.md` cover the two small utility pages.
 * The markdown body of home.md is the About section's text.
 */
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(), // <title> (site name is appended automatically, except on the home page)
      description: z.string(), // meta description
      heading: z.string(), // the page's single H1
      intro: z.string().optional(),
      // About image
      image: image().optional(),
      imageAlt: z.string().optional(),
      // Hero background. Decorative by default (empty alt); set heroImageAlt if the photo carries meaning.
      heroImage: image().optional(),
      heroImageAlt: z.string().default(''),
      // White wash over the hero image, 0 (none) to 1 (opaque). Raise it if text is hard to read.
      heroOverlay: z.number().min(0).max(1).default(0.78),
      benefits: z
        .array(z.object({ title: z.string(), text: z.string(), icon: z.string() }))
        .optional(),
      /** Options for the "running experience" menu in the join form. */
      joinExperience: z.array(z.string()).optional(),
      sections: z.record(z.string(), z.string()).optional(), // small named strings (headings, button labels)
    }),
});

/** Regular weekly/monthly runs shown in the schedule table. */
const schedule = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/schedule' }),
  schema: z.object({
    title: z.string(),
    day: z.string(), // e.g. "Tuesday"
    time: z.string(), // e.g. "6:00 PM"
    location: z.string().optional(), // falls back to the meeting place in site.ts
    pace: z.string().optional(), // e.g. "All paces"
    description: z.string().optional(),
    order: z.number().default(0),
  }),
});

/** One-off upcoming events. Events dated before today are left out at build time. */
const events = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(), // e.g. 2026-12-05
    time: z.string().optional(), // display text, e.g. "8:00 AM"
    location: z.string().optional(),
    description: z.string().optional(),
    link: z.string().url().optional(), // registration or details page
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonials' }),
  schema: z.object({
    firstName: z.string(),
    quote: z.string(),
    detail: z.string().optional(), // e.g. "Member since 2024"
    order: z.number().default(0),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    order: z.number().default(0),
  }),
});

/** Photo gallery. Every image needs real alt text. */
const gallery = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      image: image(),
      alt: z.string(),
      order: z.number().default(0),
    }),
});

/** Sponsor logos shown in a strip near the bottom of the page. */
const sponsors = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/sponsors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      url: z.string().url().optional(),
      logo: image(),
      order: z.number().default(0),
    }),
});

export const collections = { pages, schedule, events, testimonials, faqs, gallery, sponsors };
