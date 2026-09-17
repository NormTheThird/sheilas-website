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

## Local development

```bash
cd site
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # static output in site/dist (prerendered HTML per route)
npm run cms        # decap-server, for editing content at /admin locally
```

Routes: `/`, `/testimonials/`, `/faq/` — each prerendered to its own `index.html`,
no client-side router, so S3/CloudFront serves them without rewrites (a CloudFront
Function maps `/faq/` → `/faq/index.html`).

## Content editing (Sheila)

All copy lives in `/content/*.json` and is edited through Decap CMS — a form UI, no
code. Locally: `npm run cms` + `npm run dev`, then open `http://localhost:5173/admin/`.
Production GitHub-backed auth is phase 3 (needs a small OAuth gateway — see
`site/public/admin/config.yml`).

- Services stay hidden until `active` is switched on and price/duration are filled in.
- A service with a Stripe Payment Link URL gets a "Book / Pay" button automatically.
- The bio still mentions Sioux Falls; updating it for Corpus Christi is a single
  field edit (`content/about.json` → `bio`).

## Deploying (phase 2+)

```bash
cd infra
cdk deploy YesYogaOne-Hosting
```

Then set repo variables `AWS_DEPLOY_ROLE_ARN`, `S3_BUCKET`,
`CLOUDFRONT_DISTRIBUTION_ID` and the workflow deploys on every push to `main`
touching `site/**` or `content/**`.

## Phases

1. ✅ Scaffold site + content model + local dev; port live content
2. CDK hosting stack; deploy to CloudFront URL; CI pipeline
3. Decap CMS wired to GitHub (OAuth gateway); Sheila edits → auto-deploy
4. Services with Stripe Payment Links, Formspree contact form
5. ACM cert + custom domain; flip GoDaddy DNS; cancel Flywheel after a week

## Cost target

< $3/month: S3 (pennies), CloudFront (free tier / pennies at this traffic), ACM (free),
Route 53 only if we migrate DNS ($0.50/zone). No servers, no databases.
