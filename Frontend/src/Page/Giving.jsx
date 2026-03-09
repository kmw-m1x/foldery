import { motion } from "framer-motion";
import { Heart, Gift, HandHeart, QrCode, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const Giving = () => {
  // Animation Variants (ใช้ชุดเดิมเพื่อความต่อเนื่องของธีม)
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // State สำหรับปุ่ม Copy เลขบัญชี
  const [copied, setCopied] = useState(false);
  const bankAccountNumber = "123-4-56789-0"; // 🔴 ใส่เลขบัญชีจริงที่นี่

  const handleCopy = () => {
    navigator.clipboard.writeText(bankAccountNumber.replace(/-/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ข้อมูลส่วน "ความหมายของการถวาย"
  const teachingPoints = [
    {
      icon: <HandHeart size={32} className="text-[#c78015]" />,
      title: "เราคือผู้ดูแล ไม่ใช่เจ้าของ",
      desc: "ทุกสิ่งที่เรามีล้วนมาจากพระเจ้า เราเป็นเพียงผู้อารักขาที่พระองค์ทรงฝากฝังไว้ การถวายคือการยอมรับว่าพระองค์ทรงเป็นเจ้าของทุกสิ่งในชีวิตเรา",
    },
    {
      icon: <Heart size={32} className="text-[#c78015]" />,
      title: "การถวายคือการนมัสการ",
      desc: "มากกว่าจำนวนเงิน คือท่าทีของหัวใจ การถวายคือการแสดงออกถึงความรัก ความยำเกรง และการจัดลำดับให้พระเจ้าเป็นที่หนึ่งในชีวิต",
    },
    {
      icon: <Gift size={32} className="text-[#c78015]" />,
      title: "สนับสนุนพันธกิจสู่นิรันดร์",
      desc: "ทรัพย์สินทางโลกนั้นชั่วคราว แต่การนำไปใช้เพื่อสนับสนุนงานของพระเจ้า การประกาศ และการสร้างสาวก คือการลงทุนที่มีผลนิรันดร์",
    },
  ];

  return (
    // Theme Colors: ใช้ Palette เดิม (Stone, Zinc, Gold/Bronze)
    <div className="w-full bg-[#FAFAF9] text-[#1C1917] overflow-x-hidden selection:bg-[#c78015] selection:text-white">
      
      {/* Texture overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* หารูปที่มีความหมายเกี่ยวกับการให้ เช่น มือถือต้นไม้, ข้าวสาลี, หรือแสงอุ่นๆ */}
          <img
            src="https://images.unsplash.com/photo-1626771153737-504f1af0876f?auto=format&fit=crop&w=1920&q=80"
            alt="Offering"
            className="w-full h-full object-cover scale-105 filter brightness-[0.7] contrast-[1.1]"
          />
          {/* Gradient Navy overlay */}
          <div className="absolute inset-0 bg-[#0F172A]/60 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block py-2 px-6 border border-white/20 bg-white/5 text-white text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-sm">
              Giving
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg tracking-tight">
              การถวายทรัพย์
            </h1>
            <p className="text-lg md:text-xl text-[#d6d3d1] max-w-xl mx-auto font-light leading-relaxed">
              "เป็นส่วนหนึ่งในการสนับสนุนพันธกิจของเราได้"
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= 2. THE MEANING OF GIVING (คำอธิบาย) ================= */}
      <section className="py-24 container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-6 tracking-tight">
            ทำไมเราถึงถวาย?
          </h2>
          <div className="w-16 h-1 bg-[#c78015] mx-auto mb-6"></div>
          <p className="text-[#57534E] text-lg font-light max-w-2xl mx-auto leading-relaxed">
            การถวายในทางของพระเจ้า ไม่ใช่การเรี่ยไรเงิน หรือเป็นเพียงภาระหน้าที่ และต้องถวายด้วยความสมัครใจ 
            เป็นท่าทีของหัวใจที่ตอบสนองต่อพระคุณอันยิ่งใหญ่ของพระองค์ 
<br />
            <strong className="font-bold pt-50">"เพราะที่ใดมีทรัพย์สมบัติของเจ้า ใจของเจ้าจะอยู่ที่นั่น"</strong><br />
            <strong className=" text-sm tracking-widest uppercase font-bold not-italic" >- มัทธิว 6:21 - </strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-6xl mx-auto">
          {teachingPoints.map((point, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-6 p-5 bg-[#E7E5E4]/50 rounded-full group-hover:bg-[#c78015]/10 transition-colors duration-500">
                {point.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1C1917] mb-4">
                {point.title}
              </h3>
              <p className="text-[#78716C] leading-relaxed font-light">
                {point.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= 3. SCRIPTURE HIGHLIGHT ================= */}
      <section className="py-20 bg-[#1C1917] text-[#FAFAF9] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <Heart size={40} className="text-[#c78015] mx-auto mb-8 opacity-80" />
            <blockquote className="text-2xl md:text-4xl font-mono font-medium leading-snug mb-8">
              “ทุกคนจงให้ตามที่เขาได้คิดหมายไว้ในใจ มิใช่ให้ด้วยนึกเสียดาย มิใช่ให้ด้วยการฝืนใจ เพราะว่าพระเจ้าทรงรักคนนั้นที่ให้ด้วยใจยินดี”
            </blockquote>
            <cite className="text-[#c78015] font-mono text-sm tracking-widest uppercase font-bold not-italic">
              — 2 โครินธ์ 9:7 (THSV11) —
            </cite>
          </motion.div>
        </div>
      </section>

      {/* ================= 4. WAYS TO GIVE (ช่องทางการถวาย) ================= */}
      <section className="py-24 container mx-auto px-6 bg-[#FAFAF9]" id="give-now">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4">
            ช่องทางการถวาย
          </h2>
          <p className="text-[#57534E]">
            ร่วมสนับสนุนพันธกิจของคริสตจักรผ่านช่องทางที่สะดวก
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto items-stretch">
          
          {/* --- Bank Transfer Info --- */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex-1 bg-white p-8 md:p-12 rounded-sm shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#E7E5E4] relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#c78015]/5 rounded-bl-full -z-0"></div>

            <h3 className="text-2xl font-bold text-[#1C1917] mb-8 flex items-center gap-3">
              <Gift className="text-[#c78015]" /> โอนเงินผ่านบัญชีธนาคาร
            </h3>

            <div className="space-y-6">
              <div>
                <p className="text-[#78716C] text-sm uppercase tracking-wider mb-1 font-medium">ธนาคาร (Bank)</p>
                {/* 🔴 แก้ไขชื่อธนาคารจริงที่นี่ */}
                <p className="text-xl font-bold text-[#1C1917]">กสิกรไทย (KBank)</p> 
              </div>
              <div>
                <p className="text-[#78716C] text-sm uppercase tracking-wider mb-1 font-medium">ชื่อบัญชี (Account Name)</p>
                 {/* 🔴 แก้ไขชื่อบัญชีจริงที่นี่ */}
                <p className="text-xl font-bold text-[#1C1917]">คริสตจักรธารพระพร</p>
              </div>
              <div>
                <p className="text-[#78716C] text-sm uppercase tracking-wider mb-2 font-medium">เลขที่บัญชี (Account Number)</p>
                <div className="flex items-center gap-4 bg-[#F5F5F4] p-4 rounded-sm border border-[#E7E5E4]">
                  <span className="text-2xl md:text-3xl font-mono font-bold text-[#c78015] tracking-wider flex-grow truncate">
                    {bankAccountNumber}
                  </span>
                  
                  {/* Copy Button */}
                  <button 
                    onClick={handleCopy}
                    className="p-2 text-[#78716C] hover:text-[#c78015] hover:bg-white rounded transition-all relative tooltip-trigger"
                    title="Copy account number"
                  >
                    {copied ? <CheckCircle2 size={24}className="text-green-600" /> : <Copy size={24} />}
                  </button>
                </div>
                 {copied && <p className="text-green-600 text-sm mt-2 text-right font-medium animate-pulse">คัดลอกเรียบร้อย!</p>}
              </div>
            </div>
          </motion.div>

          {/* --- QR Code --- */}
          <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeInUp}
             transition={{ delay: 0.2 }}
            className="flex-1 bg-[#1C1917] p-8 md:p-12 rounded-sm text-center text-[#FAFAF9] flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-tr-full -z-0"></div>
            
            <QrCode size={48} className="text-[#c78015] mb-6" />
            <h3 className="text-2xl font-bold mb-2">สแกน QR Code</h3>
            <p className="text-[#A1A1AA] mb-8 font-light">เพื่อการโอนที่รวดเร็วผ่าน PromptPay</p>

            {/* 🖼️ Placeholder สำหรับ QR Code จริง */}
            <div className="w-64 h-64 bg-white p-4 rounded-sm mb-8">
                {/* 🔴 เอารูป QR Code จริงของคุณมาใส่แทนที่ src นี้ */}
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                alt="Church QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <p className="text-sm text-[#A1A1AA] font-light">
              *หากต้องการใบเสร็จรับเงินเพื่อลดหย่อนภาษี <br/> กรุณาส่งหลักฐานการโอนมาที่ <a href="">ช่องทางการติดต่อ</a>
            </p>
          </motion.div>

        </div>
      </section>

       {/* ================= FINAL THANKS ================= */}
       <section className="py-16 text-center bg-[#E7E5E4]/30">
         <div className="container mx-auto px-6">
            <p className="text-[#57534E] font-light text-lg leading-relaxed">
              ขอพระเจ้าทรงอวยพระพรและตอบแทนน้ำใจของพี่น้องทุกท่าน <br className="hidden md:block"/>
              ที่ได้มีส่วนร่วมในการขยายแผ่นดินของพระองค์ร่วมกัน
            </p>
         </div>
       </section>

    </div>
  );
};

export default Giving;