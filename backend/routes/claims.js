/* 
 * /ShipNGo/backend/routes/claims.js
 * Routes for claims.
 * Protected: only logged-in customers (with valid JWT) can access these routes.
 */

const { sendJson, readJsonBody, verifyToken } = require("../helpers");
const claimController = require("../controllers/claimController");

// GET /claims — returns the claims for the logged-in customer
async function getClaims(req, res) {
  // req.tokenData is set by the main server if the JWT is valid
  const tokenData = req.tokenData;
  if (!tokenData || !tokenData.customer_id) {
    sendJson(res, 401, { message: "Unauthorized. Please log in as a customer." });
    return;
  }
  try {
    const claims = await claimController.getClaimsForCustomer(tokenData.customer_id);
    sendJson(res, 200, { claims });
  } catch (err) {
    sendJson(res, 500, { message: err.message });
  }
}

// POST /claims — allows a customer to file a new claim
async function fileClaim(req, res) {
  const tokenData = verifyToken(req);
  if (!tokenData || tokenData.role !== "customer") {
    sendJson(res, 401, { message: "Unauthorized. Only customers can file claims." });
    return;
  }
  try {
    const body = await readJsonBody(req);
    const { name, email, phone, reason } = body;
    if (!name || !email || !phone || !reason) {
      sendJson(res, 400, { message: "All fields are required." });
      return;
    }
    // Use 'phone' from the request but insert it as 'phone_number'
    await claimController.fileClaim(name, email, phone, reason);
    sendJson(res, 201, { message: "Claim submitted successfully." });
  } catch (err) {
    sendJson(res, 400, { message: err.message });
  }
}

module.exports = {
  getClaims,
  fileClaim
};