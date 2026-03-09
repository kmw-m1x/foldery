import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Loader2, AlertCircle, CheckCircle, RefreshCcw, MapPin } from 'lucide-react';

export default function AdminStats() {
  const [formData, setFormData] = useState({
    hearers: 0,
    targetAreas: 0,
    decisions: 0,
    baptized: 0,
    disciples: 0,
    houseChurches: 0
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  // 1. ดึงข้อมูล
  useEffect(() => {
    fetchCurrentStats();
  }, []);

  const fetchCurrentStats = async () => {
    setInitialLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/stats/all');
      const currentData = res.data[0]?.stats || {};
      
      setFormData({
        hearers: currentData.hearers || 0,
        targetAreas: currentData.targetAreas || 0,
        decisions: currentData.decisions || 0,
        baptized: currentData.baptized || 0,
        disciples: currentData.disciples || 0,
        houseChurches: currentData.houseChurches || 0
      });
    } catch (error) {
      console.error("ดึงข้อมูลไม่มา:", error);
      setStatus({ type: 'error', message: 'เชื่อมต่อ Server ไม่ได้จารย์!' });
    } finally {
      setInitialLoading(false);
    }
  };

  // 2. Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const intValue = parseInt(value) || 0;
    
    setFormData({
      ...formData,
      [name]: intValue < 0 ? 0 : intValue
    });
  };

  // 3. Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // ยิง PUT ไปที่ API
      await axios.put('http://localhost:3000/api/stats', formData);
      
      setStatus({ type: 'success', message: 'บันทึกข้อมูลเรียบร้อยแล้ว!' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);

    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'บันทึกไม่ผ่าน! เช็ค Server หน่อยจารย์' });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'ผู้ได้ยินข่าวประเสริฐ (Hearers)', name: 'hearers', desc: 'จำนวนคนที่ได้รับฟังเรื่องราว' },
    { label: 'พื้นที่เป้าหมาย (Target Areas)', name: 'targetAreas', desc: 'จำนวนหมู่บ้าน/ตำบลที่ต้องการเข้าถึง' },
    { label: 'ตัดสินใจเชื่อ (Decisions)', name: 'decisions', desc: 'คนที่เปิดใจต้อนรับพระเจ้า' },
    { label: 'รับบัพติสมา (Baptized)', name: 'baptized', desc: 'เข้าสู่พิธีบัพติสมาแล้ว' },
    { label: 'สร้างสาวก (Disciples)', name: 'disciples', desc: 'คนที่เริ่มติดตามและเรียนรู้' },
    { label: 'คริสตจักรบ้าน (House Churches)', name: 'houseChurches', desc: 'กลุ่มสามัคคีธรรมตามบ้าน' },
  ];

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-[#ff5722]">
        <Loader2 className="animate-spin mr-2" /> กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* --- Header (Pluto Style) --- */}
      <div className="mb-8 flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-[#15283c]">Update Statistics</h1>
          <p className="text-gray-400 mt-1">อัปเดตตัวเลขล่าสุดของพันธกิจ</p>
        </div>
        <button 
          onClick={fetchCurrentStats}
          className="text-gray-400 hover:text-[#ff5722] transition-colors p-2 rounded-full hover:bg-orange-50"
          title="รีเฟรชข้อมูล"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      {/* --- Form Card --- */}
      <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8 border border-gray-100">
        <form onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fields.map((field) => (
              <div key={field.name} className="group">
                <label className="block text-sm font-bold text-[#15283c] mb-2 group-hover:text-[#ff5722] transition-colors">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-4 pl-5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#ff5722] focus:ring-4 focus:ring-[#ff5722]/10 transition-all text-xl font-bold text-[#15283c] bg-gray-50 focus:bg-white"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 ml-1">{field.desc}</p>
              </div>
            ))}
          </div>

          {/* --- Action Area --- */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-8">
            
            {/* Status Message */}
            <div className="flex-1">
              {status.message && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold animate-bounce-short shadow-sm
                  ${status.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
                >
                  {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {status.message}
                </div>
              )}
            </div>


            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-white font-bold text-lg shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:scale-95 min-w-[200px]
                ${loading ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-[#ff5722] hover:bg-[#e64a19]'}`}
            >
              {loading ? (
                <><Loader2 className="animate-spin" /> Saving...</>
              ) : (
                <><Save size={20} /> Save Changes</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}