import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Map, Settings,
  LogOut, Menu, X, ChevronRight, Calendar, UserPlus
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";

const navItems = [
  { to: "/admin/dashboard",      icon: <LayoutDashboard size={18} />, label: "Dashboard"       },
  { to: "/admin/church-stats",   icon: <Users size={18} />,           label: "Church Stats"    },
  { to: "/admin/update",         icon: <Users size={18} />,           label: "Mission Stats"   },
  { to: "/admin/provinces",      icon: <Map size={18} />,             label: "Province Stats"  },
  { to: "/admin/events/create",  icon: <Calendar size={18} />,        label: "Create Event"    },
  { to: "/admin/users",          icon: <UserPlus size={18} />,        label: "Admin Management"},
  { to: "/admin/settings",       icon: <Settings size={18} />,        label: "Settings"        },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) =>
    path === "/admin/dashboard"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen fixed left-0 top-0 z-50 bg-[#0a0f1a] border-r border-white/5 transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-60"
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-white/5 ${collapsed ? 'justify-center px-2' : ''}`}>
          <div className="relative shrink-0 group/logo">
            <div className="absolute inset-0 bg-blue-500/30 blur-lg rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500" />
            <img src="/icon.png" alt="BSC Logo" className="relative h-9 w-auto object-contain" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight tracking-wide truncate">ธารพระพร</p>
              <p className="text-[#00a3ff] text-[10px] uppercase tracking-[0.2em] font-medium">Blessing Stream</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`ml-auto p-1 rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-colors ${collapsed ? 'hidden' : 'block'}`}
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="flex justify-center py-3 text-slate-600 hover:text-white transition-colors">
            <ChevronRight size={16} />
          </button>
        )}

        {/* Nav Items */}
        <nav className="flex flex-col flex-1 px-2 py-3 gap-0.5 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase px-3 mb-2">Navigation</p>
          )}
          {navItems.map((item) => {
            if (item.label === "Admin Management" && user?.role !== 'superadmin') return null;

            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  active
                    ? "bg-[#00a3ff]/15 text-[#00a3ff] border border-[#00a3ff]/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                } ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? item.label : ""}
              >
                <span className={active ? "text-[#00a3ff]" : ""}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {active && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00a3ff] shadow-[0_0_6px_#00a3ff]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-3 border-t border-white/5 ${collapsed ? "flex justify-center" : ""}`}>
          <button
            onClick={() => logout()}
            className={`flex items-center gap-2.5 text-slate-500 hover:text-red-400 transition-colors text-sm font-medium rounded-xl px-3 py-2.5 hover:bg-red-500/5 w-full ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <MobileTopBar navItems={navItems} />
    </>
  );
}

// Mobile sticky top navbar
function MobileTopBar({ navItems }) {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="BSC" className="h-8 w-auto object-contain" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">ธารพระพร</p>
            <p className="text-[#00a3ff] text-[9px] uppercase tracking-widest">Blessing Stream</p>
          </div>
        </div>
        <button onClick={() => setOpen(true)} className="p-2 text-slate-400 hover:text-white">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0a0f1a] border-r border-white/5 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
              <span className="text-white font-black">Menu</span>
              <button onClick={() => setOpen(false)} className="p-1 text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col px-3 py-3 gap-1 flex-1">
              {navItems.map((item) => {
                if (item.label === "Admin Management" && user?.role !== 'superadmin') return null;
                const active = location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-[#00a3ff]/15 text-[#00a3ff] border border-[#00a3ff]/20"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-white/5">
              <button
                onClick={() => logout()}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
