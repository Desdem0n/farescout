const form = document.querySelector("#flight-form");
const results = document.querySelector("#results");
const statusLabel = document.querySelector("#status-label");
const resultTitle = document.querySelector("#result-title");
const clearButton = document.querySelector("#clear-button");
const swapRouteButton = document.querySelector("#swap-route");
const destinationCountry = document.querySelector("#destination-country");
const routePresetButtons = document.querySelectorAll("[data-route-preset]");
const waitlistForm = document.querySelector("#waitlist-form");
const waitlistNote = document.querySelector("#waitlist-note");
const pilotForm = document.querySelector("#pilot-form");
const pilotNote = document.querySelector("#pilot-note");

const routePresets = {
  london: {
    origin: "WAW",
    destinationCountry: "GB",
    destination: "LTN",
    market: "PL",
    provider: "W6",
    cabinClass: "economy"
  },
  barcelona: {
    origin: "WAW",
    destinationCountry: "ES",
    destination: "BCN",
    market: "PL",
    provider: "ALL",
    cabinClass: "economy"
  },
  lisbon: {
    origin: "WAW",
    destinationCountry: "PT",
    destination: "LIS",
    market: "PL",
    provider: "TP",
    cabinClass: "economy"
  },
  "new-york": {
    origin: "WAW",
    destinationCountry: "US",
    destination: "JFK",
    market: "US",
    provider: "ALL",
    cabinClass: "economy"
  },
  "nyc-miami": {
    origin: "JFK",
    destinationCountry: "US",
    destination: "MIA",
    market: "US",
    provider: "ALL",
    cabinClass: "economy"
  },
  "la-vegas": {
    origin: "LAX",
    destinationCountry: "US",
    destination: "LAS",
    market: "US",
    provider: "ALL",
    cabinClass: "economy"
  },
  "chicago-nyc": {
    origin: "ORD",
    destinationCountry: "US",
    destination: "LGA",
    market: "US",
    provider: "ALL",
    cabinClass: "economy"
  },
  "sf-seattle": {
    origin: "SFO",
    destinationCountry: "US",
    destination: "SEA",
    market: "US",
    provider: "ALL",
    cabinClass: "economy"
  }
};

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
      ["LGA", "New York LaGuardia"],
      ["EWR", "Newark"],
      ["BOS", "Boston"],
      ["ORD", "Chicago O'Hare"],
      ["MDW", "Chicago Midway"],
      ["DCA", "Washington Reagan"],
      ["IAD", "Washington Dulles"],
      ["MIA", "Miami"],
      ["FLL", "Fort Lauderdale"],
      ["TPA", "Tampa"],
      ["LAX", "Los Angeles"],
      ["BUR", "Burbank"],
      ["SFO", "San Francisco"],
      ["OAK", "Oakland"],
      ["SJC", "San Jose"],
      ["SEA", "Seattle"],
      ["ATL", "Atlanta"],
      ["DFW", "Dallas Fort Worth"],
      ["DAL", "Dallas Love Field"],
      ["DEN", "Denver"],
      ["PHX", "Phoenix"],
      ["LAS", "Las Vegas"],
      ["MCO", "Orlando"],
      ["CLT", "Charlotte"],
      ["MSP", "Minneapolis St Paul"],
      ["DTW", "Detroit"],
      ["PHL", "Philadelphia"],
      ["SAN", "San Diego"],
      ["PDX", "Portland"],
      ["AUS", "Austin"],
      ["BNA", "Nashville"],
      ["MSY", "New Orleans"],
      ["SLC", "Salt Lake City"]
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
applyUrlSearchParams();

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
  syncActiveRoutePreset();
});

routePresetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyRoutePreset(button.dataset.routePreset);
  });
});

form.addEventListener("change", syncActiveRoutePreset);

waitlistForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(waitlistForm);
  const email = String(data.get("email") || "").trim();
  const route = String(data.get("route") || "").trim();
  const targetPrice = String(data.get("targetPrice") || "").trim();

  if (!email || !route || !targetPrice) {
    waitlistNote.textContent = "Add your email, route, and target price to join the beta list.";
    return;
  }

  const subject = encodeURIComponent("FareScout alert beta request");
  const body = encodeURIComponent([
    "Hi, I want to join the FareScout alert beta.",
    "",
    `Email: ${email}`,
    `Route to watch: ${route}`,
    `Target price: ${targetPrice}`,
    "",
    "I am interested in price-drop alerts for this route."
  ].join("\n"));

  waitlistNote.textContent = "Opening your email app with the beta request prepared.";
  window.location.href = `mailto:desmilke@gmail.com?subject=${subject}&body=${body}`;
});

pilotForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(pilotForm);
  const email = String(data.get("email") || "").trim();
  const routes = String(data.get("routes") || "").trim();
  const budget = String(data.get("budget") || "").trim();

  if (!email || !routes || !budget) {
    pilotNote.textContent = "Add your email, routes, and pilot budget to request access.";
    return;
  }

  const subject = encodeURIComponent("FareScout founder pilot request");
  const body = encodeURIComponent([
    "Hi, I am interested in FareScout founder pilot access.",
    "",
    `Email: ${email}`,
    `Routes to monitor: ${routes}`,
    `Pilot interest: ${budget}`,
    "",
    "Please send me details about the 30-day monitored route pilot."
  ].join("\n"));

  pilotNote.textContent = "Opening your email app with the pilot request prepared.";
  window.location.href = `mailto:desmilke@gmail.com?subject=${subject}&body=${body}`;
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

function applyRoutePreset(presetName) {
  const preset = routePresets[presetName];
  if (!preset) return;

  form.elements.origin.value = preset.origin;
  populateDestinationAirports(preset.destinationCountry, preset.destination);
  form.elements.market.value = preset.market;
  form.elements.provider.value = preset.provider;
  form.elements.cabinClass.value = preset.cabinClass;
  form.elements.nonStop.checked = false;

  routePresetButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.routePreset === presetName);
  });
}

function syncActiveRoutePreset() {
  const activePreset = Object.entries(routePresets).find(([, preset]) =>
    form.elements.origin.value.toUpperCase() === preset.origin
      && form.elements.destination.value === preset.destination
      && form.elements.destinationCountry.value === preset.destinationCountry
      && form.elements.market.value === preset.market
      && form.elements.provider.value === preset.provider
      && form.elements.cabinClass.value === preset.cabinClass
  )?.[0];

  routePresetButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.routePreset === activePreset);
  });
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

function applyUrlSearchParams() {
  const params = new URLSearchParams(window.location.search);
  const origin = params.get("origin");
  const destination = params.get("destination");
  const destinationCountryParam = params.get("destinationCountry");
  const fields = ["departureDate", "returnDate", "adults", "market", "provider", "cabinClass"];

  if (origin) form.elements.origin.value = origin.toUpperCase();

  if (destinationCountryParam) {
    const country = destinationCountryParam.toUpperCase();
    populateDestinationAirports(country, destination?.toUpperCase() || "");
  } else if (destination) {
    selectDestinationAirport(destination.toUpperCase());
  }

  fields.forEach((field) => {
    const value = params.get(field);
    if (value && form.elements[field]) {
      form.elements[field].value = value;
    }
  });

  if (params.get("nonStop") === "true") {
    form.elements.nonStop.checked = true;
  }

  syncActiveRoutePreset();

  if (params.get("search") === "1") {
    window.setTimeout(() => form.requestSubmit(), 250);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
