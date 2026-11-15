# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

A small company website (four pages) for **CelyMary Greener Precast Blocks**, an early-stage startup making precast blocks with a much lower carbon footprint than conventional concrete blocks.

- **Audience:** architects, engineers, builders, real estate developers, potential investors and collaboration partners.
- **Problem it solves:** these people have no single place to learn what the company offers and get in touch.

## Stack

- Vue 3 (Composition API) + TypeScript
- Vite
- Tailwind CSS
- Vitest for tests
- ESLint + Prettier
- DevContainer with Docker / docker compose
- Vercel: static build to `dist/`, configured in `vercel.json`.
- Pages (US-08): each page is a real HTML file at the project root (`index.html`, `products.html`, `about.html`, `contact.html`, and `privacy.html` from US-10), listed in `src/pages.ts` and built by Vite in multi-page mode (`appType: 'mpa'`). Vercel serves them at clean addresses (`/products`) with `cleanUrls` and `trailingSlash: false`. There is no router and **no rewrite**: never add `rewrites`, `routes` or a catch-all that sends unknown addresses to a page, which caused the routing bug fixed in v0.1.1. Unknown addresses get a real 404 status with the page in `404.html`; `vite.config.ts` does the same in development and preview
- One Vercel serverless function, `api/contact.ts` (`POST /api/contact`), sends the contact form to the company inbox through [Resend](https://resend.com). In development, `vite.config.ts` serves the same route, so the form works with `npm run dev`

## Working rules

### Git workflow

- `main` is production and `develop` is integration.
- Each feature goes in a `feature/<name>` branch created from `develop`.
- After the user validates a feature, Claude merges it into `develop` with `git merge --no-ff feature/<name>`, then pushes `develop`. No pull request is needed.
- **Never commit directly to `main`.**
- Commit or push only when the user asks.

### Commits

- Use the Conventional Commits format: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- Example: `feat(products): add products section with planned range`.

### Development environment

- The development environment is a DevContainer. **All commands run through Docker**, never on the host.
- From the host, run commands as `docker compose run --rm app <command>`. In the DevContainer terminal, run them directly.
- The Vite dev server must listen on `0.0.0.0:5173` so the host can reach it.

### Secrets

- Never write secrets in the code. Use environment variables.
- `.env` is in `.gitignore`. `.env.example` is versioned and lists every variable with placeholder values only.
- Variables that start with `VITE_` are bundled into public client code. They must never hold secrets.
- Server-only secrets such as `RESEND_API_KEY` have no `VITE_` prefix and are read only by server code (`api/`, `src/server/`). They are set in `.env` locally and in the Vercel project settings. Never log them.

### Confidentiality (public repository)

- **Never describe the block materials, recipes, formulations or production process** anywhere: code, comments, docs, commit messages, PR descriptions, test fixtures or placeholder text.
- The website describes benefits only: **lower carbon**, **recycled industrial materials**, **local production**.
- If a request would reveal any of the above, stop and ask the user first.

### Honesty

- The company is early-stage. **Do not invent** statistics, carbon-saving figures, certifications, testimonials, customer names, partner logos or team members.
- Use only facts the user gives you. Where content is missing, use an obvious placeholder (for example `[TODO: team member name]`) and tell the user.
- Mark every product as _in development_.

## Conventions

- Components: `<script setup lang="ts">`, PascalCase file names, one component per page section in `src/components/sections/` (for example `HeroSection.vue`). `App.vue` chooses the sections for each page; the page comes from `data-page` in its HTML file.
- Adding a page: add its HTML file (copy one, change `data-page`, the English `<title>` and the description; keep the favicon link), add it to `src/pages.ts`, give it a menu name in all four language files, and choose its sections in `App.vue`. Each page has exactly one `<h1>`: a section that opens a page takes `heading-level="h1"`.
- Reusable small pieces go in `src/components/ui/`.
- Brand (US-10): the logo is the founder's mark "Leaf on a block" in `src/components/ui/BrandLogo.vue`, with a colour version and a version for dark backgrounds. Keep its shapes and colours exactly; `public/favicon.svg` is the simplified version. The brand colours are Tailwind theme colours in `src/style.css` (`brand`, `brand-leaf`, `brand-dark`).
- Privacy notice (US-10): `/privacy`, with its texts in the `privacy` part of each language file. It must describe only what the site really does. **Whenever a change affects visitor data** (form fields, a new service, logging, cookies or browser storage, analytics), update the privacy notice in all four languages in the same change, and tell the user. The whole notice, English included, is a draft for legal review until the user says otherwise.
- Server code goes in `src/server/` and must never be imported by website code. Files in `api/` stay thin entry points that call it.
- Vercel runs `api/` as native ES modules without the `@/` alias. So `src/server/` and any website code it imports (such as `src/utils/contactForm.ts` and `src/content/`) use relative imports ending in `.js`. `tsconfig.api.json` checks this.
- Keep site text and data (products, roadmap, team) in `src/content/`, not hard-coded in templates. There is one file per language in `src/content/locales/` (`en.ts`, `es.ts`, `ti.ts`, `am.ts`), each a complete `SiteContent` (types in `src/content/types.ts`). Components get the current language's texts from `useLanguage()` in `src/composables/`.
- Languages (US-05):
  - English is the default and the reference.
  - Every new or changed text goes into all four language files, with the same meaning, the same ids, anchors and icons, and the same confidentiality and honesty rules. `tests/locales.spec.ts` checks that every language has every text.
  - A translation that hasn't been reviewed by a speaker is a draft: add a `DRAFT – awaiting review` note at the top of the file and set `draft: true` in `src/content/languages.ts`. Only the user decides when a draft is reviewed.
  - The brand name and people's names are not translated. On the Tigrinya and Amharic pages they are written in Ge'ez script: the company name ("ሰሊሜሪ ሓምለዋይ ብሎኬት" / "ሰሊሜሪ አረንጓዴ ብሎኬት", short name "ሰሊሜሪ") in the header, footer and text, and the team members' names ("ሰላም በርሀ በየነ", "ሜሮን ገብረስላሴ ታደሰ"). The Latin "CelyMary Greener Precast Blocks" stays in the hero title (with the Ge'ez line under it) and the browser tab title. In the privacy notice, the responsible person is "ሰላም በርሀ በየነ (Selam Berhe Beyene)": Ge'ez with the official Latin name in brackets. English and Spanish keep Latin letters.
  - The contact form sends ids (visitor type, product) and the language code, never translated labels. The email the company receives is always in English (`src/content/emailTemplate.ts`, `src/server/contactEmail.ts`) and names the visitor's language.
