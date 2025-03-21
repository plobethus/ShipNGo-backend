// /ShipNGo-frontend/scripts/customer_registration.js

document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("login-form");
  
    registrationForm.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const name = document.getElementById("name").value.trim();
      const address = document.getElementById("address").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
  
      if (!name || !address || !phone || !email || !password) {
        document.getElementById("message").textContent = "All fields are required.";
        return;
      }
  
      try {
        const response = await fetch("https://shipngo-g9cpbhdvfhgca3cb.northcentralus-01.azurewebsites.net/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, address, phone, email, password })
        });
        const data = await response.json();
        if (response.ok) {
          document.getElementById("message").textContent = "Registration successful! Redirecting...";
          sessionStorage.setItem("token", data.token);
          setTimeout(() => {
            window.location.href = "./login.html";
          }, 2000);
        } else {
          document.getElementById("message").textContent = data.message || "Registration failed.";
        }
      } catch (error) {
        console.error("Error during registration:", error);
        document.getElementById("message").textContent = "Server error. Please try again later.";
      }
    });
  });