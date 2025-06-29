// Import mongoose.
const mongoose = require('mongoose');

// Define Schema.
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true},
    company: { type: String, required: true},
    location: { type: String, required: true},
    description: { type: String, required: true},
    salary: String,
    createdAt: { type: Date, default: Date.now}
});

// Create user Model.
const Job = mongoose.model('Job', jobSchema, 'jobs');

// Export.
module.exports = Job;