const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const upload = require('../middleware/multer'); // আপনার ইমেজ আপলোড মিডলওয়্যার

router.get('/sub-services', serviceController.getOnlySubServices);
router.post('/check-slots', appointmentController.getAvailableSlots);
router.post('/book', upload.single('receipt'), appointmentController.bookAppointment);


module.exports = router;