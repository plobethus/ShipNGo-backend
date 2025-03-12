const express = require("express");
const { login } = require("../controllers/authController");
const { register } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/register", register)

module.exports = router;

