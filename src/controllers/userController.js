const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginUser = (req, res) => {
    const { username, password } = req.body;

    // Check if username exists in customers or employees table
    const query = `
        SELECT username, password FROM customers WHERE username = ?
        UNION
        SELECT username, password FROM employees WHERE username = ?;
    `;

    db.query(query, [username, username], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(401).json({ error: "Invalid username or password" });

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ error: "Invalid username or password" });

        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    });
};

