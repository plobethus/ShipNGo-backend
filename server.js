const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Import routes
app.use("/auth", require("./routes/auth"));
app.use("/tracking", require("./routes/tracking"));
console.log("Tracking route initialized.");
app.use("/shipment", require("./routes/shipment"));
app.use("/packages", require("./routes/packageRoutes"));
app.use("/edit", require("./routes/deliverypoints"));

// Serve customer and employee dashboards from frontend
app.get("/dashboard/customer", (req, res) => {
  res.sendFile(path.join(__dirname, "../ShipNGo-frontend/pages/dashboard/customer.html"));
});
app.get("/dashboard/employee", (req, res) => {
  res.sendFile(path.join(__dirname, "../ShipNGo-frontend/pages/dashboard/employee.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
