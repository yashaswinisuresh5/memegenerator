const Meme = require('../models/Meme');
const axios = require('axios');

// Fetch memes from Imgflip API
exports.getMemes = async (req, res) => {
    try {
        const response = await axios.get('https://api.imgflip.com/get_memes');
        if (response.data.success) {
            res.json(response.data.data.memes);
        } else {
            res.status(500).json({ error: 'Failed to fetch memes from Imgflip API' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching memes', details: error.message });
    }
};

// Get a random meme
exports.getRandomMeme = async (req, res) => {
    try {
        const response = await axios.get('https://api.imgflip.com/get_memes');
        if (response.data.success) {
            const memes = response.data.data.memes;
            const randomIndex = Math.floor(Math.random() * memes.length);
            res.json(memes[randomIndex]);
        } else {
            res.status(500).json({ error: 'Failed to fetch memes from Imgflip API' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching random meme', details: error.message });
    }
};

// Handle custom image upload
exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return relative path url
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
};

// Save a generated meme to local storage
exports.saveMeme = async (req, res) => {
    try {
        const { imageUrl, topText, bottomText, fontSize } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL is required' });
        }

        const savedMeme = await Meme.create({
            imageUrl,
            topText: topText || '',
            bottomText: bottomText || '',
            fontSize: fontSize || 40
        });

        res.status(201).json(savedMeme);
    } catch (error) {
        res.status(500).json({ error: 'Error saving meme', details: error.message });
    }
};

// Retrieve saved memes
exports.getSavedMemes = async (req, res) => {
    try {
        const memes = await Meme.findAll();
        // Return reverse chronological so newest is first
        res.json(memes.reverse());
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving saved memes', details: error.message });
    }
};

// AI Caption Generator
exports.getAICaption = (req, res) => {
    const { templateName } = req.body;
    const name = templateName?.toLowerCase() || '';

    const captions = [
        { top: "When you finally", bottom: "fix the bug at 3 AM" },
        { top: "Me explaining to my mom", bottom: "why I need a 4090 for homework" },
        { top: "Nobody:", bottom: "Literally nobody:" },
        { top: "POV: You just realized", bottom: "production is down" },
        { top: "The code works", bottom: "I don't know why" },
        { top: "It's not a bug", bottom: "It's a feature" },
        { top: "My bank account:", bottom: "Please stop" },
        { top: "Me looking at the legacy code", bottom: "I wrote 2 weeks ago" },
        { top: "Is this...", bottom: "a crossover episode?" },
        { top: "I'm in this photo", bottom: "and I don't like it" }
    ];

    // Simple keyword mapping
    let selected = captions[Math.floor(Math.random() * captions.length)];

    if (name.includes('batman')) {
        selected = { top: "Batman when he sees", bottom: "a minor inconvenience" };
    } else if (name.includes('spiderman')) {
        selected = { top: "The multiverses", bottom: "when they collide" };
    } else if (name.includes('drake')) {
        selected = { top: "Drake when he sees", bottom: "a new trend" };
    } else if (name.includes('dog') || name.includes('cat')) {
        selected = { top: "What my pet sees", bottom: "at 2 AM" };
    }

    res.json(selected);
};
