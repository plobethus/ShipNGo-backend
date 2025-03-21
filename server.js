// /ShipNGo-backend/server.js
// This is the main server file that sets up Express, middleware, routes,
// and serves static files for the ShipNGo frontend.

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// CORS Configuration – ensure cross-origin requests from your Vercel frontend send cookies
app.use(cors({
    origin: "https://ship-n-go-frontend.vercel.app",  
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../ShipNGo-frontend")));

// ROUTES – add new routes here without creating extra constants.
app.use("/auth", require("./routes/auth"));                    // Authentication routes (login, register, dashboards, /me)
app.use("/tracking", require("./routes/tracking"));              // Tracking routes
app.use("/shipment", require("./routes/shipment"));              // Shipment routes
app.use("/packages", require("./routes/packageRoutes"));         // Package routes
app.use("/edit", require("./routes/deliverypoints"));            // Delivery points routes (auth required)
app.use("/claims", require("./routes/claimRoute"));              // Claims routes
// app.use("/notifications", require("./routes/notifications"));  // Notifications routes (if needed)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));