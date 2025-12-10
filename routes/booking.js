// routes/booking.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/create', bookingController.createBooking);

// Get all bookings (with optional user filter)
router.get('/list', bookingController.getBookings);

// Get all rooms
router.get('/rooms', bookingController.getRooms);

// Get all available LCs
router.get('/lcs', bookingController.getLCs);

module.exports = router;