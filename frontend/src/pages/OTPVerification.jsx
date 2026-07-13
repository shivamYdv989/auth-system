import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function OTPVerification() {


  const location = useLocation();
  //const navigate = useNavigate();
  const searchState = location.state || {};
  const [verificationStep, setVerificationStep] = useState(searchState.verificationStep || "email"); // email or phone
  const [email, setEmail] = useState(searchState.email || "");
  const [mobile, setMobile] = useState(searchState.mobile || "");
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);
  const [context, setContext] = useState(searchState.context || "");
  const [returnTo, setReturnTo] = useState(searchState.returnTo || "/login");



  
  useEffect(() => {
    if (searchState.verificationStep) {
      setVerificationStep(searchState.verificationStep);
    }
    if (searchState.email) {
      setEmail(searchState.email);
    }
    if (searchState.mobile) {
      setMobile(searchState.mobile);
    }
    if (searchState.context) {
      setContext(searchState.context);
    }
    if (searchState.returnTo) {
      setReturnTo(searchState.returnTo);
    }
  }, [searchState]);

  const handleSendEmailOTP = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post("https://auth-system-4dje.onrender.com/api/auth/send-email-otp", { email });
      setMessage(res.data.message);
      setShowOTPField(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post("https://auth-system-4dje.onrender.com/api/auth/verify-email-otp", {
        email,
        otp,
      });
      setMessage(res.data.message);
      if (context === "register") {
        localStorage.setItem("registerEmailVerified", "true");
        navigate(returnTo || "/register", { replace: true });
      } else {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOTP = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        "https://auth-system-4dje.onrender.com/api/auth/send-phone-otp",
        { mobile }
      );

      setMessage(res.data.message);
      setShowOTPField(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        "https://auth-system-4dje.onrender.com/api/auth/verify-phone-otp",
        {
          mobile,
          otp,
        }
      );

      setMessage(res.data.message);

      if (context === "register") {
        localStorage.setItem("registerMobileVerified", "true");
        navigate(returnTo || "/register", { replace: true });
      } else {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Verify OTP</h2>
          <p className="text-gray-600 text-sm mt-2">Complete your account verification</p>
        </div>

        {/* Verification Method Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setVerificationStep("email");
              setShowOTPField(false);
              setOTP("");
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium cursor-pointer transition ${verificationStep === "email"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Email
          </button>

          <button
            onClick={() => {
              setVerificationStep("phone");
              setShowOTPField(false);
              setOTP("");
            }}
            className={` cursor-po   flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${verificationStep === "phone"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Phone
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {verificationStep === "email" ? (
          <form onSubmit={handleVerifyEmailOTP} className="space-y-4">
            {!showOTPField ? (
              <>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendEmailOTP}
                  //onChange={(a) => setEmail(a.target.value)}

                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>


                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    placeholder="000000"
                    required
                    maxLength="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>


                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
          </form>
        ) : (


          <form onSubmit={handleVerifyPhoneOTP} className="space-y-4">
            {!showOTPField ? (
              <>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>


                <button
                  type="button"
                  onClick={handleSendPhoneOTP}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>

              </>
            ) : (
              <>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    placeholder="000000"
                    required
                    maxLength="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
          </form>
        )}


        <p className="text-center text-gray-600 text-sm mt-6">
          <a href="/login" className="text-indigo-600 font-medium hover:underline">
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}

export default OTPVerification;
