const Video = require('../models/Video');

// ১. নতুন ভিডিও যোগ করা
exports.addVideo = async (req, res) => {
    try {
        const { title, video_url, short_bio } = req.body;

        // ইউটিউব ভিডিও আইডি এবং থাম্বনেইল জেনারেট করা
        let videoId = "";
        if (video_url.includes('v=')) {
            videoId = video_url.split('v=')[1].split('&')[0];
        } else {
            videoId = video_url.split('/').pop();
        }
        
        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        const newVideo = new Video({
            title,
            video_url,
            thumbnail,
            short_bio
        });

        await newVideo.save();
        res.status(201).json({ success: true, message: "Video added successfully!", data: newVideo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ২. সব ভিডিও দেখা
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৩. ভিডিও ডিলিট করা
exports.deleteVideo = async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Video deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// ৪. সিঙ্গেল ভিডিও ডাটা আনা
exports.getSingleVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ৫. ভিডিও আপডেট করা
exports.updateVideo = async (req, res) => {
    try {
        const { title, video_url, short_bio } = req.body;
        
        // নতুন ভিডিও আইডি থেকে থাম্বনেইল আপডেট করা
        const videoId = video_url.split('v=')[1]?.split('&')[0] || video_url.split('/').pop();
        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.id, 
            { title, video_url, short_bio, thumbnail }, 
            { new: true }
        );

        res.status(200).json({ success: true, message: "Video updated!", data: updatedVideo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};