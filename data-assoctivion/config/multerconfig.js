const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Define the upload directory
const uploadDir = path.join(__dirname, '../public/image/upload');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, data) {
            if (err) return cb(err);
            const fn = data.toString('hex') + path.extname(file.originalname);
            cb(null, fn);
        });
    }
});

// Create the multer upload instance
const upload = multer({ storage: storage });

module.exports = upload;
