const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email == null || password == null){
    return res.status(401).json({ message: "Invalid email or password" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM customers WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.register = async (req, res) => {
  const { email, password, address, username, name, phone} = req.body;


  if (email == null || password == null){
    return res.status(401).json({ message: "Invalid email or password" });
  }


  try {

    if (typeof password == "string" && password.length > 15) {
      return res.status(400).json({ message: "Password too long." });
    } 

    const hashed_password = await bcrypt.hash(password, 10)

    const [result] = await db.execute("INSERT INTO customers (name, address, phone, email, username, password) VALUES (?, ?, ?, ?, ?, ?)", [name, address, phone, email, username, hashed_password]);

    console.log(result)


    const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

