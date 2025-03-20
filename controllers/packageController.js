const db = require("../config/db");

// Get all packages (Employees can access and filter by status or search by customer name)
exports.getAllPackages = async (req, res) => {
    try {
        if (!req.user || !req.user.employee_id) {
            console.error("Employee ID missing from request.");
            return res.status(403).json({ message: "Unauthorized access. Employee ID required." });
        }

        const { status, customerName } = req.query;
        let query = `
            SELECT p.package_id, p.status, p.location, c1.name AS sender_name, c2.name AS receiver_name 
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

        const [packages] = await db.execute(query, values);

        if (!Array.isArray(packages) || packages.length === 0) {
            return res.status(404).json({ message: "No packages found." });
        }

        res.json({ packages });
    } catch (error) {
        console.error("Error fetching packages for employees:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update package status quickly
exports.updatePackage = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Please provide a status to update." });
    }

    try {
        const [result] = await db.execute("UPDATE packages SET status = ? WHERE package_id = ?", [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Package not found or no changes made." });
        }

        res.json({ message: "Package status updated successfully." });
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};