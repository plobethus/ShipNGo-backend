// /ShipNGo-frontend/scripts/notifications.js

async function fetchNotificationCount() {
    try {
      const res = await fetch("http://localhost:5000/notifications/unread");
      const data = await res.json();
      
      const countElement = document.getElementById("notification-count");
      if (data.count > 0) {
        countElement.textContent = data.count;
        countElement.style.display = "block";
      } else {
        countElement.style.display = "none";
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }
  
  // Run on page load and every 10 seconds
  document.addEventListener("DOMContentLoaded", fetchNotificationCount);
  setInterval(fetchNotificationCount, 10000);
  