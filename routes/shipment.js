// routes/shipment.js
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
