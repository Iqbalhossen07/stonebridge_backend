const express = require('express');
const router = express.Router();
const timeSlotController = require('../controllers/timeSlotController');

router.get('/all', timeSlotController.getAllSlots);
router.post('/add', timeSlotController.addSlot);
router.delete('/delete/:id', timeSlotController.deleteSlot);
router.post('/check-available', timeSlotController.getAvailableSlots);

module.exports = router;