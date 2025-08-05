const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in cookies first, then in Authorization header
    let token = req.cookies.authToken;

    if (!token) {
      // Fallback to Authorization header for backward compatibility
      token = req.header("Authorization")?.replace("Bearer ", "");
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

// Optional authentication middleware - sets req.user if token exists but doesn't fail if no token
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    // Check for token in cookies first, then in Authorization header
    let token = req.cookies.authToken;

    if (!token) {
      // Fallback to Authorization header
      token = req.header("Authorization")?.replace("Bearer ", "");
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (user && user.isActive) {
          req.user = decoded;
        }
      } catch (error) {
        // Token invalid, but we don't fail the request
        console.log("Invalid token in optional auth:", error.message);
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next(); // Continue without authentication
  }
};

module.exports = { authMiddleware, optionalAuthMiddleware };
