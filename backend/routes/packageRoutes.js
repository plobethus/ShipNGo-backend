/* 
 * /ShipNGo/backend/routes/packageRoutes.js
 * Routes for package-related endpoints for employee dashboards and customer package views.
 */

const express = require("express");
const { getAllPackages, updatePackage, getCustomerPackages } = require("../controllers/packageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Employee dashboard: Get packages with filtering
router.get("/dashboard/employee", authMiddleware("employee"), getAllPackages);
// Update package (status and/or location)
router.put("/:id", authMiddleware("employee"), updatePackage);
// Customer view: Get packages for a customer
router.get("/customer", authMiddleware("customer"), getCustomerPackages);

module.exports = router;