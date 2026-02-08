const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { upload } = require('../config/cloudinary');

// ইমেজসহ ডাটা পাঠানোর জন্য upload.single('image') ব্যবহার করা হয়েছে
router.post('/team/add', upload.single('image'), teamController.addMember);
router.get('/team/all', teamController.getAllMembers);
router.delete('/team/delete/:id', teamController.deleteMember);
// ১. নির্দিষ্ট মেম্বারের ডাটা দেখার রুট
router.get('/team/single/:id', teamController.getSingleMember);

// ২. মেম্বারের ডাটা আপডেট করার রুট (ইমেজসহ)
router.put('/team/update/:id', upload.single('image'), teamController.updateMember);

module.exports = router;