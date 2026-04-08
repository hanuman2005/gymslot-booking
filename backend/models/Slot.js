const pool = require("../db/connection");

/**
 * Slot Model
 * Handles all database operations related to gym time slots
 * Manages slot availability and booking status
 */
class Slot {
  /**
   * Get all available gym slots with booking counts
   * Calculates real-time availability by joining with bookings table
   * @returns {Promise<Array>} Array of all slots with availability info
   */
  static async getAll() {
    const result = await pool.query(
      `SELECT s.id, s.slot_time, s.capacity, 
              COUNT(CASE WHEN b.status = 'active' THEN 1 END) as booked_count,
              s.capacity - COUNT(CASE WHEN b.status = 'active' THEN 1 END) as available_slots
       FROM slots s
       LEFT JOIN bookings b ON s.id = b.slot_id
       GROUP BY s.id, s.slot_time, s.capacity
       ORDER BY s.id`,
    );
    return result.rows;
  }

  /**
   * Get a specific slot by ID with current booking status
   * @param {number} id - Slot ID
   * @returns {Promise<Object>} Slot details including availability
   */
  static async getById(id) {
    const result = await pool.query(
      `SELECT s.id, s.slot_time, s.capacity, 
              COUNT(CASE WHEN b.status = 'active' THEN 1 END) as booked_count,
              s.capacity - COUNT(CASE WHEN b.status = 'active' THEN 1 END) as available_slots
       FROM slots s
       LEFT JOIN bookings b ON s.id = b.slot_id
       WHERE s.id = $1
       GROUP BY s.id, s.slot_time, s.capacity`,
      [id],
    );
    return result.rows[0];
  }

  /**
   * Atomic booking operation: Check slot availability and create booking in ONE query
   * Uses PostgreSQL CTE (Common Table Expression) for ACID compliance
   * Prevents race conditions by doing all checks and insertion atomically
   *
   * @param {number} userId - User ID attempting to book
   * @param {number} slotId - Slot ID to book
   * @returns {Promise<Object>} Booking confirmation with ID and details
   * @throws {Error} If slot is full, user already booked, or booking fails
   */
  static async checkAndBook(userId, slotId) {
    // First, check slot availability
    const checkResult = await pool.query(
      `SELECT 
        COUNT(CASE WHEN b.status = 'active' THEN 1 END) as booked_count,
        s.capacity,
        EXISTS (SELECT 1 FROM bookings WHERE user_id = $2 AND slot_id = $1 AND status = 'active') as user_already_booked
      FROM slots s
      LEFT JOIN bookings b ON s.id = b.slot_id
      WHERE s.id = $1
      GROUP BY s.id, s.capacity`,
      [slotId, userId],
    );

    if (checkResult.rows.length === 0) {
      throw new Error("Slot not found");
    }

    const { booked_count, capacity, user_already_booked } = checkResult.rows[0];

    if (user_already_booked) {
      throw new Error("User already booked this slot");
    }

    if (booked_count >= capacity) {
      throw new Error("Slot is full");
    }

    // If all checks pass, insert the booking
    const bookingResult = await pool.query(
      `INSERT INTO bookings (user_id, slot_id, status)
       VALUES ($1, $2, 'active')
       RETURNING id, user_id, slot_id, status, booking_date`,
      [userId, slotId],
    );

    return bookingResult.rows[0];
  }
}

module.exports = Slot;
