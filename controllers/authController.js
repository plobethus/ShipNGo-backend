const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Check if JWT_SECRET is set before running the server
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not set.");
  process.exit(1); // Stop the server if JWT_SECRET is missing
}

exports.login = async (req, res) => {
  //extracts email and password from the request
  const { email, password } = req.body;

  // Check if email or password is provided
  if (email == null || password == null){
    return res.status(401).json({ message: "Invalid email or password" });
  }

  try { //queries customer and employee tables to check if email exists
    const [customerRows] = await db.execute(
      "SELECT customer_id AS id, name, password, 'customer' AS role FROM customers WHERE email = ?", [email]
    );
    const [employeeRows] = await db.execute(
      "SELECT employee_id AS id, name, password, 'employee' AS role FROM employees WHERE email = ?", [email]
    );
    
    const rows = customerRows.length > 0 ? customerRows : employeeRows;

    // If no user is found with the provided email
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0]; //checks if password exists 
    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the password does not match
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generates a JWT token for the authenticated user
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, role: user.role, name: user.name });
  } catch (error) {
    console.error("Login error:", error);
    // If an error occurs, return a server error response
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.register = async (req, res) => {
  const { email, password, address, username, name, phone} = req.body;

  // Check if email or password is provided
  if (email == null || password == null){
    return res.status(401).json({ message: "Invalid email or password" });
  }

  try {
    // Validate password length
    if (!password || typeof password !== "string" || password.length < 8 || password.length > 15) {
      return res.status(400).json({ message: "Password must be between 8 and 15 characters." });
    } 

    // Hashes the password and stores user data in the database
    const hashed_password = await bcrypt.hash(password, 10)

    const [result] = await db.execute("INSERT INTO customers (name, address, phone, email, username, password) VALUES (?, ?, ?, ?, ?, ?)", [name, address, phone, email, username, hashed_password]);

    console.log(result)

    //jwt login token for authMiddleware.js
    // Generates a JWT token for the newly registered user
    const token = jwt.sign({ userId: result.insertId, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Registration error:", error);
    // If an error occurs, return a server error response
    res.status(500).json({ message: "Server error", error: error.message });
  }
  document.addEventListener("DOMContentLoaded", async () => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token || !role) {
        window.location.href = "../login.html"; // Redirect to login if not authenticated
        return;
    }

    // Set welcome message
    const welcomeDiv = document.getElementById("welcome-message");
    if (welcomeDiv) {
        const name = sessionStorage.getItem("name") || "User";
        welcomeDiv.innerText = `Welcome, ${name} (${role === "customer" ? "Customer" : "Employee"})!`;
    }

    if (role === "employee") {
        await loadPackages();
    }
});

async function loadPackages() {
    try {
        const response = await fetch("https://shipngo-backend/api/packages", {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        });
        const packages = await response.json();

        const packageTable = document.getElementById("package-table").querySelector("tbody");
        packageTable.innerHTML = ""; // Clear existing data

        packages.forEach(pkg => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${pkg.package_id}</td>
                <td>${pkg.status}</td>
                <td>${pkg.location}</td>
                <td><button onclick="editPackage(${pkg.package_id})">Edit</button></td>
            `;
            packageTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching packages:", error);
    }
}

document.getElementById("update-package-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const packageId = document.getElementById("package-id").value;
    const newStatus = document.getElementById("new-status").value;
    const newLocation = document.getElementById("new-location").value;

    if (!packageId || (!newStatus && !newLocation)) {
        alert("Please enter Package ID and at least one field to update.");
        return;
    }

    try {
        const response = await fetch(`https://shipngo-backend/api/packages/${packageId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: newStatus, location: newLocation }),
        });

        if (response.ok) {
            alert("Package updated successfully!");
            await loadPackages();
        } else {
            alert("Failed to update package.");
        }
    } catch (error) {
        console.error("Error updating package:", error);
    }
});
};
