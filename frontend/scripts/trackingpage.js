/* 
 * /ShipNGo/frontend/scripts/trackingpage.js
 * Fetches and displays tracking details based on the tracking number provided in the URL.
 */

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const trackingNumber = urlParams.get('trackingNumber');
  if (!trackingNumber) {
    document.getElementById("tracking-info").innerHTML = "<p style='color:red;'>No tracking number provided in URL.</p>";
    return;
  }
  try {
    const fetchUrl = `/tracking/${encodeURIComponent(trackingNumber)}`;
    const response = await fetch(fetchUrl);
    const data = await response.json();
    if (!response.ok || !data.history || data.history.length === 0) {
      document.getElementById("tracking-info").innerHTML = "<p style='color:red;'>Tracking info not found.</p>";
      return;
    }
    document.getElementById("tracking-id").textContent = data.tracking_id;
    document.getElementById("tracking-status").textContent = data.history[0].status;
    document.getElementById("post-office").textContent = data.history[0].post_office_address || "N/A";
    document.getElementById("warehouse").textContent = data.history[0].warehouse_location || "N/A";
    document.getElementById("route").textContent = data.history[0].route_name || "N/A";
  } catch (error) {
    console.error("Error fetching tracking info:", error);
    document.getElementById("tracking-info").innerHTML = "<p style='color:red;'>An error occurred while fetching tracking details.</p>";
  }
});