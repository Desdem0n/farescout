# Deployment Notes

FareScout needs a backend because the Ignav API key must stay private. Static-only hosting is not enough.

## Recommended Hosts

- Render
- Railway
- Fly.io
- Azure App Service

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
