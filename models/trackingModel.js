const db = require("../config/db");

exports.getTrackingByPackageId = async (package_id) => {
  const [rows] = await db.execute("SELECT * FROM tracking WHERE package_id = ?", [package_id]);
  return rows;
};

exports.addTrackingUpdate = async (package_id, status, location) => {
  await db.execute("INSERT INTO tracking (package_id, status, location, updated_at) VALUES (?, ?, ?, NOW())", 
    [package_id, status, location]);
};
