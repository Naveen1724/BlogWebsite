const express = require("express");
const {
  signup,
  login,
  getProfile,
  logout,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");
const {
  signupValidation,
  loginValidation,
} = require("../middleware/validation");

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post("/signup", signupValidation, signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginValidation, login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", authMiddleware, logout);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
