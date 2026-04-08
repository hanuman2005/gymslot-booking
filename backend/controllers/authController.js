const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Auth Controller
 * Handles user authentication (registration and login)
 * Issues JWT tokens for API access
 */

/**
 * POST /api/auth/register
 * Create new user account
 * Validates email uniqueness and password security
 * Returns JWT token valid for 7 days
 */
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate all required fields are provided
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create user (password hashed automatically in model)
    const user = await User.create(email, password, name);

    // Generate JWT token with user info
    // Token expires in 7 days
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 * Returns JWT token if credentials are valid
 * Token valid for 7 days
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required credentials
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      // Generic error message for security (don't reveal if email exists)
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password (compares with hashed value in database)
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token with user info
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { register, login };
