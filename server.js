const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Configure Cloudinary with API keys from .env file
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Set up storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'captured_images', // Folder name in Cloudinary
        format: async () => 'png', // Save as PNG format
        public_id: (req, file) => 'image_' + Date.now()
    }
});

const upload = multer({ storage: storage });

// API Endpoint to handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ message: 'Image saved successfully', url: req.file.path });
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
