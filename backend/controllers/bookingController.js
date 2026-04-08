const Booking = require("../models/Booking");
const Slot = require("../models/Slot");

/**
 * Booking Controller
 * Handles HTTP requests for booking operations
 * Manages slot reservations, retrieval, and cancellations
 */

/**
 * POST /api/bookings
 * Book a gym slot for authenticated user
 * Validates slot ID and checks availability before booking
 * Returns 201 on success with booking details
 */
const bookSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    const userId = req.user.userId; // From JWT token

    // Validate required parameters
    if (!slotId) {
      return res.status(400).json({ error: "Slot ID required" });
    }

    // Atomic operation: check availability and create booking in one query
    // Prevents race conditions where two users book same slot simultaneously
    const booking = await Slot.checkAndBook(userId, slotId);

    res.status(201).json({
      message: "Slot booked successfully",
      booking,
    });
  } catch (err) {
    // Specific error handling for different failure scenarios
    if (err.message === "Slot is full") {
      return res.status(400).json({ error: err.message });
    }
    if (err.message === "User already booked this slot") {
      return res.status(400).json({ error: err.message });
    }
    console.error("Booking error:", err);
    res.status(500).json({ error: "Booking failed" });
  }
};

/**
 * GET /api/bookings
 * Retrieve all active bookings for authenticated user
 * Includes slot time and booking status
 */
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT token
    const bookings = await Booking.getByUserId(userId);
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

/**
 * DELETE /api/bookings/:bookingId
 * Cancel an active booking for authenticated user
 * Only allows canceling own bookings (user_id must match)
 */
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId; // From JWT token

    // Cancel only if booking belongs to current user
    const booking = await Booking.cancel(bookingId, userId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    console.error("Cancellation error:", err);
    res.status(500).json({ error: "Cancellation failed" });
  }
};

module.exports = { bookSlot, getMyBookings, cancelBooking };
