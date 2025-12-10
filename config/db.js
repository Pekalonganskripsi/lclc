// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USERNAME || 'postgres',
  host: process.env.DB_HOST || 'db.culdvtsyoxtrkjpfvolk.supabase.co',
  database: process.env.DB_NAME || 'postgres', // Supabase default database
  password: process.env.DB_PASSWORD || '', // You'll set this in Vercel environment
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  },
  // Add these options to handle connection issues in serverless environments
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
});

// Test the connection - only in development, not during Vercel build
if (process.env.NODE_ENV !== 'production') {
  pool.connect()
    .then(client => {
      console.log('Connected to PostgreSQL database');
      client.release();
    })
    .catch(err => {
      console.error('Error connecting to PostgreSQL:', err.message);
    });
}

module.exports = pool;