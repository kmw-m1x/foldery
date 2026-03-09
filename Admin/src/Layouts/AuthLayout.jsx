import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full font-sans">
      
      {/* --- ฝั่งซ้าย: Branding (โชว์เฉพาะจอคอม) --- */}
      <div className="hidden lg:flex w-1/2 bg-[#15283c] flex-col justify-center items-center relative overflow-hidden">
        
        {/* ลวดลายพื้นหลังจางๆ */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-[#15283c] to-[#15283c]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        {/* Content ตรงกลาง */}
        <div className="z-10 text-center p-12">
          <div className="bg-[#ff5722] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/20">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
            MISSION<span className="text-[#ff5722]">ADMIN</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
            ระบบจัดการพันธกิจ ติดตามการเติบโต และขยายแผ่นดินของพระเจ้าอย่างเป็นระบบ
          </p>
        </div>

        {/* Copyright */}
        <div className="absolute bottom-8 text-gray-600 text-sm">
          © 2025 Mission Control System
        </div>
      </div>

      {/* --- ฝั่งขวา: พื้นที่สำหรับ Form (Outlet) --- */}
      <div className="w-full lg:w-1/2 bg-[#f8f9fa] flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in-up">
           {/* ตรงนี้แหละที่จะเอาหน้า Login มาเสียบ */}
           <Outlet />
        </div>
      </div>

    </div>
  );
}