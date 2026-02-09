const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// ট্রান্সপোর্টার (আপনার আগের কনফিগ অনুযায়ী)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.submitContactForm = async (req, res) => {
    try {
        const { subject, full_name, email, phone, message } = req.body;

        // ১. ডাটাবেসে সেভ করা
        const newContact = new Contact({ subject, full_name, email, phone, message });
        await newContact.save();

        // ২. ক্লায়েন্টের জন্য ইমেইল (Confirmation)
        const clientMailOptions = {
            from: `"Stonebridge Legal" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'We Received Your Message - Stonebridge Legal',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #87550D;">Hello ${full_name},</h2>
                    <p>Thank you for reaching out to us. We have received your query regarding <b>${subject}</b>.</p>
                    <p>Our team will review your message and get back to you within 24 hours.</p>
                    <hr/>
                    <p style="font-size: 12px; color: #666;">This is an automated response. Please do not reply directly to this email.</p>
                </div>`
        };

        // ৩. অ্যাডমিনের জন্য ইমেইল (Alert)
        const adminMailOptions = {
            from: `"Website Alert" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Query: ${subject} from ${full_name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
                    <h2>New Contact Form Submission</h2>
                    <p><b>Name:</b> ${full_name}</p>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Phone:</b> ${phone || 'N/A'}</p>
                    <p><b>Subject:</b> ${subject}</p>
                    <p><b>Message:</b> ${message}</p>
                </div>`
        };

        await transporter.sendMail(clientMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(201).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("Contact Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};





// ১. সব মেসেজ ডাটাবেস থেকে নিয়ে আসা (Latest First)
exports.getAllQueries = async (req, res) => {
    try {
        const queries = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: queries });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching queries" });
    }
};

// ২. একটি নির্দিষ্ট মেসেজ ডিলিট করা
exports.deleteSingleQuery = async (req, res) => {
    try {
        const { id } = req.params;
        await Contact.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete message" });
    }
};

// ৩. বাল্ক ডিলিট (একসাথে অনেকগুলো ডিলিট)
exports.deleteBulkQueries = async (req, res) => {
    try {
        const { ids } = req.body; // ফ্রন্টএন্ড থেকে অ্যারে আসবে [id1, id2, ...]
        await Contact.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ success: true, message: "Selected messages deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Bulk delete failed" });
    }
};