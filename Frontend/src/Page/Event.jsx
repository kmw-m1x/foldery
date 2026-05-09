import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, MapPin, Clock, ArrowRight, Search,
  Loader2, Tag, SlidersHorizontal, X, ChevronDown,
  CalendarClock, CheckCircle2, XCircle, Flame, Sparkles
} from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (d) => {
  if (!d) return "TBA";
  return new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
};

const getSmartStatus = (event) => {
  if (event.status === "cancelled")
    return { color: "bg-red-500", badgeCls: "bg-red-500/15 text-red-500 border-red-500/25", text: "Cancelled", tag: "cancelled", isCancelled: true, isCompleted: false };

  const now = new Date();
  const start = event.startDate ? new Date(event.startDate) : null;
  const end   = event.endDate   ? new Date(event.endDate)   : null;

  if (!start)
    return { color: "bg-slate-400", badgeCls: "bg-slate-400/15 text-slate-400 border-slate-400/25", text: "TBA", tag: "upcoming", isCancelled: false, isCompleted: false };

  if (now < start) {
    const d = Math.ceil((start - now) / 864e5);
    const countdown = d === 1 ? "พรุ่งนี้" : d <= 7 ? `อีก ${d} วัน` : d <= 30 ? `อีก ${Math.ceil(d / 7)} สัปดาห์` : `อีก ${Math.ceil(d / 30)} เดือน`;
    return { color: "bg-blue-500", badgeCls: "bg-blue-500/15 text-blue-500 border-blue-500/25", text: countdown, tag: "upcoming", isCancelled: false, isCompleted: false };
  }

  if (end && now >= start && now <= end)
    return { color: "bg-emerald-500", badgeCls: "bg-emerald-500/15 text-emerald-500 border-emerald-500/25", text: "กำลังจัด 🔴", tag: "ongoing", isCancelled: false, isCompleted: false };

  const ref  = end && now > end ? end : start;
  const days = Math.floor((now - ref) / 864e5);
  const ago  = days < 1 ? "วันนี้" : days < 7 ? `${days} วันที่แล้ว` : days < 30 ? `${Math.floor(days / 7)} สัปดาห์ที่แล้ว` : days < 365 ? `${Math.floor(days / 30)} เดือนที่แล้ว` : `${Math.floor(days / 365)} ปีที่แล้ว`;
  return { color: "bg-slate-400", badgeCls: "bg-slate-400/15 text-slate-400 border-slate-400/25", text: ago, tag: "completed", isCancelled: false, isCompleted: true };
};

// ─── Category config ─────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Community", "Camp", "Service", "Worship", "Workshop"];
const SORT_OPTIONS = [
  { value: "date-asc",   label: "วันที่ — ใกล้สุด" },
  { value: "date-desc",  label: "วันที่ — ไกลสุด"  },
  { value: "title-asc",  label: "ชื่อ A → Z"        },
  { value: "title-desc", label: "ชื่อ Z → A"        },
];
const STATUS_FILTERS = [
  { value: "all",       label: "ทั้งหมด",    icon: Sparkles   },
  { value: "upcoming",  label: "กำลังจะมา",  icon: CalendarClock },
  { value: "ongoing",   label: "กำลังจัด",   icon: Flame       },
  { value: "completed", label: "จบแล้ว",     icon: CheckCircle2 },
  { value: "cancelled", label: "ยกเลิก",     icon: XCircle     },
];

