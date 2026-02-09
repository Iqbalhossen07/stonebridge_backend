const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/submit', contactController.submitContactForm);



// সব মেসেজ দেখার রাউট
router.get('/all', contactController.getAllQueries);

// সিঙ্গেল ডিলিট রাউট
router.delete('/delete/:id', contactController.deleteSingleQuery);

// বাল্ক ডিলিট রাউট
router.post('/delete-bulk', contactController.deleteBulkQueries);


module.exports = router;