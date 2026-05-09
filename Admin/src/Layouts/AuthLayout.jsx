import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full font-['Kanit'] bg-[#0a0f1a]">

      {/* ─── LEFT: Branding panel (desktop only) ───── */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2071&auto=format&fit=crop"
            alt="bg"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0054a5]/60 via-[#0a0f1a]/80 to-[#0a0f1a]" />
        </div>

        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#00a3ff] rounded-full opacity-10 blur-3xl pointer-events-none" />

        {/* Brand content */}
        <div className="relative z-10 text-center px-12">
          {/* Icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-[#00a3ff]/20 blur-2xl rounded-full" />
            <img src="/icon.png" alt="BSC Logo" className="relative w-full h-full object-contain drop-shadow-2xl" />
          </div>

          <span className="text-[10px] font-black tracking-[0.3em] text-[#00a3ff] uppercase block mb-3">
            Admin Portal
          </span>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight leading-tight">
            MISSION<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a3ff] to-[#22d3ee]">
              ADMIN
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-xs mx-auto leading-relaxed font-light">
            ระบบจัดการพันธกิจ ติดตามการเติบโต และขยายแผ่นดินของพระเจ้าอย่างเป็นระบบ
          </p>

          {/* Decorative dots */}
          <div className="flex justify-center gap-2 mt-10">
            {[0,1,2].map(i => (
              <div key={i} className={`rounded-full bg-[#00a3ff] ${i === 1 ? 'w-6 h-1.5' : 'w-1.5 h-1.5 opacity-40'}`} />
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="absolute bottom-8 text-slate-600 text-xs tracking-wide">
          © 2025 Blessing Stream Church
        </div>
      </div>

      {/* ─── RIGHT: Form area ───────────────────── */}
      <div className="w-full lg:w-1/2 bg-[#0d1522] flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-fade-in-up">
          <Outlet />
        </div>
      </div>

    </div>
  );
}