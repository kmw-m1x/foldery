import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { 
  Users, BookOpen, Droplets, UserCheck, Home, MapPin, Megaphone, Activity, Clock
} from 'lucide-react';

export default function AdminHome() {
  // State เก็บข้อมูลสถิติ
  const [stats, setStats] = useState({
    hearers: 0,
    targetAreas: 0,
    decisions: 0,
    baptized: 0,
    disciples: 0,
    houseChurches: 0
  });
  
  const [loading, setLoading] = useState(true);

  // --- 1. LOGIC การดึงข้อมูล ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/stats/all");
        
        // ดึงข้อมูลมา
        const dataFromApi = res.data[0]?.stats || {};

        // ⚠️ จุดแก้: Merge ข้อมูลจาก API เข้ากับ Default 0
        // เพื่อกันไม่ให้ค่าไหนเป็น undefined ถ้า Backend ไม่ส่งมา
        setStats({
          hearers: dataFromApi.hearers || 0,
          targetAreas: dataFromApi.targetAreas || 0,
          decisions: dataFromApi.decisions || 0,
          baptized: dataFromApi.baptized || 0,
          disciples: dataFromApi.disciples || 0,
          houseChurches: dataFromApi.houseChurches || 0
        });

      } catch (error) {
        console.error("ดึงข้อมูลไม่มา:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ข้อมูลกราฟจำลอง
  const chartData = [
    { name: 'Jan', uv: 2000 },
    { name: 'Feb', uv: 3000 },
    { name: 'Mar', uv: 2500 },
    { name: 'Apr', uv: 4000 },
    { name: 'May', uv: 3500 },
    { name: 'Jun', uv: 4500 },
    { name: 'Jul', uv: 5000 },
  ];

  // --- 2. CONFIG การ์ด 6 ใบ ---
  const statCards = [
    { title: 'ผู้ได้ยิน (Hearers)', value: stats.hearers, icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'พื้นที่เป้าหมาย (Target Areas)', value: stats.targetAreas, icon: MapPin, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'ตัดสินใจเชื่อ (Decisions)', value: stats.decisions, icon: BookOpen, color: 'text-pink-600', bg: 'bg-pink-50' },
    { title: 'รับบัพติสมา (Baptized)', value: stats.baptized, icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { title: 'สร้างสาวก (Disciples)', value: stats.disciples, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'คริสตจักรบ้าน (House Churches)', value: stats.houseChurches, icon: Home, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full justify-center items-center text-gray-400">
        <Activity className="animate-spin mr-2" /> กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-[#15283c]">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1 text-sm">ภาพรวมสถิติพันธกิจทั้งหมด (Real-time)</p>
        </div>
        <div className="text-xs font-bold bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-500 shadow-sm flex items-center gap-1">
          <Clock size={12} /> Live Data
        </div>
      </div>

      {/* --- STATS CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {statCards.map((item, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-lg transition-all duration-300 relative overflow-hidden group border border-transparent hover:border-gray-100"
          >
            <div className="flex justify-between items-start z-10 relative">
              <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{item.title}</h3>
                <span className="text-4xl font-black text-slate-700 group-hover:text-[#15283c] transition-colors">
                  {/* ✅ แก้ตรงนี้: ใส่ ( || 0 ) กันไว้ ถ้า value เป็น undefined ให้ใช้ 0 */}
                  {(item.value || 0).toLocaleString()}
                </span>
              </div>
              <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                <item.icon size={24} />
              </div>
            </div>
            
            {/* เส้นสีตกแต่งด้านล่าง */}
            <div className={`absolute bottom-0 left-0 h-1.5 w-full ${item.color.replace('text', 'bg')} opacity-80`} />
          </div>
        ))}
      </div>

      {/* --- CHART SECTION --- */}
      <div className="bg-white p-8 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-50">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold text-[#15283c] flex items-center gap-2">
              <Activity size={18} className="text-blue-500" /> Growth Trend
            </h3>
            <p className="text-sm text-gray-400">อัตราการเติบโตของพันธกิจ (จำลอง)</p>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, dy: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="uv" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorUv)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#15283c' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}