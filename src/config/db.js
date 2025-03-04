const mysql = require("mysql");

const db = mysql.createConnection({
    host: "postofficeserver.mysql.database.azure.com",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "shipngo",
    ssl: { rejectUnauthorized: false }  // Required for Azure MySQL
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to Azure MySQL!");
});

module.exports = db;

