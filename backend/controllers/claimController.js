/*
* /ShipNGo/backend/controllers/claimController.js
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
  
  async function getAllClaims() {
    const [claims] = await db.execute(`
      SELECT c.claim_id, c.customer_id, c.phone, c.reason, c.status, c.processed_date,
             cust.name, cust.email
      FROM claims c
      LEFT JOIN customers cust ON c.customer_id = cust.customer_id
      ORDER BY c.claim_id DESC
    `);
    return claims;
  }
  
  async function fileClaim(name, email, phone, reason) {
    // Check if customer with this email exists
    const [customerRows] = await db.execute(
      "SELECT customer_id FROM customers WHERE email = ?",
      [email]
    );
    if (customerRows.length === 0) {
      throw new Error("No email found");
    }
    const customerId = customerRows[0].customer_id;
    await db.execute(
      "INSERT INTO claims (customer_id, phone, reason, status, processed_date) VALUES (?, ?, ?, 'Queued', NOW())",
      [customerId, phone, reason]
    );
    return;
  }
  
  module.exports = {
    getAllClaims,
    fileClaim
  };