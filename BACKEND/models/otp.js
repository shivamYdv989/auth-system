const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
  },

  mobile: {
    type: String,
  },

  otp: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["email", "phone"],
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("OTP", otpSchema);