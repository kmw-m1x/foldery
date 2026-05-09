import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, MapPin, ArrowLeft, Loader2, Tag, Info } from 'lucide-react';

const categoryColor = {
  Worship:    { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/20'   },
  Community:  { bg: 'bg-emerald-500/15',text: 'text-emerald-400',border: 'border-emerald-500/20' },
  Camp:       { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/20'  },
  Service:    { bg: 'bg-pink-500/15',   text: 'text-pink-400',   border: 'border-pink-500/20'    },
  Workshop:   { bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-500/20'   },
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1522] flex flex-col items-center justify-center text-[#00a3ff]">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-bold">กำลังโหลดข้อมูลกิจกรรม...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0d1522] flex flex-col items-center justify-center text-slate-400">
        <p className="text-xl font-bold mb-4">ไม่พบกิจกรรม</p>
        <button onClick={() => navigate('/events')} className="text-[#00a3ff] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> กลับไปหน้ารวมกิจกรรม
        </button>
      </div>
    );
  }

  const colors = categoryColor[event.category] ?? categoryColor.Worship;
  const isCancelled = event.status === 'cancelled';

  const formatDateFull = (d) => {
    if (!d) return 'TBA';
    return new Date(d).toLocaleDateString('th-TH', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1522] font-['Kanit'] pb-20">
      
      {/* ─── HERO BANNER ───────────────────────── */}
      <div className="relative h-[40vh] md:h-[55vh] w-full bg-slate-900 overflow-hidden">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title} 
            className={`w-full h-full object-cover opacity-80 ${isCancelled ? 'grayscale' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar size={64} className="text-slate-700" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1522] via-[#0d1522]/60 to-transparent" />
        
        <button 
          onClick={() => navigate('/events')} 
          className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-[#00a3ff] transition-all border border-white/10 shadow-lg z-10"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-6 md:px-12 text-white">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider backdrop-blur-md border ${colors.bg} ${colors.text} ${colors.border}`}>
                {event.category}
              </span>
              {isCancelled && (
                <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                  Cancelled
                </span>
              )}
            </div>
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight drop-shadow-lg ${isCancelled ? 'line-through text-slate-400' : 'text-white'}`}>
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─────────────────────────────── */}
      <div className="container mx-auto max-w-5xl px-6 -mt-8 relative z-10">
        <div className="bg-[#1b2537] border border-white/5 rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-10">
          
          {/* Left: Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <Info className="text-[#00a3ff]" size={24} />
              <h2 className="text-xl font-bold text-white">รายละเอียดกิจกรรม</h2>
            </div>
            
            <p className="text-slate-300 leading-relaxed whitespace-pre-line font-light text-sm md:text-base mb-8">
              {event.detail || event.description || "ไม่มีคำอธิบายเพิ่มเติมสำหรับกิจกรรมนี้"}
            </p>
          </div>

          {/* Right: Meta details */}
          <div className="w-full md:w-80 shrink-0 space-y-4">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
              
              <div className="mb-6">
                <div className="flex items-center gap-3 text-white mb-2">
                  <Calendar className="text-[#00a3ff]" size={20} />
                  <span className="font-bold text-sm">วันที่จัดกิจกรรม</span>
                </div>
                <div className="pl-8 text-slate-400 text-sm">
                  {formatDateFull(event.startDate)}
                  {event.endDate && event.endDate !== event.startDate && (
                    <>
                      <br />ถึง {formatDateFull(event.endDate)}
                    </>
                  )}
                </div>
              </div>

              {event.displayTime && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 text-white mb-2">
                    <Clock className="text-[#f472b6]" size={20} />
                    <span className="font-bold text-sm">เวลา</span>
                  </div>
                  <div className="pl-8 text-slate-400 text-sm">
                    {event.displayTime}
                  </div>
                </div>
              )}

              <div className="mb-2">
                <div className="flex items-center gap-3 text-white mb-2">
                  <MapPin className="text-[#22d3ee]" size={20} />
                  <span className="font-bold text-sm">สถานที่</span>
                </div>
                <div className="pl-8 text-slate-400 text-sm">
                  <p>{event.location}</p>
                  {event.address && <p className="mt-1 text-slate-500 text-xs">{event.address}</p>}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EventDetail;
