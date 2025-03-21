// /ShipNGo/frontend/scripts/header.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("/includes/header.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("header-include").innerHTML = html;

      // After header loads, run post-load logic
      const role = sessionStorage.getItem("role");
      const name = sessionStorage.getItem("name");

      // Dashboard link elements
      const dashboardLi = document.getElementById("dashboard-li");
      const dashboardLink = document.getElementById("dashboard-link");

      // Login/Logout elements
      const loginBtn = document.getElementById("login-btn");
      const logoutBtn = document.getElementById("logout-btn");

      // If user is logged in (role + name in sessionStorage)
      if (role && name) {
        // Show dashboard link
        dashboardLi.style.display = "block";
        if (role === "customer") {
          dashboardLink.href = "/pages/customer.html";
          dashboardLink.textContent = "Customer Dashboard";
        } else if (role === "employee") {
          dashboardLink.href = "/pages/employee.html";
          dashboardLink.textContent = "Employee Dashboard";
        }

        // Hide login, show logout
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
      } else {
        // Not logged in
        dashboardLi.style.display = "none";
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
      }

      // Logout behavior
      logoutBtn.addEventListener("click", () => {
        // Clear session storage (removes role & name)
        sessionStorage.clear();
        // Optionally, you might also call an endpoint to clear the cookie
        // e.g. fetch("/auth/logout", { method: "POST", credentials: "include" })

        // Redirect to login
        window.location.href = "/pages/login.html";
      });
    })
    .catch((err) => console.error("Failed to load header:", err));
});