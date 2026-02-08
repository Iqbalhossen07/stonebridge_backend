const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    video_link: { type: String, default: "" },
    author: { type: String, default: "Sonjoy Kumar Roy" }, // ফিক্সড লেখক
    slug: { type: String, unique: true } // এসইও ফ্রেন্ডলি ইউআরএল এর জন্য
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);