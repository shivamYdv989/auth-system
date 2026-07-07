import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [loginMethod, setLoginMethod] = useState("email-password");
    const [formData, setFormData] = useState({
        email: "",
        mobile: "",
        password: "",
        otp: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showOTPField, setShowOTPField] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSendOTP = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            if (loginMethod === "email-otp") {
                const email = formData.email.toLowerCase().trim();
                await axios.post("https://auth-system-4dje.onrender.com/api/auth/send-email-otp", {
                    email,
                });
            } else if (loginMethod === "phone-otp") {
                const mobile = formData.mobile.trim();
                await axios.post("https://auth-system-4dje.onrender.com/api/auth/send-phone-otp", {
                    mobile,
                });
            }
            setMessage("OTP sent successfully");
            setShowOTPField(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            let endpoint = "";
            let payload = {};
            const ipAddress = "127.0.0.1";

            if (loginMethod === "email-password") {
                endpoint = "/login-email-password";
                payload = { email: formData.email.toLowerCase().trim(), password: formData.password, deviceName: "Web", ipAddress };
            } else if (loginMethod === "email-otp") {
                endpoint = "/login-email-otp";
                payload = { email: formData.email.toLowerCase().trim(), otp: formData.otp.toString().trim(), deviceName: "Web", ipAddress };

            } else if (loginMethod === "phone-otp") {
                endpoint = "/login-phone-otp";
                payload = { mobile: formData.mobile.trim(), otp: formData.otp.toString().trim(), deviceName: "Web", ipAddress };
            }

            const res = await axios.post(`https://auth-system-4dje.onrender.com/api/auth${endpoint}`, payload);
            setMessage(res.data.message);

            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setFormData({ email: "", mobile: "", password: "", otp: "" });

            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };


    return (

        <div className="min-h-screen  flex items-center justify-center px-4 py-10 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-72 h-72  rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"></div>

            <div className="w-full max-w-lg relative z-10">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                            <span className="text-3xl">🔐</span>
                        </div>

                        <h2 className="text-4xl font-bold text-white">
                            Welcome Back
                        </h2>

                        <p className="text-slate-300 text-sm mt-2">
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    {/* Login Method Tabs */}

                    <div className="grid grid-cols-3 gap-2 mb-6 bg-white/10 p-2 rounded-2xl border border-white/10 backdrop-blur-md">

                        <button
                            onClick={() => {
                                setLoginMethod("email-password");
                                setShowOTPField(false);
                                setFormData({ ...formData, otp: "" });
                            }}
                            className={`flex-1 py-3 px-3  cursor-pointer rounded-xl text-sm font-medium transition-all duration-300 ${loginMethod === "email-password"
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                    : "text-slate-300 hover:bg-white/10"
                                }`}
                        >
                            Email & Password
                        </button>

                        <button
                            onClick={() => {
                                setLoginMethod("email-otp");
                                setShowOTPField(false);
                                setFormData({ ...formData, otp: "" });
                            }}
                            className={`flex-1 py-3 px-3 rounded-xl  cursor-pointer text-sm font-medium transition-all duration-300 ${loginMethod === "email-otp"
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                    : "text-slate-300 hover:bg-white/10"
                                }`}
                        >
                            Email OTP
                        </button>

                        <button
                            onClick={() => {
                                setLoginMethod("phone-otp");
                                setShowOTPField(false);
                                setFormData({ ...formData, otp: "" });
                            }}
                            className={`flex-1 py-3 px-3 rounded-xl text-sm  cursor-pointer font-medium transition-all duration-300 ${loginMethod === "phone-otp"
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                    : "text-slate-300 hover:bg-white/10"
                                }`}
                        >
                            Phone OTP
                        </button>

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

                        {/* Email */}
                        {(loginMethod === "email-password" || loginMethod === "email-otp") && (
                            <div>
                                <label className="block text-slate-200 text-sm font-medium mb-2">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    placeholder="you@example.com"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                />
                            </div>
                        )}

                        {/* Mobile */}
                        {loginMethod === "phone-otp" && (
                            <div>
                                <label className="block text-slate-200 text-sm font-medium mb-2">
                                    Mobile Number
                                </label>

                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    placeholder="+91 9876543210"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                />
                            </div>
                        )}

                        {/* Password */}
                        {loginMethod === "email-password" && (
                            <div>
                                <label className="block text-slate-200 text-sm font-medium mb-2">
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
                                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                />
                            </div>
                        )}

                        {/* Send OTP */}
                        {(loginMethod === "email-otp" || loginMethod === "phone-otp") && !showOTPField && (
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="w-full py-3 rounded-2xl  cursor-pointer font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        )}

                        {/* OTP Field */}
                        {showOTPField &&
                            (loginMethod === "email-otp" || loginMethod === "phone-otp") && (
                                <div>
                                    <label className="block text-slate-200 text-sm font-medium mb-2">
                                        Enter OTP
                                    </label>

                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        placeholder="000000"
                                        autoComplete="off"
                                        onChange={handleChange}
                                        required
                                        maxLength="6"
                                        className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                    />
                                </div>
                            )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                (!showOTPField &&
                                    (loginMethod === "email-otp" ||
                                        loginMethod === "phone-otp"))
                            }
                            className="w-full py-3.5 rounded-2xl   cursor-pointer font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
                        <p className="text-center text-slate-300 text-sm">
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="text-indigo-400 hover:text-indigo-300 font-medium transition"
                            >
                                Sign Up
                            </a>
                        </p>

                        <p className="text-center text-slate-300 text-sm">
                            <a
                                href="/forgot-password"
                                className="text-indigo-400 hover:text-indigo-300 font-medium transition"
                            >
                                Forgot Password?
                            </a>
                        </p>
                    </div>

                </div>
            </div>
        </div>


    );
}

export default Login;