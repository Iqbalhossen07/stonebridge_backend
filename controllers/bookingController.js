const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');
const TimeSlot = require('../models/TimeSlot');

// ১. ইমেইল ট্রান্সপোর্টার সেটআপ
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

exports.createBooking = async (req, res) => {
    try {
        const { name, email, phone, address, service, date, time, message } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Payment receipt image is required" });
        }

        // ২. নতুন বুকিং ডাটাবেসে সেভ করা
        const newBooking = new Booking({
            name, email, phone, address, service, date, time, message,
            receipt_image: req.file.path, 
            duration_time: '30 Minutes',
        });
        await newBooking.save();

        // --- ৩. ক্লায়েন্টের জন্য প্রিমিয়াম ইমেইল টেমপ্লেট ---
        const clientMailOptions = {
            from: `"Stonebridge Legal" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Appointment Received - Stonebridge Legal',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                    <div style="background-color: #0f172a; padding: 40px 20px; text-align: center;">
                        <h1 style="color: #87550D; margin: 0; font-size: 28px;">Appointment Received!</h1>
                        <p style="color: #cbd5e1; margin-top: 10px;">Thank you for choosing Stonebridge Legal</p>
                    </div>
                    <div style="padding: 30px; color: #334155; line-height: 1.6;">
                        <p>Dear <b>${name}</b>,</p>
                        <p>We have received your appointment request. Our team is currently reviewing your payment receipt. Once verified, we will send you the meeting link.</p>
                        <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
                            <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Booking Details</h3>
                            <p style="margin: 8px 0;"><b>Service:</b> ${service}</p>
                            <p style="margin: 8px 0;"><b>Date:</b> ${date}</p>
                            <p style="margin: 8px 0;"><b>Time:</b> ${time}</p>
                        </div>
                        <p style="font-size: 14px; color: #64748b;">If you have any questions, feel free to reply to this email.</p>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                        <p style="margin: 0;">Best Regards,</p>
                        <p style="margin: 5px 0; color: #0f172a; font-weight: bold;">Stonebridge Legal Team</p>
                    </div>
                </div>`
        };

        // --- ৪. অ্যাডমিনের জন্য প্রিমিয়াম ইমেইল টেমপ্লেট (Attachment সহ) ---
        const adminMailOptions = {
            from: `"System Alert" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Booking Alert: ${name}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                    <div style="background-color: #87550D; padding: 30px; text-align: center; color: white;">
                        <h2 style="margin: 0;">New Appointment Request</h2>
                    </div>
                    <div style="padding: 30px; color: #334155;">
                        <p>You have received a new booking request from your website.</p>
                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><b>Client:</b></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${name}</td></tr>
                            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><b>Email:</b></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${email}</td></tr>
                            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><b>Phone:</b></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${phone}</td></tr>
                            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><b>Service:</b></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${service}</td></tr>
                            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><b>Schedule:</b></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${date} at ${time}</td></tr>
                        </table>
                        <p><b>Message:</b> ${message || 'No message provided'}</p>
                        <div style="margin-top: 20px; padding: 15px; background-color: #fff7ed; border-radius: 8px; border: 1px solid #ffedd5;">
                            <p style="margin: 0; color: #9a3412; font-size: 14px;"><b>Action Required:</b> Please check the attached payment receipt to confirm this booking.</p>
                        </div>
                    </div>
                </div>`,
            attachments: [
                {
                    filename: 'payment-receipt.jpg',
                    path: req.file.path // Cloudinary URL টি অ্যাটাচমেন্ট হিসেবে যাবে
                }
            ]
        };

        // ৫. ইমেইল পাঠানো
        await transporter.sendMail(clientMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(201).json({
            success: true,
            message: "Booking successful! Confirmation emails have been sent.",
            data: newBooking
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error, please try again." });
    }
};


// ১. সব বুকিং ডাটাবেস থেকে নিয়ে আসা
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }); 
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching bookings" });
    }
};

// ২. বুকিং স্ট্যাটাস আপডেট করা (Confirm করা)
// exports.updateStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedBooking = await Booking.findByIdAndUpdate(
//             id, 
//             { status: 'Confirmed' }, 
//             { new: true }
//         );
//         res.status(200).json({ success: true, data: updatedBooking });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Update failed" });
//     }
// };

