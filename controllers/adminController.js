exports.getAllStats = async (req, res) => {
  try {
    // সবগুলো মডেল থেকে কাউন্ট নেওয়া
    const [appointments, team, services, blogs, testimonials, gallery] = await Promise.all([
      Appointment.countDocuments(),
      Team.countDocuments(),
      Service.countDocuments(),
      Blog.countDocuments(),
      Testimonial.countDocuments(),
      Gallery.countDocuments()
    ]);

    res.status(200).json({
      appointments,
      team,
      services,
      blogs,
      testimonials,
      gallery
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};