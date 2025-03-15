const express = require("express");
const { login } = require("../controllers/authController");
const { register } = require("../controllers/authController");

const router = express.Router();

// Routes for handling authentication (login and register)
// POST /login - User login route
router.post("/login", login); //login requests
// POST /register - User registration route
router.post("/register", register) //registration requests

module.exports = router;
