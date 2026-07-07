const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const sendOTP = require("../utils/sendOTP");
const OTP = require("../models/otp");

// ===================== REGISTRATION =====================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, isEmailVerified, isMobileVerified } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedMobile = mobile.trim();

    const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { mobile: normalizedMobile }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Mobile already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      mobile: normalizedMobile,
      password: hashedPassword,
      isEmailVerified: Boolean(isEmailVerified),
      isMobileVerified: Boolean(isMobileVerified),
    });

    res.status(201).json({ message: "User registered successfully", user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ===================== EMAIL OTP VERIFICATION =====================

exports.sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body; // email recive karta hai 

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const otp = Math.floor(          //otp generate karta hai 6d
      100000 + Math.random() * 900000
    ).toString();

    await OTP.findOneAndDelete({
      email,
      type: "email",
    });



   //database save karta 


    await OTP.create({ 
      email,
      otp,
      type: "email",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    console.log(`Email OTP for ${email}: ${otp}`);


    await sendEmail({
      to: email,
      subject: "Email Verification OTP",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }
    const otpRecord = await OTP.findOne({
      email,
      type: "email",
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (
      otpRecord.otp.trim() !==
      otp.toString().trim()
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    const user = await User.findOne({ email });
    if (user) {
      user.isEmailVerified = true;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.sendPhoneOTP = async (req, res) => {
  try {
    let { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile is required" });
    }

    mobile = mobile.trim();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndDelete({ mobile, type: "phone" });
    await OTP.create({
      mobile,
      otp,
      type: "phone",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    console.log(`Phone OTP for ${mobile}: ${otp}`);
    await sendOTP("+91 872 6322 928", otp);

    return res.status(200).json({ success: true, message: "OTP sent to phone successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.verifyPhoneOTP = async (req, res) => {
  try {
    let { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile and OTP are required" });
    }

    mobile = mobile.trim();
    otp = otp.toString().trim();

    const otpRecord = await OTP.findOne({ mobile, type: "phone" });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (otpRecord.otp.trim() !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    const user = await User.findOne({ mobile });
    if (user) {
      user.isMobileVerified = true;
      await user.save();
    }

    return res.status(200).json({ success: true, message: "Phone verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ===================== EMAIL + PASSWORD LOGIN =====================
exports.loginWithEmailPassword = async (req, res) => {
  try {
    const { email, password, deviceName, ipAddress } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    const tokens = generateTokens(user._id);
    user.refreshTokens.push(tokens.refreshToken);
    user.lastLogin = new Date();

    // Add to sessions
    user.sessions.push({
      deviceName: deviceName || "Unknown Device",
      deviceType: "Web",
      lastActive: new Date(),
      ipAddress,
    });

    // Add to login history
    user.loginHistory.push({
      loginMethod: "email-password",
      ipAddress,
      deviceInfo: deviceName || "Unknown",
    });

    await user.save();

    res.json({
      message: "Login successful",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ===================== EMAIL + OTP LOGIN =====================
exports.loginWithEmailOTP = async (req, res) => {
  try {
    res.set("Referrer-Policy", "no-referrer-when-downgrade");
    let { email, otp, deviceName, ipAddress } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    email = email.toLowerCase().trim();
    otp = otp.toString().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otpRecord = await OTP.findOne({ email, type: "email" });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (otpRecord.otp.trim() !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    const tokens = generateTokens(user._id);
    user.refreshTokens = user.refreshTokens || [];
    user.sessions = user.sessions || [];
    user.loginHistory = user.loginHistory || [];
    user.refreshTokens.push(tokens.refreshToken);
    user.lastLogin = new Date();

    user.sessions.push({
      deviceName: deviceName || "Unknown Device",
      deviceType: "Web",
      lastActive: new Date(),
      ipAddress,
    });

    user.loginHistory.push({
      loginMethod: "email-otp",
      ipAddress,
      deviceInfo: deviceName || "Unknown",
    });

    await user.save();

    res.json({
      message: "Login successful",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== PHONE + OTP LOGIN =====================
exports.loginWithPhoneOTP = async (req, res) => {
  try {
    let { mobile, otp, deviceName, ipAddress } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile and OTP are required" });
    }

    mobile = mobile.trim();
    otp = otp.toString().trim();

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otpRecord = await OTP.findOne({ mobile, type: "phone" });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (otpRecord.otp.trim() !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    const tokens = generateTokens(user._id);
    user.refreshTokens = user.refreshTokens || [];
    user.sessions = user.sessions || [];
    user.loginHistory = user.loginHistory || [];
    user.refreshTokens.push(tokens.refreshToken);
    user.lastLogin = new Date();

    user.sessions.push({
      deviceName: deviceName || "Unknown Device",
      deviceType: "Mobile",
      lastActive: new Date(),
      ipAddress,
    });

    user.loginHistory.push({
      loginMethod: "phone-otp",
      ipAddress,
      deviceInfo: deviceName || "Unknown",
    });

    await user.save();

    res.json({
      message: "Login successful",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: user._id, name: user.name, mobile: user.mobile },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== FORGOT PASSWORD =====================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.forgotPasswordToken = resetToken;
    user.forgotPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Password Reset Link",
      html: `<h2>Password Reset</h2><p><a href="${resetUrl}">Click here to reset your password</a></p><p>This link expires in 30 minutes.</p>`,
    });

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const user = await User.findOne({ forgotPasswordToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    if (new Date() > user.forgotPasswordExpire) {
      return res.status(400).json({ message: "Reset token has expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpire = undefined;
    user.lastPasswordChange = new Date();
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== REFRESH TOKEN =====================
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "refreshsecret");
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const tokens = generateTokens(user._id);
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// ===================== LOGOUT =====================
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user.id;

    if (refreshToken) {
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { refreshTokens: refreshToken } },
        { new: true }
      );
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== LOGIN HISTORY =====================
exports.getLoginHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("loginHistory");
    res.json({ loginHistory: user.loginHistory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== MULTI-DEVICE SESSION MANAGEMENT =====================
exports.getSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("sessions");
    res.json({ sessions: user.sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { sessions: { _id: sessionId } } },
      { new: true }
    );
    res.json({ message: "Session removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logoutAllDevices = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { refreshTokens: [], sessions: [] },
      { new: true }
    );
    res.json({ message: "Logged out from all devices" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== GET USER PROFILE =====================
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshTokens");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== HELPER FUNCTIONS =====================
function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET || "refreshsecret", {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}
