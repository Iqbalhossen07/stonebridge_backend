const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
    try {
        const { title, description, category, video_link } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a featured image" });
        }

        // টাইটেল থেকে স্ল্যাগ তৈরি করা
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const newBlog = new Blog({
            title,
            description,
            category,
            video_link,
            image: req.file.path, // Cloudinary URL
            slug: slug
        });

        await newBlog.save();
        res.status(201).json({ success: true, message: "Blog published successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// ২. সব ব্লগ দেখা (সার্ভার এই ফাংশনটি না পেলে ক্রাশ করবে)
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৩. নির্দিষ্ট একটি ব্লগ দেখা
exports.getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৪. ব্লগ আপডেট করা
exports.updateBlog = async (req, res) => {
    try {
        const { title, description, category, video_link } = req.body;
        let updateData = { title, description, category, video_link };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ success: true, message: "Blog updated successfully!", data: updatedBlog });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৫. ব্লগ ডিলিট করা
exports.deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Blog deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};