# FareScout Roadmap

## Portfolio Polish

- Add final desktop and mobile result screenshots.
- Add a short demo GIF.
- Add a deployed demo URL.
- Add repository topics and description in GitHub settings.

## Product Features

- Search-result CTA that pre-fills a route-alert beta request. Done in public demo.
- Database-backed beta lead capture.
- Saved searches.
- Shareable search URLs.
- Flexible date search.
- Nearby airport search across `WAW`, `WMI`, and `RDO`.
- Price-drop alerts.
- Email or Telegram notifications.
- Price history charts.

## SaaS Direction

- Public hosted demo.
- Beta waitlist for fare alerts.
- Manual founder pilot for the first route-monitoring customers.
- Private commercial backend repository.
- User accounts.
- Saved fare alerts with target price.
- Subscription billing.
- Usage limits by plan.
- Scheduled background fare monitoring.
- Email notifications.
- Admin dashboard for usage and API costs.
- Legal pages: privacy policy, terms, and affiliate disclosure.

## Technical Improvements

- Keep payment, alert-worker, and admin logic out of the public repository.
- Move airport/provider datasets to separate modules.
- Add automated unit tests for request normalization.
- Add Playwright visual checks when package management is available.
- Add deployment-specific health checks.

## Current Product Hypothesis

FareScout should become a route-monitoring product, not only a one-time flight search form.

The paid value proposition to validate first:

```text
FareScout watches your routes and tells you when the price is worth booking.
```

Validation order:

1. User sees a cheapest fare.
2. User clicks "Track this route".
3. User submits email, route, and target price.
4. We manually follow up with the first interested users.
5. Only after strong demand do we build account, Stripe, and automated alert infrastructure.
