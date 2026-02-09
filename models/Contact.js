const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    status: { type: String, default: 'Unread' }, // অ্যাডমিন প্যানেলের জন্য
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);