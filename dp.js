// dp.js
const mysql = require('mysql2/promise');

// this the information needed to connect to the database
const pool = mysql.createPool({
  user: 'root',
  password: '',
  database: 'site_users',
  socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
});

// here we connect to the database
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('Connected to MySQL');
    conn.release();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

testConnection();
//to use connection in other files
module.exports = pool;
