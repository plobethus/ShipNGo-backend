const jwt = require("jsonwebtoken");

// Middleware to verify JWT token for protected routes
module.exports = (req, res, next) => {
  // Extracts token from Authorization header
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
  if (!token) {
    return res.status(401).json({ message: "Access denied. Invalid token format." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified.userId || !verified.role) {
      return res.status(400).json({ message: "Invalid token data." });
    }

    req.user = { userId: verified.id, role: verified.role }; // Attaches user data
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};