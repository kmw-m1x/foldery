import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, BookOpen, Droplets, Home, MapPin, Megaphone, Activity, Loader2 } from 'lucide-react';

const fade = (i) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45 } },
});

const StatCard = ({ title, value, icon: Icon, accent, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.06, duration: 0.45 } }}
    className="relative bg-[#1b2537] border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-white/15 transition-all duration-300 group cursor-default"
  >
    {/* Background glow */}
    <div
      className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-[0.07] group-hover:opacity-[0.15] transition-opacity duration-500"
      style={{ backgroundColor: accent, filter: 'blur(20px)' }}
    />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{title}</p>
        <p className="text-4xl font-black text-white leading-none">{(value || 0).toLocaleString()}</p>
      </div>
      <div className="p-3 rounded-xl" style={{ backgroundColor: `${accent}20` }}>
        <Icon size={22} style={{ color: accent }} />
      </div>
    </div>
    {/* Bottom accent bar on hover */}
    <div
      className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
      style={{ backgroundColor: accent }}
    />
  </motion.div>
);

export default function AdminHome() {
  const [stats, setStats] = useState({
    hearers: 0, targetAreas: 0, decisions: 0,
    baptized: 0, disciples: 0, houseChurches: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/stats/all');
        const d = res.data[0]?.stats || {};
        setStats({
          hearers:       d.hearers       || 0,
          targetAreas:   d.targetAreas   || 0,
          decisions:     d.decisions     || 0,
          baptized:      d.baptized      || 0,
          disciples:     d.disciples     || 0,
          houseChurches: d.houseChurches || 0,
        });
      } catch (e) {
        console.error('Failed to fetch stats:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = [
    { name: 'ม.ค.', hearers: 1200, decisions: 80  },
    { name: 'ก.พ.', hearers: 1900, decisions: 110 },
    { name: 'มี.ค.', hearers: 1600, decisions: 95  },
    { name: 'เม.ย.', hearers: 2400, decisions: 160 },
    { name: 'พ.ค.', hearers: 2200, decisions: 140 },
    { name: 'มิ.ย.', hearers: 2800, decisions: 190 },
    { name: 'ก.ค.', hearers: 3200, decisions: 220 },
  ];

  const statCards = [
    { title: 'Hearers',       value: stats.hearers,       icon: Megaphone, accent: '#00a3ff' },
    { title: 'Target Areas',  value: stats.targetAreas,   icon: MapPin,    accent: '#f472b6' },
    { title: 'Decisions',     value: stats.decisions,     icon: BookOpen,  accent: '#a78bfa' },
    { title: 'Baptized',      value: stats.baptized,      icon: Droplets,  accent: '#22d3ee' },
    { title: 'Disciples',     value: stats.disciples,     icon: Users,     accent: '#34d399' },
    { title: 'House Churches',value: stats.houseChurches, icon: Home,      accent: '#fb923c' },
  ];

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#00a3ff]" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-1">

      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
      >
        <div>
          <p className="text-[#00a3ff] text-[10px] font-black tracking-[0.3em] uppercase mb-1">Overview</p>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Mission Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1 font-light">ภาพรวมสถิติพันธกิจทั้งหมด — อัปเดตแบบ Real-time</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </div>
      </motion.div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {statCards.map((c, i) => <StatCard key={c.title} {...c} idx={i} />)}
      </div>

      {/* ─── Chart ─── */}
      <motion.div
        {...fade(7)}
        className="bg-[#1b2537] border border-white/5 rounded-2xl p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Analytics</p>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Activity size={18} className="text-[#00a3ff]" />
              Growth Trend
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-[3px] bg-[#00a3ff] rounded-full inline-block" />
              Hearers
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-[3px] bg-[#a78bfa] rounded-full inline-block" />
              Decisions
            </span>
          </div>
        </div>

        <div className="h-64 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gHearers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00a3ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00a3ff" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="gDecisions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: '#0d1522',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: 12,
                }}
                cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 40 }}
              />
              <Area type="monotone" dataKey="hearers"   stroke="#00a3ff" strokeWidth={2.5} fillOpacity={1} fill="url(#gHearers)"   dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#00a3ff' }} />
              <Area type="monotone" dataKey="decisions" stroke="#a78bfa" strokeWidth={2.5} fillOpacity={1} fill="url(#gDecisions)" dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#a78bfa' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}