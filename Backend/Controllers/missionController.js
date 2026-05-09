const Mission = require('../models/Mission');

// --- 1. ดึงข้อมูลทั้งหมดไปปักหมุด Map ---
exports.getMissions = async (req, res) => {
  try {
    const missions = await Mission.find();
    
    const data = missions.map(m => ({
      id: m._id,
      _id: m._id,
      lat: m.location.lat,
      lng: m.location.lng,
      title: m.title,
      description: m.description,
      location: m.location,
      status: m.status,
      stats: m.stats,
      member: m.member,
      isTargetArea: m.isTargetArea,
      images: m.images,
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

    const summary = missions.reduce((acc, curr) => {
      return {
        hearers: acc.hearers + (curr.stats.hearers || 0),
        decisions: acc.decisions + (curr.stats.decisions || 0),
        baptized: acc.baptized + (curr.stats.baptized || 0),
        disciples: acc.disciples + (curr.stats.disciples || 0),
        houseChurches: acc.houseChurches + (curr.stats.houseChurches || 0),
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

exports.getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }
    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mission', error: error.message });
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
        try { location = JSON.parse(location); } catch (e) {}
    }
    if (stats && typeof stats === 'string') {
        try { stats = JSON.parse(stats); } catch (e) {}
    }

    const newMission = new Mission({
      ...otherData,
      location,
      stats,
      images: imagePaths
    });

    const savedMission = await newMission.save();
    res.status(201).json({ message: 'สร้าง Mission เสร็จแล้วเพื่อน!', data: savedMission });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(400).json({ message: 'Error creating mission', error: error.message });
  }
};

exports.updateMission = async (req, res) => {
  try {
    const { id } = req.params;
    let { location, stats, images, ...otherData } = req.body;

    if (location && typeof location === 'string') {
      try { location = JSON.parse(location); } catch (e) {}
    }
    if (stats && typeof stats === 'string') {
      try { stats = JSON.parse(stats); } catch (e) {}
    }
    if (images && typeof images === 'string') {
      try { images = JSON.parse(images); } catch (e) {}
    }

    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    const updatedMission = await Mission.findByIdAndUpdate(
      id,
      { ...otherData, location, stats, images },
      { new: true, runValidators: true }
    );

    if (!updatedMission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    res.json({ message: 'อัปเดตข้อมูลสำเร็จ!', data: updatedMission });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({ message: 'Error updating mission', error: error.message });
  }
};

exports.deleteMission = async (req, res) => {
  try {
    const { id } = req.params;
    const mission = await Mission.findByIdAndDelete(id);
    if (!mission) {
      return res.status(404).json({ message: "หาไม่เจอว่ะจารย์" });
    }
    res.status(200).json({ message: "ลบเรียบร้อย!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};