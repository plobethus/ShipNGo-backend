// ShipNgo-backend/server.js
// This is the main server file that sets up Express, middleware, routes,
// and serves static files for the ShipNGo frontend.
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser()); // Enables cookie parsing

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../ShipNGo-frontend")));

// Import routes
app.use("/auth", require("./routes/auth"));                  // Authentication routes (login, register, dashboards)
app.use("/tracking", require("./routes/tracking"));          // Tracking routes
app.use("/shipment", require("./routes/shipment"));          // Shipment routes
app.use("/packages", require("./routes/packageRoutes"));     // Package routes
app.use("/edit", require("./routes/deliverpoints"));           // Delivery points routes (auth required)
app.use("/claims", require("./routes/claimRoutes"));         // Claims routes

// Removed duplicate dashboard routes here since they are already defined in /auth

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));