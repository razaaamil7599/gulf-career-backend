import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    company: {
        type: String
    },
    // Aap yahan aur bhi fields add kar sakte hain
}, { timestamps: true });

// Agar model pehle se bana hai, toh use use karein, varna naya banayein
export default mongoose.models.Vacancy || mongoose.model('Vacancy', vacancySchema);

