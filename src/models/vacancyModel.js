// src/models/vacancyModel.js
import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema({
    title: String,
    salary: String,
    country: String,
    requirements: String,
    description: String,
});

const Vacancy = mongoose.model('Vacancy', vacancySchema);

export default Vacancy;
