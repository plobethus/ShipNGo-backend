require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./src/routes/userRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

