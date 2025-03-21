/* 
 * /ShipNGo/backend/routes/auth.js
 * Routes for authentication endpoints (login, registration) and secure dashboard file serving.
 */

const express = require("express");
const { login, register } = require("../controllers/authController");
const router = express.Router();
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

// Login and registration endpoints.
router.post("/login", login);
router.post("/register", register);

// Serve secure dashboard pages using updated frontend paths.
router.get("/dashboard/customer", authMiddleware("customer"), (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/dashboard/customer.html"));
});
router.get("/dashboard/employee", authMiddleware("employee"), (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/dashboard/employee.html"));
});

// /auth/me endpoint returns the decoded user info from the token.
router.get("/me", authMiddleware(), (req, res) => {
  res.json({ role: req.user.role, name: req.user.name });
});

module.exports = router;