# CelyMary Greener Precast Blocks — Website

## What it is

CelyMary Greener Precast Blocks is an early-stage company planning lower-carbon building blocks, and this small website shows what it wants to make and how to contact it.

**The problem:** the people who might work with the company have no single place to learn what it offers or how to reach it.

**Who it is for:** architects, engineers, builders, real estate developers, potential investors and collaboration partners.

**The minimum moment of value:** in one visit, someone understands what the company plans to make and what stage it is at, then sends it a message.

## Features

### MVP user stories

| Story | What it covers                                                                         |
| ----- | -------------------------------------------------------------------------------------- |
| US-01 | Hero and "Our solution": lower carbon, recycled industrial materials, local production |
| US-02 | Products: the planned range, each labelled "in development", with no technical specs   |
| US-03 | For customers, investors and partners; current stage and roadmap; team                 |
| US-04 | Contact form that opens a pre-filled email                                             |

Each MVP story answers a question a visitor needs answered: what is this, what will you make, what does it mean for me and who is behind it, and how do I reach you? Without any one of them, the visit can't end in an informed message. The backlog adds reach, depth or convenience, but the site works without it.

### Built after the MVP

| Story | What it covers                                                                       |
| ----- | ------------------------------------------------------------------------------------ |
| US-09 | Form backend: the contact form sends the message from the website, with no email app |
| US-05 | Languages: English, Spanish, Tigrinya (ትግርኛ) and Amharic (አማርኛ)                      |
| US-08 | Separate pages: Home, Products, About us and Contact, with a menu                    |
| US-10 | Brand, footer and privacy notice: logo, favicon, footer and a /privacy page          |

### What the live site has

- **Brand:** the company logo ("Leaf on a block") next to the name in the header, and as the browser tab icon.
- **Footer:** on every page, with the logo, the page links, the company email, a link to the privacy notice and the copyright line.
- **Privacy notice:** at `/privacy`, in plain words, describing what the contact form collects and who processes it. A line under the contact form links to it.
- **Pages:** Home, Products, About us and Contact, each with its own address, and a menu on every page that collapses into a menu button on phones.
- **Hero:** the company name, tagline and buttons that open the About us and Contact pages.
- **Our solution:** the three benefits.
- **Products:** five planned product types with icons, all marked "In development".
- **Work with us:** what the company offers customers, investors and partners.
- **Roadmap:** the current concept stage and the next steps, without invented dates.
- **Team:** the founder and co-founder.
- **Contact:** a validated form that sends the message from the website, with clear success and error messages and basic spam protection, plus a direct email link.
- **Languages:** a language switcher at the top of the page offers English, Español, ትግርኛ and አማርኛ. The site remembers the visitor's choice.

### Backlog

| Story | What it covers                                    |
| ----- | ------------------------------------------------- |
| US-06 | News and milestones                               |
| US-07 | Carbon savings calculator, only with real figures |

## How to run it

**Live site:** <https://celymary-precast-blocks.vercel.app>

### Requirements

