# nv-photo

Single-page photography portfolio for **Надія Волкова** (Nadiia Volkova Photography). Static site built with Astro 7 and Tailwind CSS v4, deployed to Cloudflare Workers. Two languages: Ukrainian at `/` and English at `/en/`, switched with the UA/EN control in the nav.

## Getting started

```bash
npm install
npm run dev      # dev server
npm run build    # production build to dist/ (~1s)
npm run preview  # serve the build locally
```

There is no lint, test, or typecheck script — `npm run build` is the only check. Run it after every change and read the tail of the output for errors.

## Deploy

```bash
npm run build && npm run deploy
```

Deploy only when asked. `wrangler deploy` publishes `src/worker.js` along with the static `dist/` assets.

## How it works

The Worker serves the static build for every route except `POST /api/contact`, which validates the inquiry and hands it to `sendEmail()` in `src/worker.js`. **Email delivery is intentionally stubbed** — it only logs the inquiry. To go live, implement a provider (e.g. Resend) inside `sendEmail()` and add the API key as a Worker variable; no front-end changes needed.

## Project layout

```
src/pages/index.astro      Ukrainian page ("/")
src/pages/en/index.astro   English page ("/en/")
src/layouts/Base.astro     <head>, fonts, reveal-on-scroll script
src/layouts/Site.astro     section composition (Nav, main, Footer)
src/components/*.astro     one component per section
src/i18n/uk.json           all Ukrainian copy
src/i18n/en.json           all English copy (same key tree)
src/i18n/index.ts          dictionaries + tFor / resolveLocale / pathFor
src/styles/global.css      Tailwind v4 entry: tokens, base, state classes
src/worker.js              static assets + POST /api/contact
public/images/             hero, about, gallery/{slug}-600.jpg + -1400.jpg
wrangler.toml              Cloudflare Workers config
```

Sections, in order: Hero, About, Services, Portfolio (with lightbox), Statement (testimonial), Contact, Footer.

## Editing content

- **Text** lives in `src/i18n/uk.json` and `src/i18n/en.json`. The two files must have identical key trees — a translation is a value-only edit. Never hardcode user-visible strings in components; resolve them with `const t = tFor(Astro.currentLocale)`. Headings with `<br>`/`<em>` are HTML strings rendered via `set:html`.
- **Gallery items** are referenced by slug. Adding one = a row in the `gallery` array in `Portfolio.astro` + a `portfolio.gallery.{slug}` title in both locale files + two image files at `public/images/gallery/{slug}-600.jpg` and `{slug}-1400.jpg`.
- **Design tokens** (colors, fonts, easing, animations) live in `@theme` inside `src/styles/global.css`. There is no `tailwind.config.js`.
- **New animatable sections** must be added to the `.reveal` selector list in `src/layouts/Base.astro` or they won't animate.

## Conventions

- Tailwind v4 only; JS-toggled states (`.nav-scrolled`, `.open`, `.lightbox`, …) are plain unlayered CSS in `global.css`, not Tailwind variants.
- Spacing rhythm: `px-[clamp(1.25rem,4vw,3rem)] py-[clamp(5rem,12vw,10rem)]`, container `mx-auto max-w-[1240px]`.
- Responsive breakpoints use `max-md:` / `max-[480px]:` (max-width form), not `md:`.
- Icons are inline SVG — no icon packages.
- The contact form's honeypot field `website` must stay; the provider stub in `sendEmail()` is intentional.

See `AGENTS.md` for the full contributor rules.
