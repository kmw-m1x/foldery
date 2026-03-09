import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, ArrowRight, Calendar, MapPin, 
  Globe, Share2, Heart, Users, Droplets, 
  ImageIcon, Tag, CheckCircle2, Clock 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Fix Leaflet Icon ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MissionDetail = () => {
  const { id } = useParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: แปลงวันที่
  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";
    return new Date(dateString).toLocaleDateString('th-TH', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  // Helper: เลือกสี Badge ตามสถานะ
  const getStatusBadge = (status) => {
    switch(status) {
      case 'ongoing': return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><Clock size={12}/> กำลังดำเนินงาน</span>;
      case 'upcoming': return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><Calendar size={12}/> เร็วๆ นี้</span>;
      default: return <span className="flex items-center gap-1 bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-xs font-bold uppercase"><CheckCircle2 size={12}/> เสร็จสิ้น</span>;
    }
  };

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/missions/${id}`);
        setMission(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching mission:", err);
        setLoading(false);
      }
    };
    if (id) fetchMission();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FAFAFA] gap-4">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-[#0071e3] rounded-full animate-spin"></div>
        <span className="text-neutral-500 font-medium animate-pulse">กำลังโหลดข้อมูล...</span>
    </div>
  );

  if (!mission) return <div className="h-screen flex items-center justify-center text-neutral-500">ไม่พบข้อมูลพันธกิจนี้</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-[#1d1d1f] pb-20">
      
      {/* 1. Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="container mx-auto px-4 h-16 flex items-center max-w-4xl">
            <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#0071e3] transition-colors text-sm font-semibold">
                <ArrowLeft size={18} /> ย้อนกลับ
            </Link>
            <span className="mx-4 text-neutral-300">|</span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Mission Detail</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-4xl mt-8">
        
        {/* 2. Header Section */}
        <header className="mb-8">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {getStatusBadge(mission.status)}
                <span className="flex items-center gap-1 bg-blue-50 text-[#0071e3] px-3 py-1 rounded-full text-xs font-bold uppercase">
                    <MapPin size={12} /> {mission.locationName || "ไม่ระบุสถานที่"}
                </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-black text-[#1d1d1f] leading-tight mb-6">
                {mission.mission}
            </h1>

            {/* Author Meta */}
            <div className="flex flex-col md:flex-row items-center gap-6 border-y border-neutral-100 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${mission.user || "User"}&background=random&color=fff`} 
                            alt={mission.user} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#1d1d1f]">{mission.user || "ผู้ประกาศ"}</p>
                        <p className="text-xs text-neutral-500">@{mission.user?.replace(/\s/g, '').toLowerCase() || 'user'}</p>
                    </div>
                </div>

                <div className="hidden md:block w-px h-8 bg-neutral-200"></div>

                <div className="flex items-center gap-6 text-sm text-neutral-500 font-medium">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#0071e3]"/>
                        {formatDate(mission.missionDate)}
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe size={16} className="text-[#0071e3]"/>
                        Public Post
                    </div>
                </div>

                <div className="md:ml-auto flex gap-2">
                    <button className="p-2.5 rounded-full bg-neutral-50 hover:bg-[#0071e3] text-neutral-400 hover:text-white transition-all shadow-sm">
                        <Share2 size={18} />
                    </button>
                    <button className="p-2.5 rounded-full bg-neutral-50 hover:bg-red-500 text-neutral-400 hover:text-white transition-all shadow-sm">
                        <Heart size={18} />
                    </button>
                </div>
            </div>
        </header>

        {/* 3. Hero Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-[24px] shadow-lg mb-10 bg-neutral-100">
            {mission.image ? (
                <img 
                    src={mission.image} 
                    alt={mission.mission} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <ImageIcon size={48} />
                </div>
            )}
        </div>

{/* 4. Stats Section (Premium Box) */}
        {/* เช็คก่อนว่ามีข้อมูลอย่างน้อย 1 ตัวไหม ถ้าไม่มีสักตัว ซ่อนทั้งแถบเลย */}
        {(mission.receivedCount > 0 || mission.baptizedCount > 0) && (
            <div className="grid grid-cols-2 gap-4 mb-10">
                
                {/* กล่องคนรับเชื่อ: ถ้า > 0 ค่อยโชว์ */}
                {mission.receivedCount > 0 && (
                    <div className="bg-[#F5F5F7] p-6 rounded-[20px] text-center border border-white shadow-sm">
                        <div className="flex justify-center mb-2">
                            <div className="w-10 h-10 bg-blue-100 text-[#0071e3] rounded-full flex items-center justify-center">
                                <Users size={20} />
                            </div>
                        </div>
                        <span className="block text-3xl font-black text-[#1d1d1f]">{mission.receivedCount}</span>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">คนรับเชื่อ (Souls)</span>
                    </div>
                )}

                {/* กล่องบัพติศมา: ถ้า > 0 ค่อยโชว์ */}
                {mission.baptizedCount > 0 && (
                    <div className="bg-[#F5F5F7] p-6 rounded-[20px] text-center border border-white shadow-sm">
                        <div className="flex justify-center mb-2">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                                <Droplets size={20} />
                            </div>
                        </div>
                        <span className="block text-3xl font-black text-[#1d1d1f]">{mission.baptizedCount}</span>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">บัพติสมา (Baptized)</span>
                    </div>
                )}
            </div>
        )}

        {/* 5. Main Content (Description) */}
        <article className="prose prose-lg prose-neutral max-w-none mb-12">
            <h3 className="text-2xl font-bold mb-4">รายละเอียดพันธกิจ</h3>
            {/* whitespace-pre-line ทำให้เว้นบรรทัดตาม Database */}
            <p className="whitespace-pre-line text-lg text-neutral-600 leading-relaxed">
               {mission.description || "ยังไม่มีรายละเอียดเพิ่มเติมสำหรับพันธกิจนี้..."}
            </p>
        </article>

        {/* 6. Photo Gallery (ถ้ามี) */}
        {mission.gallery && mission.gallery.length > 0 && (
            <div className="mb-12">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ImageIcon size={20} className="text-[#0071e3]" /> ภาพบรรยากาศเพิ่มเติม
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mission.gallery.map((imgUrl, index) => (
                        <div key={index} className="aspect-square rounded-[16px] overflow-hidden bg-neutral-100 cursor-pointer hover:opacity-90 transition-opacity">
                            <img src={imgUrl} alt={`gallery-${index}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 7. Tags */}
        {mission.tags && mission.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-neutral-100">
                {mission.tags.map((tag, idx) => (
                    <span key={idx} className="flex items-center gap-1 bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#0071e3] hover:text-white transition-colors cursor-pointer">
                        <Tag size={12} /> {tag}
                    </span>
                ))}
            </div>
        )}

        {/* 8. Map Location */}
        {mission.lat && mission.lng && (
            <div className="mb-12">
                <h3 className="text-xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                    <MapPin className="text-[#0071e3]"/> พิกัดการประกาศ
                </h3>
                <div className="h-[350px] w-full rounded-[24px] overflow-hidden shadow-sm border border-neutral-200 relative z-0">
                    <MapContainer 
                        center={[mission.lat, mission.lng]} 
                        zoom={15} 
                        scrollWheelZoom={false} 
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[mission.lat, mission.lng]}>
                            <Popup className="font-sans font-bold">{mission.locationName}</Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <div className="mt-4 text-center">
                    <a 
                        href={`http://maps.google.com/maps?q=${mission.lat},${mission.lng}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#0071e3] hover:underline bg-blue-50 px-4 py-2 rounded-full"
                    >
                        เปิดใน Google Maps <ArrowRight size={14}/>
                    </a>
                </div>
            </div>
        )}

        {/* 9. Footer CTA */}
        <div className="bg-[#1d1d1f] rounded-[24px] p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-3">ร่วมขับเคลื่อนพันธกิจนี้</h4>
                <p className="text-neutral-400 mb-6 max-w-lg mx-auto">
                    ทุกการถวายและการอธิษฐานของคุณ มีส่วนช่วยให้ข่าวประเสริฐไปถึงผู้คนมากยิ่งขึ้น
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-lg shadow-blue-500/30">
                        ถวายทรัพย์สนับสนุน
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold transition-colors backdrop-blur-md">
                        ติดต่อทีมงาน
                    </button>
                </div>
            </div>
            {/* Decor */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#0071e3]/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
        </div>

      </div>
    </div>
  );
};

export default MissionDetail;