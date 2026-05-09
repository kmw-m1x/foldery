const express = require('express');
const router = express.Router();
const ProvinceStat = require('../models/ProvinceStat');

// GET /api/province-stats — ดึงข้อมูลทั้ง 77 จังหวัด
router.get('/', async (req, res) => {
  try {
    const stats = await ProvinceStat.find().sort({ nameEn: 1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch province stats' });
  }
});

// POST /api/province-stats — เพิ่มหรืออัปเดตจังหวัด (upsert by nameEn)
router.post('/', async (req, res) => {
  try {
    const { nameEn, nameTh, helpCount } = req.body;
    const doc = await ProvinceStat.findOneAndUpdate(
      { nameEn },
      { nameEn, nameTh, helpCount },
      { upsert: true, new: true, runValidators: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/province-stats/bulk — อัปเดตหลายจังหวัดพร้อมกัน (Array)
router.put('/bulk', async (req, res) => {
  try {
    const updates = req.body; // Array of { nameEn, nameTh, helpCount }
    const ops = updates.map(({ nameEn, nameTh, helpCount }) => ({
      updateOne: {
        filter: { nameEn },
        update: { $set: { nameTh, helpCount } },
        upsert: true,
      },
    }));
    await ProvinceStat.bulkWrite(ops);
    res.json({ success: true, updated: updates.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/province-stats/:id — อัปเดตจังหวัดเดียว
router.put('/:id', async (req, res) => {
  try {
    const doc = await ProvinceStat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
