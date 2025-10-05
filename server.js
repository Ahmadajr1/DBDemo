// server.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');      // keep as in your current file
const handleRequest = require('./register');
const db = require('./dp');

const app = express();

// Middleware (same behavior as your current file)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (register.html, users.html, etc.)
app.use(express.static(path.join(__dirname)));

// Default route -> register page (helps on Railway root URL)
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// Register route (unchanged)
app.post('/register', (req, res) => {
  handleRequest(req, res);
});

// API: return all users as JSON (unchanged)
app.get('/api/users', async (_req, res) => {
  try {
    const [rows] = await db.query(
        `SELECT id, first_name, last_name, job_role, email, phone_number, tasks, created_at
       FROM users
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---- Start server (Railway-friendly) ----
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  // Nice log for local vs Railway
  const base =
      process.env.RAILWAY_STATIC_URL
          ? `https://${process.env.RAILWAY_STATIC_URL}`
          : `http://localhost:${PORT}`;
  console.log(`Server running at ${base}/register.html`);
});
