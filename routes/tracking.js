
const express = require("express");
const { getTrackingInfo, updateTracking } = require("../controllers/trackingController");

const router = express.Router();

// Get tracking details by package ID
router.get("/:package_id", getTrackingInfo);

// Add a new tracking update
router.post("/", updateTracking);

module.exports = router;

/*
const express = require("express");
const db = require("../db"); // Import MySQL connection
const router = express.Router();

// Get tracking history by package ID
router.get("/:packageId", (req, res) => {
  const packageId = req.params.packageId;

  const query = `
    SELECT 
      th.tracking_id,
      th.package_id,
      w.name AS warehouse_location,
      p.name AS post_office_location,
      th.date,
      th.status,
      th.updated_at,
      r.route_name
    FROM trackinghistory th
    LEFT JOIN warehouses w ON th.warehouse_location = w.ware_id
    LEFT JOIN postoffices p ON th.post_office_location = p.post_id
    LEFT JOIN routes r ON th.route_id = r.route_id
    WHERE th.package_id = ?
    ORDER BY th.updated_at DESC;
  `;

  db.query(query, [packageId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No tracking history found for this package" });
    }

    res.json({ packageId, history: results });
  });
});

module.exports = router;
*/