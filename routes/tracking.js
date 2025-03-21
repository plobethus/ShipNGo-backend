//ShipNGo-backend/routes/tracking.js

const express = require("express");
const { getTrackingInfo, updateTracking } = require("../controllers/trackingController");

const router = express.Router();

// Get tracking details by tracking ID
router.get("/:tracking_id", (req, res, next) => {
  console.log("Received request for tracking ID:", req.params.tracking_id);
  next();
}, getTrackingInfo);

// Add a new tracking update
router.post("/", updateTracking);

module.exports = router;