import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, X, Save, Plus, Search, MapPin, Image as ImageIcon, Users, LayoutDashboard, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const THEME = {
  darkBlue: "#15283c",
  orange: "#ff5722",
  bgBody: "#f8fafc",
};

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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-sans">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative z-10">
            <div className="bg-red-50 p-6 flex flex-col items-center justify-center text-center border-b border-red-100">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4"><AlertTriangle size={32} className="text-red-600" /></div>
              <h3 className="text-xl font-bold text-slate-800">Are you sure?</h3>
              <p className="text-slate-500 mt-2 text-sm">คุณต้องการลบภารกิจ <br/><span className="font-bold text-red-600 text-base">"{missionTitle}"</span> <br/>ใช่หรือไม่? การกระทำนี้กู้คืนไม่ได้นะจารย์!</p>
            </div>
            <div className="p-4 bg-white flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-3 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={onConfirm} className="flex-1 px-4 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg transition-all active:scale-95">Yes, Delete it!</button>
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

  useEffect(() => {
    if (mission) {
      setFormData({
        ...mission,
        stats: mission.stats || { disciples: 0 },
        location: mission.location || { lat: 0, lng: 0, address: "" }, // ถ้าใน DB เป็น null อาจต้องกันเหนียวตรงนี้
        images: mission.images || [""],
        member: mission.member || 0
      });
    } else {
      setFormData(defaultState);
    }
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

  const handleImageChange = (e) => {
    const newImages = [...(formData.images || [])];
    newImages[0] = e.target.value;
    setFormData({ ...formData, images: newImages });
  };

  // 🔥 Auto Address: ปักหมุดแล้วดึงชื่อสถานที่
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div 
            className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border-t-8 overflow-hidden flex flex-col max-h-[90vh] relative z-10" 
            style={{ borderColor: THEME.darkBlue }}
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="px-6 py-4 flex justify-between items-center text-white" style={{ backgroundColor: THEME.darkBlue }}>
              <h2 className="text-xl font-bold uppercase tracking-wide flex gap-2 items-center">
                {mission ? <Edit size={20} /> : <Plus size={20} />} 
                {mission ? "Edit Mission" : "Add New Mission"}
              </h2>
              <button onClick={onClose} className="hover:text-[#ff5722] transition-colors bg-white/10 p-1.5 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#ff5722]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#ff5722]">
                    {['Active', 'Expanding', 'New', 'Target Area'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label><textarea name="description" rows="2" value={formData.description} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#ff5722]" /></div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-[#15283c] flex items-center gap-2 text-sm uppercase"><MapPin size={16}/> Location Pin</h3>
                    <div className="text-[10px] text-slate-400 font-mono bg-white px-2 py-1 rounded border">
                        {/* กันเหนียวเผื่อ location ยังไม่โหลด */}
                        {formData.location?.lat?.toFixed(4) || 0}, {formData.location?.lng?.toFixed(4) || 0}
                    </div>
                </div>
                <div className="w-full h-64 rounded-lg overflow-hidden border border-slate-300 shadow-inner mb-3 relative z-0">
                    <MapContainer center={[13.0, 101.5]} zoom={6} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                        <LocationPicker position={formData.location || {lat:0, lng:0}} onLocationSelect={handleMapSelect} />
                    </MapContainer>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Address / Location Name</label>
                    <input type="text" name="location.address" value={formData.location?.address || ""} onChange={handleChange} placeholder="ปักหมุด หรือ พิมพ์ชื่อสถานที่..." className="w-full p-2 rounded border border-gray-300 text-sm focus:border-[#ff5722] focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Disciples</label><input type="number" name="stats.disciples" value={formData.stats?.disciples || 0} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded focus:border-[#ff5722] text-center font-bold text-[#15283c]" /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Member</label><input type="number" name="member" value={formData.member || 0} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded focus:border-[#ff5722] text-center font-bold text-[#15283c]" /></div>
                <div className="flex items-end pb-2"><label className="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" name="isTargetArea" checked={formData.isTargetArea} onChange={handleChange} className="w-5 h-5 accent-[#ff5722]" /><span className="text-sm font-bold text-[#ff5722]">Is Target Area?</span></label></div>
              </div>
              <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><ImageIcon size={14}/> Image URL</label>
                   <div className="flex gap-2"><input type="text" value={formData.images?.[0] || ""} onChange={handleImageChange} className="flex-1 p-2 border border-slate-300 rounded text-sm focus:border-[#ff5722]" /><div className="w-12 h-10 bg-slate-100 rounded border overflow-hidden">{formData.images?.[0] && <img src={formData.images[0]} className="w-full h-full object-cover" />}</div></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-medium text-slate-500 hover:bg-slate-200 transition-colors text-sm">Cancel</button>
              <button onClick={() => onSave(formData)} className="px-6 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 shadow-lg transition-all active:scale-95 text-sm" style={{ backgroundColor: THEME.orange }}><Save size={18} /> {mission ? "Update" : "Create"}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main Page (🔥🔥🔥 ตรงนี้สำคัญต้อง export default) ---
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
      const res = await axios.get("http://localhost:3000/api/missions");
      setMissions(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddClick = () => { setCurrentMission(null); setIsModalOpen(true); };
  const handleEditClick = (mission) => { setCurrentMission(mission); setIsModalOpen(true); };

  const handleSave = async (data) => {
    const id = data._id || data.id;
    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/missions/${id}`, data);
        alert("✅ อัปเดตข้อมูลสำเร็จ!");
      } else {
        await axios.post(`http://localhost:3000/api/missions`, data);
        alert("🎉 เพิ่มภารกิจใหม่สำเร็จ!");
      }
      await fetchData(); 
      setIsModalOpen(false);
      setCurrentMission(null);
    } catch (err) {
      console.error("Save Error:", err);
      alert("❌ Error! " + err.message);
    }
  };

  const handleClickDelete = (mission) => { setDeleteModal({ isOpen: true, id: mission._id || mission.id, title: mission.title }); };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    if (!id) return;
    try {
      await axios.delete(`http://localhost:3000/api/missions/${id}`);
      setMissions(prev => prev.filter(m => (m._id || m.id) !== id));
      setDeleteModal({ isOpen: false, id: null, title: "" });
    } catch (err) {
      console.error(err);
      alert("❌ ลบไม่สำเร็จ: " + err.message);
    }
  };

  const filteredMissions = missions.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="font-sans text-[#15283c]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#15283c] flex items-center gap-3"><LayoutDashboard size={40} className="text-[#ff5722]" /> Admin Dashboard</h1>
          <p className="text-slate-500 mt-1 ml-1">จัดการข้อมูลภารกิจ ทีมงาน และเป้าหมาย</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-[#ff5722] focus:outline-none shadow-sm text-sm transition-all" />
          </div>
          <button onClick={handleAddClick} className="text-white px-4 py-3 rounded-lg shadow-lg hover:brightness-110 transition-all active:scale-95 flex items-center gap-2 font-bold" style={{ backgroundColor: THEME.orange }}><Plus size={20} /> <span className="hidden md:inline">New</span></button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 animate-pulse">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-white text-sm" style={{ backgroundColor: THEME.darkBlue }}>
                  <th className="p-4 font-semibold tracking-wide w-20">Image</th>
                  <th className="p-4 font-semibold tracking-wide">Mission Info</th>
                  <th className="p-4 font-semibold tracking-wide text-center">Status</th>
                  <th className="p-4 font-semibold tracking-wide text-center">Team</th>
                  <th className="p-4 font-semibold tracking-wide text-center">Disciples</th>
                  <th className="p-4 font-semibold tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMissions.map((mission, index) => {
                  const safeId = mission._id || mission.id;
                  return (
                    <tr key={safeId || index} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                {missions.images?.[0] ? <img src={missions.images[0]} alt="m" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={16}/></div>}
                            </div>
                        </td>
                        <td className="p-4">
                            <h3 className="font-bold text-[#15283c]">{mission.title}</h3>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                <MapPin size={12}/>
                                {/* 🔥🔥🔥 จุดที่แก้การแสดงผล Address 🔥🔥🔥 */}
                                <span className="truncate max-w-[200px]">{mission.location?.address || "No Address"}</span>
                            </div>
                            {mission.isTargetArea && <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded border border-yellow-200 font-bold">TARGET AREA</span>}
                        </td>
                        <td className="p-4 text-center"><span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border ${mission.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : mission.status === 'Target Area' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>{mission.status}</span></td>
                        <td className="p-4 text-center"><div className="flex items-center justify-center gap-1 font-bold text-slate-600"><Users size={14} className="text-[#ff5722]"/> {mission.member || 0}</div></td>
                        <td className="p-4 text-center"><div className="font-bold text-[#15283c]">{mission.stats?.disciples || 0}</div></td>
                        <td className="p-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => handleEditClick(mission)} className="p-2 rounded text-slate-400 hover:text-[#15283c] hover:bg-slate-100 transition-all"><Edit size={18} /></button><button onClick={() => handleClickDelete(mission)} className="p-2 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={18} /></button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredMissions.length === 0 && <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-2"><Search size={40} className="text-slate-200"/><span>No missions found matching "{searchTerm}"</span></div>}
          </div>
        )}
      </div>
      <MissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mission={currentMission} onSave={handleSave} />
      <DeleteModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, id: null, title: "" })} onConfirm={confirmDelete} missionTitle={deleteModal.title} />
    </div>
  );
}