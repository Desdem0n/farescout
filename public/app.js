const form = document.querySelector("#flight-form");
const results = document.querySelector("#results");
const statusLabel = document.querySelector("#status-label");
const resultTitle = document.querySelector("#result-title");
const clearButton = document.querySelector("#clear-button");
const swapRouteButton = document.querySelector("#swap-route");
const destinationCountry = document.querySelector("#destination-country");

const airportsByCountry = {
  PL: {
    label: "Poland",
    airports: [
      ["WAW", "Warsaw Chopin"],
      ["WMI", "Warsaw Modlin"],
      ["RDO", "Warsaw Radom"],
      ["KRK", "Krakow"],
      ["GDN", "Gdansk"],
      ["KTW", "Katowice"],
      ["WRO", "Wroclaw"],
      ["POZ", "Poznan"],
      ["RZE", "Rzeszow"],
      ["SZZ", "Szczecin"]
    ]
  },
  GB: {
    label: "United Kingdom",
    airports: [
      ["LHR", "London Heathrow"],
      ["LGW", "London Gatwick"],
      ["LTN", "London Luton"],
      ["STN", "London Stansted"],
      ["LCY", "London City"],
      ["SEN", "London Southend"],
      ["MAN", "Manchester"],
      ["BHX", "Birmingham"],
      ["EDI", "Edinburgh"],
      ["GLA", "Glasgow"],
      ["LPL", "Liverpool"],
      ["BRS", "Bristol"]
    ]
  },
  ES: {
    label: "Spain",
    airports: [
      ["MAD", "Madrid"],
      ["BCN", "Barcelona"],
      ["AGP", "Malaga"],
      ["ALC", "Alicante"],
      ["VLC", "Valencia"],
      ["SVQ", "Seville"],
      ["PMI", "Palma de Mallorca"],
      ["IBZ", "Ibiza"],
      ["TFS", "Tenerife South"],
      ["LPA", "Gran Canaria"]
    ]
  },
  DE: {
    label: "Germany",
    airports: [
      ["BER", "Berlin Brandenburg"],
      ["FRA", "Frankfurt"],
      ["MUC", "Munich"],
      ["DUS", "Dusseldorf"],
      ["HAM", "Hamburg"],
      ["CGN", "Cologne Bonn"],
      ["STR", "Stuttgart"],
      ["DTM", "Dortmund"],
      ["NUE", "Nuremberg"],
      ["HHN", "Frankfurt Hahn"]
    ]
  },
  PT: {
    label: "Portugal",
    airports: [
      ["LIS", "Lisbon"],
      ["OPO", "Porto"],
      ["FAO", "Faro"],
      ["FNC", "Madeira"]
    ]
  },
  US: {
    label: "United States",
    airports: [
      ["JFK", "New York JFK"],
      ["EWR", "Newark"],
      ["BOS", "Boston"],
      ["ORD", "Chicago O'Hare"],
      ["IAD", "Washington Dulles"],
      ["MIA", "Miami"],
      ["LAX", "Los Angeles"],
      ["SFO", "San Francisco"],
      ["SEA", "Seattle"],
      ["ATL", "Atlanta"],
      ["DFW", "Dallas Fort Worth"],
      ["DEN", "Denver"],
      ["LAS", "Las Vegas"],
      ["MCO", "Orlando"]
    ]
  },
  FR: {
    label: "France",
    airports: [
      ["CDG", "Paris Charles de Gaulle"],
      ["ORY", "Paris Orly"],
      ["BVA", "Paris Beauvais"],
      ["NCE", "Nice"],
      ["LYS", "Lyon"],
      ["MRS", "Marseille"],
      ["TLS", "Toulouse"]
    ]
  },
  IT: {
    label: "Italy",
    airports: [
      ["FCO", "Rome Fiumicino"],
      ["CIA", "Rome Ciampino"],
      ["MXP", "Milan Malpensa"],
      ["BGY", "Milan Bergamo"],
      ["VCE", "Venice"],
      ["NAP", "Naples"],
      ["BLQ", "Bologna"],
      ["CTA", "Catania"]
    ]
  },
  NL: {
    label: "Netherlands",
    airports: [
      ["AMS", "Amsterdam"],
      ["EIN", "Eindhoven"],
      ["RTM", "Rotterdam"]
    ]
  },
  OTHER: {
    label: "Other Europe and world",
    airports: [
      ["VIE", "Vienna"],
      ["ZRH", "Zurich"],
      ["PRG", "Prague"],
      ["BUD", "Budapest"],
      ["CPH", "Copenhagen"],
      ["ARN", "Stockholm Arlanda"],
      ["OSL", "Oslo"],
      ["HEL", "Helsinki"],
      ["BRU", "Brussels"],
      ["DUB", "Dublin"],
      ["ATH", "Athens"],
      ["IST", "Istanbul"],
      ["DXB", "Dubai"],
      ["DOH", "Doha"],
      ["TLV", "Tel Aviv"],
      ["YYZ", "Toronto Pearson"],
      ["YUL", "Montreal"]
    ]
  }
};

