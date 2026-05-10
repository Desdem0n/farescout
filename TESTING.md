# FareScout Testing Checklist

## Static Checks

```bash
node --check server.js
node --check public/app.js
```

## Manual Smoke Tests

- Start the app with `node server.js`.
- Open `http://localhost:4000`.
- Confirm `.env` is configured and `/api/health` reports `configured: true`.
- Search `WAW -> LHR`, economy, all providers, PLN.
- Search `WAW -> LTN`, Wizz Air, economy, PLN.
- Search with a business class filter and confirm empty results are handled cleanly if no fares are available.
- Search with a return date before departure and confirm validation stops the request.
- Try a city code such as `LON` and confirm the provider error is readable.
- Fill the fare alerts beta form and confirm it opens a prepared email request.
- Resize to mobile width and confirm no title, labels, buttons, or cards are clipped.

## Expected Behaviors

- Results are sorted by total price ascending.
- Only the cheapest fare is highlighted.
- All returned fares remain visible.
- Search window displays a full-day range from `00:00` to `23:59`.
- API key is never visible in browser responses.
