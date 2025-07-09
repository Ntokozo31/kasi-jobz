// Import mongoose.
const mongoose = require('mongoose');

// Define Schema.
const jobSchema = new mongoose.Schema({
    posterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true},
    company: { type: String, required: true},
    location: { type: String, required: true},
    province: { type: String, required: true},
    jobType: {
        type: String,
        default: "",
    },
    salary: String,
    description: { type: String, required: true},
    experience: {
        type: String,
        default: "",
    },
    createdAt: { type: Date, default: Date.now}
});

// Create Job Model.
const Job = mongoose.model('Job', jobSchema, 'jobs');

// Export.
module.exports = Job;