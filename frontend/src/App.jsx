// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import ForgotPassword from "./pages/ForgotPassword";
// import Dashboard from "./pages/Dashboard";
// import OTPVerification from "./pages/OTPVerification";

// function App() {
//   const isAuthenticated = !!localStorage.getItem("accessToken");

//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/verify-otp" element={<OTPVerification />} />

//         {/* Protected Routes */}
//         <Route
//           path="/dashboard"
//           element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
//         />

//         {/* Default Route */}
//       <Route path="/" element={<Register />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;




import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import OTPVerification from "./pages/OTPVerification";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Invalid Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;