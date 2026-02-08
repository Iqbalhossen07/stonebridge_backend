const Team = require('../models/Team');

// ১. নতুন মেম্বার অ্যাড করা (Create)
exports.addMember = async (req, res) => {
    try {
        const { name, designation, short_bio, facebook, linkedin } = req.body;
        const imageUrl = req.file ? req.file.path : ""; 

        const newMember = new Team({
            name,
            designation,
            image: imageUrl,
            short_bio,
            facebook,
            linkedin
        });

        await newMember.save();
        res.status(201).json({ success: true, message: "Member added!", data: newMember });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllMembers = async (req, res) => {
    try {
        const members = await Team.find().sort({ order: 1 });
        
        // ডিবাগ করার জন্য সার্ভার কনসোলে চেক করুন
        console.log("Members found in DB:", members.length);
        
        // ফ্রন্টএন্ডে success: true সহ পাঠানো ভালো প্র্যাকটিস
        res.status(200).json({
            success: true,
            data: members
        });
    } catch (error) {
        console.error("DB Fetch Error:", error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};



// ১. নির্দিষ্ট মেম্বারের ডাটা খুঁজে বের করা (Get Single Member)
exports.getSingleMember = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Team.findById(id);

        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found!" });
        }

        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ২. মেম্বারের ডাটা আপডেট করা (Update Member)
exports.updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, designation, short_bio, facebook, linkedin } = req.body;

        // ডাটাবেস থেকে মেম্বারকে খুঁজে দেখা
        let member = await Team.findById(id);
        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found!" });
        }

        // যদি নতুন ইমেজ আপলোড করা হয়, তবে সেটি ব্যবহার হবে, নাহলে পুরনোটিই থাকবে
        let imageUrl = member.image; 
        if (req.file) {
            imageUrl = req.file.path; // Cloudinary নতুন URL
        }

        // নতুন ডাটা দিয়ে আপডেট করা
        const updatedData = {
            name,
            designation,
            short_bio,
            facebook,
            linkedin,
            image: imageUrl
        };

        const updatedMember = await Team.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({
            success: true,
            message: "Member updated successfully!",
            data: updatedMember
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৩. মেম্বার ডিলিট করা (Delete)
exports.deleteMember = async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Member removed successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};