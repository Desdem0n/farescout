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
- beta waitlist email handoff

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
