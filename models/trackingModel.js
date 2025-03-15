const db = require("../config/db");

exports.getTrackingByPackageId = async (package_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM trackinghistory WHERE package_id = ? ORDER BY updated_at DESC",
    [package_id]
  );
  return rows;
};

exports.addTrackingUpdate = async (package_id, warehouse_location, post_office_location, status, route_id) => {
  await db.execute(
    "INSERT INTO trackinghistory (package_id, warehouse_location, post_office_location, status, updated_at, route_id) VALUES (?, ?, ?, ?, NOW(), ?)", 
    [package_id, warehouse_location, post_office_location, status, route_id]
  );
};
