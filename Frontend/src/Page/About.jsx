import { motion } from "framer-motion";
import { BookOpen, Heart, Users, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const stories = [
  { year: "2008", title: "จุดเริ่มต้นแห่งการทรงเรียก", desc: "พระเจ้าทรงเรียกครอบครัวของอาจารย์ไพศาลให้ขึ้นมารับใช้พระองค์ที่จังหวัดเชียงราย", detail: "โดยมีภาพนิมิตของแม่น้ำแห่งพระพรไหลท่วมท้นลงมาจากจังหวัดสูงสุดของประเทศแล้วขยายออกจนเป็นพรทั่วประเทศไทย", img: "/bg/begin.avif" },
  { year: "จุดยุทธศาสตร์", title: "เชียงราย", desc: "เชียงรายเป็นจุดยุทธศาสตร์สำคัญ", detail: 'เนื่องจากเป็นจังหวัดที่เชื่อมต่อกับประเทศลาว พม่า และเชื่อมต่อกับประเทศจีน ซึ่งเป็นพันธกิจมิชชั่นที่ทางคริสตจักรสนใจเป็นพิเศษ จึงตัดสินใจตั้งคริสตจักรใหม่ ภายใต้การร่วมมือกับองค์กร Thailand Campus Crusade for Christ (TCCC) ให้ชื่อว่า "คริสตจักรธารพระพร"', img: "/bg/cix.avif" },
  { year: "ยุคแรก", title: "นักศึกษาคืออนาคต", desc: "สังเกตแรกๆ นั้นการนมัสการยังมีน้อย", detail: "จึงใช้โอกาสนั้นในการดูความสามารถและความพร้อมของกลุ่มนักศึกษาจาก ม.แม่ฟ้าหลวง และ ม.ราชภัฏเชียงรายที่หอพักศาลาหลังบ้านอาจารย์ไพศาล", img: "/bg/first.avif" },
  { year: "นิมิตร", title: "วิสัยทัศน์จากพระเจ้า", desc: "นิมิตที่พระเจ้าให้แก่เราคือ", detail: '\u201cจับคนในเมืองใหญ่ มหาวิทยาลัยหลัก อบรมและส่งเขาออกไปเป็นพร\u201d คริสตจักรธารพระพร เห็นความสำคัญของนักศึกษา จึงประกาศและสร้างสาวกในกลุ่มวัยรุ่น', img: "/bg/dreams.avif" },
  { year: "2010", title: "ก่อสร้างศูนย์แห่งใหม่", desc: "คริสตจักรธารพระพร ได้ซื้อที่ดิน", detail: "และก่อสร้างศูนย์แห่งใหม่ เพื่อใช้เป็นที่อบรม นมัสการ ที่พัก แล้วเสร็จในปี ค.ศ. 2011", img: "/bg/2010.avif" },
  { year: "พ.ค. 2010", title: "คริสตจักรลูกแห่งแรก", desc: "คริสตจักรธารพระพรพะเยา", detail: "โดยมีผู้รับใช้ในขณะนั้น คือ พี่คลิ๊กเป็นผู้ก่อตั้ง และพี่ป้องตามไปสมทบในภายหลัง ดูแลมาถึงปัจจุบัน", img: "/bg/firstnode.avif" },
  { year: "2013", title: "งอกงามไปยังเมืองใหญ่", desc: "ธารพระพรธัญบุรี", detail: '\u201cคริสตจักรธารพระพรธัญบุรี\u201d ขึ้นใต้หอมณีโชติ สมาชิกกลุ่มแรกคือศิษย์เก่าเชียงราย โดยความร่วมมือของพี่วู๊ดดี้ กับพี่เอ็ม', img: "/bg/thanya.avif" },
  { year: "2017", title: "ธารพระพรลาดกระบัง", desc: "อาจารย์ปลา และพี่แฮม เดินทางตามการทรงเรียกของพระเจ้าอีกครั้ง", detail: "เปิดคริสตจักรลูกอีกแห่ง ใกล้กับสถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง", img: "/bg/lad.avif" },
  { year: "2018 \u2013 ปัจจุบัน", title: "10 ปีแห่งการอวยพร", desc: "นับเป็นเวลากว่า 10 ปี ที่คริสตจักรธารพระพรได้เริ่มต้นขึ้น", detail: '\u201cจับคนในเมืองใหญ่และมหาลัยหลัก อบรม และส่งเขาออกไปเป็นพระพรจนสุดปลายแผ่นดิน\u201d เป็นนิมิตที่เราก้าวเดินต่อไป', img: "/bg/ten.avif" },
];

const beliefs = [
  { icon: <BookOpen size={28} />, title: "พระคัมภีร์", sub: "The Bible", desc: "เราเชื่อว่าพระคัมภีร์คือถ้อยคำของพระเจ้าที่ได้รับการดลใจ เป็นความจริงสูงสุดและเป็นแนวทางในการดำเนินชีวิต" },
  { icon: <ShieldCheck size={28} />, title: "ความรอด", sub: "Salvation", desc: "เราเชื่อว่าความรอดเป็นของขวัญจากพระเจ้า ผ่านทางความเชื่อในพระเยซูคริสต์ ไม่ใช่โดยการกระทำของเราเอง" },
  { icon: <Heart size={28} />, title: "ความรัก", sub: "Love", desc: "เรามุ่งมั่นที่จะรักพระเจ้าสุดหัวใจ และรักเพื่อนบ้านเหมือนรักตนเอง ตามพระมหาบัญญัติ" },
  { icon: <Users size={28} />, title: "คริสตจักร", sub: "The Church", desc: "เราคือครอบครัวของผู้เชื่อ ที่มารวมตัวกันเพื่อนมัสการ เติบโต และออกไปรับใช้สังคม" },
];

const leaders = [
  { name: "ไพศาล ประทุมรัตน์", role: "ศิษยาภิบาลอาวุโสและผู้นำองค์กร", sub: "Senior Pastor", img: "/Leadership/ps.avif" },
  { name: "พละ สานปณิธาน", role: "ศิษยาภิบาลคริสตจักรธารพระพรเชียงใหม่", sub: "Pastor in Chiang Mai", img: "/Leadership/pl.avif" },
  { name: "สัมพันธ์ สุจริตค้ำจุนวงศ์", role: "ศิษยาภิบาลคริสตจักรธารพระพรพะเยา", sub: "Pastor in Phayao", img: "/Leadership/sp.avif" },
  { name: "ทิโมธี ประทุมรัตน์", role: "ศิษยาภิบาลคริสตจักรธารพระพรกรุงเทพ", sub: "Pastor in Bangkok", img: "/Leadership/tmt.avif" },
  { name: "ปวีณา อื้อเพชรพงษ์", role: "ศิษยาภิบาลคริสตจักรธารพระพรธัญบุรี", sub: "Pastor in Thanyaburi", img: "/Leadership/p.avif" },
  { name: "นิต ช่างสกล", role: "ศิษยาภิบาลคริสตจักรธารพระพรโนนปอแดง", sub: "Pastor in Non Pa Daeng", img: "/Leadership/pn.jpg" },
];

const About = () => {
  return (
    <div className="w-full bg-[#0a0f1a] text-white overflow-x-hidden font-['Kanit']">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-end justify-center overflow-hidden pb-20">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1920&q=80"
            alt="Church community"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/70 to-[#0a0f1a]/20" />
          {/* Glow orbs */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#00a3ff]/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#22d3ee]/15 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 py-2 px-5 mb-8 border border-[#00a3ff]/40 bg-[#00a3ff]/10 text-[#22d3ee] text-xs font-bold tracking-[0.25em] uppercase rounded-full backdrop-blur-md">
                <Sparkles size={12} /> เกี่ยวกับเรา
              </span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tight drop-shadow-2xl">
              มากกว่าสถานที่<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-[#00a3ff] to-[#22d3ee]">
                คือ "ครอบครัว"
              </span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              ทำความรู้จักกับเรา คริสตจักรธารพระพร ที่ที่เราเชื่อว่าทุกคนมีคุณค่า<br className="hidden md:block" /> และถูกสร้างมาเพื่อจุดประสงค์ที่ยิ่งใหญ่
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white animate-pulse" />
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────────────── */}
      <section className="relative z-10 py-12 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00a3ff]/5 via-transparent to-[#00a3ff]/5" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-white/10">
            {[
              { num: "2008", label: "ก่อตั้งเมื่อปี" },
              { num: "6+", label: "คริสตจักรทั่วประเทศ" },
              { num: "17+", label: "ปีแห่งพันธกิจ" },
              { num: "100s", label: "ชีวิตที่เปลี่ยนแปลง" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center px-6"
              >
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#22d3ee] to-[#00a3ff]">{s.num}</p>
                <p className="text-white/50 text-sm mt-1 font-light">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ───────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#00a3ff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
            <span className="text-[#00a3ff] text-xs font-bold tracking-[0.3em] uppercase">Our Journey</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4 tracking-tight">เรื่องราวของเรา</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00a3ff] to-[#22d3ee] mx-auto rounded-full" />
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Vertical line (desktop only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00a3ff]/30 to-transparent -translate-x-1/2" />

            <div className="space-y-16 md:space-y-24">
              {stories.map((s, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                    className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? "" : "md:flex-row-reverse"}`}
                  >
                    {/* Center dot */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#0a0f1a] border-2 border-[#00a3ff] z-10 shadow-[0_0_12px_rgba(0,163,255,0.6)]" />

                    {/* Image */}
                    <div className="w-full md:w-[47%]">
                      <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                        <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute bottom-4 left-4 text-[#22d3ee] font-mono text-sm font-bold tracking-widest uppercase">{s.year}</span>
                      </div>
                    </div>

                    {/* Text */}
                    <div className={`w-full md:w-[47%] ${isEven ? "md:pl-6" : "md:pr-6"}`}>
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#00a3ff]/40 hover:bg-white/8 transition-all duration-500">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{s.title}</h3>
                        <p className="text-[#22d3ee] font-semibold mb-3 text-sm border-l-2 border-[#00a3ff] pl-3">{s.desc}</p>
                        <p className="text-white/60 leading-relaxed font-light text-sm md:text-base">{s.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BELIEFS ────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1525] to-[#0a0f1a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00a3ff]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-white/10 pb-10">
            <div>
              <span className="text-[#00a3ff] text-xs font-bold tracking-[0.3em] uppercase">Our Core</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mt-2 tracking-tight">สิ่งที่เราเชื่อ</h2>
            </div>
            <p className="text-white/50 font-light max-w-sm md:text-right text-sm leading-relaxed">
              รากฐานความเชื่อที่มั่นคง คือจุดเริ่มต้นของชีวิตที่เติบโตอย่างยั่งยืน
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {beliefs.map((b, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="group bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-[#00a3ff]/50 hover:bg-[#00a3ff]/5 transition-all duration-500 cursor-default"
              >
                <div className="mb-5 w-12 h-12 rounded-xl bg-[#00a3ff]/15 flex items-center justify-center text-[#00a3ff] group-hover:bg-[#00a3ff] group-hover:text-white transition-all duration-500">
                  {b.icon}
                </div>
                <p className="text-[10px] text-[#00a3ff]/80 font-bold tracking-widest uppercase mb-1">{b.sub}</p>
                <h3 className="text-xl font-bold text-white mb-3">{b.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-light">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TEAM ───────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[#0a0f1a]">
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <span className="text-[#00a3ff] text-xs font-bold tracking-[0.3em] uppercase">Our Team</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4 tracking-tight">ทีมของเรา</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00a3ff] to-[#22d3ee] mx-auto rounded-full mb-6" />
            <p className="text-white/50 max-w-lg mx-auto font-light leading-relaxed text-sm md:text-base">
              ด้วยหัวใจที่รักพระเจ้าและรักผู้คน พร้อมเดินเคียงข้างให้คำปรึกษาและนำทางชีวิตจิตวิญญาณ
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 max-w-5xl mx-auto">
            {leaders.map((l, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group relative flex flex-col items-center"
              >
                <div className="relative w-full mb-5">
                  {/* Glow border on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#00a3ff]/0 to-[#00a3ff]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 group-hover:border-[#00a3ff]/50 transition-all duration-500 shadow-xl">
                    <img
                      src={l.img}
                      alt={l.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-white text-center group-hover:text-[#22d3ee] transition-colors duration-300">{l.name}</h3>
                <p className="text-white/50 text-xs text-center mt-1 leading-relaxed px-2">{l.role}</p>
                <span className="text-[#00a3ff]/60 text-[10px] tracking-widest uppercase mt-1">{l.sub}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1525] to-[#0a0f1a]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#00a3ff 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00a3ff]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-3xl shadow-2xl"
          >
            <Sparkles size={36} className="text-[#00a3ff] mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              อยากรู้จักเรามากขึ้น?<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#00a3ff]">มาเยี่ยมชมเราสัปดาห์นี้สิ</span>
            </h2>
            <p className="text-white/50 mb-10 font-light">ทุกคนยินดีต้อนรับ ไม่ว่าคุณจะเป็นใครก็ตาม</p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 text-base font-bold bg-gradient-to-r from-[#0054a5] to-[#00a3ff] text-white px-8 py-4 rounded-full hover:shadow-[0_0_40px_rgba(0,163,255,0.5)] transition-all duration-300 hover:-translate-y-1"
            >
              ดูข้อมูลติดต่อ
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;