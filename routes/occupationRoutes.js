const express = require('express');
const router = express.Router();
const occupationController = require('../controllers/occupationController');

// আপনার এপিআই রুট
router.get('/occupations', occupationController.getOccupations);

module.exports = router;