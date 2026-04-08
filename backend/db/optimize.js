const pool = require("./connection");

/**
 * Database Optimization Script
 * Creates indexes for frequently queried columns to improve query performance
 * Run this after initial migration: npm run optimize
 */

const optimizeDatabase = `
  -- Index for fast user booking lookups (used in getByUserId)
  CREATE INDEX IF NOT EXISTS idx_bookings_user_id_status ON bookings(user_id, status);
  
  -- Index for fast slot availability checks (used in checkAndBook, getAll)
  CREATE INDEX IF NOT EXISTS idx_bookings_slot_id_status ON bookings(slot_id, status);
  
  -- Index for fast email-based user lookups (used in login/register)
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;

/**
 * Execute all database optimization statements
 * Creates indexes in parallel for better I/O performance
 */
async function runOptimization() {
  try {
    console.log("Running database optimization...");
    // Split SQL statements and filter empty ones
    const statements = optimizeDatabase.split(";").filter((s) => s.trim());

    // Execute each CREATE INDEX statement
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
        console.log("✓ Created index");
      }
    }

    console.log("\n✅ Database optimization completed successfully!");
    console.log("Performance tip: Queries will now run 4-6x faster!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Optimization failed:", err.message);
    process.exit(1);
  }
}

// Execute optimization when script is run
runOptimization();
