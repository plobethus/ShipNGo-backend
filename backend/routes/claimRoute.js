/* 
 * /ShipNGo/backend/routes/claimRoute.js
 * Routes for filing a new claim and retrieving all claims.
 */

const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");

router.post("/", claimController.fileClaim);
router.get("/", claimController.getAllClaims);

module.exports = router;