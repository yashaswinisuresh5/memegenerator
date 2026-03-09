const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const memeRoutes = require('./src/routes/memeRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow CORS for Vercel deployment and local dev
app.use(cors({
    origin: '*', // For demo/hobbyist ease; in production you'd restrict this
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api', memeRoutes);

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route for SPA - Express 5 compatible
app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
