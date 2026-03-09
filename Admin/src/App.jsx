import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./Layouts/UserLayout";
import AdminLayout from "./Layouts/AdminLayout";
import AuthLayout from "./Layouts/AuthLayout";


import Login from "./Pages/Auth/Login";

import Home from "./Pages/Home";
import Events from "./Pages/Events";
import Dashboard from "./Pages/Admin/AdminHome"; // หน้า Admin
import Stats from "./Pages/Admin/AdminStats"; // หน้า Admin
import AdminChurchStats from "./Pages/Admin/AdminChurchStats"; // หน้า Admin
function App() {
  return (

      <Routes>
        {/* === โซน User (ใช้ UserLayout) === */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
        </Route>

        {/* === โซน Admin (ใช้ AdminLayout) === */}
        {/* path="/admin" แปลว่าทุกอย่างที่ขึ้นต้นด้วย /admin จะใช้ Layout นี้ */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />{" "}
          {/* เข้า /admin เฉยๆ ให้ดีดไป dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="update" element={<Stats />} />
          <Route path="church-stats" element={<AdminChurchStats />} />
        </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />

      </Route>

      {/* ถ้าเข้า /login เฉยๆ ให้เด้งไป /auth/login (Option) */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      </Routes>


  );
}

export default App;
