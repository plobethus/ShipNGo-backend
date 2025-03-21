//ShipNGo-backend/controllers/packageController.js

const db = require("../config/db");

exports.getAllPackages = async (req, res) => {
  try {
    // Check for employee token (expects employee_id)
    if (!req.user || !req.user.employee_id) {
      console.error("Employee ID missing from request.");
      return res.status(403).json({ message: "Unauthorized access. Employee ID required." });
    }

    const { status, customerName, startDate, endDate, minWeight, maxWeight, address } = req.query;
    let query = `
      SELECT p.package_id, p.status, p.location, p.weight, p.dimensions, p.address_from, p.address_to,
             c1.name AS sender_name, c2.name AS receiver_name
      FROM packages p
      LEFT JOIN customers c1 ON p.sender_id = c1.customer_id
      LEFT JOIN customers c2 ON p.receiver_id = c2.customer_id
      WHERE 1=1
    `;
    const values = [];
    if (status) {
      query += " AND p.status = ?";
      values.push(status);
    }
    if (customerName) {
      query += " AND (c1.name LIKE ? OR c2.name LIKE ?)";
      values.push(`%${customerName}%`, `%${customerName}%`);
    }
    if (startDate && endDate) {
      query += " AND p.created_at BETWEEN ? AND ?";
      values.push(startDate, endDate);
    }
    if (minWeight) {
      query += " AND p.weight >= ?";
      values.push(minWeight);
    }
    if (maxWeight) {
      query += " AND p.weight <= ?";
      values.push(maxWeight);
    }
    if (address) {
      query += " AND (p.address_from LIKE ? OR p.address_to LIKE ?)";
      values.push(`%${address}%`, `%${address}%`);
    }
    const [packages] = await db.execute(query, values);
    if (!packages.length) {
      return res.status(404).json({ message: "No packages found." });
    }
    res.json({ packages });
  } catch (error) {
    console.error("Error fetching packages for employees:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.updatePackage = async (req, res) => {
  const { id } = req.params;
  const { status, location } = req.body;
  if (!status && !location) {
    return res.status(400).json({ message: "Please provide status or location to update." });
  }
  try {
    let query = "UPDATE packages SET ";
    const updates = [];
    const values = [];
    if (status) {
      updates.push("status = ?");
      values.push(status);
    }
    if (location) {
      updates.push("location = ?");
      values.push(location);
    }
    query += updates.join(", ") + " WHERE package_id = ?";
    values.push(id);
    const [result] = await db.execute(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Package not found or no changes made." });
    }
    res.json({ message: "Package updated successfully." });
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCustomerPackages = async (req, res) => {
  try {
    if (!req.user || !req.user.customer_id) {
      console.error("Customer ID missing from request.");
      return res.status(400).json({ message: "Customer ID missing from request." });
    }
    const customerId = req.user.customer_id;
    console.log(`Fetching packages for customer ID: ${customerId}`);
    const [packages] = await db.execute(
      "SELECT package_id, sender_id, receiver_id, weight, status, address_from, address_to FROM packages WHERE sender_id = ? OR receiver_id = ?",
      [customerId, customerId]
    );
    console.log(`Packages found for customer ${customerId}:`, packages);
    res.json(packages);
  } catch (error) {
    console.error("Error fetching customer packages:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};