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

// Serve static files BEFORE API routes to ensure they're handled first
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use(express.static(path.join(__dirname, 'public')));

// API routes (after static files to avoid conflicts)
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all route for SPA (after API routes)
app.get('*', (req, res) => {
  // Don't serve index.html for API routes (this should already be handled by the API routes above)
  // But if an API route wasn't matched, return 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  // For all other routes, serve the main index.html (SPA routing)
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// For Vercel: export the app as a serverless function
module.exports = app;