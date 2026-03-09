import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

// 👇 บรรทัดนี้แหละที่มึงขาดไป "export default"
export default function Login() {
  
  const handleLogin = (e) => {
    e.preventDefault();
    alert("เดี๋ยวค่อยทำระบบ Login ต่อนะจารย์ ตอนนี้แค่หน้ากากก่อน");
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
              type="email" 
              className="w-full py-3.5 pl-12 pr-4 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#ff5722] focus:ring-4 focus:ring-[#ff5722]/10 transition-all text-[#15283c] font-medium"
              placeholder="admin@mission.com"
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
              className="w-full py-3.5 pl-12 pr-4 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#ff5722] focus:ring-4 focus:ring-[#ff5722]/10 transition-all text-[#15283c] font-medium"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end mt-2">
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-[#ff5722] transition-colors">ลืมรหัสผ่าน?</a>
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full bg-[#15283c] text-white font-bold py-4 rounded-xl hover:bg-[#ff5722] transition-all duration-300 shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 group">
          <span>เข้าสู่ระบบ</span>
          <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

      </form>

      {/* Footer / Bypass Link (เอาไว้เทส) */}
      <div className="mt-8 text-center border-t border-gray-100 pt-6">
        <p className="text-gray-400 text-sm mb-4">ยังไม่มีบัญชีใช่ไหม? <span className="text-[#ff5722] font-bold cursor-pointer">ติดต่อผู้ดูแลระบบ</span></p>
        
        <Link to="/" className="inline-block px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
          🚀 ทางลับ (Back to Dashboard)
        </Link>
      </div>

    </div>
  );
}