- [Docker](https://www.docker.com/) with docker compose
- [VS Code](https://code.visualstudio.com/) with the **Dev Containers** extension (recommended)

You don't need Node.js on your machine. Everything runs inside the container.

### Environment variables

Configuration is read from environment variables. `.env.example` lists every variable and is checked into the repository. Your own `.env` is git-ignored and must never be committed.

| Variable             | Purpose                                                                           |
| -------------------- | --------------------------------------------------------------------------------- |
| `VITE_CONTACT_EMAIL` | Company inbox: receives the contact form and is shown as the direct address       |
| `RESEND_API_KEY`     | **Secret.** [Resend](https://resend.com) API key the server uses to send the form |
| `CONTACT_FROM_EMAIL` | Sender shown on contact form emails                                               |
| `DEV_PORT`           | Port on your computer for the dev server (default 5173)                           |
| `PREVIEW_PORT`       | Port on your computer for the preview server (default 4173)                       |

`DEV_PORT` and `PREVIEW_PORT` are only read by docker compose, not by the website.

Any variable that starts with `VITE_` ends up in the public JavaScript bundle. Never put secrets in one. `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are read only by the server code, so they never reach the browser.

Without a verified domain, Resend only sends from its test address (`onboarding@resend.dev`, the default in `.env.example`) and only delivers to the address the Resend account was registered with. That address must be the same as `VITE_CONTACT_EMAIL`.

### Contact form

The form posts to `/api/contact`, a Vercel function ([api/contact.ts](api/contact.ts)) that checks the message again and sends it to `VITE_CONTACT_EMAIL` through Resend. The logic lives in [src/server/contactHandler.ts](src/server/contactHandler.ts).

- **Spam protection:** a hidden field that people never see but many bots fill in, and a minimum time to fill in the form. Messages caught by either are dropped without telling the sender. The server also re-checks every field and limits the request size.
- **Local testing:** `npm run dev` answers `/api/contact` with the same code, reading the variables from `.env`, so you don't need the Vercel CLI. With a real `RESEND_API_KEY` in `.env`, the form sends real emails. `npm run preview` serves only the static site, so the form can't send from there.
- **Errors:** the server logs why a message couldn't be sent (a missing variable, or Resend's reason), never the API key. On Vercel, these appear in the project's function logs.

### Pages and addresses

| Address       | Page           | What it shows                     |
| ------------- | -------------- | --------------------------------- |
| `/`           | Home           | Hero and "Our solution"           |
| `/products`   | Products       | The planned products              |
| `/about`      | About us       | Work with us, roadmap and team    |
| `/contact`    | Contact        | The contact form                  |
| `/privacy`    | Privacy notice | How the site handles visitor data |
| anything else | Page not found | A 404 status and a link to Home   |

- **How it works:** each page is a real HTML file at the project root (`index.html`, `products.html`, `about.html`, `contact.html`, `404.html`), listed in [src/pages.ts](src/pages.ts). Vite builds them all, and they share one script. The `data-page` attribute in each file tells the script which sections to show.
- **On Vercel:** `cleanUrls` serves `products.html` at `/products` and redirects `/products.html` there. `trailingSlash: false` redirects `/products/` to `/products`. There are no rewrites, so an unknown address gets a real 404 status, and Vercel shows `404.html`. Don't add a catch-all rewrite: that was the routing bug fixed in v0.1.1.
- **Locally:** `npm run dev` and `npm run preview` serve the same addresses, and answer unknown addresses with the 404 page and a 404 status.
- **Menu:** every page has the menu and the language switcher. On phones the menu collapses into a menu button. A "Skip to main content" link appears first when using the keyboard.
- **Titles:** each page has its own browser tab title. The HTML file has the English title, and the page switches it to the visitor's language once it loads.

### Privacy notice

The privacy notice at `/privacy` describes only what the code does. Its texts are in the `privacy` part of each file in [src/content/locales/](src/content/locales/).

- **What the contact form collects:** name, email, visitor type, product (optional), message and the visitor's language. The two spam checks are not stored or emailed.
- **Who processes it:** Vercel (hosting and the `/api/contact` function), Resend (email delivery) and the company's Gmail inbox. The site has no database, cookies, analytics or third-party scripts. The only browser storage is the language choice.
- **Keep it true:** any change that affects visitor data (a new form field, a new service, logging, cookies or analytics) must update the notice in all four languages.
- **Status:** the whole notice, English included, is a draft for legal review.

### Languages

The site is available in English (the default), Spanish, Tigrinya and Amharic.

- **Where the texts are:** one file per language in [src/content/locales/](src/content/locales/): `en.ts`, `es.ts`, `ti.ts` and `am.ts`. English is the reference. A change to any text goes into all four files, and a test fails if a language is missing a text.
- **Review:** the Spanish, Tigrinya and Amharic texts have been reviewed by the founder. A new or changed translation that hasn't been reviewed yet is a draft: it gets a `DRAFT – awaiting review` note at the top of its file and `draft: true` in [src/content/languages.ts](src/content/languages.ts). The privacy notice stays a draft for legal review in every language.
- **The visitor's choice:** it is saved in the browser (`localStorage`), and the page's `lang` attribute changes with it. If the browser blocks storage, the site still switches language for that visit.
- **Ethiopic script:** Tigrinya and Amharic use Noto Sans Ethiopic, from the `@fontsource-variable/noto-sans-ethiopic` package. The font is served with the site, so no third-party font service is involved.
- **Contact form:** the form sends the visitor type and product as ids, plus the visitor's language. The email you receive is always in English and has a `Language:` line, for example `Language: Spanish (Español)`. The visitor's message arrives exactly as they wrote it.

### Start with Docker

#### Option A: VS Code DevContainer (recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/Selam1627/CelyMary-Greener-Precast-Blocks.git
   cd CelyMary-Greener-Precast-Blocks
   ```
2. Copy the example environment file and fill in the values:
   ```bash
   cp .env.example .env
   ```
3. Open the folder in VS Code and choose **Dev Containers: Reopen in Container**. The first time, this builds the image and runs `npm install`.
4. In the container terminal:
   ```bash
   npm run dev
   ```
5. Open <http://localhost:5173>.

#### Option B: docker compose only

```bash
cp .env.example .env
docker compose run --rm app npm install
docker compose up
```

Then open <http://localhost:5173>. Stop the server with `Ctrl+C`.

If another app already uses port 5173, set `DEV_PORT` in `.env` (for example `DEV_PORT=5180`) and open that port instead.

To run any other command, use `docker compose run --rm app <command>`.

### Run the tests

In the DevContainer terminal:

```bash
npm run test
```

With docker compose only:

```bash
docker compose run --rm app npm run test
```

### Scripts

| Command                | What it does                            |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the dev server on port 5173       |
| `npm run build`        | Type-check and build to `dist/`         |
| `npm run preview`      | Serve the production build on port 4173 |
| `npm run test`         | Run the Vitest tests once               |
| `npm run test:watch`   | Run the tests again on every change     |
| `npm run type-check`   | Check TypeScript types                  |
| `npm run lint`         | Run ESLint                              |
| `npm run lint:fix`     | Run ESLint and fix what it can          |
| `npm run format`       | Format all files with Prettier          |
| `npm run format:check` | Check formatting without changing files |

### Folder structure

```
.
├── .devcontainer/
│   └── devcontainer.json      # VS Code DevContainer config
├── api/
│   └── contact.ts             # Vercel function: sends the contact form
├── docs/                      # Project documentation
├── public/                    # Static files copied as-is (favicon.svg)
├── src/
│   ├── assets/                # Images processed by Vite
│   ├── components/
│   │   ├── sections/          # One component per page section
│   │   └── ui/                # Header and menu, language switcher, icons
│   ├── composables/           # Shared state (the current language)
│   ├── content/               # Site text and data, by language
│   │   └── locales/           # One file per language: en, es, ti, am
│   ├── server/                # Server-only code (contact form handler)
│   ├── utils/                 # Plain TypeScript helpers (contact form rules)
│   ├── App.vue                # Page layout: header, then the page's sections
│   ├── pages.ts               # The pages and their addresses
│   ├── env.d.ts               # Types for environment variables
│   ├── main.ts                # App entry point
│   └── style.css              # Tailwind entry point
├── tests/                     # Vitest tests (*.spec.ts)
├── .env.example               # Environment variables (no real values)
├── docker-compose.yml         # Dev container service "app"
├── Dockerfile                 # Dev image (Node.js 24)
├── index.html                 # Home page (also products, about, contact, 404)
├── vercel.json                # Vercel build settings
├── vite.config.ts
├── vitest.config.ts
├── tsconfig*.json             # TypeScript configs (app, api, node, vitest)
├── eslint.config.js
├── .prettierrc.json
├── CLAUDE.md                  # Guidance for Claude Code
└── README.md
```

### Deployment

Vercel builds the site with `npm run build` and serves the static files from `dist/`. Each page is its own HTML file, served at a clean address such as `/products`. There is no router and no rewrite, so unknown addresses return a real 404 with the site's 404 page (see [Pages and addresses](#pages-and-addresses)). Vercel also turns each file in `api/` into a serverless function, so `/api/contact` is the only server route.

Set `VITE_CONTACT_EMAIL`, `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` in the Vercel project settings (**Settings → Environment Variables**) for Production and Preview. Redeploy after changing them.

### Contributing

- `main` is production and `develop` is integration.
- Create each feature in a `feature/<name>` branch from `develop`.
- Once a feature is validated, merge it into `develop` with `git merge --no-ff feature/<name>` and push `develop`. No pull request is needed.
- Never commit directly to `main`.
- Write commit messages in the [Conventional Commits](https://www.conventionalcommits.org/) format (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).

## How it was built with AI

**The agent:** Claude Code in VS Code only, with no extra skills.

**Stack:** Vue 3, TypeScript, Vite, Tailwind CSS, Vitest, ESLint, Prettier, a Docker DevContainer, and Vercel for hosting.

### The cycle with the agent

| Step                 | What I did                                                                                       | What the agent did                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Repository           | Created the GitHub repository                                                                    | Renamed a mistaken branch and set up the project                                          |
| `CLAUDE.md`          | Set the rules and reviewed the file                                                              | Drafted it                                                                                |
| Feature branches     | Named each branch and wrote the acceptance criteria                                              | Created the branches and built the features                                               |
| Plan first           | Approved or changed each plan                                                                    | Proposed the plan before coding                                                           |
| Tests                | Asked for normal, edge and error cases, and said not to change a test just to make it pass       | Wrote and ran the tests                                                                   |
| Browser check        | Checked each feature in the browser and asked for changes, such as redrawing two icons           | Made the changes; it could not see the rendered page                                      |
| Merge into `develop` | Validated the work and approved the commands                                                     | Showed the commands, ran them and reported conflicts                                      |
| Release into `main`  | Ran the v0.1.0 merge; gave each v0.1.1 merge command and pushed it                               | Audited `develop` and wrote the commands; ran my v0.1.1 merge commands                    |
| Deploy on Vercel     | Set up the project and its environment variable                                                  | Prepared `vercel.json`                                                                    |
| Validation           | Tested the routing fix on the protected preview and the form's email step on my phone and laptop | Compared production with a local build, found the routing problem and wrote the checklist |

### CLAUDE.md

`CLAUDE.md` holds the project description, stack, working rules, conventions and user stories, so the agent follows the same rules in every session. The rules cover the Git workflow, commit format, running commands through Docker, secrets, confidentiality and honesty.

### The real prompt 3.2

This was the project brief, which set the confidentiality and honesty rules before any code existed. It uses the company's earlier name:

```text
We are starting a new project in this folder. The project is: a one-page company website for "Cely Precast Greener Blocks", an early-stage startup that makes precast blocks with a much lower carbon footprint than conventional concrete blocks. It is for architects, engineers, builders, real estate developers, potential investors and collaboration partners, and it solves the problem that they have no single place to learn what the company offers and get in touch.

Stack: Vue 3 + TypeScript + Vite + Tailwind CSS, Vitest for tests, ESLint + Prettier. Development in a DevContainer with Docker / docker compose. Deployed on Vercel (static build to dist/, with SPA fallback).

Create:
1. A README.md with the project description, how to run it, and the folder structure.
2. A CLAUDE.md with the description, the stack, the conventions, and these working rules:
- Git workflow: main is production and develop is integration; each feature goes in a feature/<name> branch created from develop. Never commit directly to main.
- Commits use the Conventional Commits format (feat, fix, docs, refactor, test, chore).
- The development environment is a DevContainer; all commands run through Docker.
- Never write secrets in the code: environment variables, .env in .gitignore, and a versioned .env.example.
- Confidentiality: the repository is public. Never describe the block materials, recipes, formulations or production process anywhere (code, docs, commits). The website only describes benefits: lower carbon, recycled industrial materials, local production.
- Honesty: the company is early-stage. No invented statistics, fake testimonials or partner logos.
- User stories. MVP: US-01 Hero and "Our solution"; US-02 Products (planned range: standard building blocks, solar panel ballast blocks, paving blocks, retaining wall and landscaping blocks, kerbs and edging, labeled "in development", no technical specs); US-03 For customers / investors / partners, stage and roadmap, team; US-04 Contact form (name, email, visitor type, product of interest, message; opens an email). Backlog: US-05 Spanish version; US-06 News and milestones; US-07 Carbon savings calculator.

Don't write any application code yet. Show me both files before committing. Then commit them to develop and push develop.
```

These rules shaped later work: products have no technical specs, the roadmap has no invented dates, and the calculator waits for real figures. The same prompt also asked for an SPA fallback, which turned out to be the cause of the routing bug fixed in v0.1.1. A brief guides the agent, including where the brief is wrong.

### What went well

- Seeing a plan before any code let me change the text and scope early.
- The tests covered normal cases, edge cases and expected errors, and all 158 pass.
- The check before the first release found no secrets in the Git history and no material or process details in the repository.
- The agent's review of the live site found the routing bug, and I tested the fix on a preview before releasing it.

### What was hard

- **Docker and WSL on Windows:** Docker Desktop could not start because the Virtual Machine Platform was not enabled in Windows. I enabled the Windows features and installed a pending Windows update, and after a restart it worked.
- **Port 5173 already in use:** another project's container was using it, so the host ports became configurable with `DEV_PORT` and `PREVIEW_PORT`.
- **Email link on my laptop:** nothing opened, because no email app is set up there.
- **First email in spam:** the test message first went to spam, so I added a Gmail filter.
- **Vercel and the repository:** Vercel didn't see the repository at first, because its GitHub app had no access to it. I gave it access in the GitHub settings.
- **Routing bug:** every missing path returned the home page with a 200 status. Removing the catch-all rewrite fixed it in v0.1.1.

## Status and next steps

**How far I got:** the MVP is live, with four follow-up releases. From the backlog, only US-09 (form backend) is built, released in v0.1.4. The company is still at the concept stage, and every product is in development.

**Releases** (Git tags on `main`; v0.1.0 and v0.1.1 were tagged afterwards):

| Version | Commit     | What changed                                                                              |
| ------- | ---------- | ----------------------------------------------------------------------------------------- |
| v0.1.0  | `58d858c`  | MVP                                                                                       |
| v0.1.1  | `55ae23b`  | Routing fix: unknown paths now return a 404 instead of the home page                      |
| v0.1.2  | `160fb66`  | README in the course's 5 sections                                                         |
| v0.1.3  | tag v0.1.3 | Releases update: this table, the `package.json` version and the next steps                |
| v0.1.4  | tag v0.1.4 | Form backend (US-09): the contact form sends messages from the website, with no email app |

**What works:**

- The live site has all the MVP sections, and unknown paths return a 404.
- The form sends messages from the website itself. In local testing and on a Vercel preview, the message arrived in the company inbox.
- When sending fails, the form shows a clear error message. I checked this locally with the API key missing.
- All 207 tests in 13 files pass.

**What doesn't work:**

- A message can land in spam, as the first one did. Without its own domain, the form sends from Resend's test address, which makes this more likely.
- The site has no `robots.txt`.

**The natural next step:** send a test message from the live site on a phone and on a laptop, to confirm the form works in production.

After that:

1. Once the company has its own domain, verify it in Resend so the form sends from the company's address.
2. Add a `robots.txt`.
3. Review the Vercel plan when the company starts operating, because the free Hobby plan is for non-commercial use.
4. Work through the rest of the backlog, adding the calculator only once real figures exist.
