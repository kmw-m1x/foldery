const Mission = require('../models/stats');

exports.addMissionStats = async (req, res) => {
  try {

    const { hearers, decisions, baptized, disciples, houseChurches } = req.body;

    const newMission = new Mission({
      stats: {
        hearers,
        decisions,
        baptized,
        disciples,
        houseChurches
      }

    });

    // 3. สั่งบันทึกลง Database
    const savedMission = await newMission.save();

    res.status(201).json({
      message: 'เรียบร้อย!',
      data: savedMission
    });

  } catch (error) {
    console.error("Add Stats Error:", error);
    res.status(500).json({ message: 'พังว่ะ ยิงไม่เข้า', error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {

    const allStats = await Mission.find().sort({ _id: -1 });

    res.status(200).json(allStats);

  } catch (error) {
    res.status(500).json({ message: 'ซวย ดึงไม่มา', error: error.message });
  }
};




exports.updateMissionStats = async (req, res) => {
  try {
    const { hearers, decisions, baptized, disciples, houseChurches } = req.body;

    // หาตัวแรกที่เจอ แล้วแก้เลย (ไม่ต้องส่ง ID มา)
    const updatedStats = await Mission.findOneAndUpdate(
      {}, // 1. เงื่อนไขว่างเปล่า = เอา document ตัวแรกสุดใน DB เสมอ
      {
        $set: { // 2. สั่งแก้ค่า (Replace) เอาค่าใหม่ทับค่าเก่า
          'stats.hearers': hearers,
          'stats.decisions': decisions,
          'stats.baptized': baptized,
          'stats.disciples': disciples,
          'stats.houseChurches': houseChurches
        }
      },
      {
        new: true,    // return ค่าใหม่กลับมาโชว์
        upsert: true, // **ทีเด็ดอยู่ตรงนี้**: "ถ้าหาไม่เจอ ให้สร้างใหม่ / ถ้าเจอ ให้แก้ไข"
        setDefaultsOnInsert: true // ถ้าสร้างใหม่ ให้ใช้ค่า default ใน schema ด้วย
      }
    );

    res.status(200).json({
      message: 'อัปเดตข้อมูลเรียบร้อย (ใช้ใบเดิมตลอด)',
      data: updatedStats
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: 'พังว่ะ', error: error.message });
  }
};