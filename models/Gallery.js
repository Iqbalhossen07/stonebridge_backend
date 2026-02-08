const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    image: { type: String, required: true }, // Cloudinary URL
    caption: { type: String, default: "" },
    public_id: { type: String } // ক্লাউডিনারি থেকে ছবি ডিলিট করার জন্য দরকার
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);