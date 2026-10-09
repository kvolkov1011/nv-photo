# AGENTS.md — nv-photo

Instructions for AI agents working in this repo. Read this before searching so you don't re-derive the project structure each session.

## What this is

Static single-page photography portfolio ("Elena Voss Photography") built with **Astro 7 + Tailwind CSS v4**, deployed to **Cloudflare Pages** (with one Pages Function). One commit history, no CI, no tests.

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` |
| Verify changes | `npm run build` (~1s — this is the only check) |
| Preview build | `npm run preview` |
| Deploy | `npm run deploy` (wrangler pages deploy dist) |

- **No lint, no test, no typecheck script exists.** `npx astro check` prompts interactively to install `@astrojs/check` — do not run it unattended. If asked to add typechecking, install `@astrojs/check` + `typescript` and add a `"check"` script.
- Build failures surface as Astro/Vite errors in `npm run build` output; always run it after editing and read the tail of the output.
- Platform is Windows (`win32`, bash shell). Use `npx.cmd` when invoking npx in scripts/config.

## Layout

```
src/pages/index.astro      the ONLY page; imports sections in order
src/layouts/Base.astro     <head>, Google Fonts, global reveal-on-scroll script
src/components/*.astro     one component per page section (Hero, About, Services,
                           Portfolio, Testimonial, Contact, Nav, Footer)
src/i18n/en.json           ALL user-facing copy (default/only locale)
src/i18n/index.ts          exports `t` (active dictionary) and `locale`
src/styles/global.css      Tailwind v4 entry: @import + @theme tokens + base + JS-state classes
public/images/             hero.jpg, about.jpg, gallery/{slug}-600.jpg + {slug}-1400.jpg
functions/api/contact.js   Cloudflare Pages Function — POST /api/contact (email STUBBED)
refs/                      gitignored reference design (temporary) — skip unless asked
```

Components are plain markup + frontmatter data arrays + their own `<script>` block (Astro bundles and TypeScript-checks these). There is no JS framework, no client router, no state library.

## Conventions (follow them, don't invent new ones)

1. **Tailwind v4 only** — there is no `tailwind.config.js`. Design tokens live in `src/styles/global.css` under `@theme`: colors `midnight/paper/stone/parchment/champagne`, fonts `font-display`/`font-body`, easing `ease-ref`, animations `animate-fade-up/hero-zoom/scroll-line`. Add new tokens there.
2. **JS-toggled state classes are plain CSS in `global.css`, unlayered** (so they beat utilities): `.nav-scrolled`, `.open`, `.active`, `.reveal`, `.lightbox`, `.section-label`, `.filter-btn`, `.form-select`, `.hero-overlay`. Style new toggle states the same way — don't express them as Tailwind variants.
3. **Scroll-reveal requires a selector update.** `Base.astro` adds `.reveal` to a hardcoded selector list (`src/layouts/Base.astro:41`). New animatable sections/headings must be appended there or they simply won't animate.
4. **Layout rhythm**: sections use `px-[clamp(1.25rem,4vw,3rem)] py-[clamp(5rem,12vw,10rem)]` and `mx-auto max-w-[1240px]`; headings use `font-display text-[clamp(2rem,4vw,3rem)] font-light`; each section starts with `<p class="section-label">`. Match existing components instead of writing new spacing systems.
5. **Responsive**: mobile breakpoints are written as `max-md:` / `max-[480px]:` / `max-[768px]:` (max-width form), not `md:` min-width form. Keep that direction.
6. **All copy lives in `src/i18n/en.json`** — components import `{ t }` from `../i18n` and never hardcode user-visible text (labels, headings, aria-labels, form/JS status strings). Headings/paragraphs containing `<br>` or `<em>` are stored as HTML strings and rendered with `set:html`. Non-text data (slugs, categories, layout `kind`, service keys, icons, hrefs) stays in component frontmatter; a second locale = new `src/i18n/{lang}.json` + entry in `dictionaries` in `src/i18n/index.ts`. Names/brand names, email and phone links are intentionally not translated.
7. **Images**: gallery items are referenced by slug; files must exist as `public/images/gallery/{slug}-600.jpg` and `-1400.jpg` (both, for srcset). Adding a gallery item = a row in the `gallery` array in `Portfolio.astro` + a `portfolio.gallery.{slug}` title in `en.json` + two image files. Never hardcode full filenames.
8. **Contact form**: honeypot field `website` must stay; front end posts JSON to `/api/contact`. Provider integration is intentionally stubbed in `sendEmail()` — don't "fix" it unless asked.
9. **Accessibility patterns already in place**: `aria-label` on icon buttons, `aria-hidden` on decorative markup, `role="status"` on form feedback, `prefers-reduced-motion` override in `global.css`. Preserve them.

## Efficiency rules

- **Don't read**: `refs/`, `node_modules/`, `dist/`, `.wrangler/`, `.astro/`, `package-lock.json`, `public/images/` binaries. They are build artifacts or temporary references.
- **Don't re-explore structure** — the layout section above is authoritative; open only the specific file you need to edit.
- **Don't add dependencies** for things Tailwind/Astro already do (no CSS-in-JS, no lodash, no icon packages — icons are inline SVG).
- **Don't create new config files** (`tailwind.config`, eslint, prettier, etc.) unless explicitly requested; the project intentionally has none.
- **Edit in place**: one page, section-per-component. Adding a section = new component + import line in `src/pages/index.astro` (+ reveal selector in `Base.astro`).
- **Copy lives in `src/i18n/en.json`**; structural data (gallery slugs/kinds, icons, hrefs) lives in component frontmatter arrays — edit data there, not by duplicating markup.
- After any change: `npm run build`, then report the result in one line.
- Deploy only when explicitly asked.
