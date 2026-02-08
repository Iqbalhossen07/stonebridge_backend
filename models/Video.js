const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    video_url: { type: String, required: true }, 
    thumbnail: { type: String }, 
    short_bio: { type: String, default: "" } // বর্ণনা সেভ করার জন্য
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);