exports.checkAvailableSlots = async (req, res) => {
    try {
        const { date } = req.body;
        const selectedDate = new Date(date);
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

        // ১. ওই দিনের মেইন কাজের সময় আনা
        const mainSlot = await TimeSlot.findOne({ day: dayName });
        if (!mainSlot) {
            return res.json({ success: false, message: "No slots available for this day." });
        }

        // ২. ওই তারিখে ইতিমধ্যে করা বুকিংগুলো চেক করা
        const existingBookings = await Booking.find({ date: date }).select('time');
        const bookedTimes = existingBookings.map(b => b.time);

        let slots = [];
        let start = new Date(`1970-01-01T${mainSlot.start_time}:00`);
        let end = new Date(`1970-01-01T${mainSlot.end_time}:00`);

        while (start < end) {
            let timeLabel = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            
            slots.push({
                time: timeLabel,
                isBooked: bookedTimes.includes(timeLabel) // আগে বুকড থাকলে true হবে
            });
            start.setMinutes(start.getMinutes() + 30);
        }

        res.json({ success: true, slots });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ success: false, message: "Booking ID is missing" });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            id, 
            { status: 'Confirmed' }, 
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found with this ID" });
        }

        // --- ৩.৫ ইমেইল লজিক (ক্লায়েন্ট ও অ্যাডমিন আলাদা) ---
        
        // ১. ক্লায়েন্টের জন্য ইমেইল
        const clientMailOptions = {
            from: `"Stonebridge Legal" <${process.env.EMAIL_USER}>`,
            to: updatedBooking.email,
            subject: 'Appointment Confirmed - Stonebridge Legal',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                    <div style="background-color: #16a34a; padding: 40px 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">Payment Verified!</h1>
                        <p style="color: #dcfce7; margin-top: 10px;">Your appointment is now officially confirmed.</p>
                    </div>
                    <div style="padding: 30px; color: #334155; line-height: 1.6;">
                        <p>Dear <b>${updatedBooking.name}</b>,</p>
                        <p>We are pleased to inform you that your payment has been verified. Your appointment is confirmed.</p>
                        <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 20px; border-radius: 12px; margin: 25px 0;">
                            <p style="margin: 8px 0;"><b>Service:</b> ${updatedBooking.service}</p>
                            <p style="margin: 8px 0;"><b>Date:</b> ${updatedBooking.date}</p>
                            <p style="margin: 8px 0;"><b>Time:</b> ${updatedBooking.time}</p>
                        </div>
                        <p>Meeting link will be shared shortly. Thank you for your patience.</p>
                        <p style="margin-top: 30px;">Best Regards,<br/><b>Stonebridge Legal Team</b></p>
                    </div>
                </div>`
        };

        // ২. অ্যাডমিনের জন্য ইমেইল (ston@gmail.com)
        const adminMailOptions = {
            from: `"System Update" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `Status Confirmed: ${updatedBooking.name}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #16a34a;">Status Updated to Confirmed</h2>
                    <p><b>Client Name:</b> ${updatedBooking.name}</p>
                    <p><b>Service:</b> ${updatedBooking.service}</p>
                    <p><b>Status:</b> Confirmed (Payment Verified)</p>
                    <p>Client has been notified via email.</p>
                </div>`
        };

        await transporter.sendMail(clientMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(200).json({ success: true, data: updatedBooking });
    } catch (error) {
        console.error("Update Error Details:", error);
        res.status(500).json({ success: false, message: error.message || "Update failed" });
    }
};

// ৩. বুকিং ডিলিট করা
exports.deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Booking deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
};


// নতুন ফাংশন: তারিখ ও সময় আপডেট করার জন্য
exports.updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            id, 
            { date, time }, 
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // --- ৩.৫ ইমেইল লজিক (ক্লায়েন্ট ও অ্যাডমিন আলাদা) ---

        // ১. ক্লায়েন্টের জন্য ইমেইল
        const clientMailOptions = {
            from: `"Stonebridge Legal" <${process.env.EMAIL_USER}>`,
            to: updatedBooking.email,
            subject: 'Appointment Rescheduled - Stonebridge Legal',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                    <div style="background-color: #0f172a; padding: 40px 20px; text-align: center;">
                        <h1 style="color: #87550D; margin: 0; font-size: 28px;">Schedule Updated!</h1>
                        <p style="color: #cbd5e1; margin-top: 10px;">Your appointment has been rescheduled.</p>
                    </div>
                    <div style="padding: 30px; color: #334155; line-height: 1.6;">
                        <p>Dear <b>${updatedBooking.name}</b>,</p>
                        <p>Please note that your appointment for <b>${updatedBooking.service}</b> has been moved to a new time slot.</p>
                        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin: 25px 0;">
                            <h3 style="margin-top: 0; color: #0f172a;">New Schedule</h3>
                            <p style="margin: 8px 0;"><b>New Date:</b> ${date}</p>
                            <p style="margin: 8px 0;"><b>New Time:</b> ${time}</p>
                        </div>
                        <p>Best Regards,<br/><b>Stonebridge Legal Team</b></p>
                    </div>
                </div>`
        };

        // ২. অ্যাডমিনের জন্য ইমেইল
        const adminMailOptions = {
            from: `"System Update" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `Rescheduled: ${updatedBooking.name}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #0f172a;">Appointment Rescheduled</h2>
                    <p><b>Client Name:</b> ${updatedBooking.name}</p>
                    <p><b>New Date:</b> ${date}</p>
                    <p><b>New Time:</b> ${time}</p>
                    <p>This update has been synchronized with the database.</p>
                </div>`
        };

        await transporter.sendMail(clientMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(200).json({ success: true, data: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
};




// একটি নির্দিষ্ট বুকিংয়ের ডিটেইলস আনা
exports.getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};