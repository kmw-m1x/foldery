import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, ArrowRight, Calendar, MapPin, 
  Globe, Share2, Heart, Users, Droplets, 
  ImageIcon, Tag, CheckCircle2, Clock, Map as MapIcon, ExternalLink
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

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/missions/${id}`);
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

  const hasCoordinates = mission.location?.lat && mission.location?.lng;
  const mainImage = mission.images?.[0] || null;

  return (
    <div className="min-h-screen bg-white font-sans text-[#1d1d1f] pb-20">
      
      {/* 1. Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="container mx-auto px-4 h-16 flex items-center max-w-4xl">
            <Link to="/mission" className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#0071e3] transition-colors text-sm font-semibold">
                <ArrowLeft size={18} /> ย้อนกลับ
            </Link>
            <span className="mx-4 text-neutral-300">|</span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Mission Detail</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-4xl mt-8">
        
        {/* 2. Header Section */}
        <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${mission.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    <CheckCircle2 size={12}/> {mission.status}
                </span>
                {mission.isTargetArea && (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                        <Tag size={12} /> Target Area
                    </span>
                )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-[#1d1d1f] leading-tight mb-6 tracking-tight">
                {mission.title}
            </h1>

            <div className="flex flex-col md:flex-row items-center gap-6 border-y border-neutral-100 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        FP
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#1d1d1f]">Foldery Team</p>
                        <p className="text-xs text-neutral-500">Official Mission Update</p>
                    </div>
                </div>

                <div className="hidden md:block w-px h-8 bg-neutral-200"></div>

                <div className="flex items-center gap-6 text-sm text-neutral-500 font-medium">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#0071e3]"/>
                        {formatDate(mission.createdAt)}
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#0071e3]"/>
                        {mission.location?.address || "ไม่ระบุสถานที่"}
                    </div>
                </div>
            </div>
        </header>

        {/* 3. Hero Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-[24px] shadow-lg mb-10 bg-neutral-100 border border-neutral-200">
            {mainImage ? (
                <img 
                    src={mainImage} 
                    alt={mission.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <ImageIcon size={48} />
                </div>
            )}
        </div>

        {/* 4. Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-[#F5F5F7] p-5 rounded-[20px] border border-white shadow-sm text-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2"><Users size={16}/></div>
                <span className="block text-2xl font-black text-[#1d1d1f]">{mission.stats?.hearers || 0}</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Hearers</span>
            </div>
            <div className="bg-[#F5F5F7] p-5 rounded-[20px] border border-white shadow-sm text-center">
                <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mx-auto mb-2"><Heart size={16}/></div>
                <span className="block text-2xl font-black text-[#1d1d1f]">{mission.stats?.decisions || 0}</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Decisions</span>
            </div>
            <div className="bg-[#F5F5F7] p-5 rounded-[20px] border border-white shadow-sm text-center">
                <div className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-2"><Droplets size={16}/></div>
                <span className="block text-2xl font-black text-[#1d1d1f]">{mission.stats?.baptized || 0}</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Baptized</span>
            </div>
            <div className="bg-[#F5F5F7] p-5 rounded-[20px] border border-white shadow-sm text-center">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2"><Users size={16}/></div>
                <span className="block text-2xl font-black text-[#1d1d1f]">{mission.stats?.disciples || 0}</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Disciples</span>
            </div>
        </div>

        {/* 5. Content */}
        <article className="prose prose-lg prose-neutral max-w-none mb-12">
            <h3 className="text-2xl font-bold mb-4">รายละเอียดพันธกิจ</h3>
            <p className="whitespace-pre-line text-lg text-neutral-600 leading-relaxed font-light">
               {mission.description || "ยังไม่มีรายละเอียดเพิ่มเติมสำหรับพันธกิจนี้..."}
            </p>
        </article>

        {/* 6. Map */}
        {hasCoordinates && (
            <div className="mb-12">
                <h3 className="text-xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                    <MapIcon className="text-[#0071e3]" size={20}/> พิกัดที่ตั้ง
                </h3>
                <div className="h-[350px] w-full rounded-[24px] overflow-hidden shadow-sm border border-neutral-200 relative z-0">
                    <MapContainer 
                        center={[mission.location.lat, mission.location.lng]} 
                        zoom={15} 
                        scrollWheelZoom={false} 
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[mission.location.lat, mission.location.lng]}>
                            <Popup className="font-sans font-bold">{mission.location.address}</Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <div className="mt-4 text-center">
                    <a 
                        href={`http://maps.google.com/maps?q=${mission.location.lat},${mission.location.lng}`}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#0071e3] hover:underline bg-blue-50 px-5 py-2.5 rounded-full transition-all"
                    >
                        Open in Google Maps <ExternalLink size={14}/>
                    </a>
                </div>
            </div>
        )}

        {/* 7. CTA */}
        <div className="bg-[#1d1d1f] rounded-[24px] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-3 tracking-tight">ร่วมขับเคลื่อนพันธกิจธารพระพร</h4>
                <p className="text-neutral-400 mb-8 max-w-lg mx-auto font-light leading-relaxed">
                    ทุกการถวายและการอธิษฐานของคุณ มีส่วนช่วยให้ข่าวประเสริฐไปถึงผู้คนและสร้างสาวกในพื้นที่เป้าหมาย
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/giving" className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-8 py-3.5 rounded-full font-bold transition-transform hover:scale-105 shadow-lg shadow-blue-500/30">
                        ถวายทรัพย์สนับสนุน
                    </Link>
                    <Link to="/contact" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-bold transition-colors backdrop-blur-md border border-white/10">
                        ติดต่อสอบถาม
                    </Link>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#0071e3]/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
        </div>

      </div>
    </div>
  );
};

export default MissionDetail;