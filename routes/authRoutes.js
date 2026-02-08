const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); // নিশ্চিত করুন এই ফাইলটি আছে

// চেক করুন এই ফাংশনগুলো authController-এ ঠিক এই নামেই আছে কি না
router.post('/login', authController.adminLogin);
router.post('/logout', authController.adminLogout);
router.get('/check-auth', verifyToken, authController.checkAuth);

// প্রোফাইল আপডেট রাউট
// ১০ নম্বর লাইনে সমস্যা হতে পারে যদি authController.updateProfile খুঁজে না পায়
router.put('/update-profile', verifyToken, upload.single('image'), authController.updateProfile);

module.exports = router;