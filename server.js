// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

// Import routes
const bookingRoutes = require('./routes/booking');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'lcious_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Set view engine (for admin pages if needed)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files - order is important
// First serve assets directory (for CSS, JS, images)
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  maxAge: '1y',
  etag: false
}));

// Then serve admin static files
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Finally serve public directory (for HTML files and other static assets)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d'
}));

// API routes (these should be after static file serving)
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all route for SPA routing (after API routes)
app.get(/^(?!\/api\/).*$/, (req, res) => {
  // This regex matches all routes that don't start with /api/
  // This ensures API routes are handled by the API middleware first
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// For Vercel: export the app as a serverless function
module.exports = app;