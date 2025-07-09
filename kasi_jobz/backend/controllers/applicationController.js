// applicationController - Handles application related functions

// Import models
const Application = require('../models/application');
const Job = require('../models/job')

// createApplication function - creates a job application.
const createApplication = async (req, res) => {
    try {
        const { jobId, applicantName, applicantEmail, applicantId, message } = req.body;

        // Validation
        if (!jobId || !applicantName || !applicantEmail || !applicantId || !message) {
        return res.status(400).json({ message: "All fields are required" });
        }

        // Fetch the job
        const job = await Job.findById(jobId);
        if (!job) {
        return res.status(400).json({ message: "No job found" });
        }

        // Check if poster is trying to apply
        if (job.posterId.toString() === applicantId) {
        return res.status(400).json({ message: "You cannot apply to your own job!" });
        }

       // Check for duplicate
        const existingApplication = await Application.findOne({
        jobId,
        applicantEmail: applicantEmail.trim().toLowerCase()
        });
        if (existingApplication) {
        return res.status(400).json({ message: "You already applied to this job!" });
        }

        // Save application
        const newApplication = new Application({
        jobId,
        applicantId,
        applicantName,
        applicantEmail: applicantEmail.trim().toLowerCase(),
        message
        });

        await newApplication.save();

        res.status(201).json({ message: 'Application successfully submitted', application: newApplication });

    } catch (error) {
        res.status(500).json({ message: "Failed to submit application", error: error.message });
    }
}


// getApplicationsById function - retrieves applications by jobId.
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