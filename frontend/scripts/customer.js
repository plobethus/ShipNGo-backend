// /ShipNGo-frontend/scripts/customer.js
document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Verify authentication by calling /auth/me.
    const authResponse = await fetch("https://shipngo-g9cpbhdvfhgca3cb.northcentralus-01.azurewebsites.net/auth/me", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    if (!authResponse.ok) {
      window.location.href = "../../login.html";
      return;
    }
    const authData = await authResponse.json();
    if (authData.role !== "customer") {
      window.location.href = "../../login.html";
      return;
    }
    // Optionally update a welcome message if element exists.
    const welcomeDiv = document.getElementById("welcome-message");
    if (welcomeDiv) {
      welcomeDiv.innerText = `Welcome, ${authData.name} (Customer)`;
    }
    // Load customer packages.
    await loadPackages();
  } catch (error) {
    console.error("Error verifying authentication:", error);
    window.location.href = "../../login.html";
  }
});

async function loadPackages() {
  try {
    const response = await fetch("https://shipngo-g9cpbhdvfhgca3cb.northcentralus-01.azurewebsites.net/packages/customer", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    const packageContainer = document.getElementById("customer-packages");
    // Replace content with a table structure for customer packages.
    packageContainer.innerHTML = `
      <h2>Your Packages</h2>
      <table>
        <thead>
          <tr>
            <th>Package ID</th>
            <th>From</th>
            <th>To</th>
            <th>Weight</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="package-table">
          <!-- Customer package rows will be inserted here -->
        </tbody>
      </table>
    `;
    const packageTable = document.getElementById("package-table");
    if (!data || data.length === 0) {
      packageTable.innerHTML = "<tr><td colspan='5'>No packages found.</td></tr>";
    } else {
      data.forEach(pkg => {
        const row = `
          <tr>
            <td>${pkg.package_id}</td>
            <td>${pkg.address_from}</td>
            <td>${pkg.address_to}</td>
            <td>${pkg.weight} kg</td>
            <td>${pkg.status}</td>
          </tr>
        `;
        packageTable.innerHTML += row;
      });
    }
  } catch (error) {
    console.error("Error fetching customer packages:", error);
    document.getElementById("customer-packages").innerHTML = `<p>Error fetching packages.</p>`;
  }
}