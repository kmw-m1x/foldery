import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, X, Save, Plus, Search, MapPin, Image as ImageIcon, Users, LayoutDashboard, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/axios";
import toast from "react-hot-toast";

// --- Import Map ---
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Config Icon ---
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

const inputCls = "w-full bg-[#0d1522] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00a3ff]/60 transition-all";

// --- Component: Location Picker ---
const LocationPicker = ({ position, onLocationSelect }) => {
  const map = useMap();
  useEffect(() => {
    if (position.lat !== 0 && position.lng !== 0) {
      map.flyTo([position.lat, position.lng], 13);
    }
  }, [position.lat, position.lng, map]);

  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position.lat !== 0 ? <Marker position={[position.lat, position.lng]} /> : null;
};

// --- Component: Delete Modal ---
const DeleteModal = ({ isOpen, onClose, onConfirm, missionTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-['Kanit']">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-[#1b2537] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative z-10">
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mb-4"><AlertTriangle size={32} className="text-red-500" /></div>
              <h3 className="text-xl font-bold text-white">Are you sure?</h3>
              <p className="text-slate-400 mt-2 text-sm">คุณต้องการลบข้อมูล <br/><span className="font-bold text-red-400 text-base">"{missionTitle}"</span> <br/>ใช่หรือไม่? การกระทำนี้กู้คืนไม่ได้!</p>
            </div>
            <div className="p-4 bg-white/5 flex gap-3 border-t border-white/5">
              <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={onConfirm} className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg transition-all active:scale-95">Yes, Delete it!</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Component: Mission Modal ---
const MissionModal = ({ isOpen, onClose, mission, onSave }) => {
  const defaultState = {
    title: "", description: "", status: "Active",
    location: { lat: 0, lng: 0, address: "" },
    stats: { disciples: 0 }, member: 0, isTargetArea: false, images: [""],
  };

  const [formData, setFormData] = useState(defaultState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (mission) {
      setFormData({
        ...mission,
        stats: mission.stats || { disciples: 0 },
        location: mission.location || { lat: 0, lng: 0, address: "" },
        images: mission.images || [""],
        member: mission.member || 0
      });
      setPreview(mission.images?.[0] || "");
    } else {
      setFormData(defaultState);
      setPreview("");
    }
    setSelectedFile(null);
  }, [mission, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === "number" ? Number(value) : value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMapSelect = async (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, lat, lng }
    }));

    try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        if (res.data && res.data.display_name) {
            setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, lat, lng, address: res.data.display_name }
            }));
        }
    } catch (error) {
        console.error("Auto Address Error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-['Kanit']">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div 
            className="bg-[#1b2537] w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh] relative z-10"
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="px-6 py-5 flex justify-between items-center border-b border-white/5 bg-[#0d1522]">
              <h2 className="text-lg font-black text-white flex gap-2 items-center">
                <div className="w-8 h-8 rounded-lg bg-[#00a3ff]/15 flex items-center justify-center text-[#00a3ff]">
                  {mission ? <Edit size={16} /> : <Plus size={16} />} 
                </div>
                {mission ? "Edit Church Stat" : "Add New Church Stat"}
              </h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full"><X size={18} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className={`${inputCls} appearance-none`}>
                    {['Active', 'Expanding', 'New', 'Target Area'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea name="description" rows="2" value={formData.description} onChange={handleChange} className={inputCls} />
              </div>
              
              <div className="bg-[#0d1522] p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase"><MapPin size={16} className="text-[#00a3ff]"/> Location Pin</h3>
                    <div className="text-[10px] text-[#00a3ff] font-mono bg-[#00a3ff]/10 px-2 py-1 rounded-md border border-[#00a3ff]/20">
                        {formData.location?.lat?.toFixed(4) || 0}, {formData.location?.lng?.toFixed(4) || 0}
                    </div>
                </div>
                <div className="w-full h-64 rounded-xl overflow-hidden border border-white/10 mb-3 relative z-0">
                    <MapContainer center={[13.0, 101.5]} zoom={6} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                        <LocationPicker position={formData.location || {lat:0, lng:0}} onLocationSelect={handleMapSelect} />
                    </MapContainer>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Address / Location Name</label>
                    <input type="text" name="location.address" value={formData.location?.address || ""} onChange={handleChange} placeholder="ปักหมุด หรือ พิมพ์ชื่อสถานที่..." className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Disciples</label>
                  <input type="number" name="stats.disciples" value={formData.stats?.disciples || 0} onChange={handleChange} className={`${inputCls} text-center font-black`} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Member</label>
                  <input type="number" name="member" value={formData.member || 0} onChange={handleChange} className={`${inputCls} text-center font-black`} />
                </div>
                <div className="flex items-end pb-1.5">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input type="checkbox" name="isTargetArea" checked={formData.isTargetArea} onChange={handleChange} className="w-5 h-5 rounded border-white/20 bg-[#0d1522] text-[#00a3ff] focus:ring-[#00a3ff]" />
                    <span className="text-sm font-bold text-amber-400">Is Target Area?</span>
                  </label>
                </div>
              </div>
              <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><ImageIcon size={12}/> Mission Image</label>
                   <div className="flex gap-4 items-center">
                     <div className="flex-1">
                       <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors group">
                         <div className="flex flex-col items-center justify-center pt-2">
                           <Plus size={20} className="text-slate-500 group-hover:text-[#00a3ff] mb-1" />
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Upload Photo</p>
                         </div>
                         <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                       </label>
                     </div>
                     <div className="w-24 h-24 bg-[#0d1522] rounded-2xl border border-white/10 overflow-hidden flex-shrink-0 relative group">
                       {preview ? (
                         <>
                           <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[10px] text-white font-black uppercase tracking-tighter">Preview</span>
                           </div>
                         </>
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-slate-700 bg-white/2">
                           <ImageIcon size={24}/>
                         </div>
                       )}
                     </div>
                   </div>
              </div>
            </div>
            <div className="p-4 bg-white/5 border-t border-white/5 flex justify-end gap-3">
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-sm">Cancel</button>
              <button 
                onClick={() => onSave(formData, selectedFile)} 
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-black text-white bg-[#0054a5] hover:bg-[#00a3ff] shadow-[0_0_15px_rgba(0,163,255,0.3)] flex items-center gap-2 transition-all active:scale-95 text-sm disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {mission ? "Update" : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main Page ---
export default function AdminDashboard() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/missions");
      setMissions(res.data);
    } catch (err) { 
      console.error(err);
      toast.error('โหลดข้อมูลไม่สำเร็จ');
    } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddClick = () => { setCurrentMission(null); setIsModalOpen(true); };
  const handleEditClick = (mission) => { setCurrentMission(mission); setIsModalOpen(true); };

  const handleSave = async (data, file) => {
    const id = data._id || data.id;
    setLoading(true); // Show loading while uploading
    try {
      const formData = new FormData();
      // Append basic fields
      formData.append("title", data.title || "");
      formData.append("description", data.description || "");
      formData.append("status", data.status || "Active");
      formData.append("member", data.member || 0);
      formData.append("isTargetArea", data.isTargetArea || false);
      
      // Append complex objects as JSON strings
      formData.append("location", JSON.stringify(data.location || {}));
      formData.append("stats", JSON.stringify(data.stats || {}));
      formData.append("images", JSON.stringify(data.images || []));

      // Append new file if exists
      if (file) {
        formData.append("image", file);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (id) {
        await api.put(`/missions/${id}`, formData, config);
        toast.success("อัปเดตข้อมูลและรูปภาพสำเร็จ!");
      } else {
        await api.post(`/missions`, formData, config);
        toast.success("เพิ่มข้อมูลและอัปโหลดรูปภาพสำเร็จ!");
      }
      
      await fetchData(); 
      setIsModalOpen(false);
      setCurrentMission(null);
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Error! " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClickDelete = (mission) => { setDeleteModal({ isOpen: true, id: mission._id || mission.id, title: mission.title }); };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    if (!id) return;
    try {
      await api.delete(`/missions/${id}`);
      setMissions(prev => prev.filter(m => (m._id || m.id) !== id));
      setDeleteModal({ isOpen: false, id: null, title: "" });
      toast.success("ลบข้อมูลสำเร็จ!");
    } catch (err) {
      console.error(err);
      toast.error("ลบไม่สำเร็จ: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredMissions = missions.filter(m => (m.title || "").toLowerCase().includes((searchTerm || "").toLowerCase()));

  return (
    <div className="font-['Kanit']">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-1">
        <div>
          <p className="text-[#00a3ff] text-[10px] font-black tracking-[0.3em] uppercase mb-1">Management</p>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Church Stats
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-light">จัดการข้อมูลสถิติของคริสตจักรในแต่ละพื้นที่</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="ค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#1b2537] text-white text-sm placeholder:text-slate-600 focus:border-[#00a3ff]/60 focus:outline-none transition-all" />
          </div>
          <button onClick={handleAddClick} className="w-full sm:w-auto justify-center text-white px-5 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 font-bold text-sm bg-[#0054a5] hover:bg-[#00a3ff] shadow-[0_0_15px_rgba(0,163,255,0.3)]">
            <Plus size={16} /> <span>เพิ่มข้อมูล</span>
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="bg-[#1b2537] rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-[#00a3ff]" size={36} />
          </div>
        ) : (
          <>
            {/* 📱 Mobile View (Cards) */}
            <div className="md:hidden flex flex-col divide-y divide-white/5">
              {filteredMissions.map((mission, index) => {
                const safeId = mission._id || mission.id;
                return (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: index * 0.03 } }} key={safeId || index} className="p-4 hover:bg-white/2 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0d1522] border border-white/5 flex items-center justify-center flex-shrink-0">
                        {mission.images?.[0] ? <img src={mission.images[0]} alt="m" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-slate-600"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-white text-base leading-tight">{mission.title}</h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => handleEditClick(mission)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#00a3ff] transition-all bg-white/5">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => handleClickDelete(mission)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-all bg-white/5">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <MapPin size={12} className="text-[#00a3ff] flex-shrink-0"/>
                          <span className="truncate">{mission.location?.address || "No Address"}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              mission.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' : 
                              mission.status === 'Target Area' ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' : 
                              'bg-blue-500/15 text-blue-400 border-blue-500/25'
                            }`}>
                              {mission.status}
                          </span>
                          {mission.isTargetArea && <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 font-black tracking-wider uppercase text-[9px]">TARGET AREA</span>}
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                             <Users size={14} className="text-indigo-400"/> {mission.member || 0} Members
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                             <span className="text-[#00a3ff]">★</span> {mission.stats?.disciples || 0} Disciples
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* 💻 Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left w-20">Image</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Mission Info</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Team</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Disciples</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMissions.map((mission, index) => {
                    const safeId = mission._id || mission.id;
                    return (
                      <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: index * 0.03 } }} key={safeId || index} className="hover:bg-white/2 transition-colors">
                          <td className="px-6 py-4">
                              <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#0d1522] border border-white/5 flex items-center justify-center">
                                  {mission.images?.[0] ? <img src={mission.images[0]} alt="m" className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-slate-600"/>}
                              </div>
                          </td>
                          <td className="px-6 py-4">
                              <h3 className="font-bold text-white">{mission.title}</h3>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                  <MapPin size={12} className="text-[#00a3ff]"/>
                                  <span className="truncate max-w-[200px]">{mission.location?.address || "No Address"}</span>
                              </div>
                              {mission.isTargetArea && <span className="inline-block mt-1.5 text-[9px] px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 font-black tracking-wider uppercase">TARGET AREA</span>}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              mission.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' : 
                              mission.status === 'Target Area' ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' : 
                              'bg-blue-500/15 text-blue-400 border-blue-500/25'
                            }`}>
                              {mission.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center"><div className="flex items-center justify-center gap-1.5 font-bold text-slate-300"><Users size={14} className="text-indigo-400"/> {mission.member || 0}</div></td>
                          <td className="px-6 py-4 text-center"><div className="font-black text-white">{mission.stats?.disciples || 0}</div></td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleEditClick(mission)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#00a3ff] hover:bg-[#00a3ff]/10 transition-all border border-transparent hover:border-[#00a3ff]/20">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleClickDelete(mission)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredMissions.length === 0 && (
              <div className="py-16 text-center text-slate-500 flex flex-col items-center">
                <Search size={32} className="text-slate-600 mb-3 opacity-50"/>
                <span className="font-bold text-sm">ไม่พบข้อมูล "{searchTerm}"</span>
              </div>
            )}
          </>
        )}
      </motion.div>
      <MissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mission={currentMission} onSave={handleSave} />
      <DeleteModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, id: null, title: "" })} onConfirm={confirmDelete} missionTitle={deleteModal.title} />
    </div>
  );
}