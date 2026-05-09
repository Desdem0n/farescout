# FareScout Case Study

## Summary

FareScout is a full-stack flight fare finder built around a practical user goal: compare live fares quickly, keep every returned price visible, and make the cheapest offer obvious.

The project started as a simple API-backed search form and grew into a portfolio-ready MVP with a responsive interface, secure backend proxy, route/provider filters, product documentation, and a SaaS direction.

## Problem

Flight search can become noisy fast. A user may need to test different airports, providers, dates, cabin classes, and currencies before understanding which option is actually cheapest.

For a portfolio project, the challenge was also technical: build something real enough to demonstrate API integration, backend security, validation, state handling, and product thinking without hiding behind a large framework.

## My Approach

- Started with a minimal Node backend to keep the API key server-side.
- Built the frontend with HTML, CSS, and vanilla JavaScript so the code remains easy to review.
- Added country and airport pickers to prevent broad city-code searches that the provider does not support.
- Normalized provider responses before rendering them in the browser.
- Sorted returned fares by total price and highlighted only the cheapest result.
- Added product docs so reviewers can see the thinking behind the MVP.

## Key Product Decisions

- **Airport codes instead of city codes:** The API expects airport-level searches, so the UI guides users toward valid inputs.
- **All fares stay visible:** The cheapest fare is emphasized, but users can still compare the full returned set.
- **Mobile-first layout:** The search form remains usable on narrow screens, then expands into a two-panel desktop layout.
- **No API key in browser:** The backend owns provider communication and exposes only normalized results.

## Technical Highlights

- Node.js HTTP server using built-in modules.
- Static frontend served from the same backend.
- `.env` configuration for private API credentials.
- Query validation before provider requests.
- Provider response normalization.
- Full-day departure window from `00:00` through `23:59`.
- GitHub Actions syntax check for `server.js` and `public/app.js`.

## What I Would Improve Next

- Deploy a public demo with Render or Railway.
- Add automated tests for request validation and response normalization.
- Move airport and provider datasets into separate modules.
- Add saved searches and fare alerts.
- Add a simple subscription model for a SaaS version.

## Result

FareScout now works as both a usable flight-search MVP and a portfolio project that shows product judgment, API integration, secure backend design, responsive UI work, and documentation discipline.
