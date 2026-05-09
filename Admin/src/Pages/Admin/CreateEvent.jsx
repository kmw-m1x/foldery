import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  ArrowLeft, Calendar, Clock, MapPin, Tag,
  FileText, UploadCloud, Save, Loader2, Star,
  X, ImagePlus, CheckCircle2,
} from 'lucide-react';

const API = '/events';

const CATEGORIES = ['Community', 'Camp', 'Service', 'Worship', 'Workshop'];
const STATUSES   = [
  { value: 'upcoming',  label: 'Upcoming — กำลังจะมา' },
  { value: 'ongoing',   label: 'Ongoing — กำลังจัด'   },
  { value: 'completed', label: 'Completed — จบแล้ว'   },
  { value: 'cancelled', label: 'Cancelled — ยกเลิก'   },
];

const initialForm = {
  title: '', desc: '', detail: '', image: '',
  category: 'Community', startDate: '', endDate: '',
  displayTime: '', location: '', address: '',
  status: 'upcoming', isFeatured: false,
};

const Label = ({ icon, children, required }) => (
  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
    {icon && <span className="text-[#00a3ff]">{icon}</span>}
    {children}
    {required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const inputCls = 'w-full bg-[#0d1522] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00a3ff]/60 focus:bg-[#0a0f1a] transition-all';

// ─── Image Upload Zone ────────────────────────────────────────────────────────
const ImageUploader = ({ value, onChange }) => {
  const inputRef  = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging]   = useState(false);

  const doUpload = useCallback(async (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      toast.error('รองรับเฉพาะ JPG, PNG, WEBP, GIF เท่านั้น');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('ขนาดไฟล์ต้องไม่เกิน 10 MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    const toastId = toast.loading('กำลังอัปโหลดรูป...');
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.url);
      toast.success('อัปโหลดสำเร็จ!', { id: toastId });
    } catch (err) {
      toast.error('อัปโหลดล้มเหลว กรุณาลองใหม่', { id: toastId });
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) doUpload(file);
  }, [doUpload]);

  const onPick = (e) => {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
  };

  return (
    <div>
      <Label icon={<ImagePlus size={13} />} required>ภาพปกกิจกรรม (Cover Image)</Label>

      {/* Preview */}
      {value && !uploading && (
        <div className="relative mb-3 h-44 rounded-2xl overflow-hidden border border-white/10 group">
          <img src={value} alt="preview" className="w-full h-full object-cover brightness-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-white/70 text-xs font-medium">อัปโหลดสำเร็จ</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-3 right-3 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Drop Zone */}
      {!value && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 py-10 cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-[#00a3ff] bg-[#00a3ff]/5'
              : 'border-white/10 bg-[#0d1522] hover:border-[#00a3ff]/40 hover:bg-[#00a3ff]/5'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="animate-spin text-[#00a3ff]" />
              <p className="text-slate-400 text-sm font-medium">กำลังอัปโหลด...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#00a3ff]/10 flex items-center justify-center">
                <UploadCloud size={22} className="text-[#00a3ff]" />
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-bold">ลากรูปมาวาง หรือ คลิกเพื่อเลือกไฟล์</p>
                <p className="text-slate-500 text-xs mt-1">JPG, PNG, WEBP · สูงสุด 10 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Change button when image exists */}
      {value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#00a3ff] font-bold transition-colors"
        >
          <UploadCloud size={13} /> เปลี่ยนรูป
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CreateEvent = () => {
  const navigate  = useNavigate();
  const [form, setForm]     = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.desc || !form.detail || !form.image || !form.startDate || !form.location) {
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบ (รวมถึงการอัปโหลดรูปภาพ)');
      return;
    }
    setSaving(true);
    const toastId = toast.loading('กำลังบันทึก...');
    try {
      await api.post(API, {
        ...form,
        startDate: new Date(form.startDate),
        endDate:   form.endDate ? new Date(form.endDate) : undefined,
      });
      toast.success('สร้างกิจกรรมสำเร็จ! 🎉', { id: toastId });
      setTimeout(() => navigate('/events'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1b2537', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Kanit, sans-serif' },
        success: { iconTheme: { primary: '#00a3ff', secondary: '#fff' } },
      }} />

      <div className="min-h-screen bg-[#0d1522] font-['Kanit'] pb-20">

        {/* ─── TOP BAR ─── */}
        <div className="sticky top-0 z-40 bg-[#0d1522]/95 backdrop-blur-xl border-b border-white/5 px-5 md:px-10 py-4 flex items-center gap-4">
          <Link to="/events" className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <p className="text-[#00a3ff] text-[10px] font-black tracking-[0.3em] uppercase">Create</p>
            <h1 className="text-lg font-black text-white tracking-tight leading-tight">สร้างกิจกรรมใหม่</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-[#0054a5] hover:bg-[#00a3ff] disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-[0_0_14px_rgba(0,84,165,0.3)]"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>

        {/* ─── FORM ─── */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-5 md:px-10 py-8 space-y-6">

          {/* ── Section: ข้อมูลหลัก ── */}
          <div className="bg-[#1b2537] border border-white/5 rounded-2xl p-6 space-y-5">
            <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">ข้อมูลหลัก</p>

            <div>
              <Label icon={<FileText size={13} />} required>ชื่อกิจกรรม (Title)</Label>
              <input className={inputCls} placeholder="เช่น นมัสการพระเจ้าเช้าวันอาทิตย์"
                value={form.title} onChange={e => set('title', e.target.value)} />
            </div>

            <div>
              <Label icon={<FileText size={13} />} required>คำโปรยสั้นๆ (Description)</Label>
              <textarea className={inputCls} rows={2} placeholder="สรุปกิจกรรมสั้นๆ 1-2 ประโยค"
                value={form.desc} onChange={e => set('desc', e.target.value)} />
            </div>

            <div>
              <Label required>เนื้อหาละเอียด (Detail)</Label>
              <textarea className={inputCls} rows={4} placeholder="รายละเอียดครบถ้วน โปรแกรม กำหนดการ ฯลฯ"
                value={form.detail} onChange={e => set('detail', e.target.value)} />
            </div>

            {/* ── Image Upload ── */}
            <ImageUploader value={form.image} onChange={url => set('image', url)} />
          </div>

          {/* ── Section: หมวดหมู่ & สถานะ ── */}
          <div className="bg-[#1b2537] border border-white/5 rounded-2xl p-6 space-y-5">
            <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">หมวดหมู่ & สถานะ</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label icon={<Tag size={13} />} required>หมวดหมู่ (Category)</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} type="button" onClick={() => set('category', cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        form.category === cat
                          ? 'bg-[#00a3ff] text-white border-[#00a3ff]'
                          : 'bg-white/5 text-slate-400 border-white/8 hover:text-white'
                      }`}
                    >{cat}</button>
                  ))}
                </div>
              </div>

              <div>
                <Label>สถานะ (Status)</Label>
                <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button type="button" onClick={() => set('isFeatured', !form.isFeatured)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  form.isFeatured
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-white/5 text-slate-500 border-white/8 hover:text-white'
                }`}
              >
                <Star size={14} fill={form.isFeatured ? 'currentColor' : 'none'} />
                {form.isFeatured ? 'กิจกรรมแนะนำ (Featured)' : 'ตั้งเป็นกิจกรรมแนะนำ'}
              </button>
            </div>
          </div>

          {/* ── Section: วันเวลา ── */}
          <div className="bg-[#1b2537] border border-white/5 rounded-2xl p-6 space-y-5">
            <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">วันเวลา</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label icon={<Calendar size={13} />} required>วันเริ่ม (Start Date)</Label>
                <input className={inputCls} type="date"
                  value={form.startDate} onChange={e => set('startDate', e.target.value)} />
              </div>
              <div>
                <Label icon={<Calendar size={13} />}>วันสิ้นสุด (End Date)</Label>
                <input className={inputCls} type="date"
                  value={form.endDate} onChange={e => set('endDate', e.target.value)} />
              </div>
            </div>

            <div>
              <Label icon={<Clock size={13} />}>เวลาแสดงผล เช่น "09:00 - 12:00 น."</Label>
              <input className={inputCls} placeholder="09:00 - 12:00 น."
                value={form.displayTime} onChange={e => set('displayTime', e.target.value)} />
            </div>
          </div>

          {/* ── Section: สถานที่ ── */}
          <div className="bg-[#1b2537] border border-white/5 rounded-2xl p-6 space-y-5">
            <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">สถานที่</p>

            <div>
              <Label icon={<MapPin size={13} />} required>ชื่อสถานที่</Label>
              <input className={inputCls} placeholder="เช่น Main Sanctuary Hall"
                value={form.location} onChange={e => set('location', e.target.value)} />
            </div>

            <div>
              <Label>ที่อยู่เพิ่มเติม (Address)</Label>
              <textarea className={inputCls} rows={2} placeholder="เลขที่ ถนน ตำบล อำเภอ จังหวัด"
                value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
          </div>

          {/* Submit button */}
          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#0054a5] hover:bg-[#00a3ff] disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-all duration-200 text-base shadow-[0_0_20px_rgba(0,84,165,0.35)] hover:shadow-[0_0_28px_rgba(0,163,255,0.45)]"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'กำลังบันทึก...' : 'บันทึกกิจกรรม'}
          </button>

        </form>
      </div>
    </>
  );
};

export default CreateEvent;
