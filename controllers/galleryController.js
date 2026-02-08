const Gallery = require('../models/Gallery');

// একাধিক ইমেজ আপলোড করা
exports.uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please select images to upload" });
        }

        const { caption } = req.body;
        
        // প্রতিটি ফাইলের জন্য ডাটাবেসে এন্ট্রি তৈরি করা
        const galleryEntries = req.files.map(file => ({
            image: file.path,
            caption: caption || "",
            public_id: file.filename
        }));

        const savedImages = await Gallery.insertMany(galleryEntries);

        res.status(201).json({ success: true, message: "Images uploaded!", data: savedImages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// সব ইমেজ দেখা
exports.getGallery = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ইমেজ ডিলিট করা
exports.deleteImage = async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Image removed from gallery" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};