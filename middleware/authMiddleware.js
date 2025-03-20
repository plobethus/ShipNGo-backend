const jwt = require("jsonwebtoken");

module.exports = (role) => {
    return (req, res, next) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided." });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token format incorrect." });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decoded); // Debugging log

            if (!decoded.customer_id) {
                console.error("customer_id is missing from decoded token.");
                return res.status(403).json({ message: "Invalid token: No customer ID." });
            }

            req.user = decoded;

            if (role && decoded.role !== role) {
                return res.status(403).json({ message: "Unauthorized access." });
            }

            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ message: "Invalid token." });
        }
    };
};