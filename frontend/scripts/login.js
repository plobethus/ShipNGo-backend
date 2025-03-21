/* 
 * /Login/frontend/scripts/login.js
 * Handles user login and redirects based on role.
 */

document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageElement = document.getElementById("message");

  messageElement.innerText = "";

  if (!email || !password) {
    messageElement.innerText = "Please enter both email and password.";
    return;
  }

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });
    const data = await response.json();
    if (response.ok) {
      sessionStorage.setItem("role", data.role);
      sessionStorage.setItem("name", data.name);
      if (data.role === "customer") {
        window.location.href = "dashboard/customer.html";
      } else if (data.role === "employee") {
        window.location.href = "dashboard/employee.html";
      }
    } else {
      messageElement.innerText = data.message || "Login failed. Please try again.";
    }
  } catch (error) {
    messageElement.innerText = "Network error. Please try again later.";
    console.error("Login error:", error);
  }
});