/*
* /ShipNGo/backend/routes/claims.js
*/

const { sendJson } = require("../helpers");
const claimController = require("../controllers/claimController");
const { readJsonBody } = require("../helpers");

async function getClaims(req, res) {
  try {
    const claims = await claimController.getAllClaims();
    sendJson(res, 200, { claims });
  } catch (err) {
    sendJson(res, 500, { message: err.message });
  }
}

async function fileClaim(req, res) {
  try {
    const body = await readJsonBody(req);
    const { name, email, phone, reason } = body;
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