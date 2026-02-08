const Testimonial = require('../models/Testimonial');

exports.createTestimonial = async (req, res) => {
    try {
        const { name, designation, rating, description } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload author photo" });
        }

        const newTestimonial = new Testimonial({
            name,
            designation,
            rating,
            description,
            image: req.file.path // Cloudinary URL
        });

        await newTestimonial.save();
        res.status(201).json({ success: true, message: "Testimonial added successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// সব টেস্টিমোনিয়াল দেখা
exports.getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ডিলিট করা
exports.deleteTestimonial = async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ৪. সিঙ্গেল ডাটা আনা
exports.getSingleTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ৫. আপডেট করা
exports.updateTestimonial = async (req, res) => {
    try {
        const { name, designation, rating, description } = req.body;
        let updateData = { name, designation, rating, description };

        if (req.file) {
            updateData.image = req.file.path; // নতুন ইমেজ আপলোড হলে
        }

        await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ success: true, message: "Updated successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};