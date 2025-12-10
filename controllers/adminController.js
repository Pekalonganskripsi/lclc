// controllers/adminController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminController = {
  // Admin login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // In a real application, you would fetch the user from the database and verify the password
      // For this demo, we'll use hardcoded credentials
      if (email === 'admin@lcious.com' && password === 'Disco70s!') {
        // Generate JWT token
        const token = jwt.sign(
          { email, role: 'admin' },
          process.env.JWT_SECRET || 'lcious_jwt_secret',
          { expiresIn: '24h' }
        );

        res.status(200).json({
          success: true,
          token,
          message: 'Login successful',
          user: {
            email,
            role: 'admin'
          }
        });
      } else {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
    } catch (error) {
      console.error('Error in admin login:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get admin reports
  getReports: async (req, res) => {
    try {
      // In a real application, you would verify the admin token here
      // For this demo, we'll skip authentication for simplicity

      // Total revenue
      const [revenueRows] = await db.execute(
        'SELECT SUM(total_amount) as total FROM bookings WHERE status = \'Confirmed\''
      );
      const totalRevenue = revenueRows[0].total || 0;

      // Total bookings by status
      const [statusRows] = await db.execute(
        'SELECT status, COUNT(*) as count FROM bookings GROUP BY status'
      );
      const bookingsByStatus = {};
      statusRows.forEach(row => {
        bookingsByStatus[row.status] = row.count;
      });

      // Top LCs by booking count
      const [topLCsRows] = await db.execute(`
        SELECT lcs.name, COUNT(bookings.lc_id) as booking_count, SUM(bookings.total_amount) as total_revenue
        FROM lcs
        LEFT JOIN bookings ON lcs.lc_id = bookings.lc_id
        WHERE bookings.status = 'Confirmed'
        GROUP BY lcs.lc_id
        ORDER BY booking_count DESC
        LIMIT 10
      `);

      // Revenue by date (last 7 days)
      const [revenueByDateRows] = await db.execute(`
        SELECT DATE(created_at) as date, SUM(total_amount) as daily_revenue
        FROM bookings
        WHERE status = 'Confirmed'
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) DESC
        LIMIT 7
      `);

      // Total room bookings
      const [roomBookingsRows] = await db.execute(`
        SELECT r.name, COUNT(b.booking_id) as booking_count
        FROM rooms r
        LEFT JOIN bookings b ON r.room_id = b.room_id
        WHERE b.status = 'Confirmed'
        GROUP BY r.room_id
        ORDER BY booking_count DESC
      `);

      res.status(200).json({
        success: true,
        reports: {
          total_revenue: totalRevenue,
          bookings_by_status: bookingsByStatus,
          top_lcs: topLCsRows,
          revenue_by_date: revenueByDateRows,
          room_popularity: roomBookingsRows
        }
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Check if it's a database connection error
      if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
        res.status(500).json({ error: 'Database connection error. Please check configuration.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Get all bookings for admin management
  getAllBookings: async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT b.*, r.name as room_name, l.name as lc_name
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.room_id
        LEFT JOIN lcs l ON b.lc_id = l.lc_id
        ORDER BY b.created_at DESC
      `);

      res.status(200).json({
        success: true,
        bookings: rows,
        count: rows.length
      });
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      // Check if it's a database connection error
      if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
        res.status(500).json({ error: 'Database connection error. Please check configuration.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Update booking status
  updateBookingStatus: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      // Update booking status
      const [result] = await db.execute(
        'UPDATE bookings SET status = ? WHERE booking_id = ?',
        [status, bookingId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Booking status updated successfully'
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      // Check if it's a database connection error
      if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
        res.status(500).json({ error: 'Database connection error. Please check configuration.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Delete booking
  deleteBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;

      // Delete booking
      const [result] = await db.execute(
        'DELETE FROM bookings WHERE booking_id = ?',
        [bookingId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      // Check if it's a database connection error
      if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
        res.status(500).json({ error: 'Database connection error. Please check configuration.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
};

module.exports = adminController;