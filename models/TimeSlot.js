const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    day: { 
        type: String, 
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    start_time: { type: String, required: true }, // Format: "13:00"
    end_time: { type: String, required: true },
    member_id: { type: String, default: "1" }
}, { timestamps: true });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);