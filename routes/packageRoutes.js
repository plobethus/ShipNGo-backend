const express = require("express");
const path = require("path");
const { getAllPackages } = require("../controllers/packageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Render the Employee Dashboard WITH package data
router.get("/dashboard/employee", authMiddleware("employee"), async (req, res) => {
    try {
        const [packages] = await getAllPackages(); // Fetch packages
        res.render("employee", { packages }); // Render `employee.ejs` with data
    } catch (error) {
        res.status(500).send("Error loading employee dashboard");
    }
});

// Serve employee dashboard HTML
router.get("/employee", authMiddleware("employee"), (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/dashboard/employee.html"));
});

module.exports = router;