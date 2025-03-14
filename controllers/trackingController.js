const db = require("../config/db");

exports.getTrackingInfo = async (req, res) => {
  const { package_id } = req.params;

  try {
    const [rows] = await db.execute("SELECT * FROM tracking WHERE package_id = ?", [package_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Tracking info not found" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error fetching tracking info:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTracking = async (req, res) => {
  const { package_id, status, location } = req.body;

  try {
    await db.execute("INSERT INTO tracking (package_id, status, location, updated_at) VALUES (?, ?, ?, NOW())", 
      [package_id, status, location]);

    res.json({ message: "Tracking updated successfully" });
  } catch (error) {
    console.error("Error updating tracking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
