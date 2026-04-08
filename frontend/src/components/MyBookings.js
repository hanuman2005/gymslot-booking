import React from "react";
import "./MyBookings.css";

function MyBookings({ bookings, onCancel }) {
  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="no-bookings">
          You have no active bookings. Book a slot to get started!
        </p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-slot-time">{booking.slot_time}</div>
              <div className="booking-details">
                <small>Booking ID: {booking.id}</small>
                <small>
                  Status:{" "}
                  <span className="status-active">{booking.status}</span>
                </small>
              </div>
              <button
                className="btn-cancel"
                onClick={() => onCancel(booking.id)}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
