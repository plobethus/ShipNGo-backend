// /ShipNGo/frontend/scripts/header.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("/includes/header.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("header-include").innerHTML = html;

      // Retrieve user info from sessionStorage
      const role = sessionStorage.getItem("role");
      const dashboardLink = document.getElementById("dashboard-link");
      const loginBtn = document.getElementById("login-btn");
      const logoutBtn = document.getElementById("logout-btn");
      const protectedNav = document.getElementById("protected-nav");

      if (role) {
        // Show protected nav items
        protectedNav.style.display = "flex";
        // Hide login, show logout
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";

        // Set dashboard link based on role
        if (role === "customer") {
          dashboardLink.href = "/pages/customer.html";
          dashboardLink.textContent = "Customer Dashboard";
        } else if (role === "employee") {
          dashboardLink.href = "/pages/employee.html";
          dashboardLink.textContent = "Employee Dashboard";
        }
      } else {
        // Not logged in: hide protected nav, show login, hide logout
        protectedNav.style.display = "none";
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
      }

      logoutBtn.addEventListener("click", () => {
        sessionStorage.clear();
        // Optionally, you might also call an endpoint to clear the token cookie
        window.location.href = "/pages/login.html";
      });
    })
    .catch((err) => console.error("Failed to load header:", err));
});