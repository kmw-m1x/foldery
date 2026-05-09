import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { motion } from 'framer-motion';
import { Save, Loader2, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';

const inputCls = 'w-full bg-[#0d1522] border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-bold placeholder:text-slate-700 focus:outline-none focus:border-[#00a3ff]/60 focus:ring-1 focus:ring-[#00a3ff]/30 transition-all';

export default function AdminStats() {
  const [formData, setFormData] = useState({
    hearers: 0, targetAreas: 0, decisions: 0,
    baptized: 0, disciples: 0, houseChurches: 0
  });
  const [loading, setLoading]         = useState(false);
  const [initialLoading, setInitial]  = useState(true);
  const [status, setStatus]           = useState({ type: '', message: '' });

  useEffect(() => { fetchCurrentStats(); }, []);

  const fetchCurrentStats = async () => {
    setInitial(true);
    try {
      const res = await api.get('/stats/all');
      const d = res.data[0]?.stats || {};
      setFormData({
        hearers:       d.hearers       || 0,
        targetAreas:   d.targetAreas   || 0,
        decisions:     d.decisions     || 0,
        baptized:      d.baptized      || 0,
        disciples:     d.disciples     || 0,
        houseChurches: d.houseChurches || 0,
      });
    } catch (e) {
      console.error(e);
      setStatus({ type: 'error', message: 'เชื่อมต่อ Server ไม่ได้!' });
    } finally { setInitial(false); }
  };

  const handleChange = (e) => {
    const v = parseInt(e.target.value) || 0;
    setFormData(p => ({ ...p, [e.target.name]: v < 0 ? 0 : v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await api.put('/stats', formData);
      setStatus({ type: 'success', message: 'บันทึกข้อมูลเรียบร้อยแล้ว!' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'บันทึกไม่สำเร็จ กรุณาลองใหม่' });
    } finally { setLoading(false); }
  };

  const fields = [
    { label: 'ผู้ได้ยินข่าวประเสริฐ',  sub: 'Hearers',       name: 'hearers',       accent: '#00a3ff' },
    { label: 'พื้นที่เป้าหมาย',         sub: 'Target Areas',  name: 'targetAreas',   accent: '#f472b6' },
    { label: 'ตัดสินใจเชื่อ',           sub: 'Decisions',     name: 'decisions',     accent: '#a78bfa' },
    { label: 'รับบัพติสมา',             sub: 'Baptized',      name: 'baptized',      accent: '#22d3ee' },
    { label: 'สร้างสาวก',               sub: 'Disciples',     name: 'disciples',     accent: '#34d399' },
    { label: 'คริสตจักรบ้าน',           sub: 'House Churches',name: 'houseChurches', accent: '#fb923c' },
  ];

  if (initialLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#00a3ff]" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-1">

      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
      >
        <div>
          <p className="text-[#00a3ff] text-[10px] font-black tracking-[0.3em] uppercase mb-1">Data</p>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Update Statistics</h1>
          <p className="text-slate-400 text-sm mt-1 font-light">อัปเดตตัวเลขล่าสุดของพันธกิจ</p>
        </div>
        <button
          onClick={fetchCurrentStats}
          className="flex items-center gap-2 text-slate-400 hover:text-[#00a3ff] transition-colors text-sm font-bold self-start sm:self-auto"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </motion.div>

      {/* ─── Form Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}
        className="bg-[#1b2537] border border-white/5 rounded-2xl p-6 md:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map((f) => (
              <div key={f.name} className="group">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: f.accent }} />
                  {f.sub}
                  <span className="font-light text-slate-600 normal-case tracking-normal ml-1">— {f.label}</span>
                </label>
                <input
                  type="number"
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  min={0}
                  className={inputCls}
                  style={{ borderColor: `transparent` }}
                  onFocus={e => e.target.style.borderColor = `${f.accent}60`}
                  onBlur={e => e.target.style.borderColor = 'transparent'}
                />
              </div>
            ))}
          </div>

          {/* ─── Footer ─── */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/5 mt-2">
            <div className="flex-1">
              {status.message && (
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                  ${status.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                >
                  {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {status.message}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-bold bg-[#0054a5] hover:bg-[#00a3ff] disabled:opacity-60 transition-all duration-200 shadow-[0_0_16px_rgba(0,84,165,0.35)] hover:shadow-[0_0_22px_rgba(0,163,255,0.45)] min-w-[180px]"
            >
              <span className="flex items-center justify-center">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              </span>
              <span>{loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}