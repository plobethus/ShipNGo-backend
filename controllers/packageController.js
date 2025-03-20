const db = require("../config/db");

exports.getAllPackages = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "employee") {
            console.error("Unauthorized: Employee ID required.");
            return res.status(403).json({ message: "Unauthorized access." });
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

        if (!packages.length) {
            return res.status(404).json({ message: "No packages found." });
        }

        res.json({ packages });
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};