const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  // --- ข้อมูลพื้นฐาน ---
  title: { type: String, required: true },
  desc: { type: String, required: true },   // คำโปรยสั้นๆ
  detail: { type: String, required: true }, // เนื้อหาละเอียด
  image: { type: String, required: true },  // รูปปก
  
  // --- หมวดหมู่ ---
  category: { 
    type: String, 
    required: true, 
    enum: ["Community", "Camp", "Service", "Worship", "Workshop"] 
  },

  // --- วันเวลา ---
  startDate: { type: Date, required: true }, // เอาไว้ Sort
  endDate: { type: Date },                   // เผื่อกิจกรรมข้ามวัน
  displayTime: { type: String },             // โชว์เวลาแบบ text เช่น "09:00 - 12:00"

  // --- สถานที่ ---
  location: { type: String, required: true }, // ชื่อสถานที่
  address: { type: String },                  // ที่อยู่
  coordinates: {                              // เผื่ออนาคตอยากปักหมุด (ถ้าไม่ใช้ก็ส่ง null มา)
    lat: { type: Number },
    lng: { type: Number }
  },

  // --- สถานะ ---
  status: { 
    type: String, 
    enum: ["upcoming", "ongoing", "completed", "cancelled"], 
    default: "upcoming" 
  },
  isFeatured: { type: Boolean, default: false } // ปักหมุดแนะนำ

}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);