const SubService = require('../models/SubService');
const TimeSlot = require('../models/TimeSlot');
const Booking = require('../models/Booking'); // আপনার বুকিং মডেল


// ১. সব সাব-সার্ভিস ডাটাবেস থেকে নিয়ে আসা
exports.getOnlySubServices = async (req, res) => {
    try {
        const subServices = await SubService.find().select('sub_service_title');
        res.status(200).json({ success: true, data: subServices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ২. ডেট অনুযায়ী ৩০ মিনিটের ডাইনামিক স্লট জেনারেট করা
// exports.getAvailableSlots = async (req, res) => {
//     try {
//         const { date } = req.body;
//         const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
//         console.log("Backend Received Date:", date);
//     console.log("Backend Calculated Day:", dayName);

//     const mainSlot = await TimeSlot.findOne({ day: dayName });
//     console.log("Database Found Slot:", mainSlot);

//         // অ্যাডমিন প্যানেলে করা টাইম স্লট থেকে ওই দিনের ডাটা খোঁজা
//         const mainSlot = await TimeSlot.findOne({ day: dayName });
        
//         if (!mainSlot) {
//             return res.json({ success: false, message: "No availability for this day." });
//         }

//         let slots = [];
//         // ডাটাবেসের 24-hour ফরম্যাট (13:00) কে ক্যালকুলেট করা
//         let start = new Date(`1970-01-01T${mainSlot.start_time}:00`);
//         let end = new Date(`1970-01-01T${mainSlot.end_time}:00`);

//         // ৩০ মিনিটের গ্যাপে স্লট তৈরি
//         while (start < end) {
//             let timeLabel = start.toLocaleTimeString('en-US', { 
//                 hour: '2-digit', 
//                 minute: '2-digit', 
//                 hour12: true 
//             });
//             slots.push(timeLabel);
//             start.setMinutes(start.getMinutes() + 30);
//         }

//         res.json({ success: true, slots });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Server Error" });
//     }
// };


// controllers/appointmentController.js


exports.getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.body;
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

        // ১. অ্যাডমিন প্যানেল থেকে ওই দিনের মেইন স্লট আনা
        const mainSlot = await TimeSlot.findOne({ day: dayName });
        if (!mainSlot) {
            return res.json({ success: false, message: "No availability for this day." });
        }

        // ২. ডাটাবেসে ওই তারিখে অলরেডি কোন কোন সময় বুক করা আছে তা আনা
        const existingBookings = await Booking.find({ date: new Date(date) }).select('time');
        const bookedTimes = existingBookings.map(b => b.time);

        let slots = [];
        let start = new Date(`1970-01-01T${mainSlot.start_time}:00`);
        let end = new Date(`1970-01-01T${mainSlot.end_time}:00`);

        // ৩. স্লট তৈরি এবং বুকিং স্ট্যাটাস চেক
        while (start < end) {
            let timeLabel = start.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            });

            slots.push({
                time: timeLabel,
                isBooked: bookedTimes.includes(timeLabel) // যদি লিস্টে থাকে তবে true
            });

            start.setMinutes(start.getMinutes() + 30);
        }

        res.json({ success: true, slots });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error checking slots" });
    }
};