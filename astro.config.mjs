import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site as siteConfig } from './src/config/site.ts';

export default defineConfig({
  site: siteConfig.url,
  output: 'static',
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/thanks') })],
});
