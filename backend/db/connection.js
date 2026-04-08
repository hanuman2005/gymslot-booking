const { Pool } = require("pg");
require("dotenv").config(); // Load DATABASE_URL from .env

/**
 * PostgreSQL Database Connection Pool
 * Manages reusable connections to NeonDB
 * Connection string format:
 * postgresql://user:password@host:port/database?sslmode=require
 */
const pool = new Pool({
  // Get full connection string from environment (NeonDB format)
  connectionString: process.env.DATABASE_URL,
  // SSL required for NeonDB (cloud PostgreSQL)
  ssl: { rejectUnauthorized: false },
});

// Handle unexpected errors on idle connections
pool.on("error", (err) => {
  console.error("Database connection error:", err);
});

// Export pool for use throughout application
module.exports = pool;
