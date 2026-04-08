const pool = require("../db/connection");
const bcrypt = require("bcryptjs");

/**
 * User Model
 * Handles all database operations related to user accounts
 * Manages authentication with secure password hashing
 */
class User {
  /**
   * Create new user account
   * Password is hashed with bcryptjs (10 rounds) before storage
   * @param {string} email - User email (unique)
   * @param {string} password - Plain text password (will be hashed)
   * @param {string} name - User's full name
   * @returns {Promise<Object>} Created user object (without password)
   */
  static async create(email, password, name) {
    // Hash password with 10 salt rounds for security
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name",
      [email, hashedPassword, name],
    );
    return result.rows[0];
  }

  /**
   * Find user by email address
   * Used for login and email uniqueness checks
   * @param {string} email - User email
   * @returns {Promise<Object>} User object including hashed password, or undefined if not found
   */
  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  /**
   * Find user by ID
   * Used to retrieve user profile after login
   * @param {number} id - User ID
   * @returns {Promise<Object>} User object (without password), or undefined if not found
   */
  static async findById(id) {
    const result = await pool.query(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0];
  }

  /**
   * Verify password against hash
   * Compares plain text password with bcrypt hash
   * Safe comparison prevents timing attacks
   * @param {string} plainPassword - Plain text password from user input
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} True if password matches, false otherwise
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
