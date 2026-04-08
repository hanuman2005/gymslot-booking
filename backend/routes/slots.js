const express = require("express");
const router = express.Router();
const { getAllSlots } = require("../controllers/slotController");

/**
 * Slot Routes
 * Handles retrieval of available gym time slots
 */

/**
 * GET /api/slots
 * Retrieve all available gym slots with current booking status
 * No authentication required (public endpoint)
 * Returns: Array of slots with booked_count and available_slots
 */
router.get("/", getAllSlots);

module.exports = router;
