// /ShipNGo-frontend/scripts/header.js
// This loads the header HTML and applies login display logic,
// including updating the Dashboard link based on the user's role.

document.addEventListener("DOMContentLoaded", () => {
  fetch("/includes/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header-include").innerHTML = html;

      // After header loads, update user info and the Dashboard link.
      const role = sessionStorage.getItem("role");
      const name = sessionStorage.getItem("name");
      const userStatus = document.getElementById("user-status");
      const logoutBtn = document.getElementById("logout-btn");
      const dashboardLi = document.getElementById("dashboard-li");
      const dashboardLink = document.getElementById("dashboard-link");

      if (role && name) {
        userStatus.textContent = `Logged in as ${name} (${role})`;
        logoutBtn.style.display = "inline-block";

        // Set Dashboard link based on role.
        if (role === "customer") {
          dashboardLink.href = "dashboard/customer.html";
          dashboardLink.innerText = "Customer Dashboard";
        } else if (role === "employee") {
          dashboardLink.href = "dashboard/employee.html";
          dashboardLink.innerText = "Employee Dashboard";
        }
        dashboardLi.style.display = "block";
      } else {
        userStatus.textContent = "Guest";
        logoutBtn.style.display = "none";
        dashboardLi.style.display = "none";
      }

      logoutBtn?.addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "/pages/login.html";
      });
    })
    .catch(err => console.error("Failed to load header:", err));
});