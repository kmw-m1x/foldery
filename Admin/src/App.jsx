import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserLayout from "./Layouts/UserLayout";
import AdminLayout from "./Layouts/AdminLayout";
import AuthLayout from "./Layouts/AuthLayout";


import Login from "./Pages/Auth/Login";

import Home from "./Pages/Home";
import Events from "./Pages/Events";
import EventDetail from "./Pages/EventDetail";
import Dashboard from "./Pages/Admin/AdminHome";
import Stats from "./Pages/Admin/AdminStats";
import AdminChurchStats from "./Pages/Admin/AdminChurchStats";
import ProvinceManager from "./Pages/Admin/ProvinceManager";
import CreateEvent from "./Pages/Admin/CreateEvent";
import Register from "./Pages/Admin/Register";
import Settings from "./Pages/Admin/Settings";
import UserManagement from "./Pages/Admin/UserManagement";
import ChangePassword from "./Pages/Admin/ChangePassword";
import { useAuth } from "./Context/AuthContext";
import { Loader2 } from "lucide-react";

// คอมโพเนนต์ช่วยเช็คว่าล็อกอินหรือยัง
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-[#00a3ff]" size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const isChangePasswordRoute = location.pathname === '/admin/change-password';

  if (user?.mustChangePassword && !isChangePasswordRoute) {
    return <Navigate to="/admin/change-password" replace />;
  }

  if (!user?.mustChangePassword && isChangePasswordRoute) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* === โซน Auth (ไม่มีการเช็คล็อกอิน ให้เข้าได้เลย) === */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

      {/* === โซน User (ใช้ UserLayout ไม่ต้องล็อกอินก็ดูได้) === */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
      </Route>

      {/* === โซน Admin (ต้องล็อกอิน) === */}
      
      {/* Standalone Route for forced password change (no Sidebar) */}
      <Route 
        path="/admin/change-password" 
        element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} 
      />

      {/* Main Admin Pages (with Sidebar) */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="update" element={<Stats />} />
        <Route path="church-stats" element={<AdminChurchStats />} />
        <Route path="provinces" element={<ProvinceManager />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="users"          element={<UserManagement />} />
        <Route path="users/add"      element={<Register />} />
        <Route path="settings"       element={<Settings />} />
      </Route>

      {/* ถ้าเข้า /login เฉยๆ ให้เด้งไป /auth/login */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />

      {/* ถ้าหาหน้าไหนไม่เจอเลย เด้งกลับไปหน้าแรก */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
