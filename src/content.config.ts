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
      // Photo shown in the green frame beside the hero text. Leave out to show an empty frame.
      heroPhoto: image().optional(),
      heroPhotoAlt: z.string().default(''), // describe the photo, e.g. "Portrait of [name] at her desk"
      benefits: z
        .array(z.object({ title: z.string(), text: z.string(), icon: z.string() }))
        .optional(),
      /** Options for the "running experience" menu in the join form. */
      joinExperience: z.array(z.string()).optional(),
      /** Headline numbers above the paid search cards, e.g. { value: "$X", label: "Total ad spend managed" } */
      adsStats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
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

/**
 * Portfolio projects for the "Selected work" section. Mark one as `featured`
 * to show it large at the top; the rest show as cards, sorted by `order`.
 */
const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(), // client or project name
      image: image(), // screenshot or mockup
      imageAlt: z.string(), // describe what the screenshot shows
      featured: z.boolean().default(false),
      result: z.string().optional(), // one-line outcome, shown on the featured project
      stack: z.array(z.string()).default([]), // tools used, e.g. ["Astro", "CSS"]
      type: z.string().optional(), // kind of project, e.g. "Online store"
      year: z.coerce.string().optional(),
      role: z.string().optional(), // e.g. "Design and build"
      url: z.string().url().optional(), // live site
      order: z.number().default(0),

      // Case study page (/case-studies/<file name>/). All optional; empty parts are left out.
      client: z.string().optional(),
      timeline: z.string().optional(), // e.g. "6 weeks, spring 2026"
      problem: z.array(z.string()).default([]), // paragraphs
      approach: z.array(z.string()).default([]), // paragraphs
      desktopScreens: z.array(z.object({ image: image(), alt: z.string() })).default([]),
      mobileScreens: z.array(z.object({ image: image(), alt: z.string() })).default([]),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]), // e.g. { "value": "+40%", "label": "sign-ups" }
      testimonial: z
        .object({ quote: z.string(), name: z.string(), detail: z.string().optional() })
        .optional(),
    }),
});

/**
 * Google Ads case studies: cards in the "Paid search results" section and a page each
 * at /case-studies/ads/<file name>/. Keep client details anonymous unless you have permission.
 */
const ads = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/ads' }),
  schema: ({ image }) =>
    z.object({
      client: z.string(), // client or industry name, e.g. "Regional plumbing company"
      headline: z.string(), // page H1, e.g. "Cut cost per lead 35% for a plumbing business"
      industry: z.string(), // e.g. "Local service"
      campaignTypes: z.string(), // e.g. "Search + Performance Max"
      monthlyBudget: z.string().optional(),
      duration: z.string().optional(),
      result: z.string(), // big number on the card, e.g. "-35% cost per lead"
      resultDetail: z.string().optional(), // small line under it, e.g. "40 to 70 leads per month"
      metrics: z
        .array(z.object({ label: z.string(), before: z.string(), after: z.string(), change: z.string().optional() }))
        .default([]), // before and after, e.g. CTR, CPC, conversion rate, CPA or ROAS
      challenge: z.array(z.string()).default([]), // paragraphs: what was wrong with the account
      strategy: z.array(z.string()).default([]), // paragraphs: structure, bidding, keywords, audiences
      chart: z.object({ image: image(), alt: z.string() }).optional(), // performance over time, with key changes marked
      adExample: z
        .object({ displayUrl: z.string(), headlines: z.array(z.string()), description: z.string() })
        .optional(), // recreated ad, not a live ad
      dashboard: z.object({ image: image(), alt: z.string() }).optional(), // blur client names first
      keyChanges: z.array(z.string()).default([]),
      testimonial: z
        .object({ quote: z.string(), name: z.string(), detail: z.string().optional() })
        .optional(),
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

export const collections = { pages, schedule, events, testimonials, faqs, projects, ads, gallery, sponsors };
