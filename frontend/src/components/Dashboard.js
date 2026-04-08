import React, { useState, useEffect, useCallback } from "react";
import "./Dashboard.css";
import SlotsList from "./SlotsList";
import MyBookings from "./MyBookings";
import API_URL from "../config";

function Dashboard({ user, token, onLogout }) {
  const [activeTab, setActiveTab] = useState("slots");
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/slots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSlots(data);
    } catch (err) {
      console.error("Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/bookings`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "slots") {
      fetchSlots();
    } else {
      fetchMyBookings();
    }
  }, [activeTab, fetchSlots, fetchMyBookings]);

  const handleBookSlot = async (slotId) => {
    try {
      const response = await fetch(
        `${API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ slotId }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Booking failed");
        return;
      }

      alert("Slot booked successfully!");
      fetchSlots();
      fetchMyBookings();
    } catch (err) {
      alert("Booking error. Please try again.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        alert("Cancellation failed");
        return;
      }

      alert("Booking cancelled successfully!");
      fetchSlots();
      fetchMyBookings();
    } catch (err) {
      alert("Cancellation error. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Gym Slot Booking</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}!</span>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "slots" ? "active" : ""}`}
            onClick={() => setActiveTab("slots")}
          >
            Available Slots
          </button>
          <button
            className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            My Bookings
          </button>
        </div>

        <div className="tab-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : activeTab === "slots" ? (
            <SlotsList slots={slots} onBook={handleBookSlot} />
          ) : (
            <MyBookings bookings={bookings} onCancel={handleCancelBooking} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
