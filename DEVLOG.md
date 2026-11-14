# Dev log

Newest first. Add an entry when you finish something notable: what changed,
why, and anything the next person needs to know.

## Working from two computers (read this)

Trey and Sheila both edit this repo with Claude Code on their own machines.
Pushing to `main` deploys the live site, so the code on your machine must
include the other person's latest work before it goes out:

- `git pull --rebase origin main` when you sit down, and again right before
  you push.
- Run `npm run typecheck` and `npm run build` in `site/` after the pull and
  before the push. The GitHub Actions deploy runs both too, and refuses to
  publish if they fail.
- Push often. Small, frequent pushes rarely conflict; a week of local edits
  usually does.
- If you see "rejected: fetch first" on push, that is the other person's
  work. Pull, resolve anything git flags, build, push again. Never force-push.

## 2026-11-14 — Launch day

The redesign went live at https://www.yesyogaone.net, replacing the
WordPress site at Flywheel.

Site changes (commit `e1fa89c`):
- Hero: removed the "Exhale. Peace. Imagine. Euphoria." headline. The logo
  artwork, which already carries the wordmark, is the page's h1.
- Header: a slim sticky bar of centered small-caps links, flush to the top of
  the page (the classic stylesheet's 70px body padding is cancelled under
  `.v3`). No wordmark in the bar; the hero logo right below has it.
- Map hidden on every version behind `showMap: false` in `content/site.json`
  (also a toggle in the Decap CMS config). The Google embed URL stays for
  later. The classic nav drops its "Locate" link while the map is off.
- Classic WordPress port moved from `/old/` to `/archive/` and put behind an
  HTTP Basic auth prompt at CloudFront (any user name; password set at deploy
  time, hash only in AWS). The dev server mirrors the prompt when
  `ARCHIVE_PASSWORD` is set.
- 301 redirects at CloudFront for the old WordPress URLs `/faq` and
  `/testimonials` to the matching sections of the home page.
- Fixed the dev-server hydration warning: `main.tsx` now hydrates only when
  the root element has an element child (the dev template's HTML comment used
  to count as one).
- A beginner-friendly concept (`/v2/`: "Sore back? Stressed out?") written for
  people who know nothing about yoga. Kept for discussion with Sheila as a
  dev-only preview route; it is not prerendered and not in the production
  bundle. A split-screen "v4" layout was tried and discarded.
- Documentation: `CLAUDE.md`, this log and README setup steps for working
  from a second computer. (`.claude/launch.json`, which lets Claude Code start
  the dev server by name, was already in the repo.)

Infra and hosting:
- Hosting stack redeployed twice: first with the archive password gate, then
  with the ACM certificate and the domain names `yesyogaone.net` and
  `www.yesyogaone.net` attached to CloudFront (`E1JC63PHMH3JFX`,
  `d3mhq8iu4z4wna.cloudfront.net`).
- Certificate stack deployed; validated via two CNAMEs added at GoDaddy.
- DNS at GoDaddy: `www` CNAME → CloudFront; bare domain → GoDaddy HTTPS
  forwarding (301) to www. Public resolvers switched within minutes.
- Flywheel/WordPress left running untouched; cancel after about a week.
- Trey's Mac now has the .NET 10 SDK (`brew install dotnet@10`, linked) and
  the CDK CLI (`npm install -g aws-cdk`) for `cdk deploy`.

DNS and registration moved to Trey's Cloudflare account the same afternoon
(separate session): nameservers abdullah/rayne.ns.cloudflare.com, records all
DNS-only, apex as a flattened CNAME to CloudFront, both ACM validation CNAMEs
kept. The domain transferred to Cloudflare Registrar (auto-renew, expires
2028-03-11). The GoDaddy account is empty and will be closed after GoDaddy's
24-hour wait.

Flywheel backup before shutdown: requested Flywheel's full backup of
2026-11-14 03:19 UTC (3 pages, 7 plugins, WP 7.1.4), downloaded as a 78 MB
zip (116 MB unpacked, 2,064 files: `backup.sql` with 38 tables, and
`files/wp-content/` with the `yes_yoga_one` theme, the plugins
what-the-file, contact-form-7, bootstrap-for-contact-form-7,
advanced-custom-fields-pro, acf-theme-code-pro, wp-google-maps and
acuity-online-appointment-scheduling, and 37 uploads). Integrity checked;
SHA-256 `9b11e93b701e4adb41c3ef2fde87602749a2bac8edc01d58814ff3435ef33f4d`.
Stored in a new private, encrypted, versioned S3 bucket
`yesyogaone-backups-722855777909` (us-east-1) at
`flywheel/YesYogaOne-2026-11-14-full-backup.zip`, STANDARD_IA. Not committed
here because the repo is public and the dump contains password hashes. The
wp-admin content export was skipped: its login link points at
www.yesyogaone.net, which now resolves to the new site.

Hosting cost is effectively zero: ~32 MB in S3, CloudFront inside its
always-free tier, certificate free.

## 2026-09-17 to 2026-09-18 — Redesign and hosting

- Scaffolded the static site: Vite + React + TypeScript, prerendered routes,
  content in JSON edited through Decap CMS locally, AWS CDK (C#) for hosting.
- Ported the WordPress pages (home, testimonials, FAQ) pixel-close as the
  "classic" version; archived the original HTML and theme under `archive/`.
- Explored redesigns at `/v2` (editorial) and `/v3` (white + sage, Fraunces
  serif). Chose v3, made it the main site at `/`, moved the classic port to
  `/old/`, deleted the v2 concept. Testimonials became a one-at-a-time
  carousel; the example service cards were removed until Sheila finalizes
  offerings and prices.
- Hosting stack deployed: private S3 bucket, CloudFront with Origin Access
  Control, a CloudFront Function for directory index rewrites. GitHub Actions
  deploys on push to `main` via an OIDC role (no long-lived keys).

## Open items

Live open items are in `TODO.md`, split by person. Longer-term, not urgent:
- Decap CMS in production needs an OAuth gateway (phase 3). Until then content
  is edited in the JSON files, which Claude Code does comfortably.
