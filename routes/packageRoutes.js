const express = require("express");
const { getAllPackages, updatePackage } = require("../controllers/packageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to get all packages (Only employees can access)
router.get("/", authMiddleware("employee"), getAllPackages);

// Route to update a package's location/status (Only employees can access)
router.put("/:id", authMiddleware("employee"), updatePackage);

module.exports = router;