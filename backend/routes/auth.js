const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

/**
 * Authentication Routes
 * Handles user registration and login
 * Issues JWT tokens for API access
 */

/**
 * POST /api/auth/register
 * Create new user account
 * Body: { email, password, name }
 * Returns: { token, user }
 */
router.post("/register", register);

/**
 * POST /api/auth/login
 * Authenticate user and get JWT token
 * Body: { email, password }
 * Returns: { token, user }
 */
router.post("/login", login);

module.exports = router;
