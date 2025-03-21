// /ShipNGo-backend/controllers/authController.js
// This controller handles authentication logic (login and registration)
// and sets JWT tokens as HTTP-only cookies.

const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not set.");
  process.exit(1);
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(401).json({ message: "Invalid email or password" });
  try {
    // Check both customers and employees
    const [customerRows] = await db.execute(
      "SELECT customer_id AS id, name, password, 'customer' AS role FROM customers WHERE email = ?",
      [email]
    );
    const [employeeRows] = await db.execute(
      "SELECT employee_id AS id, name, password, 'employee' AS role FROM employees WHERE email = ?",
      [email]
    );
    const rows = customerRows.length ? customerRows : employeeRows;
    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid email or password" });
    
    // Generate token with proper identifier
    const token = jwt.sign(
      user.role === "customer"
        ? { customer_id: user.id, role: "customer", name: user.name }
        : { employee_id: user.id, role: "employee", name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    // Set the token in an HTTP-only cookie with cross-origin settings.
    res.cookie("token", token, { 
      httpOnly: true, 
      secure: true,               // Must be true in production (HTTPS)
      sameSite: "None",           // Required for cross-origin cookies
      path: "/"
    });
    
    res.status(200).json({ message: "Login successful", role: user.role, name: user.name });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.register = async (req, res) => {
  const { email, password, address, name, phone } = req.body;
  if (!email || !password || !address || !name || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    if (password.length < 8 || password.length > 15) {
      return res.status(400).json({ message: "Password must be between 8 and 15 characters." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO customers (name, address, phone, email, password) VALUES (?, ?, ?, ?, ?)",
      [name, address, phone, email, hashedPassword]
    );
    const token = jwt.sign(
      { customer_id: result.insertId, role: "customer", name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Set the token cookie with the same options
    res.cookie("token", token, { 
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/"
    });
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};