const express = require("express");
const path = require("path");
const { getAllPackages, updatePackage } = require("../controllers/packageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard/employee", authMiddleware("employee"), getAllPackages);

// **New Route: Update a package**
router.put("/:id", authMiddleware("employee"), updatePackage);

// Serve employee dashboard HTML
router.get("/employee", authMiddleware("employee"), (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/dashboard/employee.html"));
});

module.exports = router;