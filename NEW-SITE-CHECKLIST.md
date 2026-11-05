# New site checklist

Copy this into your tracker for each club or organization. See `README.md` for details on each step.

## 1. Set up the project
- [ ] Create a private repo in `team-with-aspire` from the template (**Use this template**), named for the club
- [ ] Clone it into `~/claude-projects` and run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Run `npm run dev` and confirm the placeholder site loads at http://localhost:4321

## 2. Make it theirs
- [ ] `src/config/site.ts`: name, tagline, email, phone (or remove it), meeting place and map link, towns, social links, "join elsewhere" links, colors, URL, description
- [ ] Decide which optional sections to keep (`features`: events, gallery, sponsors)
- [ ] `src/content/pages/home.md`: all headings and copy, the About text, benefits, hero image and `heroOverlay` (check text contrast), and the experience options for the join form
- [ ] `src/content/schedule/`: the real regular runs or meetings
- [ ] `src/content/events/`: upcoming events (dates in `YYYY-MM-DD`); delete the samples
- [ ] `src/content/faqs/`, `testimonials/` (real, permitted quotes only), `gallery/` (real photos with real alt text, and permission to publish), `sponsors/` (real logos, with sponsors' OK)
- [ ] Replace images: `public/logo.svg` (update `logo.width`/`height`), `public/favicon.svg`, `public/og-default.png` (1200×630), and the photos in `src/assets/images/`
- [ ] `wrangler.jsonc`: set `name` to the Cloudflare project name
- [ ] Search the project for `Placeholder`, `example.com`, `Sampletown`, `Example Run Club` and clear any leftovers

## 3. Form (Basin)
- [ ] Create the club's form in Basin and put its URL in `.env` as `PUBLIC_BASIN_ENDPOINT`
- [ ] In the Basin dashboard: set the success redirect to `https://CLUB-DOMAIN/thanks` (use `http://localhost:4321/thanks` while testing locally)
- [ ] In the Basin dashboard (**Form → Settings → Spam**): set **allowed domains** to `localhost` for local testing, and add the `workers.dev` address and the live domain (plus `www` if used) before testing there. A missing domain sends every submission to spam.
- [ ] In the Basin dashboard (**Emails**): add the notification recipient(s) and click the verification link Basin emails. No notifications arrive until the address is verified.
- [ ] In the Basin dashboard: connect the Google Sheets integration if wanted
- [ ] Submit a real test with a realistic message and confirm it lands in the main inbox (not Spam), emails arrive, and you are redirected to `/thanks`
- [ ] Keep the 10-minute duplicate checker **on** for real forms. Turn it off only while testing repeated messages, then turn it back on.
- [ ] Add `PUBLIC_BASIN_ENDPOINT` as a build variable in the Cloudflare project and redeploy. Until you do, the live form posts to a placeholder endpoint and Basin reports it as locked.

## 4. Check locally
- [ ] `npm run build` finishes with no errors or warnings
- [ ] Lighthouse 95+ in all four categories (run against `npm run preview`)
- [ ] Mobile menu works with the keyboard; every header link lands on the right section, below the sticky header; layout holds at 320px wide
- [ ] Every phone number is a working `tel:` link

## 5. Deploy
- [ ] Commit and push to `main`
- [ ] Cloudflare: **Workers & Pages → Create → import the repo**; build command `npm run build`, deploy command `npx wrangler deploy`
- [ ] Add `PUBLIC_BASIN_ENDPOINT` as a build variable (Production and Preview)
- [ ] Open the `workers.dev` address and review with the club
- [ ] Turn off `workers.dev` and preview URLs if drafts should not be public

## 6. Launch
- [ ] The club owns their domain; point DNS at Cloudflare
- [ ] Attach the domain in **Settings → Domains & Routes**
- [ ] Set `url` in `src/config/site.ts` to the real domain, then push
- [ ] In Basin: add the live domain to allowed domains, update the redirect to the live `/thanks`, and confirm the duplicate checker is on
- [ ] Re-run Lighthouse on the live site and test the form on the live site
- [ ] Validate structured data (Google Rich Results Test) for the club, the events and the FAQ
- [ ] Submit `https://CLUB-DOMAIN/sitemap-index.xml` in Google Search Console
- [ ] Confirm `/thanks` is `noindex` and not in the sitemap

## 7. Keep it fresh
- [ ] Events dated before today drop off at the next build. Decide who updates the events and how often, and whether to set up a periodic redeploy.
- [ ] Add the club to your tracker: domain, registrar, GitHub repo, Cloudflare project, Basin form, who owns each account, renewal dates
- [ ] Turn on 2FA for any account the club owns that you manage
- [ ] Tell the club how to request changes
