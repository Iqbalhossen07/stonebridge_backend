const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration_time: { type: String, default: '30 Minutes' }, // আপনার চাওয়া নতুন ফিল্ড
    message: { type: String },
    receipt_image: { type: String, required: true }, // Cloudinary URL
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);