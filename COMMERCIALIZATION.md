# FareScout Commercialization Boundary

## Goal

FareScout now has two tracks:

1. **Public portfolio/demo repository**: shows product thinking, UI quality, API integration, and deploy readiness.
2. **Private commercial backend**: protects the SaaS logic that would make the product harder to copy.

The public repository should remain useful for recruiters and early users, but it should not contain the full commercial operating system for paid alerts.

## Public Repository

This repository can contain:

- marketing/demo UI
- live manual fare search
- API proxy pattern
- public documentation
- PRD, roadmap, SaaS plan, deployment notes
- beta waitlist email handoff
- screenshots and portfolio assets
- non-sensitive validation logic
- paid pilot inquiry copy

This repository should not contain:

- billing implementation
- Stripe webhook logic
- customer database schema migrations for production
- alert matching algorithms
- cron worker implementation
- route grouping/cost-control logic
- admin dashboard code
- private analytics implementation
- API keys, webhook secrets, email-provider keys, or database URLs
- payment processing code until legal, billing, and private backend pieces are ready

## Private Backend Repository

Recommended private repository name:

```text
farescout-commercial
```

Recommended visibility:

```text
Private
```

Recommended role:

```text
Commercial SaaS backend for FareScout alerts, billing, monitoring, and admin tools.
```

## Private Backend Responsibilities

The private backend should own:

- user authentication integration
- saved fare alert CRUD
- subscription plan enforcement
- scheduled fare checks
- API call grouping and caching
- email or Telegram notifications
- Stripe Checkout
- Stripe webhooks
- billing portal sessions
- admin usage dashboard
- audit logs
- rate limiting
- abuse protection

## Suggested Private Stack

- Node.js
- PostgreSQL
- Prisma or plain SQL migrations
- Stripe
- Resend or Postmark
- Render/Railway/Fly.io worker service
- Hosted auth provider or magic-link auth

## Public-to-Private API Boundary

The public demo can eventually call only safe public endpoints such as:

```text
POST /api/public/waitlist
POST /api/public/search
```

The private SaaS should expose authenticated endpoints such as:

```text
GET    /api/me
GET    /api/alerts
POST   /api/alerts
PATCH  /api/alerts/:id
DELETE /api/alerts/:id
POST   /api/billing/checkout
POST   /api/billing/portal
POST   /api/webhooks/stripe
POST   /api/jobs/check-alerts
GET    /api/admin/usage
```

## Secret Handling

Secrets that must never be committed:

- `IGNAV_API_KEY`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `EMAIL_API_KEY`
- `AUTH_SECRET`
- `CRON_SECRET`

The public repo keeps `.env.example`, but real values belong only in local `.env` files or hosting dashboards.

## GitHub Actions

Public repo actions:

- syntax checks
- public demo deploy checks

Private repo actions:

- database migration checks
- test suite
- worker checks
- Stripe webhook tests
- deployment pipeline

## Immediate Next Steps

1. Create a private GitHub repository named `farescout-commercial`.
2. Add a private README explaining the commercial backend scope.
3. Add `.gitignore` and `.env.example`.
4. Add a minimal Node service with `/health`.
5. Add the database/auth/billing pieces only in the private repo.
6. Keep this public repo as portfolio/demo and link only public-safe docs.
