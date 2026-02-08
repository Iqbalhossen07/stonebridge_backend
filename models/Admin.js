const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: 'admin.png' } // ক্লাউডিনারি ইউআরএল এখানে সেভ হবে
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);