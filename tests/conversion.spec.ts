import { expect, test } from "@playwright/test";

const mockedSearchResponse = {
  count: 2,
  market: "PL",
  providerFilter: "ALL",
  cabinClass: "economy",
  searchWindow: {
    startLocal: "2026-06-10 00:00",
    displayEndLocal: "2026-06-10 23:59"
  },
  cheapest: {
    id: "mock-cheapest",
    price: {
      total: 100,
      formatted: "PLN 100.00",
      currency: "PLN"
    },
    cabinClass: "economy",
    itineraries: [
      {
        duration: "2h 35m",
        segments: [
          {
            from: "WAW",
            to: "LTN",
            departure: "2026-06-10T06:00:00+02:00",
            arrival: "2026-06-10T07:35:00+01:00",
            carrier: "Wizz Air",
            carrierCode: "W6",
            number: "1301"
          }
        ]
      }
    ]
  },
  offers: [
    {
      id: "mock-cheapest",
      price: {
        total: 100,
        formatted: "PLN 100.00",
        currency: "PLN"
      },
      cabinClass: "economy",
      itineraries: [
        {
          duration: "2h 35m",
          segments: [
            {
              from: "WAW",
              to: "LTN",
              departure: "2026-06-10T06:00:00+02:00",
              arrival: "2026-06-10T07:35:00+01:00",
              carrier: "Wizz Air",
              carrierCode: "W6",
              number: "1301"
            }
          ]
        }
      ]
    },
    {
      id: "mock-second",
      price: {
        total: 129,
        formatted: "PLN 129.00",
        currency: "PLN"
      },
      cabinClass: "economy",
      itineraries: [
        {
          duration: "2h 40m",
          segments: [
            {
              from: "WAW",
              to: "LTN",
              departure: "2026-06-10T12:45:00+02:00",
              arrival: "2026-06-10T14:25:00+01:00",
              carrier: "Wizz Air",
              carrierCode: "W6",
              number: "1303"
            }
          ]
        }
      ]
    }
  ]
};

test.describe("FareScout conversion flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/search?**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockedSearchResponse)
      });
    });
  });

  test("search results lead into a route-alert beta request", async ({ page }) => {
    await page.goto("/");

    await page.locator('select[name="destination"]').selectOption("LTN");
    await page.getByRole("button", { name: /search fares/i }).click();

    await expect(page.getByRole("heading", { name: /cheapest fare: pln 100.00/i })).toBeVisible();
    await expect(page.getByText(/turn this search into an alert/i)).toBeVisible();

    await page.getByRole("button", { name: /track this route/i }).click();

    await expect(page.getByLabel(/route to watch/i)).toHaveValue("WAW to LTN under 90 PLN");
    await expect(page.getByLabel(/target price/i)).toHaveValue("90 PLN");
    await expect(page.getByText(/route copied from your latest search/i)).toBeVisible();
  });
});
