/* 
 * /ShipNGo/backend/controllers/claimController.js
 * This controller handles claims using raw SQL queries.
 *   - claim_id (PK)
 *   - customer_id
 *   - phone_number
 *   - reason
 *   - refund_status (ENUM, e.g. 'Queued', etc.)
 *   - processed_date (timestamp)
 */

const db = require("mysql2").createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

async function getClaimsForCustomer(customerId) {
  const [rows] = await db.execute(
    `SELECT claim_id, customer_id, phone_number, reason, refund_status, processed_date
     FROM claims 
     WHERE customer_id = ?
     ORDER BY claim_id DESC`,
    [customerId]
  );
  return rows;
}

async function fileClaim(name, email, phone_number, reason) {
  // Check that the customer exists by email
  const [customerRows] = await db.execute(
    "SELECT customer_id FROM customers WHERE email = ?",
    [email]
  );
  if (customerRows.length === 0) {
    throw new Error("No customer found with that email");
  }
  const customerId = customerRows[0].customer_id;
  // Insert the new claim; default refund_status to 'Queued'
  await db.execute(
    `INSERT INTO claims (customer_id, phone_number, reason, refund_status, processed_date)
     VALUES (?, ?, ?, 'Queued', NOW())`,
    [customerId, phone_number, reason]
  );
}

module.exports = {
  getClaimsForCustomer,
  fileClaim
};