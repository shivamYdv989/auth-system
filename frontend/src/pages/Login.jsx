import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

import { FaArrowRight } from "react-icons/fa6";

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

    // <div className="min-h-screen  flex items-center justify-center px-4 py-10 relative overflow-hidden">

    //     {/* Background Effects */}
    //     <div className="absolute top-0 left-0 w-72 h-72  rounded-full blur-3xl"></div>
    //     <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"></div>

    //     <div className="w-full max-w-lg relative z-10">
    //         <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">

    //             {/* Header */}
    //             <div className="text-center mb-8">
    //                 <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
    //                     <span className="text-3xl">🔐</span>
    //                 </div>

    //                 <h2 className="text-4xl font-bold text-white">
    //                     Welcome Back
    //                 </h2>

    //                 <p className="text-slate-300 text-sm mt-2">
    //                     Sign in to continue to your dashboard
    //                 </p>
    //             </div>

    //             {/* Login Method Tabs */}

    //             <div className="grid grid-cols-3 gap-2 mb-6 bg-white/10 p-2 rounded-2xl border border-white/10 backdrop-blur-md">

    //                 <button
    //                     onClick={() => {
    //                         setLoginMethod("email-password");
    //                         setShowOTPField(false);
    //                         setFormData({ ...formData, otp: "" });
    //                     }}
    //                     className={`flex-1 py-3 px-3  cursor-pointer rounded-xl text-sm font-medium transition-all duration-300 ${loginMethod === "email-password"
    //                         ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
    //                         : "text-slate-300 hover:bg-white/10"
    //                         }`}
    //                 >
    //                     Email & Password
    //                 </button>

    //                 <button
    //                     onClick={() => {
    //                         setLoginMethod("email-otp");
    //                         setShowOTPField(false);
    //                         setFormData({ ...formData, otp: "" });
    //                     }}
    //                     className={`flex-1 py-3 px-3 rounded-xl  cursor-pointer text-sm font-medium transition-all duration-300 ${loginMethod === "email-otp"
    //                         ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
    //                         : "text-slate-300 hover:bg-white/10"
    //                         }`}
    //                 >
    //                     Email OTP
    //                 </button>

    //                 <button
    //                     onClick={() => {
    //                         setLoginMethod("phone-otp");
    //                         setShowOTPField(false);
    //                         setFormData({ ...formData, otp: "" });
    //                     }}
    //                     className={`flex-1 py-3 px-3 rounded-xl text-sm  cursor-pointer font-medium transition-all duration-300 ${loginMethod === "phone-otp"
    //                         ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
    //                         : "text-slate-300 hover:bg-white/10"
    //                         }`}
    //                 >
    //                     Phone OTP
    //                 </button>

    //             </div>

    //             {/* Success Message */}
    //             {message && (
    //                 <div className="mb-4 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md">
    //                     <p className="text-emerald-300 text-sm font-medium">
    //                         {message}
    //                     </p>
    //                 </div>
    //             )}

    //             {/* Error Message */}
    //             {error && (
    //                 <div className="mb-4 p-4 rounded-2xl bg-red-500/15 border border-red-400/30 backdrop-blur-md">
    //                     <p className="text-red-300 text-sm font-medium">
    //                         {error}
    //                     </p>
    //                 </div>
    //             )}

    //             {/* Form */}
    //             <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

    //                 {/* Email */}
    //                 {(loginMethod === "email-password" || loginMethod === "email-otp") && (
    //                     <div>
    //                         <label className="block text-slate-200 text-sm font-medium mb-2">
    //                             Email Address
    //                         </label>

    //                         <div className="relative">
    //                             <MdMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
    //                             <input
    //                                 type="email"
    //                                 name="email"
    //                                 value={formData.email}
    //                                 placeholder="you@example.com"
    //                                 autoComplete="off"
    //                                 onChange={handleChange}
    //                                 required
    //                                 className="w-full px-12 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
    //                             /></div>
    //                     </div>
    //                 )}

    //                 {/* Mobile */}
    //                 {loginMethod === "phone-otp" && (
    //                     <div>
    //                         <label className="block text-slate-200 text-sm font-medium mb-2">
    //                             Mobile Number
    //                         </label>

    //                         <input
    //                             type="tel"
    //                             name="mobile"
    //                             value={formData.mobile}
    //                             placeholder="+91 9876543210"
    //                             autoComplete="off"
    //                             onChange={handleChange}
    //                             required
    //                             className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
    //                         />
    //                     </div>
    //                 )}

    //                 {/* Password */}
    //                 {loginMethod === "email-password" && (
    //                     <div>
    //                         <label className="block text-slate-200 text-sm font-medium mb-2">
    //                             Password
    //                         </label>
    //                         <div className="relative">
    //                             <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />


    //                             <input
    //                                 type="password"
    //                                 name="password"
    //                                 value={formData.password}
    //                                 placeholder="••••••••"
    //                                 autoComplete="new-password"
    //                                 onChange={handleChange}
    //                                 required
    //                                 className="w-full px-12 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
    //                             /></div>
    //                     </div>
    //                 )}

    //                 {/* Send OTP */}
    //                 {(loginMethod === "email-otp" || loginMethod === "phone-otp") && !showOTPField && (
    //                     <button
    //                         type="button"
    //                         onClick={handleSendOTP}
    //                         disabled={loading}
    //                         className="w-full py-3 rounded-2xl  cursor-pointer font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
    //                     >
    //                         {loading ? "Sending..." : "Send OTP"}
    //                     </button>
    //                 )}

    //                 {/* OTP Field */}
    //                 {showOTPField &&
    //                     (loginMethod === "email-otp" || loginMethod === "phone-otp") && (
    //                         <div>
    //                             <label className="block text-slate-200 text-sm font-medium mb-2">
    //                                 Enter OTP
    //                             </label>

    //                             <input
    //                                 type="text"
    //                                 name="otp"
    //                                 value={formData.otp}
    //                                 placeholder="000000"
    //                                 autoComplete="off"
    //                                 onChange={handleChange}
    //                                 required
    //                                 maxLength="6"
    //                                 className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
    //                             />
    //                         </div>
    //                     )}

    //                 {/* Login Button */}
    //                 <button
    //                     type="submit"
    //                     disabled={
    //                         loading ||
    //                         (!showOTPField &&
    //                             (loginMethod === "email-otp" ||
    //                                 loginMethod === "phone-otp"))
    //                     }
    //                     className="w-full py-3.5 rounded-2xl   cursor-pointer font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    //                 >
    //                     {loading ? "Signing In..." : "Sign In"}
    //                 </button>
    //             </form>

    //             {/* Footer */}
    //             <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
    //                 <p className="text-center text-slate-300 text-sm">
    //                     Don't have an account?{" "}
    //                     <a
    //                         href="/register"
    //                         className="text-indigo-400 hover:text-indigo-300 font-medium transition"
    //                     >
    //                         Sign Up
    //                     </a>
    //                 </p>

    //                 <p className="text-center text-slate-300 text-sm">
    //                     <a
    //                         href="/forgot-password"
    //                         className="text-indigo-400 hover:text-indigo-300 font-medium transition"
    //                     >
    //                         Forgot Password?
    //                     </a>
    //                 </p>
    //             </div>
    //         </div>
    //     </div>
    // </div>





    // <div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center p-4">
    //   <div className="w-full max-w-6xl bg-white rounded-[30px] shadow-2xl overflow-hidden grid lg:grid-cols-[320px_1fr]">

    //     {/* Left Side */}
    //     <div className="bg-gradient-to-b from-violet-50 to-indigo-50 p-8 flex flex-col justify-between">

    //       <div>
    //         <div className="flex items-center gap-2 mb-16">
    //           <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white">
    //             🔐
    //           </div>
    //           <h2 className="text-xl font-bold text-gray-800">
    //             SecureAuth
    //           </h2>
    //         </div>

    //         <h1 className="text-4xl font-bold text-gray-900 mb-4">
    //           Welcome back 👋
    //         </h1>

    //         <p className="text-gray-500">
    //           Sign in to continue to your dashboard
    //         </p>

    //         <div className="mt-12 flex justify-center">
    //           <img
    //             src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
    //             alt="auth"
    //             className="w-56"
    //           />
    //         </div>
    //       </div>

    //       <div className="space-y-6 mt-10">

    //         <div>
    //           <h4 className="font-semibold text-gray-800">
    //             Secure & Encrypted
    //           </h4>
    //           <p className="text-sm text-gray-500">
    //             Your data is protected with end-to-end encryption
    //           </p>
    //         </div>

    //         <div>
    //           <h4 className="font-semibold text-gray-800">
    //             Fast & Reliable
    //           </h4>
    //           <p className="text-sm text-gray-500">
    //             Quick access to your account anytime
    //           </p>
    //         </div>

    //         <div>
    //           <h4 className="font-semibold text-gray-800">
    //             Multi-device Support
    //           </h4>
    //           <p className="text-sm text-gray-500">
    //             Access your account securely from any device
    //           </p>
    //         </div>

    //       </div>
    //     </div>

    //     {/* Right Side */}
    //     <div className="p-8 lg:p-12">

    //       {/* Login Tabs */}
    //       <div className="grid grid-cols-3 gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-200 mb-10">

    //         <button
    //           onClick={() => {
    //             setLoginMethod("email-password");
    //             setShowOTPField(false);
    //             setFormData({ ...formData, otp: "" });
    //           }}
    //           className={`py-4 rounded-xl text-sm font-semibold transition ${loginMethod === "email-password"
    //               ? "bg-white shadow-md text-violet-600"
    //               : "text-gray-500"
    //             }`}
    //         >
    //           Email & Password
    //         </button>

    //         <button
    //           onClick={() => {
    //             setLoginMethod("email-otp");
    //             setShowOTPField(false);
    //             setFormData({ ...formData, otp: "" });
    //           }}
    //           className={`py-4 rounded-xl text-sm font-semibold transition ${loginMethod === "email-otp"
    //               ? "bg-white shadow-md text-violet-600"
    //               : "text-gray-500"
    //             }`}
    //         >
    //           Email OTP
    //         </button>

    //         <button
    //           onClick={() => {
    //             setLoginMethod("phone-otp");
    //             setShowOTPField(false);
    //             setFormData({ ...formData, otp: "" });
    //           }}
    //           className={`py-4 rounded-xl text-sm font-semibold transition ${loginMethod === "phone-otp"
    //               ? "bg-white shadow-md text-violet-600"
    //               : "text-gray-500"
    //             }`}
    //         >
    //           Phone OTP
    //         </button>

    //       </div>

    //       {/* Email */}
    //       {(loginMethod === "email-password" ||
    //         loginMethod === "email-otp") && (
    //           <div className="mb-5">
    //             <label className="block mb-2 text-sm font-medium text-gray-700">
    //               Email Address
    //             </label>

    //             <div className="relative">
    //               <MdMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

    //               <input
    //                 type="email"
    //                 name="email"
    //                 value={formData.email}
    //                 onChange={handleChange}
    //                 placeholder="you@example.com"
    //                 className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition"
    //               />
    //             </div>
    //           </div>
    //         )}

    //       {/* Password */}
    //       {loginMethod === "email-password" && (
    //         <div className="mb-5">
    //           <label className="block mb-2 text-sm font-medium text-gray-700">
    //             Password
    //           </label>

    //           <div className="relative">
    //             <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

    //             <input
    //               type="password"
    //               name="password"
    //               value={formData.password}
    //               onChange={handleChange}
    //               placeholder="Enter your password"
    //               className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition"
    //             />
    //           </div>
    //         </div>
    //       )}

    //       {/* OTP */}
    //       {showOTPField && (
    //         <div className="mb-5">
    //           <label className="block mb-2 text-sm font-medium text-gray-700">
    //             Enter OTP
    //           </label>

    //           <input
    //             type="text"
    //             name="otp"
    //             value={formData.otp}
    //             onChange={handleChange}
    //             placeholder="000000"
    //             className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition"
    //           />
    //         </div>
    //       )}

    //       {/* OTP Button */}
    //       {(loginMethod === "email-otp" ||
    //         loginMethod === "phone-otp") &&
    //         !showOTPField && (
    //           <button
    //             type="button"
    //             onClick={handleSendOTP}
    //             className="w-full h-14 rounded-xl bg-green-600 text-white font-semibold mb-4"
    //           >
    //             Send OTP
    //           </button>
    //         )}

    //       {/* Remember */}
    //       <div className="flex justify-between items-center mb-6">
    //         <label className="flex items-center gap-2 text-sm text-gray-600">
    //           <input type="checkbox" />
    //           Remember me
    //         </label>

    //         <a
    //           href="/forgot-password"
    //           className="text-violet-600 font-medium text-sm"
    //         >
    //           Forgot password?
    //         </a>
    //       </div>

    //       {/* Login Button */}
    //       <button
    //         type="submit"
    //         onClick={handleSubmit}
    //         className="w-full h-14 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 transition"
    //       >
    //         Sign In
    //       </button>

    //       {/* Divider */}
    //       <div className="my-8 text-center text-gray-400 text-sm">
    //         OR CONTINUE WITH
    //       </div>

    //       {/* Social Login */}
    //       <div className="space-y-4">

    //         <button className="w-full h-14 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50">
    //           Continue with Google
    //         </button>

    //         <button className="w-full h-14 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50">
    //           Continue with GitHub
    //         </button>

    //       </div>

    //       <p className="text-center text-gray-600 mt-8">
    //         Don't have an account?
    //         <a
    //           href="/register"
    //           className="ml-2 text-violet-600 font-semibold"
    //         >
    //           Sign Up
    //         </a>
    //       </p>

    //     </div>
    //   </div>
    // </div>


  //   <div className="h-screen overflow-hidden bg-[#f5f7ff] flex items-center justify-center p-4">

  //     <div className="w-full max-w-6xl h-[92vh] bg-white rounded-[30px]  overflow-hidden grid lg:grid-cols-[320px_1fr]">

  //       {/* Left Side */}
  //       <div className="bg-gradient-to-b from-violet-50 to-indigo-50 p-6 flex flex-col justify-between">

  //         <div>
  //           <div className="flex items-center gap-2 mb-10">
  //             <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white">
  //               🔐
  //             </div>

  //             <h2 className="text-xl font-bold text-gray-800">
  //               SecureAuth
  //             </h2>
  //           </div>

  //           <h1 className="text-3xl font-bold text-gray-900 mb-3">
  //             Welcome back 👋
  //           </h1>

  //           <p className="text-gray-500 text-sm">
  //             Sign in to continue to your dashboard
  //           </p>

  //           <div className="mt-8 flex justify-center">
  //             <img
  //               src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
  //               alt="auth"
  //               className="w-44"
  //             />
  //           </div>
  //         </div>

  //         <div className="space-y-4 text-sm">

  //           <div>
  //             <h4 className="font-semibold text-gray-800">
  //               Secure & Encrypted
  //             </h4>

  //             <p className="text-gray-500">
  //               Your data is protected with end-to-end encryption
  //             </p>
  //           </div>

  //           <div>
  //             <h4 className="font-semibold text-gray-800">
  //               Fast & Reliable
  //             </h4>

  //             <p className="text-gray-500">
  //               Quick access to your account anytime
  //             </p>
  //           </div>

  //           <div>
  //             <h4 className="font-semibold text-gray-800">
  //               Multi-device Support
  //             </h4>

  //             <p className="text-gray-500">
  //               Access your account securely from any device
  //             </p>
  //           </div>

  //         </div>
  //       </div>

  //       {/* Right Side */}
  //       <div className="p-6 lg:p-8 flex flex-col justify-center">

  //         {/* Tabs */}
  //         <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 mb-6">

  //           <button
  //             onClick={() => {
  //               setLoginMethod("email-password");
  //               setShowOTPField(false);
  //               setFormData({ ...formData, otp: "" });
  //             }}
  //             className={`py-3 rounded-xl cursor-pointer text-sm font-semibold transition ${loginMethod === "email-password"
  //                 ? "bg-white shadow-md text-violet-600"
  //                 : "text-gray-500"
  //               }`}
  //           >
  //             Email & Password
  //           </button>

  //           <button
  //             onClick={() => {
  //               setLoginMethod("email-otp");
  //               setShowOTPField(false);
  //               setFormData({ ...formData, otp: "" });
  //             }}
  //             className={`py-3 rounded-xl text-sm  cursor-pointer font-semibold transition ${loginMethod === "email-otp"
  //                 ? "bg-white shadow-md text-violet-600"
  //                 : "text-gray-500"
  //               }`}
  //           >
  //             Email OTP
  //           </button>

  //           <button
  //             onClick={() => {
  //               setLoginMethod("phone-otp");
  //               setShowOTPField(false);
  //               setFormData({ ...formData, otp: "" });
  //             }}
  //             className={`py-3 rounded-xl text-sm  cursor-pointer font-semibold transition ${loginMethod === "phone-otp"
  //                 ? "bg-white shadow-md text-violet-600"
  //                 : "text-gray-500"
  //               }`}
  //           >
  //             Phone OTP
  //           </button>

  //         </div>

  //         {/* Form */}
  //         <form
  //           onSubmit={handleSubmit}
  //           className="space-y-4"
  //         >

  //           {(loginMethod === "email-password" ||
  //             loginMethod === "email-otp") && (
  //               <div>
  //                 <label className="block mb-2 text-sm font-medium text-gray-700">
  //                   Email Address
  //                 </label>

  //                 <div className="relative">
  //                   <MdMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

  //                   <input
  //                     type="email"
  //                     name="email"
  //                     value={formData.email}
  //                     onChange={handleChange}
  //                     placeholder="you@example.com"
  //                     className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
  //                   />
  //                 </div>
  //               </div>
  //             )}

  //           {loginMethod === "email-password" && (
  //             <div>
  //               <label className="block mb-2 text-sm font-medium text-gray-700">
  //                 Password
  //               </label>

  //               <div className="relative">
  //                 <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

  //                 <input
  //                   type="password"
  //                   name="password"
  //                   value={formData.password}
  //                   onChange={handleChange}
  //                   placeholder="Enter your password"
  //                   className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
  //                 />
  //               </div>
  //             </div>
  //           )}

  //           {showOTPField && (
  //             <div>
  //               <label className="block mb-2 text-sm font-medium text-gray-700">
  //                 Enter OTP
  //               </label>

  //               <input
  //                 type="text"
  //                 name="otp"
  //                 value={formData.otp}
  //                 onChange={handleChange}
  //                 placeholder="000000"
  //                 className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
  //               />
  //             </div>
  //           )}

  //           {(loginMethod === "email-otp" ||
  //             loginMethod === "phone-otp") &&
  //             !showOTPField && (
  //               <button
  //                 type="button"
  //                 onClick={handleSendOTP}
  //                 className="w-full h-12 rounded-xl cursor-pointer bg-green-600 text-white font-semibold"
  //               >
  //                 Send OTP
  //               </button>
  //             )}

  //           <div className="flex justify-between items-center text-sm">
  //             <label className="flex items-center gap-2 text-gray-600">
  //               <input type="checkbox" />
  //               Remember me
  //             </label>

  //             <a
  //               href="/forgot-password"
  //               className="text-violet-600"
  //             >
  //               Forgot password?
  //             </a>
  //           </div>

  //           <button
  //             type="submit"
  //             className="w-full h-12  cursor-pointer rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-pink-500"
  //           >
  //             Sign In
  //           </button>

  //         </form>

  //         <div className="flex items-center w-full my-6">
  //           <div className="flex-1 h-px bg-gray-300"></div>

  //           <h6 className="
  //   px-3
  //   text-gray-500
  //   font-semibold
  //   text-xs
  //   sm:text-sm
  //   md:text-base
  //   lg:text-lg
  //   whitespace-nowrap
  // ">
  //             OR
  //           </h6>

  //           <div className="flex-1 h-px bg-gray-300"></div>
  //         </div>

  //         <div className="space-y-3">

  //           <button onClick={() => window.open("https://google.com", "_blank")}
  //             className="w-full h-12 border cursor-pointer rounded-xl hover:bg-gray-50">
  //             Continue with Google
  //           </button>

  //           <button onClick={() => window.open("https://github.com", "_blank")}
  //             className="w-full h-12 border cursor-pointer rounded-xl hover:bg-gray-50">


  //             Continue with GitHub
  //           </button>

  //         </div>

  //         <p className="text-center text-sm text-gray-600 mt-5">
  //           Don't have an account?
  //           <a
  //             href="/register"
  //             className="ml-2 text-violet-600 font-semibold"
  //           >
  //             Sign Up
  //           </a>
  //         </p>

  //       </div>

  //     </div>
  //   </div>

      <div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center p-2 sm:p-4 md:p-5">

  <div
    className="
      w-full
      max-w-sm
      sm:max-w-3xl
      lg:max-w-6xl
      h-auto
      lg:h-[88vh]
      bg-white
      rounded-2xl
      lg:rounded-[30px]
      shadow-xl
      overflow-hidden
      grid
      grid-cols-1
      lg:grid-cols-[280px_1fr]
    "
  >

    {/* Left Side */}
    <div className="bg-gradient-to-b from-violet-50 to-indigo-50 p-5 lg:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">

      <div>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white">
            🔐
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            SecureAuth
          </h2>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Welcome back 👋
        </h1>

        <p className="text-gray-500 text-sm sm:text-base">
          Sign in to continue to your dashboard
        </p>

        <div className="mt-0.5 mb-0.5 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
            alt="auth"
            className="w-32 sm:w-40 lg:w-35"
          />
        </div>
      </div>

      <div className="space-y-4 text-sm hidden sm:block">

        <div>
          <h4 className=" text-xl font-semibold text-gray-800">
            Secure & Encrypted
          </h4>

          <p className="text-gray-500">
            Your data is protected with end-to-end encryption
          </p>
        </div>

        <div>
          <h4 className=" text-xl font-semibold text-gray-800">
            Fast & Reliable
          </h4>

          <p className="text-gray-500">
            Quick access to your account anytime
          </p>
        </div>

        <div>
          <h4 className=" text-xl font-semibold text-gray-800">
            Multi-Device Support
          </h4>

          <p className="text-gray-500">
            Access your account securely from any device
          </p>
        </div>

      </div>
    </div>

    {/* Right Side */}
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center">

      {/* Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 mb-6">

        <button
          onClick={() => {
            setLoginMethod("email-password");
            setShowOTPField(false);
            setFormData({ ...formData, otp: "" });
          }}
          className={`py-3 rounded-xl cursor-pointer text-sm font-semibold transition ${
            loginMethod === "email-password"
              ? "bg-white shadow-md text-violet-600"
              : "text-gray-500"
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
          className={`py-3 rounded-xl cursor-pointer text-sm font-semibold transition ${
            loginMethod === "email-otp"
              ? "bg-white shadow-md text-violet-600"
              : "text-gray-500"
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
          className={`py-3 rounded-xl cursor-pointer text-sm font-semibold transition ${
            loginMethod === "phone-otp"
              ? "bg-white shadow-md text-violet-600"
              : "text-gray-500"
          }`}
        >
          Phone OTP
        </button>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {(loginMethod === "email-password" ||
          loginMethod === "email-otp") && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div className="relative">
              <MdMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full h-11 sm:h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
              />
            </div>
          </div>
        )}

        {loginMethod === "email-password" && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full h-11 sm:h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
              />
            </div>
          </div>
        )}

        {showOTPField && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Enter OTP
            </label>

            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="000000"
              className="w-full h-11 sm:h-12 px-4 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
            />
          </div>
        )}

        {(loginMethod === "email-otp" ||

          loginMethod === "phone-otp") &&
          !showOTPField && (
            <button
              type="button"
              onClick={handleSendOTP}
              className="w-full h-11 sm:h-12 rounded-xl cursor-pointer bg-green-600 text-white font-semibold"
            >
              Send OTP
            </button>
          )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm">

          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" />
            Remember me
          </label>

          <a
            href="/forgot-password"
            className="text-violet-600"
          >
            Forgot password?
          </a>

        </div>

        <button
          type="submit"
          className="w-full h-11 sm:h-12 cursor-pointer rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-pink-500"
        >
          Sign In
                

        </button>

      </form>

      {/* OR */}
      <div className="flex items-center w-full my-6">
        <div className="flex-1 h-px bg-gray-300"></div>

        <h6 className="px-3 text-gray-500 font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
          OR
        </h6>

        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <button
          onClick={() => window.open("https://google.com", "_blank")}
          className="h-11 sm:h-12 border cursor-pointer rounded-xl hover:bg-gray-50 transition"
        >
          Continue with Google
        </button>

        <button
          onClick={() => window.open("https://github.com", "_blank")}
          className="h-11 sm:h-12 border cursor-pointer rounded-xl hover:bg-gray-50 transition"
        >
          Continue with GitHub
        </button>

      </div>

      <p className="text-center text-lg text-gray-600 mt-5 p-4">
        Don't have an account?
        <a
          href="/register"
          className="ml-4 text-lg  text-violet-600 font-semibold"
        >
          Sign Up
          
        </a>
      </p>

     </div>

  </div>

       </div>

  );


}

export default Login;