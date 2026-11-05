# Project guide for Claude

This is Aspire's reusable **One-Page Site Template**: an Astro static one-page site for a local organization such as a run club. It is used as a GitHub template. Each club or organization gets its own repo created from it. It is a sibling of the multi-page `astro-small-business-template`; the two share conventions but are separate repos. Read `README.md` for setup and workflow.

## Commands
- `npm run dev` starts the dev server at http://localhost:4321. Only one dev server runs per project; stop a background one with `npx astro dev stop`.
- `npm run build` must finish with **no errors or warnings**.
- `npm run preview` serves the built site (use this for Lighthouse).

## Core rules
- **Club details live only in `src/config/site.ts` and `src/content/`.** Never hard-code a club name, email, phone, address, town, meeting place or color in a component or page. If a component needs one, read it from `site`.
- **Placeholder content only** in the template. Do not invent real club names, events, members, sponsors, reviews, phone numbers or claims.
- **Ask before adding any dependency.** The project uses only `astro` and `@astrojs/sitemap`. Use `npx` for one-off tools instead of installing them.
- **Plain CSS with tokens.** Design tokens are in `src/styles/global.css`; brand colors come from `site.colors` (injected as `--color-*` by `BaseLayout`). Component-scoped styles are fine. No UI frameworks.
- **No JavaScript** except the mobile menu toggle in `Header.astro`.
- **Fonts are self-hosted** (`src/assets/fonts/`). No external font or script requests.
- **Every image uses Astro's `<Image />`** with width, height and meaningful `alt` (empty `alt=""` only for decorative images).
- **Forms post to Basin** via `site.basinEndpoint` (`PUBLIC_BASIN_ENDPOINT` env var). No server code.

## Content
- Collections (`pages`, `schedule`, `events`, `testimonials`, `faqs`, `gallery`, `sponsors`) are defined in `src/content.config.ts`. Editable copy belongs in `src/content/`, not in components.
- After adding or renaming a schema field, stop the dev server, delete the `.astro` folder, and restart it. Otherwise the dev site keeps using the old schema.

## Quality bar
- WCAG 2.2 AA: contrast, visible focus, keyboard navigation, `prefers-reduced-motion`.
- Lighthouse 95+ in all four categories (the template currently scores 100).
- One H1 per page, logical heading order, unique title and description per page.
- Organization JSON-LD (`SportsClub`, from the config) on every page; `FAQPage` and `Event` JSON-LD on the home page; `/thanks` is `noindex` and excluded from the sitemap.
- Header links are in-page anchors (`/#schedule`, ...) and must land below the sticky header.
- Layouts work from 320px wide up.

## Working agreements
- Show the plan and wait for approval before large changes.
- Commit only when asked. Do not push, rewrite history, or delete files without confirmation.
- Keep template-level changes (components, CSS, structure) in the template repo. Club-specific changes (config, content, images) belong in that club's repo.
- Report honestly: say what was and was not verified.
