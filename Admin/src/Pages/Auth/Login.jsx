import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../Context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(data.message || 'เข้าสู่ระบบสำเร็จ');
      // login function inside AuthContext already calls navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'ล็อกอินล้มเหลว กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      
      {/* Header */}
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-black text-[#15283c] mb-2">Welcome Back!</h2>
        <p className="text-gray-400">กรุณาลงชื่อเข้าใช้เพื่อจัดการระบบ</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-6">
        
        {/* Email Input */}
        <div className="group">
          <label className="block text-sm font-bold text-[#15283c] mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={20} className="text-gray-400 group-focus-within:text-[#ff5722] transition-colors" />
            </div>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3.5 pl-12 pr-4 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#ff5722] focus:ring-4 focus:ring-[#ff5722]/10 transition-all text-[#15283c] font-medium"
              placeholder="admin@mission.com"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="group">
          <label className="block text-sm font-bold text-[#15283c] mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={20} className="text-gray-400 group-focus-within:text-[#ff5722] transition-colors" />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3.5 pl-12 pr-4 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#ff5722] focus:ring-4 focus:ring-[#ff5722]/10 transition-all text-[#15283c] font-medium"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex justify-end mt-2">
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-[#ff5722] transition-colors">ลืมรหัสผ่าน?</a>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          disabled={loading}
          className="w-full bg-[#15283c] text-white font-bold py-4 rounded-xl hover:bg-[#ff5722] transition-all duration-300 shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 group disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>กำลังเข้าสู่ระบบ...</span>
            </>
          ) : (
            <>
              <span>เข้าสู่ระบบ</span>
              <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

      </form>

      {/* Footer */}
      <div className="mt-8 text-center border-t border-gray-100 pt-6">
        <p className="text-gray-400 text-sm mb-4">ยังไม่มีบัญชีใช่ไหม? <span className="text-[#ff5722] font-bold cursor-pointer">ติดต่อผู้ดูแลระบบ</span></p>
      </div>

    </div>
  );
}