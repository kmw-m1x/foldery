import { Facebook, Youtube, Phone, Mail, MapPin, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 

const Footer = () => {
  const { t } = useTranslation(); 

  return (
    <footer className="bg-[#0f172a] text-slate-300 py-12 border-t-4 border-blue-600">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
        
        {/* Column 1: Info & Vision */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
            {t('footer.church_name')}
          </h3>
          <p className="text-sm leading-7 opacity-80 mb-6 font-light">
            {t('footer.description')} 
          </p>
          <div className="flex gap-4">
             {/* Social Icons */}
             <a href="https://www.facebook.com/blezzTYB" target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-blue-600 hover:text-white rounded-full transition-all">
                <Facebook size={20} />
             </a>
             <a href="https://www.youtube.com/@blessingstreamchurch" className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-full transition-all">
                <Youtube size={20} />
             </a>
             <a href="#" className="p-2 bg-white/5 hover:bg-pink-500 hover:text-white rounded-full transition-all">
                <Instagram size={20} />
             </a>
          </div>
        </div>

        {/* Column 2: Schedule */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">{t('footer.service_title')}</h3> {/* 🔵 แปลหัวข้อ */}
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-blue-400 font-bold">{t('footer.sunday_service')}</span> {/* 🔵 แปลวันอาทิตย์ */}
              <span>10:00 - 12:00 น.</span>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">{t('footer.contact_title')}</h3> {/* 🔵 แปลหัวข้อ */}
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
               <MapPin className="text-blue-500 mt-1 shrink-0" size={18} />
               <p>{t('footer.address')}</p>
            </div>
            <div className="flex items-center gap-3">
               <Phone className="text-blue-500 shrink-0" size={18} />
               <p>02-123-4567, 089-999-9999</p>
            </div>
            <div className="flex items-center gap-3">
               <Mail className="text-blue-500 shrink-0" size={18} />
               <p>contact@blessingstream.org</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="container mx-auto px-4 mt-12 pt-6 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p>{t('footer.copyright')}</p> {/* 🔵 แปล Copyright */}
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-blue-400 transition-colors">{t('footer.privacy')}</a> {/* 🔵 แปล Privacy */}
          <a href="#" className="hover:text-blue-400 transition-colors">{t('footer.terms')}</a> {/* 🔵 แปล Terms */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;