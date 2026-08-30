import { Routes, Route } from "react-router-dom";

import Home from "./pages/auth/Home";
import RetailerRegister from "./pages/retailer/RetailerRegister";
import RetailerLogin from "./pages/retailer/RetailerLogin";
import RetailerDashboard from "./pages/retailer/RetailerDashboard";

import DispatcherLogin from "./pages/dispatcher/DispatcherLogin";
import DispatcherDashboard from "./pages/dispatcher/DispatcherDashboard";

import RiderLogin from "./pages/rider/RiderLogin";
import RiderDashboard from "./pages/rider/RiderDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Retailer */}
      <Route
        path="/retailer/register"
        element={<RetailerRegister />}
      />

      <Route
        path="/retailer/login"
        element={<RetailerLogin />}
      />

      <Route
        path="/retailer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["retailer"]}>
            <RetailerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Dispatcher */}
      <Route
        path="/dispatcher/login"
        element={<DispatcherLogin />}
      />

      <Route
        path="/dispatcher/dashboard"
        element={
          <ProtectedRoute allowedRoles={["dispatcher"]}>
            <DispatcherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Rider */}
      <Route
        path="/rider/login"
        element={<RiderLogin />}
      />

      <Route
        path="/rider/dashboard"
        element={
          <ProtectedRoute allowedRoles={["rider"]}>
            <RiderDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default App;