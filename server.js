// server.js

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const handleRequest = require("./register");
const db = require("./dp");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve your HTML files (register.html, login.html, etc.)
app.use(express.static(path.join(__dirname)));

// Register route
app.post("/register", (req, res) => {
  handleRequest(req, res);
});

// API: return all users as JSON
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, first_name, last_name, job_role, email, phone_number, tasks, created_at FROM users ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Run server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000/register.html");
});
