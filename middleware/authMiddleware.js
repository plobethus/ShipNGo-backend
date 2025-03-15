const jwt = require("jsonwebtoken");

// Middleware to verify JWT token for protected routes
module.exports = (req, res, next) => {
  // Extracts and verifies token from Authorization header
  const token = req.header("Authorization")?.split(" ")[1]; // Remove "Bearer " if present

  //verifies token
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: verified.id, role: verified.role }; //attaches userId and role to user data
    next();
  } catch (err) { //blocks request
    res.status(400).json({ message: "Invalid token" });
  }
};

//this program authenticates users accessing protected page