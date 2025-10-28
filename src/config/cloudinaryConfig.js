// -----------------------------
// ✅ Cloudinary + Multer Setup
// -----------------------------

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

// 🔹 Cloudinary Configuration (.env से डेटा पढ़ेगा)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Multer Storage (Cloudinary में डायरेक्ट इमेज अपलोड)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vacancy_images', // Cloudinary पर यह फ़ोल्डर बनेगा
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }],
    },
});

// 🔹 Multer Upload Middleware
const upload = multer({ storage });

// ✅ Export दोनों चीज़ें करें
module.exports = { cloudinary, upload };