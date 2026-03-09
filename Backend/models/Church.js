const mongoose = require('mongoose');

const ChurchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  leader: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  // --- หัวใจของการทวีคูณ ---
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church', default: null }, 
  path: { type: String, default: "" }, // เก็บเป็น ",ID1,ID2," เพื่อหาลูกหลานทั้งหมด
  generation: { type: Number, default: 1 }, // รุ่นที่เท่าไหร่
  
  stats: {
    members: { type: Number, default: 0 },
    disciples: { type: Number, default: 0 }, // จำนวนสาวกที่ฝึกแล้ว (พร้อมส่งออก)
  },
  status: { type: String, enum: ['Active', 'Planting', 'Seed'], default: 'Seed' },
  createdAt: { type: Date, default: Date.now }
});

// ทำ Index สำหรับแผนที่และการค้นหา
ChurchSchema.index({ location: "2dsphere" });
ChurchSchema.index({ path: 1 });

module.exports = mongoose.model('Church', ChurchSchema);