import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/axios';
import { useAuth } from '../../Context/AuthContext';
import toast from 'react-hot-toast';
import {
  Users, UserPlus, Trash2, Shield, ShieldCheck, ShieldAlert,
  KeyRound, Loader2, X, Eye, EyeOff, CheckCircle2,
  RefreshCcw, Crown, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) =>
  role === 'superadmin' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/25">
      <Crown size={9} /> Super Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/15 text-blue-400 border border-blue-500/25">
      <Shield size={9} /> Admin
    </span>
  );

// ─── Reset Password Modal ─────────────────────────────────────────────────────
const ResetModal = ({ targetUser, onClose, onSuccess }) => {
  const [form, setForm]       = useState({ newPass: '', confirm: '', myPass: '' });
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showMy, setShowMy]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) { toast.error('รหัสผ่านยืนยันไม่ตรงกัน'); return; }
    if (form.newPass.length < 6)       { toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัว'); return; }
    if (!form.myPass)                  { toast.error('กรุณาใส่รหัสผ่านของคุณเพื่อยืนยัน'); return; }

    setLoading(true);
    try {
      const res = await api.patch(`/users/${targetUser._id}/force-password-reset`, {
        password: form.newPass,
        superadminPassword: form.myPass,
      });
      toast.success(res.data.message);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const passMatch = form.newPass && form.confirm && form.newPass === form.confirm;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="relative bg-[#1b2537] border border-white/8 rounded-3xl p-7 w-full max-w-md shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <KeyRound size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-white font-black">Reset รหัสผ่าน</p>
              <p className="text-slate-400 text-xs">{targetUser.username}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2.5 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 mb-5">
          <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-400/80 text-xs leading-relaxed">
            Admin คนนี้จะต้องเปลี่ยนรหัสผ่านทันทีเมื่อ Login ครั้งถัดไป
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New password */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">รหัสผ่านใหม่ที่ตั้งให้</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={form.newPass}
                onChange={e => setForm(p => ({ ...p, newPass: e.target.value }))}
                className="w-full bg-[#0d1522] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00a3ff]/60 transition-all pr-10"
                placeholder="อย่างน้อย 6 ตัวอักษร" required />
              <button type="button" onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">ยืนยันรหัสผ่านใหม่</label>
            <input type="password" value={form.confirm}
              onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
              className="w-full bg-[#0d1522] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00a3ff]/60 transition-all"
              placeholder="พิมพ์อีกครั้ง" required />
            {form.newPass && form.confirm && (
              <p className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${passMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                <CheckCircle2 size={11} />{passMatch ? 'ตรงกัน' : 'ไม่ตรงกัน'}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-white/5 pt-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">รหัสผ่านของคุณ (เพื่อยืนยัน)</label>
            <div className="relative">
              <input type={showMy ? 'text' : 'password'} value={form.myPass}
                onChange={e => setForm(p => ({ ...p, myPass: e.target.value }))}
                className="w-full bg-[#0d1522] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 transition-all pr-10"
                placeholder="รหัสผ่าน Super Admin ของคุณ" required />
              <button type="button" onClick={() => setShowMy(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showMy ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-slate-400 bg-white/5 hover:bg-white/10 font-bold text-sm transition-all">
              ยกเลิก
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-black text-sm transition-all">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
              {loading ? 'กำลังรีเซ็ต...' : 'ยืนยัน Reset'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [resetTarget, setTarget]  = useState(null); // user to reset
  const [deleteLoading, setDL]    = useState('');
  const [errorMsg, setErrorMsg]   = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setErrorMsg('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (เฉพาะ Super Admin)');
      } else {
        toast.error('ดึงข้อมูลไม่สำเร็จ');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (u) => {
    if (!window.confirm(`ยืนยันลบบัญชี "${u.username}"?`)) return;
    setDL(u._id);
    try {
      await api.delete(`/users/${u._id}`);
      toast.success('ลบบัญชีสำเร็จ');
      setUsers(prev => prev.filter(x => x._id !== u._id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'ลบไม่สำเร็จ');
    } finally {
      setDL('');
    }
  };

  return (
    <>
      {/* ─── Reset Modal ─── */}
      <AnimatePresence>
        {resetTarget && (
          <ResetModal
            targetUser={resetTarget}
            onClose={() => setTarget(null)}
            onSuccess={fetchUsers}
          />
        )}
      </AnimatePresence>

      <div className="space-y-8 px-1">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
        >
          <div>
            <p className="text-[#00a3ff] text-[10px] font-black tracking-[0.3em] uppercase mb-1">Super Admin</p>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">User Management</h1>
            <p className="text-slate-400 text-sm mt-1 font-light">จัดการบัญชีผู้ดูแลระบบทั้งหมด</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchUsers} className="flex items-center gap-2 text-slate-400 hover:text-[#00a3ff] transition-colors text-sm font-bold">
              <RefreshCcw size={15} /> Refresh
            </button>
            <Link to="/admin/users/add"
              className="flex items-center gap-2 bg-[#0054a5] hover:bg-[#00a3ff] text-white font-bold px-4 py-2.5 rounded-xl transition-all text-sm shadow-[0_0_14px_rgba(0,84,165,0.3)]">
              <UserPlus size={15} /> เพิ่ม Admin
            </Link>
          </div>
        </motion.div>

        {/* Table Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-[#1b2537] border border-white/5 rounded-2xl overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#00a3ff]" size={32} />
            </div>
          ) : errorMsg ? (
            <div className="text-center py-16 text-slate-500">
              <ShieldAlert size={48} className="mx-auto mb-4 text-red-500/50" />
              <p className="font-bold text-red-400">{errorMsg}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">ผู้ใช้งาน</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">สถานะ</th>
                    <th className="text-right px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const isMe = u._id === currentUser?._id;
                    return (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: i * 0.04 } }}
                        className="border-b border-white/3 hover:bg-white/2 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#00a3ff]/10 flex items-center justify-center flex-shrink-0">
                              <ShieldCheck size={16} className="text-[#00a3ff]" />
                            </div>
                            <div>
                              <p className="text-white font-bold">{u.username || u.email || '—'}</p>
                              {isMe && <p className="text-[10px] text-[#00a3ff] font-black">— คุณ</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><RoleBadge role={u.role} /></td>
                        <td className="px-6 py-4">
                          {u.mustChangePassword ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/15 text-red-400 border border-red-500/25">
                              ⚠ ต้องเปลี่ยนรหัส
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                              ✓ ปกติ
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Reset Password — cannot reset own or other superadmins */}
                            {!isMe && u.role !== 'superadmin' && (
                              <button
                                onClick={() => setTarget(u)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all"
                              >
                                <KeyRound size={12} /> Reset Password
                              </button>
                            )}
                            {/* Delete */}
                            {!isMe && (
                              <button
                                onClick={() => handleDelete(u)}
                                disabled={deleteLoading === u._id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all disabled:opacity-50"
                              >
                                {deleteLoading === u._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                ลบ
                              </button>
                            )}
                            {isMe && <span className="text-slate-600 text-xs">—</span>}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <Users size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="font-bold">ไม่มีผู้ใช้งานในระบบ</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
