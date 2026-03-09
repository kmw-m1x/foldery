import { motion } from "framer-motion";
import { BookOpen, Heart, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const stories = [
    {
      year: "2008",
      title: "จุดเริ่มต้นแห่งการทรงเรียก",
      desc: "พระเจ้าทรงเรียกครอบครัวของอาจารย์ไพศาลให้ขึ้นมารับใช้พระองค์ที่จังหวัดเชียงราย",
      detail:
        "โดยมีภาพนิมิตของแม่น้ำแห่งพระพรไหลท่วมท้นลงมาจากจังหวัดสูงสุดของประเทศแล้วขยายออกจนเป็นพรทั่วประเทศไทย",
      img: "/bg/begin.avif",
    },
    {
      year: "จุดยุทธศาสตร์",
      title: "เชียงราย",
      desc: "เชียงรายเป็นจุดยุทธศาสตร์สำคัญ",
      detail:
        "เนื่องจากเป็นจังหวัดที่เชื่อมต่อกับประเทศลาว พม่า และเชื่อมต่อกับประเทศจีน ซึ่งเป็นพันธกิจมิชชั่นที่ทางคริสตจักรสนใจเป็นพิเศษ จึงตัดสินใจตั้งคริสตจักรใหม่ ภายใต้การร่วมมือกับองค์กร Thailand Campus Crusade for Christ (TCCC) ให้ชื่อว่า “คริสตจักรธารพระพร”",
      img: "/bg/cix.avif",
    },
    {
      year: "ผู้ร่วมนิมิตรยุคแรก",
      title: "นักศึกษาคืออนาคต",
      desc: "สังเกตแรกๆ นั้นการนมัสการยังมีน้อย",
      detail:
        "จึงใช้โอกาสนั้นในการดูความสามารถและความพร้อมของกลุ่มนักศึกษาจาก ม.แม่ฟ้าหลวง และ ม.ราชภัฏเชียงรายที่หอพักศาลาหลังบ้านอาจารย์ไพศาล และจากนั้นจึงต้องใช้ใต้ถุนอาคารพาณิชย์",
      img: "/bg/first.avif",
    },
    {
      year: "สิ่งสำคัญที่พระเจ้าจะทำ",
      title: "นิมิตร",
      desc: "นิมิตที่พระเจ้าให้แก่เราคือ",
      detail:
        "“จับคนในเมืองใหญ่ มหาวิทยาลัยหลัก อบรมและส่งเขาออกไปเป็นพร” คริสตจักรธารพระพร เห็นความสำคัญของนักศึกษา จึงประกาศและสร้างสาวกในกลุ่มวัยรุ่น ท้าทายคนหนุ่มสาวให้ถวายตัวรับใช้พระเจ้า และออกไปบุกเบิกคริสตจักรในเมืองใหญ่ และมหาลัยหลักของประเทศตลอดมา",
      img: "/bg/dreams.avif",
    },
    {
      year: "2010",
      title: "ก่อสร้างศูนย์แห่งใหม่",
      desc: "คริสตจักรธารพระพร ได้ซื้อที่ดิน",
      detail:
        "และก่อสร้างศูนย์แห่งใหม่ เพื่อใช้เป็นที่อบรม นมัสการ ที่พัก แล้วเสร็จในปี ค.ศ. 2011",
      img: "/bg/2010.avif",
    },
    {
      year: "พฤษภาคม 2010",
      title: "คริสตจักรลูกแห่งแรก",
      desc: "บริเวณเยื้องมหาวิทยาลัยพะเยาให้ชื่อว่า “คริสตจักรธารพระพรพะเยา”",
      detail:
        "โดยมีผู้รับใช้ในขณะนั้น คือ พี่คลิ๊กเป็นผู้ก่อตั้ง และพี่ป้องตามไปสมทบในภายหลัง ต่อมาได้ย้ายมาเช่าบ้านเดี่ยวในหมู่บ้านแม่กาหัวทุ่งเพื่อใช้เป็นที่สามัคคีธรรม โดยมีอาจารย์สัมพันธ์ สุจริตค้ำจุนวงศ์ และครอบครัว และพี่คิมดูแลมาถึงจนปัจจุบัน",
      img: "/bg/firstnode.avif",
    },
    {
      year: "2013",
      title: "งอกงามไปยังเมืองใหญ่",
      desc: "ธารพระพรธัญบุรี",
      detail:
        "โดยความร่วมมือของพี่วู๊ดดี้ ผู้รับใช้พระเจ้าในขณะนั้น กับพี่เอ็มซึ่งขณะนั้นเป็นนักศึกษาได้ตั้ง “คริสตจักรธารพระพรธัญบุรี” ขึ้นใต้หอมณีโชติ สมาชิกกลุ่มแรกคือศิษย์เก่าเชียงราย จนกลางปี 2013 มีกลุ่มน้องเลี้ยงแกนนำกลุ่มแรกมาร่วมรับใช้ด้วยกัน แล้วจึงย้ายมาบ้านเช่าในภายหลัง",
      img: "/bg/thanya.avif",
    },
    {
      year: "ต้นปี 2017",
      title: "ธารพระพรลาดกระบัง",
      desc: "อาจารย์ปลา และพี่แฮม เดินทางตามการทรงเรียกของพระเจ้าอีกครั้ง",
      detail:
        "เปิดคริสตจักรลูกอีกแห่ง ใกล้กับสถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง เริ่มนมัสการในหอพัก แล้วจึงย้ายมาใช้บ้านเช่าใกล้สนามบินสุวรรณภูมิ ซึ่งสมาชิกกลุ่มแรกเป็นน้องๆ นักศึกษา และสมาชิกเก่าจากธัญบุรี",
      img: "/bg/lad.avif",
    },
    {
      year: "2018 - ปัจจุบัน",
      title: "10 ปีแห่งการอวยพร",
      desc: "นับเป็นเวลากว่า 10 ปี ที่คริสตจักรธารพระพรได้เริ่มต้นขึ้น",
      detail:
        "เราก้าวออกไปเพื่อรับใช้พระเจ้าตามนิมิตที่พระองค์ให้กับเรา คือ “จับคนในเมืองใหญ่และมหาลัยหลัก อบรม และส่งเขาออกไปเป็นพระพรจนสุดปลายแผ่นดิน” จะเป็นพื้นที่เป้าหมายถัดไปที่เราจะนำพระกิตติคุณออกไป จนกว่า “ทุกชนชาติ” ได้รู้จักกับองค์พระเยซูคริสต์",
      img: "/bg/ten.avif",
    },
  ];

  const beliefs = [
    {
      icon: <BookOpen className="text-[#c78015]" size={36} />,
      title: "พระคัมภีร์ (The Bible)",
      desc: "เราเชื่อว่าพระคัมภีร์คือถ้อยคำของพระเจ้าที่ได้รับการดลใจ เป็นความจริงสูงสุดและเป็นแนวทางในการดำเนินชีวิต",
    },
    {
      icon: <ShieldCheck className="text-[#c78015]" size={36} />,
      title: "ความรอด (Salvation)",
      desc: "เราเชื่อว่าความรอดเป็นของขวัญจากพระเจ้า ผ่านทางความเชื่อในพระเยซูคริสต์ ไม่ใช่โดยการกระทำของเราเอง",
    },
    {
      icon: <Heart className="text-[#c78015]" size={36} />,
      title: "ความรัก (Love)",
      desc: "เรามุ่งมั่นที่จะรักพระเจ้าสุดหัวใจ และรักเพื่อนบ้านเหมือนรักตนเอง ตามพระมหาบัญญัติ",
    },
    {
      icon: <Users className="text-[#c78015]" size={36} />,
      title: "คริสตจักร (The Church)",
      desc: "เราคือครอบครัวของผู้เชื่อ ที่มารวมตัวกันเพื่อนมัสการ เติบโต และออกไปรับใช้สังคม",
    },
  ];

  const leaders = [
    {
      name: "ไพศาล ประทุมรัตน์",
      role: "ศิษยาภิบาลอาวุโสและผู้นำองค์กร",
      sub: "(Senior Pastor)",
      img: "/Leadership/ps.avif",
    },
    {
      name: "พละ สานปณิธาน",
      role: "ศิษยาภิบาลคริสตจักรธารพระพรเชียงใหม่",
      sub: "(Pastor in Chiang Mai)",
      img: "/Leadership/pl.avif",
    },
    {
      name: "สัมพันธ์ สุจริตค้ำจุนวงศ์",
      role: "ศิษยาภิบาลคริสตจักรธารพระพรพะเยา",
      sub: "(Pastor in Phayao)",
      img: "/Leadership/sp.avif",
    },    
    {
      name: "ทิโมธี ประทุมรัตน์",
      role: "ศิษยาภิบาลคริสตจักรธารพระพรกรุงเทพ",
      sub: "(Pastor in Bangkok)",
      img: "/Leadership/tmt.avif",
    },      
    {
      name: "ปวีณา อื้อเพชรพงษ์",
      role: "ศิษยาภิบาลคริสตจักรธารพระพรธัญบุรี",
      sub: "(Pastor in Thanyaburi)",
      img: "/Leadership/p.avif",
    },      
    {
      name: "นิต ช่างสกล",
      role: "ศิษยาภิบาลคริสตจักรธารพระพรโนนปอแดง",
      sub: "(Pastor in Non Pa Daeng)",
      img: "/Leadership/pn.jpg",
    },    
  ];

  return (
    <div className="w-full bg-[#FAFAF9] text-[#1C1917] overflow-x-hidden selection:bg-[#c78015] selection:text-white font-['Kanit']">
      
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      <section className="relative h-[75vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1920&q=80"
            alt="Warm community"
            className="w-full h-full object-cover scale-105 filter brightness-[0.7] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center mt-20">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block py-2 px-6 border border-[#c78015]/30 bg-[#c78015]/10 text-[#fcd34d] text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md rounded-full">
              เกี่ยวกับเรา
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight drop-shadow-2xl tracking-tight">
              มากกว่าสถานที่ <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#d6d3d1]">คือ "ครอบครัว"</span>
            </h1>
            <p className="text-lg md:text-xl text-[#d6d3d1] max-w-2xl mx-auto font-light leading-relaxed">
              ทำความรู้จักกับเรา คริสตจักรธารพร ที่ที่เราเชื่อว่าทุกคนมีคุณค่า และถูกสร้างมาเพื่อจุดประสงค์ที่ยิ่งใหญ่
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-[#1C1917] mb-6 tracking-tight">
            เรื่องราวของเรา
          </h2>
          <div className="w-20 h-1.5 bg-[#c78015] mx-auto mb-6 rounded-full"></div>
          <p className="text-[#57534E] text-lg font-light">
             เส้นทางแห่งความเชื่อและการทรงเรียกตลอดหลายปีที่ผ่านมา
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#E7E5E4] via-[#c78015]/30 to-[#E7E5E4] -translate-x-1/2"></div>

          <div className="space-y-24">
            {stories.map((story, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className="relative flex flex-col md:flex-row items-center justify-between w-full">
                  
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#FAFAF9] border-4 border-[#c78015] z-10 shadow-[0_0_15px_rgba(199,128,21,0.5)]"></div>

                  <div className={`w-full md:w-[45%] ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8 }}
                      className="relative group rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <div className="aspect-[4/3] w-full bg-[#E7E5E4]">
                        <img 
                          src={story.img} 
                          alt={story.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    </motion.div>
                  </div>

                  <div className={`w-full md:w-[45%] mt-8 md:mt-0 ${isEven ? 'md:order-2 md:pl-12' : 'md:order-1 md:pr-12 md:text-right'}`}>
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <span className={`inline-block text-[#c78015] font-mono text-sm tracking-widest uppercase font-bold border-b-2 border-[#c78015]/30 pb-1 mb-4`}>
                        {story.year}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4 leading-tight">
                        {story.title}
                      </h3>
                      {story.desc && (
                        <p className={`text-[#44403C] text-lg font-semibold mb-4 leading-relaxed ${isEven ? 'border-l-4 pl-4' : 'md:border-r-4 md:pr-4 md:border-l-0 border-l-4 pl-4 md:pl-0'} border-[#c78015]`}>
                          {story.desc}
                        </p>
                      )}
                      <p className="text-[#78716C] leading-relaxed font-light text-base md:text-lg">
                        {story.detail}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#0F172A] text-[#FAFAF9] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c78015] opacity-5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8 gap-6"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">สิ่งที่เราเชื่อ</h2>
              <h3 className="text-xl text-[#c78015] font-mono tracking-widest uppercase">Our Beliefs</h3>
            </div>
            <p className="text-[#A1A1AA] text-lg font-light max-w-md md:text-right">
              รากฐานความเชื่อที่มั่นคง คือจุดเริ่มต้นของชีวิตที่เติบโตอย่างยั่งยืน
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {beliefs.map((item, index) => (
              <motion.div
                variants={fadeInUp}
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-[#c78015]/50 transition-all duration-500 group relative shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(199,128,21,0.15)] hover:-translate-y-2"
              >
                <div className="mb-8 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-[#c78015]/20 transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#c78015] transition-colors">{item.title}</h3>
                <p className="text-[#A1A1AA] text-base leading-relaxed font-light group-hover:text-white transition-colors">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-32 container mx-auto px-6 bg-[#FAFAF9]">
        <div className="text-center mb-20">
          <span className="text-[#c78015] font-mono text-xs tracking-[0.3em] uppercase font-bold">
            Our Team
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1C1917] mt-4 mb-6 tracking-tight">
            ทีมของเรา
          </h2>
          <div className="w-24 h-1.5 bg-[#E7E5E4] mx-auto mb-6 rounded-full"></div>
          <p className="text-[#57534E] max-w-lg mx-auto font-light text-lg leading-relaxed">
            ด้วยหัวใจที่รักพระเจ้าและรักผู้คน พร้อมเดินเคียงข้างให้คำปรึกษาและนำทางชีวิตจิตวิญญาณ
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-16 max-w-6xl mx-auto"
        >
          {leaders.map((leader, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative flex flex-col items-center"
            >
              <div className="relative mb-6 w-full max-w-[280px]">
                <div className="absolute inset-0 border-2 border-[#c78015] rounded-2xl translate-x-3 translate-y-3 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none"></div>
                
                <div className="relative aspect-[4/5] overflow-hidden bg-[#E7E5E4] rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src={leader.img}
                    alt={leader.name}
                    className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    style={{ objectPosition: "top" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>

              <div className="text-center px-2">
                <h3 className="text-lg md:text-2xl font-bold text-[#1C1917] mb-2 group-hover:text-[#c78015] transition-colors duration-300">
                  {leader.name}
                </h3>
                <p className="text-[#57534E] text-xs md:text-sm font-semibold tracking-wide">
                  {leader.role}
                </p>
                <p className="text-[#A8A29E] text-[10px] md:text-xs font-light tracking-wider mt-1">
                  {leader.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="relative py-32 bg-[#0F172A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#c78015 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 p-12 md:p-16 rounded-[3rem] shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight leading-tight">
              อยากรู้จักเรามากขึ้น? <br /> <span className="text-[#c78015]">มาเยี่ยมชมเราสัปดาห์นี้สิ</span>
            </h2>
            <Link
              to="/#map-section"
              className="group inline-flex items-center gap-4 text-lg font-bold bg-[#c78015] text-white px-8 py-4 rounded-full hover:bg-white hover:text-[#c78015] transition-all duration-300 shadow-[0_0_20px_rgba(199,128,21,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              ดูแผนที่และรอบนมัสการ
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;