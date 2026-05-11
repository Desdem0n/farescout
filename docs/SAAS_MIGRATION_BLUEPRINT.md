# FareScout SaaS Migration Blueprint

## Decision

Keep this public repository as the working portfolio/demo product and build the commercial SaaS layer in the private `farescout-commercial` repository.

Do not replace the public app with a large Next.js rewrite until there is stronger validation that users want monitored route alerts.

## Why

The current app already proves the important public portfolio points:

- live API-backed flight search
- secure backend proxy for `IGNAV_API_KEY`
- responsive UI
- country and airport route pickers
- provider, class, market, passenger, and nonstop filters
- route-alert beta CTA
- Playwright product-flow tests
- Render deployment

The commercial value is not the manual search form. The commercial value is:

```text
FareScout watches your routes and tells you when the price is worth booking.
```

That monitoring, billing, alert scheduling, and user data should live in the private commercial system.

## Recommended Commercial Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase Postgres
- Stripe Checkout and Billing Portal
- Resend for transactional email
- PostHog for product analytics
- Playwright for E2E tests
- Zod for request validation
- React Hook Form for forms

## Target Private Structure

```text
app/
  page.tsx
  search/page.tsx
  dashboard/page.tsx
  pricing/page.tsx
  login/page.tsx
  api/search/route.ts
  api/alerts/route.ts
  api/stripe/checkout/route.ts
  api/stripe/webhook/route.ts
  api/jobs/check-alerts/route.ts

components/
  SearchForm.tsx
  OfferCard.tsx
  SaveAlertCTA.tsx
  PricingCards.tsx
  AlertList.tsx

lib/
  ignav.ts
  plans.ts
  posthog.ts
  resend.ts
  stripe.ts
  supabase.ts
  validation.ts

supabase/
  migrations/
```

## Migration Phases

### Phase 0: Current Public Demo

Status: complete enough for portfolio and validation.

Keep improving:

- search UX
- route-alert beta CTA
- screenshots
- README and PRD
- Playwright tests
- social launch assets

Do not add:

- Stripe secrets
- production database schema
- alert worker code
- admin usage logic

### Phase 1: Private Next.js Shell

Goal: reproduce current public search flow in the private SaaS repo.

Scope:

- Next.js app shell
- public landing page
- `/search`
- `/pricing`
- `/api/search`
- shared Ignav normalization module
- current Playwright search and conversion tests

No auth or payments yet.

### Phase 2: Lead Capture

Goal: stop using mail handoff for serious beta interest.

Scope:

- Supabase project
- `beta_leads` table
- `POST /api/public/waitlist`
- route, target price, email, country, and source tracking
- basic spam/rate limiting
- PostHog events:
  - `alert_interest_started`
  - `alert_interest_submitted`
  - `search_completed`
  - `track_route_clicked`

### Phase 3: Accounts And Saved Routes

Goal: create the first returning-user loop.

Scope:

- Supabase Auth
- `profiles`
- `saved_routes`
- `searches`
- dashboard page
- save route after search
- free usage limits

### Phase 4: Alert Engine

Goal: deliver the paid product manually or semi-automatically.

Scope:

- `price_alerts`
- `fare_checks`
- `notifications`
- scheduled job endpoint
- email alerts through Resend
- alert grouping and caching to control API costs
- admin usage view in the private repo

### Phase 5: Stripe

Goal: charge only after people have shown real intent.

Scope:

- one paid plan first
- Stripe Checkout
- Stripe Customer Portal
- Stripe webhook
- `subscriptions`
- plan limits
- refund/support policy

Recommended starting plan:

```text
Pro
$7/month
50 searches/day
10 saved alerts
daily monitoring
email alerts
price history
```

## Minimal Supabase Schema

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text default 'free',
  created_at timestamp with time zone default now()
);

create table beta_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  route text not null,
  target_price text not null,
  source text,
  created_at timestamp with time zone default now()
);

create table searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  from_airport text not null,
  to_airport text not null,
  departure_date date not null,
  cheapest_price numeric,
  result_count integer,
  created_at timestamp with time zone default now()
);

create table saved_routes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  from_airport text not null,
  to_airport text not null,
  created_at timestamp with time zone default now()
);

create table price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  route_id uuid references saved_routes(id) on delete cascade,
  target_price numeric not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  plan text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now()
);
```

## Public Repo Guardrails

The public repository may show:

- MVP source
- API proxy pattern
- testing strategy
- product docs
- public-safe SaaS plan
- beta/pilot copy

The public repository must not ship:

- Stripe implementation
- production database migrations
- alert scheduling implementation
- route matching and grouping logic
- admin dashboard
- customer data
- secret keys or webhook secrets

## Next Practical Step

Before a framework migration, collect real demand:

1. Share the live app publicly.
2. Ask people to search a real route.
3. Push them to `Track this route`.
4. Record route, target price, email, and source.
5. Follow up manually with interested users.
6. Start the private Next.js shell once the beta lead flow proves useful.
