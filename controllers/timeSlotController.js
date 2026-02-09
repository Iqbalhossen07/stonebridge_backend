const TimeSlot = require('../models/TimeSlot');
const Booking = require('../models/Booking');

// সব স্লট দেখা
exports.getAllSlots = async (req, res) => {
    try {
        const slots = await TimeSlot.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: slots });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// আপনার আগের getAllSlots এর নিচে এটি পেস্ট করুন
// exports.getAvailableSlots = async (req, res) => {
//     try {
//         const { date } = req.body;
//         const selectedDate = new Date(date);
//         const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

//         // ডাটাবেস থেকে ওই দিনের স্লট আনা
//         const mainSlot = await TimeSlot.findOne({ day: dayName });
        
//         if (!mainSlot) {
//             return res.json({ success: false, message: "Lawyer is not available on this day." });
//         }

//         let slots = [];
//         // ডাটাবেসের 24-hour ফরম্যাট (যেমন: 13:00) কে ক্যালকুলেট করা
//         let start = new Date(`1970-01-01T${mainSlot.start_time}:00`);
//         let end = new Date(`1970-01-01T${mainSlot.end_time}:00`);

//         // ৩০ মিনিটের গ্যাপে স্লট তৈরি করা
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
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };



exports.getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.body;
        const selectedDate = new Date(date);
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

        // ১. ডাটাবেস থেকে ওই দিনের মেইন স্লট আনা
        const mainSlot = await TimeSlot.findOne({ day: dayName });
        
        if (!mainSlot) {
            return res.json({ success: false, message: "Lawyer is not available on this day." });
        }

        // ২. ওই নির্দিষ্ট তারিখের যত বুকিং অলরেডি হয়ে গেছে সেগুলো খুঁজে বের করা
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existingBookings = await Booking.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        }).select('time');

        // শুধু টাইমের একটি লিস্ট তৈরি (যেমন: ["09:30 AM", "11:00 AM"])
        const bookedTimes = existingBookings.map(b => b.time);

        let slots = [];
        let start = new Date(`1970-01-01T${mainSlot.start_time}:00`);
        let end = new Date(`1970-01-01T${mainSlot.end_time}:00`);

        // ৩. ৩০ মিনিটের গ্যাপে স্লট তৈরি এবং বুকিং চেক করা
        while (start < end) {
            let timeLabel = start.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            });

            // চেক করা হচ্ছে এই টাইম স্লটটি কি বুকড লিস্টে আছে?
            slots.push({
                time: timeLabel,
                isBooked: bookedTimes.includes(timeLabel) // যদি ট্রু হয় তবে ফ্রন্টএন্ডে লাল দেখাবে
            });

            start.setMinutes(start.getMinutes() + 30);
        }

        res.json({ success: true, slots });
    } catch (error) {
        console.error("Slot Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// নতুন স্লট যোগ করা
exports.addSlot = async (req, res) => {
    try {
        const { day } = req.body;

        // ১. ডাটাবেসে এই দিনটি আগে থেকেই আছে কি না চেক করা
        const existingSlot = await TimeSlot.findOne({ day: day });

        if (existingSlot) {
            // ২. যদি দিনটি পাওয়া যায়, তবে একটি এরর মেসেজ পাঠানো
            return res.status(400).json({ 
                success: false, 
                message: `${day} is already added. Please edit the existing one or delete it first.` 
            });
        }

        // ৩. দিনটি না থাকলে নতুন স্লট তৈরি এবং সেভ করা
        const newSlot = new TimeSlot(req.body);
        await newSlot.save();
        
        res.status(201).json({ success: true, message: 'Time slot added successfully!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// স্লট ডিলিট করা
exports.deleteSlot = async (req, res) => {
    try {
        await TimeSlot.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Time slot deleted!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};