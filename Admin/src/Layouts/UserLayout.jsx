import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogIn, Menu, X, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const navLinks = [
  { to: '/',       label: 'หน้าหลัก' },
  { to: '/events', label: 'กิจกรรม'  },
];

const UserLayout = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1522] font-['Kanit'] text-white">

      {/* ─── NAVBAR ─────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5 h-16">
        <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between relative">

          {/* Logo — left */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative group/logo">
              <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src="/icon.png" alt="BSC" className="relative h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm leading-tight tracking-wide">ธารพระพร</p>
              <p className="text-[#00a3ff] text-[9px] leading-none tracking-[0.2em] uppercase font-medium">Blessing Stream</p>
            </div>
          </Link>

          {/* Center pill menu — desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 bg-white/5 border border-white/8 rounded-full p-1 backdrop-blur-sm">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive(link.to)
                    ? 'bg-white text-[#0a0f1a] font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/8'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — Login + Mobile toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Profile / Login button — always visible */}
            {isAuthenticated && user ? (
              <Link
                to="/admin/dashboard"
                className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 text-white px-3 py-1.5 rounded-full transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-[#00a3ff]/15 flex items-center justify-center border border-[#00a3ff]/20">
                  <ShieldCheck size={14} className="text-[#00a3ff]" />
                </div>
                <div className="flex flex-col pr-2 text-left">
                  <span className="text-xs font-bold leading-none mb-0.5">{user.username || 'Admin'}</span>
                  <span className="text-[9px] text-[#00a3ff] uppercase tracking-wider font-black leading-none">{user.role}</span>
                </div>
              </Link>
            ) : (
              <Link
                to="/auth/login"
                className="hidden sm:flex items-center gap-1.5 bg-[#0054a5] hover:bg-[#00a3ff] active:scale-95 text-white text-sm font-bold px-4 py-2 rounded-full transition-all duration-200 shadow-[0_0_14px_rgba(0,84,165,0.35)] hover:shadow-[0_0_20px_rgba(0,163,255,0.45)]"
              >
                <LogIn size={14} /> เข้าสู่ระบบ
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 bg-[#0a0f1a] border-t border-white/5 ${
          mobileOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-white/8 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 mt-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl text-sm transition-all"
              >
                <LayoutDashboard size={15} className="text-[#00a3ff]" />
                ไปที่ Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 mt-1 bg-[#0054a5] hover:bg-[#00a3ff] text-white font-bold py-3 rounded-xl text-sm transition-all"
              >
                <LogIn size={15} /> เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── CONTENT ────────────────────────────── */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ─── FOOTER ─────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#0a0f1a] py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img src="/icon.png" alt="BSC" className="h-6 w-auto object-contain opacity-70" />
          <span className="text-slate-400 text-xs font-semibold">ธารพระพร • Blessing Stream Church</span>
        </div>
        <p className="text-slate-600 text-[11px]">© 2025 · All rights reserved</p>
      </footer>
    </div>
  );
};

export default UserLayout;