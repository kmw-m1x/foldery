import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import { Lock, ShieldAlert, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const inputCls = 'w-full bg-[#0d1522] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00a3ff]/60 transition-all';

export default function ChangePassword() {
  const { setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ newPass: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCon, setShowCon] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      toast.error('รหัสผ่านยืนยันไม่ตรงกัน');
      return;
    }
    if (form.newPass.length < 6) {
      toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setLoading(true);
    try {
      await api.patch('/users/self/change-password', { newPassword: form.newPass });
      toast.success('เปลี่ยนรหัสผ่านสำเร็จ! กำลังพาไปหน้า Dashboard...');
      // Update user state to clear mustChangePassword
      setUser(prev => ({ ...prev, mustChangePassword: false }));
      setTimeout(() => navigate('/admin/dashboard', { replace: true }), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const passMatch = form.newPass && form.confirm && form.newPass === form.confirm;
  const passMismatch = form.newPass && form.confirm && form.newPass !== form.confirm;

  return (
    <div className="min-h-screen bg-[#0d1522] flex items-center justify-center p-5 font-['Kanit']">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Warning Banner */}
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl px-5 py-4 mb-6">
          <ShieldAlert size={22} className="text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-amber-400 font-black text-sm">รหัสผ่านถูกรีเซ็ตโดยผู้ดูแล</p>
            <p className="text-amber-400/70 text-xs mt-0.5">กรุณาตั้งรหัสผ่านใหม่ก่อนเข้าใช้งานระบบ</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1b2537] border border-white/5 rounded-3xl p-8">
          <div className="mb-7">
            <div className="w-14 h-14 rounded-2xl bg-[#00a3ff]/10 flex items-center justify-center mb-4">
              <Lock size={26} className="text-[#00a3ff]" />
            </div>
            <h1 className="text-2xl font-black text-white">ตั้งรหัสผ่านใหม่</h1>
            <p className="text-slate-400 text-sm mt-1">เลือกรหัสผ่านที่คาดเดายากและจำได้ง่าย</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">รหัสผ่านใหม่</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} value={form.newPass}
                  onChange={e => setForm(p => ({ ...p, newPass: e.target.value }))}
                  className={`${inputCls} pr-10`} placeholder="อย่างน้อย 6 ตัวอักษร" required />
                <button type="button" onClick={() => setShowNew(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">ยืนยันรหัสผ่านใหม่</label>
              <div className="relative">
                <input type={showCon ? 'text' : 'password'} value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  className={`${inputCls} pr-10`} placeholder="พิมพ์อีกครั้ง" required />
                <button type="button" onClick={() => setShowCon(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showCon ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Match indicator */}
            {(passMatch || passMismatch) && (
              <p className={`text-xs font-bold flex items-center gap-1.5 ${passMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                <CheckCircle2 size={13} />
                {passMatch ? 'รหัสผ่านตรงกัน ✓' : 'รหัสผ่านไม่ตรงกัน'}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#0054a5] hover:bg-[#00a3ff] disabled:opacity-60 text-white font-black py-3.5 rounded-xl transition-all shadow-[0_0_16px_rgba(0,84,165,0.35)]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
              {loading ? 'กำลังบันทึก...' : 'ยืนยันรหัสผ่านใหม่'}
            </button>
          </form>

          <button onClick={logout}
            className="w-full mt-4 text-xs text-slate-500 hover:text-red-400 transition-colors font-bold">
            ออกจากระบบแทน
          </button>
        </div>
      </motion.div>
    </div>
  );
}
