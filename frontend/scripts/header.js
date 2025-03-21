// /ShipNGo/frontend/scripts/header.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("/includes/header.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("header-include").innerHTML = html;

      // After the header loads, update the dashboard link based on login info.
      const role = sessionStorage.getItem("role");
      const name = sessionStorage.getItem("name");
      const dashboardLi = document.getElementById("dashboard-li");
      const dashboardLink = document.getElementById("dashboard-link");

      if (role && name) {
        dashboardLi.style.display = "block";
        if (role === "customer") {
          dashboardLink.href = "/pages/customer.html";
          dashboardLink.textContent = "Customer Dashboard";
        } else if (role === "employee") {
          dashboardLink.href = "/pages/employee.html";
          dashboardLink.textContent = "Employee Dashboard";
        }
      } else {
        dashboardLi.style.display = "none";
      }
    })
    .catch((err) => console.error("Failed to load header:", err));
});