const express = require("express");
const router = express.Router();
const path = require("path");
const rateLimit = require('express-rate-limit');

require("dotenv").config();

// Create a rate limiter with a maximum of 100 requests per minute
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: Number(process.env.DOWNLOAD_LIMIT), // 10 requests per minute
});

router.post('/file/download', limiter, (req, res) => {
    const filename = req.body.fileName;

    // Ensure the filename is safe by allowing only specific characters and restricting directory traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(filename)) {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(__dirname, 'uploads', filename);

    // Check if the file exists before attempting to send it
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

module.exports = router;
