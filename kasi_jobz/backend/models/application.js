// Import mongoose.
const mongoose = require('mongoose');

// Define Schema.
const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicantName: {
        type: String,
        required: true,
    },
    applicantEmail: {
        type: String,
        required: true,
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create Application Model.
const Application = mongoose.model('Application', applicationSchema, 'applications');

// Export.
module.exports = Application;