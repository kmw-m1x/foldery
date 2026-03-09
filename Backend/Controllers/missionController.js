const Mission = require('../models/Mission');

// --- 1. ดึงข้อมูลทั้งหมดไปปักหมุด Map ---
exports.getMissions = async (req, res) => {
  try {
    const missions = await Mission.find();
    

    const data = missions.map(m => ({
      id: m._id,
      lat: m.location.lat,
      lng: m.location.lng,
      title: m.title,
      status: m.status,

      members: m.stats.disciples, 
      image: m.images[0] || null 
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching missions', error: error.message });
  }
};

// --- 2. ดึงสถิติรวม Dashboard (6 ค่าพลัง) ---
exports.getDashboardStats = async (req, res) => {
  try {
    const missions = await Mission.find();

    // Loop บวกเลขทุก Record มารวมกัน
    const summary = missions.reduce((acc, curr) => {
      return {
        hearers: acc.hearers + (curr.stats.hearers || 0),
        decisions: acc.decisions + (curr.stats.decisions || 0),
        baptized: acc.baptized + (curr.stats.baptized || 0),
        disciples: acc.disciples + (curr.stats.disciples || 0),
        houseChurches: acc.houseChurches + (curr.stats.houseChurches || 0),
        // ถ้าเป็น Target Area ให้นับเพิ่มทีละ 1
        targetAreas: acc.targetAreas + (curr.isTargetArea ? 1 : 0) 
      };
    }, { 
      hearers: 0, 
      decisions: 0, 
      baptized: 0, 
      disciples: 0, 
      houseChurches: 0, 
      targetAreas: 0 
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating stats', error: error.message });
  }
};

exports.createMission = async (req, res) => {
  try {

    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => file.path);
    }

    let { location, stats, ...otherData } = req.body;


    if (location && typeof location === 'string') {
        try {
            location = JSON.parse(location);
        } catch (e) {
            return res.status(400).json({ message: 'Location format ผิดโว้ย ต้องเป็น JSON String' });
        }
    }

    if (stats && typeof stats === 'string') {
        try {
            stats = JSON.parse(stats);
        } catch (e) {
            return res.status(400).json({ message: 'Stats format ผิดโว้ย ต้องเป็น JSON String' });
        }
    }

    // 3. รวมร่างข้อมูล แล้วยัดลง Database
    const newMission = new Mission({
      ...otherData,
      location, // อันที่แปลงแล้ว
      stats,    // อันที่แปลงแล้ว
      images: imagePaths
    });

    const savedMission = await newMission.save();
    
    res.status(201).json({
        message: 'สร้าง Mission เสร็จแล้วเพื่อน!',
        data: savedMission
    });

  } catch (error) {
    console.error("พังตอน Create:", error);
    res.status(400).json({ message: 'Error creating mission', error: error.message });
  }
};





exports.deleteMission = async (req, res) => {
  try {
    const { id } = req.params;

    // ค้นหาและลบทิ้งทันที
    const mission = await Mission.findByIdAndDelete(id);

    // ถ้าหาไม่เจอ (อาจจะส่ง ID มั่วมา)
    if (!mission) {
      return res.status(404).json({ message: "หาไม่เจอว่ะจารย์ (Mission not found)" });
    }

    // ส่งกลับไปบอกว่าเรียบร้อย
    res.status(200).json({ message: "ลบเรียบร้อย! (Mission deleted successfully)" });

  } catch (error) {
    // กันเหนียว เผื่อ DB พัง หรือ ID ผิด format
    res.status(500).json({ message: error.message });
  }
};