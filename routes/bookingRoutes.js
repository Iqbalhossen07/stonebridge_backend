const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { upload } = require('../config/cloudinary'); // আপনার ক্লাউডিনারি কনফিগ

// বুকিং পোস্ট করার রাউট
router.post('/create', upload.single('receipt'), bookingController.createBooking);
router.get('/all', bookingController.getAllBookings); // সব বুকিং দেখার জন্য
router.delete('/delete/:id', bookingController.deleteBooking);
router.put('/status/:id', bookingController.updateStatus);
router.put('/reschedule/:id', bookingController.updateSchedule);
// এখানে POST মেথড হবে, কারণ আমরা তারিখ পাঠাচ্ছি
router.post('/available-slots', bookingController.checkAvailableSlots);
router.get('/details/:id', bookingController.getBookingDetails);

module.exports = router;