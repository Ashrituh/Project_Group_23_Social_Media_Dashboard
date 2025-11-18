import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Integrations from "./pages/Integrations";
import Feed from "./pages/Feed";
import ProtectedRoute from "./ProtectedRoute";
import Sidebar from "./components/sidebar";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED ROUTES */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Sidebar />
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/integrations"
        element={
          <ProtectedRoute>
            <Sidebar />
            <Integrations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Sidebar />
            <Feed />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
