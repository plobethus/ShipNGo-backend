// /ShipNGo-backend/routes/claimRoutes.js
const express = require("express");
const router = express.Router();

// Import the controller that handles claim logic
const claimController = require("../controllers/claimController");

// POST /claims - File a new claim
router.post("/", claimController.fileClaim);

// GET /claims - Retrieve all claims
router.get("/", claimController.getAllClaims);

module.exports = router;