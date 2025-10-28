const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    salary: {
        type: String
    },
    benefits: {
        type: [String]
    },
    imageUrl: { // Add this new field for the image
        type: String,
        required: true
    },
    contactNumber: { // Add this new field for WhatsApp
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Vacancy = mongoose.model('Vacancy', vacancySchema);

module.exports = Vacancy;