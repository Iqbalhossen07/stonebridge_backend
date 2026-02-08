const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // ১-৫ এর মধ্যে নাম্বার
    image: { type: String, required: true }, // Cloudinary URL
    description: { type: String, required: true } // CKEditor ডাটা
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);