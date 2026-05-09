import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/axios';
import {
  LayoutDashboard, Users, Map, Calendar,
  ArrowRight, Megaphone, Heart, Droplets,
  Loader2, Tag, Clock, MapPin, AlertCircle
} from 'lucide-react';

const STATS_API = '/stats/all';
const EVENTS_API = '/events';

// Quick nav cards
const quickNav = [
  { to: '/admin/dashboard',    icon: <LayoutDashboard size={22} />, label: 'Dashboard',      desc: 'ภาพรวมสถิติทั้งหมด',      color: 'from-blue-500/20 to-blue-600/5',    accent: '#00a3ff' },
  { to: '/admin/church-stats', icon: <Users size={22} />,           label: 'Church Stats',   desc: 'สถิติรายคริสตจักร',        color: 'from-violet-500/20 to-violet-600/5', accent: '#a78bfa' },
  { to: '/admin/provinces',    icon: <Map size={22} />,             label: 'Province Stats', desc: 'จัดการข้อมูลรายจังหวัด',   color: 'from-cyan-500/20 to-cyan-600/5',    accent: '#22d3ee' },
  { to: '/events',             icon: <Calendar size={22} />,        label: 'Events',         desc: 'จัดการกิจกรรมทั้งหมด',      color: 'from-pink-500/20 to-pink-600/5',    accent: '#f472b6' },
];

const fade = { hidden: { opacity: 0, y: 18 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5 } }) };

const formatDate = (d) => {
  if (!d) return 'TBA';
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
};

const categoryColor = {
  Community: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  Camp:      { bg: 'bg-blue-500/15',    text: 'text-blue-400',    border: 'border-blue-500/20'    },
  Service:   { bg: 'bg-violet-500/15',  text: 'text-violet-400',  border: 'border-violet-500/20'  },
  Worship:   { bg: 'bg-pink-500/15',    text: 'text-pink-400',    border: 'border-pink-500/20'    },
  Workshop:  { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/20'   },
};

const Home = () => {
  const [statsData, setStatsData] = useState({
    hearers: 0,
    decisions: 0,
    baptized: 0,
    disciples: 0
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          api.get(STATS_API),
          api.get(EVENTS_API)
        ]);
        
        if (statsRes.data && statsRes.data.length > 0) {
          setStatsData(statsRes.data[0].stats);
        }
        
        // เอาเฉพาะกิจกรรม 3 อันล่าสุด
        setEvents((eventsRes.data || []).slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch data on home:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statBoxes = [
    { icon: <Megaphone size={18} />, label: 'ผู้ได้ยิน',      value: statsData.hearers,   color: '#00a3ff' },
    { icon: <Heart size={18} />,     label: 'ตัดสินใจเชื่อ',  value: statsData.decisions, color: '#f472b6' },
    { icon: <Droplets size={18} />,  label: 'บัพติศมา',       value: statsData.baptized,  color: '#22d3ee' },
    { icon: <Users size={18} />,     label: 'สมาชิก',         value: statsData.disciples, color: '#a78bfa' },
  ];

  return (
    <div className="min-h-screen bg-[#0d1522] font-['Kanit'] px-5 py-8 md:px-10 md:py-10">

      {/* ─── HEADER ───────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" custom={0} variants={fade}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
      >
        <div>
          <p className="text-[#00a3ff] text-[10px] font-black tracking-[0.3em] uppercase mb-1">Admin Portal</p>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Blessing Stream Church Admin Test Version</h1>
          <p className="text-slate-400 text-sm mt-1 font-light">คุณสามารถจัดการข้อมูลทั้งหมดได้จากที่นี่</p>
        </div>
      </motion.div>

      {/* ─── STATS ROW ────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statBoxes.map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="visible" custom={i + 1} variants={fade}
            className="bg-[#1b2537] border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors" style={{ backgroundColor: s.color + '22', color: s.color }}>
                {s.icon}
              </div>
              <span className="text-slate-400 text-sm font-medium tracking-wide">{s.label}</span>
            </div>
            {loading ? (
              <div className="h-8 w-24 bg-white/5 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-black text-white">{s.value?.toLocaleString() || 0}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* ─── QUICK NAV ────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" custom={2} variants={fade} className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">เมนูลัด (Quick Access)</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickNav.map((item, i) => (
            <motion.div key={item.to} initial="hidden" animate="visible" custom={i + 3} variants={fade}>
              <Link to={item.to}
                className={`group flex flex-col gap-3 bg-gradient-to-br ${item.color} border border-white/5 rounded-2xl p-5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 shadow-lg`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-inner"
                  style={{ backgroundColor: item.accent + '22', color: item.accent }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-base mb-1">{item.label}</p>
                  <p className="text-slate-400 text-xs font-light">{item.desc}</p>
                </div>
                <div className="mt-auto pt-2">
                  <ArrowRight size={18} className="text-slate-500 group-hover:text-white group-hover:translate-x-1.5 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── RECENT EVENTS ─────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" custom={8} variants={fade} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">กิจกรรมล่าสุด (Recent Events)</p>
          <Link to="/events" className="text-[#00a3ff] text-xs font-bold hover:underline flex items-center gap-1">
            ดูทั้งหมด <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={24} className="animate-spin text-[#00a3ff]" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {events.map(event => {
              const colors = categoryColor[event.category] ?? categoryColor.Worship;
              return (
                <div key={event._id} className="group bg-[#1b2537] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/15 transition-all duration-300">
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden relative">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Calendar size={20} className="opacity-30" /></div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${colors.bg} ${colors.text}`}>{event.category}</span>
                      <span className="text-slate-500 text-[10px] flex items-center gap-1"><Calendar size={10}/> {formatDate(event.startDate)}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm line-clamp-1 mb-1 group-hover:text-[#00a3ff] transition-colors">{event.title}</h3>
                    <div className="text-slate-400 text-xs flex items-center gap-1 line-clamp-1">
                      <MapPin size={10} className="shrink-0" /> <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#1b2537] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <AlertCircle size={32} className="text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm font-medium">ยังไม่มีกิจกรรมในระบบ</p>
            <Link to="/admin/events/create" className="text-[#00a3ff] text-xs mt-2 hover:underline">
              + สร้างกิจกรรมแรก
            </Link>
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default Home;