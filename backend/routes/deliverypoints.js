/* 
 * /ShipNGo/backend/routes/deliverpoints.js
 * Routes for delivery point registration and updating delivery point addresses.
 * Note: This route is mounted as “/edit” in server.js.
 */

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { put_address_to_delivery_point, register_delivery_point } = require("../controllers/deliveryPointsController");

const router = express.Router();

router.put("/update_delivery_point_address", authMiddleware("employee"), put_address_to_delivery_point);
router.put("/register_delivery_point", authMiddleware("employee"), register_delivery_point);

module.exports = router;