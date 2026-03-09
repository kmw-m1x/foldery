import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "../Components/sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#ece4d4] font-sans">
      
      {/* เรียกใช้ Component Sidebar ตรงนี้จบเลย */}
      <Sidebar />

      {/* เนื้อหาหลัก (ดันซ้าย 64 หรือ 16rem เพื่อหลบ Sidebar) */}
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
           <Outlet />
        </div>
      </main>

    </div>
  );
}