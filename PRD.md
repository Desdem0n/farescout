# FareScout PRD

## Overview

FareScout is a live flight fare finder focused on helping users quickly compare fares, identify the cheapest option, and move from a one-time search toward monitored route alerts.

The current version is a portfolio-grade MVP. A future SaaS version could add user accounts, saved searches, price alerts, background monitoring, and subscriptions. The SaaS direction is documented in [SAAS_PLAN.md](./SAAS_PLAN.md).

## Problem

Flight prices are scattered across providers and difficult to compare quickly. Users often need to test different airports, airlines, and dates to find affordable fares.

For a technical portfolio, the project also needs to show practical product judgment: real API usage, backend security, responsive UX, clear error handling, and maintainable documentation.

## Target Users

- Budget travelers searching for cheap flights from Poland.
- Flexible travelers comparing airports, airlines, and cabin classes.
- Recruiters and engineering reviewers evaluating the project.
- Future SaaS users who may want saved searches and fare alerts.

## Goals

- Search live flight fares through a real API.
- Keep API credentials secure on the backend.
- Make route selection intuitive through country and airport pickers.
- Make both origin and destination selection usable through country and airport pickers.
- Use search results to encourage the next product action: joining the monitored-alert beta.
- Show all returned prices while clearly marking the cheapest fare.
- Support airline/provider, flight class, currency/market, nonstop, and date filters.
- Provide a clean mobile-first interface.
- Prepare the project for public GitHub sharing.

## Non-Goals

- Booking or payment inside the app.
- User accounts in the MVP.
- Persisted searches in the MVP.
- Price alerts in the MVP.
- Guaranteeing complete market coverage beyond Ignav API availability.

## User Stories

- As a traveler, I want to search flights from Warsaw to London Luton so I can find the cheapest Wizz Air fare.
- As a traveler, I want to choose the origin and destination country first so I can find relevant airports faster.
- As a traveler, I want to filter by provider so I can compare only airlines I prefer.
- As a traveler, I want to search economy, premium economy, business, or first class.
- As a traveler, I want to see all returned fares, not only the cheapest one.
- As a traveler, I want to save interest in a route alert after seeing a fare so I can stop checking the same route manually.
- As a reviewer, I want clear setup instructions so I can run the project locally.

## Functional Requirements

- The app must search live fares using the Ignav API.
- The backend must read `IGNAV_API_KEY` from `.env`.
- The browser must never receive the API key.
- The UI must allow users to choose:
  - origin airport
  - origin country
  - destination country
  - destination airport
  - departure date
  - optional return date
  - number of adults
  - currency/market
  - airline/provider
  - cabin class
  - nonstop preference
- The app must sort returned fares by total price ascending.
- The app must highlight only the cheapest returned fare.
- The app must show all returned fares.
- The app must show a route-alert CTA after successful search results.
- The alert CTA must prefill the beta form with the searched route and a target price suggestion.
- The app must display meaningful provider/API errors.
- The app must validate obvious form mistakes before calling the API.

## UX Requirements

- Mobile-first layout.
- Clear hierarchy: brand, route, dates, filters, submit.
- No cramped form columns on mobile.
- Cheapest fare should be visually distinct without hiding other results.
- Results should remain scannable on desktop and mobile.
- Labels must be clear and nontechnical where possible.
- Conversion prompts should be contextual and appear after the user sees value, not before the first search.

## Technical Requirements

- Use Node.js built-in modules only.
- Serve static frontend assets from the backend.
- Normalize provider responses before sending them to the browser.
- Keep route and provider validation defensive.
- Keep `.env` out of source control.

## Constraints

- Ignav supports airport codes, not broad city codes such as `LON`.
- Currency is controlled by Ignav market code.
- API coverage depends on Ignav availability and supported routes.
- Some cabin/provider combinations may return no fares.

## Success Metrics

- User can search `WAW -> LTN` with Wizz Air and receive live fares.
- User can search `WAW -> LHR` and see multiple fares sorted by price.
- API key is not exposed to the browser.
- The project can be cloned, configured, and run from README instructions.
- The UI works on mobile and desktop without clipped text.

## SaaS Roadmap

- Public deployment.
- Beta waitlist for fare alerts with route prefill from search results.
- User authentication.
- Saved searches.
- Saved fare alerts with target prices.
- Fare price history.
- Email or Telegram alerts.
- Scheduled background fare checks.
- Stripe subscriptions.
- Usage limits per plan.
- Admin dashboard for API usage and user activity.
- Privacy policy, terms, and billing pages.
