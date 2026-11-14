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

## Picking this up on a new computer

Everything needed is in this repo except secrets and local tooling. Claude
Code's own memory notes are per computer and do not travel, so nothing
important lives only there; if it matters, it is in this file, `TODO.md`,
`README.md` or `CLAUDE.md`. Start a new machine like this:

1. Follow "Setting up on a new computer" in `README.md`, then `git pull`.
2. Read `CLAUDE.md`, `TODO.md` and this log, in that order.
3. Day-to-day site and content work needs only Node. Pushing to `main`
   deploys by itself.

Not in the repo, and needed only for infrastructure changes (`infra/`):
- The .NET 10 SDK (`brew install dotnet@10`, then `brew link --force
  dotnet@10`) and the CDK CLI (`npm install -g aws-cdk`).
- AWS credentials for account 722855777909 (`aws configure` with an IAM access
  key). The keys live in a password manager, never in the repo.
- The `/archive/` password. It is set at deploy time with
  `ARCHIVE_PASSWORD=... cdk deploy YesYogaOne-Hosting` and only its hash is
  stored in AWS. Deploying without the same password changes it; ask Trey or
  Sheila for it.

Where things live: code and the deploy pipeline on GitHub; hosting (S3,
CloudFront, certificate) on AWS; DNS and the domain registration on Cloudflare
(`yesyogaone.net`, expires 2028-03-11); the Texas LLC filing on the Secretary
of State portal under Sheila's account; Stripe not set up yet; WordPress at
Flywheel being cancelled; GoDaddy being closed. Dashboards that need a sign-in
(Cloudflare, AWS, GitHub, the state portal) are the account owner's to open;
Claude can read screens but does not type passwords, bank details, tax IDs or
verification codes.

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
- Flywheel/WordPress was left running through launch; see the cleanup entry
  below for the shutdown.
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

## 2026-11-14 (evening) — Business setup, shutdown and the to-do list

Shutting down the old hosting:
- Flywheel's plan (Tiny Plan, $15/month, next bill 2026-11-24) was cancelled
  through Flywheel's cancel form. The form only collects a reason; their
  Billing Team then emails to complete it, with a 30 day notice, so one more
  charge is expected. Confirm the subscription shows as Cancelled. The full
  backup is stored first (see above).
- An unused second Flywheel/WP Engine login was found to be one of three
  owners of an unrelated WP Engine account. Trey removed himself from that
  account (the other owners remain) and emailed Flywheel support, from that
  login's own address, to delete the login and its data. Flywheel has no
  self-service delete: accounts are managed in WP Engine and closed by
  support. Waiting on their reply.
- GoDaddy now holds nothing but old receipts. The account can be closed from
  the afternoon of 2026-11-15 (GoDaddy asks for 24 hours after the last
  product leaves). Closing is irreversible and needs the account owner's own
  click.

Texas LLC (needed before Stripe):
- The old South Dakota LLC YES YOGA ONE, LLC is administratively dissolved and
  its DBA expired, so it cannot be used for payments.
- A new Texas LLC, YesYogaOne, LLC (no spaces, same as the site footer's
  `legalName`), was filed on 2026-11-14 through the Secretary of State's
  SOSPortal, as a new veteran-owned business. Sheila holds a Texas Veterans
  Commission Veteran Verification Letter (valid for entities formed before
  2031-07-20). A 100% veteran-owned new Texas LLC gets the formation filing
  fee and the franchise tax waived for five years. The filing attached the
  letter and Comptroller Form 05-904 and checked the veteran-owned box. Sheila
  is the sole member and owner. Adding any owner without a letter, or any
  change of ownership, would end the exemption, so check before changing it.
- The upload link in the Veterans Commission email is dead. Texas replaced
  SOSDirect and SOSUpload with SOSPortal on 2026-09-29.
- Status: Received, waiting for state approval. Next, in order: EIN from the
  IRS (free), business bank account, assumed name "Yes Yoga One" if wanted
  (the veteran letter waives only the formation fee and franchise tax, not
  this), then Stripe.

Payments decisions:
- Stripe Payment Links, not custom checkout code. The site already shows a
  Book / Pay button for any service with a `stripePaymentLink` in
  `content/services.json`. No keys or server needed, so nothing secret goes in
  the repo.
- Neither Stripe account the family already had can be used: one belongs to a
  different business, the other is a payout-only Express account from a
  marketplace. Sheila needs her own Stripe account under the new LLC, created
  by her (bank, identity and tax details are hers to enter).
- Bookkeeping in Wave (free accounting). Wave's own payments center on
  invoices; no embeddable website buy button was found. Plan: Stripe for
  checkout, Wave for the books, with a monthly Stripe payout import (Zapier or
  a connector later if volume grows).
- Still to build on the site: service cards on the redesign with Book / Pay
  buttons (the redesign shows only the services heading and intro today), and
  a products section if wanted. Prices and durations for all four services are
  still blank, which is why they stay hidden.

Team process:
- `TODO.md` is the shared task list with sections for Trey, for Sheila,
  waiting on others, and ready to build. `CLAUDE.md` tells Claude to read it at
  the start of every session and after every pull, and to ask "build this now,
  or add it to Trey's list?" when a request involves accounts, hosting,
  payments or infrastructure. Sheila's computer can push as of this evening.

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
