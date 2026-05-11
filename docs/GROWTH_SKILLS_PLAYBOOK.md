# FareScout Growth Skills Playbook

This playbook captures the SkillsMP research we want to apply to FareScout before we make major product, landing page, pricing, or SaaS migration decisions.

## Source Research

SkillsMP is a discovery platform for agent skills. It indexes public GitHub skills, supports semantic and keyword search, and treats skills as reusable containers for expert workflows rather than simple code snippets.

Useful sources reviewed:

- SkillsMP About: https://skillsmp.com/about
- SkillsMP CLI package: https://pypi.org/project/skillsmp/
- `bear2u/my-skills` landing page guide: https://github.com/bear2u/my-skills
- `ekinciio/saas-growth-marketing-skills`: https://github.com/ekinciio/saas-growth-marketing-skills
- `TerminalSkills/skills` pricing strategy: https://github.com/TerminalSkills/skills

## Skills Selected For FareScout

### 1. Landing Page Guide V2

Best for:

- public launch page
- product story
- memorable brand positioning
- conversion-focused design

Rules to apply:

- Design before coding.
- Choose one deliberate aesthetic direction and commit to it.
- Avoid generic AI-looking landing pages.
- Use a clear value proposition above the fold.
- Use product screenshots or real product visuals, never generic stock imagery.
- Every section must earn its place.
- CTA must be obvious, specific, and tied to user value.

FareScout application:

```text
Stop checking flight prices manually.
FareScout watches your route and tells you when the price is worth booking.
```

Primary CTA:

```text
Track a route
```

Secondary CTA:

```text
Try live search
```

### 2. SaaS Growth Marketing Skills

Best for:

- CRO audit
- PLG funnel analysis
- onboarding optimization
- retention thinking
- review and sentiment analysis later

Rules to apply:

- Every feature should map to a funnel step.
- The current core funnel is:

```text
Visit -> Search route -> See cheapest fare -> Track this route -> Submit beta lead -> Follow up manually
```

- We should measure whether users reach the "Track this route" moment.
- The next private backend step should capture `email`, `route`, `target_price`, and `traffic_source`.
- Lead capture comes before Stripe.

FareScout activation moment:

```text
User sees that FareScout found a real cheapest fare and asks it to monitor that route.
```

### 3. Pricing Strategy

Best for:

- deciding pricing metric
- packaging Free vs Pro
- validating willingness to pay

Rules to apply:

- Price based on perceived value, not implementation cost.
- Pick a value metric that grows as the user receives more value.
- For FareScout, the natural value metric is active monitored routes, not seats.
- Keep the first paid offer simple.

Recommended validation offer:

```text
Founder Pilot
30 days
Up to 5 monitored routes
Manual onboarding
Email-based price-drop updates
19 PLN / 5 USD / 5 EUR starting point
```

Recommended later self-serve plan:

```text
Pro
$7/month
10 saved alerts
daily monitoring
email alerts
price history
```

## Product Rules For Every Next FareScout Change

1. Do not add features unless they improve search, tracking, lead capture, trust, or retention.
2. Keep public code focused on demo, portfolio, and safe validation.
3. Keep billing, automated alerts, customer data, and admin logic private.
4. Prefer a measurable action over decorative polish.
5. Every launch asset should answer:

```text
What route do you want FareScout to watch for you?
```

## CRO Checklist

Before shipping a public marketing or app UI change, check:

- Is the value proposition clear in 5 seconds?
- Is the primary CTA visible without scrolling?
- Does CTA copy describe the user outcome, not the app mechanism?
- Is there proof that the app works, such as real search results or screenshots?
- Does the user see a next step after search results?
- Is the beta lead form short enough to complete in under 30 seconds?
- Are mobile labels, fields, and buttons readable?
- Is trust handled with privacy, no-payment-yet copy, and honest limitations?

## Launch Content Rules

For TikTok, X, Facebook, LinkedIn, and friends' socials:

- Lead with the pain: repeated flight checking is annoying.
- Show the product doing one real route search.
- Show the cheapest fare highlight.
- Show `Track this route`.
- Ask people to submit one route they want watched.
- Do not overpromise booking, guaranteed savings, or full airline coverage.

## Next Action

The current product implementation target is:

```text
Database-backed beta lead capture for Track this route.
```

Minimum fields:

- email
- origin airport
- destination airport
- route text
- target price
- market/currency
- source page or campaign
- created_at

This belongs in the private commercial path, not as public Stripe or alert-worker logic in this demo repo.

Public demo implementation:

- `POST /api/public/waitlist`
- `POST /api/public/pilot`
- optional `FARESCOUT_LEADS_WEBHOOK_URL`
- optional `FARESCOUT_LEADS_WEBHOOK_TOKEN`
- email fallback if the private lead endpoint is not connected yet
