// /ShipNGo-backend/middleware/authMiddleware.js
// This middleware verifies JWT tokens for protected routes by reading the token from cookies.

const jwt = require("jsonwebtoken");

module.exports = (role) => {
  return (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      // For customers, expect a customer_id; for employees, expect an employee_id.
      if (role === "customer" && !decoded.customer_id) {
        console.error("Invalid token: No customer ID.");
        return res.status(403).json({ message: "Invalid token: No customer ID." });
      }
      if (role === "employee" && !decoded.employee_id) {
        console.error("Invalid token: No employee ID.");
        return res.status(403).json({ message: "Invalid token: No employee ID." });
      }
      if (role && decoded.role !== role) {
        return res.status(403).json({ message: "Unauthorized access." });
      }
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: "Invalid token." });
    }
  };
};