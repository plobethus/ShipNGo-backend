const jwt = require("jsonwebtoken");

// Middleware to verify JWT token for protected routes
module.exports = (roleRequired) => {
  return (req, res, next) => {
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

      if (verified.role !== roleRequired) {
        return res.status(403).json({ message: "Access denied. Unauthorized role." });
      }

      req.user = { userId: verified.userId, role: verified.role }; // Attaches user data
      next();
    } catch (err) {
      res.status(400).json({ message: "Invalid token." });
    }
  };
};