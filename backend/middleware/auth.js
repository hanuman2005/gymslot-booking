const jwt = require("jsonwebtoken");

/**
 * Authentication Middleware
 * Verifies JWT token from request headers
 * Required for protected routes (bookings)
 * Adds user info to req.user for downstream handlers
 */

/**
 * Middleware: authenticateToken
 * Checks for valid JWT in Authorization header
 * Format: Bearer <token>
 * Passes if valid, returns 401/403 if invalid or missing
 */
const authenticateToken = (req, res, next) => {
  // Extract "Bearer <token>" from Authorization header
  const authHeader = req.headers["authorization"];
  // Get the token part (after "Bearer ")
  const token = authHeader && authHeader.split(" ")[1];

  // Return 401 if no token provided
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  // Verify token signature and expiration
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Return 403 if token is invalid or expired
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    // Attach decoded user data to request
    // Now available as req.user in next middleware/handler
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
