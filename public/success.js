const form = document.querySelector("#success-route-form");
const note = document.querySelector("#success-note");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const email = String(data.get("email") || "").trim();
  const routes = String(data.get("routes") || "").trim();
  const budget = String(data.get("budget") || "").trim();

  if (!email || !routes || !budget) {
    note.textContent = "Add your email, route, and monitoring goal.";
    return;
  }

  note.textContent = "Saving your pilot setup details...";

  try {
    const response = await fetch("/api/public/pilot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        routes,
        budget,
        source: "founder-pilot-success",
        campaign: "paid-founder-pilot",
        page: window.location.pathname
      })
    });
    const result = await response.json();

    if (!response.ok || !result.captured) {
      note.textContent = "Details received locally, but the private cockpit did not confirm capture. We will follow up manually.";
      return;
    }

    note.textContent = "Saved. We will follow up with your founder pilot setup next.";
    form.reset();
  } catch {
    note.textContent = "Could not save right now. Please reply to the checkout email with your route.";
  }
});
