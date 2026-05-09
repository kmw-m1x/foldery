const mongoose = require('mongoose');

// Province statistics model
// nameEn must match the "name" field in thailand-provinces.json exactly
const ProvinceStatSchema = new mongoose.Schema(
  {
    nameEn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nameTh: {
      type: String,
      required: true,
      trim: true,
    },
    helpCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProvinceStat', ProvinceStatSchema);
