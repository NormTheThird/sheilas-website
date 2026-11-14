# Yes Yoga One

Static site for [Yes Yoga One](https://www.yesyogaone.net) — Sheila Norman, Ayurvedic Yoga
Therapist and yin yoga teacher (YesYogaOne, LLC). Replaces the old WordPress/Flywheel site
with a prerendered React site on S3 + CloudFront for near-zero monthly cost.

## Layout

| Path        | What                                                                 |
| ----------- | -------------------------------------------------------------------- |
| `/site`     | Vite + React + TypeScript app; Decap CMS admin at `/admin`           |
| `/content`  | JSON content edited by Sheila via Decap (services, bio, FAQ, etc.)   |
| `/infra`    | AWS CDK (C#) — `CertStack`, `HostingStack`; later `ApiStack`         |
| `/archive`  | Snapshot of the old WordPress pages/theme, and original full-size images |
| `/.github`  | Actions workflow: build → S3 sync → CloudFront invalidation (OIDC)   |

The site is live at https://www.yesyogaone.net (since 2026-11-14). `CLAUDE.md`
is the guide Claude Code reads on every machine; `DEVLOG.md` is the history.

## Setting up on a new computer

Both Trey and Sheila work on this repo with Claude Code. One-time setup:

1. Install [Git](https://git-scm.com/download/mac), [Node.js 22 or newer](https://nodejs.org)
   and the [Claude desktop app](https://claude.ai/download) (its Code tab runs
   Claude Code), or `npm install -g @anthropic-ai/claude-code` for the terminal.
2. Get push access: the GitHub account you use must be a collaborator on
   `NormTheThird/sheilas-website` (Trey adds it under the repo's Settings →
   Collaborators). Sign in to GitHub in Git once, for example with
   `gh auth login` or the macOS keychain prompt on the first push.
3. Tell Git who you are:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```
4. Clone and install:
   ```bash
   git clone https://github.com/NormTheThird/sheilas-website.git
   cd sheilas-website/site
   npm install
   ```
5. Open the `sheilas-website` folder in Claude Code and ask it what you want
   changed. It reads `CLAUDE.md` and knows the rules, including pulling the
   other person's changes before pushing.

Only Trey's machine needs the deploy tooling (`infra/`): the .NET 10 SDK
(`brew install dotnet@10`, then `brew link --force dotnet@10`) and the CDK CLI
(`npm install -g aws-cdk`) plus AWS credentials. Day-to-day site and content
work never needs them; pushing to `main` deploys by itself.

## Local development

```bash
cd site
npm install
npm run dev        # dev server at http://localhost:5173
npm run typecheck  # run before pushing
npm run build      # static output in site/dist (prerendered HTML per route)
npm run cms        # decap-server, for editing content at /admin locally
```

`/v2/` on the dev server is a beginner-friendly concept kept for discussion;
it is never deployed (see `previewRoutes` in `site/src/routes.tsx`).

Routes: `/` (the redesign) plus the archived classic site at `/archive/`,
`/archive/testimonials/` and `/archive/faq/` — each prerendered to its own
`index.html`, no client-side router, so S3/CloudFront serves them without rewrites
(a CloudFront Function maps `/faq/` → `/faq/index.html`).

### The archive password

`/archive/` is behind a browser password prompt (HTTP Basic auth, any user name).
It is a curtain, not a vault — it just keeps casual visitors and search engines off
the old site. The password is never committed; it is supplied when the hosting
stack is deployed and only its SHA-256 hash ends up in the CloudFront Function:

```bash
cd infra
ARCHIVE_PASSWORD='the-password' cdk deploy YesYogaOne-Hosting
```

To change it, deploy again with a new value. To try the prompt locally:

```bash
ARCHIVE_PASSWORD='the-password' npm run dev
```

Without the variable the dev server leaves `/archive/` open.

## Content editing (Sheila)

All copy lives in `/content/*.json` and is edited through Decap CMS — a form UI, no
code. Locally: `npm run cms` + `npm run dev`, then open `http://localhost:5173/admin/`.
Production GitHub-backed auth is phase 3 (needs a small OAuth gateway — see
`site/public/admin/config.yml`).

- Services stay hidden until `active` is switched on and price/duration are filled in.
- A service with a Stripe Payment Link URL gets a "Book / Pay" button automatically.
- The bio still mentions Sioux Falls; updating it for Corpus Christi is a single
  field edit (`content/about.json` → `bio`).

## Deploying

**The site:** push to `main`. The GitHub Actions workflow builds, syncs
`site/dist` to S3 and invalidates CloudFront on every push touching `site/**`
or `content/**`. It uses repo variables `AWS_DEPLOY_ROLE_ARN`, `S3_BUCKET` and
`CLOUDFRONT_DISTRIBUTION_ID`, already set. Because two people push from two
computers, always `git pull --rebase origin main` before pushing (see
`DEVLOG.md`).

**The infrastructure** (only when `infra/` changes):

```bash
cd infra
ARCHIVE_PASSWORD='the-password' cdk deploy YesYogaOne-Hosting
```

`YesYogaOne-Cert` holds the ACM certificate and is already deployed; it only
needs redeploying if the domain names change.

## Domain and DNS

- Certificate: ACM in us-east-1 for `www.yesyogaone.net` and `yesyogaone.net`,
  validated by two CNAME records that must stay in DNS for yearly renewal.
- CloudFront distribution `E1JC63PHMH3JFX` (`d3mhq8iu4z4wna.cloudfront.net`)
  answers for both names.
- DNS is hosted at Cloudflare (nameservers `abdullah.ns.cloudflare.com` and
  `rayne.ns.cloudflare.com`, moved from GoDaddy on 2026-11-14). Records:
  `www` CNAME to CloudFront, bare domain CNAME to CloudFront (Cloudflare
  flattens it to A/AAAA), the two ACM validation CNAMEs, and a legacy `kz3-1`
  A record. All records are "DNS only" (grey cloud, not proxied); keep them
  that way so CloudFront terminates TLS with the ACM certificate.
- The registration is being transferred from GoDaddy to Cloudflare Registrar;
  DNS records are unaffected by the transfer.
- The old WordPress site at Flywheel can be cancelled about a week after launch.

## Still to do

- Decap CMS wired to GitHub (OAuth gateway) so content can be edited in a
  browser form; until then content is edited in `content/*.json`.
- Services with Stripe Payment Links; Formspree ID for the contact form.
- Sheila's bio for Corpus Christi (`content/about.json` → `bio`).

## Cost

Effectively $0/month: ~32 MB in S3 (under a cent), CloudFront inside its
always-free tier at this traffic, certificate free. No servers, no databases.
The domain renewal is the only recurring bill.
