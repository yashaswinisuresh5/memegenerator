const express = require('express');
const router = express.Router();
const memeController = require('../controllers/memeController');
const upload = require('../middleware/upload');

// Imgflip API proxies
router.get('/memes', memeController.getMemes);
router.get('/random', memeController.getRandomMeme);

// Storage and upload
router.post('/upload', upload.single('memeImage'), memeController.uploadImage);
router.post('/save', memeController.saveMeme);
router.get('/saved', memeController.getSavedMemes);

// AI Features
router.post('/ai-caption', memeController.getAICaption);

module.exports = router;
