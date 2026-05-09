import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import api from '../utils/axios';

// Category accent colors
const categoryColor = {
  Worship:    { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/20'   },
  Community:  { bg: 'bg-emerald-500/15',text: 'text-emerald-400',border: 'border-emerald-500/20' },
  Camp:       { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/20'  },
  Service:    { bg: 'bg-pink-500/15',   text: 'text-pink-400',   border: 'border-pink-500/20'    },
  Workshop:   { bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-500/20'   },
};

const categories = ['All', 'Worship', 'Community', 'Camp', 'Service', 'Workshop'];

// Auto-calculate status from event dates
const getSmartStatus = (event) => {
  if (event.status === 'cancelled') {
    return { label: 'ยกเลิก', color: 'bg-red-500/15 text-red-400 border-red-500/20', isCancelled: true, isCompleted: false };
  }
  const now   = new Date();
  const start = event.startDate ? new Date(event.startDate) : null;
  const end   = event.endDate   ? new Date(event.endDate)   : null;

  if (!start) return { label: 'TBA', color: 'bg-slate-500/15 text-slate-400 border-slate-500/20', isCancelled: false, isCompleted: false };

  if (now < start) {
    const d = Math.ceil((start - now) / 864e5);
    const label = d === 1 ? 'พรุ่งนี้' : d <= 7 ? `อีก ${d} วัน` : d <= 30 ? `อีก ${Math.ceil(d/7)} สัปดาห์` : `อีก ${Math.ceil(d/30)} เดือน`;
    return { label, color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', isCancelled: false, isCompleted: false };
  }
  if (end && now >= start && now <= end) {
    return { label: 'กำลังจัด', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', isCancelled: false, isCompleted: false };
  }
  const ref  = (end && now > end) ? end : start;
  const days = Math.floor((now - ref) / 864e5);
  const ago  = days < 1 ? 'วันนี้' : days < 7 ? `${days} วันที่แล้ว` : days < 30 ? `${Math.floor(days/7)} สัปดาห์ที่แล้ว` : days < 365 ? `${Math.floor(days/30)} เดือนที่แล้ว` : `${Math.floor(days/365)} ปีที่แล้ว`;
  return { label: ago, color: 'bg-slate-500/15 text-slate-400 border-slate-500/20', isCancelled: false, isCompleted: true };
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/events`);
      setEvents(res.data || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('ไม่สามารถโหลดข้อมูลกิจกรรมได้');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("ต้องการลบกิจกรรมนี้ใช่หรือไม่?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("ลบกิจกรรมสำเร็จ");
      setEvents(events.filter(e => e._id !== id));
    } catch(err) {
      console.error(err);
      toast.error("ลบไม่สำเร็จ");
    }
  };

  const filtered = filter === 'All'
    ? events
    : events.filter(e => e.category === filter);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const { isAuthenticated } = useAuth();
  const isLoggedIn = isAuthenticated;

  return (
    <div className="min-h-screen bg-[#0d1522] font-['Kanit'] px-5 py-8 md:px-10 md:py-10">

      {/* ─── HEADER ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[#00a3ff] text-[10px] font-black tracking-[0.3em] uppercase mb-1">Schedule</p>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">ปฏิทินกิจกรรมทั้งหมด</h1>
          <p className="text-slate-400 text-sm mt-1 font-light">ติดตามและจัดการกิจกรรมและโปรแกรมของคริสตจักร</p>
        </div>
        {isLoggedIn && (
          <Link to="/admin/events/create" className="bg-[#0054a5] hover:bg-[#00a3ff] text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-[0_0_16px_rgba(0,84,165,0.35)] hover:shadow-[0_0_22px_rgba(0,163,255,0.45)] whitespace-nowrap self-start sm:self-auto">
            + สร้างกิจกรรมใหม่
          </Link>
        )}
      </div>

      {/* ─── FILTER TABS ─────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
              filter === cat
                ? 'bg-[#00a3ff] text-white border-[#00a3ff] shadow-[0_0_12px_rgba(0,163,255,0.3)]'
                : 'bg-white/5 text-slate-400 border-white/8 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── EVENTS GRID ─────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#00a3ff]">
          <Loader2 size={32} className="animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400">กำลังโหลดกิจกรรม...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#1b2537] border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-slate-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">ไม่พบกิจกรรม</h2>
          <p className="text-slate-400 text-sm mb-6">ยังไม่มีกิจกรรมในหมวดหมู่นี้ หรือยังไม่ได้สร้างกิจกรรมใดๆ</p>
          {isLoggedIn && (
            <Link to="/admin/events/create" className="text-[#00a3ff] hover:underline text-sm font-bold">
              + เริ่มสร้างกิจกรรมใหม่เลย
            </Link>
          )}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map(event => {
              const colors = categoryColor[event.category] ?? categoryColor.Worship;
              const status = getSmartStatus(event);
              return (
                <motion.div
                  key={event._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-[#1b2537] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex flex-col"
                >
                  <Link to={`/events/${event._id}`} className="aspect-[16/9] relative overflow-hidden bg-slate-800 block">
                    {event.image ? (
                       <img src={event.image} alt={event.title} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${status.isCompleted ? 'brightness-75 saturate-50' : 'brightness-90'}`} />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center"><Calendar size={32} className="text-slate-600" /></div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                       <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${colors.bg} ${colors.text} ${colors.border}`}>
                         {event.category}
                       </span>
                    </div>
                    {/* Smart Status Badge */}
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider backdrop-blur-md border ${status.color}`}>
                      {status.label}
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-1">
                    <Link to={`/events/${event._id}`}>
                      <h2 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-[#00a3ff] transition-colors">{event.title}</h2>
                    </Link>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4 font-light leading-relaxed">{event.description || event.desc || 'ไม่มีคำอธิบาย'}</p>

                    <div className="mt-auto space-y-2 mb-4">
                      <div className="flex items-center gap-2.5 text-slate-300 text-xs font-medium">
                        <Calendar size={14} className="text-[#00a3ff]" />
                        <span>{formatDate(event.startDate)} {event.endDate ? ` - ${formatDate(event.endDate)}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-300 text-xs font-medium">
                        <MapPin size={14} className="text-[#f472b6]" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex gap-2">
                       <Link to={`/events/${event._id}`} className="flex-1 bg-[#00a3ff]/10 hover:bg-[#00a3ff]/20 text-[#00a3ff] font-bold py-2 rounded-lg transition-colors text-center text-xs">
                          ดูรายละเอียด
                       </Link>
                       {isLoggedIn && (
                         <>
                           <Link to={`/admin/events/edit/${event._id}`} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-lg transition-colors text-center text-xs">
                              แก้ไข
                           </Link>
                           <button onClick={() => handleDelete(event._id)} className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors flex items-center justify-center">
                              <Trash2 size={14} />
                           </button>
                         </>
                       )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
};

export default Events;