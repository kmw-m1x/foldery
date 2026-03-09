import React from 'react';
import { UserCheck, Droplets, TrendingUp } from 'lucide-react';

const MissionStats = ({ received = 0, baptized = 0 }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      
      {/* Widget 1: Received (Blue Theme) */}
      <div className="relative overflow-hidden rounded-[26px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:scale-[1.03] transition-transform duration-300 group">
         {/* Background Decoration */}
         <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-50 opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
         
         <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-start justify-between">
               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[#0071e3]">
                  <UserCheck size={20} />
               </div>
               {/* Small Indicator */}
               <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                  <TrendingUp size={10} /> +12%
               </div>
            </div>
            
            <div className="mt-4">
               <h3 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">{received.toLocaleString()}</h3>
               <span className="text-[13px] font-medium text-neutral-500">New Believers</span>
            </div>
         </div>
      </div>

      {/* Widget 2: Baptized (Indigo Theme) */}
      <div className="relative overflow-hidden rounded-[26px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:scale-[1.03] transition-transform duration-300 group">
         {/* Background Decoration */}
         <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-50 opacity-50 group-hover:scale-125 transition-transform duration-500"></div>

         <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-start justify-between">
               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Droplets size={20} />
               </div>
               <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                  <TrendingUp size={10} /> +5%
               </div>
            </div>
            
            <div className="mt-4">
               <h3 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">{baptized.toLocaleString()}</h3>
               <span className="text-[13px] font-medium text-neutral-500">Baptized Souls</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default MissionStats;