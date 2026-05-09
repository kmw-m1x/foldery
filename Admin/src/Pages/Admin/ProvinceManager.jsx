import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Save, RefreshCw, MapPin, X } from 'lucide-react';

// All 77 provinces — nameEn must match "name" field in thailand-provinces.json
const ALL_PROVINCES = [
  { nameEn: 'Mae Hong Son',             nameTh: 'แม่ฮ่องสอน' },
  { nameEn: 'Chiang Mai',               nameTh: 'เชียงใหม่' },
  { nameEn: 'Chiang Rai',               nameTh: 'เชียงราย' },
  { nameEn: 'Nan',                      nameTh: 'น่าน' },
  { nameEn: 'Phayao',                   nameTh: 'พะเยา' },
  { nameEn: 'Lampang',                  nameTh: 'ลำปาง' },
  { nameEn: 'Lamphun',                  nameTh: 'ลำพูน' },
  { nameEn: 'Phrae',                    nameTh: 'แพร่' },
  { nameEn: 'Uttaradit',                nameTh: 'อุตรดิตถ์' },
  { nameEn: 'Sukhothai',                nameTh: 'สุโขทัย' },
  { nameEn: 'Phitsanulok',              nameTh: 'พิษณุโลก' },
  { nameEn: 'Phetchabun',               nameTh: 'เพชรบูรณ์' },
  { nameEn: 'Phichit',                  nameTh: 'พิจิตร' },
  { nameEn: 'Kamphaeng Phet',           nameTh: 'กำแพงเพชร' },
  { nameEn: 'Tak',                      nameTh: 'ตาก' },
  { nameEn: 'Nakhon Sawan',             nameTh: 'นครสวรรค์' },
  { nameEn: 'Uthai Thani',              nameTh: 'อุทัยธานี' },
  { nameEn: 'Kanchanaburi',             nameTh: 'กาญจนบุรี' },
  { nameEn: 'Suphan Buri',              nameTh: 'สุพรรณบุรี' },
  { nameEn: 'Chai Nat',                 nameTh: 'ชัยนาท' },
  { nameEn: 'Sing Buri',                nameTh: 'สิงห์บุรี' },
  { nameEn: 'Ang Thong',                nameTh: 'อ่างทอง' },
  { nameEn: 'Lop Buri',                 nameTh: 'ลพบุรี' },
  { nameEn: 'Saraburi',                 nameTh: 'สระบุรี' },
  { nameEn: 'Phra Nakhon Si Ayutthaya', nameTh: 'พระนครศรีอยุธยา' },
  { nameEn: 'Pathum Thani',             nameTh: 'ปทุมธานี' },
  { nameEn: 'Nonthaburi',               nameTh: 'นนทบุรี' },
  { nameEn: 'Bangkok Metropolis',       nameTh: 'กรุงเทพมหานคร' },
  { nameEn: 'Samut Prakan',             nameTh: 'สมุทรปราการ' },
  { nameEn: 'Samut Sakhon',             nameTh: 'สมุทรสาคร' },
  { nameEn: 'Samut Songkhram',          nameTh: 'สมุทรสงคราม' },
  { nameEn: 'Ratchaburi',               nameTh: 'ราชบุรี' },
  { nameEn: 'Phetchaburi',              nameTh: 'เพชรบุรี' },
  { nameEn: 'Prachuap Khiri Khan',      nameTh: 'ประจวบคีรีขันธ์' },
  { nameEn: 'Nakhon Pathom',            nameTh: 'นครปฐม' },
  { nameEn: 'Nakhon Ratchasima',        nameTh: 'นครราชสีมา' },
  { nameEn: 'Chaiyaphum',               nameTh: 'ชัยภูมิ' },
  { nameEn: 'Buriram',                  nameTh: 'บุรีรัมย์' },
  { nameEn: 'Surin',                    nameTh: 'สุรินทร์' },
  { nameEn: 'Si Sa Ket',                nameTh: 'ศรีสะเกษ' },
  { nameEn: 'Ubon Ratchathani',         nameTh: 'อุบลราชธานี' },
  { nameEn: 'Yasothon',                 nameTh: 'ยโสธร' },
  { nameEn: 'Amnat Charoen',            nameTh: 'อำนาจเจริญ' },
  { nameEn: 'Mukdahan',                 nameTh: 'มุกดาหาร' },
  { nameEn: 'Nakhon Phanom',            nameTh: 'นครพนม' },
  { nameEn: 'Sakon Nakhon',             nameTh: 'สกลนคร' },
  { nameEn: 'Kalasin',                  nameTh: 'กาฬสินธุ์' },
  { nameEn: 'Khon Kaen',                nameTh: 'ขอนแก่น' },
  { nameEn: 'Roi Et',                   nameTh: 'ร้อยเอ็ด' },
  { nameEn: 'Maha Sarakham',            nameTh: 'มหาสารคาม' },
  { nameEn: 'Udon Thani',               nameTh: 'อุดรธานี' },
  { nameEn: 'Nong Khai',                nameTh: 'หนองคาย' },
  { nameEn: 'Bueng Kan',                nameTh: 'บึงกาฬ' },
  { nameEn: 'Loei',                     nameTh: 'เลย' },
  { nameEn: 'Nong Bua Lam Phu',         nameTh: 'หนองบัวลำภู' },
  { nameEn: 'Chon Buri',                nameTh: 'ชลบุรี' },
  { nameEn: 'Rayong',                   nameTh: 'ระยอง' },
  { nameEn: 'Chanthaburi',              nameTh: 'จันทบุรี' },
  { nameEn: 'Trat',                     nameTh: 'ตราด' },
  { nameEn: 'Prachin Buri',             nameTh: 'ปราจีนบุรี' },
  { nameEn: 'Sa Kaeo',                  nameTh: 'สระแก้ว' },
  { nameEn: 'Chachoengsao',             nameTh: 'ฉะเชิงเทรา' },
  { nameEn: 'Chumphon',                 nameTh: 'ชุมพร' },
  { nameEn: 'Ranong',                   nameTh: 'ระนอง' },
  { nameEn: 'Surat Thani',              nameTh: 'สุราษฎร์ธานี' },
  { nameEn: 'Phangnga',                 nameTh: 'พังงา' },
  { nameEn: 'Phuket',                   nameTh: 'ภูเก็ต' },
  { nameEn: 'Krabi',                    nameTh: 'กระบี่' },
  { nameEn: 'Nakhon Si Thammarat',      nameTh: 'นครศรีธรรมราช' },
  { nameEn: 'Phatthalung',              nameTh: 'พัทลุง' },
  { nameEn: 'Trang',                    nameTh: 'ตรัง' },
  { nameEn: 'Satun',                    nameTh: 'สตูล' },
  { nameEn: 'Songkhla',                 nameTh: 'สงขลา' },
  { nameEn: 'Pattani',                  nameTh: 'ปัตตานี' },
  { nameEn: 'Yala',                     nameTh: 'ยะลา' },
  { nameEn: 'Narathiwat',               nameTh: 'นราธิวาส' },
];

