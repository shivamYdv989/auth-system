import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import { CiUser } from "react-icons/ci";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);

  const saveFormData = (data) => {
    setFormData(data);
    localStorage.setItem("registerFormData", JSON.stringify(data));
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem("registerFormData");
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (err) {
        console.error("Failed to parse saved register form data", err);
      }
    }

    setEmailVerified(localStorage.getItem("registerEmailVerified") === "true");
    setMobileVerified(localStorage.getItem("registerMobileVerified") === "true");
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    saveFormData(updatedFormData);

    if (name === "email") {
      setEmailVerified(false);
      localStorage.removeItem("registerEmailVerified");
    }

    if (name === "mobile") {
      setMobileVerified(false);
      localStorage.removeItem("registerMobileVerified");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "https://auth-system-ejul.vercel.app/api/auth/register",
        {
          ...formData,
          isEmailVerified: emailVerified,
          isMobileVerified: mobileVerified,
        }
      );
      setMessage(res.data.message);
      setFormData({ name: "", email: "", mobile: "", password: "" });
      setEmailVerified(false);
      setMobileVerified(false);
      localStorage.removeItem("registerEmailVerified");
      localStorage.removeItem("registerMobileVerified");
      localStorage.removeItem("registerFormData");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // verification otp function
  const sendEmailOTP = () => {
    if (!formData.email) {
      setError("Enter your email before sending OTP");
      return;
    }

    localStorage.setItem("registerFormData", JSON.stringify(formData));
    navigate("/verify-otp", {
      state: {
        verificationStep: "email",
        email: formData.email,
        returnTo: "/register",
        context: "register",
      },
    });
  };

  // opt fuction for phone no
  const sendPhoneOTP = () => {
    if (!formData.mobile) {
      setError("Enter your mobile number before sending OTP");
      return;
    }

    localStorage.setItem("registerFormData", JSON.stringify(formData));
    navigate("/verify-otp", {
      state: {
        verificationStep: "phone",
        mobile: formData.mobile,
        returnTo: "/register",
        context: "register",
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center  relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-0 left-0  h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0  h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
              <span className="text-3xl">👤</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Create Account
            </h2>

            <p className="text-slate-300 mt-2">
              Register and access your dashboard
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md">
              <p className="text-emerald-300 text-sm font-medium">
                {message}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-2xl bg-red-500/15 border border-red-400/30 backdrop-blur-md">
              <p className="text-red-300 text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

            {/* Name */}
            <div>
              <label className="block text-slate-200 text-md font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}


                placeholder="Enter your full name"
                autoComplete="off"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />


            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-200 text-md font-medium mb-2">
                Email Address
              </label>

              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="you@example.com"
                  autoComplete="off"
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={sendEmailOTP}
                  className={`px-4  cursor-pointer rounded-2xl text-white font-medium transition-all ${emailVerified
                    ? "bg-green-600"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105"
                    }`}
                >
                  {emailVerified ? "✓ Verified" : "Send OTP"}
                </button>
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-slate-200 text-md font-medium mb-2">
                Mobile Number
              </label>

              <div className="flex gap-2">
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  placeholder="+91 9876543210"
                  autoComplete="off"
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={sendPhoneOTP}
                  className={`px-4  cursor-pointer rounded-2xl text-white font-medium transition-all ${mobileVerified
                    ? "bg-green-600"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105"
                    }`}
                >
                  {mobileVerified ? "✓ Verified" : "Send OTP"}
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-200 text-md font-medium mb-2">
                Password

              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="••••••••"
                autoComplete="new-password"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 cursor-pointer rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-slate-300 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition"
              >
                Sign In
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>






  );
}

export default Register;















