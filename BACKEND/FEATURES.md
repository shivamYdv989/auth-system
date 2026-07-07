# Authentication System - Complete Feature Guide

This is a full-featured authentication system built with Node.js/Express backend and React frontend with Tailwind CSS styling.

## Features Implemented

### 1. **User Registration** ✅
- Register with name, email, mobile, and password
- Password hashing with bcryptjs
- Unique email and mobile validation
- Responsive Tailwind UI

### 2. **Email OTP Verification** ✅
- Send OTP to email (6-digit code)
- Verify email OTP
- OTP expires in 10 minutes
- Auto-delete expired OTPs

### 3. **Phone OTP Verification** ✅
- Send OTP to phone number
- Verify phone OTP
- OTP expires in 10 minutes
- Ready for Twilio integration

### 4. **Email + Password Login** ✅
- Traditional email/password authentication
- Password comparison with bcryptjs
- Requires verified email
- Device tracking and IP logging

### 5. **Email + OTP Login** ✅
- OTP-based login via email
- Secure 6-digit verification
- No password required
- Session management

### 6. **Phone + OTP Login** ✅
- OTP-based login via phone
- SMS verification (Twilio ready)
- Alternative authentication method
- Device tracking

### 7. **Forgot Password** ✅
- Request password reset link
- Reset token generation (32-byte random)
- Token expires in 30 minutes
- Email notification with reset link
- Password reset with token verification

### 8. **Resend OTP** ✅
- Resend email OTP functionality
- Resend phone OTP functionality
- Easy integration in UI

### 9. **Refresh Token** ✅
- JWT refresh token mechanism
- 1-hour access token lifetime
- 7-day refresh token lifetime
- Automatic token refresh on 401

### 10. **Logout** ✅
- Single device logout
- Removes refresh token
- Clears local storage

### 11. **Login History** (Bonus) ✅
- Track all login attempts
- Login method recorded (email-password, email-otp, phone-otp)
- IP address logged
- Device information stored
- Timestamp for each login

### 12. **Multi-device Session Management** (Bonus) ✅
- View all active sessions
- Session device name and type
- Last active timestamp
- Remove specific sessions
- Logout from all devices
- Device-specific tracking

## Project Structure

```
auth-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── authController.js     # All auth logic
│   ├── models/
│   │   └── User.js               # User schema with sessions
│   ├── routes/
│   │   └── authRoutes.js         # API endpoints
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── utils/
│   │   ├── sendEmail.js          # Email sending
│   │   └── sendOTP.js            # OTP generation
│   ├── .env                      # Configuration
│   ├── server.js                 # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Register.jsx       # Registration page
    │   │   ├── Login.jsx          # 3-method login
    │   │   ├── ForgotPassword.jsx # Password reset
    │   │   ├── Dashboard.jsx      # User dashboard
    │   │   └── OTPVerification.jsx# OTP verification
    │   ├── services/
    │   │   └── api.js             # API client with token refresh
    │   └── App.jsx                # Routing
    ├── tailwind.config.js         # Tailwind config
    ├── postcss.config.js          # PostCSS config
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login-email-password` - Login with email & password
- `POST /api/auth/login-email-otp` - Login with email OTP
- `POST /api/auth/login-phone-otp` - Login with phone OTP

### Email OTP
- `POST /api/auth/send-email-otp` - Send OTP to email
- `POST /api/auth/verify-email-otp` - Verify email OTP

### Phone OTP
- `POST /api/auth/send-phone-otp` - Send OTP to phone
- `POST /api/auth/verify-phone-otp` - Verify phone OTP

### Password Management
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Token Management
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout (requires auth)
- `POST /api/auth/logout-all-devices` - Logout from all devices (requires auth)

### User Data
- `GET /api/auth/profile` - Get user profile (requires auth)
- `GET /api/auth/login-history` - Get login history (requires auth)
- `GET /api/auth/sessions` - Get active sessions (requires auth)
- `POST /api/auth/remove-session` - Remove specific session (requires auth)

## Setup Instructions

### Backend Setup

1. Install dependencies:
```bash
cd auth-system
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/auth-system
JWT_SECRET=mysecretkey
REFRESH_TOKEN_SECRET=myrefreshsecret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE=+1XXXXXXXXXX
FRONTEND_URL=localhost:5000
```

