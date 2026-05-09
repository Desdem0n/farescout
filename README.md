# FareScout

FareScout is a responsive flight fare finder that searches live fares through the Ignav API and highlights the cheapest result while keeping every returned price visible.

The app was built as a portfolio-ready full-stack project: a static mobile-first frontend, a lightweight Node backend, secure API-key handling through `.env`, and real third-party API integration.

![FareScout desktop search](docs/screenshots/desktop-search.png)

## Features

- Live fare search through the Ignav API.
- Warsaw-focused origin defaults with country-based destination selection.
- Airport search by real three-letter IATA airport codes.
- Full-day departure search, displayed as `00:00` through `23:59`.
- Currency selection through Ignav market codes such as `PL`, `GB`, and `US`.
- Airline/provider filtering, including Wizz Air, LOT, Ryanair, British Airways, Lufthansa, KLM, Air France, TAP, Iberia, and major US carriers.
- Flight class selection: economy, premium economy, business, and first.
- Clear cheapest-fare highlight without hiding other returned prices.
- Mobile-first responsive layout.
- Dependency-free runtime: only Node built-ins are used.

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js HTTP server
- API: Ignav flight fares API
- Configuration: `.env` file loaded server-side

## Architecture

```text
Browser UI
  -> local Node backend
    -> Ignav API
      -> normalized fare results
        -> responsive results UI
```

The API key stays on the backend and is never sent to the browser.

## Setup

1. Create an Ignav account from [ignav.com](https://ignav.com/).
2. Copy your API key from the Ignav dashboard.
3. Copy `.env.example` to `.env`.
4. Fill in `IGNAV_API_KEY`.

```env
IGNAV_API_KEY=your_ignav_api_key
IGNAV_BASE_URL=https://ignav.com/api
PORT=4000
```

## Run

```bash
node server.js
```

Then open:

```text
http://localhost:4000
```

## Verify

```bash
npm run check
```

If `npm` is unavailable, run the checks directly:

```bash
node --check server.js
node --check public/app.js
```

## Project Docs

- [Product Requirements](./PRD.md)
- [Testing Checklist](./TESTING.md)
- [Deployment Notes](./DEPLOYMENT.md)
- [Roadmap](./ROADMAP.md)

## API Notes

- Ignav expects airport codes, not city codes. Use `LHR`, `LTN`, or `STN` instead of `LON`.
- Currency is selected through Ignav's `market` parameter. For example, `PL` returns Polish-market fares in PLN.
- Provider filtering uses Ignav's `airlines_include` parameter, then the backend recalculates the cheapest returned fare.
- The backend sends a local departure-time range from hour `0` through hour `23`, and the UI presents that as a full-day search from `00:00` to `23:59`.

## What This Project Demonstrates

- Secure API proxy design.
- Third-party API integration and response normalization.
- Defensive validation and human-readable error handling.
- Mobile-first product UI.
- Filtering, sorting, and cheapest-result highlighting.
- Employer-friendly documentation and product thinking.

## Roadmap

- Add saved searches.
- Add price-drop alerts.
- Add historical price tracking.
- Add authentication and subscriptions for a SaaS version.
