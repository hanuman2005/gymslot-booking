/**
 * API Configuration
 * Dynamically sets the API URL based on the environment
 */

// Determine the appropriate API URL based on environment
let API_URL;

if (typeof window !== "undefined") {
  // Browser environment
  const hostname = window.location.hostname;

  if (hostname.includes("vercel")) {
    // Production on Vercel
    API_URL = "https://gymslot-booking.onrender.com/api";
  } else if (hostname.includes("localhost") || hostname === "127.0.0.1") {
    // Local development
    API_URL = "http://localhost:5000/api";
  } else {
    // Fallback - assume production
    API_URL = "https://gymslot-booking.onrender.com/api";
  }
} else {
  // Node.js environment (shouldn't happen in React, but just in case)
  API_URL = "http://localhost:5000/api";
}

// Log the API URL for debugging
console.log("[API Config] Using API URL:", API_URL);
console.log(
  "[API Config] Hostname:",
  typeof window !== "undefined" ? window.location.hostname : "N/A",
);

export default API_URL;
