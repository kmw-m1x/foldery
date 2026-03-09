import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ 1. เพิ่ม import นี้
import { Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'; 

import MissionMap from '../Components/MissionMap';
import MissionCard from '../Components/MissionCard'; 
import MissionStats from '../Components/MissionStats'; 

// --- 🏛️ Blog Layout Styles ---
const styles = {
  container: "min-h-screen bg-[#FAFAFA] text-[#1d1d1f] font-sans pb-20",
  mainWrapper: "max-w-6xl mx-auto px-4 lg:px-0 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10",
  leftContent: "lg:col-span-8 flex flex-col gap-8",
  sidebar: "lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8 h-fit",
};

const MissionDashboard = () => {
  const navigate = useNavigate(); // ✅ 2. เรียกใช้ Hook สำหรับเปลี่ยนหน้า
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapState, setMapState] = useState({ center: [13.7563, 100.5018], zoom: 5 });

  // --- 🧠 Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/api/missions');
        const formattedData = response.data.map((item) => ({
            id: item._id,            
            title: item.mission,     
            thumbnail: item.image || `https://source.unsplash.com/random/800x600/?church,people&sig=${item._id}`, 
            time: formatDate(item.missionDate || item.createdAt), 
            assignee: {
                name: item.user || "ผู้ประกาศ",    
                avatar: `https://ui-avatars.com/api/?name=${item.user || "User"}&background=random` 
            },
            location: { 
                lat: parseFloat(item.lat), 
                lng: parseFloat(item.lng), 
                name: item.locationName || "ไม่ระบุพิกัด" 
            },
            stats: {
                received: item.receivedCount || 0, 
                baptized: item.baptizedCount || 0
            }
        }));
        setMissions(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  const totalStats = useMemo(() => {
    return missions.reduce((acc, curr) => ({
        received: acc.received + (curr.stats?.received || 0),
        baptized: acc.baptized + (curr.stats?.baptized || 0)
    }), { received: 0, baptized: 0 });
  }, [missions]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMissions = missions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(missions.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // กดเปลี่ยนหน้าแล้วเด้งขึ้นบนให้ด้วย
  };

  // ✅ 3. ฟังก์ชันกดการ์ดแล้วไปหน้า Detail
  const handleCardClick = (id) => {
    navigate(`/mission/${id}`); // เปลี่ยน URL ไปหน้า mission detail
  };

  return (
    <div className={styles.container}>
      
      <main className={styles.mainWrapper}>
         
         {/* === LEFT COLUMN: Blog Feed === */}
         <section className={styles.leftContent}>
            
            {/* Title Section */}
            <div className="border-b border-neutral-200 pb-4 mb-2 flex items-center justify-between">
               <h2 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-2">
                  <Bookmark className="text-[#0071e3]" size={24} />
                  อัปเดตล่าสุด
               </h2>
               <span className="text-sm text-neutral-500 bg-white border border-neutral-200 px-3 py-1 rounded-full shadow-sm">
                  {missions.length} รายการ (หน้า {currentPage}/{totalPages || 1})
               </span>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="py-20 text-center text-neutral-400">กำลังโหลดข้อมูล...</div>
            ) : (
                <div className="flex flex-col gap-6 min-h-[500px]">
                   {currentMissions.length > 0 ? (
                       currentMissions.map((mission, idx) => (
                          <MissionCard 
                            key={mission.id} 
                            mission={mission} 
                            index={idx}
                            onClick={() => handleCardClick(mission.id)} // ✅ 4. ส่งคำสั่ง onClick ให้การ์ด
                          />
                       ))
                   ) : (
                       <div className="text-center py-10 text-neutral-400">ไม่พบข้อมูล</div>
                   )}
                </div>
            )}
            
            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center mt-12 gap-2">
                   <button 
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`h-10 w-10 flex items-center justify-center rounded-full border border-neutral-200 transition-colors
                        ${currentPage === 1 ? 'bg-neutral-50 text-neutral-300 cursor-not-allowed' : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:text-[#0071e3]'}
                      `}
                   >
                      <ChevronLeft size={20} />
                   </button>

                   {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`h-10 w-10 flex items-center justify-center rounded-full font-bold transition-all
                           ${currentPage === i + 1 
                              ? 'bg-[#0071e3] text-white shadow-[0_4px_12px_rgba(0,113,227,0.3)] scale-110' 
                              : 'bg-white border border-neutral-200 text-neutral-600 hover:border-[#0071e3] hover:text-[#0071e3]'}
                        `}
                      >
                         {i + 1}
                      </button>
                   ))}

                   <button 
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`h-10 w-10 flex items-center justify-center rounded-full border border-neutral-200 transition-colors
                        ${currentPage === totalPages ? 'bg-neutral-50 text-neutral-300 cursor-not-allowed' : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:text-[#0071e3]'}
                      `}
                   >
                      <ChevronRight size={20} />
                   </button>
                </div>
            )}
         </section>

         {/* === RIGHT COLUMN: Sidebar === */}
         <aside className={styles.sidebar}>
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-neutral-100">
               <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">ภาพรวมพันธกิจ</h3>
               <MissionStats received={totalStats.received} baptized={totalStats.baptized} />
            </div>

            <div className="bg-white p-1 rounded-[24px] shadow-sm border border-neutral-100 overflow-hidden">
               <div className="h-[250px] w-full rounded-[20px] overflow-hidden relative">
                  <MissionMap missions={missions} mapState={mapState} />
                  <div className="absolute bottom-3 left-3 right-3">
                     <button className="w-full bg-white/90 backdrop-blur text-[#1d1d1f] text-xs font-bold py-2 rounded-lg shadow-lg hover:scale-[1.02] transition-transform">
                        เปิดแผนที่เต็ม
                     </button>
                  </div>
               </div>
            </div>
         </aside>

      </main>

      <style jsx global>{`html { scroll-behavior: smooth; }`}</style>
    </div>
  );
};

export default MissionDashboard;