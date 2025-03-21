/*
* /backend/routes/packageRoutes.js
*/

const { sendJson } = require("../helpers");
const packageController = require("../controllers/packageController");
const { readJsonBody } = require("../helpers");

async function getPackagesEmployee(req, res, query) {
  try {
    const packages = await packageController.getAllPackages(query);
    if (!packages.length) {
      sendJson(res, 404, { message: "No packages found." });
      return;
    }
    sendJson(res, 200, { packages });
  } catch (err) {
    sendJson(res, 500, { message: err.message });
  }
}

async function updatePackage(req, res, id) {
  try {
    const body = await readJsonBody(req);
    const affected = await packageController.updatePackage(id, body);
    if (affected === 0) {
      sendJson(res, 404, { message: "Package not found or no changes made." });
      return;
    }
    sendJson(res, 200, { message: "Package updated successfully." });
  } catch (err) {
    sendJson(res, 500, { message: err.message });
  }
}

async function getPackagesCustomer(req, res) {
  // Assume token verification was done in middleware if needed; here we pass a customerId manually
  // For demonstration, we extract token data in the main server before calling this function.
  const customerId = req.tokenData && req.tokenData.customer_id;
  if (!customerId) {
    sendJson(res, 400, { message: "Customer ID missing." });
    return;
  }
  try {
    const packages = await packageController.getCustomerPackages(customerId);
    sendJson(res, 200, packages);
  } catch (err) {
    sendJson(res, 500, { message: err.message });
  }
}

module.exports = {
  getPackagesEmployee,
  updatePackage,
  getPackagesCustomer
};