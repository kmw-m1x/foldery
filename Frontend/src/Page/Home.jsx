import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Megaphone, Heart, Droplets, Home as HomeIcon, MapPin, ArrowRight } from "lucide-react";
import axios from "axios";
import ThailandMapDashboard from "../Components/ThailandMapDashboard";

// Animated counter
const Counter = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const end = parseInt(String(value).replace(/,/g, "")) || 0;
    if (end === 0) return;
    let start = 0;
    const timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count.toLocaleString()}</span>;
};

const statConfig = [
  { key: "hearers",      label: "ผู้ได้ยิน",        icon: <Megaphone size={20} />, color: "from-blue-500/20 to-blue-600/5",   accent: "#00a3ff" },
  { key: "decisions",    label: "ตัดสินใจเชื่อ",    icon: <Heart size={20} />,     color: "from-pink-500/20 to-pink-600/5",   accent: "#f472b6" },
  { key: "baptized",     label: "ผู้บัพติศมา",      icon: <Droplets size={20} />,  color: "from-cyan-500/20 to-cyan-600/5",   accent: "#22d3ee" },
  { key: "disciples",    label: "สมาชิก",           icon: <Users size={20} />,     color: "from-violet-500/20 to-violet-600/5",accent: "#a78bfa" },
  { key: "houseChurches",label: "คริสตจักรบ้าน",   icon: <HomeIcon size={20} />,  color: "from-amber-500/20 to-amber-600/5", accent: "#fbbf24" },
  { key: "targetAreas",  label: "พื้นที่เป้าหมาย", icon: <MapPin size={20} />,    color: "from-emerald-500/20 to-emerald-600/5",accent:"#34d399" },
];

const Home = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/stats/all`)
      .then(res => setStats(res.data[0]?.stats || {}))
      .catch(() => setStats({}));
  }, []);

  return (
    <div className="w-full font-['Kanit'] bg-[#0a0f1a]">

      {/* ─── HERO ────────────────────────────────────────── */}
      <div className="relative flex w-full h-[calc(100vh-64px)] overflow-hidden justify-center items-center">
        <div className="absolute inset-0 z-0">
          <img src="/bg/group.jpg" className="w-full h-full object-cover opacity-60" alt="bg" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/50 to-[#0a0f1a]/10" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 text-center w-full max-w-4xl px-6"
        >
          <span className="inline-block px-5 py-2 mb-6 text-[10px] font-black tracking-widest text-white/80 uppercase bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
            {t("hero.welcome_tag")}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-5 tracking-tight leading-tight drop-shadow-2xl">
            {t("hero.title")}
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto font-light text-base md:text-lg mb-10">
            {t("hero.subtitle")}
          </p>
          <Link to="/mission">
            <button className="inline-flex items-center gap-2 bg-[#0054a5] hover:bg-[#00a3ff] text-white font-bold px-7 py-3.5 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,84,165,0.4)] hover:shadow-[0_0_30px_rgba(0,163,255,0.5)] hover:-translate-y-0.5 text-sm">
              ดูภารกิจทั้งหมด <ArrowRight size={16} />
            </button>
          </Link>
        </motion.div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white animate-pulse" />
        </div>
      </div>

      {/* ─── MISSION AT A GLANCE ─────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-[#0a0f1a]">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-[#00a3ff] text-[10px] font-black tracking-[0.3em] uppercase">Mission at a Glance</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2 mb-1 tracking-tight">
              สถิติพันธกิจทั่วประเทศ
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-0.5 bg-[#00a3ff] rounded-full" />
              <p className="text-slate-400 font-light text-sm">ข้อมูลสรุปจากคริสตจักรธารพระพรทั้ง 6 แห่ง</p>
            </div>
          </motion.div>

          {/* 2-Column: Stats + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* LEFT: Stat Cards (2 columns of 3) */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {statConfig.map((s, i) => (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative bg-gradient-to-br ${s.color} border border-white/8 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 group overflow-hidden`}
                >
                  {/* Subtle glow dot */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-40"
                    style={{ backgroundColor: s.accent }} />

                  <div className="relative z-10">
                    <div className="mb-3 w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: s.accent + "25", color: s.accent }}>
                      {s.icon}
                    </div>
                    <p className="text-2xl font-black text-white leading-none mb-1">
                      {stats ? <Counter value={stats[s.key] ?? 0} /> : <span>—</span>}
                    </p>
                    <p className="text-slate-400 text-xs font-medium tracking-wide">{s.label}</p>
                  </div>
                </motion.div>
              ))}

              {/* CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="col-span-2 mt-2"
              >
                <Link to="/mission">
                  <div className="group flex items-center justify-between bg-[#0054a5]/20 hover:bg-[#0054a5]/40 border border-[#0054a5]/30 hover:border-[#00a3ff]/50 rounded-2xl px-6 py-4 transition-all duration-300 cursor-pointer">
                    <div>
                      <p className="text-white font-bold text-sm">ดูแดชบอร์ดเต็มรูปแบบ</p>
                      <p className="text-slate-400 text-xs font-light mt-0.5">สถิติรายจังหวัด แผนที่ และกราฟ</p>
                    </div>
                    <ArrowRight size={20} className="text-[#00a3ff] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* RIGHT: Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-[#111827] border border-white/8 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="px-5 pt-5 pb-2 border-b border-white/5">
                <p className="text-white font-bold text-sm flex items-center gap-2">
                  <MapPin size={14} className="text-[#00a3ff]" />
                  แผนที่สถิติรายจังหวัด
                </p>
              </div>
              <ThailandMapDashboard compact />
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;