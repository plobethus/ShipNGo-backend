//ShipNGo-backend/routes/auth.js

const express = require("express");
const { login, register } = require("../controllers/authController");
const router = express.Router();

// Routes for handling authentication (login and register)
router.post("/login", login);
router.post("/register", register);

// (Optional) Secure dashboard routes – these can be removed if you already serve dashboards via server.js
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/dashboard/customer", authMiddleware("customer"), (req, res) => {
  res.sendFile(path.join(__dirname, "../ShipNGo-frontend/pages/dashboard/customer.html"));
});
router.get("/dashboard/employee", authMiddleware("employee"), (req, res) => {
  res.sendFile(path.join(__dirname, "../ShipNGo-frontend/pages/dashboard/employee.html"));
});

module.exports = router;