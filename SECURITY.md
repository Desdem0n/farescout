# Security Policy

## Supported Version

FareScout is currently an early portfolio-to-SaaS MVP. Security fixes are applied to the
`main` branch.

## Secrets

The app is designed so API credentials stay on the server:

- `IGNAV_API_KEY` must be stored in `.env` locally.
- `IGNAV_API_KEY` must be stored as a private environment variable in hosting providers.
- The browser must never receive the API key.
- `.env` is ignored by Git and must not be committed.

## Reporting a Vulnerability

If you find a vulnerability, please do not open a public issue with exploit details.

Contact: `desmilke@gmail.com`

Include:

- affected route or file
- clear reproduction steps
- expected impact
- suggested fix, if known

## Deployment Notes

Before using FareScout commercially:

- rotate any exposed API keys immediately
- enable hosting-provider secret scanning where available
- use HTTPS-only deployment
- add rate limits before public traffic
- add abuse protection around search and waitlist endpoints
- add logging that avoids storing sensitive personal data
