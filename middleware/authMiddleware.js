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

            if (role === "customer" && decoded.role !== "customer") {
                console.error("Unauthorized: Not a customer.");
                return res.status(403).json({ message: "Unauthorized: Not a customer." });
            }

            if (role === "employee" && decoded.role !== "employee") {
                console.error("Unauthorized: Not an employee.");
                return res.status(403).json({ message: "Unauthorized: Not an employee." });
            }

            req.user = decoded;
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ message: "Invalid token." });
        }
    };
};