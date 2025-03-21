//ShipNGo-backend/server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
require('dotenv').config();

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


// Serve frontend static files
app.use(express.static(path.join(__dirname, "../ShipNGo-frontend")));

// Import routes]
app.use("/auth", require("./routes/auth"));                  //login route

app.use("/tracking", require("./routes/tracking"));          //tracking route for index
console.log("Tracking route initialized.");                  //log for index

app.use("/shipment", require("./routes/shipment"));          //route for creating packages

app.use("/packages", require("./routes/packageRoutes"));     //route for showing packages

app.use("/edit", require("./routes/deliverypoints"));        //yusuf did this idk

app.use("/claims", require("./routes/claimRoutes"));         //claims route

// Serve customer and employee dashboards from frontend 
app.get("/dashboard/customer", (req, res) => {
  res.sendFile(path.join(__dirname, "../ShipNGo-frontend/pages/dashboard/customer.html"));
});
app.get("/dashboard/employee", (req, res) => {
  res.sendFile(path.join(__dirname, "../ShipNGo-frontend/pages/dashboard/employee.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle POST requests for creating a shipment
app.post('/api/shipments', (req, res) => {
  const { sender_name, sender_address, receiver_name, receiver_address, weight, shipping_option } = req.body;

  // Check if all fields are provided
  if (!sender_name || !sender_address || !receiver_name || !receiver_address || !weight || !shipping_option) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  // SQL query to insert a new shipment
  const query = `
    INSERT INTO shipments (sender_name, sender_address, receiver_name, receiver_address, weight, shipping_option)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  // Execute the query
  pool.execute(query, [sender_name, sender_address, receiver_name, receiver_address, weight, shipping_option], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error inserting shipment into the database' });
    }

    // Respond with the created shipment data, including the generated ID
    res.status(201).json({
      message: 'Shipment created successfully',
      ID: results.insertId, // The ID of the newly inserted shipment
    });
  });
});
