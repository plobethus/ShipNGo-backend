const express = require("express");
const path = require("path");
const { getAllPackages } = require("../controllers/packageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Render the Employee Dashboard WITH package data
router.get("/dashboard/employee", authMiddleware("employee"), async (req, res) => {
    try {
        const [packages] = await getAllPackages(); // Fetch packages
        res.json(packages); // Send JSON response
    } catch (error) {
        res.status(500).json({ message: "Error fetching packages", error: error.message });
    }
});

// Serve employee dashboard HTML
router.get("/employee", authMiddleware("employee"), (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/dashboard/employee.html"));
});

module.exports = router;