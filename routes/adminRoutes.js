const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// ড্যাশবোর্ড স্ট্যাটাস রাউট
router.get('/all-stats', adminController.getAllStats);

module.exports = router;