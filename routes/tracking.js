const express = require("express");
const { getTrackingInfo, updateTracking } = require("../controllers/trackingController");

const router = express.Router();

// Get tracking details by package ID
router.get("/:package_id", getTrackingInfo);

// Add a new tracking update
router.post("/", updateTracking);

module.exports = router;