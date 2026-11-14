# Yes Yoga One — notes for Claude Code

This repo is the website for Yes Yoga One (Sheila Norman, Ayurvedic Yoga
Therapist). Two people work on it from different computers, each with Claude
Code: Trey (built it) and Sheila (owns the content). Read `DEVLOG.md` for the
history and `README.md` for setup.

## Start of every session: read TODO.md

`TODO.md` is the shared to-do list for Trey and Sheila. At the start of every
session, and again after every pull that brings in new commits, read it and
tell the person you are working with what is on their list, then what is under
"Waiting on others". Ask who they are if it is not obvious. Delete items when
they are done. When a task needs the other person, add it to their list,
commit, pull with rebase, and push so it appears on their computer. Never put
secrets, tracking numbers, tax IDs or addresses in it; the repo is public.

## The one rule that matters most: sync before you push

Both computers push to `main`, and every push to `main` that touches `site/**`
or `content/**` deploys straight to the live site. So:

1. **Start every session** with `git pull --rebase origin main` so you are
   working on the latest code, not yesterday's.
2. **Before every push**, pull again (`git pull --rebase origin main`), make
   sure `npm run typecheck` and `npm run build` still pass in `site/`, then
   push. Never push with `--force`.
3. If a pull reports a conflict, resolve it with the person's own words in
   mind (content wins over styling), run the build again, then push.
4. Commit small and often with a message that says what changed in plain
   English. Pulling frequently is what lets both people's work combine.

Work on `main` directly; this project does not use branches or pull requests.

## Trey's to-do list

`TREY-TODO.md` is the list of things Sheila needs Trey to do. When a request
comes up in conversation (a new feature, a technical change, anything involving
accounts, hosting, payments or infrastructure), **ask: "Should I build this
now, or add it to Trey's list?"** If it goes on the list, add a clear
checkbox item with today's date. When Trey finishes one, move it to "Done".

**If you are working with Trey** (git user `normthethird`, or he says he is
Trey), then right after the session-start `git pull --rebase origin main`, read
`TREY-TODO.md` and show him everything under "To do", especially anything
added since his last pull (check `git log -p` on that file). Ask which he
wants to tackle. If the list is empty, say so in one line.

## Where things live

| Path | What |
| --- | --- |
| `site/` | The website: Vite + React + TypeScript. `npm run dev` here. |
| `site/src/pages/V3Page.tsx` + `site/src/v3.css` | The live design at `/`. |
| `site/src/pages/HomePage.tsx`, `FaqPage.tsx`, `TestimonialsPage.tsx` | The old WordPress look, served at `/archive/` behind a password. |
| `site/src/pages/V2Page.tsx` + `site/src/v2.css` | A beginner-friendly concept, **dev server only** (`/v2/`), never deployed. See `previewRoutes` in `site/src/routes.tsx`. |
| `site/src/routes.tsx` | The list of pages. Every public route is prerendered to its own `index.html` at build time. |
| `content/*.json` | All the words on the site. Edit these to change copy, services, FAQ, testimonials. |
| `site/public/images/` | Images. The logo is `logo.jpg`; Sheila's photo is `sheila.jpg`. |
| `infra/` | AWS CDK in C#: S3 bucket, CloudFront, certificate, deploy role. Rarely touched. |
| `.github/workflows/deploy.yml` | Builds and publishes the site on push to `main`. |
| `DEVLOG.md` | What was done and why, by date. Add an entry when you finish something notable. |

## Editing content (the usual job)

- Copy lives in `content/site.json`, `about.json`, `services.json`,
  `faq.json`, `testimonials.json`. Markdown is allowed in long text fields.
- Services stay hidden until `active` is `true` and price/duration are
  filled in. A Stripe Payment Link URL adds a "Book / Pay" button.
- The map is hidden while `showMap` is `false` in `content/site.json`; the
  embed URL is kept there for when it comes back.
- The contact form emails `site.email` through the visitor's mail app until a
  Formspree form ID is set in `content/site.json`.
- After editing content: `npm run dev` in `site/` to check it, commit, pull,
  push. The live site updates a few minutes later.

## Running locally

```bash
cd site
npm install        # first time only
npm run dev        # http://localhost:5173
npm run typecheck  # must pass before pushing
npm run build      # must pass before pushing; output in site/dist
```

`.claude/launch.json` is committed so Claude Code's browser preview can start
the dev server by name ("site").

## Things not to do

- Never commit the archive password or any secret. The `/archive/` password is
  given on the command line when the hosting stack is deployed
  (`ARCHIVE_PASSWORD=... cdk deploy YesYogaOne-Hosting`) and only its hash
  reaches AWS. The repo is public.
- Don't add routes to `publicRoutes` in `site/src/routes.tsx` casually: every
  entry there becomes a public page on the next push. Experiments go in
  `previewRoutes` (dev only).
- Don't run `cdk deploy` unless the infra changed; it needs the .NET 10 SDK
  and the CDK CLI (see README) and AWS credentials for the account.
- Don't touch DNS or the Flywheel/WordPress account from a coding session;
  those are handled deliberately (see DEVLOG).

## Checking your work

Open the dev server in the browser preview and look at `/` on desktop and
phone widths. For content, read the page text back rather than trusting the
JSON. The deploy workflow runs `npm run typecheck` and `npm run build`; if
either fails, nothing is published, so run them locally first.
