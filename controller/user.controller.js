// Import required libraries and modules
import bcrypt from "bcryptjs"; // For password hashing and comparison
import jwt from "jsonwebtoken"; // For generating authentication tokens
import crypto from "crypto"; // For generating random tokens (email verification, reset)
import nodemailer from "nodemailer"; // For sending emails
import User from "../model/user.model.js"; // Import User model
import path from "path";


// user controllers

// ===============================
// REGISTER USER
// ===============================
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Step 1: Validate input fields
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Step 3: Create user (ensure password is hashed in User model)
    const user = await User.create({ name, email, password });

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

    // Step 4: Generate email verification token (not JWT)
    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    await user.save();

    // Step 5: Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_SENDER_EMAIL,
      to: user.email,
      subject: "Verify your email",
      text: `Please click on the 
      following link to verify your email: ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
    };

    await transporter.sendMail(mailOptions);

    // Step 6: Return success response
    res.status(200).json({
      message: "User registered, check your email to verify",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered",
      error,
      success: false,
    });
  }
};

// ===============================
// VERIFY USER
// ===============================
const verifyUser = async (req, res) => {
  const { token } = req.params;
  console.log(token);

  // Step 1: Validate token
  if (!token) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  try {
    // Step 2: Find user with this verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    // Step 3: Mark user as verified and clear verification fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "User verified",
    });
  } catch (error) {
    res.status(400).json({
      message: "User not verified",
      error,
    });
  }
};

// ===============================
// LOGIN USER
// ===============================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    // Step 2: Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Step 3: Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Step 4: Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("=== Login Controller Debug ===");
    console.log("Token generated:", token);

    // Step 5: Set cookie with the token
    const cookieOptions = {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    };

    console.log("Cookie options:", cookieOptions);
    res.cookie("token", token, cookieOptions);
    console.log("Response headers:", res.getHeaders());

    // Step 6: Send login success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error,
    });
  }
};

// ===============================
// GET LOGGED-IN USER
// ===============================
const getMe = async (req, res) => {
  try {
    // Step 1: Get user by ID from token (req.user set by auth middleware)
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 2: Return user profile
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};

// ===============================
// LOGOUT USER
// ===============================
const logoutUser = (req, res) => {
  try {
    // Step 1: Clear token cookie
    res.cookie("token", "", {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    // Step 2: Return logout success message
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
};

// ===============================
// FORGOT PASSWORD
// ===============================
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Step 1: Validate email
  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  try {
    // Step 2: Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    // Step 3: Generate password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetUrl = `${process.env.BASE_URL}/api/v1/users/reset-password/${resetToken}`;

    // Step 4: Send password reset email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_SENDER_EMAIL,
      to: user.email,
      subject: "Reset your password",
      text: `Please click on the following link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Reset token sent to email",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ===============================
// RESET PASSWORD
// ===============================
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Step 1: Validate inputs
  if (!token || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    // Step 2: Find user with valid token and non-expired
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    // Step 3: Set new password and clear reset token fields
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ===============================
// EXPORT CONTROLLERS
// ===============================
export {
  registerUser,
  loginUser,
  getMe,
  verifyUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
