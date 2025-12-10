// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin login
router.post('/login', adminController.login);

// Get admin reports
router.get('/reports', adminController.getReports);

// Get all bookings for admin management
router.get('/bookings', adminController.getAllBookings);

// Update booking status
router.put('/bookings/:bookingId', adminController.updateBookingStatus);

// Delete booking
router.delete('/bookings/:bookingId', adminController.deleteBooking);

module.exports = router;