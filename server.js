import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(rootDir, "public");

loadDotEnv();

const port = Number(process.env.PORT || 4000);
const ignavBaseUrl = process.env.IGNAV_BASE_URL || "https://ignav.com/api";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        provider: "ignav",
        configured: Boolean(process.env.IGNAV_API_KEY),
        baseUrl: ignavBaseUrl
      });
      return;
    }

    if (url.pathname === "/api/search") {
      await handleFlightSearch(url, res);
      return;
    }

    await serveStatic(url.pathname, res);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Something went wrong while processing the request." });
  }
});

server.listen(port, () => {
  console.log(`FareScout running at http://localhost:${port}`);
});

async function handleFlightSearch(url, res) {
  const required = ["origin", "destination", "departureDate", "adults"];
  const missing = required.filter((key) => !url.searchParams.get(key));

  if (missing.length) {
    sendJson(res, 400, { error: `Missing required fields: ${missing.join(", ")}` });
    return;
  }

  const origin = normalizeAirportCode(url.searchParams.get("origin"));
  const destination = normalizeAirportCode(url.searchParams.get("destination"));
  const departureDate = url.searchParams.get("departureDate");
  const returnDate = url.searchParams.get("returnDate");
  const adults = clampInteger(url.searchParams.get("adults"), 1, 9, 1);
  const market = normalizeMarket(url.searchParams.get("market") || "US");
  const provider = normalizeProvider(url.searchParams.get("provider") || "ALL");
  const cabinClass = normalizeCabinClass(url.searchParams.get("cabinClass") || "economy");
  const nonStop = url.searchParams.get("nonStop") === "true";

  if (origin.length !== 3 || destination.length !== 3) {
    sendJson(res, 400, { error: "Origin and destination must be three-letter IATA codes." });
    return;
  }

  if (origin === destination) {
    sendJson(res, 400, { error: "Origin and destination need to be different." });
    return;
  }

  if (returnDate && returnDate < departureDate) {
    sendJson(res, 400, { error: "Return date must be the same day as departure or later." });
    return;
  }

  if (!process.env.IGNAV_API_KEY) {
    sendJson(res, 503, {
      error: "Ignav API key is not configured.",
      hint: "Create a .env file from .env.example and add IGNAV_API_KEY."
    });
    return;
  }

  const endpoint = returnDate ? "/fares/round-trip" : "/fares/one-way";
  const body = {
    origin,
    destination,
    departure_date: departureDate,
    adults,
    market,
    cabin_class: cabinClass,
    departure_time_range: {
      earliest_hour: 0,
      latest_hour: 23
    }
  };

  if (returnDate) body.return_date = returnDate;
  if (returnDate) {
    body.return_time_range = {
      earliest_hour: 0,
      latest_hour: 23
    };
  }
  if (nonStop) body.max_stops = 0;
  if (provider !== "ALL") body.airlines_include = [provider];

  const response = await fetch(`${ignavBaseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.IGNAV_API_KEY
    },
    body: JSON.stringify(body)
  });
  const payload = await response.json();

  if (!response.ok) {
    sendJson(res, response.status, {
      error: "The flight provider rejected the search.",
      details: formatProviderError(payload)
    });
    return;
  }

  let offers = (payload.data || [])
    .concat(payload.itineraries || [])
    .map(normalizeOffer)
    .sort((a, b) => a.price.total - b.price.total);

  if (provider !== "ALL") {
    offers = offers.filter((offer) => hasProvider(offer, provider));
  }

  sendJson(res, 200, {
    count: offers.length,
    market,
    providerFilter: provider,
    cabinClass,
    searchWindow: createSearchWindow(departureDate),
    cheapest: offers[0] || null,
    offers
  });
}

function normalizeOffer(offer) {
  const itineraries = [offer.outbound, offer.inbound]
    .filter(Boolean)
    .map((leg) => ({
      duration: formatMinutes(leg.duration_minutes),
      segments: (leg.segments || []).map((segment) => ({
        from: segment.departure_airport,
        to: segment.arrival_airport,
        departure: segment.departure_time_local,
        arrival: segment.arrival_time_local,
        carrierCode: segment.marketing_carrier_code || "",
        carrier: segment.operating_carrier_name || leg.carrier || segment.marketing_carrier_code || "Unknown carrier",
        number: segment.flight_number || "",
        aircraft: segment.aircraft || "",
        stops: 0
      }))
    }));

  return {
    id: offer.ignav_id,
    price: {
      total: Number(offer.price.amount),
      formatted: `${offer.price.currency} ${Number(offer.price.amount).toFixed(2)}`,
      currency: offer.price.currency
    },
    seatsAvailable: null,
    cabinClass: offer.cabin_class,
    itineraries
  };
}

function hasProvider(offer, provider) {
  return offer.itineraries.some((itinerary) =>
    itinerary.segments.some((segment) => segment.carrierCode === provider)
  );
}

function formatProviderError(payload) {
  const detail = payload.message || payload.error || payload.errors?.[0] || payload;

  if (typeof detail === "string") {
    return detail;
  }

  if (detail && typeof detail === "object") {
    return detail.message || detail.detail || detail.title || JSON.stringify(detail);
  }

  return "Check the route, dates, market, or API key.";
}

async function serveStatic(pathname, res) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const requestedPath = normalize(join(publicDir, safePath));

  if (!requestedPath.startsWith(publicDir) || !existsSync(requestedPath)) {
    sendText(res, 404, "Not found");
    return;
  }

  const contents = await readFile(requestedPath);
  sendStatic(res, requestedPath, contents);
}

function loadDotEnv() {
  const envPath = join(rootDir, ".env");
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function normalizeAirportCode(value) {
  return String(value || "").trim().toUpperCase().slice(0, 3);
}

function normalizeMarket(value) {
  return String(value || "US").trim().toUpperCase().slice(0, 2);
}

function normalizeProvider(value) {
  return String(value || "ALL").trim().toUpperCase().slice(0, 3);
}

function normalizeCabinClass(value) {
  const normalized = String(value || "economy").trim().toLowerCase();
  const allowed = new Set(["economy", "premium_economy", "business", "first"]);
  return allowed.has(normalized) ? normalized : "economy";
}

function createSearchWindow(dateValue) {
  const start = new Date(`${dateValue}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    startLocal: formatDateBoundary(start),
    endLocal: formatDateBoundary(end),
    displayEndLocal: formatDateEndBoundary(start)
  };
}

function formatDateBoundary(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 00:00`;
}

function formatDateEndBoundary(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 23:59`;
}

function clampInteger(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

function formatMinutes(value) {
  const total = Number(value);
  if (!Number.isFinite(total)) return "";
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return [hours ? `${hours}h` : "", minutes ? `${minutes}m` : ""].filter(Boolean).join(" ");
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    ...securityHeaders(),
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

function sendText(res, status, data) {
  res.writeHead(status, {
    ...securityHeaders(),
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(data);
}

function sendStatic(res, requestedPath, contents) {
  const extension = extname(requestedPath);
  const isAsset = requestedPath.includes(`${publicDir}\\assets\\`) || requestedPath.includes(`${publicDir}/assets/`);

  res.writeHead(200, {
    ...securityHeaders(),
    "Content-Type": mimeTypes[extension] || "application/octet-stream",
    "Cache-Control": isAsset ? "public, max-age=604800, immutable" : "no-cache"
  });
  res.end(contents);
}

function securityHeaders() {
  return {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "form-action 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'"
    ].join("; ")
  };
}
