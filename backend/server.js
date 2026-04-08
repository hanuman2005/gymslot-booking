const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

const authRoutes = require("./routes/auth");
const slotRoutes = require("./routes/slots");
const bookingRoutes = require("./routes/bookings");

const app = express();

/**
 * Middleware Setup
 * CORS: Allow requests from frontend on different port/domain
 * JSON: Parse incoming request bodies as JSON
 */
// Configure CORS to allow both development and production frontends
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://gymslot-booking.vercel.app",
      "https://www.gymslot-booking.vercel.app",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

/**
 * API Routes
 * /api/auth - User registration and login
 * /api/slots - View available gym slots
 * /api/bookings - Book slots, view bookings, cancel bookings (protected)
 */
app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

/**
 * Health Check Endpoint
 * GET /api/health
 * Returns status 200 with OK message (used for monitoring)
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Start server on specified port (default 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/api`);
});
