// dp.js
try { require('dotenv').config(); } catch (_) {}

const mysql = require('mysql2/promise');

const inRailway = !!process.env.RAILWAY_ENVIRONMENT || !!process.env.RAILWAY_STATIC_URL;
const haveURL   = !!process.env.MYSQL_URL;
const haveParts = !!process.env.MYSQLHOST && !!process.env.MYSQLUSER && !!process.env.MYSQLDATABASE;

// Prefer a full URL if provided by Railway
let poolConfig;

if (haveURL) {
    poolConfig = { uri: process.env.MYSQL_URL, waitForConnections: true, connectionLimit: 10 };
} else if (haveParts) {
    poolConfig = {
        host: process.env.MYSQLHOST,
        port: Number(process.env.MYSQLPORT || 3306),
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        // Uncomment if your managed MySQL requires TLS:
        // ssl: { rejectUnauthorized: false },
    };
} else if (!inRailway) {
    // Local dev (XAMPP)
    poolConfig = {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'site_users',
        waitForConnections: true,
        connectionLimit: 10,
    };
} else {
    // Running on Railway but no DB env vars present -> fail fast with a clear message
    throw new Error(
        'Missing MySQL env vars on Railway. Add MYSQLHOST/MYSQLPORT/MYSQLUSER/MYSQLPASSWORD/MYSQLDATABASE ' +
        'or MYSQL_URL to the Node service (use "Reference Variables" from your MySQL service).'
    );
}

const pool = haveURL ? mysql.createPool(poolConfig.uri) : mysql.createPool(poolConfig);

// Optional quick test (keeps your helpful log line)
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
