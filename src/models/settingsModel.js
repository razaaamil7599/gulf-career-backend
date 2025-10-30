// src/models/settingsModel.js
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    email: { type: String },
    whatsapp: { type: String },
    address: { type: String },
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