// ─── Card Component ───────────────────────────────────────────────────────────
const EventCard = ({ event, index }) => {
  const status = getSmartStatus(event);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05, duration: 0.4 } }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Link
        to={`/events/${event._id}`}
        className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 h-full"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${status.isCompleted ? "brightness-75 saturate-50" : status.isCancelled ? "grayscale brightness-50" : ""}`}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Category pill */}
          <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Tag size={10} className="text-blue-500" />
            {event.category}
          </div>

          {/* Smart status pill */}
          <div className={`absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide border backdrop-blur-md ${status.badgeCls}`}>
            {status.text}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 pt-4">
          {/* Date + time */}
          <div className="flex items-center gap-3 text-[11px] font-semibold text-blue-500 mb-3">
            <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(event.startDate)}</span>
            {event.displayTime && (
              <>
                <span className="w-px h-3 bg-slate-200" />
                <span className="flex items-center gap-1 text-slate-400"><Clock size={12} />{event.displayTime}</span>
              </>
            )}
          </div>

          <h3 className={`text-base font-bold leading-snug line-clamp-2 mb-2 transition-colors ${status.isCancelled ? "text-slate-400 line-through" : status.isCompleted ? "text-slate-500 group-hover:text-slate-700" : "text-slate-900 group-hover:text-blue-600"}`}>
            {event.title}
          </h3>

          <p className="text-slate-400 text-[13px] leading-relaxed line-clamp-2 mb-4 flex-1">{event.desc}</p>

          <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-slate-50">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium max-w-[70%]">
              <MapPin size={13} className="text-slate-300 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${status.isCancelled ? "bg-slate-100 text-slate-300" : "bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110"}`}>
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Events = () => {
  const { t } = useTranslation();
  const [events, setEvents]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // Controls
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [statusFilter, setStatus]   = useState("all");
  const [sortBy, setSortBy]         = useState("date-asc");
  const [showSort, setShowSort]     = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/events`)
      .then(res => setEvents(res.data || []))
      .catch(err => { console.error(err); setError("ไม่สามารถโหลดข้อมูลกิจกรรมได้"); })
      .finally(() => setLoading(false));
  }, []);

  // Derived list
  const displayed = useMemo(() => {
    let list = [...events];

    // category filter
    if (category !== "All") list = list.filter(e => e.category === category);

    // status filter
    if (statusFilter !== "all") list = list.filter(e => getSmartStatus(e).tag === statusFilter);

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.desc?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q)
      );
    }

    // sort
    list.sort((a, b) => {
      if (sortBy === "date-asc")  return new Date(a.startDate) - new Date(b.startDate);
      if (sortBy === "date-desc") return new Date(b.startDate) - new Date(a.startDate);
      if (sortBy === "title-asc") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "title-desc")return (b.title || "").localeCompare(a.title || "");
      return 0;
    });

    return list;
  }, [events, category, statusFilter, search, sortBy]);

  const clearFilters = () => { setSearch(""); setCategory("All"); setStatus("all"); setSortBy("date-asc"); };
  const hasFilter = search || category !== "All" || statusFilter !== "all" || sortBy !== "date-asc";

  return (
    <div className="min-h-screen bg-slate-50 pb-28">

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-5 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a]">
        {/* Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px] translate-y-1/2 pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-blue-400 font-black tracking-[0.3em] uppercase text-[11px] mb-4">
              {t("e.topic")}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight leading-tight">
              {t("e.header")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{t("e.header2")}</span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              {t("e.description")}
            </p>
          </motion.div>

          {/* ─── Search Bar ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-10 max-w-xl mx-auto"
          >
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ค้นหากิจกรรม, สถานที่..."
                className="w-full bg-white/10 backdrop-blur-md border border-white/15 text-white placeholder:text-slate-500 rounded-2xl py-3.5 pl-11 pr-10 focus:outline-none focus:border-blue-400/60 focus:bg-white/15 transition-all text-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER BAR ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">

          {/* Category tabs */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  category === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />

            {/* Status filter pills */}
            {STATUS_FILTERS.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    statusFilter === s.value
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <Icon size={12} />
                  {s.label}
                </button>
              );
            })}

            {/* Spacer + Sort */}
            <div className="ml-auto flex-shrink-0 relative">
              <button
                onClick={() => setShowSort(v => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <SlidersHorizontal size={13} />
                {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
                <ChevronDown size={13} className={`transition-transform ${showSort ? "rotate-180" : ""}`} />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-50 w-48">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                        sortBy === opt.value ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active filters + count */}
          <div className="flex items-center gap-3 pb-2 text-xs text-slate-400">
            <span className="font-bold text-slate-600">{displayed.length} กิจกรรม</span>
            {hasFilter && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-blue-500 hover:text-blue-700 font-bold">
                <X size={11} /> ล้างตัวกรอง
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── GRID ───────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl mt-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
            <p className="text-sm font-medium">กำลังโหลดกิจกรรม...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-red-50 rounded-3xl border border-red-100 max-w-md mx-auto">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <AnimatePresence mode="popLayout">
            {displayed.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {displayed.map((event, i) => (
                  <EventCard key={event._id} event={event} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200"
              >
                <Search size={40} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-500 font-bold text-lg mb-1">ไม่พบกิจกรรม</p>
                <p className="text-slate-400 text-sm mb-5">ลองปรับเงื่อนไขการค้นหาดูนะ</p>
                <button onClick={clearFilters} className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-colors">
                  ล้างตัวกรองทั้งหมด
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Events;