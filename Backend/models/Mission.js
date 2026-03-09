const mongoose = require('mongoose');



const missionSchema = new mongoose.Schema({

  title: {

    type: String,

    trim: true

  },

  description: { type: String },

  location: {

    lat: { type: Number},

    lng: { type: Number },

    address: { type: String }

  },

  status: {

    type: String,

    default: 'Active',

    enum: ['Active', 'Expanding', 'New', 'Target Area']

  },

  // --- 🔥 คง stats ไว้ตามที่มึงขอ 🔥 ---

  stats: {

    hearers: { type: Number, default: 0 },       // 1. ผู้ได้ยิน

    decisions: { type: Number, default: 0 },     // 2. ผู้ตัดสินใจเชื่อ

    baptized: { type: Number, default: 0 },      // 3. ผู้รับบัพติสมา

    disciples: { type: Number, default: 0 },     // 4. จำนวนสาวก

    houseChurches: { type: Number, default: 0 }  // 5. จำนวนคริสตจักรบ้าน

  }, 



  // 🔥 เพิ่ม member field (จำนวนทีมงาน) ตามสั่ง

  member: {

    type: Number,

    default: 0

  },



  isTargetArea: {

    type: Boolean,

    default: false

  },

 

  images: [{ type: String }],

 

  createdAt: {

    type: Date,

    default: Date.now

  }

}, {

  toJSON: { virtuals: true },

  toObject: { virtuals: true }

});



// แถม: Virtual Field 'members' ให้ชี้ไปที่ stats.disciples

// (เผื่อหน้าบ้านมึงเผลอใช้ m.members มันจะได้ไม่พัง แต่จะได้ค่าสาวกไปแทน)

missionSchema.virtual('members').get(function() {

  return this.member;

});



module.exports = mongoose.model('Mission', missionSchema);