populateCountries();
populateDestinationAirports("GB", "LHR");
setDefaultDate();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector(".search-submit");
  const params = new URLSearchParams();
  const data = new FormData(form);
  const validationError = validateSearch(data);

  if (validationError) {
    showError("Check the search details", validationError);
    return;
  }

  for (const [key, value] of data.entries()) {
    if (key !== "nonStop" && String(value).trim()) {
      params.set(key, String(value).trim().toUpperCase());
    }
  }
  params.set("nonStop", data.has("nonStop") ? "true" : "false");

  setLoading(true, button);

  try {
    const response = await fetch(`/api/search?${params}`);
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(formatErrorMessage(payload.hint || payload.details || payload.error));
    }

    renderOffers(payload);
  } catch (error) {
    showError("No fares loaded", error.message);
  } finally {
    setLoading(false, button);
  }
});

clearButton.addEventListener("click", () => {
  statusLabel.textContent = "Ready";
  resultTitle.textContent = "Cheapest fares will appear here";
  results.className = "results empty-state";
  results.textContent = "Enter airport codes and dates to compare live offers from the API.";
});

swapRouteButton.addEventListener("click", () => {
  const origin = form.elements.origin.value;
  const destination = form.elements.destination.value;
  form.elements.origin.value = destination;
  selectDestinationAirport(origin);
});

destinationCountry.addEventListener("change", () => {
  populateDestinationAirports(destinationCountry.value);
});

function renderOffers(payload) {
  results.className = "results";

  if (!payload.offers.length) {
    statusLabel.textContent = "No matches";
    resultTitle.textContent = "Try nearby airports or different dates";
    results.className = "results empty-state";
    results.textContent = payload.providerFilter && payload.providerFilter !== "ALL"
      ? "No fares matched that airline provider. Try All providers or a different route."
      : "The provider returned no available offers for this search.";
    return;
  }

  statusLabel.textContent = `${payload.count} offers found${payload.providerFilter && payload.providerFilter !== "ALL" ? ` · ${payload.providerFilter}` : ""}`;
  resultTitle.textContent = `Cheapest fare: ${payload.cheapest.price.formatted}`;
  const windowNote = createSearchWindowNote(payload.searchWindow);
  results.replaceChildren(...payload.offers.map(createOfferCard));
  if (windowNote) {
    results.prepend(windowNote);
  }
}

function populateCountries() {
  destinationCountry.replaceChildren(...Object.entries(airportsByCountry).map(([code, group]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = group.label;
    return option;
  }));
}

