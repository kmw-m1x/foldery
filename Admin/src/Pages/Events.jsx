import React, { useState } from 'react';

// ข้อมูลจำลอง (เดี๋ยวมึงค่อยไปดึงจาก API /api/events ที่ทำไว้แทนนะ)
const mockEvents = [
  {
    id: 1,
    title: "นมัสการพระเจ้าเช้าวันอาทิตย์",
    date: "24 Dec 2025",
    time: "09:00 - 12:00",
    location: "Main Sanctuary Hall",
    category: "Worship",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop",
    description: "ร่วมรมนมัสการและรับฟังพระวจนะ เพื่อเติมเต็มจิตวิญญาณในเช้าวันอาทิตย์"
  },
  {
    id: 2,
    title: "ค่ายอาสาพัฒนาชุมชน",
    date: "15 Jan 2026",
    time: "08:00 - 17:00",
    location: "โรงเรียนบ้านหนองนา",
    category: "Outreach",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
    description: "กิจกรรมทาสีรั้วและมอบอุปกรณ์การเรียนให้น้องๆ ในพื้นที่ห่างไกล"
  },
  {
    id: 3,
    title: "กลุ่มเซลล์ศุกร์หรรษา",
    date: "29 Dec 2025",
    time: "18:30 - 20:30",
    location: "Cafe Amazon (Meeting Room)",
    category: "Fellowship",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2064&auto=format&fit=crop",
    description: "พูดคุยหนุนใจและแบ่งปันประสบการณ์ชีวิตในบรรยากาศเป็นกันเอง"
  },
  {
    id: 4,
    title: "Youth Night: คืนพลังคนรุ่นใหม่",
    date: "05 Jan 2026",
    time: "19:00 - 21:00",
    location: "Youth Hall",
    category: "Youth",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
    description: "ดนตรีสด เกมสนุกๆ และข้อคิดดีๆ สำหรับวัยรุ่นโดยเฉพาะ"
  }
];

const Events = () => {
  const [filter, setFilter] = useState('All');

  // กรองข้อมูลตามหมวดหมู่
  const filteredEvents = filter === 'All' 
    ? mockEvents 
    : mockEvents.filter(event => event.category === filter);

  // ปุ่มหมวดหมู่
  const categories = ['All', 'Worship', 'Outreach', 'Fellowship', 'Youth'];

  return (
    <div className="bg-[#f9f7f2] min-h-screen pb-12"> {/* พื้นหลังขาวนวลนิดๆ ตัดกับ Layout หลัก */}
      
      {/* === 1. Header Section === */}
      <section className="bg-[#33691e] text-white py-16 px-6 text-center rounded-b-[3rem] shadow-lg mb-10">
        <h1 className="text-4xl font-bold mb-4">ปฏิทินกิจกรรม</h1>
        <p className="text-[#ece4d4] text-lg max-w-2xl mx-auto">
          ติดตามข่าวสารและกิจกรรมล่าสุดของเรา เพื่อที่คุณจะไม่พลาดทุกช่วงเวลาสำคัญ
        </p>
      </section>

      <div className="container mx-auto px-4">
        
        {/* === 2. Filter Bar (ปุ่มเลือกหมวดหมู่) === */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition shadow-sm
                ${filter === cat 
                  ? 'bg-[#ffc857] text-[#33691e] scale-105' // Active State: สีทอง
                  : 'bg-white text-gray-600 hover:bg-[#ece4d4]' // Inactive State: สีขาว
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* === 3. Events Grid (รายการกิจกรรม) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group border border-gray-100 flex flex-col h-full">
              
              {/* Image with Date Badge */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-center shadow text-[#33691e] font-bold text-sm">
                  {event.date}
                </div>
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-[#ffc857] text-[#33691e] text-xs font-bold px-3 py-1 rounded-full shadow">
                  {event.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#33691e] mb-3 line-clamp-2">
                  {event.title}
                </h3>
                
                {/* Info (Time & Location) */}
                <div className="text-sm text-gray-500 mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span>🕒</span> {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span> {event.location}
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                  {event.description}
                </p>

                {/* Button */}
                <button className="w-full border-2 border-[#33691e] text-[#33691e] font-bold py-2 rounded-xl hover:bg-[#33691e] hover:text-[#ffc857] transition">
                  ดูรายละเอียด / ลงทะเบียน
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ถ้าไม่มีข้อมูลโชว์อันนี้ */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">ยังไม่มีกิจกรรมในหมวดหมู่นี้ครับ</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Events;