const API = `${import.meta.env.VITE_SERVER_URL}/api/province-stats`;

// Tier badge config
const getTier = (val) => {
  if (val > 10000) return { label: '> 10K', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  if (val > 5000)  return { label: '5K+',   color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
  if (val > 1000)  return { label: '1K+',   color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
  if (val > 0)     return { label: '< 1K',  color: 'bg-green-500/20 text-green-400 border-green-500/30' };
  return { label: 'ว่าง', color: 'bg-white/5 text-slate-500 border-white/10' };
};

const ProvinceManager = () => {
  const [counts, setCounts]   = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [search, setSearch]   = useState('');
  const [dirty, setDirty]     = useState(false); // มีการแก้ไขหรือยัง

  // Fetch from DB
  useEffect(() => {
    axios.get(API)
      .then(res => {
        const map = {};
        res.data.forEach(d => { map[d.nameEn] = d.helpCount; });
        setCounts(map);
      })
      .catch(() => toast.error('โหลดข้อมูลล้มเหลว — ตรวจสอบการเชื่อมต่อ Backend'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (nameEn, val) => {
    const n = Math.max(0, Number(val) || 0);
    setCounts(prev => ({ ...prev, [nameEn]: n }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading('กำลังบันทึกข้อมูล...');
    try {
      const payload = ALL_PROVINCES.map(p => ({
        nameEn:    p.nameEn,
        nameTh:    p.nameTh,
        helpCount: counts[p.nameEn] ?? 0,
      }));
      await axios.put(`${API}/bulk`, payload);
      toast.success('บันทึกสำเร็จ! ข้อมูลอัปเดตแล้ว 🎉', { id: toastId });
      setDirty(false);
    } catch {
      toast.error('บันทึกล้มเหลว กรุณาลองใหม่', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() =>
    ALL_PROVINCES.filter(p =>
      p.nameTh.includes(search) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const totalFilled   = ALL_PROVINCES.filter(p => (counts[p.nameEn] ?? 0) > 0).length;
  const totalPeople   = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Toast Provider */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1b2537',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'Kanit, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#00a3ff', secondary: '#fff' } },
        }}
      />

      <div className="min-h-screen bg-[#0d1522] font-['Kanit'] text-white pb-32">

        {/* ─── TOP HEADER ───────────────────────────────── */}
        <div className="sticky top-0 z-40 bg-[#0d1522]/95 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00a3ff]/15 flex items-center justify-center">
                <MapPin size={16} className="text-[#00a3ff]" />
              </div>
              <div>
                <h1 className="font-black text-base leading-tight tracking-tight">Province Stats</h1>
                <p className="text-slate-500 text-[11px]">
                  {totalFilled}/77 จังหวัด · {totalPeople.toLocaleString()} คน
                </p>
              </div>
            </div>
            {dirty && (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                มีการแก้ไข
              </span>
            )}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto px-4 pb-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ค้นหาจังหวัด..."
                className="w-full h-11 pl-10 pr-10 bg-[#1b2537] border border-white/8 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00a3ff]/50 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── CONTENT ──────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-4 pt-4 space-y-2.5">
          {loading ? (
            // Skeleton cards
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#1b2537] border border-white/5 rounded-2xl p-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-white/10 rounded-md" />
                    <div className="h-3 w-20 bg-white/5 rounded-md" />
                  </div>
                  <div className="h-11 w-28 bg-white/10 rounded-xl" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-600">
              <Search size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">ไม่พบจังหวัดที่ค้นหา</p>
              <button onClick={() => setSearch('')} className="mt-2 text-[#00a3ff] text-sm">ล้างการค้นหา</button>
            </div>
          ) : (
            filtered.map((p, i) => {
              const val = counts[p.nameEn] ?? 0;
              const tier = getTier(val);
              return (
                <div
                  key={p.nameEn}
                  className="group bg-[#1b2537] border border-white/5 rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 hover:border-white/10 transition-all"
                >
                  {/* Left: Province info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-slate-600 text-xs font-mono w-6 text-right shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{p.nameTh}</p>
                      <p className="text-slate-500 text-[11px] truncate">{p.nameEn}</p>
                    </div>
                    <span className={`hidden sm:inline-flex shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.color}`}>
                      {tier.label}
                    </span>
                  </div>

                  {/* Right: Input */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-600 text-xs hidden sm:block">คน</span>
                    <input
                      type="number"
                      min="0"
                      value={val}
                      onChange={e => handleChange(p.nameEn, e.target.value)}
                      className="w-28 h-11 bg-[#0d1522] border border-white/8 rounded-xl px-3 text-right text-white text-sm font-mono focus:outline-none focus:border-[#00a3ff]/60 focus:bg-[#0a0f1a] transition-all"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── STICKY SAVE BAR ──────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-[#0d1522]/90 backdrop-blur-xl border-t border-white/8 px-4 py-4 safe-area-bottom">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold">{totalFilled} / 77 จังหวัดมีข้อมูล</p>
              <p className="text-slate-500 text-xs">{totalPeople.toLocaleString()} คน รวมทั้งหมด</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#0054a5] hover:bg-[#00a3ff] active:scale-95 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 text-sm shadow-[0_0_20px_rgba(0,84,165,0.4)] hover:shadow-[0_0_24px_rgba(0,163,255,0.5)] min-h-[48px] whitespace-nowrap"
            >
              {saving
                ? <><RefreshCw size={16} className="animate-spin" /> กำลังบันทึก...</>
                : <><Save size={16} /> บันทึกข้อมูล</>
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProvinceManager;
