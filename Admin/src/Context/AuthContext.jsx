import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // เก็บข้อมูล user { email, role, token }
  const navigate = useNavigate();

  // 1. โหลดข้อมูลจาก LocalStorage ตอนเปิดเว็บมา (กัน Refresh แล้วหลุด)
  useEffect(() => {
    const storedUser = localStorage.getItem("mission_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. ฟังก์ชัน Login (รับ Token มาเก็บ)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("mission_user", JSON.stringify(userData));
    
    // เช็ค Role เพื่อพาไปหน้าแรกที่เหมาะสม
    if (userData.role === 'admin') {
      navigate('/');
    } else {
      navigate('/'); // หรือพาไปหน้าอื่นตาม Role
    }
  };

  // 3. ฟังก์ชัน Logout (ล้างทิ้ง)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("mission_user");
    navigate('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook สั้นๆ เอาไว้เรียกใช้ง่ายๆ
export const useAuth = () => useContext(AuthContext);