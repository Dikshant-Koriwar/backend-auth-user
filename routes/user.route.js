// Routes for user authentication features

import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  verifyUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controller/user.controller.js";

import { isLoggedIn } from "../middleware/user.middleware.js";

// Initialize Express Router
const router = express.Router();

// 1️⃣ Register a new user
// @route   POST /api/v1/users/register
// @access  Public
router.post("/register", registerUser);

// 2️⃣ Login user and send JWT token in cookie
// @route   POST /api/v1/users/login
// @access  Public
router.post("/login", loginUser);

// 3️⃣ Get currently logged-in user's info
// @route   GET /api/v1/users/me
// @access  Protected
router.get("/me", isLoggedIn, getMe);

// 4️⃣ Email verification link handler
// @route   GET /api/v1/users/verify/:token
// @access  Public
router.get("/verify/:token", verifyUser);

// 5️⃣ Logout the user by clearing the cookie
// @route   GET /api/v1/users/logout
// @access  Protected
router.get("/logout", isLoggedIn, logoutUser);

// 6️⃣ Forgot password – generate reset token and send email
// @route   POST /api/v1/users/forgot-password
// @access  Public
router.post("/forgot-password", forgotPassword);

// 7️⃣ Reset password using the token from email
// @route   POST /api/v1/users/reset-password/:token
// @access  Public
router.post("/reset-password/:token", resetPassword);

// Export the router to use in main server file
export default router;
