//ShipNGo-backend/routes/auth.js
// This route file handles authentication endpoints for login, registration,
// and serves the secure dashboard pages using auth middleware.
const express = require("express");
const { login, register } = require("../controllers/authController");
const router = express.Router();
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

// Login and registration endpoints
router.post("/login", login);
router.post("/register", register);

// Secure dashboard routes – these require proper authentication.
router.get("/dashboard/customer", authMiddleware("customer"), (req, res) => {
  res.sendFile(path.join(__dirname, "../ShipNGo-frontend/pages/dashboard/customer.html"));
});
router.get("/dashboard/employee", authMiddleware("employee"), (req, res) => {
  res.sendFile(path.join(__dirname, "../ShipNGo-frontend/pages/dashboard/employee.html"));
});

module.exports = router;