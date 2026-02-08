const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { upload } = require('../config/cloudinary');

router.post('/testimonial/add', upload.single('image'), testimonialController.createTestimonial);
router.get('/testimonial/all', testimonialController.getAllTestimonials);
router.delete('/testimonial/delete/:id', testimonialController.deleteTestimonial);
router.get('/testimonial/single/:id', testimonialController.getSingleTestimonial);
router.put('/testimonial/update/:id', upload.single('image'), testimonialController.updateTestimonial);

module.exports = router;