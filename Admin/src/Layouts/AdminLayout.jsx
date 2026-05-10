import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "../Components/sidebar";
import { Toaster } from 'react-hot-toast';

export default function AdminLayout() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1b2537', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Kanit, sans-serif' },
        success: { iconTheme: { primary: '#00a3ff', secondary: '#fff' } },
      }} />
      <div className="flex min-h-screen bg-[#0d1522] font-['Kanit'] text-white">
        <Sidebar />
        {/* Main content — offset left for desktop sidebar, top for mobile */}
        <main className="flex-1 md:ml-60 pt-14 md:pt-0 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}