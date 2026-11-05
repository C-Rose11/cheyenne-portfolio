# One-Page Site Template (Astro)

A fast, accessible, SEO-ready **one-page** site for a local organization such as a run club, community group or association. Static output, plain CSS, no UI framework, and no JavaScript except the mobile menu toggle.

All content in this repo is **placeholder**. Nothing here is a real organization, event, member, sponsor, phone number or claim.

The page runs top to bottom: hero, about, benefits, weekly schedule, upcoming events, photo gallery, member stories, FAQ, sponsors, and a join form. The header links jump to each section. Two small utility pages exist because the form needs them: `/thanks` (where Basin sends people after they submit) and a 404 page.

## Quick start

```bash
npm install
cp .env.example .env     # then set PUBLIC_BASIN_ENDPOINT
npm run dev              # http://localhost:4321
npm run build            # static site in dist/
npm run preview          # serve dist/ locally
```

## Using this as a template for a new club

1. Create the new repo from this one (GitHub: **Use this template**), or copy the folder.
2. Edit **`src/config/site.ts`**: name, tagline, email, optional phone, meeting place, towns, social links, "join elsewhere" links, site URL, description, brand colors, and which optional sections are on.
3. Edit the files in **`src/content/`** (see below).
4. Replace the logo (`public/logo.svg`), favicon (`public/favicon.svg`), social image (`public/og-default.png`, 1200×630) and the placeholder photos in `src/assets/images/`.
5. Set `PUBLIC_BASIN_ENDPOINT` (local `.env` and Cloudflare).
6. Set `"name"` in `wrangler.jsonc` to the Cloudflare project name.
7. Search the project for `Placeholder`, `example.com`, `Sampletown` and `Example Run Club` to make sure nothing was left behind.

The full step-by-step list is in [`NEW-SITE-CHECKLIST.md`](NEW-SITE-CHECKLIST.md).

Club details live **only** in `src/config/site.ts` and `src/content/`. Components never hard-code them.

### Optional sections

In `src/config/site.ts`, the `features` block turns **events**, **gallery** and **sponsors** on or off. Turning one off removes the section, its header link and its structured data from the build. Hero, about, schedule, FAQ and join are always on.

### Content files (`src/content/`)

| Folder | What it controls | Notes |
| --- | --- | --- |
| `pages/home.md` | All headings and copy for the page, the About text (the markdown body), benefits, hero image and `heroOverlay`, and the experience options in the join form | `thanks.md` and `404.md` cover the two utility pages. |
| `schedule/*.json` | Regular runs: title, day, time, optional location, pace and description, `order` | Location defaults to the meeting place in `site.ts`. |
| `events/*.json` | One-off events: title, `date` (like `2026-12-05`), optional time, location, description and link | See "Events" below. |
| `gallery/*.json` | Photos: `image`, `alt`, `order` | Put the image in `src/assets/images/`. Every photo needs real alt text. |
| `sponsors/*.json` | Sponsor `name`, optional `url`, `logo`, `order` | Logos should be about 2:1, around 400×200. |
| `testimonials/*.json` | First name, quote, optional detail, `order` | Real, permitted quotes only. |
| `faqs/*.md` | Question (frontmatter) + answer (body), `order` | FAQPage structured data is generated from these. |

Schemas are in `src/content.config.ts`. Icon names for benefits are in `src/components/Icon.astro`.

### Events

Events dated **before today are left out when the site builds**. The site is static, so an event stays visible until the next build after its date. To refresh, push any change (or trigger a redeploy in Cloudflare). Add upcoming events as new JSON files, and delete old ones when you like. Each upcoming event also gets `Event` structured data.

### Hero image

In `src/content/pages/home.md`: `heroImage` sets the background photo (remove the line for a text-only hero), `heroImageAlt` is empty by default because the photo is decorative, and `heroOverlay` (0 to 1) sets the strength of the white wash that keeps the text readable. Raise it for busy or dark photos, lower it to show more image, and check text contrast after any change. A dark photo needs a dark wash with light text, which is a CSS change in `src/pages/index.astro`.

If you add or rename a field in `src/content.config.ts` and the dev site doesn't pick it up, stop the dev server, delete the `.astro` folder, and restart it.

### Images

Photos go in `src/assets/images/` and are referenced from content files, so Astro's `<Image />` optimizes them (WebP, responsive sizes) and sets width and height. Use landscape 3:2 photos at least 1200px wide for the gallery and about image. The logo, favicon and share image live in `public/` and are not processed.

## Project structure

