// ShipNGo-backend/server.js
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
app.use(cookieParser());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../ShipNGo-frontend")));

// ROUTES- IF YOU ADD A ROUTE DO IT UNDER HERE. DO NTO DO CONSTS FOR REQUIRE, JUST PUT THEM HERE
app.use("/auth", require("./routes/auth"));                    // Authentication routes (login, register, dashboards)
app.use("/tracking", require("./routes/tracking"));            // Tracking routes
app.use("/shipment", require("./routes/shipment"));            // Shipment routes
app.use("/packages", require("./routes/packageRoutes"));       // Package routes
app.use("/edit", require("./routes/deliverpoints"));           // Delivery points routes (auth required)
app.use("/claims", require("./routes/claimRoutes"));           // Claims routes
app.use("/notifications", require("./routes/notifications"));  // Notifications routes

//DO NOT CHANGE THIS
const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));