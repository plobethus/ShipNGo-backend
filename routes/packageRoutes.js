const express = require("express");
const { getAllPackages, updatePackage, getCustomerPackages } = require("../controllers/packageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Employee routes
router.get("/dashboard/employee", authMiddleware("employee"), getAllPackages);
router.put("/:id", authMiddleware("employee"), updatePackage);

// Customer route
router.get("/customer", authMiddleware("customer"), getCustomerPackages);

module.exports = router;