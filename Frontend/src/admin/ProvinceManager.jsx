import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, RefreshCw, CheckCircle, AlertCircle, Search } from 'lucide-react';

// All 77 Thai provinces with English names matching the GeoJSON
const ALL_PROVINCES = [
  { nameEn: 'Mae Hong Son',        nameTh: 'แม่ฮ่องสอน' },
  { nameEn: 'Chiang Mai',          nameTh: 'เชียงใหม่' },
  { nameEn: 'Chiang Rai',          nameTh: 'เชียงราย' },
  { nameEn: 'Nan',                 nameTh: 'น่าน' },
  { nameEn: 'Phayao',              nameTh: 'พะเยา' },
  { nameEn: 'Lampang',             nameTh: 'ลำปาง' },
  { nameEn: 'Lamphun',             nameTh: 'ลำพูน' },
  { nameEn: 'Phrae',               nameTh: 'แพร่' },
  { nameEn: 'Uttaradit',           nameTh: 'อุตรดิตถ์' },
  { nameEn: 'Sukhothai',           nameTh: 'สุโขทัย' },
  { nameEn: 'Phitsanulok',         nameTh: 'พิษณุโลก' },
  { nameEn: 'Phetchabun',          nameTh: 'เพชรบูรณ์' },
  { nameEn: 'Phichit',             nameTh: 'พิจิตร' },
  { nameEn: 'Kamphaeng Phet',      nameTh: 'กำแพงเพชร' },
  { nameEn: 'Tak',                 nameTh: 'ตาก' },
  { nameEn: 'Nakhon Sawan',        nameTh: 'นครสวรรค์' },
  { nameEn: 'Uthai Thani',         nameTh: 'อุทัยธานี' },
  { nameEn: 'Kanchanaburi',        nameTh: 'กาญจนบุรี' },
  { nameEn: 'Suphan Buri',         nameTh: 'สุพรรณบุรี' },
  { nameEn: 'Chai Nat',            nameTh: 'ชัยนาท' },
  { nameEn: 'Sing Buri',           nameTh: 'สิงห์บุรี' },
  { nameEn: 'Ang Thong',           nameTh: 'อ่างทอง' },
  { nameEn: 'Lop Buri',            nameTh: 'ลพบุรี' },
  { nameEn: 'Saraburi',            nameTh: 'สระบุรี' },
  { nameEn: 'Phra Nakhon Si Ayutthaya', nameTh: 'พระนครศรีอยุธยา' },
  { nameEn: 'Pathum Thani',        nameTh: 'ปทุมธานี' },
  { nameEn: 'Nonthaburi',          nameTh: 'นนทบุรี' },
  { nameEn: 'Bangkok Metropolis',  nameTh: 'กรุงเทพมหานคร' },
  { nameEn: 'Samut Prakan',        nameTh: 'สมุทรปราการ' },
  { nameEn: 'Samut Sakhon',        nameTh: 'สมุทรสาคร' },
  { nameEn: 'Samut Songkhram',     nameTh: 'สมุทรสงคราม' },
  { nameEn: 'Ratchaburi',          nameTh: 'ราชบุรี' },
  { nameEn: 'Phetchaburi',         nameTh: 'เพชรบุรี' },
  { nameEn: 'Prachuap Khiri Khan', nameTh: 'ประจวบคีรีขันธ์' },
  { nameEn: 'Nakhon Pathom',       nameTh: 'นครปฐม' },
  { nameEn: 'Nakhon Ratchasima',   nameTh: 'นครราชสีมา' },
  { nameEn: 'Chaiyaphum',          nameTh: 'ชัยภูมิ' },
  { nameEn: 'Buriram',             nameTh: 'บุรีรัมย์' },
  { nameEn: 'Surin',               nameTh: 'สุรินทร์' },
  { nameEn: 'Si Sa Ket',           nameTh: 'ศรีสะเกษ' },
  { nameEn: 'Ubon Ratchathani',    nameTh: 'อุบลราชธานี' },
  { nameEn: 'Yasothon',            nameTh: 'ยโสธร' },
  { nameEn: 'Amnat Charoen',       nameTh: 'อำนาจเจริญ' },
  { nameEn: 'Mukdahan',            nameTh: 'มุกดาหาร' },
  { nameEn: 'Nakhon Phanom',       nameTh: 'นครพนม' },
  { nameEn: 'Sakon Nakhon',        nameTh: 'สกลนคร' },
  { nameEn: 'Kalasin',             nameTh: 'กาฬสินธุ์' },
  { nameEn: 'Khon Kaen',           nameTh: 'ขอนแก่น' },
  { nameEn: 'Roi Et',              nameTh: 'ร้อยเอ็ด' },
  { nameEn: 'Maha Sarakham',       nameTh: 'มหาสารคาม' },
  { nameEn: 'Udon Thani',          nameTh: 'อุดรธานี' },
  { nameEn: 'Nong Khai',           nameTh: 'หนองคาย' },
  { nameEn: 'Bueng Kan',           nameTh: 'บึงกาฬ' },
  { nameEn: 'Loei',                nameTh: 'เลย' },
  { nameEn: 'Nong Bua Lam Phu',   nameTh: 'หนองบัวลำภู' },
  { nameEn: 'Chon Buri',           nameTh: 'ชลบุรี' },
  { nameEn: 'Rayong',              nameTh: 'ระยอง' },
  { nameEn: 'Chanthaburi',         nameTh: 'จันทบุรี' },
  { nameEn: 'Trat',                nameTh: 'ตราด' },
  { nameEn: 'Prachin Buri',        nameTh: 'ปราจีนบุรี' },
  { nameEn: 'Sa Kaeo',             nameTh: 'สระแก้ว' },
  { nameEn: 'Chachoengsao',        nameTh: 'ฉะเชิงเทรา' },
  { nameEn: 'Chumphon',            nameTh: 'ชุมพร' },
  { nameEn: 'Ranong',              nameTh: 'ระนอง' },
  { nameEn: 'Surat Thani',         nameTh: 'สุราษฎร์ธานี' },
  { nameEn: 'Phangnga',            nameTh: 'พังงา' },
  { nameEn: 'Phuket',              nameTh: 'ภูเก็ต' },
  { nameEn: 'Krabi',               nameTh: 'กระบี่' },
  { nameEn: 'Nakhon Si Thammarat', nameTh: 'นครศรีธรรมราช' },
  { nameEn: 'Phatthalung',         nameTh: 'พัทลุง' },
  { nameEn: 'Trang',               nameTh: 'ตรัง' },
  { nameEn: 'Satun',               nameTh: 'สตูล' },
  { nameEn: 'Songkhla',            nameTh: 'สงขลา' },
  { nameEn: 'Pattani',             nameTh: 'ปัตตานี' },
  { nameEn: 'Yala',                nameTh: 'ยะลา' },
  { nameEn: 'Narathiwat',          nameTh: 'นราธิวาส' },
];

