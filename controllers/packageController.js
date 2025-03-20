const db = require("../config/db");

// Get all packages (Only employees can access). This function correctly handles fetching package data.
exports.getAllPackages = async (req, res) => {
    try {
        if (!req.user || !req.user.employee_id) {
            console.error("Employee ID missing from request.");
            return res.status(403).json({ message: "Unauthorized access. Employee ID required." });
        }

        console.log(`Fetching all packages for employee ID: ${req.user.employee_id}`);

        const [packages] = await db.execute("SELECT * FROM packages");
        console.log("Fetched Packages:", packages); // Debugging log
        if (!Array.isArray(packages)) {
            return res.status(500).json({ message: "Invalid data format received from DB." });
        }

        if (!packages || packages.length === 0) {
            return res.status(404).json({ message: "No packages found." });
        }

        res.json({ packages });
    } catch (error) {
        console.error("Error fetching packages for employees:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update package location or status
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

// New function: Get packages for a customer
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