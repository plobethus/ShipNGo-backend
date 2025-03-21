/* 
 * /ShipNGo/backend/server.js
 * Main entry point for the backend APIs and static file serving.
 */

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Configure CORS to allow credentials and proper headers.
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware to parse JSON, URL-encoded data, and cookies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Serve static frontend files from the "frontend" directory ---
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// --- API Routes ---
app.use("/auth", require("./routes/auth"));
app.use("/packages", require("./routes/packageRoutes"));
app.use("/tracking", require("./routes/tracking"));
app.use("/shipment", require("./routes/shipment"));
app.use("/edit", require("./routes/deliverypoints"));
app.use("/claims", require("./routes/claimRoute"));

// Catch-all: send frontend index.html for any unknown route (useful for SPA routing).
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start the server.
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));