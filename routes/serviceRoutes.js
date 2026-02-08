const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { upload } = require('../config/cloudinary');

// Main Service Routes
router.post('/service/add', upload.single('image'), serviceController.addMainService);
router.get('/service/all-with-sub', serviceController.getAllWithSub);
router.put('/service/update/:id', upload.single('image'), serviceController.updateMainService);
router.delete('/service/delete/:id', serviceController.deleteMainService);

// Sub Service Routes
router.post('/sub-service/add', upload.single('image'), serviceController.addSubService);
// সাব-সার্ভিস ডিলিট রাউট
router.delete('/sub-service/delete/:id', serviceController.deleteSubService);
router.get('/sub-service/single/:id', serviceController.getSingleSubService);
// অবশ্যই PUT মেথড ব্যবহার করবেন এবং পাথটি ফ্রন্টএন্ডের সাথে মিলাবেন
router.put('/sub-service/update/:id', upload.single('image'), serviceController.updateSubService);

module.exports = router;