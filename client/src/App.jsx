import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import DeviceCheck from "./pages/DeviceCheck";
import LiveInterview from "./pages/LiveInterview";
import Result from "./pages/Result";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Interview Setup */}
        <Route
          path="/interview/:id"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />

        {/* Device Check */}
        <Route
          path="/device-check/:id"
          element={
            <ProtectedRoute>
              <DeviceCheck />
            </ProtectedRoute>
          }
        />

        {/* Live Interview */}
        <Route
          path="/live-interview/:id"
          element={
            <ProtectedRoute>
              <LiveInterview />
            </ProtectedRoute>
          }
        />

        {/* Interview Result */}
        <Route
          path="/result/:id"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;