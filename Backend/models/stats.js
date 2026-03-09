const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({

  stats: {
    hearers: { type: Number, default: 0 },       // 1. ผู้ได้ยิน
    decisions: { type: Number, default: 0 },     // 2. ผู้ตัดสินใจเชื่อ
    baptized: { type: Number, default: 0 },      // 3. ผู้รับบัพติสมา
    disciples: { type: Number, default: 0 },     // 4. จำนวนสาวก
    houseChurches: { type: Number, default: 0 }  // 5. จำนวนคริสตจักรบ้าน
  }

});

module.exports = mongoose.model('Stats', missionSchema);