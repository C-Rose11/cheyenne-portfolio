/**
 * Single source of truth for everything specific to one club or organization.
 * A new site should only need this file plus the files in src/content/
 * (and replacement images/logo). All values below are PLACEHOLDERS.
 */

export interface SocialLink {
  platform: string;
  url: string;
}

export interface JoinLink {
  label: string;
  url: string;
}

/**
 * Optional sections. Set one to false and its section, its nav link and its
 * structured data disappear from the build.
 */
const features = {
  events: true,
  work: true,
  ads: true,
  gallery: true,
  sponsors: true,
};

export const site = {
  name: 'MS Digital Marketing',
  tagline: 'Everyone runs. Everyone belongs.',

  /** schema.org type for the JSON-LD, e.g. "SportsClub", "Organization", "NGO" */
  schemaType: 'SportsClub',

  /** Lives in /public. Width/height are the intrinsic size of the file. */
  logo: { src: '/logo.svg', width: 180, height: 48 },

  email: 'hello@example.com',
  /** Optional. Remove the whole object to hide it everywhere. */
  phone: { display: '(555) 010-0100', tel: '+15550100100' } as { display: string; tel: string } | undefined,

  /** Where the group meets. The address feeds the footer, the join section and structured data. */
  meeting: {
    name: 'Example Park Pavilion',
    street: '123 Example Street',
    city: 'Sampletown',
    region: 'ST',
    postalCode: '00000',
    country: 'US',
    notes: 'Look for the banner by the pavilion.',
    /** Link to a map pin (no embedded map, so no third-party scripts). */
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Example+Park+Pavilion',
  },

  /** Towns the group draws from. First town is the primary location. */
  area: ['Sampletown', 'Exampleville', 'Demo Heights'],

  social: [
    { platform: 'Instagram', url: 'https://www.instagram.com/example' },
    { platform: 'Facebook', url: 'https://www.facebook.com/example' },
  ] as SocialLink[],

  /** Other places to join, such as a Strava club or Facebook group. Remove or leave empty to hide. */
  joinLinks: [
    { label: 'Join our Strava club', url: 'https://www.strava.com/clubs/example' },
    { label: 'Join our Facebook group', url: 'https://www.facebook.com/groups/example' },
  ] as JoinLink[],

  features,

  /** Header links jump to sections on the page. Labels and order are editable. */
  nav: [
    ...(features.work ? [{ label: 'Websites', href: '/#work' }] : []),
    ...(features.ads ? [{ label: 'Google Ads', href: '/#ads' }] : []),
    { label: 'About', href: '/#about' },
    ...(features.work || features.ads ? [{ label: 'Case studies', href: '/case-studies/' }] : []),
  ],

  /**
   * Basin form endpoint. Set PUBLIC_BASIN_ENDPOINT in .env (local) and as a build
   * variable in Cloudflare (production). The fallback is a non-working placeholder.
   */
  basinEndpoint: import.meta.env?.PUBLIC_BASIN_ENDPOINT || 'https://usebasin.com/f/your-form-id',

  /** Production URL, no trailing slash. Drives canonical URLs, the sitemap and structured data. */
  url: 'https://example.com',
  description:
    'MS Digital Marketing: website development and Google Ads strategy by Cheyenne Rosenboro.',
  /** Lives in /public. 1200x630 recommended. */
  shareImage: '/og-default.png',

  /**
   * Brand colors feed the CSS tokens in global.css (injected by BaseLayout).
   * Keep text-on-color pairs at WCAG AA contrast (4.5:1):
   *  - `primary` and `accentDark` must work behind white text; `accent` takes ink text
   *  - `ink` and `muted` must work on white and on `surface`
   */
  colors: {
    primary: '#5c202e', // maroon: headings, links, maroon sections, header and footer
    primaryDark: '#5c202e', // maroon: footer
    accent: '#5c202e', // maroon: main buttons (cream text, 10.8:1)
    accentDark: '#6b6b24', // green: button hover, labels, focus ring on cream (4.9:1)
    highlight: '#6b6b24', // green: green sections, card stripes, icon tiles, icons
    ink: '#000000', // body text on cream
    muted: '#5c202e', // secondary text on cream
    surface: '#f7eee5', // cream: text on maroon and green, logo tiles
    border: '#5c202e33', // maroon at 20%: hairline borders
    background: '#f7eee5', // cream: page, cream sections and cards
  },
};

export type SiteConfig = typeof site;

/** Absolute URL for a path, based on the configured site URL. */
export const absoluteUrl = (path = '/') => new URL(path, site.url).toString();
