import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import {
  User, Lock, Shield, LogOut, Loader2, CheckCircle2, Eye, EyeOff
} from 'lucide-react';

const inputCls = 'w-full bg-[#0d1522] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00a3ff]/60 transition-all';

export default function Settings() {
  const { user, logout } = useAuth();

  const [pwForm, setPwForm]       = useState({ current: '', newPass: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [showCur, setShowCur]     = useState(false);
  const [showNew, setShowNew]     = useState(false);

  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPass !== pwForm.confirm) {
      toast.error('รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน');
      return;
    }
    if (pwForm.newPass.length < 6) {
      toast.error('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    setPwLoading(true);
    try {
      // เรียก reset-password ของตัวเอง (ใช้ user._id จาก context)
      await api.put(`/users/${user._id}/reset-password`, { password: pwForm.newPass });
      toast.success('เปลี่ยนรหัสผ่านสำเร็จ!');
      setPwForm({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setPwLoading(false);
    }
  };

  const roleLabel = user?.role === 'superadmin' ? 'Super Admin 👑' : 'Admin';
  const roleBadge = user?.role === 'superadmin'
    ? 'bg-amber-500/15 text-amber-400 border-amber-500/25'
    : 'bg-blue-500/15 text-blue-400 border-blue-500/25';

  return (
    <div className="space-y-8 px-1 max-w-2xl">

      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[#00a3ff] text-[10px] font-black tracking-[0.3em] uppercase mb-1">Account</p>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 text-sm mt-1 font-light">จัดการข้อมูลบัญชีและความปลอดภัย</p>
      </motion.div>

      {/* ─── Profile Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
        className="bg-[#1b2537] border border-white/5 rounded-2xl p-6"
      >
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-5">โปรไฟล์</p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#00a3ff]/15 flex items-center justify-center flex-shrink-0">
            <User size={26} className="text-[#00a3ff]" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-tight">{user?.username || '—'}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${roleBadge}`}>
                <Shield size={10} />
                {roleLabel}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Change Password Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-[#1b2537] border border-white/5 rounded-2xl p-6"
      >
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
          <Lock size={11} className="text-[#00a3ff]" />
          เปลี่ยนรหัสผ่าน
        </p>

        <form onSubmit={handlePwChange} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">รหัสผ่านใหม่</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={pwForm.newPass}
                onChange={e => setPwForm(p => ({ ...p, newPass: e.target.value }))}
                className={`${inputCls} pr-10`}
                placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)"
                required
              />
              <button type="button" onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">ยืนยันรหัสผ่านใหม่</label>
            <div className="relative">
              <input
                type={showCur ? 'text' : 'password'}
                value={pwForm.confirm}
                onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                className={`${inputCls} pr-10`}
                placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                required
              />
              <button type="button" onClick={() => setShowCur(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showCur ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Match indicator */}
          {pwForm.newPass && pwForm.confirm && (
            <p className={`text-xs font-bold flex items-center gap-1.5 ${pwForm.newPass === pwForm.confirm ? 'text-emerald-400' : 'text-red-400'}`}>
              <CheckCircle2 size={13} />
              {pwForm.newPass === pwForm.confirm ? 'รหัสผ่านตรงกัน' : 'รหัสผ่านไม่ตรงกัน'}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={pwLoading}
              className="flex items-center gap-2 bg-[#0054a5] hover:bg-[#00a3ff] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm shadow-[0_0_14px_rgba(0,84,165,0.3)]"
            >
              {pwLoading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
              {pwLoading ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ─── Danger Zone ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}
        className="bg-[#1b2537] border border-red-500/10 rounded-2xl p-6"
      >
        <p className="text-[10px] font-black text-red-400/70 uppercase tracking-widest mb-5">ออกจากระบบ</p>
        <p className="text-slate-400 text-sm mb-4">ออกจากระบบทั้งหมดและล้าง Session ปัจจุบัน</p>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-5 py-2.5 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all text-sm"
        >
          <LogOut size={15} />
          ออกจากระบบ
        </button>
      </motion.div>

    </div>
  );
}
