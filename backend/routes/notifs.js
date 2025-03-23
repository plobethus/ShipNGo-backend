const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "shipngo",
});

// Get all notifications
app.get("/notifications", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM notifications ORDER BY timestamp DESC");
  res.json(rows);
});

// Get unread notification count
app.get("/notifications/unread", async (req, res) => {
  const [rows] = await db.execute("SELECT COUNT(*) AS count FROM notifications WHERE status = 'unread'");
  res.json(rows[0]);
});

// Mark all as read (optional)
app.post("/notifications/mark-read", async (req, res) => {
  await db.execute("UPDATE notifications SET status = 'read'");
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));
