import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* === 1. Hero Section (ภาพเปิดหัว) === */}
      {/* ใช้ relative เพื่อเอารูปมาซ้อน แล้วเอา text ทับ */}
      <section className="relative bg-[#33691e] text-white py-24 lg:py-32 overflow-hidden rounded-3xl shadow-xl mb-12">
        {/* Background Image Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2071&auto=format&fit=crop" 
            alt="Worship Background"
            className="w-full h-full object-cover opacity-30" // ปรับ opacity ให้รูปจางลง ตัวหนังสือจะได้เด่น
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            ยินดีต้อนรับสู่ <span className="text-[#ffc857]">Mission Family</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-200">
            ที่ซึ่งความเชื่อ ความหวัง และความรัก เติบโตไปด้วยกัน เราพร้อมเดินเคียงข้างคุณในทุกช่วงเวลาของชีวิต
          </p>
          {/* ปุ่ม CTA (Call to Action) เน้นสีทอง */}
          <Link
            to="/events"
            className="inline-block bg-[#ffc857] text-[#33691e] font-bold px-8 py-4 rounded-full hover:bg-[#e0b04b] transition transform hover:scale-105 shadow-lg"
          >
            ดูกิจกรรมที่กำลังจะมาถึง
          </Link>
        </div>
      </section>

      {/* === 2. Welcome Message (ข้อความต้อนรับสั้นๆ) === */}
      <section className="text-center py-12 px-6 mb-12">
        <h2 className="text-3xl font-bold text-[#33691e] mb-6">มากกว่าสถานที่ คือผู้คน</h2>
        <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed text-lg">
          เราเชื่อว่าทุกคนมีคุณค่าและมีจุดมุ่งหมาย ไม่ว่าคุณจะมาจากไหน หรือกำลังเผชิญกับอะไร 
          ที่นี่มีที่ว่างสำหรับคุณเสมอ มาร่วมเป็นส่วนหนึ่งของชุมชนที่อบอุ่นและสนับสนุนซึ่งกันและกัน
        </p>
      </section>

      {/* === 3. Highlights/Features (การ์ด 3 ใบ) === */}
      <section className="py-12 mb-12">
        <h2 className="text-3xl font-bold text-center text-[#33691e] mb-12">สิ่งที่คุณจะพบที่นี่</h2>
        
        <div className="grid md:grid-cols-3 gap-8 px-4">
          {/* Card 1: Community */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border-b-8 border-[#ffc857] text-center group">
            <div className="bg-[#ece4d4] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ffc857] transition">
               <span className="text-4xl">🤝</span> {/* ใช้อีโมจิแทนไอคอนไปก่อน */}
            </div>
            <h3 className="text-2xl font-bold text-[#33691e] mb-4">สังคมที่อบอุ่น</h3>
            <p className="text-gray-600">
              พบเพื่อนใหม่และสร้างความสัมพันธ์ที่มีความหมาย ในบรรยากาศที่เป็นกันเองเหมือนครอบครัว
            </p>
          </div>

          {/* Card 2: Growth */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border-b-8 border-[#33691e] text-center group">
             <div className="bg-[#ece4d4] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#33691e] transition">
               <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-2xl font-bold text-[#33691e] mb-4">การเติบโตฝ่ายวิญญาณ</h3>
            <p className="text-gray-600">
              เรียนรู้และเติบโตในความเชื่อผ่านคำสอน กิจกรรมกลุ่มย่อย และการแบ่งปันประสบการณ์
            </p>
          </div>

          {/* Card 3: Impact */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border-b-8 border-[#ffc857] text-center group">
             <div className="bg-[#ece4d4] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ffc857] transition">
               <span className="text-4xl">💖</span>
            </div>
            <h3 className="text-2xl font-bold text-[#33691e] mb-4">ส่งต่อความรัก</h3>
            <p className="text-gray-600">
              ร่วมมือกันสร้างผลกระทบเชิงบวกให้กับชุมชนและสังคม ผ่านกิจกรรมจิตอาสาและการช่วยเหลือ
            </p>
          </div>
        </div>
      </section>

      {/* === 4. Final CTA Section (แถบปิดท้าย) === */}
      <section className="bg-[#33691e] text-white p-12 rounded-3xl text-center shadow-inner">
        <h2 className="text-3xl font-bold mb-6">พร้อมที่จะเริ่มต้นการเดินทางใหม่หรือยัง?</h2>
        <p className="mb-8 text-gray-200">มาร่วมร่วมนมัสการกับเราได้ทุกวันอาทิตย์ หรือติดต่อเราเพื่อสอบถามข้อมูลเพิ่มเติม</p>
        <div className="space-x-4">
             <button className="bg-transparent border-2 border-[#ffc857] text-[#ffc857] font-bold px-8 py-3 rounded-full hover:bg-[#ffc857] hover:text-[#33691e] transition">
                ติดต่อเรา
             </button>
        </div>
      </section>
    </div>
  );
};

export default Home;