```
src/
  config/site.ts          club details, optional sections, brand colors
  content/                editable copy and data (collections)
  components/             Header, Footer, JoinForm, SEO, OrgSchema, Icon
  layouts/BaseLayout.astro
  pages/                  index (the whole site), thanks, 404, robots.txt
  styles/global.css       design tokens + base styles
  assets/                 self-hosted font (Inter variable, SIL OFL) and images
```

Brand colors from the config are injected as CSS custom properties (`--color-primary`, `--color-accent`, ...) by `BaseLayout`. Keep text/background pairs at WCAG AA contrast when you change them.

## Join form (Basin)

The form posts straight to the Basin endpoint with plain HTML, so it works without JavaScript. It includes a hidden `_gotcha` honeypot field and uses native browser validation. The fields are `name`, `email`, `phone`, `experience`, `message` and `_gotcha`. You don't build a form in Basin: create one only to get its endpoint URL.

Set up in the **Basin dashboard** (not in this code):

- **Redirect after submission:** set the form's success redirect to `https://YOUR-DOMAIN/thanks` (`http://localhost:4321/thanks` while testing locally).
- **Allowed domains** (**Form → Settings → Spam**): list every domain the form is posted from: `localhost` for local testing, the `workers.dev` address if you test there, and the live domain (plus `www` if used). If a domain is missing, Basin flags every submission from it as spam.
- **Email notifications** (**Emails** tab): add the recipient and click the verification link Basin sends. Nothing is delivered until the address is verified, and spam-flagged submissions never send email.
- **Duplicate checker:** keep Basin's 10-minute duplicate check on for real forms. Turn it off only while testing repeated messages.
- **Google Sheets integration:** connect it under the form's Integrations tab.

The endpoint in `.env` only affects your local site. The deployed site gets it from the `PUBLIC_BASIN_ENDPOINT` build variable in Cloudflare; until that is set, the live form posts to a placeholder and Basin reports it as locked.

Troubleshooting: if a submission lands in Basin's Spam tab, open it and read the reason. A message like "Source domain ... not in allowed domains" means the allowed domains list needs that domain.

## Deploy to Cloudflare

1. Push the repo to GitHub and import it in the Cloudflare dashboard (**Workers & Pages → Create → import a Git repository**).
2. Build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy` (the default)
   - **Production branch:** `main`
3. Set `"name"` in **`wrangler.jsonc`** to the Cloudflare project name. `wrangler.jsonc` tells Cloudflare to serve the built `dist` folder as plain static files, so **no Astro adapter is needed**; do not add `@astrojs/cloudflare`. `public/_headers` sets long-term caching for the hashed `/_astro/*` files.
4. Under **Settings → Variables**, add `PUBLIC_BASIN_ENDPOINT` (build variable, for Production and Preview). It is read at build time, so redeploy after changing it.
   The repo includes an `.nvmrc` (Node 22) because Astro needs Node 22.23.4 or newer. Cloudflare reads it; if a build fails with a Node version error, set a `NODE_VERSION` variable (for example `22`) in the project instead.
5. Set `url` in `src/config/site.ts` to the final domain before launch. It drives canonical URLs, the sitemap, `robots.txt` and structured data.
6. Attach the custom domain under the project's **Settings → Domains & Routes**. Note that `workers.dev` and preview URLs are public by default; turn them off in the Cloudflare settings if a draft should not be reachable.

If Cloudflare ever opens a pull request that adds `@astrojs/cloudflare`, bindings or changes `astro.config.mjs`, review it carefully. This site does not need them.

## SEO notes

- A unique title and description (from `src/content/pages/home.md`) and one H1.
- `SportsClub` structured data from the config (change `schemaType` to `Organization` or something more specific if it fits), `Event` structured data for upcoming events, and `FAQPage` structured data for the FAQ.
- `sitemap-index.xml` is generated at build time and excludes `/thanks`. `robots.txt` points to it. `/thanks` and the 404 page are `noindex`.
- After launch, validate with Google's Rich Results Test and submit the sitemap in Search Console.

## Working on this project (VS Code + Claude)

Git is the handoff between your edits and Claude's. Both edit the same folder on disk; commits keep the work from colliding.

1. Keep `npm run dev` running. It reloads the browser for edits from either side.
2. Before asking Claude for a change, save your files and commit (or at least check `git status`).
3. After Claude makes changes, review them in VS Code's Source Control panel. Commit what you like, discard what you don't.
4. Make your own edits in VS Code any time, but not in a file Claude is currently working on; the last save wins. Claude reads what is saved on disk, not unsaved editor tabs.
5. Commit often, and use a branch (`git checkout -b my-change`) for bigger changes.

Content, copy and config edits (`src/config/site.ts`, `src/content/`) are fastest to make yourself. Layout, styling and new components are good to hand to Claude.
