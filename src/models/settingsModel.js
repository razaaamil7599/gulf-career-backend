const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Hum ek hi document rakhenge jiska key 'contactInfo' hoga
    key: { type: String, default: 'contactInfo', unique: true },
    email: String,
    whatsapp: String,
    address: String
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;