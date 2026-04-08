import React from "react";
import "./SlotsList.css";

function SlotsList({ slots, onBook }) {
  return (
    <div className="slots-list">
      <h2>Available Gym Slots</h2>
      {slots.length === 0 ? (
        <p>No slots available</p>
      ) : (
        <div className="slots-grid">
          {slots.map((slot) => (
            <div key={slot.id} className="slot-card">
              <div className="slot-time">{slot.slot_time}</div>
              <div className="slot-capacity">
                <span className="available-count">{slot.available_slots}</span>
                <span className="capacity-label">Slots Available</span>
              </div>
              <div className="slot-details">
                <small>
                  {slot.booked_count}/{slot.capacity} booked
                </small>
              </div>
              <button
                className={`btn-book ${slot.available_slots === 0 ? "disabled" : ""}`}
                onClick={() => onBook(slot.id)}
                disabled={slot.available_slots === 0}
              >
                {slot.available_slots === 0 ? "Slot Full" : "Book Slot"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SlotsList;
