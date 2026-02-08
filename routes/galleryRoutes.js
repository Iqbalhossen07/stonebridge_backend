const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { upload } = require('../config/cloudinary');

// 'images' নামে মাল্টিপল ফাইল আপলোড (সর্বোচ্চ ১০টি)
router.post('/gallery/upload', upload.array('images', 10), galleryController.uploadImages);
router.get('/gallery/all', galleryController.getGallery);
router.delete('/gallery/delete/:id', galleryController.deleteImage);

module.exports = router;