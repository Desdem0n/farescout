# FareScout Post-Deploy Launch Checklist

Use this immediately after Render creates the public app URL.

## 1. Smoke Test

- Open the app URL.
- Open `/api/health` and confirm `configured` is `true`.
- Search `WAW -> LTN`, market `PL`, provider `Wizz Air`.
- Search `JFK -> MIA`, market `US`, provider `All providers`.
- Open `/promo.html`.
- Submit neither payment nor private data; the public demo should only prepare email requests.

## 2. Update Links

Replace `DEMO_URL` with the real Render URL in:

- `README.md`
- `DEPLOYMENT.md`
- `docs/GLOBAL_LAUNCH.md`
- `docs/PORTFOLIO_CHECKLIST.md`
- portfolio project FareScout section

## 3. Public Safety Check

- Confirm `.env` is not committed.
- Confirm browser source does not contain `IGNAV_API_KEY`.
- Confirm the public repo still says `UNLICENSED`.
- Confirm private alert, billing, database, and admin logic remains in `farescout-commercial`.

## 4. First Launch Posts

Start with LinkedIn and X because they fit build-in-public context.

Then post the 9:16 recording of `/promo.html` on TikTok, Reels, and Shorts.

Primary CTA:

```text
Try FareScout and submit one route you want monitored.
```

## 5. Lead Tracking

Track replies manually at first:

```text
Date | Channel | Email/Handle | Route | Target price | Country | Interest level | Follow-up sent
```

Do not build self-serve payments until route requests prove demand.
