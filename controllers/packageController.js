const db = require("../config/db");

// Get all packages (Only employees can access). This function correctly handles fetching package data.
exports.getAllPackages = async (req, res) => {
    try {
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
        console.error("Error fetching packages:", error);
        res.status(500).json({ message: "Server error", error: error.message });
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

        await db.execute(query, values);

        res.json({ message: "Package updated successfully." });
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};