# FareScout SaaS Plan

## Positioning

FareScout should not compete directly with large travel search engines. The SaaS angle is narrower and more useful:

**FareScout watches flight prices for you and tells you when a trip becomes worth booking.**

The product starts with travelers flying from Poland who are flexible on dates, airports, or destination countries and want alerts instead of repeating the same manual searches.

## Target Niche

Primary niche:

- People based in Poland who regularly search for cheap flights from `WAW`, `WMI`, `KRK`, `GDN`, `KTW`, `WRO`, and `POZ`.
- Flexible travelers who care more about price than exact dates.
- Weekend travelers, remote workers, students, and families watching school-holiday prices.

Early route examples:

- Warsaw to London airports.
- Warsaw to Spain and Portugal.
- Krakow or Gdansk to southern Europe.
- Poland to New York or other long-haul destinations.

## Core Paid Problem

Manual search is not enough for a SaaS. The paid problem is:

> "I do not want to keep checking the same routes. Tell me when the price drops below my target."

## MVP Scope

The SaaS MVP should include:

- User accounts.
- Saved fare alerts.
- Maximum target price per alert.
- Origin airport and destination airport/country.
- Cabin class.
- Provider preference.
- Currency/market.
- Scheduled background checks.
- Email notifications when a fare matches the user's target.
- Billing plans with Stripe.

## Free vs Paid

### Free

- Manual live fare search.
- Limited number of searches per day.
- No saved alerts.
- No background monitoring.

### Starter

- 5 active alerts.
- Checks every 12 hours.
- Email notifications.
- Basic saved-search dashboard.

### Pro

- 25 active alerts.
- Checks every 4 hours.
- Multiple departure airports per alert.
- Destination-country alerts.
- Price history.
- Priority notification queue.

### Future Business/Affiliate

- Travel blogger or small agency dashboard.
- Shared alert lists.
- Affiliate tracking.
- White-label route collections.

## Pricing Hypothesis

Initial pricing to test:

- Free: 0 PLN.
- Starter: 19 PLN/month.
- Pro: 49 PLN/month.

The goal is not to optimize price immediately. The first validation target is whether users will exchange an email address and then pay for monitored alerts.

## Key User Stories

- As a user, I want to save `WAW -> LTN under 400 PLN` so I can stop checking manually.
- As a user, I want to receive an email when a route drops below my price target.
- As a user, I want to see my active alerts and pause or delete them.
- As a user, I want to choose multiple Warsaw-area airports so I can catch cheaper departures.
- As a paying user, I want more alerts and more frequent checks.
- As an admin, I want to monitor API usage and alert volume so costs do not grow blindly.

## Data Model Draft

```text
users
  id
  email
  password_hash or auth_provider_id
  plan
  stripe_customer_id
  created_at

fare_alerts
  id
  user_id
  origin_airports
  destination_airports
  destination_country
  departure_start_date
  departure_end_date
  return_start_date
  return_end_date
  max_price
  currency_market
  provider
  cabin_class
  nonstop_only
  status
  created_at
  last_checked_at

fare_checks
  id
  alert_id
  checked_at
  status
  cheapest_price
  cheapest_offer_snapshot
  provider_response_status

notifications
  id
  user_id
  alert_id
  fare_check_id
  channel
  status
  sent_at
```

## Technical Architecture

Recommended first SaaS stack:

- Backend: Node.js.
- Database: PostgreSQL.
- Auth: hosted provider such as Clerk/Supabase Auth, or custom email magic links later.
- Jobs: scheduled worker on Render/Railway/Fly.io, or a cron service calling a protected endpoint.
- Email: Resend, Postmark, or SendGrid.
- Payments: Stripe Checkout and Billing Portal.
- Hosting: Render or Railway for fastest deployment.

Commercial implementation should be split from this public demo repository. The private backend boundary is documented in [COMMERCIALIZATION.md](./COMMERCIALIZATION.md).

## API Cost Controls

Flight APIs can become expensive or rate-limited. FareScout needs cost control before public SaaS launch:

- Limit free manual searches.
- Limit active alerts by plan.
- Store recent check results.
- Avoid checking identical alerts separately when they can be grouped.
- Add admin visibility into daily API calls.
- Back off when the provider returns errors.

## Legal and Trust Requirements

Before charging users:

- Keep the commercial SaaS code private or move sensitive product logic into a private backend.
- Keep the public repository positioned as portfolio/demo source, not open-source software.
- Privacy policy.
- Terms of service.
- Cookie notice if analytics are added.
- Affiliate disclosure if booking links become monetized.
- Clear explanation that fares can change and FareScout does not sell tickets directly.

## Landing Page Copy

Hero headline:

**Stop checking flight prices manually. FareScout watches them for you.**

Subheading:

Create price alerts for routes from Poland, set your target fare, and get notified when a trip becomes worth booking.

Primary CTA:

**Create a fare alert**

Secondary CTA:

**Try live search**

Feature blocks:

- **Set your target price**: Choose route, dates, provider, cabin class, and maximum price.
- **Let FareScout monitor it**: Scheduled checks watch for matching offers.
- **Book when it matters**: Get notified when the fare drops into your target range.

## Validation Plan

1. Deploy the current app publicly.
2. Add a "Join the FareScout alert beta" email capture form.
3. Ask users which routes they want monitored.
4. Manually simulate alerts for the first small group if needed.
5. Add saved alerts only after at least a few users request monitoring.
6. Add Stripe after the alert workflow proves useful.

## Implementation Roadmap

### Phase 1: Public Demo

- Deploy the current app. `render.yaml` is included for a fast Render blueprint setup.
- Add live demo URL to README and portfolio.
- Add analytics or simple server logs.
- Add beta waitlist form. The current MVP uses a prepared email handoff so demand can be validated before adding database-backed accounts.

### Phase 2: Saved Alerts

- Add database.
- Add users.
- Add saved alert CRUD.
- Add basic dashboard.

### Phase 3: Monitoring Engine

- Add scheduled checks.
- Save fare check history.
- Send email notifications.
- Add alert grouping to reduce API calls.

### Phase 4: Paid Plans

- Add Stripe Checkout.
- Add plan limits.
- Add Billing Portal.
- Add admin usage dashboard.

### Phase 5: Growth

- Add route collections.
- Add price history charts.
- Add Telegram alerts.
- Add affiliate links where legally and commercially appropriate.

## First Engineering Step

The next engineering step should be deployment, not billing.

Recommended immediate task:

1. Deploy FareScout on Render or Railway.
2. Set `IGNAV_API_KEY` as a private environment variable.
3. Add the public URL to README and portfolio.
4. Add a simple waitlist CTA to validate alert demand.