- Style with Tailwind utility classes. Don't add UI libraries or other dependencies without asking.
- Mobile-first, responsive layout. Use semantic HTML and accessible markup: labelled form fields, alt text, keyboard navigation and enough color contrast.
- Tests: Vitest + Vue Test Utils, in `tests/`, named `<Component>.spec.ts`. Import app code through the `@/` alias (for example `@/App.vue`).
- Project documentation goes in `docs/`.
- Before a change is done, run all checks through Docker:
  ```bash
  docker compose run --rm app sh -c "npm run lint && npm run format:check && npm run test && npm run build"
  ```

## User stories

### MVP

- **US-01 — Hero and "Our solution":** headline, short value proposition, call to action to contact. "Our solution" covers lower carbon, recycled industrial materials and local production.
- **US-02 — Products:** the planned range: standard building blocks, solar panel ballast blocks, paving blocks, retaining wall and landscaping blocks, and kerbs and edging. Each is labelled **"in development"**. **No technical specs.**
- **US-03 — For customers / investors / partners:** what we offer each group, the company's current stage and roadmap, and the team.
- **US-04 — Contact form:** fields for name, email, visitor type, product of interest and message. In the MVP, it opened a pre-filled email (`mailto:`) to the address in `VITE_CONTACT_EMAIL`. US-09 replaced that.

### Built after the MVP

- **US-09 — Form backend:** the contact form sends the message from the website itself through `/api/contact`, with no email app, to the address in `VITE_CONTACT_EMAIL`. It keeps the fields and validation, and shows a clear success or error message. The "Or write to us directly at…" link stays as a fallback. Spam protection: a hidden trap field, a minimum fill time, and server-side checks.
- **US-08 — Separate pages:** four pages with their own addresses and browser tab titles: Home `/` (hero and "Our solution"), Products `/products`, About us `/about` (work with us, roadmap and team) and Contact `/contact` (the contact form). A menu on every page, with the language switcher; on phones it collapses into a menu button. The current page is marked in the menu. The hero buttons open the About us and Contact pages. A skip link jumps past the menu. Unknown addresses show a "page not found" page with a real 404 status, in all four languages.
- **US-10 — Brand, footer and privacy notice:** the founder's logo next to the company name in the header (short name on phones), with an accessible label, and the favicon on every page. A footer on every page, in all four languages, with the logo, the company name, the page links, the company email, a link to the privacy notice and "© 2026 CelyMary Greener Precast Blocks"; no social media links yet. A privacy notice at `/privacy` in all four languages, in plain words, describing only what the site really does: who is responsible, what the contact form collects and why, the services that process it (Vercel, Resend, Gmail), the legal basis, retention, the visitor's rights and the AEPD. A line under the contact form links to it.
- **US-05 — Languages:** the site in English, Spanish, Tigrinya (ትግርኛ) and Amharic (አማርኛ), so partners in Spain and Ethiopia can read it. A language switcher on every screen size shows each language in its own name and script. Every text is available in all four languages, including the contact form's labels, validation, success and error messages. English stays the default. The visitor's choice is remembered, and the page's `lang` attribute follows it. Ethiopic script uses Noto Sans Ethiopic, served with the site. The form works in every language, and the email the company receives stays in English.

### Backlog

- **US-06 — News and milestones.**
- **US-07 — Carbon savings calculator.** Do not build it without real, user-provided figures (see Honesty).
