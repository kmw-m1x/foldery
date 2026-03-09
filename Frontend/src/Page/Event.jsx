import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, MapPin, Clock, ArrowRight, Search, Loader2, Tag 
} from "lucide-react";
import axios from "axios"; 
import { useTranslation } from "react-i18next";


// --- Helper Function ---
const formatDate = (dateString) => {
  if (!dateString) return "TBA";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' });
};

// --- Status Color Helper ---
const getStatusBadge = (status) => {
  switch (status) {
    case 'upcoming': return { color: 'bg-blue-500', text: 'Upcoming' };
    case 'ongoing': return { color: 'bg-emerald-500', text: 'Now' };
    case 'completed': return { color: 'bg-slate-500', text: 'Ended' };
    case 'cancelled': return { color: 'bg-red-500', text: 'Cancelled' };
    default: return { color: 'bg-blue-500', text: status };
  }
};

const Events = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Community", "Camp", "Service", "Worship", "Workshop"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/events");
        // Sort: เอาวันที่ใกล้ถึงที่สุดขึ้นก่อน (Upcoming First)
        const sortedEvents = res.data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setEvents(sortedEvents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Unable to load events. Please try again later.");
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = selectedCategory === "All" 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50  text-slate-800 pb-24">
      
      {/* 1. Header Section */}
      <section className="pt-32 pb-16 px-6 bg-white rounded-b-[3rem] shadow-sm mb-12">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">
              {t("e.topic")}
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
              {t("e.header")} <span className="text-blue-600">{t("e.header2")}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed" style={{ fontFamily: '"Give You Glory", cursive' }}>
              {t("e.description")}
            </p>
          </motion.div>

          {/* Categories Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-12"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                  ${selectedCategory === cat 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105" 
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"}
                `}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. Events Grid */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <Loader2 size={48} className="animate-spin mb-4 text-blue-500" />
            <p className="font-medium">Fetching upcoming events...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500 bg-red-50 rounded-2xl border border-red-100 max-w-lg mx-auto">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredEvents.map((event) => {
                  const statusInfo = getStatusBadge(event.status);
                  const isCancelled = event.status === 'cancelled';

                  return (
                    <Link to={`/events/${event._id}`} key={event._id} className="block h-full">
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative"
                      >
                        {/* Image Wrapper */}
                        <div className="h-60 overflow-hidden relative bg-slate-100">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isCancelled ? 'grayscale opacity-70' : ''}`}
                            loading="lazy"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex gap-2">
                             <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1 shadow-sm">
                                <Tag size={12} className="text-blue-600"/>
                                {event.category}
                             </div>
                          </div>

                          {/* Status Badge (ถ้าไม่ใช่ upcoming) */}
                          {event.status !== 'upcoming' && (
                             <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wide shadow-md ${statusInfo.color}`}>
                               {statusInfo.text}
                             </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-7 flex flex-col flex-1">
                          
                          {/* Date & Time Row */}
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-blue-600 mb-4 bg-blue-50/50 p-2 rounded-lg w-fit">
                            <div className="flex items-center gap-1.5">
                               <Calendar size={14} />
                               <span>{formatDate(event.startDate)}</span>
                            </div>
                            {event.displayTime && (
                                <>
                                  <div className="w-1 h-1 rounded-full bg-blue-300"></div>
                                  <div className="flex items-center gap-1.5 text-slate-500">
                                      <Clock size={14} />
                                      <span>{event.displayTime}</span>
                                  </div>
                                </>
                            )}
                          </div>
                          
                          <h3 className={`text-xl font-bold mb-3 line-clamp-2 transition-colors ${isCancelled ? 'text-slate-400 line-through decoration-slate-400' : 'text-slate-900 group-hover:text-blue-600'}`}>
                            {event.title}
                          </h3>
                          
                          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-1 font-light">
                            {event.desc}
                          </p>

                          {/* Location & Action */}
                          <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium max-w-[70%]">
                              <MapPin size={16} className="shrink-0 text-slate-300" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                ${isCancelled 
                                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                                    : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 shadow-sm'
                                }
                            `}>
                              <ArrowRight size={18} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-24 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                <Search size={48} className="mx-auto mb-4 opacity-30 text-blue-300" />
                <p className="text-lg font-medium text-slate-600">No events found in "{selectedCategory}".</p>
                <button onClick={() => setSelectedCategory("All")} className="mt-4 text-blue-600 font-bold hover:underline text-sm">
                    View all events
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;