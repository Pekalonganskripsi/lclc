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
      const [roomRows] = await db.execute(
        'SELECT status, price_per_hour FROM rooms WHERE room_id = ? AND status = \'Available\'',
        [room_id]
      );

      if (roomRows.length === 0) {
        return res.status(400).json({ error: 'Room is not available' });
      }

      // If LC is selected, check if it's available
      if (lc_id) {
        const [lcRows] = await db.execute(
          'SELECT is_available, lc_fee FROM lcs WHERE lc_id = ? AND is_available = 1',
          [lc_id]
        );

        if (lcRows.length === 0) {
          return res.status(400).json({ error: 'LC is not available' });
        }
      }

      // Calculate total amount
      const roomPrice = roomRows[0].price_per_hour;
      let lcFee = 0;
      
      if (lc_id) {
        const [lcRows] = await db.execute(
          'SELECT lc_fee FROM lcs WHERE lc_id = ?',
          [lc_id]
        );
        lcFee = lcRows[0].lc_fee;
      }

      const totalAmount = (roomPrice * duration) + lcFee;

      // Insert booking
      const [result] = await db.execute(
        'INSERT INTO bookings (user_id, room_id, lc_id, start_time, duration_hours, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user_id, room_id, lc_id, start_time, duration, totalAmount, 'Pending']
      );

      // Update room status to booked
      await db.execute(
        'UPDATE rooms SET status = \'Booked\' WHERE room_id = ?',
        [room_id]
      );

      // Update LC availability if selected
      if (lc_id) {
        await db.execute(
          'UPDATE lcs SET is_available = 0 WHERE lc_id = ?',
          [lc_id]
        );
      }

      res.status(201).json({
        success: true,
        booking_id: result.insertId,
        message: 'Booking created successfully',
        total_amount: totalAmount
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: error.message });
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
      if (userId) {
        query += ' WHERE b.user_id = ?';
        params.push(parseInt(userId));
      }

      query += ' ORDER BY b.created_at DESC';

      const [rows] = await db.execute(query, params);

      res.status(200).json({
        success: true,
        bookings: rows,
        count: rows.length
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get all rooms
  getRooms: async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM rooms ORDER BY price_per_hour ASC');
      
      res.status(200).json({
        success: true,
        rooms: rows,
        count: rows.length
      });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get all available LCs
  getLCs: async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM lcs WHERE is_available = 1 ORDER BY rating DESC');
      
      res.status(200).json({
        success: true,
        lcs: rows,
        count: rows.length
      });
    } catch (error) {
      console.error('Error fetching LCs:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = bookingController;