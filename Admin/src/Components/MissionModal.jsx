// อย่าลืม import { motion, AnimatePresence } from "framer-motion"; ข้างบนไฟล์ด้วย

const MissionModal = ({ isOpen, onClose, mission, onSave }) => {
  const defaultState = {
    title: "", description: "", status: "Active",
    location: { lat: 0, lng: 0, address: "" },
    stats: { disciples: 0 }, member: 0, isTargetArea: false, images: [""],
  };

  const [formData, setFormData] = useState(defaultState);

  // ... (Logic useEffect และ handleChange เดิม คงไว้เหมือนเดิม) ...
  useEffect(() => {
    if (mission) {
      setFormData({
        ...mission,
        stats: mission.stats || { disciples: 0 },
        location: mission.location || { lat: 0, lng: 0, address: "" },
        images: mission.images || [""],
        member: mission.member || 0
      });
    } else {
      setFormData(defaultState);
    }
  }, [mission, isOpen]); // เพิ่ม isOpen dependency เพื่อรีเซ็ตค่าตอนเปิดใหม่ได้ถูก

  // ... (handleChange และ handleImageChange เดิม) ...
  const handleChange = (e) => { /* ...โค้ดเดิม... */ };
  const handleImageChange = (e) => { /* ...โค้ดเดิม... */ };

  // ❌ ลบบรรทัดนี้: if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border-t-8 overflow-hidden flex flex-col max-h-[90vh]" 
            style={{ borderColor: THEME.darkBlue }}
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }} // แบบนุ่มๆ
          >
            
            {/* Header Modal */}
            <div className="px-6 py-4 flex justify-between items-center text-white" style={{ backgroundColor: THEME.darkBlue }}>
              <h2 className="text-xl font-bold uppercase tracking-wide flex gap-2 items-center">
                {mission ? <Edit size={20} /> : <Plus size={20} />} 
                {mission ? "Edit Mission" : "Add New Mission"}
              </h2>
              <button onClick={onClose} className="hover:text-[#ff5722] transition-colors bg-white/10 p-1.5 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Body Form */}
            {/* ... (ส่วน Body ข้างใน เหมือนเดิมทุกประการ ก๊อปมาวางได้เลย) ... */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
               {/* ... เนื้อหา Form Input ต่างๆ ... */}
               {/* ... (ก๊อปไส้ในจากอันเก่ามาใส่ตรงนี้ได้เลยครับ เพื่อความสั้น) ... */}
               
               {/* ตัวอย่างคร่าวๆ */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#ff5722]" />
                  </div>
                  {/* ... inputs อื่นๆ ... */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#ff5722]">
                        {['Active', 'Expanding', 'New', 'Target Area'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
               </div>
               
               {/* ... ส่วน Location, Stats, Images, etc ... */}
               {/* ... ผมขอละไว้ในฐานที่เข้าใจนะจารย์ เอาอันเดิมมายัดใส่ ... */}
               <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label><textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#ff5722]" /></div>
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-[#15283c] mb-3 flex items-center gap-2 text-sm uppercase"><MapPin size={16}/> Location Data</h3>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                    <div><label className="text-[10px] font-bold text-slate-400 uppercase">Latitude</label><input type="number" name="location.lat" value={formData.location.lat} onChange={handleChange} className="w-full p-2 rounded border border-gray-300 text-sm" /></div>
                    <div><label className="text-[10px] font-bold text-slate-400 uppercase">Longitude</label><input type="number" name="location.lng" value={formData.location.lng} onChange={handleChange} className="w-full p-2 rounded border border-gray-300 text-sm" /></div>
                    </div>
                    <div><label className="text-[10px] font-bold text-slate-400 uppercase">Address</label><input type="text" name="location.address" value={formData.location.address} onChange={handleChange} className="w-full p-2 rounded border border-gray-300 text-sm" /></div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Disciples</label><input type="number" name="stats.disciples" value={formData.stats.disciples} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded focus:border-[#ff5722] text-center font-bold text-[#15283c]" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Member</label><input type="number" name="member" value={formData.member} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded focus:border-[#ff5722] text-center font-bold text-[#15283c]" /></div>
                    <div className="flex items-end pb-2"><label className="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" name="isTargetArea" checked={formData.isTargetArea} onChange={handleChange} className="w-5 h-5 accent-[#ff5722]" /><span className="text-sm font-bold text-[#ff5722]">Is Target Area?</span></label></div>
               </div>
               <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><ImageIcon size={14}/> Image URL</label>
                    <div className="flex gap-2"><input type="text" value={formData.images[0]} onChange={handleImageChange} className="flex-1 p-2 border border-slate-300 rounded text-sm focus:border-[#ff5722]" /><div className="w-12 h-10 bg-slate-100 rounded border overflow-hidden">{formData.images[0] && <img src={formData.images[0]} className="w-full h-full object-cover" />}</div></div>
               </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-medium text-slate-500 hover:bg-slate-200 transition-colors text-sm">Cancel</button>
              <button onClick={() => onSave(formData)} className="px-6 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 shadow-lg transition-all active:scale-95 text-sm" style={{ backgroundColor: THEME.orange }}>
                <Save size={18} /> {mission ? "Update" : "Create"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};