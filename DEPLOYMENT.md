# Deployment Notes

FareScout needs a backend because the Ignav API key must stay private. Static-only hosting is not enough.

Live deployment: [https://farescout.onrender.com](https://farescout.onrender.com)

## Recommended Hosts

- Render
- Railway
- Fly.io
- Azure App Service

## Fastest Path: Render

This repository includes `render.yaml`, so Render can create the web service from the repo.

1. Push the latest code to GitHub.
2. Open Render and choose **New** -> **Blueprint**.
3. Connect `Desdem0n/farescout`.
4. Render should detect `render.yaml`.
5. Add the secret value for `IGNAV_API_KEY`.
6. Deploy.
7. Open `/api/health` on the deployed URL and confirm:

```json
{
  "ok": true,
  "provider": "ignav",
  "configured": true
}
```

The service start command is:

```bash
node server.js
```

The health check path is:

```text
/api/health
```

## Environment Variables

Set these in the hosting provider:

```env
IGNAV_API_KEY=your_ignav_api_key
IGNAV_BASE_URL=https://ignav.com/api
PORT=4000
FARESCOUT_LEADS_WEBHOOK_URL=https://your-private-commercial-backend.example.com/api/public/leads
FARESCOUT_LEADS_WEBHOOK_TOKEN=the_same_value_as_PUBLIC_LEAD_TOKEN_in_farescout_commercial
FOUNDER_PILOT_PAYMENT_URL=https://buy.stripe.com/your-founder-pilot-payment-link
```

Some hosts provide `PORT` automatically. In that case, keep the app code as-is and only set:

```env
IGNAV_API_KEY=your_ignav_api_key
IGNAV_BASE_URL=https://ignav.com/api
```

Lead capture variables are optional. When they are configured, beta waitlist and founder pilot requests are relayed to the private commercial backend. When they are not configured, the public demo keeps the safe email fallback.

Live Render status: lead capture is configured to relay public beta and pilot requests into the private `farescout-commercial` backend. Do not commit these values to GitHub; keep the webhook token only in Render environment variables.

`FOUNDER_PILOT_PAYMENT_URL` is optional and safe to expose because payment links are public checkout URLs. Keep it in Render environment variables so the public UI can show a paid Founder Pilot reservation without hard-coding payment links in the repository.

## Start Command

```bash
node server.js
```

## Build Command

```bash
npm run check
```

The app has no install-time dependencies, so the build step is a lightweight syntax check.

## Production Headers

The Node server sends basic security headers for public deployment:

- `Content-Security-Policy`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `frame-ancestors 'none'`

API responses are not cached. Static logo assets can be cached by the browser.

## After Deployment

Add the live URL to:

- `README.md` - done
- `docs/PORTFOLIO_CHECKLIST.md` - done
- `docs/GLOBAL_LAUNCH.md` - done
- the portfolio project that links to FareScout - done

Then manually test:

- `/api/health`
- `WAW -> LTN`, Wizz Air, PLN
- beta waitlist lead relay returns `captured: true`
- founder pilot lead relay returns `captured: true`
- `/api/public/founder-pilot-payment` returns whether paid pilot reservations are configured
- `/success.html` and `/cancel.html` render correctly for Stripe Payment Link redirects

## Stripe Payment Link Redirects

When creating the Founder Pilot Payment Link in Stripe, use:

```text
Success URL: https://farescout.onrender.com/success.html
Cancel URL: https://farescout.onrender.com/cancel.html
```

The success page asks for the route details needed to set up the manual monitored-route pilot and sends them to the private lead cockpit.

## Updating The Live Demo

This Render service was created from a public repository URL. When a new commit is pushed, use **Manual Deploy** -> **Deploy latest commit** in the Render service dashboard if the live app does not update automatically.

After each deploy, confirm:

- the service shows the latest commit as `live`
- `/api/health` returns `configured: true`
- the homepage reflects the intended UI change

## GitHub Repository Settings

Suggested repository description:

```text
Live flight fare finder built with Node.js, vanilla JavaScript, and the Ignav API.
```

Suggested topics:

```text
nodejs
javascript
flight-search
api-integration
responsive-design
portfolio-project
saas-mvp
travel-tech
render
```

Homepage:

```text
https://farescout.onrender.com
```

See [GitHub Repository Setup](./docs/GITHUB_REPO_SETUP.md).

## Before Sharing

- Confirm `.env` is not committed.
- Confirm `.env.example` is present.
- Confirm screenshots are up to date.
- Confirm README setup works from a fresh clone.
- Confirm the repository license still reflects the intended portfolio/proprietary use.
- Confirm the deployed app does not expose `IGNAV_API_KEY` in browser responses, logs, or source maps.
