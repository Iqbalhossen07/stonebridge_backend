const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { upload } = require('../config/cloudinary'); // ইমেজ আপলোডের জন্য

// ১. নতুন ব্লগ তৈরি করা (ইমেজসহ)
router.post('/blog/add', upload.single('image'), blogController.createBlog);

// ২. সব ব্লগ দেখা
router.get('/blog/all', blogController.getAllBlogs);

// ৩. নির্দিষ্ট একটি ব্লগ দেখা (স্ল্যাগ বা আইডি দিয়ে)
router.get('/blog/single/:id', blogController.getSingleBlog);

// ৪. ব্লগ আপডেট করা
router.put('/blog/update/:id', upload.single('image'), blogController.updateBlog);

// ৫. ব্লগ ডিলিট করা
router.delete('/blog/delete/:id', blogController.deleteBlog);

module.exports = router;