import React from 'react';
import { Clock, MapPin, ChevronRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

const MissionCard = ({ mission, onClick, isActive }) => {
  const { title, thumbnail, assignee, time, location } = mission;

  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -4 }} // ลอยขึ้นนิดนึงตอน Hover
      whileTap={{ scale: 0.99 }}
      className={`
        group relative flex w-full cursor-pointer overflow-hidden rounded-[24px] bg-white 
        transition-all duration-500 ease-out h-[200px] /* เพิ่มความสูงอีกนิดให้ดูโปร่ง */
        border border-neutral-100/50
        ${isActive 
           ? 'ring-[2px] ring-[#0071e3] shadow-[0_24px_48px_-12px_rgba(0,113,227,0.25)]' 
           : 'shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)]'
        }
      `}
    >
      
      {/* 1. IMAGE SECTION (Left) */}
      <div className="relative h-full w-[35%] min-w-[150px] shrink-0 overflow-hidden">
         {/* Background Image */}
         <img 
           src={thumbnail} 
           alt={title} 
           className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
         />
         
         {/* Dark Gradient Overlay (ทำให้ตัวหนังสือขาวอ่านง่าย) */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
         
         {/* Glass Badge: Location & Time */}
         <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1">
             <div className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
                    <MapPin size={10} />
                </div>
                <span className="text-[11px] font-medium text-white/90 truncate shadow-sm">{location?.name || 'Unknown'}</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
                    <Clock size={10} />
                </div>
                <span className="text-[11px] font-medium text-white/90 shadow-sm">{time}</span>
             </div>
         </div>
      </div>

      {/* 2. CONTENT SECTION (Right) */}
      <div className="relative flex flex-1 flex-col p-6 bg-gradient-to-br from-white to-neutral-50/80 backdrop-blur-sm">
         
         {/* Top: ID & Action */}
         <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1 rounded-md bg-neutral-100">
                REF: #{String(mission.id).slice(-4)}
            </span>
            <div className="h-8 w-8 rounded-full bg-neutral-100/80 flex items-center justify-center text-neutral-400 group-hover:bg-[#0071e3] group-hover:text-white transition-all duration-300">
                <ChevronRight size={16} />
            </div>
         </div>

         {/* Title (Hero) */}
         <h3 className="text-[22px] font-extrabold leading-tight text-[#1d1d1f] tracking-tight line-clamp-2 group-hover:text-[#0071e3] transition-colors duration-300">
           {title}
         </h3>

         {/* Bottom: Assignee Profile (Premium Look) */}
         <div className="mt-auto pt-5 flex items-center gap-4 border-t border-neutral-100">
            <div className="relative">
                <div className="h-11 w-11 rounded-full p-0.5 bg-gradient-to-tr from-neutral-200 to-neutral-100 shadow-sm">
                   <img src={assignee?.avatar} alt={assignee?.name} className="h-full w-full rounded-full object-cover border-2 border-white" />
                </div>
                {/* Status Indicator */}
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></div>
            </div>
            <div>
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                   <User size={10} /> Missionary
                </span>
                <span className="block text-[14px] font-bold text-[#1d1d1f]">{assignee?.name}</span>
            </div>
         </div>
         
         {/* Decorative Glass Shine effect on hover */}
         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ mixBlendMode: 'overlay' }}></div>

      </div>
    </motion.div>
  );
};

export default MissionCard;