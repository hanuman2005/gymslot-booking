const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  bookSlot,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController");

/**
 * Booking Routes
 * All routes require JWT authentication (protected)
 * Handles user bookings: create, read, delete operations
 */

/**
 * POST /api/bookings
 * Book a gym slot for authenticated user
 * Headers: Authorization: Bearer <token>
 * Body: { slotId }
 * Returns: { booking }
 */
router.post("/", authenticateToken, bookSlot);

/**
 * GET /api/bookings
 * Retrieve all active bookings for authenticated user
 * Headers: Authorization: Bearer <token>
 * Returns: Array of active bookings with slot times
 */
router.get("/", authenticateToken, getMyBookings);

/**
 * DELETE /api/bookings/:bookingId
 * Cancel an active booking owned by authenticated user
 * Headers: Authorization: Bearer <token>
 * Params: bookingId
 * Returns: { booking }
 */
router.delete("/:bookingId", authenticateToken, cancelBooking);

module.exports = router;
