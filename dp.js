// dp.js
// Load .env if present (safe if not installed locally)
try { require('dotenv').config(); } catch (_) {}

const mysql = require('mysql2/promise');

// Detect Railway (it injects these env vars when you add a MySQL service)
const isRailway = !!process.env.MYSQLHOST;

const pool = mysql.createPool(
    isRailway
        ? {
          host: process.env.MYSQLHOST,
          port: Number(process.env.MYSQLPORT || 3306),
          user: process.env.MYSQLUSER,
          password: process.env.MYSQLPASSWORD,
          database: process.env.MYSQLDATABASE,
          waitForConnections: true,
          connectionLimit: 10,
          // If Railway requires SSL, uncomment:
          // ssl: { rejectUnauthorized: false },
        }
        : {
          // LOCAL: connect to your XAMPP MySQL
          host: '127.0.0.1',
          port: 3306,
          user: 'root',
          password: '',
          database: 'site_users',
          waitForConnections: true,
          connectionLimit: 10,
          // If you *prefer* the socket locally, you can swap the host/port for:
          // socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
        }
);

// Optional: quick connection test (skip in production logs)
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Connected to MySQL');
    conn.release();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
})();

module.exports = pool;
