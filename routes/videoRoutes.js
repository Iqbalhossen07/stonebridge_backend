const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/video/add', videoController.addVideo);
router.get('/video/all', videoController.getAllVideos);
router.delete('/video/delete/:id', videoController.deleteVideo);
router.get('/video/single/:id', videoController.getSingleVideo);
router.put('/video/update/:id', videoController.updateVideo);

module.exports = router;