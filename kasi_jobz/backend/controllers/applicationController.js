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
        const newApplication = new Application(req.body);
        await newApplication.save()
        res.status(201).json({ message: 'Application successfully submitted', application: newApplication })
    } catch (error) {
        res.status(500).json({ message: "Failed to submit application", error: error.message })
    }
}

// getApplicationsById function - retrieves an application by its ID.
const getApplicationsById = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Find applications by jobId
        const applications = await Application.find({ jobId })
        if (applications.length === 0) {
            return res.status(404).json({ message: "No application found" })
        }
        res.status(200).json(applications)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Exports
module.exports = {
    createApplication,
    getApplicationsById
}