const express = require('express');
const router = express.Router(); // ✅ 1. สร้าง Router ขึ้นมาแทน app
const Contact = require('../models/Contact'); 


router.post('/', async (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;
    

    const newContact = new Contact({
      name,
      phone,
      subject,
      message
    });

    // บันทึกลง MongoDB
    await newContact.save();

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; // ✅ 4. อย่าลืม export router กลับไปให้ app.js ใช้