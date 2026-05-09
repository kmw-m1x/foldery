import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  Calendar, MapPin, Clock, ArrowLeft, Loader2, Map as MapIcon, Share2, ExternalLink
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // ✅ Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- 🔧 Fix Leaflet Icon (แก้ปัญหารูปหมุดไม่ขึ้น) ---
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

// --- Helper: จัดรูปแบบวันที่ ---
const formatDateFull = (dateString) => {
  if (!dateString) return "TBA";
  return new Date(dateString).toLocaleDateString("en-GB", { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/events/${id}`);
        setEvent(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  if (!event) return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold">ไม่พบข้อมูลกิจกรรม</div>;

  // สร้างลิงค์ Google Maps
  const mapLink = event.coordinates?.lat 
    ? `https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location + " " + (event.address || ""))}`;

  // เช็คว่ามีพิกัดไหม (เพื่อโชว์ Mini Map)
  const hasCoordinates = event.coordinates?.lat && event.coordinates?.lng;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800">
      
      {/* 1. Hero Image Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className={`w-full h-full object-cover ${event.status === 'cancelled' ? 'grayscale' : ''}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        {/* Nav Bar */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
          <Link to="/events" className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-slate-900 transition-all border border-white/10 shadow-lg">
            <ArrowLeft size={24} />
          </Link>
          {event.status !== 'upcoming' && (
             <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg
                ${event.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'}
             `}>
               {event.status}
             </span>
          )}
        </div>

        {/* Title & Info */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-4">
               <span className="px-3 py-1 bg-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md">
                 {event.category}
               </span>
            </div>
            
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight drop-shadow-lg ${event.status === 'cancelled' ? 'line-through opacity-70' : ''}`}>
              {event.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 md:gap-8 text-sm md:text-base font-medium text-blue-50/90 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 inline-flex">
                <div className="flex items-center gap-2">
                    <Calendar className="text-blue-400" size={20}/> 
                    <span>{formatDateFull(event.startDate)}</span>
                </div>
                {event.displayTime && (
                    <div className="flex items-center gap-2 border-l border-white/20 pl-4">
                        <Clock className="text-blue-400" size={20}/> 
                        <span>{event.displayTime}</span>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="container mx-auto max-w-5xl px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row gap-12">
            
            {/* Left: Detail */}
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    About this Event
                    <div className="h-1 w-10 bg-blue-500 rounded-full mt-1"></div>
                </h2>
                
                <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line font-light">
                  {event.detail}
                </p>

                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-3">
                    <span className="text-sm text-slate-400">Share this event:</span>
                    <button className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Share2 size={16} />
                    </button>
                </div>
            </div>

            {/* Right: Sidebar Info */}
            <div className="w-full lg:w-[350px] shrink-0">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-24">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MapIcon size={18} className="text-blue-600"/> Location
                    </h3>

                    {/* ✅✅✅ Mini Map Section ✅✅✅ */}
                    {hasCoordinates && (
                      <div className="h-48 w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 mb-4 relative z-0">
                        <MapContainer 
                          center={[event.coordinates.lat, event.coordinates.lng]} 
                          zoom={13} 
                          scrollWheelZoom={false} // ปิด Scroll เมาส์กันคนรำคาญ
                          style={{ height: '100%', width: '100%' }}
                          className="z-0"
                        >
                          <TileLayer
                            attribution='&copy; Google Maps'
                            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                          />
                          <Marker position={[event.coordinates.lat, event.coordinates.lng]}>
                            <Popup>{event.location}</Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 mb-6 text-slate-600">
                        <MapPin className="text-blue-600 shrink-0 mt-1" size={20} />
                        <div>
                            <p className="font-bold text-slate-800">{event.location}</p>
                            {event.address && <p className="text-sm mt-1 text-slate-500">{event.address}</p>}
                        </div>
                    </div>

                    <a 
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm group"
                    >
                        <ExternalLink size={18} className="group-hover:scale-110 transition-transform"/> 
                        Open in Google Maps
                    </a>

                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;