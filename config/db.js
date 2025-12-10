// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lcious',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Add these options to handle connection issues in serverless environments
  acquireTimeout: 60000,
  timeout: 60000,
  connectTimeout: 60000
});

// Test the connection - only in development, not during build
if (process.env.NODE_ENV !== 'production') {
  pool.getConnection()
    .then(connection => {
      console.log('Connected to MySQL database');
      connection.release();
    })
    .catch(err => {
      console.error('Error connecting to MySQL:', err.message);
    });
}

module.exports = pool;