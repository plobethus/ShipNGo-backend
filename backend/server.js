// /ShipNGo-backend/server.js
// Main entry point: serves backend APIs and static frontend files

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// CORS: allow same-origin (frontend is now hosted together with backend)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Serve static frontend from /frontend directory ---
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// --- API Routes ---
app.use("/auth", require("./routes/auth"));                    
app.use("/packages", require("./routes/packageRoutes"));         
app.use("/tracking", require("./routes/tracking"));            
app.use("/shipment", require("./routes/shipment"));            
app.use("/edit", require("./routes/deliverypoints"));          
app.use("/claims", require("./routes/claimRoute"));            


// Catch-all: send frontend index.html for any unknown route (e.g. refreshing dashboard)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));