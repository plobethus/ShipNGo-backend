// /ShipNGo/frontend/scripts/header.jsgi
document.addEventListener("DOMContentLoaded", () => {
  fetch("/includes/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header-include").innerHTML = html;

      const role = sessionStorage.getItem("role");
      const name = sessionStorage.getItem("name");

      const protectedNav = document.getElementById("protected-nav");
      const dashboardLi = document.getElementById("dashboard-li");
      const dashboardLink = document.getElementById("dashboard-link");
      const loginBtn = document.getElementById("login-btn");
      const logoutBtn = document.getElementById("logout-btn");

      // If user is logged in, show protected nav + correct dashboard
      if (role && name) {
        protectedNav.style.display = "inline-block";  // or "block"
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";

        // Show the correct dashboard link
        dashboardLi.style.display = "block";
        if (role === "customer") {
          dashboardLink.href = "/pages/customer.html";
          dashboardLink.textContent = "Customer Dashboard";
        } else if (role === "employee") {
          dashboardLink.href = "/pages/employee.html";
          dashboardLink.textContent = "Employee Dashboard";
        }
      } else {
        // Not logged in
        protectedNav.style.display = "none";
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
      }

      // Logout
      logoutBtn.addEventListener("click", () => {
        sessionStorage.clear();
        // Optionally also call an endpoint to clear the token cookie if needed
        window.location.href = "/pages/login.html";
      });
    })
    .catch(err => console.error("Failed to load header:", err));
});