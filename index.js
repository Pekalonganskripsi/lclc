// index.js - Vercel entry point
const app = require('./server');
const port = process.env.PORT || 3000;

// For Vercel deployment
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(port, () => {
    console.log(`LCious server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}