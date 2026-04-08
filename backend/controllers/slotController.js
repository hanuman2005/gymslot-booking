const Slot = require("../models/Slot");
const Booking = require("../models/Booking");

/**
 * Slot Controller
 * Handles HTTP requests for gym slot operations
 * Manages slot retrieval and availability information
 */

/**
 * GET /api/slots
 * Retrieve all available gym slots with real-time booking status
 * Returns slots with booked_count and available_slots for each time slot
 */
const getAllSlots = async (req, res) => {
  try {
    // Get all slots with aggregated booking counts from database
    const slots = await Slot.getAll();

    // Enrich slot data with current booking information
    // Slots returned from getAll() already include booked_count and available_slots
    // from the aggregated query, so we can return directly
    res.json(slots);
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
};

module.exports = { getAllSlots };
