const express = require("express");
const { login } = require("../controllers/authController");
const { register } = require("../controllers/authController");

const router = express.Router();

// Routes for handling authentication (login and register)
router.post("/login", login);
router.post("/register", register);

const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

// Secure dashboard routes
router.get("/dashboard/customer", authMiddleware("customer"), (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/dashboard/customer.html"));
});

router.get("/dashboard/employee", authMiddleware("employee"), (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/pages/dashboard/employee.html"));
});

module.exports = router;