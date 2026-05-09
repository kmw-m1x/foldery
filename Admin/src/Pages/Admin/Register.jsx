import React, { useState } from 'react';
import api from '../../utils/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Lock, Shield, Loader2, CheckCircle, User, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const inputCls = 'w-full bg-[#0d1522] border border-white/8 rounded-xl px-4 py-3 text-white text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-[#00a3ff]/60 focus:ring-1 focus:ring-[#00a3ff]/30 transition-all';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'admin' });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('สร้างบัญชีสำเร็จ!');
      setSuccess(true);
      setFormData({ username: '', password: '', role: 'admin' });
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างบัญชี');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 px-1">

      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      >
        <p className="text-[#00a3ff] text-[10px] font-black tracking-[0.3em] uppercase mb-1">Management</p>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Add Admin Account</h1>
        <p className="text-slate-400 text-sm mt-1 font-light">สร้างบัญชีผู้ดูแลระบบใหม่สำหรับเข้าใช้งาน Admin Panel</p>
      </motion.div>

      {/* ─── Form Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}
        className="bg-[#1b2537] border border-white/5 rounded-2xl p-6 md:p-8 max-w-xl"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#00a3ff]/10 flex items-center justify-center mb-4">
                <CheckCircle size={36} className="text-[#00a3ff]" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">สร้างบัญชีเรียบร้อย!</h2>
              <p className="text-slate-400 text-sm mb-6">บัญชีนี้สามารถใช้ล็อกอินเข้าสู่ระบบได้ทันที</p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-[#0054a5] hover:bg-[#00a3ff] text-white rounded-xl font-bold transition-all text-sm"
              >
                + สร้างบัญชีเพิ่มเติม
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Username */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  <User size={12} className="text-[#00a3ff]" />
                  Email / Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="admin@mission.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  <Lock size={12} className="text-[#00a3ff]" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  <Shield size={12} className="text-[#00a3ff]" />
                  Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                  >
                    <option value="admin">Admin — ผู้ดูแลระบบ</option>
                    <option value="superadmin">Super Admin — ผู้ดูแลสูงสุด</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
                <p className="text-xs text-slate-600 mt-1.5 ml-0.5">
                  {formData.role === 'superadmin'
                    ? '⚠️ Super Admin มีสิทธิ์จัดการบัญชีผู้ดูแลทั้งหมด'
                    : 'Admin สามารถจัดการข้อมูลและกิจกรรมทั่วไป'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#0054a5] hover:bg-[#00a3ff] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-[0_0_16px_rgba(0,84,165,0.3)] hover:shadow-[0_0_22px_rgba(0,163,255,0.4)]"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                  {loading ? 'กำลังสร้างบัญชี...' : 'ยืนยันสร้างบัญชี'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Register;
