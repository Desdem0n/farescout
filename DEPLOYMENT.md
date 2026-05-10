# Deployment Notes

FareScout needs a backend because the Ignav API key must stay private. Static-only hosting is not enough.

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
```

Some hosts provide `PORT` automatically. In that case, keep the app code as-is and only set:

```env
IGNAV_API_KEY=your_ignav_api_key
IGNAV_BASE_URL=https://ignav.com/api
```

## Start Command

```bash
node server.js
```

## Build Command

```bash
npm run check
```

The app has no install-time dependencies, so the build step is a lightweight syntax check.

## After Deployment

Add the live URL to:

- `README.md`
- `docs/PORTFOLIO_CHECKLIST.md`
- the portfolio project that links to FareScout

Then manually test:

- `/api/health`
- `WAW -> LTN`, Wizz Air, PLN
- beta waitlist email handoff

## GitHub Repository Settings

Suggested repository description:

```text
Responsive live flight fare finder built with Node.js, vanilla JavaScript, and the Ignav API.
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
```

## Before Sharing

- Confirm `.env` is not committed.
- Confirm `.env.example` is present.
- Confirm screenshots are up to date.
- Confirm README setup works from a fresh clone.
