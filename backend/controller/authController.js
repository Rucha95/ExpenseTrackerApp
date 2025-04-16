const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const signup = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO User (username, password_hash) VALUES (?, ?)";
    db.query(sql, [username, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Username already exists." });
        }
        return res.status(500).json({ error: "Database error." });
      }
      res.status(201).json({ message: "User registered successfully." });
    });
  } catch (error) {
    res.status(500).json({ error: "Error registering user." });
  }
};

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const sql = "SELECT * FROM User WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error." });

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = results[0];
    console.log('Password:', password);
console.log('Hashed Password:', user.password_Hash);
    const match = await bcrypt.compare(password, user.password_Hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful.", token });
  });
};

module.exports = { signup, login };
