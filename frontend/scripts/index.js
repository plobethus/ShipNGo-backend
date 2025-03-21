// /ShipNGo-frontend/scripts/index.js

document.addEventListener("DOMContentLoaded", function () {
    const trackingForm = document.getElementById("tracking-form");
  
    if (trackingForm) {
      trackingForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const trackingID = document.getElementById("tracking_id").value.trim();
        const resultElement = document.getElementById("tracking-result");
  
        if (!trackingID) {
          resultElement.textContent = "Please enter a valid Tracking ID.";
          resultElement.style.color = "red";
          return;
        }
  
        try {
          const response = await fetch(`https://shipngo-g9cpbhdvfhgca3cb.northcentralus-01.azurewebsites.net/tracking/${trackingID}`);
          const data = await response.json();
  
          if (response.ok) {
            window.location.href = `./pages/trackingpage.html?trackingNumber=${trackingID}`;
          } else {
            resultElement.textContent = data.message || "Tracking ID not found.";
            resultElement.style.color = "red";
          }
        } catch (error) {
          console.error("Error fetching tracking info:", error);
          resultElement.textContent = "An error occurred while fetching tracking details.";
          resultElement.style.color = "red";
        }
      });
    }
  });