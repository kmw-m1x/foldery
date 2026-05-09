import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Waves, Home, UserCheck, Loader2 } from 'lucide-react';
import ThailandMapDashboard from '../Components/ThailandMapDashboard';
import MissionCard from '../Components/MissionCard';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, delay, isActive, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm border p-5 flex items-center gap-4 transition-all cursor-pointer ${
      isActive 
        ? `${color.replace('text-', 'border-')} scale-[1.03] shadow-md ring-1 ${color.replace('text-', 'ring-')}` 
        : 'border-slate-100 hover:shadow-md'
    }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
      <Icon size={24} className={color} />
    </div>
    <div>
      <p className={`text-xs font-medium uppercase tracking-wider ${isActive ? color : 'text-slate-500'}`}>{title}</p>
      <h3 className="text-2xl font-black text-slate-800 mt-0.5">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
    </div>
  </motion.div>
);

const MissionDashboard = () => {
  const [stats, setStats] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hearers');
  const [selectedYear, setSelectedYear] = useState(2026);
  const navigate = useNavigate();

  useEffect(() => {
const fetchData = async () => {
  try {
    const [statsRes, missionsRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_SERVER_URL}/api/stats/all`),

    ]);

 
    const statsData = statsRes.data[0]?.stats || {
      hearers: 0,
      decisions: 0,
      baptized: 0,
      disciples: 0,
      houseChurches: 0,
      targetAreas: 0
    };
    
    setStats(statsData); 
    setMissions(missionsRes.data);
  } catch (error) {

  } finally {
    setLoading(false);
  }
};
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-['Kanit']">
      <header className="mb-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-[#00a3ff] rounded-full" />
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Thailand Mission Overview
            </h1>
          </div>
          <p className="text-slate-500 text-lg font-light ml-5">
            สรุปข้อมูลสถิติพันธกิจคริสตจักรและการช่วยเหลือทั่วประเทศไทย
          </p>
        </motion.div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats Cards */}
        <div className="lg:col-span-1 space-y-4">
          {loading ? (
            <div className="h-full flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#00a3ff]" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <StatCard 
                title="Hearers (ผู้รับฟัง)" 
                value={stats?.hearers} 
                icon={Users} 
                color="text-blue-500" 
                delay={0.1}
                isActive={activeTab === 'hearers'}
                onClick={() => setActiveTab('hearers')}
              />
              <StatCard 
                title="Decisions (ผู้ตัดสินใจ)" 
                value={stats?.decisions} 
                icon={Heart} 
                color="text-rose-500" 
                delay={0.2}
                isActive={activeTab === 'decisions'}
                onClick={() => setActiveTab('decisions')}
              />
              <StatCard 
                title="Baptized (รับบัพติศมา)" 
                value={stats?.baptized} 
                icon={Waves} 
                color="text-cyan-500" 
                delay={0.3}
                isActive={activeTab === 'baptized'}
                onClick={() => setActiveTab('baptized')}
              />
              <StatCard 
                title="Disciples (สาวก)" 
                value={stats?.disciples} 
                icon={UserCheck} 
                color="text-emerald-500" 
                delay={0.4}
                isActive={activeTab === 'disciples'}
                onClick={() => setActiveTab('disciples')}
              />
              <StatCard 
                title="House Churches (คริสตจักรบ้าน)" 
                value={stats?.houseChurches} 
                icon={Home} 
                color="text-indigo-500" 
                delay={0.5}
                isActive={activeTab === 'houseChurches'}
                onClick={() => setActiveTab('houseChurches')}
              />
              <StatCard 
                title="Target Areas (พื้นที่เป้าหมาย)" 
                value={stats?.targetAreas} 
                icon={Target} 
                color="text-amber-500" 
                delay={0.6}
                isActive={activeTab === 'targetAreas'}
                onClick={() => setActiveTab('targetAreas')}
              />
            </div>
          )}
        </div>

        {/* Right Column: Map Visualization */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-4 md:p-8 flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
             <Target size={300} />
          </div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="text-xl font-black text-slate-800">แผนที่สถิติรายจังหวัด</h2>
              <p className="text-slate-400 text-sm">Interactive map showing mission progress</p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {[2024, 2025, 2026].map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    selectedYear === year 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full flex-1 min-h-[500px] relative z-10">
            <ThailandMapDashboard activeCategory={activeTab} selectedYear={selectedYear} />
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-amber-500">
               <Target size={20} />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Tip:</span> คุณสามารถนำเมาส์ไปชี้ที่จังหวัดต่างๆ เพื่อดูรายละเอียดจำนวนผู้รับการช่วยเหลือในแต่ละพื้นที่ได้ทันที
            </p>
          </div>
        </motion.div>
      </div>

      {/* Missions List Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-6 bg-[#00a3ff] rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            รายการพันธกิจทั้งหมด ({missions.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-[#00a3ff]" size={30} />
          </div>
        ) : missions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map(mission => {
              // Map backend data to what MissionCard expects
              const mappedMission = {
                id: mission.id || mission._id,
                title: mission.title,
                thumbnail: mission.image || mission.images?.[0] || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                assignee: { name: 'Foldery Team', avatar: 'https://ui-avatars.com/api/?name=Foldery+Team&background=00a3ff&color=fff' },
                time: mission.createdAt ? new Date(mission.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่',
                location: { name: mission.location?.address || 'ไม่ระบุสถานที่' }
              };

              return (
                <MissionCard 
                  key={mappedMission.id} 
                  mission={mappedMission}
                  onClick={() => navigate(`/mission/${mappedMission.id}`)}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-light">ยังไม่มีข้อมูลพันธกิจในระบบ</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default MissionDashboard;
