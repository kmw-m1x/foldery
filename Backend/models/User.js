const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin'], // บังคับค่า เลือกได้แค่ 2 อย่างนี้
    default: 'user' 
  }
});

module.exports = mongoose.model('User', userSchema);