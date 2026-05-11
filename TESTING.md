# FareScout Testing Checklist

## Static Checks

```bash
npm run check
```

## Automated E2E Tests

Install dependencies once:

```bash
npm install
npx playwright install chromium
```

Run the test suite:

```bash
npm run test:e2e
```

Useful focused run during development:

```bash
.\node_modules\.bin\playwright.cmd test --project=desktop --reporter=list --workers=1
```

The E2E tests cover:

- main search UI loads
- origin and destination country/airport pickers are visible
- invalid same-airport searches are blocked
- mocked successful search results show the "Track this route" CTA
- the CTA pre-fills the fare alerts beta form without calling the live flight API

## Manual Smoke Tests

- Start the app with `node server.js`.
- Open `http://localhost:4000`.
- Confirm `.env` is configured and `/api/health` reports `configured: true`.
- Search `WAW -> LHR`, economy, all providers, PLN.
- Search `WAW -> LTN`, Wizz Air, economy, PLN.
- Search with a business class filter and confirm empty results are handled cleanly if no fares are available.
- Search with a return date before departure and confirm validation stops the request.
- Try a city code such as `LON` and confirm the provider error is readable.
- Search `WAW -> LTN`, click `Track this route`, and confirm the beta form is pre-filled with route and target price.
- Fill the fare alerts beta form and confirm it opens a prepared email request.
- Resize to mobile width and confirm no title, labels, buttons, or cards are clipped.

## Expected Behaviors

- Results are sorted by total price ascending.
- Only the cheapest fare is highlighted.
- All returned fares remain visible.
- Search window displays a full-day range from `00:00` to `23:59`.
- Search results lead to a route-alert beta action.
- API key is never visible in browser responses.
