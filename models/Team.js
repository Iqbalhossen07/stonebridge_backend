const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    short_bio: { type: String, default: "" }, // আপনার নতুন ফিল্ড
    facebook: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);