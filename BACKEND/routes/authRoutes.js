
const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const loginUser =require("../controllers/loginUser")

const router = express.Router();

// Registration
router.post("/register", authController.registerUser);

// Email OTP Verification
router.post("/send-email-otp", authController.sendEmailOTP);
router.post("/verify-email-otp", authController.verifyEmailOTP);

// Phone OTP Verification
router.post("/send-phone-otp", authController.sendPhoneOTP);
router.post("/verify-phone-otp", authController.verifyPhoneOTP);

// Login Methods
router.post("/login", loginUser);
router.post("/login-email-password", authController.loginWithEmailPassword);
router.post("/login-email-otp", authController.loginWithEmailOTP);
router.post("/login-phone-otp", authController.loginWithPhoneOTP);

// Forgot Password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Token Management
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authMiddleware.protect, authController.logout);
router.post("/logout-all-devices", authMiddleware.protect, authController.logoutAllDevices);

// User Profile & History
router.get("/profile", authMiddleware.protect, authController.getUserProfile);
router.get("/login-history", authMiddleware.protect, authController.getLoginHistory);

// Sessions Management
router.get("/sessions", authMiddleware.protect, authController.getSessions);
router.post("/remove-session", authMiddleware.protect, authController.removeSession);

module.exports = router;