function populateDestinationAirports(countryCode, selectedCode = "") {
  const group = airportsByCountry[countryCode] || airportsByCountry.OTHER;
  destinationCountry.value = countryCode;
  const options = group.airports.map(([code, city]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${city} · ${code}`;
    return option;
  });

  form.elements.destination.replaceChildren(...options);
  form.elements.destination.value = selectedCode || options[0]?.value || "";
}

function selectDestinationAirport(airportCode) {
  const country = findCountryForAirport(airportCode);
  if (country) {
    destinationCountry.value = country;
    populateDestinationAirports(country, airportCode);
    return;
  }

  form.elements.destination.value = airportCode;
}

function findCountryForAirport(airportCode) {
  const normalized = String(airportCode || "").toUpperCase();
  return Object.entries(airportsByCountry).find(([, group]) =>
    group.airports.some(([code]) => code === normalized)
  )?.[0] || "";
}

function createSearchWindowNote(searchWindow) {
  if (!searchWindow) return null;
  const note = document.createElement("div");
  note.className = "search-window";
  note.textContent = `Searching all departures from ${searchWindow.startLocal} to ${searchWindow.displayEndLocal}`;
  return note;
}

function validateSearch(data) {
  const origin = String(data.get("origin") || "").trim();
  const destination = String(data.get("destination") || "").trim();
  const departureDate = String(data.get("departureDate") || "");
  const returnDate = String(data.get("returnDate") || "");
  const market = String(data.get("market") || "").trim();

  if (origin.length !== 3 || destination.length !== 3) {
    return "Use three-letter IATA airport codes, such as WAW, LHR, JFK, or CDG.";
  }

  if (origin.toUpperCase() === destination.toUpperCase()) {
    return "Origin and destination need to be different.";
  }

  if (returnDate && returnDate < departureDate) {
    return "Return date must be the same day as departure or later.";
  }

  if (market.length !== 2) {
    return "Market must be a two-letter country code, such as US, GB, or PL.";
  }

  return "";
}

function showError(title, message) {
  statusLabel.textContent = "Search failed";
  resultTitle.textContent = title;
  results.className = "results error-state";
  results.innerHTML = `
    <strong>${escapeHtml(message)}</strong>
    <span>${escapeHtml(getRecoveryHint(message))}</span>
  `;
}

function getRecoveryHint(message) {
  if (message.includes("IGNAV_API_KEY") || message.includes("API key")) {
    return "Add your Ignav API key to a .env file, then restart the Node server.";
  }

  return "Adjust the form and search again.";
}

function formatErrorMessage(value) {
  if (!value) return "Unable to search flights.";
  if (typeof value === "string") return value;
  return value.message || value.detail || value.title || JSON.stringify(value);
}

function createOfferCard(offer, index) {
  const card = document.createElement("article");
  card.className = index === 0 ? "offer-card cheapest-offer" : "offer-card";

  const price = document.createElement("div");
  price.className = "price";
  price.innerHTML = `
    <strong>${escapeHtml(offer.price.formatted)}</strong>
    ${index === 0 ? "<em>Cheapest</em>" : ""}
    <span>${escapeHtml(formatCabin(offer.cabinClass))}</span>
  `;

  const details = document.createElement("div");
  details.className = "details";

  for (const itinerary of offer.itineraries) {
    const itineraryElement = document.createElement("section");
    itineraryElement.className = "itinerary";
    const first = itinerary.segments[0];
    const last = itinerary.segments[itinerary.segments.length - 1];
    const stopCount = Math.max(itinerary.segments.length - 1, 0);

    itineraryElement.innerHTML = `
      <div class="route-line">
        ${escapeHtml(first.from)} to ${escapeHtml(last.to)}
        <span>${escapeHtml(itinerary.duration)} · ${stopCount === 0 ? "Nonstop" : `${stopCount} stop${stopCount > 1 ? "s" : ""}`}</span>
      </div>
      ${itinerary.segments.map(renderSegment).join("")}
    `;
    details.append(itineraryElement);
  }

  card.append(price, details);
  return card;
}

function renderSegment(segment) {
  return `
    <div class="segment">
      <div>
        <div class="airport">${escapeHtml(segment.from)}</div>
        <div class="time">${formatDateTime(segment.departure)}</div>
      </div>
      <div class="arrow" aria-hidden="true"></div>
      <div>
        <div class="airport">${escapeHtml(segment.to)}</div>
        <div class="time">${formatDateTime(segment.arrival)}</div>
      </div>
      <div class="segment-meta">${escapeHtml(segment.carrier)} ${escapeHtml(segment.number)}</div>
    </div>
  `;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatCabin(value) {
  if (!value) return "Economy";
  return String(value).replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function setLoading(isLoading, button) {
  button.disabled = isLoading;
  button.textContent = isLoading ? "Searching..." : "Search fares";
  if (isLoading) {
    statusLabel.textContent = "Searching";
    resultTitle.textContent = "Comparing live fares";
    results.className = "results empty-state";
    results.textContent = "Contacting the flight provider...";
  }
}

function setDefaultDate() {
  const input = form.elements.departureDate;
  const date = new Date();
  date.setDate(date.getDate() + 30);
  input.value = date.toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
