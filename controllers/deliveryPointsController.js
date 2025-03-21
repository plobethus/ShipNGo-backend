//ShipNGo-backend/controllers/deliverPointsController.js
// This controller handles registration of delivery points and associating addresses with them.

const db = require("../config/db");

exports.register_delivery_point = async (req, res) => {
  const { name, special_instructions, delivery_type, entrance_address } = req.body;
  let entrance_address_id;
  try {
    const [addressRows] = await db.execute("SELECT * FROM addresses WHERE LOWER(address) = LOWER(?)", [entrance_address]);
    if (addressRows.length > 0 && addressRows[0].customer_id == null) {
      entrance_address_id = addressRows[0].address_id;
    } else {
      const [insert_result] = await db.execute("INSERT INTO addresses (address) VALUES (LOWER(?))", [entrance_address]);
      entrance_address_id = insert_result.insertId;
    }
    const [result] = await db.execute(
      "INSERT INTO deliverypoint (name, special_instructions, delivery_type, entrance_address_id) VALUES (?, ?, ?, ?)",
      [name, special_instructions, delivery_type, entrance_address_id]
    );
    res.status(200).json({ message: "Delivery Point Registration Successful", id: result.insertId });
  } catch (error) {
    console.error("Delivery point registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.put_address_to_delivery_point = async (req, res) => {
  const { address, delivery_point_id } = req.body;
  try {
    const [replace_result] = await db.execute(
      "REPLACE INTO registeredaddresswithpoints (delivery_point_address, delivery_point_id) VALUES (?,?)",
      [address, delivery_point_id]
    );
    console.log(replace_result);
    res.status(200).json({ message: "Address Delivery Point Registration Successful", id: replace_result.insertId });
  } catch (error) {
    console.error("Delivery address point registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};