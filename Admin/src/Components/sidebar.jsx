import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    // สไตล์ Pluto: พื้นหลังโปร่ง พอ Active แล้วเป็นสีส้ม
    const baseClass =
      "flex items-center gap-3 p-3 text-[15px] font-medium transition-all duration-300 mx-2 rounded-md mb-1";
    const activeClass = "bg-[#ff5722] text-white shadow-md"; // Active: สีส้ม ตัวหนังสือขาว
    const inactiveClass = "text-gray-400 hover:bg-white/5 hover:text-white"; // Inactive: เทา

    return location.pathname === path
      ? `${baseClass} ${activeClass}`
      : `${baseClass} ${inactiveClass}`;
  };

  return (
    <aside className="w-72 bg-[#15283c] h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50 font-sans">
      {/* --- 1. PROFILE SECTION (หัวบนสุด) --- */}
      <div className="flex flex-col items-center justify-center py-8 bg-[#15283c] border-b border-white/5">
        <div className="w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden mb-3 p-1">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            alt="Admin"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <h3 className="text-white text-lg font-bold tracking-wide">
          Pastor John
        </h3>
        <p className="text-gray-400 text-sm">General Administrator</p>
      </div>

      {/* --- 2. MENU TITLE --- */}
      <div className="px-6 py-5">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
          General
        </p>
      </div>

      {/* --- 3. LINKS --- */}
      <nav className="flex flex-col flex-1 px-2">
        <Link
          to="/admin/dashboard"
          className={getLinkClass("/admin/dashboard")}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/admin/church-stats" className={getLinkClass("/admin/church-stats")}>
          <Users size={20} />
          <span>Church Stats</span>
        </Link>

        <Link to="/admin/update" className={getLinkClass("/update")}>
          <Users size={20} />
          <span>Mission Stats</span>
        </Link>

        <Link to="/admin/settings" className={getLinkClass("/settings")}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>

      {/* --- 4. FOOTER --- */}
      <div className="p-4 bg-[#102030]">
        <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#ff5722] text-white font-bold rounded-lg hover:bg-[#e64a19] transition-colors shadow-lg">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
