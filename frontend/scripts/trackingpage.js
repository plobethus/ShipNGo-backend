// /ShipNGo-frontend/scripts/trackingpage.js

document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const trackingNumber = urlParams.get('trackingNumber');
    console.log("Extracted tracking number:", trackingNumber);
    if (!trackingNumber) {
      document.getElementById("tracking-info").innerHTML = "<p style='color:red;'>No tracking number provided in URL.</p>";
      return;
    }
    try {
      const apiBaseUrl = "https://shipngo-g9cpbhdvfhgca3cb.northcentralus-01.azurewebsites.net";
      const fetchUrl = `${apiBaseUrl}/tracking/${encodeURIComponent(trackingNumber)}`;
      console.log("Fetching tracking info from:", fetchUrl);
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