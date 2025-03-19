const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../ShipNGo-frontend")));

// Import authentication routes
app.use("/auth", require("./routes/auth"));
app.use("/tracking", require("./routes/tracking"));
const packageRoutes = require("./routes/packageRoutes");
app.use("/packages", packageRoutes);
app.use("/edit", require("./routes/deliverypoints"))

// Serve customer and employee dashboards
app.get("/dashboard/customer", (req, res) => {
    res.sendFile(path.join(__dirname, "../ShipNGo-frontend/pages/dashboard/customer.html"));
});

app.get("/dashboard/employee", (req, res) => {
    res.sendFile(path.join(__dirname, "../ShipNGo-frontend/pages/dashboard/employee.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));