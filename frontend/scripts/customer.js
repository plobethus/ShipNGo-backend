// /ShipNGo/frontend/scripts/customer.js
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("/packages/customer", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    const packageContainer = document.getElementById("customer-packages");
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
        <tbody id="package-table"></tbody>
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
});