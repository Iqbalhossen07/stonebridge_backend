const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ১. লগইন কন্ট্রোলার
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: admin._id, role: 'admin' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: false, // লোকালহোস্টে false
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ 
            success: true, 
            message: `Welcome Back, ${admin.name}!`,
            admin: { name: admin.name, image: admin.image }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ২. প্রোফাইল আপডেট কন্ট্রোলার
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, oldPassword, newPassword } = req.body;
        const adminId = req.user.id;

        const admin = await Admin.findById(adminId);
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

        let updateData = { name, email };

        // লজিক: যদি ইউজার নতুন পাসওয়ার্ড সেট করতে চায়
        if (newPassword) {
            // ১. চেক করতে হবে সে ওল্ড পাসওয়ার্ড দিয়েছে কি না
            if (!oldPassword) {
                return res.status(400).json({ success: false, message: "Current password is required to change password!" });
            }
            // ২. ওল্ড পাসওয়ার্ড ম্যাচ করছে কি না
            const isMatch = await bcrypt.compare(oldPassword, admin.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Current password does not match!" });
            }
            // ৩. সব ঠিক থাকলে নতুন পাসওয়ার্ড হ্যাশ করে ডাটাতে যোগ করা
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }

        // ছবি আপডেট (যদি থাকে)
        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });

        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully!",
            admin: { name: updatedAdmin.name, image: updatedAdmin.image, email: updatedAdmin.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৩. চেক-অথ (ProtectedRoute এর জন্য এটি মাস্ট লাগবে)
exports.checkAuth = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        if (!admin) return res.status(404).json({ authenticated: false });
        res.status(200).json({ authenticated: true, admin });
    } catch (error) {
        res.status(500).json({ authenticated: false });
    }
};

// ৪. লগআউট কন্ট্রোলার
exports.adminLogout = async (req, res) => {
    res.clearCookie('adminToken');
    res.status(200).json({ success: true, message: "Logged out successfully" });
};