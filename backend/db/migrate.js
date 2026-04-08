const pool = require("./connection");

/**
 * Database Migration Script
 * Creates initial database schema for Gym Slot Booking System
 * Run this once after setting up NeonDB: npm run migrate
 */

const schema = `
  -- Users Table: User accounts with secure password storage
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL, -- Email must be unique for login
    password VARCHAR(255) NOT NULL,      -- Hashed with bcryptjs
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Slots Table: Gym time slots (6am to 10pm, max 10 users per slot)
  CREATE TABLE IF NOT EXISTS slots (
    id SERIAL PRIMARY KEY,
    slot_time VARCHAR(50) NOT NULL UNIQUE, -- "06:00 AM - 07:00 AM"
    capacity INTEGER DEFAULT 10,            -- Max users per slot
    booked_count INTEGER DEFAULT 0,         -- Deprecated (calculated from bookings)
    available_slots INTEGER DEFAULT 10,     -- Deprecated (calculated from bookings)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Bookings Table: User slot reservations
  CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slot_id INTEGER NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active', -- Can be 'active' or 'cancelled'
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, slot_id)              -- Prevent duplicate bookings by same user
  );

  -- Seed 16 default gym time slots (6am to 10pm)
  INSERT INTO slots (slot_time, capacity, booked_count, available_slots)
  VALUES 
    ('06:00 AM - 07:00 AM', 10, 0, 10),
    ('07:00 AM - 08:00 AM', 10, 0, 10),
    ('08:00 AM - 09:00 AM', 10, 0, 10),
    ('09:00 AM - 10:00 AM', 10, 0, 10),
    ('10:00 AM - 11:00 AM', 10, 0, 10),
    ('11:00 AM - 12:00 PM', 10, 0, 10),
    ('12:00 PM - 01:00 PM', 10, 0, 10),
    ('01:00 PM - 02:00 PM', 10, 0, 10),
    ('02:00 PM - 03:00 PM', 10, 0, 10),
    ('03:00 PM - 04:00 PM', 10, 0, 10),
    ('04:00 PM - 05:00 PM', 10, 0, 10),
    ('05:00 PM - 06:00 PM', 10, 0, 10),
    ('06:00 PM - 07:00 PM', 10, 0, 10),
    ('07:00 PM - 08:00 PM', 10, 0, 10),
    ('08:00 PM - 09:00 PM', 10, 0, 10),
    ('09:00 PM - 10:00 PM', 10, 0, 10)
  ON CONFLICT (slot_time) DO NOTHING;
`;

/**
 * Execute all migration SQL statements
 */
async function runMigration() {
  try {
    console.log("Running database migration...");
    const statements = schema.split(";").filter((s) => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }

    console.log("✓ Database migration completed successfully!");
    console.log("✓ Created: users, slots, bookings tables");
    console.log("✓ Seeded 16 gym time slots");
    process.exit(0);
  } catch (err) {
    console.error("✗ Migration failed:", err.message);
    process.exit(1);
  }
}

runMigration();
