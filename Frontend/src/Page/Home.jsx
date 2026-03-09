import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useAnimationFrame } from "framer-motion";
import axios from "axios";
import {
  MapPin,
  ArrowRight,
  Users,
  Activity,
  RotateCcw,
  Megaphone,
  Heart,
  Droplets,
  Home as HomeIcon,
  BarChart3,
  Globe,
  LayoutDashboard,
  CalendarDays,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const cleanValue = String(value).replace(/,/g, "");
    const end = parseInt(cleanValue) || 0;
    if (start === end) return;
    let timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count.toLocaleString()}</span>;
};

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

const chartData = [
  { name: "Jan", uv: 2000 },
  { name: "Feb", uv: 3000 },
  { name: "Mar", uv: 2500 },
  { name: "Apr", uv: 4000 },
  { name: "May", uv: 3500 },
  { name: "Jun", uv: 4500 },
  { name: "Jul", uv: 5000 },
];

const Home = () => {
  const { t } = useTranslation();
  
  // ==========================================
  // ระบบ INFINITE SLIDER (ซ้าย) แบบไหลทางเดียวไม่มีกรอกลับ
  // ==========================================
  const totalSlides = 3;
  // ตัวแปรนี้จะบวก/ลบไปเรื่อยๆ ไม่มีที่สิ้นสุด เพื่อให้มันไหลไปข้างหน้าเสมอ
  const [infiniteSlideIndex, setInfiniteSlideIndex] = useState(0);
  
  // คำนวณหาว่าตอนนี้สไลด์ไหนกำลัง Active อยู่ (0, 1 หรือ 2) เพื่อแสดงแอนิเมชันให้ถูก
  const activeSlide = ((infiniteSlideIndex % totalSlides) + totalSlides) % totalSlides;

  const nextSlide = () => setInfiniteSlideIndex((prev) => prev + 1);
  const prevSlide = () => setInfiniteSlideIndex((prev) => prev - 1);

  // ฟังก์ชันนี้ไว้ให้จุดไข่ปลา กับ เมนูฝั่งขวา กดแล้ววาร์ปไปหาสไลด์เป้าหมายในทางที่สั้นที่สุด
  const jumpToSlide = (targetSlide) => {
    const currentMod = ((infiniteSlideIndex % totalSlides) + totalSlides) % totalSlides;
    let diff = targetSlide - currentMod;
    // สูตรหักลบ ให้มันเลือกทางหมุนที่ใกล้ที่สุด (เดินหน้า 1 ดีกว่าถอยหลัง 2)
    if (diff === 2) diff = -1;
    if (diff === -2) diff = 1;
    setInfiniteSlideIndex((prev) => prev + diff);
  };

  const [activeId, setActiveId] = useState(null);
  const defaultMapState = { center: [13.0, 101.5], zoom: 6 };
  const [mapState, setMapState] = useState(defaultMapState);
  const [missions, setMissions] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // ระบบ INFINITE MARQUEE (ขวา) แบบไร้รอยต่อ
  // ==========================================
  const trackRef = useRef(null);
  const setRef = useRef(null);
  const yPos = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  useAnimationFrame((time, delta) => {
    if (!setRef.current || !trackRef.current) return;
    const setHeight = setRef.current.offsetHeight;

    if (!isHovered) {
      yPos.current -= 0.05 * delta;
    }

    yPos.current = yPos.current % setHeight;
    if (yPos.current > 0) {
      yPos.current -= setHeight;
    }

    trackRef.current.style.transform = `translateY(${yPos.current}px)`;
  });

  const handleWheel = (e) => {
    yPos.current -= e.deltaY * 0.6;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const missionsRes = await axios.get("http://localhost:3000/api/missions");
        const statsRes = await axios.get("http://localhost:3000/api/stats/all");

        const cleanedMissions = missionsRes.data.map((mission) => ({
          ...mission,
          member: mission.member ? mission.member : 0,
        }));
        setMissions(cleanedMissions);

        const cleanStats = statsRes.data[0]?.stats || {
          hearers: 0, decisions: 0, baptized: 0, disciples: 0, houseChurches: 0,
        };
        setStatsData(cleanStats);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statsConfig = [
    { label: "dashboard.hearers", key: "hearers", icon: <Megaphone size={26} /> },
    { label: "dashboard.targetAreas", key: "targetAreas", icon: <MapPin size={26} /> },
    { label: "dashboard.decisions", key: "decisions", icon: <Heart size={26} /> },
    { label: "dashboard.baptized", key: "baptized", icon: <Droplets size={26} /> },
    { label: "dashboard.disciples", key: "disciples", icon: <Users size={26} /> },
    { label: "dashboard.houseChurches", key: "houseChurches", icon: <HomeIcon size={26} /> },
  ];

  const originalMenus = [
    { title: "Overview", desc: "สรุปข้อมูลภาพรวม", icon: <LayoutDashboard size={24} /> },
    { title: "Analytics", desc: "กราฟสถิติการเติบโต", icon: <BarChart3 size={24} /> },
    { title: "Missions Map", desc: "แผนที่และภารกิจพื้นที่", icon: <Globe size={24} /> },
    { title: "Events", desc: "กิจกรรมประจำเดือน", icon: <CalendarDays size={24} /> },
    { title: "New Members", desc: "ต้อนรับสมาชิกใหม่", icon: <Users size={24} /> },
    { title: "Donations", desc: "ข้อมูลการถวาย", icon: <Heart size={24} /> },
  ];

  return (
    <div className="relative flex w-full h-[calc(100vh-64px)] overflow-hidden bg-[#0d1522] font-['Kanit'] text-slate-900">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bg/group.jpg"
          className="w-full h-full object-cover opacity-20 blur-sm mix-blend-luminosity"
          alt="bg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1522] via-[#101b2b]/90 to-[#101b2b]/60"></div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
        </div>
      )}

      {/* ================= ซ้าย: Main Slide Content ================= */}
      <div className="flex-1 relative z-10 h-full overflow-hidden">
        
        {/* คอนเทนเนอร์หลักที่จะวิ่งไปซ้าย-ขวาไม่มีที่สิ้นสุด */}
        <div 
          className="relative w-full h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${infiniteSlideIndex * 100}%)` }}
        >
          {/* สร้างกล่องครอบสไลด์ทั้ง 3 ชุด แล้วใช้คณิตศาสตร์ดึงตำแหน่งมารอรับข้างหน้าเสมอ */}
          {[
            // --- SLIDE 0: Overview ---
            (
              <div className="w-full h-full flex flex-col justify-center items-center px-6 md:px-16 pb-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={activeSlide === 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.8 }}
                  className="text-center w-full max-w-5xl"
                >
                  <span className="inline-block px-5 py-2 mb-6 text-[10px] font-black tracking-widest text-white uppercase bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
                    ยินดีต้อนรับสู่
                  </span>
                  <h1 className="text-4xl md:text-6xl lg:text-[80px] font-black text-white mb-6 tracking-tight drop-shadow-2xl">
                    คริสตจักรธารพระพร
                  </h1>
                  <p className="text-slate-300 max-w-2xl mx-auto font-semibold text-base md:text-xl drop-shadow-md mb-12">
                    คริสตจักรเพื่อทุกคน
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                    {statsConfig.map((item, idx) => {
                      const val = statsData ? statsData[item.key] : 0;
                      return (
                        <div key={idx} className="bg-[#1b2537]/80 backdrop-blur-xl border border-white/5 p-5 rounded-[20px] shadow-2xl flex items-center gap-5 text-left hover:bg-[#233045] transition-all">
                          <div className="p-4 rounded-xl bg-[#0054a5] text-white shadow-[0_0_15px_rgba(0,84,165,0.4)]">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none mb-1">
                              <Counter value={String(val)} />
                            </h3>
                            <p className="text-[11px] md:text-xs font-medium text-slate-400 uppercase tracking-widest line-clamp-1">
                              {t(item.label)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            ),

            // --- SLIDE 1: Analytics ---
            (
              <div className="w-full h-full flex flex-col justify-center items-center px-6 md:px-16 pb-10">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={activeSlide === 1 ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full max-w-5xl bg-[#1b2537] p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col h-[70%] border border-white/5"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-white flex items-center gap-3 text-xl md:text-2xl uppercase tracking-widest">
                      <BarChart3 size={28} className="text-[#0054a5]" /> {t("analytics.title") || "Analytics Overview"}
                    </h3>
                  </div>
                  <div className="flex-1 w-full min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0054a5" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#0054a5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ backgroundColor: "#0d1522", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "Kanit" }} />
                        <Area type="monotone" dataKey="uv" stroke="#00a3ff" strokeWidth={4} fillOpacity={1} fill="url(#colorBlue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            ),

            // --- SLIDE 2: Map & Missions ---
            (
              <div className="w-full h-full flex justify-center items-center px-6 md:px-12 pb-10">
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={activeSlide === 2 ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full max-w-6xl bg-[#1b2537] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[80%] border border-white/5"
                >
                  <div className="flex-[2] relative bg-[#0d1522] h-full min-h-[300px] lg:min-h-full">
                    <div className="absolute top-6 left-6 z-[1000]">
                      <button onClick={() => { setMapState(defaultMapState); setActiveId(null); }} className="bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl shadow-lg hover:bg-[#0054a5] hover:text-white transition-all border border-white/10">
                        <RotateCcw size={20} />
                      </button>
                    </div>
                    <div className="h-full w-full" style={{ filter: 'brightness(0.8) contrast(1.2) sepia(0.2) hue-rotate(180deg) saturate(0.8)' }}>
                      <MapContainer center={defaultMapState.center} zoom={defaultMapState.zoom} className="h-full w-full bg-transparent">
                        <MapUpdater center={mapState.center} zoom={mapState.zoom} />
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                        {missions.map((m) => m.lat && m.lng && (
                          <Marker key={m.id} position={[m.lat, m.lng]}>
                            <Popup>
                              <div className="p-2 text-center font-['Kanit']">
                                <h4 className="font-bold text-slate-800 text-base">{m.title}</h4>
                                <p className="text-xs text-[#0054a5] font-medium">{m.member || 0} Team Members</p>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col bg-[#1b2537] border-l border-white/5 w-full lg:max-w-[400px]">
                    <div className="p-6 border-b border-white/5">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Activity size={22} className="text-[#00a3ff]" /> {t("home.missionFeed")}
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                      {missions.map((m) => (
                        <motion.div
                          key={m.id}
                          whileHover={{ x: 5 }}
                          onClick={() => { setMapState({ center: [m.lat, m.lng], zoom: 14 }); setActiveId(m.id); }}
                          className={`group p-3 rounded-2xl cursor-pointer transition-all duration-300 border ${activeId === m.id ? "bg-[#0054a5]/30 border-[#00a3ff] shadow-[0_0_15px_rgba(0,163,255,0.2)]" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}
                        >
                          <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-xl bg-[#0d1522] overflow-hidden flex-shrink-0 relative">
                              {m.images?.length > 0 ? (
                                <img src={m.images[0]} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform opacity-80" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500"><MapPin size={20} /></div>
                              )}
                            </div>
                            <div className="flex flex-col justify-center">
                              <h4 className={`font-bold text-sm leading-tight mb-1 ${activeId === m.id ? "text-white" : "text-slate-200"}`}>{m.title}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#00a3ff]/20 text-[#00a3ff] uppercase">{m.status}</span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium"><Users size={12} /> {m.member || 0}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          ].map((SlideContent, i) => {
            // โคตรสมการคณิตศาสตร์: คำนวณให้ Slide ไปดักรอหน้าต่างเสมอ! ไม่มีวันเจอกำแพง
            const xOffset = Math.round((infiniteSlideIndex - i) / totalSlides) * totalSlides * 100 + i * 100;
            return (
              <div
                key={i}
                className="absolute top-0 left-0 w-full h-full"
                style={{ left: `${xOffset}%` }}
              >
                {SlideContent}
              </div>
            );
          })}
        </div>

        {/* ปุ่มลูกศร ซ้าย-ขวา */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-50">
          <button onClick={prevSlide} className="p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-[#0054a5] transition-all shadow-lg border border-white/20">
            <ChevronLeft size={28} />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-50">
          <button onClick={nextSlide} className="p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-[#0054a5] transition-all shadow-lg border border-white/20">
            <ChevronRight size={28} />
          </button>
        </div>

        {/* จุดไข่ปลาด้านล่าง (กดแล้วจะวิ่งไปหาสไลด์ที่ใกล้ที่สุด) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          {[...Array(totalSlides)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => jumpToSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                activeSlide === idx ? "w-8 h-2.5 bg-[#00a3ff] shadow-[0_0_10px_rgba(0,163,255,0.8)]" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= ขวา: แถบ Navigation ไถแบบไร้ขีดจำกัด ================= */}
      <div 
        className="hidden md:flex flex-col w-72 lg:w-[320px] h-full relative z-20 bg-[#101b2b]/90 backdrop-blur-2xl border-l border-white/5 shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onWheel={handleWheel}
      >
        <div className="p-6 lg:p-8 border-b border-white/5 shrink-0 bg-[#0d1522]/50 z-20 relative shadow-md">
          <h2 className="text-white font-black tracking-widest uppercase text-sm flex items-center gap-3">
            <LayoutDashboard size={18} className="text-[#00a3ff]" /> NAVIGATION
          </h2>
        </div>

        {/* พื้นที่โชว์การ์ดแบบหลอกตาคนดู */}
        <div className="flex-1 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-[#101b2b] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#101b2b] to-transparent z-10 pointer-events-none"></div>

          <div ref={trackRef} className="absolute top-0 left-0 w-full px-4 lg:px-6 pt-4">
            
            {[0, 1, 2, 3].map((setIndex) => (
              <div 
                key={`set-${setIndex}`}
                ref={setIndex === 0 ? setRef : null} 
                className="flex flex-col gap-4 pb-4"
              >
                {originalMenus.map((menu, index) => {
                  const targetSlide = index % totalSlides;
                  const isActive = activeSlide === targetSlide; // เทียบกับสไลด์ที่กำลัง Active อยู่
                  return (
                    <button
                      key={`card-${setIndex}-${index}`}
                      onClick={() => jumpToSlide(targetSlide)}
                      className={`w-full text-left p-5 rounded-2xl transition-all duration-300 relative overflow-hidden group border ${
                        isActive
                          ? "bg-[#0054a5] border-[#00a3ff] shadow-[0_10px_25px_rgba(0,84,165,0.4)]" 
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 flex flex-col gap-3">
                        <div className={`p-3 rounded-xl inline-flex w-fit shadow-md ${
                          isActive ? "bg-white/20 text-white" : "bg-[#0d1522] text-[#0054a5] group-hover:text-[#00a3ff]"
                        }`}>
                          {menu.icon}
                        </div>
                        <div>
                          <h4 className={`font-bold text-lg leading-tight ${isActive ? "text-white" : "text-slate-200"}`}>{menu.title}</h4>
                          <p className={`text-[11px] mt-1 line-clamp-1 ${isActive ? "text-blue-100" : "text-slate-400"}`}>{menu.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .leaflet-container { z-index: 1 !important; border-radius: 0; font-family: 'Kanit', sans-serif; background: #0d1522; }
        .leaflet-popup-content-wrapper { border-radius: 12px; font-family: 'Kanit', sans-serif; }
      `}} />
    </div>
  );
};

export default Home;