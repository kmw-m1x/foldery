import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Menu, X, Heart } from 'lucide-react';
import i18n from '../i18n';

const Navbar = () => {
  const { t } = useTranslation(); 
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentLang = i18n.language || 'en';
  const isThai = currentLang.startsWith('th');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(isThai ? 'en' : 'th');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { to: "/", label: "menu.home" },
    { to: "/about", label: "menu.about" },
    { to: "/events", label: "menu.activity" },
    { to: "/mission", label: "menu.mission" }, // ใช้คำทับศัพท์ไปเลย หรือจะใช้ key ก็ได้
    { to: "/contact", label: "menu.contact" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 border-b border-white/5
      ${scrolled 
        ? 'h-16 md:h-20 bg-[#0f172a]/95 backdrop-blur-md shadow-lg opacity-80 ' 
        : 'h-20 md:h-24 bg-gradient-to-r from-[#0f172a] to-[#0054a5] '
      }`}
    >
      {/* Container หลักต้องเป็น relative เพื่อให้ตัวลูก absolute อิงกับตัวนี้ */}
      <div className="container mx-auto px-4 h-full flex justify-between items-center relative">
        
        {/* ================= Logo Section ================= */}
        {/* ใส่ z-50 เพื่อให้แน่ใจว่าอยู่ชั้นบนสุด และ shrink-0 ไม่ให้โดนบีบ */}
        <Link to="/" className="flex items-center gap-3 group z-50 relative shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src="/icon.png" 
              alt="Logo" 
              className="relative h-10 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
            />
          </div>
          
          <div className="flex flex-col">
            {/* truncate & max-w: กันชื่อยาวเกินไปจนไปชนเมนู */}
            <span className="hidden lg:block font-bold text-lg md:text-xl text-white tracking-wide leading-none truncate max-w-[200px] xl:max-w-none">
               {t('NameChurch')}
            </span>
            <span className="hidden lg:block text-[10px] text-blue-400 uppercase tracking-[0.2em] font-medium mt-1">
               Blessing Stream Community
            </span>
            <span className="block lg:hidden font-bold text-xl text-white tracking-wider">BSC</span>
          </div>
        </Link>

        {/* ================= Desktop Menu (Absolute Center + Fixed Width) ================= */}
        {/* 1. absolute left-1/2 top-1/2 ... : สั่งให้ลอยอยู่กลางจอเป๊ะๆ
            2. min-w-[550px] : จองความกว้างขั้นต่ำไว้ 550px (กันกระตุกเวลาเปลี่ยนภาษา)
            3. justify-center : จัดเมนูให้อยู่กลางกล่องที่จองไว้
        */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-0.5 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-sm z-40 justify-center transition-all duration-300">
          {menuItems.map((link) => {
            const isActive = link.to === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(link.to);

            return (
              <Link 
                key={link.to}
                to={link.to} 
                className={`px-3 md:px-4 lg:px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 relative whitespace-nowrap
                  ${isActive 
                    ? "text-[#0f172a] bg-white shadow-sm font-bold" 
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                  {link.label.startsWith('menu.') ? t(link.label) : link.label}
              </Link>
            );
          })}
        </div>

        {/* ================= Right Section ================= */}
        <div className="flex items-center gap-3 md:gap-4 z-50 shrink-0">
          
          {/* Language Switcher */}
          <button 
             onClick={toggleLanguage}
             className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium px-2"
          >
             <span className="uppercase">{isThai ? 'TH' : 'EN'}</span>
             <ChevronDown size={14} className="opacity-50" />
          </button>

          {/* Donate Button */}
          <Link to="/giving">
            <button className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:bg-blue-500 hover:-translate-y-0.5 flex items-center gap-2">
              <Heart size={16} className="fill-white" />
              <span className="hidden sm:inline">{t('donate')}</span>
            </button>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* ================= Mobile Menu Dropdown ================= */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-[#0f172a] border-b border-white/10 shadow-2xl transition-all duration-300 origin-top overflow-hidden ${
        isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="flex flex-col p-6 space-y-4">
          {menuItems.map((link) => {
             const isActive = link.to === '/' 
             ? location.pathname === '/' 
             : location.pathname.startsWith(link.to);

             return (
              <Link 
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium transition-colors flex items-center gap-3
                  ${isActive ? 'text-blue-400 font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]"></div>}
                {link.label.startsWith('menu.') ? t(link.label) : link.label}
              </Link>
             )
          })}
          
          <div className="h-px bg-white/10 my-4"></div>
          
          {/* Mobile Lang Options */}
          <div className="flex gap-3">
             <button 
                onClick={() => changeLanguage('th')}
                className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${isThai ? 'bg-blue-600 text-white border-blue-600' : 'border-white/20 text-slate-400'}`}
             >
               ภาษาไทย
             </button>
             <button 
                onClick={() => changeLanguage('en')}
                className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${!isThai ? 'bg-blue-600 text-white border-blue-600' : 'border-white/20 text-slate-400'}`}
             >
               English
             </button>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;