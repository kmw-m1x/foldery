import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "../Components/sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#0d1522] font-['Kanit'] text-white">
      <Sidebar />
      {/* Offset: ml-60 (sidebar width) on desktop, pt-14 (topbar height) on mobile */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}