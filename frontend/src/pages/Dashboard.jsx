import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [accessToken]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${accessToken}` };

      const [profileRes, historyRes, sessionsRes] = await Promise.all([
        axios.get("https://auth-system-3gpb.vercel.app/api/auth/profile", { headers }),
        axios.get("https://auth-system-3gpb.vercel.app/api/auth/login-history", { headers }),
        axios.get("https://auth-system-3gpb.vercel.app/api/auth/sessions", { headers }),
      ]);

      setUser(profileRes.data.user);
      setLoginHistory(historyRes.data.loginHistory || []);
      setSessions(sessionsRes.data.sessions || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user data");
      if (err.response?.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const headers = { Authorization: `Bearer ${accessToken}` };

      await axios.post(
        "https://auth-system-3gpb.vercel.app/api/auth/logout",
        { refreshToken },
        { headers }
      );

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      setError("Failed to logout");
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      await axios.post("https://auth-system-3gpb.vercel.app/api/auth/logout-all-devices", {}, { headers });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      setError("Failed to logout from all devices");
    }
  };

  const handleRemoveSession = async (sessionId) => {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      await axios.post(
        "https://auth-system-3gpb.vercel.app/api/auth/remove-session",
        { sessionId },
        { headers }
      );
      fetchUserData();
    } catch (err) {
      setError("Failed to remove session");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome, {user?.name}</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleLogout}
                className="block w-full  cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Logout
              </button>
              <button
                onClick={handleLogoutAllDevices}
                className="block w-full  cursor-pointer bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
              >
                Logout All Devices
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-2">
          {["profile", "history", "sessions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4   cursor-pointer rounded-lg font-medium transition ${activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-gray-800 font-semibold">{user?.name}</p>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-gray-800 font-semibold">{user?.email}</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${user?.isEmailVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                  {user?.isEmailVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-600 text-sm">Mobile</p>
                <p className="text-gray-800 font-semibold">{user?.mobile}</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${user?.isMobileVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                  {user?.isMobileVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Member Since</p>
                <p className="text-gray-800 font-semibold">{new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Login History Tab */}

        {activeTab === "history" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Login History</h2>
            {loginHistory.length === 0 ? (
              <p className="text-gray-600">No login history available</p>
            ) : (
              <div className="space-y-4">
                {loginHistory.map((login, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{login.loginMethod.replace("-", " ").toUpperCase()}</p>
                        <p className="text-sm text-gray-600 mt-1">IP: {login.ipAddress}</p>
                        <p className="text-sm text-gray-600">Device: {login.deviceInfo}</p>
                      </div>
                      <p className="text-sm text-gray-600">{new Date(login.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === "sessions" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Sessions</h2>
            {sessions.length === 0 ? (
              <p className="text-gray-600">No active sessions</p>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session._id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{session.deviceName}</p>
                        <p className="text-sm text-gray-600 mt-1">Type: {session.deviceType}</p>
                        <p className="text-sm text-gray-600">IP: {session.ipAddress}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Last Active</p>
                        <p className="text-sm font-semibold">{new Date(session.lastActive).toLocaleString()}</p>
                        <button
                          onClick={() => handleRemoveSession(session._id)}
                          className="mt-2 text-sm  cursor-pointer bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
