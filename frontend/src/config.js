/**
 * API Configuration
 * Dynamically sets the API URL based on the environment
 */

const API_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" && window.location.hostname.includes("vercel")
    ? "https://gymslot-booking.onrender.com/api"
    : "http://localhost:5000/api");

export default API_URL;
