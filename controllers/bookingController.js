// controllers/bookingController.js
const db = require('../config/db');

const bookingController = {
  // Create a new booking
  createBooking: async (req, res) => {
    try {
      const { user_id, room_id, lc_id, start_time, duration } = req.body;

      // Validate required fields
      if (!user_id || !room_id || !start_time || !duration) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if room is available
      const roomResult = await db.query(
        'SELECT status, price_per_hour FROM rooms WHERE room_id = $1 AND status = $2',
        [room_id, 'Available']
      );

      if (roomResult.rows.length === 0) {
        return res.status(400).json({ error: 'Room is not available' });
      }

      // If LC is selected, check if it's available
      if (lc_id) {
        const lcResult = await db.query(
          'SELECT is_available, lc_fee FROM lcs WHERE lc_id = $1 AND is_available = true',
          [lc_id]
        );

        if (lcResult.rows.length === 0) {
          return res.status(400).json({ error: 'LC is not available' });
        }
      }

      // Calculate total amount
      const roomPrice = roomResult.rows[0].price_per_hour;
      let lcFee = 0;

      if (lc_id) {
        const lcResult = await db.query(
          'SELECT lc_fee FROM lcs WHERE lc_id = $1',
          [lc_id]
        );
        lcFee = parseFloat(lcResult.rows[0].lc_fee);
      }

      const totalAmount = (parseFloat(roomPrice) * duration) + lcFee;

      // Insert booking
      const result = await db.query(
        'INSERT INTO bookings (user_id, room_id, lc_id, start_time, duration_hours, total_amount, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING booking_id',
        [user_id, room_id, lc_id, start_time, duration, totalAmount, 'Pending']
      );

      // Update room status to booked
      await db.query(
        'UPDATE rooms SET status = $1 WHERE room_id = $2',
        ['Booked', room_id]
      );

      // Update LC availability if selected
      if (lc_id) {
        await db.query(
          'UPDATE lcs SET is_available = false WHERE lc_id = $1',
          [lc_id]
        );
      }

      res.status(201).json({
        success: true,
        booking_id: result.rows[0].booking_id,
        message: 'Booking created successfully',
        total_amount: totalAmount
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      // Check if it's a database connection error
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        res.status(500).json({ error: 'Database connection error. Please check configuration.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Get all bookings (with optional user filter)
  getBookings: async (req, res) => {
    try {
      const userId = req.query.user_id;

      let query = `
        SELECT b.*, r.name as room_name, l.name as lc_name, u.email as user_email
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.room_id
        LEFT JOIN lcs l ON b.lc_id = l.lc_id
        LEFT JOIN users u ON b.user_id = u.user_id
      `;

      const params = [];
      let paramIndex = 1;

      if (userId) {
        query += ` WHERE b.user_id = $${paramIndex}`;
        params.push(parseInt(userId));
        paramIndex++;
      }

      query += ' ORDER BY b.created_at DESC';

      const result = await db.query(query, params);

      res.status(200).json({
        success: true,
        bookings: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Check if it's a database connection error
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        res.status(500).json({ error: 'Database connection error. Please check configuration.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Get all rooms
  getRooms: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM rooms ORDER BY price_per_hour ASC');

      res.status(200).json({
        success: true,
        rooms: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      // Check if it's a database connection error
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        res.status(500).json({ error: 'Database connection error. Please check configuration.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Get all available LCs
  getLCs: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM lcs WHERE is_available = true ORDER BY rating DESC');

      res.status(200).json({
        success: true,
        lcs: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error('Error fetching LCs:', error);
      // Check if it's a database connection error
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        res.status(500).json({ error: 'Database connection error. Please check configuration.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
};

module.exports = bookingController;