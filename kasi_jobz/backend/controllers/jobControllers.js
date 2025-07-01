// jobController - Handles job-related controller function

// Import job model
const Job = require('../models/job');

// createJob function - create and save new job.
const createJob = async (req, res) => {
    try {
        const job = new Job(req.body)
        await job.save()
        res.status(200).json({ message: "Job successfully saved", job})
    } catch (error) {
        res.status(500).json({ message: "Error tying to save job", error: error.message})
    }
};


// getJobs function - retrieve all jobs sorted by lasted job.
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error trying to retrieve jobs", error: error.message})
    }
};

// getJoById function - retrieve a job by it Id.
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job) {
            res.status(404).json({message: "Sorry job not found"})
        }
        res.status(200).json(job)
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
};

// updateJob function - update job by Id
// Use $set to update only provided field
// Return the updated document
// Run Schema validators
const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {
                new: true,
                runValidators: true
            }
        );
        if (!job) {
            return res.status(404).json({ message: "Job not found"})
        }
        res.status(200).json({ message: "Job updated successfully", "job": job})
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
};

// deleteJobById function - delete job by it Id
const deleteJobById = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            res.status(404).json({ message: "Sorry Job not found"})
        }
        res.status(200).json({ message: "Job Successfully deleted"})
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
};


module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJobById
}