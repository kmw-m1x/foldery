import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Facebook, MessageCircle, Send, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios"; 

const Contact = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // ✅ Form State: เก็บค่าจาก Input
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "ติดต่อสอบถามทั่วไป", // ค่า Default
    message: ""
  });

  const [formStatus, setFormStatus] = useState("idle"); // idle, submitting, success, error

  // ✅ Function จัดการเมื่อพิมพ์ข้อมูล
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Function ส่งข้อมูลไป Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      // ⚠️ เปลี่ยน URL ให้ตรงกับ Backend 
      await axios.post("http://localhost:3000/api/contact", formData);
      
      setFormStatus("success");
      // เคลียร์ฟอร์มหลังส่งเสร็จ
      setFormData({ name: "", phone: "", subject: "ติดต่อสอบถามทั่วไป", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus("error");
    }
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} />,
      title: "ที่ตั้งคริสตจักร",
      line1: "123 หมู่ 4 ถนนพหลโยธิน",
      line2: "ตำบลนางแล อำเภอเมือง จังหวัดเชียงราย 57100",
    },
    {
      icon: <Phone size={24} />,
      title: "เบอร์โทรศัพท์",
      line1: "081-234-5678 (อ.สมชาย)",
      line2: "053-123-456 (สำนักงาน)",
    },
    {
      icon: <Mail size={24} />,
      title: "อีเมล",
      line1: "contact@streamofblessing.com",
      line2: "office@streamofblessing.com",
    },
    {
      icon: <Clock size={24} />,
      title: "รอบนมัสการ",
      line1: "วันอาทิตย์: 09:00 - 12:00 น.",
      line2: "วันพุธ (อธิษฐาน): 19:00 - 20:00 น.",
    },
  ];

  return (
    // Theme Colors: Stone Base + Gold Accent
    <div className="w-full bg-[#FAFAF9] text-[#1C1917] font-sans overflow-x-hidden selection:bg-[#c78015] selection:text-white">
      
      {/* Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      {/* ================= 1. HERO HEADER ================= */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
            alt="Contact Us"
            className="w-full h-full object-cover scale-105 filter brightness-[0.6] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-[#0F172A]/50 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block py-2 px-6 border border-white/20 bg-white/5 text-white text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-sm">
              Contact
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg tracking-tight">
              ติดต่อเรา
            </h1>
            <p className="text-[#d6d3d1] font-light text-lg">
              เราพร้อมรับฟังและเดินเคียงข้างคุณเสมอ
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= 2. CONTENT GRID (Info & Form) ================= */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* ----- Left: Contact Information ----- */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-6">
                ช่องทางการติดต่อ
              </h2>
              <div className="w-16 h-1 bg-[#c78015] mb-6"></div>
              <p className="text-[#57534E] leading-relaxed">
                หากท่านมีคำถาม ต้องการคำปรึกษา หรืออยากทราบข้อมูลเพิ่มเติมเกี่ยวกับคริสตจักร 
                สามารถติดต่อเราได้ตามช่องทางด้านล่าง
              </p>
            </div>

            {/* Info List */}
            <div className="space-y-10">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-6 group">
                  <div className="p-4 bg-[#E7E5E4] rounded-sm text-[#c78015] group-hover:bg-[#c78015] group-hover:text-white transition-colors duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1C1917] mb-1">{info.title}</h3>
                    <p className="text-[#57534E]">{info.line1}</p>
                    <p className="text-[#57534E]">{info.line2}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="mt-16 pt-10 border-t border-[#E7E5E4]">
              <h3 className="text-lg font-bold text-[#1C1917] mb-6">ติดตามข่าวสาร</h3>
              <div className="flex gap-4">
                <a href="#" className="flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-sm hover:opacity-90 transition-opacity font-medium">
                  <Facebook size={20} /> Facebook
                </a>
                <a href="#" className="flex items-center gap-2 px-6 py-3 bg-[#06C755] text-white rounded-sm hover:opacity-90 transition-opacity font-medium">
                  <MessageCircle size={20} /> Line
                </a>
              </div>
            </div>
          </motion.div>

          {/* ----- Right: Contact Form ----- */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#E7E5E4] relative"
          >
            <h2 className="text-2xl font-bold text-[#1C1917] mb-8">ส่งข้อความถึงเรา</h2>
            
            {formStatus === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <Send size={32} />
                </div>
                <h3 className="text-2xl font-bold text-[#1C1917] mb-2">ส่งข้อความสำเร็จ!</h3>
                <p className="text-[#57534E]">ขอบคุณที่ติดต่อมา เราจะรีบตอบกลับโดยเร็วที่สุด</p>
                <button 
                  onClick={() => setFormStatus("idle")}
                  className="mt-8 text-[#c78015] font-bold hover:underline"
                >
                  ส่งข้อความใหม่
                </button>
              </div>
            ) : formStatus === "error" ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <div className="text-red-500 mb-4 text-lg font-bold">เกิดข้อผิดพลาดในการส่งข้อมูล</div>
                    <button 
                        onClick={() => setFormStatus("idle")}
                        className="text-[#1C1917] underline hover:text-[#c78015]"
                    >
                        ลองใหม่อีกครั้ง
                    </button>
                </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] mb-2 group-focus-within:text-[#c78015] transition-colors">
                      ชื่อ - นามสกุล (Name)
                    </label>
                    <input 
                      type="text" 
                      name="name" // ✅ ต้องมี name ให้ตรงกับ state
                      value={formData.name} // ✅ ผูกค่ากับ state
                      onChange={handleChange} // ✅ ใส่ function
                      required
                      className="w-full border-b border-[#D6D3D1] bg-transparent py-2 text-[#1C1917] focus:outline-none focus:border-[#c78015] transition-colors placeholder:text-[#d6d3d1]"
                      placeholder="ระบุชื่อของคุณ"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] mb-2 group-focus-within:text-[#c78015] transition-colors">
                      เบอร์โทรศัพท์ (Phone)
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full border-b border-[#D6D3D1] bg-transparent py-2 text-[#1C1917] focus:outline-none focus:border-[#c78015] transition-colors placeholder:text-[#d6d3d1]"
                      placeholder="0xx-xxx-xxxx"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] mb-2 group-focus-within:text-[#c78015] transition-colors">
                    หัวข้อเรื่อง (Subject)
                  </label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border-b border-[#D6D3D1] bg-transparent py-2 text-[#1C1917] focus:outline-none focus:border-[#c78015] transition-colors"
                  >
                    <option>ติดต่อสอบถามทั่วไป</option>
                    <option>ขอคำปรึกษา</option>
                    <option>แจ้งความประสงค์เยี่ยมเยียน</option>
                    <option>อื่นๆ</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] mb-2 group-focus-within:text-[#c78015] transition-colors">
                    ข้อความ (Message)
                  </label>
                  <textarea 
                    rows="4"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-[#D6D3D1] bg-transparent py-2 text-[#1C1917] focus:outline-none focus:border-[#c78015] transition-colors resize-none placeholder:text-[#d6d3d1]"
                    placeholder="พิมพ์ข้อความของคุณที่นี่..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus === "submitting"}
                  className="w-full bg-[#1C1917] text-white py-4 font-bold tracking-wide hover:bg-[#c78015] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formStatus === "submitting" ? (
                    <>
                        <Loader2 className="animate-spin" size={20} /> กำลังส่ง...
                    </>
                  ) : (
                    <>ส่งข้อความ <ArrowRight size={20} /></>
                  )}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </section>

      {/* ================= 3. MAP SECTION ================= */}
      <section className="h-[400px] w-full bg-[#E7E5E4] relative">
        <iframe 
          title="Church Map"
          // เปลี่ยน URL ตรงนี้เป็น Embed Link จาก Google Map ของโบสถ์จริง
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.188701967812!2d99.8723!3d20.0269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDAxJzM2LjgiTiA5OcKwNTInMjAuMyJF!5e0!3m2!1sen!2sth!4v1634567890123!5m2!1sen!2sth" 
          width="100%" 
          height="100%" 
          style={{ border: 0, filter: "grayscale(100%) contrast(1.2) brightness(0.9)" }} 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
        
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#FAFAF9] to-transparent pointer-events-none"></div>
      </section>

    </div>
  );
};

export default Contact;