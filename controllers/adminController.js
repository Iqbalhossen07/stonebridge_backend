const Booking = require('../models/Booking');
const Team = require('../models/Team');
const Service = require('../models/Service');
const Subservice = require('../models/Subservice');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const Gallery = require('../models/Gallery');
const TimeSlot = require('../models/TimeSlot');
const Video = require('../models/Video');

exports.getAllStats = async (req, res) => {
    try {
        // ৯টি টেবিলের কাউন্ট একসাথে আনা হচ্ছে
        const [
            appointments, team, services, subservices, 
            blogs, testimonials, gallery, timeslots, videos
        ] = await Promise.all([
            Booking.countDocuments(),
            Team.countDocuments(),
            Service.countDocuments(),
            Subservice.countDocuments(),
            Blog.countDocuments(),
            Testimonial.countDocuments(),
            Gallery.countDocuments(),
            TimeSlot.countDocuments(),
            Video.countDocuments()
        ]);

        res.status(200).json({
            appointments,
            team,
            services,
            subservices,
            blogs,
            testimonials,
            gallery,
            timeslots,
            videos
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Stats fetching failed" });
    }
};