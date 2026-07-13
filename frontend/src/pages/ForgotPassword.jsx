import { useState } from "react";
import axios from "axios";
import { MdMailOutline } from "react-icons/md";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Request, 2: Reset
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post("https://auth-system-4dje.onrender.com/api/auth/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post("https://auth-system-4dje.onrender.com/api/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => window.location.href = "/login", 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen  flex items-center justify-center px-4 py-12">
    //   <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
    //     <div className="text-center mb-8">
    //       <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
    //       <p className="text-gray-600 text-sm mt-2">
    //         {step === 1 ? "Enter your email to receive reset link" : "Enter your new password"}
    //       </p>
    //     </div>

    //     {message && (
    //       <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
    //         <p className="text-green-700 text-sm font-medium">{message}</p>
    //       </div>
    //     )}

    //     {error && (
    //       <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
    //         <p className="text-red-700 text-sm font-medium">{error}</p>
    //       </div>
    //     )}

    //     {step === 1 ? (
    //       <form onSubmit={handleRequestReset} className="space-y-4">
    //         <div>
    //           <label className="block text-gray-700 text-sm font-medium mb-1">
    //             Email Address
    //           </label>

    //           <div className="relative">

    //               <MdMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />


    //           <input
    //             type="email"
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //             placeholder="you@example.com"
    //             required
    //             className="w-full px-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
    //           />

    //           </div>
    //         </div>
    //         <button
    //           type="submit"
    //           disabled={loading}
    //           className="w-full  cursor-pointer bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
    //         >
    //           {loading ? "Sending..." : "Send Reset Link"}
    //         </button>
    //       </form>
    //     ) : (
    //       <form onSubmit={handleResetPassword} className="space-y-4">
    //         <div>
    //           <label className="block text-gray-700 text-sm font-medium mb-1">
    //             Reset Token
    //           </label>
    //           <input
    //             type="text"
    //             value={token}
    //             onChange={(e) => setToken(e.target.value)}
    //             placeholder="Paste your reset token"
    //             required
    //             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
    //           />
    //         </div>
    //         <div>
    //           <label className="block text-gray-700 text-sm font-medium mb-1">
    //             New Password
    //           </label>
    //           <input
    //             type="password"
    //             value={newPassword}
    //             onChange={(e) => setNewPassword(e.target.value)}
    //             placeholder="••••••••"
    //             required
    //             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
    //           />
    //         </div>
    //         <div>
    //           <label className="block text-gray-700 text-sm font-medium mb-1">
    //             Confirm Password
    //           </label>
    //           <input
    //             type="password"
    //             value={confirmPassword}
    //             onChange={(e) => setConfirmPassword(e.target.value)}
    //             placeholder="••••••••"
    //             required
    //             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
    //           />
    //         </div>
    //         <button
    //           type="submit"
    //           disabled={loading}
    //           className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
    //         >
    //           {loading ? "Resetting..." : "Reset Password"}
    //         </button>
    //       </form>
    //     )}

    //     <p className="text-center text-gray-600 text-sm mt-6">
    //       <a href="/login" className="text-indigo-600 font-medium hover:underline">
    //         Back to login
    //       </a>
    //     </p>
    //   </div>
    // </div>


<div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center p-4">

  <div className="w-full max-w-5xl bg-white rounded-[30px] shadow-2xl overflow-hidden grid lg:grid-cols-[40%_60%]">

    {/* LEFT SIDE */}
    <div className="bg-gradient-to-b from-violet-600 to-indigo-700 p-8 lg:p-10 text-white flex flex-col justify-center">

      <div className="mb-8">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
          🔒
        </div>
      </div>

      <h2 className="text-4xl font-bold mb-4">
        Reset Password
      </h2>

      <p className="text-white/80 text-lg leading-8">
        Securely reset your account password and regain access to your dashboard.
      </p>

      <img
        src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png"
        alt="reset"
        className="w-64 mt-10 mx-auto"
      />

    </div>

    {/* RIGHT SIDE */}
    <div className="p-6 sm:p-10 flex items-center justify-center">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <h2 className="text-2xl font-bold text-slate-800">
            Forgot Password?
          </h2>

          <p className="text-slate-500 mt-2">
            {step === 1
              ? "Enter your email to receive reset instructions"
              : "Create a new secure password"}
          </p>

        </div>

        {message && (
          <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200">
            <p className="text-green-700 text-sm font-medium">
              {message}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-red-700 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestReset} className="space-y-5">

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative">

                <MdMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
                />

              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Reset Token
              </label>

              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your reset token"
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

          </form>
        )}

        <div className="text-center mt-6">

          <a
            href="/login"
            className="text-violet-600 font-semibold hover:underline"
          >
            ← Back to Login
          </a>

        </div>

      </div>

    </div>

  </div>

</div>


  );
}

export default ForgotPassword;