3. Start MongoDB:
```bash
mongod
```

4. Run server:
```bash
node server.js
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start dev server:
```bash
npm run dev
```

## User Schema

```javascript
{
  name: String,
  email: String (unique),
  mobile: String (unique),
  password: String,
  isEmailVerified: Boolean,
  isMobileVerified: Boolean,
  emailOTP: String,
  emailOTPExpire: Date,
  mobileOTP: String,
  mobileOTPExpire: Date,
  refreshTokens: [String],
  sessions: [{
    deviceName: String,
    deviceType: String,
    lastActive: Date,
    ipAddress: String,
    userAgent: String
  }],
  loginHistory: [{
    timestamp: Date,
    loginMethod: String,
    ipAddress: String,
    deviceInfo: String
  }],
  forgotPasswordToken: String,
  forgotPasswordExpire: Date,
  lastLogin: Date,
  lastPasswordChange: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Flow

### Registration Flow
1. User goes to `/register`
2. Fills form with name, email, mobile, password
3. Clicks Register
4. Success message shown
5. User redirected to login

### Login Flow (Choose one)
**Method 1: Email + Password**
1. Go to `/login`
2. Select "Email & Password" tab
3. Enter email and password
4. Click Sign In
5. Dashboard opens

**Method 2: Email OTP**
1. Go to `/login`
2. Select "Email OTP" tab
3. Enter email
4. Click "Send OTP"
5. Check email for OTP
6. Enter OTP and click Sign In
7. Dashboard opens

**Method 3: Phone OTP**
1. Go to `/login`
2. Select "Phone OTP" tab
3. Enter phone number
4. Click "Send OTP"
5. Receive SMS with OTP
6. Enter OTP and click Sign In
7. Dashboard opens

### Forgot Password Flow
1. Go to `/forgot-password`
2. Enter email
3. Check email for reset link
4. Click link with token
5. Enter new password
6. Confirm password
7. Password reset successfully

### Dashboard Features
1. View profile information
2. See login history
3. Manage active sessions
4. Logout from current device
5. Logout from all devices

## Security Features

✅ Password hashing with bcryptjs (10 rounds)
✅ JWT tokens with expiration
✅ Refresh token rotation
✅ OTP expiration (10 minutes)
✅ Password reset token expiration (30 minutes)
✅ IP address logging
✅ Device tracking
✅ Session management
✅ Bearer token authentication
✅ HTTP-only cookie ready (can be implemented)

## Frontend Components

### Register.jsx
- Form validation
- Loading states
- Error/success messages
- Responsive design with Tailwind

### Login.jsx
- 3 authentication methods
- Tab switching
- OTP send/verify flow
- Token storage
- Auto-redirect to dashboard

### ForgotPassword.jsx
- 2-step password reset
- Email verification
- Token input
- Password confirmation

### Dashboard.jsx
- Profile display
- Login history table
- Sessions management
- Logout options
- Responsive layout

### OTPVerification.jsx
- Email OTP verification
- Phone OTP verification
- Resend OTP functionality
- Token storage

## Integration Checklist

- [x] Backend API complete
- [x] Frontend pages complete
- [x] Tailwind CSS styling
- [x] Token refresh mechanism
- [x] Session management
- [x] Login history
- [x] OTP functionality
- [ ] Twilio SMS integration (Requires Twilio account)
- [ ] Email integration (Requires Gmail app password)
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Deployment ready

## Next Steps

1. **Email Integration**: Set up Gmail app password or SendGrid
2. **SMS Integration**: Add Twilio SID and auth token
3. **Rate Limiting**: Add express-rate-limit
4. **CORS**: Configure CORS for production
5. **Environment**: Move to production database
6. **SSL/HTTPS**: Implement SSL certificates
7. **Testing**: Add unit and integration tests
8. **Monitoring**: Add logging and monitoring
9. **Error Handling**: Enhance error messages
10. **Database Backup**: Set up MongoDB backups

## Technologies Used

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT
- bcryptjs
- Nodemailer
- Twilio (optional)

**Frontend:**
- React.js
- React Router
- Axios
- Tailwind CSS
- Vite

## License

MIT License - Feel free to use for personal and commercial projects.
