/* routes/shipment.js
const express = require("express");
const router = express.Router();

// Example POST route to create a shipment
router.post("/create", (req, res) => {
    const { sender, recipient, packageDetails } = req.body;
    
    // Here you can process the shipment creation, save it to your database, etc.
    // For now, just send a response back to the client.
    if (!sender || !recipient || !packageDetails) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Simulating shipment creation success
    res.status(201).json({ message: "Shipment created successfully", shipmentData: req.body });
});

module.exports = router;
*/
const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Create a new shipment
router.post("/", (req, res) => {
    const { sender_id, recipient_id, weight, dimensions, shipping_cost, delivery_date } = req.body;

    if (!sender_id || !recipient_id || !weight || !dimensions || !shipping_cost || !delivery_date) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const sql = `
        INSERT INTO shipments (sender_id, recipient_id, weight, dimensions, shipping_cost, delivery_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [sender_id, recipient_id, weight, dimensions, shipping_cost, delivery_date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Shipment created successfully!", shipmentId: result.insertId });
    });
});

// Get all shipments
router.get("/", (req, res) => {
    const sql = "SELECT * FROM shipments";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
});

// Get a single shipment by ID
router.get("/:id", (req, res) => {
    const shipmentId = req.params.id;
    const sql = "SELECT * FROM shipments WHERE ID = ?";

    db.query(sql, [shipmentId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) return res.status(404).json({ message: "Shipment not found" });

        res.json(result[0]);
    });
});

module.exports = router;
