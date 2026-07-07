
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  mobile: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  isEmailVerified: {
    type: Boolean,
    default: false
  },

  //  isPasswordVerified: {
  //   type: Boolean,
  //   default: false
  // },

  isMobileVerified: {
    type: Boolean,
    default: false
  },

  refreshTokens: {
    type: [String],
    default: []
  },

  sessions: {
    type: [
      {
        deviceName: String,
        deviceType: String,
        lastActive: Date,
        ipAddress: String,
      }
    ],
    default: []
  },

  loginHistory: {
    type: [
      {
        loginMethod: String,
        ipAddress: String,
        deviceInfo: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],
    default: []
  },

  emailToken: String,
  mobileOTP: String
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);