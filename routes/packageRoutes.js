const express = require("express");
const path = require("path");
const { getAllPackages } = require("../controllers/packageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard/employee", authMiddleware("employee"), getAllPackages);

// Serve employee dashboard HTML
router.get("/employee", authMiddleware("employee"), (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/dashboard/employee.html"));
});

module.exports = router;