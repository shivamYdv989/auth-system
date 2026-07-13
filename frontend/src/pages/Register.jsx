import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaPhoneAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

function Register() {
  //const navigate = useNavigate();
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
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);

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
        "https://auth-system-4dje.onrender.com/api/auth/register",
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
  // const sendEmailOTP = () => {
  //   if (!formData.email) {
  //     setError("Enter your email before sending OTP");
  //     return;
  //   }

  //   localStorage.setItem("registerFormData", JSON.stringify(formData));
  //   navigate("/verify-otp", {
  //     state: {
  //       verificationStep: "email",
  //       email: formData.email,
  //       returnTo: "/register",
  //       context: "register",
  //     },
  //   });
  // };


  const sendEmailOTP = async () => {
    if (!formData.email) {
      setError("Enter email first");
      return;
    }

    try {
      const res = await axios.post(
        "https://auth-system-4dje.onrender.com/api/auth/send-email-otp",
        {
          email: formData.email,
        }
      );

      setMessage(res.data.message);
      setShowEmailOtp(true);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };



  // opt fuction for phone no
  // const sendPhoneOTP = () => {
  //   if (!formData.mobile) {
  //     setError("Enter your mobile number before sending OTP");
  //     return;
  //   }

  //   localStorage.setItem("registerFormData", JSON.stringify(formData));
  //   navigate("/verify-otp", {
  //     state: {
  //       verificationStep: "phone",
  //       mobile: formData.mobile,
  //       returnTo: "/register",
  //       context: "register",
  //     },
  //   });
  // };


  const sendPhoneOTP = async () => {
    if (!formData.mobile) {
      setError("Enter mobile first");
      return;
    }

    try {
      const res = await axios.post(
        "https://auth-system-4dje.onrender.com/api/auth/send-phone-otp",
        {
          mobile: formData.mobile,
        }
      );

      setMessage(res.data.message);
      setShowPhoneOtp(true);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyEmailOTP = async () => {
    try {
      const res = await axios.post(
        "https://auth-system-4dje.onrender.com/api/auth/verify-email-otp",
        {
          email: formData.email,
          otp: emailOtp,
        }
      );

      setMessage(res.data.message);
      setEmailVerified(true);

      setShowEmailOtp(false);
      setEmailOtp("");

    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  const verifyPhoneOTP = async () => {
    try {
      const res = await axios.post(
        "https://auth-system-4dje.onrender.com/api/auth/verify-phone-otp",
        {
          mobile: formData.mobile,
          otp: phoneOtp,
        }
      );

      setMessage(res.data.message);
      setMobileVerified(true);

      setShowPhoneOtp(false);
      setPhoneOtp("");

    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };


  return (
    //   <div className="h-screen overflow-hidden bg-[#f7f8ff] flex items-center justify-center p-3">

    //   <div className="w-full max-w-7xl   h-[95vh] bg-white rounded-[28px] overflow-hidden grid lg:grid-cols-[300px_1fr]">

    //     {/* LEFT PANEL */}
    //     <div className="bg-gradient-to-b  from-[#fafaff] to-[#f3f2ff] p-6 border-r border-slate-100 flex flex-col justify-between">

    //       <div>
    //         <div className="flex items-center gap-3 mb-8">
    //           <div className="w-10 h-10 rounded-xl  bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
    //             S
    //           </div>

    //           <h2 className="font-bold text-xl text-slate-900">
    //             SecureAuth
    //           </h2>
    //         </div>

    //         <h1 className="text-3xl font-bold text-slate-900 mb-2">
    //           Create your account 🚀
    //         </h1>

    //         <p className="text-slate-500 text-sm mb-6">
    //           Join us and start your secure journey today
    //         </p>

    //         <div className="h-30 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
    //           <span className="text-6xl text-white">👤</span>
    //         </div>
    //       </div>

    //       <div className="space-y-4 text-sm">
    //         <div>
    //           <h3 className="font-semibold text-slate-800">
    //             Email & Phone Verification
    //           </h3>
    //           <p className="text-slate-500">
    //             Secure OTP verification
    //           </p>
    //         </div>

    //         <div>
    //           <h3 className="font-semibold text-slate-800">
    //             Strong Security
    //           </h3>
    //           <p className="text-slate-500">
    //             Advanced protection
    //           </p>
    //         </div>

    //         <div>
    //           <h3 className="font-semibold text-slate-800">
    //             Privacy Focused
    //           </h3>
    //           <p className="text-slate-500">
    //             Your privacy matters
    //           </p>
    //         </div>
    //       </div>
    //     </div>

    //     {/* RIGHT FORM */}
    //     <div className="p-6 lg:p-8 flex items-center justify-center">

    //       <div className="w-full max-w-2xl">

    //         {/* Success / Error Message */}

    //         {message && (
    //           <div className="mb-3 rounded-xl border border-green-200 bg-green-50 p-3 text-green-700 text-sm">
    //             {message}
    //           </div>
    //         )}

    //         {error && (
    //           <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
    //             {error}
    //           </div>
    //         )}

    //         <form
    //           onSubmit={handleSubmit}
    //           autoComplete="off"
    //           className="space-y-4"
    //         >

    //           {/* Name */}
    //           <div>
    //             <label className="block mb-1 text-sm font-semibold text-slate-800">
    //               Full Name
    //             </label>

    //             <div className="relative">
    //               <FaRegUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

    //               <input
    //                 type="text"
    //                 name="name"
    //                 value={formData.name}
    //                 onChange={handleChange}
    //                 placeholder="Enter your full name"
    //                 className="w-full h-12 pl-12 rounded-xl border border-slate-200"
    //               />
    //             </div>
    //           </div>

    //           {/* Email */}
    //           <div>
    //             <label className="block mb-1 text-sm font-semibold text-slate-800">
    //               Email Address
    //             </label>

    //             <div className="flex gap-2">
    //               <div className="relative flex-1">
    //                 <MdMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

    //                 <input
    //                   type="email"
    //                   name="email"
    //                   value={formData.email}
    //                   onChange={handleChange}
    //                   placeholder="you@example.com"
    //                   className="w-full h-12 pl-12 rounded-xl border border-slate-200"
    //                 />
    //               </div>

    //               <button
    //                 type="button"
    //                 onClick={sendEmailOTP}
    //                 className="h-12 px-4 rounded-xl border cursor-pointer border-indigo-300 text-indigo-600 text-sm"
    //               >
    //                 {emailVerified ? "Verified" : "Send OTP"}
    //               </button>

    // {showEmailOtp && !emailVerified && (
    //   <div className="flex gap-2 mt-2">
    //     <input
    //       type="text"
    //       value={emailOtp}
    //       onChange={(e) => setEmailOtp(e.target.value)}
    //       placeholder="Enter Email OTP"
    //       className="flex-1 h-12 px-4 rounded-xl border border-slate-200"
    //     />

    //     <button
    //       type="button"
    //       onClick={verifyEmailOTP}
    //       className="px-4 bg-green-600 cursor-pointer  text-white rounded-xl"
    //     >
    //       Verify
    //     </button>
    //   </div>
    // )}


    //             </div>
    //           </div>

    //           {/* Mobile */}
    //           <div>
    //             <label className="block mb-1 text-sm font-semibold text-slate-800">
    //               Mobile Number
    //             </label>

    //             <div className="flex gap-2">
    //               <div className="relative flex-1">
    //                 <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />

    //                 <input
    //                   type="tel"
    //                   name="mobile"
    //                   value={formData.mobile}
    //                   onChange={handleChange}
    //                   placeholder="+91 9876543210"
    //                   className="w-full h-12 pl-12 rounded-xl border border-slate-200"
    //                 />
    //               </div>

    //               <button
    //                 type="button"
    //                 onClick={sendPhoneOTP}
    //                 className="h-12 px-4 rounded-xl border border-indigo-300 text-indigo-600 text-sm"
    //               >
    //                 {mobileVerified ? "Verified" : "Send OTP"}
    //               </button>


    // {showPhoneOtp && !mobileVerified && (
    //   <div className="flex gap-2 mt-2">
    //     <input
    //       type="text"
    //       value={phoneOtp}
    //       onChange={(e) => setPhoneOtp(e.target.value)}
    //       placeholder="Enter Phone OTP"
    //       className="flex-1 h-12 px-4 rounded-xl border cursor-pointer border-slate-200"
    //     />

    //     <button
    //       type="button"
    //       onClick={verifyPhoneOTP}
    //       className="px-4 bg-green-600 cursor-pointer text-white rounded-xl"
    //     >
    //       Verify
    //     </button>
    //   </div>
    // )}


    //             </div>
    //           </div>

    //           {/* Password */}
    //           <div>
    //             <label className="block mb-1 text-sm font-semibold text-slate-800">
    //               Password
    //             </label>

    //             <div className="relative">
    //               <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

    //               <input
    //                 type="password"
    //                 name="password"
    //                 value={formData.password}
    //                 onChange={handleChange}
    //                 placeholder="Create a strong password"
    //                 className="w-full h-12 pl-12 rounded-xl border border-slate-200"
    //               />
    //             </div>
    //           </div>

    //           {/* Terms */}
    //           <div className="flex items-center gap-2 text-sm">
    //             <input type="checkbox" />

    //             <span className="text-slate-600">
    //               I agree to Terms & Privacy Policy
    //             </span>
    //           </div>

    //           {/* Submit */}
    //           <button
    //             type="submit"
    //            // disabled={loading}

    //            disabled={
    //   loading ||
    //   !emailVerified ||
    //   !mobileVerified
    // }
    //             className="w-full h-12 rounded-xl font-semibold cursor-pointer text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
    //           >
    //             {loading ? "Creating..." : "Create Account"}
    //           </button>


    // <div className="flex items-center w-full my-6">
    //   <div className="flex-1 h-px bg-gray-300"></div>

    //   <h6 className="
    //     px-3
    //     text-gray-500
    //     font-semibold
    //     text-xs
    //     sm:text-sm
    //     md:text-base
    //     lg:text-lg
    //     whitespace-nowrap
    //   ">
    //     OR
    //   </h6>

    //   <div className="flex-1 h-px bg-gray-300"></div>
    // </div>
    //           {/* Social */}
    //           <div className="grid grid-cols-2 gap-3">
    //             <button
    //               onClick={() => window.open("https://google.com", "")}

    //               type="button"
    //               className="h-11 rounded-xl border-2 text-lg  shadow-2xl cursor-pointer border-slate-200 hover:bg-blue-700"
    //             >
    //               Google
    //             </button>

    //             <button
    //   onClick={() => window.open("https://github.com", "_blank")}


    //               type="button"
    //               className="h-11 rounded-xl border-2 shadow-2xl cursor-pointer hover:bg-blue-700 border-slate-200"
    //             >
    //               GitHub
    //             </button>
    //           </div>

    //           <div className="text-center text-sm pt-2 p-1">
    //             <span className="text-slate-500 text-lg">
    //               Already have an account?
    //             </span>

    //             <a
    //               href="/login"
    //               className="ml-2 text-indigo-600 text-lg cursor-pointer font-semibold"
    //             >
    //               Sign In
    //             </a>
    //           </div>

    //         </form>

    //       </div>
    //     </div>

    //   </div>
    //     </div>

    <div className="min-h-screen bg-[#f7f8ff] flex items-center justify-center p-2 sm:p-4 md:p-5">
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
      lg:rounded-[28px]
      overflow-hidden
      shadow-xl
      grid
      grid-cols-1
      lg:grid-cols-[260px_1fr]
    "
      >
        {/* LEFT PANEL */}
        <div className="bg-gradient-to-b from-[#fafaff] to-[#f3f2ff]
     p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                S
              </div>

              <h2 className="font-bold text-xl text-slate-900">
                SecureAuth
              </h2>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Create your account 🚀
            </h1>

            <p className="text-slate-500 text-sm sm:text-base mb-6">
              Join us and start your secure journey today
            </p>

            <div className="h-28 sm:h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
              <span className="text-5xl sm:text-6xl text-white">👤</span>
            </div>
          </div>

          <div className="space-y-4 text-sm hidden sm:block">
            <div>
              <h3 className="font-semibold text-slate-800">
                Email & Phone Verification
              </h3>
              <p className="text-slate-500">
                Secure OTP verification
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">
                Strong Security
              </h3>
              <p className="text-slate-500">
                Advanced protection
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">
                Privacy Focused
              </h3>
              <p className="text-slate-500">
                Your privacy matters
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="w-full mb-12 max-w-xl">

            {message && (
              <div className="mb-3 rounded-xl border border-green-200 bg-green-50 p-3 text-green-700 text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-3  rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-4"
            >

              {/* Name */}
              <div>
                <label className="block mb-1 text-md font-semibold text-slate-800">
                  Full Name
                </label>

                <div className="relative">
                  <FaRegUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full h-11 sm:h-12 pl-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-md font-semibold text-slate-800">
                  Email Address
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <MdMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full h-11 sm:h-12 pl-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={sendEmailOTP}
                    className="h-11 sm:h-12 px-4 rounded-xl border border-indigo-300 text-indigo-600 text-sm cursor-pointer hover:bg-indigo-50"
                  >
                    {emailVerified ? "Verified" : "Send OTP"}
                  </button>
                </div>

                {showEmailOtp && !emailVerified && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <input
                      type="text"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="Enter Email OTP"
                      className="flex-1 h-11 sm:h-12 px-4 rounded-xl border border-slate-200"
                    />

                    <button
                      type="button"
                      onClick={verifyEmailOTP}
                      className="h-11 sm:h-12 px-4 bg-green-600 text-white rounded-xl cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block mb-1 text-md font-semibold text-slate-800">
                  Mobile Number
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />

                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full h-11 sm:h-12 pl-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={sendPhoneOTP}
                    className="h-11 sm:h-12 px-4 rounded-xl border border-indigo-300 text-indigo-600 text-sm cursor-pointer hover:bg-indigo-50"
                  >
                    {mobileVerified ? "Verified" : "Send OTP"}
                  </button>
                </div>

                {showPhoneOtp && !mobileVerified && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <input
                      type="text"
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      placeholder="Enter Phone OTP"
                      className="flex-1 h-11 sm:h-12 px-4 rounded-xl border border-slate-200"
                    />

                    <button
                      type="button"
                      onClick={verifyPhoneOTP}
                      className="h-11 sm:h-12 px-4 sm:px-6 min-w-[90px] bg-green-600 hover:bg-green-700 text-white rounded-xl cursor-pointer transition-all duration-300"                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 text-md font-semibold text-slate-800">
                  Password
                </label>

                <div className="relative">
                  <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full h-11 sm:h-12 pl-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center gap-2 text-md">
                <input type="checkbox" />
                <span className="text-slate-600">
                  I agree to
                  <a href="/" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-1 mr-1">
                    Terms

                  </a>
                  &  <a
                    href="/"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </span>
              </div>

              {/* Submit */}
              {/* <button
            type="submit"
            disabled={
              loading ||
              !emailVerified ||
              !mobileVerified
            }
            className="w-full h-11 sm:h-12 rounded-xl font-semibold cursor-pointer text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
          >
            {loading ? "Creating..." : "Create Account"}

          </button> */}


              <button
                type="submit"
                disabled={
                  loading ||
                  !emailVerified ||
                  !mobileVerified
                }
                className="w-full h-11 sm:h-12 rounded-xl font-semibold cursor-pointer text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    Create Account
                    <FaArrowRight className="text-md top-" />
                  </>
                )}
              </button>

              {/* OR */}
              <div className="flex items-center w-full my-6">
                <div className="flex-1 h-px bg-gray-300"></div>

                <h6 className="px-3 text-gray-500 font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
                  OR
                </h6>

                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => window.open("https://google.com", "_blank")}
                  type="button"
                  className="h-11 rounded-xl border-2 shadow-lg cursor-pointer border-slate-200 hover:bg-blue-700 hover:text-white transition-all"
                >
                  Google
                </button>

                <button
                  onClick={() => window.open("https://github.com", "_blank")}
                  type="button"
                  className="h-11 rounded-xl border-2 shadow-lg cursor-pointer border-slate-200 hover:bg-slate-900 hover:text-white transition-all"
                >
                  GitHub
                </button>
              </div>

              {/* Login */}
              <div className="text-center text-lg pt-2">
                <span className="text-slate-500">
                  Already have an account?
                </span>

                <a
                  href="/login"
                  className="ml-3 text-lg text-indigo-600 font-semibold"
                >
                  Sign In
                </a>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>


  );
}

export default Register;















