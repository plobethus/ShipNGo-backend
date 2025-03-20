const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Check if JWT_SECRET is set before running the server
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not set.");
  process.exit(1); // Stop the server if JWT_SECRET is missing
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  try {
    const [customerRows] = await db.execute(
      "SELECT customer_id AS id, name, password, 'customer' AS role FROM customers WHERE email = ?", 
      [email]
    );
    const [employeeRows] = await db.execute(
      "SELECT employee_id AS id, name, password, 'employee' AS role FROM employees WHERE email = ?", 
      [email]
    );

    const rows = customerRows.length > 0 ? customerRows : employeeRows;

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token, role: user.role, name: user.name });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};