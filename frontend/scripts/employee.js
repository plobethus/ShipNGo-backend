// /ShipNGo-frontend/scripts/employee.js
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Verify authentication using /auth/me.
    const authResponse = await fetch("https://shipngo-g9cpbhdvfhgca3cb.northcentralus-01.azurewebsites.net/auth/me", {
      method: "GET",
      credentials: "include",  // Ensures the cookie is sent
      headers: { "Content-Type": "application/json" }
    });
    if (!authResponse.ok) {
      window.location.href = "../login.html";
      return;
    }
    const authData = await authResponse.json();
    if (authData.role !== "employee") {
      window.location.href = "../login.html";
      return;
    }
    // Optionally update a welcome message.
    const welcomeDiv = document.getElementById("welcome-message");
    if (welcomeDiv) {
      welcomeDiv.innerText = `Welcome, ${authData.name} (Employee)`;
    }
    // Set up event listeners for filter inputs.
    document.getElementById("status-filter")?.addEventListener("change", loadPackages);
    document.getElementById("search-customer")?.addEventListener("input", debounce(loadPackages, 500));
    document.getElementById("start-date")?.addEventListener("change", loadPackages);
    document.getElementById("end-date")?.addEventListener("change", loadPackages);
    document.getElementById("min-weight")?.addEventListener("input", debounce(loadPackages, 500));
    document.getElementById("max-weight")?.addEventListener("input", debounce(loadPackages, 500));
    document.getElementById("address-filter")?.addEventListener("input", debounce(loadPackages, 500));

    // Load packages after authentication is confirmed.
    await loadPackages();
  } catch (error) {
    console.error("Error during authentication:", error);
    window.location.href = "../login.html";
  }
});

// Debounce function.
function debounce(func, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(), delay);
  };
}

async function loadPackages() {
  console.log("Fetching packages...");
  const params = new URLSearchParams({
    status: document.getElementById("status-filter")?.value || "",
    customerName: document.getElementById("search-customer")?.value || "",
    startDate: document.getElementById("start-date")?.value || "",
    endDate: document.getElementById("end-date")?.value || "",
    minWeight: document.getElementById("min-weight")?.value || "",
    maxWeight: document.getElementById("max-weight")?.value || "",
    address: document.getElementById("address-filter")?.value || ""
  });
  const url = `https://shipngo-g9cpbhdvfhgca3cb.northcentralus-01.azurewebsites.net/packages/dashboard/employee?${params}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",  // Ensure cookies are sent with the request
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching packages:", errorData.message);
      return;
    }
    const data = await response.json();
    const packageTable = document.getElementById("package-table");
    if (!packageTable) {
      console.error("No element with id 'package-table' found.");
      return;
    }
    packageTable.innerHTML = "";
    if (!data.packages || data.packages.length === 0) {
      packageTable.innerHTML = "<tr><td colspan='8'>No packages found.</td></tr>";
      return;
    }
    data.packages.forEach(pkg => {
      const row = `
        <tr>
          <td>${pkg.package_id}</td>
          <td>${pkg.status}</td>
          <td>${pkg.weight || "N/A"}</td>
          <td>${pkg.dimensions || "N/A"}</td>
          <td>${pkg.address_from || "N/A"}</td>
          <td>${pkg.address_to || "N/A"}</td>
          <td>${pkg.sender_name || "Unknown"} → ${pkg.receiver_name || "Unknown"}</td>
          <td>
            <button onclick="quickUpdate(${pkg.package_id}, 'In Transit')">In Transit</button>
            <button onclick="quickUpdate(${pkg.package_id}, 'Delivered')">Delivered</button>
          </td>
        </tr>
      `;
      packageTable.innerHTML += row;
    });
  } catch (error) {
    console.error("Error loading packages:", error);
  }
}

async function quickUpdate(packageId, newStatus) {
  try {
    const response = await fetch(`https://shipngo-g9cpbhdvfhgca3cb.northcentralus-01.azurewebsites.net/packages/${packageId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Error updating package:", data.message);
      alert(`Error updating package: ${data.message}`);
      return;
    }
    alert("Package updated successfully!");
    await loadPackages();  // Refresh data after update.
  } catch (error) {
    console.error("Error updating package:", error);
    alert("Error updating package. Please try again.");
  }
}