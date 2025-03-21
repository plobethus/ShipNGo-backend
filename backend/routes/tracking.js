/* 
 * /ShipNGo/backend/routes/tracking.js
 * Routes for retrieving tracking details and posting new tracking updates.
 */

const express = require("express");
const { getTrackingInfo, updateTracking } = require("../controllers/trackingController");

const router = express.Router();

// Get tracking details by tracking ID
router.get("/:tracking_id", (req, res, next) => {
  next();
}, getTrackingInfo);

// Add a new tracking update
router.post("/", updateTracking);

module.exports = router;