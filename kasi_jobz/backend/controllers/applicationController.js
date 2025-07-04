// applicationController - Handles application related functions

// Import application model
const Application = require('../models/application');

// createApplication function - creates a job application.
const createApplication = async (req, res) => {
    try {
        const { jobId, applicantName, applicantEmail, message } = req.body;
        if (!jobId || !applicantName || !applicantEmail || !message) {
            return res.status(400).json({ message: "All fields are required"})
        }
        // Save the application
        const newApplication = new Application(req.body)
        await newApplication.save()
        res.status(201).json({ message: 'Application successfully submitted', application: newApplication})
    } catch (error) {
        res.status(500).json({ message: "Failed to submit application", error: error.message})
    }
}

// Exports
module.exports = createApplication;