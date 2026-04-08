const pool = require("../db/connection");

/**
 * Booking Model
 * Handles all database operations for gym slot bookings
 * Manages creation, retrieval, and cancellation of bookings
 */
class Booking {
  /**
   * Create a new booking for a user on a specific slot
   * Uses database unique constraint to prevent duplicate bookings
   * @param {number} userId - User ID
   * @param {number} slotId - Slot ID
   * @returns {Promise<Object>} Created booking with ID and metadata
   * @throws {Error} If user already has an active booking for this slot
   */
  static async create(userId, slotId) {
    try {
      const result = await pool.query(
        `INSERT INTO bookings (user_id, slot_id, status) 
         VALUES ($1, $2, 'active') 
         RETURNING id, user_id, slot_id, status, booking_date`,
        [userId, slotId],
      );
      return result.rows[0];
    } catch (err) {
      // Error code 23505 = unique constraint violation
      if (err.code === "23505") {
        throw new Error("User already booked this slot");
      }
      throw err;
    }
  }

  /**
   * Get all active bookings for a specific user
   * Joins with slots table to include slot time information
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of active bookings with slot details
   */
  static async getByUserId(userId) {
    const result = await pool.query(
      `SELECT b.id, b.user_id, b.slot_id, b.status, b.booking_date, s.slot_time 
       FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       WHERE b.user_id = $1 AND b.status = 'active'
       ORDER BY s.id`,
      [userId],
    );
    return result.rows;
  }

  /**
   * Cancel an active booking owned by the user
   * Updates booking status to 'cancelled' for audit trail
   * @param {number} bookingId - Booking ID to cancel
   * @param {number} userId - User ID (for ownership verification)
   * @returns {Promise<Object>} Cancelled booking details
   */
  static async cancel(bookingId, userId) {
    const result = await pool.query(
      `UPDATE bookings 
       SET status = 'cancelled'
       WHERE id = $1 AND user_id = $2 AND status = 'active'
       RETURNING *`,
      [bookingId, userId],
    );
    return result.rows[0];
  }

  /**
   * Get count of active bookings for a specific slot
   * Used to determine slot availability
   * @param {number} slotId - Slot ID
   * @returns {Promise<number>} Count of active bookings
   */
  static async getSlotBookings(slotId) {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM bookings WHERE slot_id = $1 AND status = 'active'`,
      [slotId],
    );
    return parseInt(result.rows[0].count);
  }
  /**
   * Get full details of a slot with current booking status
   * Calculates real-time availability from active bookings
   * @param {number} slotId - Slot ID
   * @returns {Promise<Object>} Slot details with availability info
   */
  static async getSlotDetails(slotId) {
    const result = await pool.query(
      `SELECT s.id, s.slot_time, s.capacity,
              COUNT(CASE WHEN b.status = 'active' THEN 1 END) as booked_count,
              s.capacity - COUNT(CASE WHEN b.status = 'active' THEN 1 END) as available_slots
       FROM slots s
       LEFT JOIN bookings b ON s.id = b.slot_id
       WHERE s.id = $1
       GROUP BY s.id, s.slot_time, s.capacity`,
      [slotId],
    );
    return result.rows[0];
  }
}

module.exports = Booking;
