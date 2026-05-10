# FareScout Paid Pilot Plan

## Recommendation

Do not launch fully automated payments yet.

FareScout is ready for a paid pilot offer, but not yet for self-serve Stripe subscriptions. A buyer should not pay automatically until these pieces exist:

- production privacy policy
- terms of service
- refund rules
- clear service scope
- alert delivery SLA
- production database
- commercial backend deployment
- payment webhook handling
- support process

## Best Next Commercial Move

Offer a time-limited **Founder Pilot License** manually.

This lets FareScout test whether people will pay without exposing full billing logic or overpromising automation.

## Founder Pilot Offer

Suggested offer:

```text
FareScout Founder Pilot
30 days
Manual onboarding
Up to 5 monitored routes
Email-based price-drop updates
Founding-user pilot from 19 PLN
```

What the buyer gets:

- early access to route monitoring
- manual setup help
- direct feedback channel
- lower founding-user price

What we learn:

- which routes users care about
- whether alerts are valuable enough to pay for
- how often checks need to run
- whether the price point is believable
- what wording converts interest into paid intent

## Demo CTA Strategy

The public demo should contain:

- live manual search
- beta waitlist
- founder pilot inquiry
- pricing signal framed as "from 19 PLN", not as automatic checkout

It should not contain:

- Stripe checkout
- billing portal
- subscription management
- alert worker code
- private route-matching logic

## Customer Acquisition Method

Start narrow:

1. Polish the public demo.
2. Add a "Founder pilot" inquiry CTA.
3. Share the demo in targeted Polish travel groups, LinkedIn posts, and portfolio channels.
4. Ask users to submit one route they want watched.
5. Reply manually to the first interested users.
6. Run manual or semi-manual monitoring for a small group.
7. Only add Stripe after at least 5-10 users show serious purchase intent.

## Success Criteria

Before building self-serve payments, aim for:

- 20+ beta inquiries
- 5+ users asking for specific route monitoring
- 2+ users willing to pay for a pilot
- clear proof that alerts save users time or money

## Why This Is Safer

This path avoids:

- charging before the service is reliable
- publishing private SaaS logic
- building Stripe before demand is proven
- creating legal obligations too early
- spending time on billing instead of customer validation