const API = `${import.meta.env.VITE_SERVER_URL}/api/province-stats`;

const ProvinceManager = () => {
  // Local editable state: { nameEn -> helpCount }
  const [counts, setCounts]     = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [status, setStatus]     = useState(null); // 'success' | 'error'
  const [search, setSearch]     = useState('');

  // Fetch existing data from DB
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(API);
        const map = {};
        res.data.forEach(d => { map[d.nameEn] = d.helpCount; });
        setCounts(map);
      } catch (e) {
        console.error('Failed to load province stats:', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (nameEn, val) => {
    setCounts(prev => ({ ...prev, [nameEn]: Number(val) || 0 }));
  };

  // Save all to API in one bulk request
  const handleSaveAll = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const payload = ALL_PROVINCES.map(p => ({
        nameEn:    p.nameEn,
        nameTh:    p.nameTh,
        helpCount: counts[p.nameEn] ?? 0,
      }));
      await axios.put(`${API}/bulk`, payload);
      setStatus('success');
    } catch (e) {
      console.error('Save failed:', e);
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const filtered = ALL_PROVINCES.filter(p =>
    p.nameTh.includes(search) || p.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0f1a] font-['Kanit'] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0f1a]/95 backdrop-blur-md border-b border-white/8 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight">🗺️ Province Statistics Manager</h1>
          <p className="text-slate-400 text-xs mt-0.5">จัดการข้อมูล helpCount รายจังหวัด — แก้แล้วกด "บันทึกทั้งหมด"</p>
        </div>
        <div className="flex items-center gap-3">
          {status === 'success' && (
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold animate-pulse">
              <CheckCircle size={16} /> บันทึกสำเร็จ!
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1.5 text-red-400 text-sm font-bold">
              <AlertCircle size={16} /> บันทึกล้มเหลว
            </span>
          )}
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-[#0054a5] hover:bg-[#00a3ff] disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-lg"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาจังหวัด..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00a3ff]/50 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <RefreshCw size={32} className="animate-spin text-[#00a3ff]" />
          </div>
        ) : (
          <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/5">
                  <th className="text-left px-5 py-3 text-slate-400 font-bold text-xs tracking-wider w-8">#</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-bold text-xs tracking-wider">จังหวัด</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-bold text-xs tracking-wider hidden md:table-cell">English Name</th>
                  <th className="text-right px-5 py-3 text-slate-400 font-bold text-xs tracking-wider w-48">จำนวนผู้รับการช่วยเหลือ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const val = counts[p.nameEn] ?? 0;
                  const rowColor = val > 10000 ? 'bg-red-500/5' : val > 5000 ? 'bg-orange-500/5' : val > 1000 ? 'bg-yellow-500/5' : val > 0 ? 'bg-green-500/5' : '';
                  return (
                    <tr key={p.nameEn} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${rowColor}`}>
                      <td className="px-5 py-3 text-slate-600 text-xs">{i + 1}</td>
                      <td className="px-5 py-3 font-medium text-white">{p.nameTh}</td>
                      <td className="px-5 py-3 text-slate-400 hidden md:table-cell text-xs">{p.nameEn}</td>
                      <td className="px-5 py-3 text-right">
                        <input
                          type="number"
                          min="0"
                          value={val}
                          onChange={e => handleChange(p.nameEn, e.target.value)}
                          className="w-32 bg-white/8 border border-white/10 rounded-lg px-3 py-1.5 text-right text-white text-sm focus:outline-none focus:border-[#00a3ff]/60 focus:bg-white/12 transition-all"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvinceManager;
